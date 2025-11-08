import { NextRequest, NextResponse } from "next/server";
import {
  addScanLog,
  getRecentScanLogs,
  type ScanTelemetryLog,
} from "@/lib/telemetryStore";
import { getClientIp } from "@/lib/rateLimit";
import { hintForError } from "@/lib/telemetry";
import { corsHeaders, preflight } from "@/lib/cors";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const ua = req.headers.get("user-agent");
    const referer = req.headers.get("referer");
    const requestId =
      req.headers.get("x-request-id") || req.headers.get("cf-ray") || null;
    const body = (await req
      .json()
      .catch(() => ({}))) as Partial<ScanTelemetryLog> & { type?: string };
    if (body.type !== "scan") {
      return NextResponse.json(
        { ok: false, error: "invalid_type" },
        { status: 400 }
      );
    }
    if (!body.action || !body.level) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    }
    const entry: ScanTelemetryLog = {
      type: "scan",
      ts: Date.now(),
      level: body.level,
      action: body.action as ScanTelemetryLog["action"],
      message: body.message,
      cause: body.cause,
      hint: body.hint ?? hintForError(body.cause),
      durationMs:
        typeof body.durationMs === "number" ? body.durationMs : undefined,
      context:
        body.context && typeof body.context === "object"
          ? body.context
          : undefined,
      ip,
      userAgent: ua,
      referer,
      requestId,
    };
    addScanLog(entry);
    return NextResponse.json({ ok: true }, { headers: corsHeaders() });
  } catch {
    return NextResponse.json(
      { ok: false, error: "log_failed" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const n = Math.min(
    200,
    Math.max(1, parseInt(url.searchParams.get("n") || "50", 10))
  );
  const data = getRecentScanLogs(n);
  return NextResponse.json(
    { ok: true, logs: data },
    { headers: corsHeaders() }
  );
}

export async function OPTIONS() {
  return preflight();
}
