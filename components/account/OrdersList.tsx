"use client";

import Link from "next/link";
import { Icon } from "@/lib/icons";
import { Button, buttonClasses } from "@/components/ui/Button";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { ProductThumb } from "@/components/commerce/ProductThumb";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useCart } from "@/lib/cart/CartProvider";
import { productById } from "@/data/products";
import { regionById } from "@/data/regions";
import { formatNumber } from "@/lib/format";
import type { Order } from "@/data/types";

function OrderCard({ order }: { order: Order }) {
  const { t, tl } = useI18n();
  const { add } = useCart();
  const region = regionById(order.regionId);
  const totalQty = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-bg">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm">
            <span className="text-muted">{t("orders.number")} </span>
            <span className="nums font-extrabold text-ink-strong">{order.number}</span>
          </span>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span className="nums hidden text-sm text-muted sm:block">{order.dateLabel}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          {order.items.slice(0, 4).map((it) => {
            const p = productById(it.productId);
            return p ? (
              <Link
                key={it.productId}
                href={`/products/${p.id}`}
                className="overflow-hidden rounded-lg border border-border"
                title={tl(p.name)}
              >
                <ProductThumb categoryId={p.categoryId} className="h-14 w-14" iconSize={22} />
              </Link>
            ) : null;
          })}
          <span className="ps-1 text-sm text-muted">
            <span className="nums font-bold text-ink">{totalQty}</span> {t("orders.itemsCount")}
            {region && <span className="block text-xs">{tl(region.name)}</span>}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm">
            <span className="text-muted">{t("co.summary")}: </span>
            <span className="nums font-extrabold text-ink-strong">
              {formatNumber(order.total)} {t("common.currency")}
            </span>
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => order.items.forEach((it) => add(it.productId, it.quantity))}
            >
              <Icon name="cart" size={15} />
              {t("orders.reorder")}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function OrdersList({ orders, limit }: { orders: Order[]; limit?: number }) {
  const { t } = useI18n();
  const list = limit ? orders.slice(0, limit) : orders;

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 text-muted">
          <Icon name="package" size={26} />
        </span>
        <h3 className="font-bold text-ink-strong">{t("orders.empty")}</h3>
        <p className="text-sm text-muted">{t("orders.emptyHint")}</p>
        <Link href="/products" className={buttonClasses("primary", "md", "mt-1")}>
          {t("cart.startShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {list.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}
