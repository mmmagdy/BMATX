"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { ProductThumb } from "./ProductThumb";
import { SupplierBadge } from "./SupplierBadge";
import { DeliveryRules } from "./DeliveryRules";
import { WarehouseSelector } from "./WarehouseSelector";
import { WarehouseInfoBox } from "./WarehouseInfoBox";
import { DeliveryEstimateBox } from "./DeliveryEstimateBox";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useCart } from "@/lib/cart/CartProvider";
import { categoryById } from "@/data/categories";
import { regionById } from "@/data/regions";
import { defaultRegionId } from "@/data/account";
import { defaultWarehouseFor, hasMultipleWarehouses, warehouseHasStock } from "@/data/logistics";
import { formatNumber } from "@/lib/format";
import type { Product } from "@/data/types";

export function ProductDetails({ product }: { product: Product }) {
  const { t, tl } = useI18n();
  const { add } = useCart();
  const category = categoryById(product.categoryId);
  const regionId = defaultRegionId;

  const [warehouseId, setWarehouseId] = useState(() => defaultWarehouseFor(product, regionId));
  const [qty, setQty] = useState(product.moq ?? 1);
  const [added, setAdded] = useState(false);

  const multi = hasMultipleWarehouses(product);
  const inStockHere = warehouseHasStock(warehouseId, product);

  function onAdd() {
    if (!inStockHere) return;
    add(product.id, qty, warehouseId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="page py-8">
      {/* breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-ink">{t("nav.home")}</Link>
        <Icon name="chevron-end" size={14} className="flip-rtl" />
        <Link href={`/products?category=${product.categoryId}`} className="hover:text-ink">
          {category && tl(category.name)}
        </Link>
        <Icon name="chevron-end" size={14} className="flip-rtl" />
        <span className="truncate text-ink">{tl(product.name)}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_1.1fr] lg:gap-12">
        {/* gallery */}
        <div className="lg:sticky lg:top-44 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-border">
            <ProductThumb categoryId={product.categoryId} className="aspect-square w-full" iconSize={120} />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-border opacity-80 hover:opacity-100">
                <ProductThumb categoryId={product.categoryId} className="aspect-square w-full" iconSize={30} />
              </div>
            ))}
          </div>
        </div>

        {/* info */}
        <div className="flex flex-col gap-5">
          <div>
            <SupplierBadge supplierId={product.supplierId} showAvatar />
            <h1 className="mt-3 text-2xl font-extrabold leading-tight md:text-3xl">{tl(product.name)}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Rating value={product.rating} reviews={product.reviews} size={16} />
              <span className="h-4 w-px bg-border" />
              {inStockHere ? (
                <Badge tone="success" icon="check-circle">{t("common.inStock")}</Badge>
              ) : (
                <Badge tone="neutral">{t("common.outOfStock")}</Badge>
              )}
            </div>
          </div>

          <Price value={product.price} oldValue={product.oldPrice} unit={tl(product.unit)} size="lg" />

          <p className="max-w-prose text-muted">{tl(product.shortDesc)}</p>

          {/* delivery rules */}
          <DeliveryRules product={product} />

          {/* warehouse: selector when multiple, info box when single */}
          {multi ? (
            <WarehouseSelector product={product} regionId={regionId} value={warehouseId} onChange={setWarehouseId} />
          ) : (
            <WarehouseInfoBox warehouseId={warehouseId} product={product} />
          )}

          {/* address-aware estimate + pickup */}
          <DeliveryEstimateBox warehouseId={warehouseId} regionId={regionId} product={product} quantity={qty} />

          {/* action row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col gap-1">
              {product.moq && (
                <span className="text-xs text-muted">
                  {t("common.moq")}: <span className="nums font-bold text-ink">{product.moq}</span> {tl(product.unit)}
                </span>
              )}
              <QtyStepper value={qty} onChange={setQty} min={product.moq ?? 1} />
            </div>
            <Button
              size="lg"
              onClick={onAdd}
              disabled={!inStockHere}
              variant={added ? "secondary" : "primary"}
              className="flex-1 min-w-44"
            >
              <Icon name={added ? "check" : "cart"} size={20} />
              {added ? t("common.added") : t("common.addToCart")}
            </Button>
          </div>

          {/* regions */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-ink-strong">
              <Icon name="pin" size={16} className="text-muted" />
              {t("pdp.regions")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.regionIds.map((rid) => {
                const r = regionById(rid);
                return r ? (
                  <span key={rid} className="rounded-pill bg-surface-2 px-3 py-1 text-sm text-ink">
                    {tl(r.name)}
                  </span>
                ) : null;
              })}
            </div>
          </div>

          {/* specs */}
          <div>
            <h3 className="mb-2 text-sm font-extrabold text-ink-strong">{t("pdp.specs")}</h3>
            <dl className="overflow-hidden rounded-lg border border-border">
              {product.specs.map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-4 py-3 odd:bg-surface">
                  <dt className="text-sm text-muted">{tl(s.label)}</dt>
                  <dd className="text-sm font-bold text-ink-strong">{tl(s.value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
