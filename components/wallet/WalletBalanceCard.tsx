"use client";

import { useState } from "react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useWallet } from "@/lib/wallet/WalletProvider";
import { formatNumber } from "@/lib/format";

const presets = [100, 250, 500, 1000];

export function WalletBalanceCard() {
  const { t } = useI18n();
  const { balance, recharge } = useWallet();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(250);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {/* balance band */}
      <div className="relative overflow-hidden bg-ink-strong p-6 text-white">
        <div
          className="pointer-events-none absolute -bottom-16 -end-10 h-56 w-56 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--primary), transparent 65%)" }}
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-sm text-white/70">
              <Icon name="spark" size={15} className="text-primary" />
              {t("wallet.balance")}
            </p>
            <p className="nums mt-1 text-3xl font-extrabold">
              {formatNumber(balance)} <span className="text-base font-bold text-white/70">{t("common.currency")}</span>
            </p>
          </div>
          <Button onClick={() => setOpen((v) => !v)} className="shrink-0">
            <Icon name="plus" size={18} />
            {t("wallet.recharge")}
          </Button>
        </div>
      </div>

      {/* recharge panel */}
      {open && (
        <div className="border-t border-border p-4">
          <p className="mb-2 text-sm font-bold text-ink-strong">{t("wallet.addAmount")}</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(p)}
                className={`nums rounded-pill border px-4 py-2 text-sm font-bold transition-colors ${
                  amount === p
                    ? "border-primary bg-primary-soft text-ink-strong"
                    : "border-border text-ink hover:bg-surface-2"
                }`}
              >
                {formatNumber(p)} {t("common.currency")}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button
              onClick={() => {
                recharge(amount);
                setOpen(false);
              }}
            >
              <Icon name="check" size={18} />
              {t("wallet.confirmRecharge")}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted">{t("wallet.rechargeNote")}</p>
        </div>
      )}
    </div>
  );
}
