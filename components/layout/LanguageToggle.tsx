"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/cn";

export function LanguageToggle({ className }: { className?: string }) {
  const { t, toggleLocale } = useI18n();
  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={cn(
        "inline-flex items-center justify-center h-9 min-w-12 px-3 rounded-md text-sm font-bold text-ink border border-border hover:bg-surface-2 transition-colors",
        className,
      )}
      aria-label="Switch language"
    >
      {t("lang.toggle")}
    </button>
  );
}
