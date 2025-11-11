import { type ScanTelemetryLog, type TelemetryLevel } from "./telemetryStore";

export function maskCode(value: string): string {
  return value.replace(/.(?=.{4})/g, (ch) => (/[-\s]/.test(ch) ? ch : "*"));
}

export function maskToken(value: string): string {
  if (value.length <= 8) return "***";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

export function hintForError(cause?: string): string | undefined {
  if (!cause) return undefined;
  const c = cause.toLowerCase();
  if (c.includes("permission") || c.includes("denied")) {
    return "Ask the user to allow camera permissions in the browser settings.";
  }
  if (c.includes("camera") && c.includes("not found")) {
    return "Ensure a camera device is connected and accessible.";
  }
  if (c.includes("engine") || c.includes("wasm") || c.includes("sdk")) {
    return "Verify Scanbot enginePath points to /wasm/ and assets are served.";
  }
  if (c.includes("network")) {
    return "Check network connectivity and CORS settings.";
  }
  return undefined;
}

// Resolve external telemetry ingest base URL for client/server
function resolveIngestBase(isServer: boolean): string | undefined {
  // Browser -> NEXT_PUBLIC_TELEMETRY_URL (or injected global)
  // Server  -> TELEMETRY_INGEST_URL (fallback to NEXT_PUBLIC_TELEMETRY_URL)
  const browserInjected =
    typeof window !== "undefined"
      ? (window as unknown as { __TELEMETRY_URL__?: string })
          .__TELEMETRY_URL__ || undefined
      : undefined;
  const clientBase = browserInjected || process.env.NEXT_PUBLIC_TELEMETRY_URL;
  const serverBase =
    process.env.TELEMETRY_INGEST_URL || process.env.NEXT_PUBLIC_TELEMETRY_URL;
  const base = isServer ? serverBase : clientBase;
  if (!base) return undefined;
  return String(base).replace(/\/+$/, "");
}

async function sendIngest(body: Record<string, unknown>) {
  const isServer = typeof window === "undefined";
  const base = resolveIngestBase(isServer);
  if (!base) return;
  try {
    await fetch(`${base}/api/v1/telemetry/logs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.TELEMETRY_TOKEN
          ? { "X-Telemetry-Token": process.env.TELEMETRY_TOKEN }
          : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
      keepalive: !isServer,
    });
  } catch {
    // best-effort
  }
}

function getClientIpFromRequest(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

export function logScanServer(
  req: Request,
  partial: Omit<ScanTelemetryLog, "type" | "ts"> & { ts?: number }
) {
  const ip = getClientIpFromRequest(req);
  const ua = req.headers.get("user-agent");
  const referer = req.headers.get("referer");
  const requestId =
    req.headers.get("x-request-id") || req.headers.get("cf-ray") || null;
  const payload = {
    type: "scan",
    ts: partial.ts, // let telemetry service assign if undefined
    ip,
    userAgent: ua,
    referer,
    requestId,
    level: partial.level,
    action: partial.action,
    message: partial.message,
    cause: partial.cause,
    hint: partial.hint ?? hintForError(partial.cause),
    durationMs: partial.durationMs,
    context: partial.context,
  } as Record<string, unknown>;
  void sendIngest(payload);
}

export type ClientScanEvent = {
  level: TelemetryLevel;
  action: ScanTelemetryLog["action"];
  message?: string;
  cause?: string;
  hint?: string;
  durationMs?: number;
  context?: Record<string, unknown>;
};

export async function postScanEvent(event: ClientScanEvent) {
  const payload = { type: "scan", ...event } as Record<string, unknown>;
  await sendIngest(payload);
}
