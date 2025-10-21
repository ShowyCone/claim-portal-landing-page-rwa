import bwipjs from "bwip-js";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code") || "GFT-EXAMPLE-0000";

    const png = await bwipjs.toBuffer({
      bcid: "code128", // Barcode type
      text: code,
      scale: 3,
      height: 12, // millimeters
      includetext: true,
      textxalign: "center",
      textsize: 10,
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
