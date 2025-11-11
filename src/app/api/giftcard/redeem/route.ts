import { NextResponse } from "next/server";
import { getCard, redeemCard } from "@/lib/giftcardStore";
import {
  deriveKeyFromParts,
  getIdempotentResponse,
  setIdempotentResponse,
} from "@/lib/idempotency";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { logScanServer, maskCode } from "@/lib/telemetry";
import type { ScanTelemetryLog } from "@/lib/telemetryStore";

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  try {
    const body = await req.json().catch(() => ({}));
    const code = (body?.code as string | undefined)?.toUpperCase();
    const amount = typeof body?.amount === "number" ? body.amount : undefined;
    if (!code) {
      logScanServer(req, {
        level: "warn",
        action: "redeem_invalid_request",
        message: "Missing gift card code",
        context: { requestId },
      });
      return NextResponse.json(
        { ok: false, error: "missing_code" },
        { status: 400 }
      );
    }

    const existing = getCard(code);
    if (!existing) {
      logScanServer(req, {
        level: "warn",
        action: "redeem_not_found",
        message: "Gift card code not found",
        context: { codeMasked: maskCode(code), requestId },
      });
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }

    // Basic rate limiting (per IP & per code) - mock/demo level
    const ip = getClientIp(req);
    const rlKeyIp = `redeem:ip:${ip}`;
    const rlKeyCode = `redeem:code:${code}`;
    const rlIp = rateLimit(rlKeyIp, 20, 60_000); // 20 requests per minute per IP
    const rlCode = rateLimit(rlKeyCode, 10, 60_000); // 10 requests per minute per code
    if (!rlIp.ok || !rlCode.ok) {
      const retry = rlIp.retryAfterMs || rlCode.retryAfterMs || 60_000;
      logScanServer(req, {
        level: "warn",
        action: "redeem_rate_limited",
        message: "Rate limited redeem attempt",
        context: {
          codeMasked: maskCode(code),
          requestId,
          retryAfterMs: retry,
          ipLimitRemaining: rlIp.remaining,
          codeLimitRemaining: rlCode.remaining,
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

    // Idempotency: use provided header or derive a deterministic key from the payload
    const providedKey = req.headers.get("Idempotency-Key");
    const idempotencyKey =
      providedKey || deriveKeyFromParts("redeem-code", code, amount ?? "full");

    logScanServer(req, {
      level: "info",
      action: "redeem_start",
      message: "Redeem request received",
      context: {
        codeMasked: maskCode(code),
        requestId,
        idempotencyKey,
        amountRequested: amount ?? null,
      },
    });

    const cached = getIdempotentResponse(idempotencyKey);
    if (cached) {
      logScanServer(req, {
        level: "info",
        action: "redeem_idempotent",
        message: "Idempotent replay of redeem response",
        context: { codeMasked: maskCode(code), requestId, idempotencyKey },
      });
      return NextResponse.json(cached as Record<string, unknown>);
    }

    const res = redeemCard(code, amount);
    if (!res.ok) {
      const payload = { ok: false, error: res.reason };
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
        message: `Redeem failed: ${res.reason}`,
        context: {
          codeMasked: maskCode(code),
          requestId,
          idempotencyKey,
          amountRequested: amount ?? null,
        },
      });
      setIdempotentResponse(idempotencyKey, payload);
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
      message: "Gift card redeemed successfully",
      context: {
        codeMasked: maskCode(code),
        requestId,
        idempotencyKey,
        amountRequested: amount ?? null,
        redeemedAmount: res.redeemedAmount,
        previousBalance: res.previousBalance,
        remainingBalance: res.remainingBalance,
        fullRedemption: res.remainingBalance === 0,
      },
    });
    return NextResponse.json(payload);
  } catch (err) {
    console.error("Redeem error", err);
    logScanServer(req, {
      level: "error",
      action: "redeem_error",
      message: "Unhandled redeem route exception",
      cause: err instanceof Error ? err.message : String(err),
      context: { requestId },
    });
    return NextResponse.json(
      { ok: false, error: "redeem_failed" },
      { status: 500 }
    );
  }
}
