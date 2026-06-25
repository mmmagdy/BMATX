"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Icon } from "@/lib/icons";
import { buttonClasses } from "@/components/ui/Button";
import { ShipmentGroup } from "./ShipmentGroup";
import { useCart } from "@/lib/cart/CartProvider";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { buildShipments } from "@/data/logistics";
import { defaultRegionId } from "@/data/account";
import { formatNumber } from "@/lib/format";

export function CartView() {
  const { t } = useI18n();
  const { lines, subtotal, count } = useCart();

  const shipments = useMemo(() => buildShipments(lines, defaultRegionId), [lines]);
  const deliveryTotal = shipments.reduce((n, s) => n + s.deliveryCost, 0);
  const total = subtotal + deliveryTotal;

  if (lines.length === 0) {
    return (
      <div className="page flex flex-col items-center gap-4 py-24 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-surface-2 text-muted">
          <Icon name="cart" size={36} />
        </span>
        <h1 className="text-2xl font-extrabold">{t("cart.empty")}</h1>
        <p className="text-muted">{t("cart.emptyHint")}</p>
        <Link href="/products" className={buttonClasses("primary", "lg", "mt-2")}>
          {t("cart.startShopping")}
          <Icon name="arrow-end" size={18} className="flip-rtl" />
        </Link>
      </div>
    );
  }

  return (
    <div className="page py-8">
      <h1 className="mb-6 text-2xl font-extrabold md:text-3xl">
        {t("cart.title")} <span className="nums text-lg font-bold text-muted">({count})</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* shipments */}
        <div className="flex flex-col gap-4">
          {shipments.length > 1 && (
            <div className="flex items-start gap-2.5 rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-sm">
              <Icon name="package" size={18} className="mt-0.5 shrink-0 text-accent-strong" />
              <p className="text-accent-strong">
                <span className="font-bold">{t("ship.multiNote")}.</span> {t("ship.differentWh")}
              </p>
            </div>
          )}

          {shipments.map((s, i) => (
            <ShipmentGroup key={s.id} shipment={s} index={i + 1} total={shipments.length} editable />
          ))}
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-44 lg:self-start">
          <div className="rounded-xl border border-border p-5">
            <h2 className="mb-4 text-lg font-extrabold text-ink-strong">{t("cart.items")}</h2>
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">{t("cart.subtotal")}</dt>
                <dd className="nums font-bold text-ink">{formatNumber(subtotal)} {t("common.currency")}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1.5 text-muted">
                  <Icon name="truck" size={15} />
                  {t("sum.deliveryTotal")}
                  {shipments.length > 1 && (
                    <span className="nums text-xs">({shipments.length} {t("ship.title")})</span>
                  )}
                </dt>
                <dd className="nums font-bold text-ink">{formatNumber(deliveryTotal)} {t("common.currency")}</dd>
              </div>
              <div className="my-1 h-px bg-border" />
              <div className="flex items-center justify-between">
                <dt className="text-base font-extrabold text-ink-strong">{t("cart.total")}</dt>
                <dd className="nums text-xl font-extrabold text-ink-strong">
                  {formatNumber(total)} <span className="text-sm font-bold text-muted">{t("common.currency")}</span>
                </dd>
              </div>
            </dl>

            <Link href="/checkout" className={buttonClasses("primary", "lg", "mt-5 w-full")}>
              {t("cart.checkout")}
              <Icon name="arrow-end" size={18} className="flip-rtl" />
            </Link>

            <p className="mt-3 flex items-start gap-1.5 text-xs text-muted">
              <Icon name="info" size={14} className="mt-0.5 shrink-0" />
              {t("sum.discount")} · {t("wallet.title")} — {t("co.title")}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
