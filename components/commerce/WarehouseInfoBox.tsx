"use client";

import { Icon } from "@/lib/icons";
import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { warehouseById } from "@/data/warehouses";
import { regionById } from "@/data/regions";
import { warehouseHasStock } from "@/data/logistics";
import type { Product } from "@/data/types";
import { cn } from "@/lib/cn";

/** "Ships from <warehouse>" + region + per-warehouse stock. */
export function WarehouseInfoBox({
  warehouseId,
  product,
  className,
}: {
  warehouseId: string;
  product: Product;
  className?: string;
}) {
  const { t, tl } = useI18n();
  const wh = warehouseById(warehouseId);
  if (!wh) return null;
  const region = regionById(wh.regionId);
  const inStock = warehouseHasStock(warehouseId, product);

  return (
    <div className={cn("flex items-start gap-3 rounded-lg border border-border bg-surface p-3.5", className)}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-surface-2 text-ink">
        <Icon name="package" size={18} />
      </span>
      <div className="min-w-0 flex-1 text-sm">
        <p className="text-xs text-muted">{t("sup.shipsFrom")}</p>
        <p className="font-bold text-ink-strong">{tl(wh.name)}</p>
        <p className="flex items-center gap-1 text-muted">
          <Icon name="pin" size={13} /> {region && tl(region.name)}
        </p>
      </div>
      {inStock ? (
        <Badge tone="success" icon="check-circle">{t("sup.stockHere")}</Badge>
      ) : (
        <Badge tone="neutral">{t("sup.outHere")}</Badge>
      )}
    </div>
  );
}
