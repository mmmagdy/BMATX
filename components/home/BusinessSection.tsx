"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/lib/icons";
import { buttonClasses } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/I18nProvider";

const feats: { key: string; icon: IconName }[] = [
  { key: "home.businessFeat1", icon: "package" },
  { key: "home.businessFeat2", icon: "pin" },
  { key: "home.businessFeat3", icon: "layers" },
];

export function BusinessSection() {
  const { t } = useI18n();
  return (
    <section className="page py-12 md:py-16">
      <div className="relative overflow-hidden rounded-xl border border-border bg-ink-strong px-7 py-12 text-white md:px-12 md:py-14">
        <div
          className="pointer-events-none absolute -bottom-24 -end-16 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--primary), transparent 65%)" }}
          aria-hidden
        />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-pill bg-white/10 px-3 py-1.5 text-sm font-bold">
              <Icon name="building" size={16} className="text-primary" />
              B2B
            </span>
            <h2 className="mt-4 text-[clamp(1.5rem,1.2rem+1.5vw,2.4rem)] font-extrabold text-white">
              {t("home.business")}
            </h2>
            <p className="mt-3 max-w-lg text-white/75">{t("home.businessSub")}</p>
            <Link href="/register" className={buttonClasses("primary", "lg", "mt-7")}>
              {t("home.businessCta")}
              <Icon name="arrow-end" size={18} className="flip-rtl" />
            </Link>
          </div>

          <ul className="flex flex-col gap-3">
            {feats.map((f) => (
              <li
                key={f.key}
                className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3.5 ring-1 ring-white/10"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-primary-ink">
                  <Icon name={f.icon} size={20} />
                </span>
                <span className="font-bold text-white">{t(f.key as Parameters<typeof t>[0])}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
