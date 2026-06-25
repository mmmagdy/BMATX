"use client";

import { Icon } from "@/lib/icons";
import { categories } from "@/data/categories";
import { regions } from "@/data/regions";
import { suppliers } from "@/data/suppliers";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";

export interface FilterState {
  categories: string[];
  regions: string[];
  suppliers: string[];
  delivery: "all" | "single" | "groupable";
  maxPrice: number;
}

export const PRICE_CEILING = 3500;

export const emptyFilters = (): FilterState => ({
  categories: [],
  regions: [],
  suppliers: [],
  delivery: "all",
  maxPrice: PRICE_CEILING,
});

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function CheckRow({
  checked,
  onClick,
  label,
  count,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-start text-sm hover:bg-surface-2 transition-colors"
    >
      <span
        className={cn(
          "grid h-[18px] w-[18px] shrink-0 place-items-center rounded border transition-colors",
          checked ? "border-primary bg-primary text-primary-ink" : "border-border-strong bg-bg",
        )}
      >
        {checked && <Icon name="check" size={13} />}
      </span>
      <span className={cn("flex-1 truncate", checked ? "font-bold text-ink-strong" : "text-ink")}>{label}</span>
      {count !== undefined && <span className="nums text-xs text-muted">{count}</span>}
    </button>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border py-4 first:pt-0 last:border-0">
      <h3 className="mb-2 px-2 text-sm font-extrabold text-ink-strong">{title}</h3>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

export function Filters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const { t, tl } = useI18n();
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });

  return (
    <div className="flex flex-col">
      <Group title={t("list.filter.category")}>
        {categories.map((c) => (
          <CheckRow
            key={c.id}
            checked={value.categories.includes(c.id)}
            onClick={() => set({ categories: toggle(value.categories, c.id) })}
            label={tl(c.name)}
            count={c.productCount}
          />
        ))}
      </Group>

      <Group title={t("list.filter.delivery")}>
        {(["all", "groupable", "single"] as const).map((d) => (
          <CheckRow
            key={d}
            checked={value.delivery === d}
            onClick={() => set({ delivery: d })}
            label={
              d === "all"
                ? t("common.viewAll")
                : d === "groupable"
                  ? t("delivery.groupable")
                  : t("delivery.single")
            }
          />
        ))}
      </Group>

      <Group title={t("list.filter.region")}>
        {regions.map((r) => (
          <CheckRow
            key={r.id}
            checked={value.regions.includes(r.id)}
            onClick={() => set({ regions: toggle(value.regions, r.id) })}
            label={tl(r.name)}
          />
        ))}
      </Group>

      <Group title={t("list.filter.supplier")}>
        {suppliers.map((s) => (
          <CheckRow
            key={s.id}
            checked={value.suppliers.includes(s.id)}
            onClick={() => set({ suppliers: toggle(value.suppliers, s.id) })}
            label={tl(s.name)}
          />
        ))}
      </Group>

      <Group title={t("list.filter.price")}>
        <div className="px-2 pt-1">
          <input
            type="range"
            min={0}
            max={PRICE_CEILING}
            step={50}
            value={value.maxPrice}
            onChange={(e) => set({ maxPrice: Number(e.target.value) })}
            className="w-full accent-[var(--primary)]"
            aria-label={t("list.filter.price")}
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span className="nums">0</span>
            <span className="nums font-bold text-ink">
              ≤ {formatNumber(value.maxPrice)} {t("common.currency")}
            </span>
          </div>
        </div>
      </Group>
    </div>
  );
}
