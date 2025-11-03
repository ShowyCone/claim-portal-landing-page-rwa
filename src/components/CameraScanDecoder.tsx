"use client";

import { useState } from "react";
import CameraCapture from "./CameraCapture";
import { BrowserMultiFormatReader } from "@zxing/browser";

type Props = {
  onSuccess?: () => void;
};

export default function CameraScanDecoder({ onSuccess }: Props) {
  const [status, setStatus] = useState<string>("Idle");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const redirectToRedeem = (text: string) => {
    try {
      const u = new URL(text);
      const token = u.searchParams.get("token");
      if (token) {
        onSuccess?.();
        window.location.href = u.toString();
        return;
      }
      onSuccess?.();
      window.location.href = `/redeem?code=${encodeURIComponent(text)}`;
    } catch {
      onSuccess?.();
      window.location.href = `/redeem?code=${encodeURIComponent(text)}`;
    }
  };

  const handleCapture = async (file: File) => {
    setError(null);
    setBusy(true);
    setStatus("Uploading…");
    try {
      const fd = new FormData();
      fd.append("photo", file);
      const resp = await fetch("/api/camera/upload", {
        method: "POST",
        body: fd,
      });
      if (!resp.ok) throw new Error("Upload failed");
      const data = (await resp.json()) as { filePath?: string };
      if (!data.filePath) throw new Error("No filePath returned");

      setStatus("Decoding…");
      const reader = new BrowserMultiFormatReader();
      const result = await reader.decodeFromImageUrl(data.filePath);
      const text = result.getText();
      setStatus(`Scanned: ${text}`);
      redirectToRedeem(text);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setStatus("Idle");
      setBusy(false);
    }
  };

  return (
    <div className="w-full mx-auto max-w-2xl">
      <div className="rounded-xl border p-4 bg-white/60 dark:bg-neutral-900/40">
        <div className="text-sm mb-2">Scanner (Photo)</div>
        <CameraCapture onCapture={handleCapture} />
        <div className="mt-3 text-sm">{status}</div>
        {error && (
          <div className="mt-2 text-red-600 text-sm">Error: {error}</div>
        )}
        {busy && (
          <div className="mt-2 text-xs text-neutral-500">Please wait…</div>
        )}
      </div>
    </div>
  );
}
