"use client";

import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface PriceProps {
  value: number;
  oldValue?: number;
  /** unit label like "bag" / "m²" already localized by caller */
  unit?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
};

export function Price({ value, oldValue, unit, size = "md", className }: PriceProps) {
  const { t } = useI18n();
  return (
    <div className={cn("flex items-baseline gap-1.5 flex-wrap", className)}>
      <span className={cn("nums font-extrabold text-ink-strong", sizeMap[size])}>
        {formatNumber(value)}
      </span>
      <span className="text-xs font-bold text-muted">{t("common.currency")}</span>
      {unit && (
        <span className="text-xs text-muted">
          {t("common.perUnit")} {unit}
        </span>
      )}
      {oldValue && (
        <span className="nums text-sm text-muted line-through">{formatNumber(oldValue)}</span>
      )}
    </div>
  );
}
