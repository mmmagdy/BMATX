"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/lib/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Logo } from "@/components/ui/Logo";
import { SearchBar } from "./SearchBar";
import { RegionPicker } from "./RegionPicker";
import { CartButton } from "./CartButton";
import { LanguageToggle } from "./LanguageToggle";
import { CategoryNav } from "./CategoryNav";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-md">
      {/* ---- main row ---- */}
      <div className="page flex items-center gap-3 py-3">
        {/* mobile menu trigger */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label={t("nav.menu")}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-ink hover:bg-surface-2 lg:hidden"
        >
          <Icon name="menu" size={24} />
        </button>

        <Logo className="shrink-0" />

        {/* desktop search */}
        <div className="mx-2 hidden flex-1 lg:flex">
          <SearchBar />
        </div>

        {/* desktop right cluster */}
        <div className="ms-auto hidden items-center gap-1 lg:flex">
          <RegionPicker />
          <span className="mx-1 h-7 w-px bg-border" />
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-ink hover:bg-surface-2 transition-colors"
          >
            <Icon name="user" size={20} className="text-muted" />
            {t("nav.signIn")}
          </Link>
          <Link
            href="/orders"
            className="rounded-md px-3 py-2 text-sm font-bold text-ink hover:bg-surface-2 transition-colors"
          >
            {t("nav.orders")}
          </Link>
          <LanguageToggle />
          <CartButton withLabel />
        </div>

        {/* mobile right cluster */}
        <div className="ms-auto flex items-center gap-1 lg:hidden">
          <LanguageToggle />
          <CartButton />
        </div>
      </div>

      {/* ---- mobile search row ---- */}
      <div className="page pb-3 lg:hidden">
        <SearchBar />
      </div>

      {/* ---- category nav (desktop) ---- */}
      <div className="hidden lg:block">
        <CategoryNav />
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
