"use client";

import { Icon } from "@/lib/icons";
import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { regionById } from "@/data/regions";
import { productWarehouses, warehouseHasStock, quoteDelivery } from "@/data/logistics";
import { formatNumber } from "@/lib/format";
import type { Product } from "@/data/types";
import { cn } from "@/lib/cn";

/** Warehouse chooser — only render when a product has >1 warehouse. */
export function WarehouseSelector({
  product,
  regionId,
  value,
  onChange,
}: {
  product: Product;
  regionId: string;
  value: string;
  onChange: (warehouseId: string) => void;
}) {
  const { t, tl } = useI18n();
  const whs = productWarehouses(product);

  return (
    <div>
      <div className="mb-2 flex items-start gap-2 rounded-lg border border-warning/40 bg-warning-soft px-3 py-2 text-xs">
        <Icon name="info" size={15} className="mt-0.5 shrink-0 text-[oklch(0.45_0.12_60)]" />
        <p className="text-[oklch(0.4_0.1_60)]">
          <span className="font-bold">{t("sup.multiWarehouse")}.</span> {t("sup.multiWarehouseNote")}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {whs.map((w) => {
          const region = regionById(w.regionId);
          const inStock = warehouseHasStock(w.id, product);
          const q = quoteDelivery(w.id, regionId, product);
          const active = w.id === value;
          return (
            <button
              key={w.id}
              type="button"
              disabled={!inStock}
              onClick={() => onChange(w.id)}
              className={cn(
                "flex flex-col gap-1.5 rounded-xl border-2 p-3 text-start transition-colors disabled:opacity-55",
                active ? "border-primary bg-primary-soft/40" : "border-border hover:border-border-strong",
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-bold text-ink-strong">
                  <Icon name="package" size={16} />
                  {tl(w.name)}
                </span>
                <span
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-full border-2",
                    active ? "border-primary bg-primary text-primary-ink" : "border-border",
                  )}
                >
                  {active && <Icon name="check" size={12} />}
                </span>
              </span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Icon name="pin" size={12} /> {region && tl(region.name)}
              </span>
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span className="nums">
                  {t("common.from")} <span className="font-bold text-ink">{formatNumber(q.cost)}</span> {t("common.currency")}
                </span>
                <span className="nums">{q.minDays}–{q.maxDays} {t("del.days")}</span>
              </span>
              {!inStock && <Badge tone="neutral">{t("sup.outHere")}</Badge>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
