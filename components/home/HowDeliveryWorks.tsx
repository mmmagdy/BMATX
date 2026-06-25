"use client";

import { Icon, type IconName } from "@/lib/icons";
import { SectionHeader } from "./SectionHeader";
import { useI18n } from "@/lib/i18n/I18nProvider";

const steps: { n: number; key: string; icon: IconName }[] = [
  { n: 1, key: "step1", icon: "pin" },
  { n: 2, key: "step2", icon: "layers" },
  { n: 3, key: "step3", icon: "info" },
];

export function HowDeliveryWorks() {
  const { t } = useI18n();
  return (
    <section className="bg-surface py-12 md:py-16">
      <div className="page">
        <SectionHeader title={t("home.delivery")} subtitle={t("home.deliverySub")} />
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.key} className="relative flex flex-col gap-3 rounded-lg border border-border bg-bg p-6">
              <div className="flex items-center gap-3">
                <span className="nums grid h-10 w-10 place-items-center rounded-full bg-primary text-base font-extrabold text-primary-ink">
                  {s.n}
                </span>
                <Icon name={s.icon} size={22} className="text-accent" />
              </div>
              <h3 className="text-lg font-bold text-ink-strong">{t(`delivery.${s.key}.title` as Parameters<typeof t>[0])}</h3>
              <p className="text-sm text-muted">{t(`delivery.${s.key}.desc` as Parameters<typeof t>[0])}</p>
              {i < steps.length - 1 && (
                <Icon
                  name="chevron-end"
                  size={20}
                  className="flip-rtl absolute -end-5 top-9 hidden text-border-strong md:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
