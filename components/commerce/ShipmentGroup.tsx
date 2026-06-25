"use client";

import Link from "next/link";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/ui/Badge";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { ProductThumb } from "./ProductThumb";
import { SupplierBadge } from "./SupplierBadge";
import { DeliveryRules } from "./DeliveryRules";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useCart } from "@/lib/cart/CartProvider";
import { productById } from "@/data/products";
import { warehouseById } from "@/data/warehouses";
import { regionById } from "@/data/regions";
import { formatNumber } from "@/lib/format";
import type { Shipment } from "@/data/types";

export function ShipmentGroup({
  shipment,
  index,
  total,
  mode = "delivery",
  editable = false,
}: {
  shipment: Shipment;
  index: number;
  total: number;
  mode?: "delivery" | "pickup";
  editable?: boolean;
}) {
  const { t, tl } = useI18n();
  const { setQuantity, remove } = useCart();
  const wh = warehouseById(shipment.warehouseId);
  const region = wh && regionById(wh.regionId);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-bg">
      {/* header */}
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {total > 1 && (
            <Badge tone="primary" icon="package">
              {t("ship.title")} <span className="nums">{index}/{total}</span>
            </Badge>
          )}
          <SupplierBadge supplierId={shipment.supplierId} showAvatar />
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <Icon name="pin" size={13} />
          {wh && tl(wh.name)}{region && <span> · {tl(region.name)}</span>}
        </span>
      </header>

      {/* lines */}
      <ul>
        {shipment.lines.map((line) => {
          const p = productById(line.productId);
          if (!p) return null;
          return (
            <li key={`${line.productId}-${line.warehouseId}`} className="flex gap-3 border-b border-border p-4 last:border-0">
              <Link
                href={`/products/${p.id}`}
                className="shrink-0 overflow-hidden rounded-lg border border-border"
              >
                <ProductThumb categoryId={p.categoryId} className="h-16 w-16 sm:h-20 sm:w-20" iconSize={28} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/products/${p.id}`} className="line-clamp-1 font-bold text-ink-strong hover:text-primary-strong">
                    {tl(p.name)}
                  </Link>
                  {editable && (
                    <button
                      onClick={() => remove(line.productId, line.warehouseId)}
                      aria-label={t("cart.remove")}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted hover:bg-danger-soft hover:text-danger"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  )}
                </div>
                <DeliveryRules product={p} max={2} />
                <div className="mt-auto flex items-center justify-between gap-2">
                  {editable ? (
                    <QtyStepper
                      value={line.quantity}
                      onChange={(n) => setQuantity(line.productId, line.warehouseId, n)}
                      min={p.moq ?? 1}
                      size="sm"
                    />
                  ) : (
                    <span className="nums text-sm text-muted">× {line.quantity}</span>
                  )}
                  <span className="nums font-extrabold text-ink-strong">
                    {formatNumber(p.price * line.quantity)}{" "}
                    <span className="text-xs font-bold text-muted">{t("common.currency")}</span>
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* footer: delivery cost or pickup */}
      <footer className="flex items-center justify-between gap-3 bg-surface px-4 py-3">
        {mode === "pickup" ? (
          <>
            <span className="flex items-center gap-1.5 text-sm font-bold text-ink-strong">
              <Icon name="building" size={16} className="text-primary" />
              {t("ship.pickupPoint")}
            </span>
            <Badge tone="success" icon="check-circle">{t("pickup.free")}</Badge>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <Icon name="truck" size={16} />
              {t("ship.eta")}:{" "}
              <span className="nums font-bold text-ink">{shipment.minDays}–{shipment.maxDays}</span> {t("del.days")}
            </span>
            <span className="nums text-sm">
              <span className="text-muted">{t("ship.deliveryPer")}: </span>
              <span className="font-extrabold text-ink-strong">{formatNumber(shipment.deliveryCost)}</span>{" "}
              <span className="text-xs font-bold text-muted">{t("common.currency")}</span>
            </span>
          </>
        )}
      </footer>
    </section>
  );
}
