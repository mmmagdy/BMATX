"use client";

import Link from "next/link";
import { Icon } from "@/lib/icons";
import { WalletBalanceCard } from "./WalletBalanceCard";
import { WalletTransactionList } from "./WalletTransactionList";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function WalletView() {
  const { t } = useI18n();
  return (
    <div className="page py-8">
      <Link
        href="/account"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink"
      >
        <Icon name="chevron-end" size={16} className="flip-rtl rotate-180" />
        {t("acc.title")}
      </Link>

      <h1 className="mb-6 flex items-center gap-2 text-2xl font-extrabold md:text-3xl">
        <Icon name="spark" size={24} className="text-primary" />
        {t("wallet.title")}
      </h1>

      <div className="mx-auto grid max-w-3xl gap-6">
        <WalletBalanceCard />

        <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <Icon name="info" size={18} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-bold text-ink-strong">{t("wallet.rules")}</p>
            <p className="mt-1 text-sm text-muted">{t("wallet.rulesText")}</p>
          </div>
        </div>

        <section>
          <h2 className="mb-3 font-extrabold text-ink-strong">{t("wallet.history")}</h2>
          <WalletTransactionList />
        </section>
      </div>
    </div>
  );
}
