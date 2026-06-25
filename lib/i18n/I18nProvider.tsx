"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Locale, Localized } from "@/data/types";
import { dictionaries, type DictKey } from "./dictionaries";

interface I18nValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  /** translate a UI key */
  t: (key: DictKey) => string;
  /** pick the active language from a localized data object */
  tl: (value: Localized) => string;
}

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "bmatx.locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  // hydrate from storage once on mount
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "ar" || stored === "en") setLocaleState(stored);
  }, []);

  // keep <html> dir/lang in sync with the active locale
  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = locale === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggleLocale = useCallback(
    () => setLocaleState((l) => (l === "ar" ? "en" : "ar")),
    [],
  );

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      setLocale,
      toggleLocale,
      t: (key) => dictionaries[locale][key] ?? key,
      tl: (v) => v[locale],
    }),
    [locale, setLocale, toggleLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}
