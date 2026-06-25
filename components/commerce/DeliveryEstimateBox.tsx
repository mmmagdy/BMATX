"use client";

import { Icon } from "@/lib/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { quoteDelivery } from "@/data/logistics";
import { warehouseById } from "@/data/warehouses";
import { regionById } from "@/data/regions";
import { formatNumber } from "@/lib/format";
import type { Product } from "@/data/types";
import { cn } from "@/lib/cn";

/** Address-aware delivery estimate (cost + ETA) + pickup availability for a warehouse. */
export function DeliveryEstimateBox({
  warehouseId,
  regionId,
  product,
  quantity = 1,
  className,
}: {
  warehouseId: string;
  regionId: string;
  product: Product;
  quantity?: number;
  className?: string;
}) {
  const { t, tl } = useI18n();
  const wh = warehouseById(warehouseId);
  const region = regionById(regionId);
  const q = quoteDelivery(warehouseId, regionId, product, quantity);
  const pickup = wh?.pickupAvailable;

  return (
    <div className={cn("rounded-lg border border-border p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-bold text-ink-strong">
          <Icon name="truck" size={18} className="text-primary" />
          {t("del.estimateTo")} {region && tl(region.name)}
        </span>
        <span className="nums font-extrabold text-ink-strong">
          {t("common.from")} {formatNumber(q.cost)} {t("common.currency")}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <Icon name="info" size={14} />
          {t("del.arrivesIn")} <span className="nums font-bold text-ink">{q.minDays}–{q.maxDays}</span> {t("del.days")}
        </span>
        <span className="flex items-center gap-1.5">
          <Icon
            name={pickup ? "check-circle" : "close"}
            size={14}
            className={pickup ? "text-success" : "text-muted"}
          />
          {pickup ? t("del.pickupAvailable") : t("del.noPickupHere")}
        </span>
      </div>
    </div>
  );
}
