"use client";

import { useEffect, useState } from "react";
import type ScanbotSDK from "scanbot-web-sdk/ui";

export default function Home() {
  const [scanResult, setScanResult] = useState("");
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
    const config = new ScanbotSdk.UI.Config.BarcodeScannerScreenConfiguration();
    const result = await ScanbotSdk.UI.createBarcodeScanner(config);

    if (result && result.items.length > 0) {
      setScanResult(result.items[0].barcode.text);
    }
  }

  return (
    <div>
      <p>Scanbot Next.js Example</p>
      <button onClick={startBarcodeScanner}>Scan Barcodes</button>
      <p>{scanResult}</p>
    </div>
  );
}
