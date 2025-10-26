"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SparkleEffect } from "./SparkleEffect";

interface GiftCardQrProps {
  amount: number;
  code: string;
}

export function GiftCardQr({ amount, code }: GiftCardQrProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative" style={{ aspectRatio: "1202 / 1801" }}>
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <SparkleEffect width={400} height={600} />
        </div>

        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/40 via-blue-500/30 to-purple-600/40 blur-3xl -z-10" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-500/30 via-cyan-400/20 to-transparent blur-2xl -z-10" />
        <div className="absolute inset-0 rounded-3xl border-2 border-cyan-400/50 blur-sm" />

        <motion.div
          className="relative w-full h-full cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front side - using frontGiftcard.png */}
          <motion.div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src="/images/Blue-Gift-Card-50.png"
              alt="RWA Gift Card Front"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>

          {/* Back side - QR version */}
          <motion.div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-white"
            style={{ backfaceVisibility: "hidden", rotateY: 180 }}
          >
            <div className="w-full h-full flex flex-col p-6 sm:p-8 justify-between items-center text-gray-900">
              {/* Header */}
              <div className="w-full flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/rwa-logo.png"
                    alt="RWA Logo"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <span className="font-bold text-lg">RWA</span>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-xs">Card Value</p>
                  <p className="font-bold text-xl">${amount}</p>
                </div>
              </div>

              {/* No value until activated */}
              <div className="bg-gray-700 text-white text-center py-2 px-3 rounded text-xs font-semibold mb-4 w-full">
                No value until activated at register
              </div>

              {/* Main QR section */}
              <div className="flex flex-col items-center justify-center gap-4 flex-1">
                <h3 className="font-bold text-sm">Scan to Redeem</h3>
                <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                  <Image
                    src={`/api/giftcard/qr.png?code=${encodeURIComponent(
                      code
                    )}`}
                    alt="Gift card QR code"
                    width={256}
                    height={256}
                    unoptimized
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-gray-600 text-xs text-center font-semibold">
                  Visit https://claim-portal-landing-page-rwa.vercel.app
                </p>
              </div>

              {/* Instructions */}
              <div className="w-full text-center mb-4 text-xs">
                <h4 className="font-bold mb-2">How to Redeem</h4>
                <ol className="text-gray-700 text-[10px] space-y-1">
                  <li>1. Scan QR code with your mobile device</li>
                  <li>2. Your tokens will be redeemed automatically</li>
                </ol>
              </div>

              {/* Footer */}
              <div className="text-center border-t border-gray-300 pt-3 w-full">
                <p className="text-gray-700 text-xs font-semibold">
                  No value until activated
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  Receive $RWAINC directly to your wallet
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Flip hint */}
      <div className="text-center mt-4 text-sm text-gray-600">
        <p className="animate-pulse">Click to flip card</p>
      </div>
    </div>
  );
}
