// Simple in-memory idempotency registry. For production, back this with a durable store (e.g., Redis/KV).

type StoredResponse = {
  at: number;
  response: unknown;
};

const TTL_MS = 5 * 60 * 1000; // 5 minutes
const registry = new Map<string, StoredResponse>();

function purgeExpired() {
  const now = Date.now();
  for (const [key, entry] of registry.entries()) {
    if (now - entry.at > TTL_MS) {
      registry.delete(key);
    }
  }
}

export function getIdempotentResponse(
  key: string | undefined | null
): unknown | undefined {
  if (!key) return undefined;
  purgeExpired();
  const entry = registry.get(key);
  return entry?.response;
}

export function setIdempotentResponse(
  key: string | undefined | null,
  response: unknown
): void {
  if (!key) return;
  purgeExpired();
  registry.set(key, { at: Date.now(), response });
}

export function deriveKeyFromParts(
  ...parts: Array<string | number | undefined>
): string {
  return parts
    .filter((p) => p !== undefined && p !== null)
    .map((p) => String(p))
    .join(":");
}
