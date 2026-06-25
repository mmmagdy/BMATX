"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/lib/icons";
import { categories } from "@/data/categories";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function CategoryNav() {
  const { t, tl } = useI18n();
  return (
    <nav className="border-t border-border bg-bg" aria-label={t("nav.allCategories")}>
      <div className="page flex items-center gap-1 overflow-x-auto hide-scrollbar py-1.5">
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-ink-strong hover:bg-surface-2 transition-colors"
        >
          <Icon name="menu" size={16} />
          {t("nav.allCategories")}
        </Link>
        <span className="mx-1 h-5 w-px shrink-0 bg-border" />
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.id}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm text-ink hover:bg-surface-2 hover:text-ink-strong transition-colors"
          >
            <Icon name={c.icon as IconName} size={16} className="text-muted" />
            {tl(c.name)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
