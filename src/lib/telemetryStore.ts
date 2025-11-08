export type TelemetryLevel = "info" | "warn" | "error";

export type ScanTelemetryLog = {
  type: "scan";
  level: TelemetryLevel;
  action:
    | "modal_open"
    | "modal_close"
    | "sdk_init_start"
    | "sdk_init_success"
    | "sdk_init_error"
    | "scan_started"
    | "scan_result"
    | "scan_error"
    | "manual_input"
    | "redirect"
    | "upload_start"
    | "upload_success"
    | "upload_error"
    | "zxing_start"
    | "zxing_result"
    | "zxing_error";
  message?: string;
  cause?: string;
  hint?: string;
  durationMs?: number;
  context?: Record<string, unknown>;
  // Enrichment
  ip?: string;
  userAgent?: string | null;
  referer?: string | null;
  requestId?: string | null;
  ts: number; // epoch ms
};

const RING_SIZE = 1000;
const ring: ScanTelemetryLog[] = [];
type ScanListener = (entry: ScanTelemetryLog) => void;
const listeners = new Set<ScanListener>();

export function addScanLog(entry: ScanTelemetryLog) {
  if (ring.length >= RING_SIZE) {
    ring.shift();
  }
  ring.push(entry);
  // Print structured JSON for production log shippers (intentionally using console)
  console.log(JSON.stringify({ event: entry.type, ...entry }));
  // Notify listeners for live streaming
  for (const l of listeners) {
    try {
      l(entry);
    } catch {
      // ignore listener errors
    }
  }
}

export function getRecentScanLogs(limit = 200): ScanTelemetryLog[] {
  const n = Math.min(Math.max(limit, 1), 1000);
  return ring.slice(Math.max(0, ring.length - n));
}

export function subscribeScanLogs(listener: ScanListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
