"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconName } from "@/lib/icons";
import { categories } from "@/data/categories";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "@/components/ui/Logo";

const accountLinks: { href: string; label: string; icon: IconName }[] = [
  { href: "/account", label: "nav.account", icon: "user" },
  { href: "/orders", label: "nav.orders", icon: "package" },
  { href: "/login", label: "nav.signIn", icon: "user" },
];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, tl, dir } = useI18n();
  const offset = dir === "rtl" ? 320 : -320;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink-strong/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed top-0 bottom-0 z-50 flex h-full w-[min(85vw,20rem)] flex-col bg-bg shadow-[var(--shadow-lg)] lg:hidden"
            style={{ insetInlineStart: 0 }}
            initial={{ x: offset, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: offset, opacity: 0.6 }}
            transition={{ type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.28 }}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <Logo />
              <button
                onClick={onClose}
                aria-label={t("nav.menu")}
                className="grid h-10 w-10 place-items-center rounded-md text-ink hover:bg-surface-2"
              >
                <Icon name="close" size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-3">
              <div className="flex flex-col gap-1">
                {accountLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-md px-3 py-3 font-bold text-ink hover:bg-surface-2"
                  >
                    <Icon name={l.icon} size={20} className="text-muted" />
                    {t(l.label as Parameters<typeof t>[0])}
                  </Link>
                ))}
              </div>

              <p className="px-3 pb-2 pt-5 text-xs font-bold uppercase tracking-wide text-muted">
                {t("nav.allCategories")}
              </p>
              <div className="flex flex-col gap-0.5">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/products?category=${c.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-ink hover:bg-surface-2"
                  >
                    <span className="flex items-center gap-3">
                      <Icon name={c.icon as IconName} size={18} className="text-muted" />
                      {tl(c.name)}
                    </span>
                    <Icon name="chevron-end" size={16} className="flip-rtl text-muted" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-border p-4">
              <LanguageToggle className="w-full" />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
