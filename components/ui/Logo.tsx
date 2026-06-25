"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { t } = useI18n();
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 group", className)} aria-label={t("brand.name")}>
      <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary text-primary-ink shadow-[var(--shadow-sm)] transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3 4 7v10l8 4 8-4V7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M4 7l8 4 8-4M12 11v10" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact && (
        <span className="text-xl font-extrabold tracking-tight text-ink-strong">{t("brand.name")}</span>
      )}
    </Link>
  );
}
