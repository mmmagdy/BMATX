"use client";

import Link from "next/link";
import { Icon } from "@/lib/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  const { t } = useI18n();
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-extrabold">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted md:text-base">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-accent-strong hover:gap-2 transition-all"
        >
          {t("common.viewAll")}
          <Icon name="chevron-end" size={16} className="flip-rtl" />
        </Link>
      )}
    </div>
  );
}
