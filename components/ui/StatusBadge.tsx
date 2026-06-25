"use client";

import { Badge } from "./Badge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { IconName } from "@/lib/icons";
import type { CompanyStatus, OrderStatus } from "@/data/types";

type Tone = "neutral" | "success" | "warning" | "info" | "primary";

const orderMap: Record<OrderStatus, { tone: Tone; icon: IconName }> = {
  pending: { tone: "neutral", icon: "info" },
  confirmed: { tone: "info", icon: "check-circle" },
  processing: { tone: "warning", icon: "package" },
  shipped: { tone: "info", icon: "truck" },
  delivered: { tone: "success", icon: "check-circle" },
  cancelled: { tone: "neutral", icon: "close" },
};

const companyMap: Record<CompanyStatus, { tone: Tone; icon: IconName }> = {
  pending: { tone: "warning", icon: "info" },
  approved: { tone: "success", icon: "check-circle" },
  rejected: { tone: "neutral", icon: "close" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useI18n();
  const m = orderMap[status];
  return (
    <Badge tone={m.tone} icon={m.icon}>
      {t(`order.${status}` as Parameters<typeof t>[0])}
    </Badge>
  );
}

export function CompanyStatusBadge({ status }: { status: CompanyStatus }) {
  const { t } = useI18n();
  const m = companyMap[status];
  return (
    <Badge tone={m.tone} icon={m.icon}>
      {t(`status.${status}` as Parameters<typeof t>[0])}
    </Badge>
  );
}
