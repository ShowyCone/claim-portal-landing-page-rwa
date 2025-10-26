"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { SparkleEffect } from "./SparkleEffect"

interface GiftCardBarcodeProps {
  amount: string
  code: string
}

export function GiftCardBarcode({ amount, code }: GiftCardBarcodeProps) {
  const [isFlipped, setIsFlipped] = useState(false)

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
              src="/images/Blue-Gift-Card-25.png"
              alt="RWA Gift Card Front"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>

          {/* Back side - Barcode version recreated from backside.png */}
          <motion.div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-white"
            style={{ backfaceVisibility: "hidden", rotateY: 180 }}
          >
            <div className="w-full h-full flex flex-col p-6 sm:p-3 justify-between text-gray-900 overflow-y-auto">
              {/* Header with logo and barcode */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Image src="/images/rwa-logo.png" alt="RWA Logo" width={24} height={24} className="w-6 h-6" />
                  <span className="font-bold text-lg">RWA</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs font-mono">5||78452135||1</div>
                </div>
              </div>

              {/* No value until activated */}
              <div className="bg-gray-700 text-white text-center py-2 px-3 rounded text-xs font-semibold mb-4">
                No value until activated at register
              </div>

              {/* Terms & Conditions */}
              <div className="mb-2 text-xs leading-tight">
                <h4 className="font-bold mb-2">Terms & Conditions</h4>
                <p className="text-gray-700 text-[8px] leading-relaxed">
                  This gift card is issued by RWA Global Inc. and may only be redeemed at www.rwa.inc/claim or other
                  authorized RWA platforms. The card has no fees and does not expire. It is non-refundable,
                  non-transferable, and cannot be reloaded, resold, or redeemed for cash or credit except where required
                  by law. Treat this card like cash; RWA Global Inc. is not responsible for lost, stolen, or damaged
                  cards, or for unauthorized use. Purchase or use of this card does not create a customer or investor
                  relationship with RWA Global Inc. The balance of this card can only be claim in our portal to receive
                  the balance worth in Crypto. or its affiliates, and may not be used for unlawful purposes or in
                  violation of the platform's Terms of Service. RWA Global Inc. reserves the right to suspend or cancel
                  cards if obtained fraudulently or used in violation of applicable laws.
                </p>
              </div>

              {/* How to Redeem */}
              <div className=" text-xs">
                <h4 className="font-bold mb-2">How to Redeem</h4>
                <ol className="text-gray-700 text-[8px] space-y-1 list-decimal list-inside">
                  <li>Visit www.rwa.inc/claim</li>
                  <li>Click on redeem a code</li>
                  <li>
                    Enter your code on the back of you RWA Global Inc Card and follow the instructions to submit your
                    code
                  </li>
                  <li>Your balance will be available in your wallet base immediately</li>
                </ol>
              </div>

              {/* Important notice */}
              <div className=" rounded text-[9px] font-bold mb-4 text-gray-900">
                YOUR ADDRESS WALLET NEED TO BE IN BASE CHAIN FOR $RWATOKEN CONFIRM IN WWW.RWA.INC FOR MORE INFORMATION
                TO AVOID LOSSES
              </div>

              {/* Scratch section */}
              <div className="flex px-6  items-center gap-3 mb-4">
                <div className="bg-gray-700 text-white w-full py-2 px-3 rounded text-center font-bold text-xs">
                  SCRATCH YOUR CODE
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/images/rwa-logo.png" alt="RWA" width={16} height={16} className="w-4 h-4" />
                  <span className="text-xs font-bold">RWA POWERED</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 mb-4">
                <Image
                  src={`/api/giftcard/barcode.png?code=${encodeURIComponent(code)}`}
                  alt="Gift card barcode"
                  width={512}
                  height={160}
                  unoptimized
                  className="bg-white rounded w-full max-w-xs h-auto"
                />
                <div className="text-xs font-mono text-center text-gray-600">1244798246312396846821547934889</div>
              </div>

              {/* Reference codes */}
              <div className="flex justify-between text-xs font-mono text-gray-600 border-t pt-2">
                <span>GCRWA28082025000001</span>
                <span>78452135</span>
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
  )
}

