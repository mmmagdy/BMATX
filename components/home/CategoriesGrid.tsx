"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/lib/icons";
import { SectionHeader } from "./SectionHeader";
import { categories } from "@/data/categories";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { formatNumber } from "@/lib/format";

export function CategoriesGrid() {
  const { t, tl } = useI18n();
  return (
    <section className="page py-12 md:py-16">
      <SectionHeader title={t("home.categories")} subtitle={t("home.categoriesSub")} href="/products" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.id}`}
            className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-bg p-5 text-center transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-md)]"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-[oklch(0.5_0.1_75)] transition-colors group-hover:bg-primary group-hover:text-primary-ink">
              <Icon name={c.icon as IconName} size={26} />
            </span>
            <span className="text-sm font-bold leading-tight text-ink-strong">{tl(c.name)}</span>
            <span className="nums text-xs text-muted">{formatNumber(c.productCount)} {t("nav.products")}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
