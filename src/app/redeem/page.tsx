export const dynamic = "force-dynamic";

import Link from "next/link";
import { verifyToken } from "@/lib/token";
import { getCard, redeemCard } from "@/lib/giftcardStore";

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function RedeemPage({ searchParams }: PageProps) {
  const tokenParam =
    typeof searchParams?.token === "string" ? searchParams.token : undefined;
  const codeParam =
    typeof searchParams?.code === "string"
      ? searchParams.code.toUpperCase()
      : undefined;
  let content: React.ReactNode;

  if (tokenParam) {
    const v = verifyToken(tokenParam);
    if (!v.ok) {
      let msg = "Invalid or expired token.";
      if (v.reason === "expired") msg = "This redeem link has expired.";
      content = <ErrorBox title="Cannot redeem" body={msg} />;
    } else {
      const code = v.payload.c;
      const existing = getCard(code);
      if (!existing) {
        content = (
          <ErrorBox title="Not found" body="Gift card does not exist." />
        );
      } else {
        const res = redeemCard(code);
        if (!res.ok) {
          const msg =
            res.reason === "already_redeemed"
              ? "This gift card was already redeemed."
              : "Redeem failed.";
          content = <ErrorBox title="Cannot redeem" body={msg} />;
        } else {
          content = (
            <SuccessBox
              title="Redeemed successfully"
              body="Your gift card balance is now 0."
              code={res.card!.code}
            />
          );
        }
      }
    }
  } else if (codeParam) {
    // Demo fallback: allow direct code redemption when token is unavailable
    const existing = getCard(codeParam);
    if (!existing) {
      content = <ErrorBox title="Not found" body="Gift card does not exist." />;
    } else {
      const res = redeemCard(codeParam);
      if (!res.ok) {
        const msg =
          res.reason === "already_redeemed"
            ? "This gift card was already redeemed."
            : "Redeem failed.";
        content = <ErrorBox title="Cannot redeem" body={msg} />;
      } else {
        content = (
          <SuccessBox
            title="Redeemed successfully"
            body="Your gift card balance is now 0."
            code={res.card!.code}
          />
        );
      }
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {content}
      <div className="mt-6 text-sm">
        <Link href="/giftcard" className="underline">
          View demo gift card
        </Link>
      </div>
    </main>
  );
}

function ErrorBox({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border p-6 w-full max-w-md bg-white/70 dark:bg-neutral-900/40">
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <p className="text-sm text-neutral-700 dark:text-neutral-300">{body}</p>
    </div>
  );
}

function SuccessBox({
  title,
  body,
  code,
}: {
  title: string;
  body: string;
  code: string;
}) {
  return (
    <div className="rounded-xl border p-6 w-full max-w-md bg-white/70 dark:bg-neutral-900/40">
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <p className="text-sm text-neutral-700 dark:text-neutral-300">{body}</p>
      <div className="mt-3 text-sm">
        Code: <span className="font-mono">{mask(code)}</span>
      </div>
    </div>
  );
}

function mask(code: string) {
  // Hide middle characters: keep last 4 visible, preserve hyphens
  return code.replace(/.(?=.{4})/g, (ch) => (/[-\s]/.test(ch) ? ch : "*"));
}
