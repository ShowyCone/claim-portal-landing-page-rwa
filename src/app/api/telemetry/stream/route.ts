export const dynamic = "force-dynamic";

import {
  getRecentScanLogs,
  subscribeScanLogs,
  type ScanTelemetryLog,
} from "@/lib/telemetryStore";
import { corsHeaders, preflight } from "@/lib/cors";

export async function GET() {
  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // Send initial replay
      const recent = getRecentScanLogs(50);
      for (const e of recent) {
        controller.enqueue(
          encoder.encode(`event: replay\n` + `data: ${JSON.stringify(e)}\n\n`)
        );
      }
      // Subscribe for live logs
      unsubscribe = subscribeScanLogs((entry: ScanTelemetryLog) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(entry)}\n\n`)
        );
      });
      // Heartbeat to keep connection alive (every 15s)
      timer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`:heartbeat\n\n`));
        } catch {
          // ignore enqueue errors
        }
      }, 15000);
    },
    cancel() {
      if (unsubscribe) unsubscribe();
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders(),
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function OPTIONS() {
  return preflight();
}
