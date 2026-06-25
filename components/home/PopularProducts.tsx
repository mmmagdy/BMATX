"use client";

import { SectionHeader } from "./SectionHeader";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { products } from "@/data/products";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function PopularProducts() {
  const { t } = useI18n();
  const top = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  return (
    <section className="page py-12 md:py-16">
      <SectionHeader title={t("home.popular")} subtitle={t("home.popularSub")} href="/products?sort=popular" />
      <ProductGrid products={top} />
    </section>
  );
}
