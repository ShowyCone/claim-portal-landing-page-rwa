import Link from "next/link";
import BarcodeScanner from "@/components/BarcodeScanner";

export default function ScanPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 gap-6">
      <h1 className="text-3xl font-bold">Scan Gift Card</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        This demo scans QR or Code 128 barcodes and redeems the code.
      </p>
      <BarcodeScanner />
      <div className="text-sm">
        <Link href="/giftcard" className="underline">
          View demo gift card
        </Link>
      </div>
    </main>
  );
}
