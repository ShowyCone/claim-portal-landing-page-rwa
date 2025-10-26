"use client";

import { useEffect, useState } from "react";
import { GiftCardBarcode } from "./GiftCardBarcode";

export function GiftCardBarcodeModal({ code }: { code: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={() => setOpen(true)}
        className="bg-[#0055D6] text-white px-4 py-2 rounded-full inline-flex items-center space-x-1.5 font-medium hover:shadow-lg transition-shadow duration-300 text-sm"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="giftcard-barcode-modal"
      >
        Redeem
      </button>

      {open && (
        <div
          id="giftcard-barcode-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Modal content */}
          <div className="relative z-10 w-full max-w-lg mx-4">
            <div className="rounded-2xl bg-white shadow-xl border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-blue-900">
                  Scan to Redeem
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full w-8 h-8 inline-flex items-center justify-center border hover:bg-gray-50"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <GiftCardBarcode code={code} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
