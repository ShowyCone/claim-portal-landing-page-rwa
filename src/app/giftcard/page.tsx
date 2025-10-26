import { GiftCardBarcode } from "@/components/GiftCard/GiftCardBarcode"
import { GiftCardQr } from "@/components/GiftCard/GiftCardQr"
import { demoGiftCardCode, getCard } from "@/lib/giftcardStore";
import Link from "next/link";

export default function GiftCardPage() {
  const demoCode = "GCRWA28082025000001"
  const demoAmount = "50"
  const code = demoGiftCardCode;
  const card = getCard(code);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
<div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* This main container uses justify-between to space out the two main groups */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* 1. Header Text (Left Side) */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Only Demo Purposes</h1>
              <p className="text-sm text-gray-600 mt-1">
                This is a mockup demonstration of the gift card redemption system
              </p>
            </div>

              <Link 
                href="/scan" 
                className="bg-[#0055D6] text-white px-4 py-2 rounded-full inline-flex sm:items-center space-x-1.5 font-medium hover:shadow-lg transition-shadow duration-300 text-xs"
              > 
                Go to Scanner Demo
              </Link>
              {/*
              <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-900 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                Demo Mode
              </div>
              */}

          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Introduction section */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">Redeem Your $RWAINC Gift Card</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Click on any card to flip and reveal the redemption code. Choose your preferred redemption method.
          </p>
        </div>

        {/* Gift cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12 max-w-4xl mx-auto">
          {/* Barcode card */}
          <div className="flex flex-col items-center">
            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold text-blue-900 text-center mb-2">Barcode Redemption</h3>
              <p className="text-sm text-gray-600 text-center">Scratch and reveal your code</p>
            </div>
            <GiftCardBarcode amount={demoAmount} code={code} />
            <div className=" text-sm text-gray-400">Demo Gift Card Code: {code}</div>
          </div>

          {/* QR code card */}
          <div className="flex flex-col items-center">
            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold text-blue-900 text-center mb-2">QR Code Redemption</h3>
              <p className="text-sm text-gray-600 text-center">Scan with your mobile device</p>
            </div>
            <GiftCardQr amount={card?.balance} code={code} />
            <div className=" text-sm text-gray-400">Demo Gift Card Code: {code}</div>
          </div>
        </div>

        {/* Instructions section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 sm:p-12 border border-blue-100">
          <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6">How to Redeem</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-400 text-blue-900 font-bold">
                  1
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Visit Claim Portal</h4>
                <p className="text-sm text-gray-600">Go to www.rwa.inc/claim</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-400 text-blue-900 font-bold">
                  2
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Enter Your Code</h4>
                <p className="text-sm text-gray-600">Scan QR or enter barcode</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-400 text-blue-900 font-bold">
                  3
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Receive Tokens</h4>
                <p className="text-sm text-gray-600">Get $RWAINC in your wallet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important notice */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6 sm:p-8">
          <h4 className="font-semibold text-amber-900 mb-2">Important Notice</h4>
          <ul className="text-sm text-amber-800 space-y-2">
            <li>• This is a demonstration of the gift card redemption system</li>
            <li>• Your wallet address must be on Base Chain for $RWAINC tokens</li>
            <li>• No fees or taxes - tokens go directly to your wallet</li>
            <li>• For support, visit www.rwa.inc or contact support@rwa.inc</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>© 2025 RWA Global Inc. All rights reserved.</p>
            <p className="mt-2">
              <a href="#" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Terms & Conditions
              </a>{" "}
              •{" "}
              <a href="#" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

