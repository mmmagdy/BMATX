"use client";

import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { CartProvider } from "@/lib/cart/CartProvider";
import { WalletProvider } from "@/lib/wallet/WalletProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <WalletProvider>
        <CartProvider>{children}</CartProvider>
      </WalletProvider>
    </I18nProvider>
  );
}
