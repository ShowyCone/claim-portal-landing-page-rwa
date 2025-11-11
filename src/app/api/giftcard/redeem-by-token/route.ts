import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/token";
import { redeemCard, getCard } from "@/lib/giftcardStore";
import {
  deriveKeyFromParts,
  getIdempotentResponse,
  setIdempotentResponse,
} from "@/lib/idempotency";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { logScanServer, maskCode, maskToken } from "@/lib/telemetry";
import type { ScanTelemetryLog } from "@/lib/telemetryStore";

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  try {
    const body = await req.json().catch(() => ({}));
    const token = body?.token as string | undefined;
    if (!token) {
      logScanServer(req, {
        level: "warn",
        action: "redeem_invalid_request",
        message: "Missing token",
        context: { requestId },
      });
      return NextResponse.json(
        { ok: false, error: "missing_token" },
        { status: 400 }
      );
    }
    // Basic rate limiting (per IP & per token) - mock/demo level
    const ip = getClientIp(req);
    const rlKeyIp = `redeem-token:ip:${ip}`;
    const rlKeyToken = `redeem-token:${token}`;
    const rlIp = rateLimit(rlKeyIp, 20, 60_000); // 20 requests per minute per IP
    const rlTok = rateLimit(rlKeyToken, 10, 60_000); // 10 requests per minute per token
    if (!rlIp.ok || !rlTok.ok) {
      const retry = rlIp.retryAfterMs || rlTok.retryAfterMs || 60_000;
      logScanServer(req, {
        level: "warn",
        action: "redeem_rate_limited",
        message: "Rate limited redeem-by-token attempt",
        context: {
          requestId,
          retryAfterMs: retry,
          ipLimitRemaining: rlIp.remaining,
          tokenLimitRemaining: rlTok.remaining,
          tokenMasked: maskToken(token),
        },
      });
      return NextResponse.json(
        {
          ok: false,
          error: "rate_limited",
          retryAfterMs: retry,
        },
        {
          status: 429,
          headers: { "Retry-After": Math.ceil(retry / 1000).toString() },
        }
      );
    }

    // Idempotency: use provided header or derive from token
    const providedKey = req.headers.get("Idempotency-Key");
    const idempotencyKey =
      providedKey || deriveKeyFromParts("redeem-token", token);

    logScanServer(req, {
      level: "info",
      action: "redeem_start",
      message: "Redeem-by-token request received",
      context: { requestId, idempotencyKey, tokenMasked: maskToken(token) },
    });

    const cached = getIdempotentResponse(idempotencyKey);
    if (cached) {
      logScanServer(req, {
        level: "info",
        action: "redeem_idempotent",
        message: "Idempotent replay of redeem-by-token response",
        context: { requestId, idempotencyKey, tokenMasked: maskToken(token) },
      });
      return NextResponse.json(cached as Record<string, unknown>);
    }

    const v = verifyToken(token);
    if (!v.ok) {
      const payload = { ok: false, error: v.reason };
      setIdempotentResponse(idempotencyKey, payload);
      logScanServer(req, {
        level: "warn",
        action: "redeem_invalid_request",
        message: `Token verification failed: ${v.reason}`,
        context: { requestId, idempotencyKey, tokenMasked: maskToken(token) },
      });
      return NextResponse.json(payload, { status: 400 });
    }

    const code = v.payload.c;
    const existing = getCard(code);
    if (!existing) {
      logScanServer(req, {
        level: "warn",
        action: "redeem_not_found",
        message: "Gift card for token not found",
        context: { requestId, idempotencyKey, tokenMasked: maskToken(token) },
      });
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }

    const res = redeemCard(code);
    if (!res.ok) {
      const payload = { ok: false, error: res.reason };
      setIdempotentResponse(idempotencyKey, payload);
      const actionMap: Record<string, ScanTelemetryLog["action"]> = {
        not_found: "redeem_not_found",
        already_redeemed: "redeem_already_redeemed",
        invalid_amount: "redeem_invalid_amount",
        insufficient_balance: "redeem_insufficient_balance",
      } as const;
      const mapped = actionMap[(res.reason as string) || ""] || "redeem_error";
      logScanServer(req, {
        level: "warn",
        action: mapped,
        message: `Redeem-by-token failed: ${res.reason}`,
        context: {
          requestId,
          idempotencyKey,
          tokenMasked: maskToken(token),
          codeMasked: maskCode(code),
        },
      });
      return NextResponse.json(payload, { status: 400 });
    }
    const payload = {
      ok: true,
      card: res.card,
      redeemedAmount: res.redeemedAmount,
      previousBalance: res.previousBalance,
      remainingBalance: res.remainingBalance,
    };
    setIdempotentResponse(idempotencyKey, payload);
    logScanServer(req, {
      level: "info",
      action: "redeem_success",
      message: "Gift card redeemed successfully via token",
      context: {
        requestId,
        idempotencyKey,
        tokenMasked: maskToken(token),
        codeMasked: maskCode(code),
        redeemedAmount: res.redeemedAmount,
        previousBalance: res.previousBalance,
        remainingBalance: res.remainingBalance,
        fullRedemption: res.remainingBalance === 0,
      },
    });
    return NextResponse.json(payload);
  } catch (err) {
    console.error("redeem-by-token error", err);
    logScanServer(req, {
      level: "error",
      action: "redeem_error",
      message: "Unhandled redeem-by-token exception",
      cause: err instanceof Error ? err.message : String(err),
      context: { requestId },
    });
    return NextResponse.json(
      { ok: false, error: "redeem_failed" },
      { status: 500 }
    );
  }
}
