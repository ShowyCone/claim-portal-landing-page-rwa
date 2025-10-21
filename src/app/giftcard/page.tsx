import Link from "next/link";
import Image from "next/image";
import { demoGiftCardCode, getCard } from "@/lib/giftcardStore";

export default function GiftCardPage() {
  const code = demoGiftCardCode;
  const card = getCard(code);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 gap-6">
      <h1 className="text-3xl font-bold">My Gift Card</h1>
      <div className="rounded-xl border p-4 w-full max-w-md bg-white/60 dark:bg-neutral-900/40">
        <div className="mb-3">
          <div className="text-sm text-neutral-500">Code</div>
          <div className="font-mono text-lg">{code}</div>
          <div className="text-sm mt-1">
            Status: <span className="font-medium">{card?.status}</span> •
            Balance: <span className="font-medium">${card?.balance}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm">QR Code</div>
            <Image
              src={`/api/giftcard/qr.png?code=${encodeURIComponent(code)}`}
              alt="Gift card QR code"
              width={256}
              height={256}
              unoptimized
              className="bg-white rounded"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm">Barcode (Code 128)</div>
            <Image
              src={`/api/giftcard/barcode.png?code=${encodeURIComponent(code)}`}
              alt="Gift card barcode"
              width={512}
              height={160}
              unoptimized
              className="bg-white rounded w-full max-w-sm h-auto"
            />
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/scan" className="underline font-medium">
            Go to Scanner
          </Link>
        </div>
      </div>
    </main>
  );
}
