"use client";

import { Icon } from "@/lib/icons";
import { SectionHeader } from "./SectionHeader";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { suppliers } from "@/data/suppliers";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { formatNumber } from "@/lib/format";

export function FeaturedSuppliers() {
  const { t, tl } = useI18n();
  return (
    <section className="bg-surface py-12 md:py-16">
      <div className="page">
        <SectionHeader title={t("home.suppliers")} subtitle={t("home.suppliersSub")} href="/products" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((s) => (
            <article
              key={s.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-bg p-4 transition-all duration-200 hover:border-border-strong hover:shadow-[var(--shadow-md)]"
            >
              <span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-lg font-extrabold text-white"
                style={{ background: s.tint }}
                aria-hidden
              >
                {tl(s.name).slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate font-bold text-ink-strong">{tl(s.name)}</h3>
                  {s.verified && <Icon name="shield" size={15} className="shrink-0 text-accent" />}
                </div>
                <p className="flex items-center gap-1 text-xs text-muted">
                  <Icon name="pin" size={12} />
                  {tl(s.location)} · <span className="nums">{formatNumber(s.productCount)}</span> {t("nav.products")}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Rating value={s.rating} reviews={s.reviews} />
                  {s.verified && (
                    <Badge tone="info" icon="check-circle">
                      {t("common.verified")}
                    </Badge>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
