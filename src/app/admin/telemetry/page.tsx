"use client";
export const dynamic = "force-dynamic";
export const runtime = "edge";
export const revalidate = 0;

import { useEffect, useMemo, useRef, useState } from "react";
import type { ScanTelemetryLog } from "@/lib/telemetryStore";

type Row = ScanTelemetryLog & { id: string };

function tsFmt(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString(undefined, { hour12: false });
}

export default function TelemetryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [connected, setConnected] = useState(false);
  const [filter, setFilter] = useState("");
  const maxRows = 500;
  const evRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let canceled = false;
    async function bootstrap() {
      try {
        const res = await fetch("/api/telemetry/log?n=100", {
          cache: "no-store",
        });
        const data = (await res.json()) as {
          ok: boolean;
          logs?: ScanTelemetryLog[];
        };
        if (data.ok && data.logs && !canceled) {
          setRows(data.logs.map((e, i) => ({ ...e, id: `${e.ts}-${i}` })));
        }
      } catch {
        // ignore
      }
    }
    bootstrap();
    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    const es = new EventSource("/api/telemetry/stream");
    evRef.current = es;
    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);
    es.onmessage = (evt) => {
      try {
        const obj = JSON.parse(evt.data) as ScanTelemetryLog;
        setRows((prev) => {
          const next = [...prev, { ...obj, id: `${obj.ts}-${prev.length}` }];
          if (next.length > maxRows) next.splice(0, next.length - maxRows);
          return next;
        });
      } catch {
        // ignore bad frames
      }
    };
    return () => {
      es.close();
      evRef.current = null;
    };
  }, []);

  const visible = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return rows;
    return rows.filter((r) =>
      [r.level, r.action, r.message, r.cause, r.hint]
        .filter(Boolean)
        .some((x) => String(x).toLowerCase().includes(f))
    );
  }, [rows, filter]);

  return (
    <main className="min-h-screen p-6 bg-[#EFEFEF]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#020664]">
            Telemetry (scan)
          </h1>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 text-sm ${
                connected ? "text-green-700" : "text-red-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              {connected ? "live" : "disconnected"}
            </span>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter (level/action/message)"
              className="px-3 py-2 rounded border"
            />
          </div>
        </header>
        <div className="overflow-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">Level</th>
                <th className="px-3 py-2 text-left">Action</th>
                <th className="px-3 py-2 text-left">Message</th>
                <th className="px-3 py-2 text-left">Cause</th>
                <th className="px-3 py-2 text-left">Hint</th>
                <th className="px-3 py-2 text-left">IP</th>
                <th className="px-3 py-2 text-left">UA</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr
                  key={r.id}
                  className="odd:bg-white even:bg-gray-50 align-top"
                >
                  <td className="px-3 py-2 whitespace-nowrap font-mono">
                    {tsFmt(r.ts)}
                  </td>
                  <td
                    className={`px-3 py-2 ${
                      r.level === "error"
                        ? "text-red-600"
                        : r.level === "warn"
                        ? "text-orange-600"
                        : "text-gray-800"
                    }`}
                  >
                    {r.level}
                  </td>
                  <td className="px-3 py-2">{r.action}</td>
                  <td className="px-3 py-2">{r.message || ""}</td>
                  <td className="px-3 py-2 text-red-700">{r.cause || ""}</td>
                  <td className="px-3 py-2 text-green-700">{r.hint || ""}</td>
                  <td className="px-3 py-2">{r.ip || ""}</td>
                  <td
                    className="px-3 py-2 max-w-[240px] truncate"
                    title={r.userAgent || ""}
                  >
                    {r.userAgent || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
