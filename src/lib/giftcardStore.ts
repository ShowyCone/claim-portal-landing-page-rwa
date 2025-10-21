export type GiftCard = {
  code: string;
  status: "active" | "redeemed";
  balance: number;
  createdAt: number;
  redeemedAt?: number;
};

// Simple in-memory store for demo purposes only.
const store = new Map<string, GiftCard>();

function randomCode(): string {
  // GFT-YYYY-AB12 style
  const year = new Date().getFullYear();
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randLetters = () =>
    Array.from(
      { length: 2 },
      () => letters[Math.floor(Math.random() * letters.length)]
    ).join("");
  const randDigits = () =>
    Math.floor(1000 + Math.random() * 9000)
      .toString()
      .slice(0, 2);
  return `GFT-${year}-${randLetters()}${randDigits()}`;
}

export function issueCard(opts?: {
  code?: string;
  balance?: number;
}): GiftCard {
  const code = (opts?.code || randomCode()).toUpperCase();
  const card: GiftCard = {
    code,
    status: "active",
    balance: opts?.balance ?? 100,
    createdAt: Date.now(),
  };
  store.set(code, card);
  return card;
}

export function getCard(code: string): GiftCard | undefined {
  return store.get(code.toUpperCase());
}

export function redeemCard(
  code: string,
  amount?: number
): { ok: boolean; reason?: string; card?: GiftCard } {
  const c = getCard(code);
  if (!c) return { ok: false, reason: "not_found" };
  if (c.status === "redeemed") return { ok: false, reason: "already_redeemed" };

  if (amount === undefined) {
    // Consume entirely for demo
    c.status = "redeemed";
    c.balance = 0;
    c.redeemedAt = Date.now();
    store.set(c.code, c);
    return { ok: true, card: c };
  }

  if (amount <= 0) return { ok: false, reason: "invalid_amount" };
  if (amount > c.balance) return { ok: false, reason: "insufficient_balance" };

  c.balance -= amount;
  if (c.balance === 0) {
    c.status = "redeemed";
    c.redeemedAt = Date.now();
  }
  store.set(c.code, c);
  return { ok: true, card: c };
}

// Seed one demo card on module load for convenience
const seeded = issueCard({ code: "GFT-2025-AB12", balance: 100 });
export const demoGiftCardCode = seeded.code;
