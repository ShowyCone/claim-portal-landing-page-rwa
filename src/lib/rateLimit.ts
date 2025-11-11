// Simple in-memory sliding window rate limiter suitable for mock/demo usage.
// For production, replace with a distributed store (Redis/Memcached/KV) to work across instances.

type WindowEntry = {
  ts: number;
};

const windows = new Map<string, WindowEntry[]>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  limit: number;
  retryAfterMs?: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  const arr = windows.get(key) ?? [];
  // prune old entries
  const fresh = arr.filter((e) => e.ts > cutoff);

  if (fresh.length >= limit) {
    const oldest = fresh[0]?.ts ?? now;
    const retryAfterMs = Math.max(0, oldest + windowMs - now);
    windows.set(key, fresh);
    return { ok: false, remaining: 0, limit, retryAfterMs };
  }

  fresh.push({ ts: now });
  windows.set(key, fresh);
  return { ok: true, remaining: Math.max(0, limit - fresh.length), limit };
}

export function getClientIp(req: Request): string {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) {
    // The first IP in the list is the original client IP
    const first = xfwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  // As a last resort
  return "unknown";
}
