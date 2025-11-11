export function corsHeaders() {
  const origin = process.env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Idempotency-Key, X-Requested-With",
  } as Record<string, string>;
}

export function preflight() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
