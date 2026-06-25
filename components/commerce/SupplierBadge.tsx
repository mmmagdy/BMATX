"use client";

import { Icon } from "@/lib/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { supplierById } from "@/data/suppliers";
import { cn } from "@/lib/cn";

/** Supplier name + verification mark. */
export function SupplierBadge({
  supplierId,
  showAvatar = false,
  className,
}: {
  supplierId: string;
  showAvatar?: boolean;
  className?: string;
}) {
  const { t, tl } = useI18n();
  const s = supplierById(supplierId);
  if (!s) return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      {showAvatar && (
        <span
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-extrabold text-white"
          style={{ background: s.tint }}
          aria-hidden
        >
          {tl(s.name).slice(0, 1)}
        </span>
      )}
      <span className="font-bold text-ink-strong">{tl(s.name)}</span>
      {s.verified && (
        <Icon name="shield" size={14} className="shrink-0 text-accent" aria-label={t("common.verified")} />
      )}
    </span>
  );
}
