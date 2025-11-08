"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { IoScanOutline } from "react-icons/io5";
import type ScanbotSDK from "scanbot-web-sdk/ui";
import { postScanEvent } from "@/lib/telemetry";

export default function ScanbotScanner({
  onOpen,
  onScan,
}: {
  onOpen?: () => void;
  onScan: (text: string) => void;
}) {
  const sdkRef = useRef<typeof ScanbotSDK | null>(null);
  const initStart = useRef<number | null>(null);

  // initialize the Scanbot Barcode SDK
  useEffect(() => {
    if (!sdkRef.current) {
      loadSDK();
    }
  });

  async function loadSDK() {
    try {
      initStart.current = performance.now();
      postScanEvent({
        level: "info",
        action: "sdk_init_start",
        message: "Initializing Scanbot SDK",
      });
      // Dynamic import to keep it client-side
      const mod = await import("scanbot-web-sdk/ui");
      sdkRef.current = mod.default;
      await sdkRef.current.initialize({
        licenseKey: "",
        enginePath: "wasm/",
      });
      postScanEvent({
        level: "info",
        action: "sdk_init_success",
        durationMs: initStart.current
          ? performance.now() - initStart.current
          : undefined,
        message: "Scanbot SDK initialized",
      });
    } catch (e) {
      postScanEvent({
        level: "error",
        action: "sdk_init_error",
        cause: e instanceof Error ? e.message : String(e),
        hint: "Check enginePath and licenseKey configuration.",
        context: {
          enginePath: "wasm/",
        },
      });
    }
  }

  async function startBarcodeScanner() {
    postScanEvent({
      level: "info",
      action: "scan_started",
    });
    onOpen?.();
    const sdk = sdkRef.current;
    if (!sdk) {
      postScanEvent({
        level: "error",
        action: "scan_error",
        cause: "SDK not initialized",
        hint: "Ensure loadSDK completed before starting a scan.",
      });
      return;
    }
    const config = new sdk.UI.Config.BarcodeScannerScreenConfiguration();
    let result;
    try {
      result = await sdk.UI.createBarcodeScanner(config);
    } catch (e) {
      postScanEvent({
        level: "error",
        action: "scan_error",
        cause: e instanceof Error ? e.message : String(e),
        hint: "Verify camera permissions and browser compatibility.",
      });
      return;
    }

    config.palette.sbColorPrimary = "#1E90FF";
    config.palette.sbColorSecondary = "#87CEEB";

    config.userGuidance.title.text = "Place the finder over the barcode";

    config.topBar.mode = "GRADIENT";

    config.actionBar.zoomButton.backgroundColor = "#1E90FF";

    if (result && result.items.length > 0) {
      const text = result.items[0].barcode.text;
      postScanEvent({
        level: "info",
        action: "scan_result",
        context: { textLength: text.length },
        message: "Barcode scanned",
      });
      onScan(text);
    } else {
      postScanEvent({
        level: "warn",
        action: "scan_error",
        cause: "No items returned",
        hint: "Ensure barcode is within finder and well-lit.",
      });
    }
  }

  return (
    <motion.button
      onClick={() => startBarcodeScanner()}
      className="px-3 py-2 rounded bg-[#0055D6] text-white flex items-center gap-2 cursor-pointer"
      aria-haspopup="dialog"
      aria-controls="barcode-scanner-modal"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

      <IoScanOutline className="w-7 h-7 sm:w-8 sm:h-8" />
      <span>Scan</span>
    </motion.button>
  );
}
