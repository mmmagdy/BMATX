"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/lib/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/cn";

export function SearchBar({ className, autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <form onSubmit={submit} className={cn("relative flex w-full items-center", className)} role="search">
      <span className="pointer-events-none absolute start-3.5 text-muted">
        <Icon name="search" size={20} />
      </span>
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("search.placeholder")}
        aria-label={t("search.button")}
        className="h-12 w-full rounded-pill border border-border bg-surface ps-11 pe-28 text-[0.95rem] text-ink placeholder:text-muted shadow-[var(--shadow-sm)] outline-none transition-colors focus:border-primary focus:bg-bg"
      />
      <button
        type="submit"
        className="absolute end-1.5 inline-flex h-9 items-center gap-1.5 rounded-pill bg-primary px-4 text-sm font-bold text-primary-ink transition-colors hover:bg-primary-strong"
      >
        <Icon name="search" size={16} className="sm:hidden" />
        <span className="hidden sm:inline">{t("search.button")}</span>
      </button>
    </form>
  );
}
