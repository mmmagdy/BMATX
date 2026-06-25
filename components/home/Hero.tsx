"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/layout/SearchBar";
import { buttonClasses } from "@/components/ui/Button";
import { Icon, type IconName } from "@/lib/icons";
import { ProductThumb } from "@/components/commerce/ProductThumb";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { categories } from "@/data/categories";
import { suppliers } from "@/data/suppliers";
import { products } from "@/data/products";
import { formatCount } from "@/lib/format";

const quick: { id: string; label: string; icon: IconName }[] = [
  { id: "cement", label: "cement", icon: "cement" },
  { id: "steel", label: "steel", icon: "steel" },
  { id: "tiles", label: "tiles", icon: "tiles" },
  { id: "electrical", label: "electrical", icon: "electrical" },
];

const collage = ["tiles", "steel", "paint", "cement"];

export function Hero() {
  const { t, tl } = useI18n();

  const stats = [
    { value: formatCount(suppliers.length * 28), label: t("hero.stat1") },
    { value: `${formatCount(products.length * 80)}+`, label: t("hero.stat2") },
    { value: "8", label: t("hero.stat3") },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* soft brand wash, not a drench */}
      <div
        className="pointer-events-none absolute -top-32 end-0 h-[36rem] w-[36rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--primary-soft), transparent 65%)" }}
        aria-hidden
      />
      <div className="page relative grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* text */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3 py-1.5 text-sm font-bold text-ink"
          >
            <Icon name="spark" size={15} className="text-primary" />
            {t("hero.eyebrow")}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
            className="mt-5 text-[clamp(2rem,1.4rem+3vw,3.4rem)] font-extrabold leading-[1.1]"
          >
            {t("hero.title")}
          </motion.h1>

          <p className="mt-4 max-w-xl text-base text-muted md:text-lg">{t("hero.subtitle")}</p>

          <div className="mt-7 max-w-xl">
            <SearchBar />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {quick.map((q) => (
              <Link
                key={q.id}
                href={`/products?category=${q.id}`}
                className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-bg px-3 py-1.5 text-sm text-ink hover:border-primary hover:bg-primary-soft transition-colors"
              >
                <Icon name={q.icon} size={15} className="text-muted" />
                {tl(categories.find((c) => c.id === q.id)!.name)}
              </Link>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/products" className={buttonClasses("primary", "lg", "max-sm:flex-1")}>
              {t("hero.ctaShop")}
              <Icon name="arrow-end" size={18} className="flip-rtl" />
            </Link>
            <Link href="/register" className={buttonClasses("secondary", "lg", "max-sm:flex-1")}>
              <Icon name="building" size={18} />
              {t("hero.ctaBusiness")}
            </Link>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="nums text-2xl font-extrabold text-ink-strong">{s.value}</dt>
                <dd className="text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* collage (desktop) */}
        <div className="relative hidden h-[26rem] lg:block">
          {collage.map((cat, i) => {
            const pos = [
              "top-2 start-6 rotate-[-4deg]",
              "top-10 end-4 rotate-[3deg]",
              "bottom-6 start-0 rotate-[2deg]",
              "bottom-0 end-16 rotate-[-2deg]",
            ][i];
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                className={`absolute ${pos} w-44 overflow-hidden rounded-xl border border-border bg-bg shadow-[var(--shadow-lg)]`}
              >
                <ProductThumb categoryId={cat} className="aspect-[5/4] w-full" iconSize={52} />
                <div className="flex items-center gap-2 p-3">
                  <Icon name={categories.find((c) => c.id === cat)!.icon as IconName} size={16} className="text-primary" />
                  <span className="truncate text-sm font-bold text-ink-strong">
                    {tl(categories.find((c) => c.id === cat)!.name)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
