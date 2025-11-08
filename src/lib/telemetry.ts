import {
  addScanLog,
  type ScanTelemetryLog,
  type TelemetryLevel,
} from "./telemetryStore";
import { getClientIp } from "./rateLimit";

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

export function logScanServer(
  req: Request,
  partial: Omit<ScanTelemetryLog, "type" | "ts"> & { ts?: number }
) {
  const ip = getClientIp(req);
  const ua = req.headers.get("user-agent");
  const referer = req.headers.get("referer");
  const requestId =
    req.headers.get("x-request-id") || req.headers.get("cf-ray") || null;
  addScanLog({
    type: "scan",
    ts: partial.ts ?? Date.now(),
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
  });
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
  try {
    await fetch("/api/telemetry/log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "scan", ...event }),
      cache: "no-store",
      keepalive: true,
    });
  } catch {
    // Best-effort; no throw in client
  }
}
