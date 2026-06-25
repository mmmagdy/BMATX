"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { WalletTransaction } from "@/data/types";
import { walletBalance, walletTransactions } from "@/data/wallet";

interface WalletValue {
  balance: number;
  transactions: WalletTransaction[];
  recharge: (amount: number) => void;
}

const WalletContext = createContext<WalletValue | null>(null);

function today() {
  // browser-only; safe here (not a workflow script)
  return new Date().toISOString().slice(0, 10).replace(/-/g, "/");
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(walletBalance);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(walletTransactions);
  const [seq, setSeq] = useState(0);

  const recharge = useCallback(
    (amount: number) => {
      if (amount <= 0) return;
      setBalance((b) => b + amount);
      setSeq((s) => {
        const next = s + 1;
        setTransactions((prev) => [
          {
            transactionId: `WTX-${10250 + next}`,
            date: today(),
            type: "recharge",
            amount,
            status: "completed",
            description: { ar: "شحن المحفظة", en: "Wallet recharge" },
          },
          ...prev,
        ]);
        return next;
      });
    },
    [],
  );

  const value = useMemo<WalletValue>(
    () => ({ balance, transactions, recharge }),
    [balance, transactions, recharge],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within <WalletProvider>");
  return ctx;
}
