"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Logo } from "@/components/ui/Logo";
import { categories } from "@/data/categories";

export function Footer() {
  const { t, tl } = useI18n();

  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t("footer.about"),
      links: [
        { label: t("nav.home"), href: "/" },
        { label: t("nav.products"), href: "/products" },
        { label: t("footer.help"), href: "#" },
      ],
    },
    {
      title: t("footer.suppliers"),
      links: [
        { label: t("home.businessCta"), href: "/register" },
        { label: t("footer.legal"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="page grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-muted">{t("brand.tagline")}</p>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-extrabold text-ink-strong">{col.title}</h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted hover:text-ink transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="mb-3 text-sm font-extrabold text-ink-strong">{t("nav.allCategories")}</h4>
          <ul className="flex flex-col gap-2.5">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/products?category=${c.id}`}
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  {tl(c.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <span>© 2026 {t("brand.name")} · {t("footer.rights")}</span>
          <span className="nums">v0.1 — UI/UX preview</span>
        </div>
      </div>
    </footer>
  );
}
