export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";

type PageProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

type ApiRedeemResponse = {
  ok: boolean;
  error?: string;
  card?: { code: string };
  redeemedAmount?: number;
  previousBalance?: number;
  remainingBalance?: number;
};

export default async function RedeemPage({ searchParams }: PageProps) {
  const tokenParam =
    typeof searchParams?.token === "string" ? searchParams.token : undefined;
  const codeParam =
    typeof searchParams?.code === "string"
      ? searchParams.code.toUpperCase()
      : undefined;
  let content: React.ReactNode;
  let isError = false;

  if (tokenParam || codeParam) {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    try {
      if (tokenParam) {
        const idemKey = `redeem-token:${tokenParam}`;
        const resp = await fetch(`${origin}/api/giftcard/redeem-by-token`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "Idempotency-Key": idemKey,
          },
          body: JSON.stringify({ token: tokenParam }),
          cache: "no-store",
        });
        const data = (await resp.json()) as unknown as ApiRedeemResponse;
        if (!resp.ok || !data?.ok) {
          const reason = data?.error as string | undefined;
          const msg =
            reason === "expired"
              ? "This redeem link has expired."
              : reason === "already_redeemed"
              ? "This gift card was already redeemed."
              : reason === "not_found"
              ? "Gift card does not exist."
              : "Redeem failed.";
          isError = true;
          content = <ErrorBox title="Cannot redeem" body={msg} />;
        } else {
          content = (
            <SuccessBox
              title="Redeemed successfully"
              body={`Redeemed ${formatAmount(
                data.redeemedAmount
              )}. Remaining balance: ${formatAmount(data.remainingBalance)}.`}
              code={data.card?.code ?? "UNKNOWN"}
            />
          );
        }
      } else if (codeParam) {
        // Mockup: redeem a fixed amount of 100
        const amount = 100;
        const idemKey = `redeem-code:${codeParam}:${amount}`;
        const resp = await fetch(`${origin}/api/giftcard/redeem`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "Idempotency-Key": idemKey,
          },
          body: JSON.stringify({ code: codeParam, amount }),
          cache: "no-store",
        });
        const data = (await resp.json()) as unknown as ApiRedeemResponse;
        if (!resp.ok || !data?.ok) {
          const reason = data?.error as string | undefined;
          const msg =
            reason === "already_redeemed"
              ? "This gift card was already redeemed."
              : reason === "not_found"
              ? "Gift card does not exist."
              : reason === "insufficient_balance"
              ? "Insufficient balance to redeem 100."
              : reason === "invalid_amount"
              ? "Invalid amount."
              : "Redeem failed.";
          isError = true;
          content = <ErrorBox title="Cannot redeem" body={msg} />;
        } else {
          content = (
            <SuccessBox
              title="Redeemed successfully"
              body={`Redeemed ${formatAmount(
                data.redeemedAmount
              )}. Remaining balance: ${formatAmount(data.remainingBalance)}.`}
              code={data.card?.code ?? "UNKNOWN"}
            />
          );
        }
      }
    } catch (e) {
      console.error("Redeem page fetch error", e);
      isError = true;
      content = (
        <ErrorBox
          title="Cannot redeem"
          body="Network error. Please try again."
        />
      );
    }
  }

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-6 ${
        isError ? "bg-red-50" : "bg-[#EFEFEF]"
      } relative overflow-hidden`}
    >
      <div className="min-h-screen w-full absolute top-0 left-0 flex items-center justify-center">
        {/* Radial Gradient Background from Bottom */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: isError
              ? "radial-gradient(125% 125% at 50% 90%, #fff 40%, #ef4444 100%)"
              : "radial-gradient(125% 125% at 50% 90%, #fff 40%, #0055D6 100%)",
          }}
        />
        {/* Your Content/Components */}
      </div>
      <div className="relative z-10">
        {content}
        <div className="mt-8 flex justify-between gap-4">
          <Link
            href="/giftcard"
            className="inline-flex items-center text-sm text-[#020664] hover:text-[#0055D6] transition-colors duration-300 font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            View demo gift card
          </Link>
          <br />
          <Link
            href="/"
            className="inline-flex items-center text-sm text-[#020664] hover:text-[#0055D6] transition-colors duration-300 font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Go back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorBox({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative rounded-3xl p-8 w-full max-w-md bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/10 rounded-3xl" />

      {/* Error icon background */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Error icon */}
        <div className="mb-4 flex justify-center items-center">
          <Image
            className="w-36 h-36"
            src="/access-denied.svg"
            alt="Access denied"
            width={144}
            height={144}
            priority
          />
        </div>

        <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          {title}
        </h1>

        <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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
    <div className="relative rounded-3xl p-8 w-full max-w-md bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
      {/* Success icon background */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#3EF2D0]/20 to-[#0055D6]/20 rounded-full blur-xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Success icon */}
        <div className="mb-4 flex justify-center items-center">
          <Image
            className="w-36 h-36"
            src="/order-confirmed.svg"
            alt="Order confirmed"
            width={144}
            height={144}
            priority
          />
        </div>

        <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#020664] to-[#0055D6] bg-clip-text text-transparent">
          {title}
        </h1>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{body}</p>

        {/* Code section */}
        <div className="bg-gradient-to-r from-[#020664]/5 to-[#0055D6]/5 rounded-xl p-4 border border-[#0055D6]/10">
          <div className="text-xs font-medium text-[#020664]/70 mb-1">
            Gift Card Code
          </div>
          <div className="font-mono text-lg font-bold bg-gradient-to-r from-[#020664] to-[#0055D6] bg-clip-text text-transparent tracking-wider">
            {mask(code)}
          </div>
        </div>
      </div>
    </div>
  );
}

function mask(code: string) {
  // Hide middle characters: keep last 4 visible, preserve hyphens
  return code.replace(/.(?=.{4})/g, (ch) => (/[-\s]/.test(ch) ? ch : "*"));
}

function formatAmount(val: unknown) {
  if (typeof val !== "number") return "0";
  return `$${val.toFixed(2)}`;
}
