"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/lib/icons";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { DeliveryBadge } from "./DeliveryBadge";
import { ProductThumb } from "./ProductThumb";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useCart } from "@/lib/cart/CartProvider";
import { supplierById } from "@/data/suppliers";
import { cn } from "@/lib/cn";
import type { Product } from "@/data/types";

export function ProductCard({ product }: { product: Product }) {
  const { t, tl } = useI18n();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const supplier = supplierById(product.supplierId);

  function onAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!product.inStock) return;
    add(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-bg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-md)]">
      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] w-full">
          <ProductThumb categoryId={product.categoryId} className="absolute inset-0 h-full w-full" />
          <div className="absolute start-2.5 top-2.5">
            <DeliveryBadge type={product.delivery} />
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 grid place-items-center bg-bg/60 backdrop-blur-[1px]">
              <span className="rounded-pill bg-ink-strong px-3 py-1 text-xs font-bold text-white">
                {t("common.outOfStock")}
              </span>
            </div>
          )}
          {product.oldPrice && product.inStock && (
            <span className="nums absolute end-2.5 top-2.5 rounded-pill bg-danger px-2 py-0.5 text-[0.7rem] font-extrabold text-white">
              −{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3.5">
          <h3 className="line-clamp-2 text-[0.95rem] font-bold leading-snug text-ink-strong">
            {tl(product.name)}
          </h3>

          {supplier && (
            <span className="flex items-center gap-1 text-xs text-muted">
              {supplier.verified && <Icon name="shield" size={13} className="text-accent" />}
              <span className="truncate">{tl(supplier.name)}</span>
            </span>
          )}

          <Rating value={product.rating} reviews={product.reviews} />

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            {product.moq && (
              <span className="flex items-center gap-1">
                <Icon name="package" size={13} />
                {t("common.moq")}: <span className="nums font-bold text-ink">{product.moq}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Icon name="pin" size={13} />
              <span className="nums font-bold text-ink">{product.regionIds.length}</span> {t("common.region")}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 border-t border-border p-3.5">
        <Price value={product.price} oldValue={product.oldPrice} unit={tl(product.unit)} size="md" />
        <button
          type="button"
          onClick={onAdd}
          disabled={!product.inStock}
          aria-label={t("common.addToCart")}
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-md font-bold transition-all duration-150 ease-out active:scale-95 disabled:opacity-40 disabled:pointer-events-none",
            added ? "bg-success text-white" : "bg-primary text-primary-ink hover:bg-primary-strong",
          )}
        >
          <Icon name={added ? "check" : "plus"} size={20} />
        </button>
      </div>
    </article>
  );
}
