import bwipjs from "bwip-js";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/token";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = (searchParams.get("code") || "GFT-EXAMPLE-0000").toUpperCase();

    // Create a short-lived signed token and encode redeem URL in the barcode.
    const exp = Date.now() + 15 * 60 * 1000;
    const token = signToken({ c: code, exp });
    const url = new URL(req.url);
    const origin = `${url.protocol}//${url.host}`;
    const redeemUrl = `${origin}/redeem?token=${encodeURIComponent(token)}`;

    const png = await bwipjs.toBuffer({
      bcid: "code128", // Barcode type
      text: redeemUrl,
      // Slightly reduce scale to keep long URLs scannable
      scale: 2,
      height: 80, // mm
      includetext: true,
      textxalign: "center",
      textsize: 9,
      backgroundcolor: "FFFFFF",
      paddingwidth: 6,
      paddingheight: 6,
    });

    const uint8 = new Uint8Array(png);
    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Barcode generation error", err);
    return NextResponse.json(
      { error: "barcode_generation_failed" },
      { status: 500 }
    );
  }
}
