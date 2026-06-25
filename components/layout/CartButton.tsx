"use client";

import Link from "next/link";
import { Icon } from "@/lib/icons";
import { useCart } from "@/lib/cart/CartProvider";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/cn";

export function CartButton({ withLabel = false }: { withLabel?: boolean }) {
  const { count } = useCart();
  const { t } = useI18n();
  return (
    <Link
      href="/cart"
      className={cn(
        "relative inline-flex items-center gap-2 rounded-md px-2.5 py-2 text-ink hover:bg-surface-2 transition-colors",
        withLabel && "font-bold",
      )}
      aria-label={`${t("nav.cart")} (${count})`}
    >
      <span className="relative">
        <Icon name="cart" size={22} />
        {count > 0 && (
          <span className="nums absolute -top-2 -end-2 grid h-5 min-w-5 place-items-center rounded-pill bg-primary px-1 text-[0.7rem] font-extrabold text-primary-ink shadow-[var(--shadow-sm)]">
            {count}
          </span>
        )}
      </span>
      {withLabel && <span className="text-sm">{t("nav.cart")}</span>}
    </Link>
  );
}
