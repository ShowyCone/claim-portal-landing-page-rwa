import { NextResponse } from "next/server";
import { getCard } from "@/lib/giftcardStore";
import { verifyToken } from "@/lib/token";

function mask(code: string) {
  return code.replace(/.(?=.{4})/g, (ch) => (/[-\s]/.test(ch) ? ch : "*"));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || undefined;
    const codeParam = searchParams.get("code") || undefined;

    let code: string | undefined;
    if (token) {
      const v = verifyToken(token);
      if (!v.ok)
        return NextResponse.json(
          { ok: false, error: v.reason },
          { status: 400 }
        );
      code = v.payload.c;
    } else if (codeParam) {
      code = codeParam.toUpperCase();
    } else {
      return NextResponse.json(
        { ok: false, error: "missing_code_or_token" },
        { status: 400 }
      );
    }

    const card = getCard(code);
    if (!card) return NextResponse.json({ ok: true, exists: false });

    return NextResponse.json(
      {
        ok: true,
        exists: true,
        codeMasked: mask(card.code),
        status: card.status,
        balance: card.balance,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("status error", err);
    return NextResponse.json(
      { ok: false, error: "status_failed" },
      { status: 500 }
    );
  }
}
