"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
// These types come from @zxing/library (transitive dep of @zxing/browser)
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import CameraCapture from "./CameraCapture";

type UiError = { code: string; message: string };

const decodeInMemory =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_DECODE_IN_MEMORY === "true") ||
  (typeof process !== "undefined" &&
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_DECODE_IN_MEMORY !== "false");

function isUrlWithToken(s: string) {
  try {
    const u = new URL(s, window.location.origin);
    return !!u.searchParams.get("token");
  } catch {
    return false;
  }
}

function redirectToRedeem(text: string) {
  try {
    const u = new URL(text, window.location.origin);
    if (u.searchParams.get("token")) {
      window.location.href = u.pathname + u.search + u.hash;
      return;
    }
  } catch {
    // not a URL; fall through
  }
  const code = text.trim();
  if (code) {
    window.location.href = `/redeem?code=${encodeURIComponent(code)}`;
  }
}

function formatBackendError(bodyText: string, status: number): UiError {
  try {
    const json = JSON.parse(bodyText);
    if (
      json &&
      typeof json === "object" &&
      json.error &&
      typeof json.error === "object"
    ) {
      const code = String(json.error.code ?? "UPLOAD_FAILED");
      const message = String(json.error.message ?? `Upload failed (${status})`);
      return { code, message };
    }
  } catch {
    // fallthrough
  }
  return {
    code: status === 413 ? "FILE_TOO_LARGE" : "UPLOAD_FAILED",
    message:
      status === 413
        ? "The selected photo is too large."
        : `Upload failed (${status})`,
  };
}

export default function CameraScanDecoder2({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<
    "idle" | "uploading" | "decoding" | "error"
  >("idle");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<UiError | null>(null);
  const simTimerRef = useRef<number | null>(null);

  const reader = useMemo(() => {
    // Add hints to improve detection
    const hints = new Map();
    hints.set(DecodeHintType.TRY_HARDER, true);
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.CODE_128,
    ]);
    return new BrowserMultiFormatReader(hints);
  }, []);

  const stopSim = () => {
    if (simTimerRef.current) {
      window.clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }
  };

  const simulateProgress = (start = 0, end = 100, durationMs = 1200) => {
    setProgress(start);
    const steps = Math.max(8, Math.floor(durationMs / 100));
    const delta = (end - start) / steps;
    let current = start;
    stopSim();
    simTimerRef.current = window.setInterval(() => {
      current = Math.min(end, current + delta);
      setProgress(current);
      if (current >= end) {
        stopSim();
      }
    }, Math.max(60, Math.floor(durationMs / steps)));
  };

  const handleError = (uiErr: UiError) => {
    stopSim();
    setStatus("error");
    setError(uiErr);
  };

  const handleCapture = useCallback(
    async (file: File) => {
      setError(null);
      setProgress(null);

      if (decodeInMemory) {
        // In-memory: show decoding animation
        setStatus("decoding");
        simulateProgress(10, 85, 900);

        const blobUrl = URL.createObjectURL(file);
        try {
          const result = await reader.decodeFromImageUrl(blobUrl);
          simulateProgress(85, 100, 300);
          // Close modal before redirect
          onSuccess?.();
          redirectToRedeem(result.getText());
        } catch (e) {
          handleError({
            code: "DECODE_NOT_FOUND",
            message:
              "No code detected. Ensure the code fills the frame, is well lit, and in focus. Try moving closer and holding steady.",
          });
        } finally {
          // Only revoke after decode completes/throws
          URL.revokeObjectURL(blobUrl);
        }
        return;
      }

      // Upload mode with real XHR progress
      setStatus("uploading");
      setProgress(0);

      const form = new FormData();
      form.append("photo", file, file.name);

      await new Promise<void>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/camera/upload");

        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            const pct = Math.max(
              0,
              Math.min(100, (evt.loaded / evt.total) * 100)
            );
            setProgress(pct);
          } else {
            // Indeterminate style: keep a gentle animation by nudging progress
            setProgress((prev) => {
              const next =
                typeof prev === "number" ? Math.min(95, prev + 3) : 10;
              return next;
            });
          }
        };

        xhr.onerror = () => {
          handleError({
            code: "NETWORK_ERROR",
            message:
              "Network error during upload. Check your connection and try again.",
          });
          resolve();
        };
        xhr.onabort = () => {
          handleError({
            code: "UPLOAD_ABORTED",
            message: "Upload was cancelled. Please try again.",
          });
          resolve();
        };
        xhr.timeout = 60_000;
        xhr.ontimeout = () => {
          handleError({
            code: "UPLOAD_TIMEOUT",
            message:
              "Upload timed out. Please try again on a stable connection.",
          });
          resolve();
        };

        xhr.onload = async () => {
          if (xhr.status < 200 || xhr.status >= 300) {
            handleError(formatBackendError(xhr.responseText || "", xhr.status));
            return resolve();
          }

          try {
            const data = JSON.parse(xhr.responseText) as unknown;
            const filePath =
              data && typeof data === "object" && "filePath" in data
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (data as any).filePath
                : null;

            if (!filePath || typeof filePath !== "string") {
              handleError({
                code: "BAD_RESPONSE",
                message:
                  "Server returned an unexpected response. Please try again.",
              });
              return resolve();
            }

            setStatus("decoding");
            setProgress(null); // switch to spinner for decoding

            try {
              const result = await reader.decodeFromImageUrl(filePath);
              onSuccess?.();
              redirectToRedeem(result.getText());
            } catch {
              handleError({
                code: "DECODE_NOT_FOUND",
                message:
                  "Uploaded image didn’t contain a readable code. Try retaking the photo closer, flatter, and with better lighting.",
              });
            }
          } catch {
            handleError({
              code: "BAD_RESPONSE",
              message: "Could not parse server response. Please try again.",
            });
          } finally {
            resolve();
          }
        };

        xhr.send(form);
      });
    },
    [onSuccess, reader]
  );

  return (
    <div className="space-y-4">
      <CameraCapture onCapture={handleCapture} />

      {status === "uploading" && (
        <div className="rounded-md border border-gray-200 p-3">
          <div className="mb-2 text-sm text-gray-600">Uploading photo…</div>
          <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
            {typeof progress === "number" ? (
              <div
                className="h-full rounded bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 transition-[width] duration-150 ease-out"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            ) : (
              <div className="h-full w-1/3 animate-[shimmer_1.2s_infinite] rounded bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />
            )}
          </div>
          <style jsx>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-120%);
              }
              100% {
                transform: translateX(320%);
              }
            }
          `}</style>
        </div>
      )}

      {status === "decoding" && (
        <div className="flex items-center gap-3 rounded-md border border-gray-200 p-3">
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-500" />
          <div className="text-sm text-gray-700">Decoding…</div>
        </div>
      )}

      {status === "error" && error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <div className="text-sm font-medium text-red-800">
            {error.message}
          </div>
          <div className="mt-1 text-xs text-red-700">
            Error code: {error.code}
          </div>
          <div className="mt-2 text-xs text-red-700">
            Tips: Make sure the code fills at least 40% of the frame, avoid
            glare, and hold steady. For 1D barcodes, align the bars
            horizontally.
          </div>
        </div>
      )}
    </div>
  );
}
