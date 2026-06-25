"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/lib/icons";
import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useWallet } from "@/lib/wallet/WalletProvider";
import { formatNumber } from "@/lib/format";
import type { WalletTxStatus, WalletTxType } from "@/data/types";

const typeIcon: Record<WalletTxType, IconName> = {
  recharge: "plus",
  purchase: "cart",
  refund: "layers",
  adjustment: "spark",
};

const statusTone: Record<WalletTxStatus, "success" | "warning" | "neutral" | "info"> = {
  completed: "success",
  pending: "warning",
  failed: "neutral",
  refunded: "info",
};

export function WalletTransactionList() {
  const { t, tl } = useI18n();
  const { transactions } = useWallet();

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-14 text-center">
        <Icon name="spark" size={24} className="text-muted" />
        <p className="text-sm text-muted">{t("wallet.empty")}</p>
      </div>
    );
  }

  return (
    <ul className="overflow-hidden rounded-xl border border-border">
      {transactions.map((tx) => {
        const credit = tx.amount >= 0;
        return (
          <li
            key={tx.transactionId}
            className="flex items-center gap-3 border-b border-border p-4 last:border-0 odd:bg-surface/50"
          >
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                credit ? "bg-success-soft text-success" : "bg-surface-2 text-ink"
              }`}
            >
              <Icon name={typeIcon[tx.type]} size={18} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 font-bold text-ink-strong">
                {t(`wtx.${tx.type}` as Parameters<typeof t>[0])}
                <Badge tone={statusTone[tx.status]}>{t(`wstat.${tx.status}` as Parameters<typeof t>[0])}</Badge>
              </p>
              <p className="truncate text-xs text-muted">{tl(tx.description)}</p>
              <p className="nums flex items-center gap-2 text-xs text-muted" dir="ltr">
                <span>{tx.date}</span>
                <span>· {tx.transactionId}</span>
                {tx.relatedOrderNumber && (
                  <Link href="/orders" className="font-bold text-accent-strong hover:underline">
                    {tx.relatedOrderNumber}
                  </Link>
                )}
              </p>
            </div>

            <span className={`nums shrink-0 font-extrabold ${credit ? "text-success" : "text-ink-strong"}`} dir="ltr">
              {credit ? "+" : "−"}
              {formatNumber(Math.abs(tx.amount))}
              <span className="ms-1 text-xs font-bold text-muted">{t("common.currency")}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
