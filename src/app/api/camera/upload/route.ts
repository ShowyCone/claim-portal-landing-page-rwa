import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import formidable from "formidable";

export const runtime = "nodejs"; // ensures server FS access
export const dynamic = "force-dynamic";

class HttpError extends Error {
  status: number;
  code: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(status: number, code: string, message: string, details?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function makeErrorResponse(err: unknown) {
  let status = 500;
  let code = "INTERNAL_ERROR";
  let message = "Upload failed";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = err as any;

  if (e instanceof HttpError) {
    status = e.status;
    code = e.code;
    message = e.message;
  } else if (e && typeof e === "object") {
    const rawCode = e.code || e.type || e.errno;
    const msg = typeof e.message === "string" ? e.message : String(e);
    message = msg || message;
    // Map some common cases
    if (/maxfilesize|file too large|exceeds/i.test(msg)) {
      status = 413;
      code = "FILE_TOO_LARGE";
    } else if (/no\s*photo\s*uploaded/i.test(msg)) {
      status = 400;
      code = "NO_FILE";
    } else if (/unsupported\s*file\s*type/i.test(msg)) {
      status = 415;
      code = "UNSUPPORTED_TYPE";
    } else if (typeof rawCode === "string" && /^E[A-Z]+$/.test(rawCode)) {
      // Node FS style codes like ENOENT, EACCES
      status = 500;
      code = rawCode;
    }
  }

  const body: Record<string, unknown> = {
    error: { code, message },
  };
  if (process.env.NODE_ENV !== "production") {
    body.debug = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stack: (e as any)?.stack,
      // Provide compact raw info in dev only
      raw:
        e && typeof e === "object"
          ? {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code: (e as any)?.code,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              type: (e as any)?.type,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              errno: (e as any)?.errno,
            }
          : undefined,
    };
  }

  return NextResponse.json(body, { status });
}

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
      allowEmptyFiles: false,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filter: (part: any) => {
        const type = (part?.mimetype as string | undefined) || "";
        // Accept common image types only
        const ok = /^image\/(png|jpe?g|webp|gif|bmp|svg\+xml)$/i.test(type);
        return ok;
      },
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
              reject(new HttpError(400, "NO_FILE", "No photo uploaded"));
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
    return makeErrorResponse(e);
  }
}
