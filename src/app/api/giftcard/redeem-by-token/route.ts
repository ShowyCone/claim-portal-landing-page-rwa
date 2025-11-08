import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/token";
import { redeemCard, getCard } from "@/lib/giftcardStore";
import {
  deriveKeyFromParts,
  getIdempotentResponse,
  setIdempotentResponse,
} from "@/lib/idempotency";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = body?.token as string | undefined;
    if (!token)
      return NextResponse.json(
        { ok: false, error: "missing_token" },
        { status: 400 }
      );
    // Basic rate limiting (per IP & per token) - mock/demo level
    const ip = getClientIp(req);
    const rlKeyIp = `redeem-token:ip:${ip}`;
    const rlKeyToken = `redeem-token:${token}`;
    const rlIp = rateLimit(rlKeyIp, 20, 60_000); // 20 requests per minute per IP
    const rlTok = rateLimit(rlKeyToken, 10, 60_000); // 10 requests per minute per token
    if (!rlIp.ok || !rlTok.ok) {
      const retry = rlIp.retryAfterMs || rlTok.retryAfterMs || 60_000;
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

    const cached = getIdempotentResponse(idempotencyKey);
    if (cached) {
      return NextResponse.json(cached as Record<string, unknown>);
    }

    const v = verifyToken(token);
    if (!v.ok) {
      const payload = { ok: false, error: v.reason };
      setIdempotentResponse(idempotencyKey, payload);
      return NextResponse.json(payload, { status: 400 });
    }

    const code = v.payload.c;
    const existing = getCard(code);
    if (!existing)
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );

    const res = redeemCard(code);
    if (!res.ok) {
      const payload = { ok: false, error: res.reason };
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
    return NextResponse.json(payload);
  } catch (err) {
    console.error("redeem-by-token error", err);
    return NextResponse.json(
      { ok: false, error: "redeem_failed" },
      { status: 500 }
    );
  }
}
