"use client";

import Link from "next/link";
import { Icon } from "@/lib/icons";
import { buttonClasses } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function CtaSection() {
  const { t } = useI18n();
  return (
    <section className="page pb-16 pt-4">
      <div className="flex flex-col items-center gap-6 rounded-xl border border-primary/40 bg-primary-soft px-6 py-12 text-center">
        <h2 className="text-[clamp(1.5rem,1.2rem+1.5vw,2.2rem)] font-extrabold text-ink-strong">
          {t("cta.title")}
        </h2>
        <p className="max-w-md text-muted">{t("cta.subtitle")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/register?type=individual" className={buttonClasses("primary", "lg")}>
            <Icon name="user" size={18} />
            {t("cta.individual")}
          </Link>
          <Link href="/register?type=business" className={buttonClasses("secondary", "lg")}>
            <Icon name="building" size={18} />
            {t("cta.business")}
          </Link>
        </div>
      </div>
    </section>
  );
}
