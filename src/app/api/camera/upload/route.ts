import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import formidable from "formidable";

export const runtime = "nodejs"; // ensures server FS access
export const dynamic = "force-dynamic";

function ensureUploadsDir() {
  const dir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export async function POST(req: NextRequest) {
  try {
    const uploadDir = ensureUploadsDir();
    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
    });

    const result = await new Promise<{ filePath: string }>(
      (resolve, reject) => {
        // formidable expects a Node.js IncomingMessage; NextRequest is compatible in node runtime
        form.parse(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          req as unknown as any,
          (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            err: any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            _fields: any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            files: any
          ) => {
            if (err) {
              reject(err);
              return;
            }
            // Some setups may provide a single file or an array
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const maybe = (files as any)?.photo as any;
            const file = Array.isArray(maybe) ? maybe[0] : maybe;
            if (!file || !file.newFilename) {
              reject(new Error("No photo uploaded"));
              return;
            }
            resolve({ filePath: `/uploads/${file.newFilename}` });
          }
        );
      }
    );

    return NextResponse.json({ success: true, filePath: result.filePath });
  } catch (e: unknown) {
    console.error("Upload failed:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
