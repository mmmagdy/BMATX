"use client";

import { OrdersList } from "@/components/account/OrdersList";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { orders } from "@/data/account";

export default function OrdersPage() {
  const { t } = useI18n();
  return (
    <div className="page py-8">
      <h1 className="mb-6 text-2xl font-extrabold md:text-3xl">{t("orders.title")}</h1>
      <div className="mx-auto max-w-3xl">
        <OrdersList orders={orders} />
      </div>
    </div>
  );
}
