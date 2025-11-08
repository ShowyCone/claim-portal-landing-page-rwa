import { NextResponse } from "next/server";
import { getCard, redeemCard } from "@/lib/giftcardStore";
import {
  deriveKeyFromParts,
  getIdempotentResponse,
  setIdempotentResponse,
} from "@/lib/idempotency";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = (body?.code as string | undefined)?.toUpperCase();
    const amount = typeof body?.amount === "number" ? body.amount : undefined;
    if (!code)
      return NextResponse.json(
        { ok: false, error: "missing_code" },
        { status: 400 }
      );

    const existing = getCard(code);
    if (!existing)
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );

    // Basic rate limiting (per IP & per code) - mock/demo level
    const ip = getClientIp(req);
    const rlKeyIp = `redeem:ip:${ip}`;
    const rlKeyCode = `redeem:code:${code}`;
    const rlIp = rateLimit(rlKeyIp, 20, 60_000); // 20 requests per minute per IP
    const rlCode = rateLimit(rlKeyCode, 10, 60_000); // 10 requests per minute per code
    if (!rlIp.ok || !rlCode.ok) {
      const retry = rlIp.retryAfterMs || rlCode.retryAfterMs || 60_000;
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

    const cached = getIdempotentResponse(idempotencyKey);
    if (cached) {
      return NextResponse.json(cached as Record<string, unknown>);
    }

    const res = redeemCard(code, amount);
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
    console.error("Redeem error", err);
    return NextResponse.json(
      { ok: false, error: "redeem_failed" },
      { status: 500 }
    );
  }
}
