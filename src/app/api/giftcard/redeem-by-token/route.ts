import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/token";
import { redeemCard, getCard } from "@/lib/giftcardStore";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = body?.token as string | undefined;
    if (!token)
      return NextResponse.json(
        { ok: false, error: "missing_token" },
        { status: 400 }
      );
    const v = verifyToken(token);
    if (!v.ok)
      return NextResponse.json({ ok: false, error: v.reason }, { status: 400 });

    const code = v.payload.c;
    const existing = getCard(code);
    if (!existing)
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );

    const res = redeemCard(code);
    if (!res.ok)
      return NextResponse.json(
        { ok: false, error: res.reason },
        { status: 400 }
      );
    return NextResponse.json({ ok: true, card: res.card });
  } catch (err) {
    console.error("redeem-by-token error", err);
    return NextResponse.json(
      { ok: false, error: "redeem_failed" },
      { status: 500 }
    );
  }
}
