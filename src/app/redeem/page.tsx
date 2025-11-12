export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { postScanEvent } from "@/lib/telemetry";
import { maskCode } from "@/lib/telemetry";

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
          // Client-side telemetry reflecting final API response
          await postScanEvent({
            level: "warn",
            action: "redeem_api_error",
            message: `Redeem-by-token failed: ${reason || "unknown"}`,
            context: {
              tokenLength: tokenParam.length,
              status: resp.status,
              error: reason || null,
              idempotencyKey: idemKey,
            },
          });
        } else {
          content = (
            <SuccessBox
              title="Redeemed successfully"
              body={`Redeemed ${formatAmount(
                data.redeemedAmount,
              )}. Remaining balance: ${formatAmount(data.remainingBalance)}.`}
              code={data.card?.code ?? "UNKNOWN"}
            />
          );
          await postScanEvent({
            level: "info",
            action: "redeem_api_success",
            message: "Redeem-by-token succeeded",
            context: {
              tokenLength: tokenParam.length,
              status: resp.status,
              idempotencyKey: idemKey,
              redeemedAmount: data.redeemedAmount,
              remainingBalance: data.remainingBalance,
              codeMasked: data.card?.code ? maskCode(data.card.code) : null,
            },
          });
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
          await postScanEvent({
            level: "warn",
            action: "redeem_api_error",
            message: `Redeem-by-code failed: ${reason || "unknown"}`,
            context: {
              codeMasked: maskCode(codeParam),
              amountRequested: amount,
              status: resp.status,
              error: reason || null,
              idempotencyKey: idemKey,
            },
          });
        } else {
          content = (
            <SuccessBox
              title="Redeemed successfully"
              body={`Redeemed ${formatAmount(
                data.redeemedAmount,
              )}. Remaining balance: ${formatAmount(data.remainingBalance)}.`}
              code={data.card?.code ?? "UNKNOWN"}
            />
          );
          await postScanEvent({
            level: "info",
            action: "redeem_api_success",
            message: "Redeem-by-code succeeded",
            context: {
              codeMasked: data.card?.code ? maskCode(data.card.code) : null,
              amountRequested: amount,
              status: resp.status,
              idempotencyKey: idemKey,
              redeemedAmount: data.redeemedAmount,
              remainingBalance: data.remainingBalance,
              fullRedemption: data.remainingBalance === 0,
            },
          });
        }
      }
    } catch (e) {
      await postScanEvent({
        level: "error",
        action: "redeem_api_error",
        message: "Redeem page network or unexpected error",
        cause: e instanceof Error ? e.message : String(e),
        context: {
          tokenPresent: !!tokenParam,
          codePresent: !!codeParam,
        },
      });
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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 particle-bg">
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#3EF2D0] rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-[#0055D6] rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-[#3EF2D0] rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 ${
            isError
              ? "bg-gradient-to-br from-red-500/10 via-transparent to-red-400/5"
              : "bg-gradient-to-br from-[#3EF2D0]/10 via-transparent to-[#0055D6]/5"
          } rounded-3xl`}
        />
      </div>
      <div className="relative z-10">
        {content}
        <div className="mt-8 flex justify-between gap-4">
          <Link
            href="/giftcard"
            className="inline-flex items-center text-sm text-white/70 hover:text-[#3EF2D0] transition-colors duration-300 font-medium"
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
            className="inline-flex items-center text-sm text-white/70 hover:text-[#3EF2D0] transition-colors duration-300 font-medium"
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
    <div className="relative rounded-3xl p-16 w-full max-w-2xl bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#1a1a1a]/95 backdrop-blur-xl border border-red-500/20 shadow-2xl overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-400/5 rounded-3xl" />

      {/* Error icon background */}
      <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-to-br from-red-500/30 to-red-400/20 rounded-full blur-xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Error icon */}
        <div className="mb-8 flex justify-center items-center">
          <Image
            className="w-56 h-56"
            src="/access-denied.svg"
            alt="Access denied"
            width={224}
            height={224}
            priority
          />
        </div>

        <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">
          {title}
        </h1>

        <p className="text-lg text-white/70 leading-relaxed text-center">
          {body}
        </p>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-red-400/10 to-transparent" />
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
    <div className="relative rounded-3xl p-16 w-full max-w-2xl bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#1a1a1a]/95 backdrop-blur-xl border border-[#3EF2D0]/20 shadow-2xl overflow-hidden">
      {/* Success icon background */}
      <div className="absolute -top-6 -right-6 w-40 h-40 bg-gradient-to-br from-[#3EF2D0]/30 to-[#0055D6]/20 rounded-full blur-xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Success icon */}
        <div className="mb-8 flex justify-center items-center">
          <Image
            className="w-56 h-56"
            src="/order-confirmed.svg"
            alt="Order confirmed"
            width={224}
            height={224}
            priority
          />
        </div>

        <h1 className="text-4xl font-bold mb-6 text-center gradient-text">
          {title}
        </h1>

        <p className="text-lg text-white/70 mb-10 leading-relaxed text-center">
          {body}
        </p>

        {/* Code section */}
        <div className="bg-gradient-to-r from-[#3EF2D0]/10 to-[#0055D6]/10 rounded-xl p-8 border border-[#3EF2D0]/20">
          <div className="text-base font-medium text-white/60 mb-3 text-center">
            Gift Card Code
          </div>
          <div className="font-mono text-2xl font-bold gradient-text tracking-wider text-center">
            {mask(code)}
          </div>
        </div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[#3EF2D0]/10 to-transparent" />
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
