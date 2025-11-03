"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CameraCapture from "./CameraCapture";
import { BrowserMultiFormatReader } from "@zxing/browser";

type Props = {
  onSuccess?: () => void;
};

type UiError = { message: string; code?: string } | null;

export default function CameraScanDecoder2({ onSuccess }: Props) {
  const [error, setError] = useState<UiError>(null);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<
    "idle" | "uploading" | "decoding" | "done"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadIndeterminate, setUploadIndeterminate] =
    useState<boolean>(false);

  const IN_MEMORY = process.env.NEXT_PUBLIC_DECODE_IN_MEMORY === "true";

  const prettyStatus = useMemo(() => {
    if (stage === "uploading") return "Uploading…";
    if (stage === "decoding") return "Decoding…";
    if (stage === "done") return "Completed";
    return "Idle";
  }, [stage]);

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
    setUploadProgress(0);
    setUploadIndeterminate(false);

    try {
      let imageUrl: string;
      if (IN_MEMORY) {
        setStage("decoding");
        imageUrl = URL.createObjectURL(file);
      } else {
        setStage("uploading");
        imageUrl = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/camera/upload");
          xhr.responseType = "json";
          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              const pct = Math.round((evt.loaded / evt.total) * 100);
              setUploadProgress(pct);
            } else {
              setUploadIndeterminate(true);
            }
          };
          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              const statusCode = xhr.status;
              if (statusCode >= 200 && statusCode < 300) {
                const data = xhr.response as unknown as { filePath?: string };
                if (data && data.filePath) {
                  resolve(data.filePath);
                } else {
                  reject({
                    message: "Upload succeeded but no filePath returned",
                  });
                }
              } else {
                // Try to extract structured error from API
                try {
                  const resp = xhr.response as unknown as
                    | { error?: { code?: string; message?: string } }
                    | string;
                  if (
                    resp &&
                    typeof resp === "object" &&
                    "error" in resp &&
                    resp.error
                  ) {
                    const code = resp.error.code;
                    const message =
                      resp.error.message || `Upload failed (${statusCode})`;
                    reject({ code, message });
                  } else {
                    reject({ message: `Upload failed (${statusCode})` });
                  }
                } catch {
                  reject({ message: `Upload failed (${statusCode})` });
                }
              }
            }
          };
          const fd = new FormData();
          fd.append("photo", file);
          xhr.send(fd);
        });
        setStage("decoding");
      }

      const reader = new BrowserMultiFormatReader();
      const result = await reader.decodeFromImageUrl(imageUrl);
      const text = result.getText();
      setStage("done");
      if (IN_MEMORY) URL.revokeObjectURL(imageUrl);
      redirectToRedeem(text);
    } catch (e: unknown) {
      let uiErr: UiError = null;
      if (
        e &&
        typeof e === "object" &&
        "message" in (e as Record<string, unknown>)
      ) {
        const anyE = e as { message?: string; code?: string };
        uiErr = {
          message: anyE.message || "Something went wrong",
          code: anyE.code,
        };
      } else {
        uiErr = { message: e ? String(e) : "Something went wrong" };
      }
      setError(uiErr);
      setStage("idle");
      setBusy(false);
    }
  };

  return (
    <div className="w-full mx-auto max-w-2xl">
      <div className="rounded-xl border p-4 bg-white/60 dark:bg-neutral-900/40">
        <div className="text-sm mb-2 font-semibold text-blue-900 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs">
            QR
          </span>
          <span>Scanner (Photo)</span>
        </div>
        <CameraCapture onCapture={handleCapture} />

        <AnimatePresence>
          {stage === "uploading" && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
                <span>Uploading</span>
                {!uploadIndeterminate && <span>{uploadProgress}%</span>}
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                {uploadIndeterminate ? (
                  <div
                    className="h-full w-full bg-[length:200%_100%]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(59,130,246,0.2) 0, rgba(59,130,246,0.2) 10px, rgba(59,130,246,0.35) 10px, rgba(59,130,246,0.35) 20px)",
                      animation: "bg-slide 1.2s linear infinite",
                    }}
                  />
                ) : (
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-[0_0_10px_rgba(59,130,246,0.35)] transition-[width] duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === "decoding" && (
            <motion.div
              className="mt-4 flex items-center gap-3 text-sm text-neutral-700"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <span className="inline-block w-5 h-5 rounded-full border-[3px] border-blue-600 border-t-transparent animate-spin" />
              <span>Decoding…</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-3 text-sm text-neutral-700">{prettyStatus}</div>

        {error && (
          <div className="mt-3 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
            <div className="font-medium flex items-center gap-2">
              <span>{error.message}</span>
              {error.code && (
                <span className="inline-flex items-center rounded bg-red-100 text-red-700 px-1.5 py-0.5 text-[10px] font-mono tracking-wide">
                  {error.code}
                </span>
              )}
            </div>
            <ul className="mt-2 list-disc pl-5 text-xs text-red-800/90">
              <li>Check your internet connection and try again.</li>
              <li>Ensure the image is clear, with good lighting and focus.</li>
              <li>
                If the code isn’t recognized, try retaking the photo closer and
                centered.
              </li>
            </ul>
          </div>
        )}

        {busy && !error && (
          <div className="mt-2 text-xs text-neutral-500">Please wait…</div>
        )}
      </div>
      <style jsx>{`
        @keyframes bg-slide {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
