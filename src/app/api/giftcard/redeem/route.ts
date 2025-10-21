import { NextResponse } from "next/server";
import { getCard, redeemCard } from "@/lib/giftcardStore";

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

    const res = redeemCard(code, amount);
    if (!res.ok)
      return NextResponse.json(
        { ok: false, error: res.reason },
        { status: 400 }
      );

    return NextResponse.json({ ok: true, card: res.card });
  } catch (err) {
    console.error("Redeem error", err);
    return NextResponse.json(
      { ok: false, error: "redeem_failed" },
      { status: 500 }
    );
  }
}
