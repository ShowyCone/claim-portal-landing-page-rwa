import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/token";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = (searchParams.get("code") || "GFT-EXAMPLE-0000").toUpperCase();

    // Create a short-lived signed token so QR does not expose raw code.
    const exp = Date.now() + 15 * 60 * 1000; // 15 minutes
    const token = signToken({ c: code, exp });

    // Build an absolute redeem URL for scanning with phone cameras.
    const url = new URL(req.url);
    const origin = `${url.protocol}//${url.host}`;
    const redeemUrl = `${origin}/redeem?token=${encodeURIComponent(token)}`;

    const pngBuffer = await QRCode.toBuffer(redeemUrl, {
      type: "png",
      errorCorrectionLevel: "M",
      margin: 1,
      width: 512,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    const uint8 = new Uint8Array(pngBuffer);
    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("QR generation error", err);
    return NextResponse.json(
      { error: "qr_generation_failed" },
      { status: 500 }
    );
  }
}
