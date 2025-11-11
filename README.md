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
- `/redeem?token=...` – Opens from the QR/barcode, validates a signed token and redeems server-side.

API endpoints:

- `GET /api/giftcard/qr.png?code=GFT-2025-AB12` – QR PNG encoding a signed redeem URL (not the raw code).
- `GET /api/giftcard/barcode.png?code=GFT-2025-AB12` – Code 128 PNG encoding the same redeem URL; slightly smaller scale for long strings.
- `POST /api/giftcard/redeem` – Body `{ code: string, amount?: number }` marks the code redeemed (or decrements balance when `amount` is provided).
- `POST /api/giftcard/redeem-by-token` – Body `{ token: string }` validates the token and redeems (used by the scanner when it reads a URL).
- `GET /api/giftcard/status?token=...` or `?code=...` – Returns `{ ok, exists, status, balance, codeMasked }` for polling UI updates.

Notes:

- This is a mock demo with an in-memory store (`src/lib/giftcardStore.ts`). Data resets on server restart.
- The seeded demo code is `GFT-2025-AB12` with a balance of 100.
- QR/barcode contain a short-lived signed token (HMAC-SHA256) that expires after 15 minutes and is validated server-side.
- Optional env var: `GIFTCARD_SIGNING_SECRET` to override the demo secret.
- For production, replace the in-memory store with a database and use short opaque IDs or JWTs with expiry/nonce, rate-limit redemptions, and log audit events.

### Scanner and image upload

The scanner flow uses a camera capture component that can either:

- Decode entirely in the browser from a captured photo (recommended for production), or
- Upload the captured photo to `/api/camera/upload` and decode from the returned URL (convenient for local/dev only).

Environment flags:

- `NEXT_PUBLIC_DECODE_IN_MEMORY=true` – Force client-only, in-memory decoding using `URL.createObjectURL(file)`. This avoids server filesystem writes and is production-safe, including on serverless hosts.
- If you prefer the upload route in development, leave this unset and the client will POST to `/api/camera/upload` using XHR with progress.

Upload API notes (dev-only):

- The upload handler saves files to `public/uploads`. Many serverless platforms provide read-only filesystems or ephemeral storage, which can cause ENOENT or missing-file errors after cold starts or across instances. For production, keep `NEXT_PUBLIC_DECODE_IN_MEMORY=true` or switch storage to a durable object store (S3, GCS, Azure Blob) and serve signed URLs.
- The API returns structured errors: `{ error: { code, message }, debug? }`. The scanner UI renders `message` and `code` to help users troubleshoot.
