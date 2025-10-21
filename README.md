This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Gift card demo (QR/barcode + scanner)

This repo includes a minimal gift card demo with QR/Code128 generation and a browser-based scanner.

Pages:

- `/giftcard` – Shows a demo code with a QR and Code 128 barcode.
- `/scan` – Uses the device camera to scan QR or Code128 and calls the redeem API.

API endpoints:

- `GET /api/giftcard/qr.png?code=GFT-2025-AB12` – QR PNG encoding the code string.
- `GET /api/giftcard/barcode.png?code=GFT-2025-AB12` – Code 128 PNG of the code.
- `POST /api/giftcard/redeem` – Body `{ code: string, amount?: number }` marks the code redeemed (or decrements balance when `amount` is provided).

Notes:

- This is a mock demo with an in-memory store (`src/lib/giftcardStore.ts`). Data resets on server restart.
- The seeded demo code is `GFT-2025-AB12` with a balance of 100.
- For production, replace the in-memory store with a database and use opaque/signed tokens in QR instead of raw codes.
