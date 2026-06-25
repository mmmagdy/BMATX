"use client";

import { Icon } from "@/lib/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { formatNumber } from "@/lib/format";

export type SortKey = "newest" | "priceAsc" | "priceDesc" | "popular";

export function SortBar({
  count,
  sort,
  onSortChange,
  onOpenFilters,
  activeFilters,
}: {
  count: number;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  onOpenFilters: () => void;
  activeFilters: number;
}) {
  const { t } = useI18n();
  const options: { key: SortKey; label: string }[] = [
    { key: "newest", label: t("list.sort.newest") },
    { key: "popular", label: t("list.sort.popular") },
    { key: "priceAsc", label: t("list.sort.priceAsc") },
    { key: "priceDesc", label: t("list.sort.priceDesc") },
  ];

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
      <p className="text-sm text-muted">
        <span className="nums font-extrabold text-ink-strong">{formatNumber(count)}</span> {t("list.results")}
      </p>

      <div className="flex items-center gap-2">
        {/* mobile filter trigger */}
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface px-3 py-2 text-sm font-bold text-ink hover:bg-surface-2 lg:hidden"
        >
          <Icon name="filter" size={16} />
          {t("list.openFilters")}
          {activeFilters > 0 && (
            <span className="nums grid h-5 min-w-5 place-items-center rounded-pill bg-primary px-1 text-[0.7rem] text-primary-ink">
              {activeFilters}
            </span>
          )}
        </button>

        <label className="relative inline-flex items-center">
          <Icon name="sort" size={16} className="pointer-events-none absolute start-3 text-muted" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            aria-label={t("list.sort")}
            className="h-10 appearance-none rounded-md border border-border-strong bg-surface ps-9 pe-9 text-sm font-bold text-ink-strong outline-none hover:bg-surface-2 focus:border-primary"
          >
            {options.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
          <Icon name="chevron-down" size={16} className="pointer-events-none absolute end-3 text-muted" />
        </label>
      </div>
    </div>
  );
}
