"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { IoScanOutline } from "react-icons/io5";
import type ScanbotSDK from "scanbot-web-sdk/ui";

export default function ScanbotScanner({
  onOpen,
  onScan,
}: {
  onOpen?: () => void;
  onScan: (text: string) => void;
}) {
  let ScanbotSdk: typeof ScanbotSDK;

  // initialize the Scanbot Barcode SDK
  useEffect(() => {
    loadSDK();
  });

  async function loadSDK() {
    // Use dynamic inline imports to load the SDK, else Next will load it into the server bundle
    // and attempt to load it before the 'window' object becomes available.
    // https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading
    ScanbotSdk = (await import("scanbot-web-sdk/ui")).default;

    await ScanbotSdk.initialize({
      licenseKey: "",
      enginePath: "wasm/",
    });
  }

  async function startBarcodeScanner() {
    onOpen?.();
    const config = new ScanbotSdk.UI.Config.BarcodeScannerScreenConfiguration();
    const result = await ScanbotSdk.UI.createBarcodeScanner(config);

    config.palette.sbColorPrimary = "#1E90FF";
    config.palette.sbColorSecondary = "#87CEEB";

    config.userGuidance.title.text = "Place the finder over the barcode";

    config.topBar.mode = "GRADIENT";

    config.actionBar.zoomButton.backgroundColor = "#1E90FF";

    if (result && result.items.length > 0) {
      onScan(result.items[0].barcode.text);
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
