"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/lib/icons";
import { buttonClasses } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Badge } from "@/components/ui/Badge";

export function ComingSoon({
  icon,
  titleAr,
  titleEn,
  noteAr,
  noteEn,
}: {
  icon: IconName;
  titleAr: string;
  titleEn: string;
  noteAr?: string;
  noteEn?: string;
}) {
  const { t, locale } = useI18n();
  const note = locale === "ar" ? noteAr : noteEn;
  return (
    <div className="page flex flex-col items-center gap-5 py-28 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-2xl bg-primary-soft text-[oklch(0.5_0.1_75)]">
        <Icon name={icon} size={38} />
      </span>
      <Badge tone="primary">UI/UX · {locale === "ar" ? "قريبًا" : "Next phase"}</Badge>
      <h1 className="text-2xl font-extrabold md:text-3xl">{locale === "ar" ? titleAr : titleEn}</h1>
      {note && <p className="max-w-md text-muted">{note}</p>}
      <Link href="/" className={buttonClasses("secondary", "lg", "mt-2")}>
        <Icon name="arrow-end" size={18} className="flip-rtl rotate-180" />
        {t("nav.home")}
      </Link>
    </div>
  );
}
