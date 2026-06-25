"use client";

import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { productRules } from "@/data/logistics";
import type { IconName } from "@/lib/icons";
import type { Product } from "@/data/types";
import { cn } from "@/lib/cn";

/** Delivery restriction chips (groupable/separate/fragile/heavy/special, pickup/delivery). */
export function DeliveryRules({
  product,
  max,
  className,
}: {
  product: Product;
  max?: number;
  className?: string;
}) {
  const { t } = useI18n();
  const rules = productRules(product);
  const shown = max ? rules.slice(0, max) : rules;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {shown.map((r) => (
        <Badge key={r.key} tone={r.tone} icon={r.icon as IconName}>
          {t(r.key as Parameters<typeof t>[0])}
        </Badge>
      ))}
    </div>
  );
}
