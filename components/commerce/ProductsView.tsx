"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "./ProductGrid";
import { Filters, emptyFilters, PRICE_CEILING, type FilterState } from "./Filters";
import { SortBar, type SortKey } from "./SortBar";
import { products } from "@/data/products";
import { useI18n } from "@/lib/i18n/I18nProvider";

function countActive(f: FilterState): number {
  return (
    f.categories.length +
    f.regions.length +
    f.suppliers.length +
    (f.delivery !== "all" ? 1 : 0) +
    (f.maxPrice < PRICE_CEILING ? 1 : 0)
  );
}

export function ProductsView() {
  const { t, dir } = useI18n();
  const params = useSearchParams();

  const initialCategory = params.get("category");
  const q = (params.get("q") ?? "").trim().toLowerCase();
  const initialSort = (params.get("sort") as SortKey) ?? "newest";

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...emptyFilters(),
    categories: initialCategory ? [initialCategory] : [],
  }));
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const result = useMemo(() => {
    let list = products.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.categoryId)) return false;
      if (filters.suppliers.length && !filters.suppliers.includes(p.supplierId)) return false;
      if (filters.regions.length && !p.regionIds.some((r) => filters.regions.includes(r))) return false;
      if (filters.delivery !== "all" && p.delivery !== filters.delivery) return false;
      if (p.price > filters.maxPrice) return false;
      if (q) {
        const hay = `${p.name.ar} ${p.name.en}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "popular":
          return b.popularity - a.popularity;
        default:
          return b.addedOrder - a.addedOrder;
      }
    });
    return list;
  }, [filters, sort, q]);

  const active = countActive(filters);
  const offset = dir === "rtl" ? -340 : 340;

  return (
    <div className="page py-8">
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-extrabold md:text-3xl">{t("list.title")}</h1>
        {q && <span className="text-muted">“{params.get("q")}”</span>}
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-44 max-h-[calc(100dvh-12rem)] overflow-auto pe-2">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 font-extrabold text-ink-strong">
                <Icon name="filter" size={18} />
                {t("list.filters")}
              </span>
              {active > 0 && (
                <button
                  onClick={() => setFilters(emptyFilters())}
                  className="text-sm font-bold text-accent-strong hover:underline"
                >
                  {t("list.clearFilters")}
                </button>
              )}
            </div>
            <Filters value={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* results */}
        <div>
          <SortBar
            count={result.length}
            sort={sort}
            onSortChange={setSort}
            onOpenFilters={() => setDrawerOpen(true)}
            activeFilters={active}
          />

          {result.length > 0 ? (
            <div className="pt-5">
              <ProductGrid products={result} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-muted">
                <Icon name="search" size={28} />
              </span>
              <h2 className="text-lg font-bold text-ink-strong">{t("list.empty")}</h2>
              <p className="text-sm text-muted">{t("list.emptyHint")}</p>
              <Button variant="secondary" onClick={() => setFilters(emptyFilters())}>
                {t("list.clearFilters")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink-strong/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="fixed top-0 bottom-0 z-50 flex h-full w-[min(88vw,22rem)] flex-col bg-bg shadow-[var(--shadow-lg)] lg:hidden"
              style={{ insetInlineEnd: 0 }}
              initial={{ x: offset }}
              animate={{ x: 0 }}
              exit={{ x: offset }}
              transition={{ type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.28 }}
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <span className="flex items-center gap-2 font-extrabold text-ink-strong">
                  <Icon name="filter" size={18} />
                  {t("list.filters")}
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label={t("nav.menu")}
                  className="grid h-10 w-10 place-items-center rounded-md hover:bg-surface-2"
                >
                  <Icon name="close" size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <Filters value={filters} onChange={setFilters} />
              </div>
              <div className="flex gap-2 border-t border-border p-4">
                <Button variant="secondary" className="flex-1" onClick={() => setFilters(emptyFilters())}>
                  {t("list.clearFilters")}
                </Button>
                <Button className="flex-[2]" onClick={() => setDrawerOpen(false)}>
                  {t("list.applyFilters")} ({result.length})
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
