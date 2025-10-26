"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { FaCamera } from "react-icons/fa";
import { StopCircle } from "lucide-react";

export default function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState<string>("Idle");
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
            const text = res.getText();
            setMessage(`Scanned: ${text}`);
            redirectToRedeem(text);
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

  const redirectToRedeem = (text: string) => {
    try {
      const u = new URL(text);
      const token = u.searchParams.get("token");
      if (token) {
        window.location.href = u.toString();
        return;
      }
      // URL without token, fallback to code param
      window.location.href = `/redeem?code=${encodeURIComponent(text)}`;
    } catch {
      // Not a URL -> treat as raw code
      window.location.href = `/redeem?code=${encodeURIComponent(text)}`;
    }
  };

  return (
    <div className="w-full mx-auto max-w-2xl">
      {/* Scanner */}
      <div className="p-4">
        <p className="text-sm text-neutral-500">
          Press start scan to capture the code on your camera
        </p>
        <div className="aspect-[3/4] max-h-[400px] w-full bg-black/80 rounded overflow-hidden flex items-center justify-center">
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
        <div className="mt-3 flex w-full items-center justify-center gap-2">
          <button
            className="px-3 py-2 rounded-xl bg-[#0055D6] flex items-center gap-2 text-white disabled:opacity-50 cursor-pointer"
            onClick={startScan}
            disabled={scanning}
          >
            <FaCamera /> {scanning ? "Scanning…" : "Start Scan"}
          </button>
          <button
            className="px-3 py-2 border flex items-center gap-2 border-blue-900 text-blue-900 rounded-xl cursor-pointer"
            onClick={() => {
              controlsRef.current?.stop();
              controlsRef.current = null;
              setScanning(false);
              setMessage("Idle");
            }}
          >
            <StopCircle /> Stop
          </button>
        </div>

        <div className="text-sm text-center text-neutral-500 mt-4 mb-2">
          Manual input
        </div>
        <div className="space-y-3">
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="Paste redeem URL or enter code (e.g., GFT-2025-AB12)"
            className="w-full px-3 py-2 rounded border bg-white border-blue-900 text-blue-900 cursor-pointer"
          />
          <div className="flex gap-2">
            <button
              className="px-3 py-2 rounded-xl bg-[#0055D6] text-white cursor-pointer"
              onClick={() => redirectToRedeem(manual)}
            >
              Go to Redeem
            </button>
            <button
              className="px-3 py-2 border-blue-900 text-blue-900 rounded-xl border cursor-pointer"
              onClick={() => setManual("")}
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-neutral-500">
            Tip: If you paste a redeem URL with a token, we’ll use it. If you
            enter a raw code, we’ll append it as
            <code className="mx-1">?code=...</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
