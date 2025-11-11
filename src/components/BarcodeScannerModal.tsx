"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { IoClose, IoScanOutline } from "react-icons/io5";
import { postScanEvent } from "@/lib/telemetry";
import ScanbotScanner from "./ScanbotScanner";

export default function BarcodeScannerModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [manual, setManual] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const gotoRedeemFrom = (text: string) => {
    try {
      const u = new URL(text);
      const token = u.searchParams.get("token");
      setOpen(false);
      if (token) {
        postScanEvent({
          level: "info",
          action: "redirect",
          message: "Redirecting to token URL",
          context: { tokenLength: token.length },
        });
        window.location.href = u.toString();
        return;
      }
      postScanEvent({
        level: "info",
        action: "redirect",
        message: "Redirecting with raw code",
        context: { valueLength: text.length },
      });
      window.location.href = `/redeem?code=${encodeURIComponent(text)}`;
    } catch {
      setOpen(false);
      postScanEvent({
        level: "warn",
        action: "redirect",
        cause: "invalid_url",
        message: "Input was not a URL; falling back to code",
        context: { valueLength: text.length },
      });
      window.location.href = `/redeem?code=${encodeURIComponent(text)}`;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.button
        onClick={() => {
          setOpen(true);
          postScanEvent({
            level: "info",
            action: "modal_open",
            message: "Scanner modal opened",
          });
        }}
        className="bg-gradient-to-r from-[#3EF2D0] to-[#00B894] text-2xl sm:text-3xl font-bold text-[#020664] px-8 py-4 rounded-full inline-flex items-center space-x-4 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden border border-white/20"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="barcode-scanner-modal"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

        <IoScanOutline className="w-7 h-7 sm:w-8 sm:h-8" />
        <span>Scan Gift Card</span>
      </motion.button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                setOpen(false);
                postScanEvent({
                  level: "info",
                  action: "modal_close",
                  message: "Scanner modal closed via backdrop",
                });
              }}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IoScanOutline className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Scan to Redeem
                      </h3>
                      <p className="text-sm text-gray-600">
                        Position your gift card in the camera view
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setOpen(false);
                      postScanEvent({
                        level: "info",
                        action: "modal_close",
                        message: "Scanner modal closed via button",
                      });
                    }}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label="Close"
                  >
                    <IoClose className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {/* Content with scrollbar */}
              <div
                className="flex-1 overflow-y-auto p-5"
                style={{ maxHeight: "calc(85vh - 140px)" }}
              >
                <div className="flex flex-col justify-center items-center gap-2 w-full">
                  <span>Use your camera</span>

                  {/* Scanbot SDK-based scanner */}
                  <ScanbotScanner
                    onScan={gotoRedeemFrom}
                    onOpen={() => setOpen(false)}
                  />

                  <span className="text-md text-neutral-500">Or</span>
                </div>

                {/* Manual fallback only */}
                <div className="mt-6 rounded-xl border p-4 bg-white/60">
                  <div className="text-sm text-neutral-600 mb-2">
                    Manual input
                  </div>
                  <div className="space-y-3">
                    <input
                      value={manual}
                      onChange={(e) => setManual(e.target.value)}
                      placeholder="Paste redeem URL or enter code (e.g., GFT-2025-AB12)"
                      className="w-full px-3 py-2 rounded border"
                    />
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-2 rounded bg-[#0055D6] text-white"
                        onClick={() => {
                          postScanEvent({
                            level: "info",
                            action: "manual_input",
                            context: { valueLength: manual.length },
                            message: "Manual input submit",
                          });
                          gotoRedeemFrom(manual);
                        }}
                      >
                        Go to Redeem
                      </button>
                      <button
                        className="px-3 py-2 rounded border"
                        onClick={() => {
                          setManual("");
                          postScanEvent({
                            level: "info",
                            action: "manual_input",
                            message: "Manual input cleared",
                          });
                        }}
                      >
                        Clear
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Tip: If you paste a redeem URL with a token, we’ll use it.
                      If you enter a raw code, we’ll append it as{" "}
                      <code className="mx-1">?code=...</code>.
                    </p>
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <p className="text-xs text-center text-gray-500">
                  Secure scanning powered by advanced recognition technology
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
