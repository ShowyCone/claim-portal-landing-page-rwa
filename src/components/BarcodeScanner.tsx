"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

type RedeemResult = {
  ok: boolean;
  error?: string;
  card?: { code: string; status: string; balance: number };
};

export default function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState<string>("Idle");
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    return () => {
      controlsRef.current?.stop();
      readerRef.current = null;
    };
  }, []);

  const startScan = async () => {
    setError(null);
    setResult(null);
    setMessage("Starting camera…");
    setScanning(true);
    try {
      const codeReader = readerRef.current!;
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      const deviceId = devices?.[0]?.deviceId;
      if (!deviceId) throw new Error("No camera found");
      const video = videoRef.current!;
      await codeReader.decodeFromVideoDevice(
        deviceId,
        video,
        async (res, _err, controls) => {
          // Save controls so user can stop scanning manually
          controlsRef.current = controls;
          if (res) {
            controls.stop();
            controlsRef.current = null;
            setScanning(false);
            setMessage(`Scanned: ${res.getText()}`);
            await redeem(res.getText());
          }
        }
      );
      setMessage("Point camera at QR or barcode");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setScanning(false);
    }
  };

  const redeem = async (text: string) => {
    try {
      let r: Response;
      try {
        const u = new URL(text);
        const token = u.searchParams.get("token");
        if (token) {
          r = await fetch("/api/giftcard/redeem-by-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
        } else {
          // Fallback to raw text as code
          r = await fetch("/api/giftcard/redeem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: text }),
          });
        }
      } catch {
        // Not a valid URL, treat as code
        r = await fetch("/api/giftcard/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: text }),
        });
      }
      const data: RedeemResult = await r.json();
      setResult(data);
      if (!data.ok) setError(data.error || "redeem_failed");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-xl border p-4 bg-white/60 dark:bg-neutral-900/40">
        <div className="text-sm text-neutral-500 mb-2">Scanner</div>
        <div className="aspect-[3/4] w-full bg-black/80 rounded overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
        </div>
        <div className="mt-3 text-sm">{message}</div>
        {error && (
          <div className="mt-2 text-red-600 text-sm">Error: {error}</div>
        )}
        {result && (
          <div className="mt-2 text-sm">
            {result.ok ? (
              <div>
                Redeemed <span className="font-mono">{result.card?.code}</span>{" "}
                • status: {result.card?.status} • balance: ${" "}
                {result.card?.balance}
              </div>
            ) : (
              <div>Redeem failed: {result.error}</div>
            )}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <button
            className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
            onClick={startScan}
            disabled={scanning}
          >
            {scanning ? "Scanning…" : "Start Scan"}
          </button>
          <button
            className="px-3 py-2 rounded border"
            onClick={() => {
              controlsRef.current?.stop();
              controlsRef.current = null;
              setScanning(false);
              setMessage("Idle");
            }}
          >
            Stop
          </button>
        </div>

        <div className="mt-4">
          <div className="text-sm text-neutral-500 mb-1">
            Or enter code manually
          </div>
          <div className="flex gap-2">
            <input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="Enter code (e.g., GFT-2025-AB12)"
              className="flex-1 px-3 py-2 rounded border bg-white dark:bg-neutral-800"
            />
            <button
              className="px-3 py-2 rounded border"
              onClick={() => redeem(manual)}
            >
              Redeem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
