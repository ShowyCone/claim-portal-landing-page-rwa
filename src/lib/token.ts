import { createHmac, timingSafeEqual } from "crypto";

export type TokenPayload = {
  c: string; // gift card code (uppercase)
  exp: number; // ms epoch
};

function base64urlEncode(input: Buffer | string) {
  return Buffer.isBuffer(input)
    ? input.toString("base64url")
    : Buffer.from(input).toString("base64url");
}

function base64urlDecodeToBuffer(b64: string): Buffer {
  return Buffer.from(b64, "base64url");
}

function getSecret() {
  const s = process.env.GIFTCARD_SIGNING_SECRET || "dev-demo-secret-change-me";
  return s;
}

export function signToken(payload: TokenPayload): string {
  const json = JSON.stringify(payload);
  const p = base64urlEncode(json);
  const sig = createHmac("sha256", getSecret()).update(p).digest("base64url");
  return `${p}.${sig}`;
}

export function verifyToken(
  token: string
): { ok: true; payload: TokenPayload } | { ok: false; reason: string } {
  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false, reason: "malformed" };
  const [p, sig] = parts;
  const expected = createHmac("sha256", getSecret())
    .update(p)
    .digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b))
    return { ok: false, reason: "bad_sig" };

  try {
    const buf = base64urlDecodeToBuffer(p);
    const payload = JSON.parse(buf.toString("utf8")) as TokenPayload;
    if (typeof payload?.c !== "string" || typeof payload?.exp !== "number") {
      return { ok: false, reason: "invalid_payload" };
    }
    if (Date.now() > payload.exp) return { ok: false, reason: "expired" };
    payload.c = payload.c.toUpperCase();
    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "invalid_payload" };
  }
}
