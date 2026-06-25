"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useWallet } from "@/lib/wallet/WalletProvider";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Checkout wallet control. Reports how much of `total` is paid from wallet. */
export function WalletPaymentToggle({
  total,
  onChange,
}: {
  total: number;
  onChange: (used: number) => void;
}) {
  const { t } = useI18n();
  const { balance } = useWallet();
  const [use, setUse] = useState(false);

  const used = use ? Math.min(balance, total) : 0;
  const remaining = Math.max(0, total - used);
  const coversAll = used > 0 && remaining === 0;

  useEffect(() => {
    onChange(used);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [used]);

  return (
    <div className={cn("rounded-xl border-2 p-4 transition-colors", use ? "border-primary" : "border-border")}>
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={use}
          onChange={(e) => setUse(e.target.checked)}
          className="h-[18px] w-[18px] accent-[var(--primary)]"
        />
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-soft text-[oklch(0.5_0.1_75)]">
          <Icon name="spark" size={18} />
        </span>
        <span className="flex-1">
          <span className="font-bold text-ink-strong">{t("wallet.use")}</span>
          <span className="block text-xs text-muted">
            {t("wallet.available")}:{" "}
            <span className="nums font-bold text-ink">{formatNumber(balance)} {t("common.currency")}</span>
          </span>
        </span>
      </label>

      {use && (
        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">{t("wallet.amountUsed")}</span>
            <span className="nums font-bold text-success" dir="ltr">
              −{formatNumber(used)} {t("common.currency")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-ink-strong">{t("sum.remainingPay")}</span>
            <span className="nums font-extrabold text-ink-strong">
              {formatNumber(remaining)} {t("common.currency")}
            </span>
          </div>
          {coversAll ? (
            <Badge tone="success" icon="check-circle" className="mt-1 self-start">
              {t("wallet.coversAll")}
            </Badge>
          ) : (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
              <Icon name="info" size={14} className="text-accent" />
              {t("wallet.payRest")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
