"use client";

import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { DeliveryType } from "@/data/types";

export function DeliveryBadge({ type }: { type: DeliveryType }) {
  const { t } = useI18n();
  return type === "groupable" ? (
    <Badge tone="success" icon="layers">
      {t("delivery.groupable")}
    </Badge>
  ) : (
    <Badge tone="info" icon="truck">
      {t("delivery.single")}
    </Badge>
  );
}
