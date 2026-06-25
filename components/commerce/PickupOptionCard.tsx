"use client";

import { Icon } from "@/lib/icons";
import { Badge } from "@/components/ui/Badge";
import { SupplierBadge } from "./SupplierBadge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { warehouseById } from "@/data/warehouses";
import { regionById } from "@/data/regions";

/** Pickup details for a warehouse (used in checkout pickup mode). */
export function PickupOptionCard({ warehouseId }: { warehouseId: string }) {
  const { t, tl } = useI18n();
  const wh = warehouseById(warehouseId);
  if (!wh) return null;
  const region = regionById(wh.regionId);

  const rows: { icon: "pin" | "building" | "user" | "info"; label: string; value: string }[] = [
    { icon: "building", label: t("sup.warehouse"), value: tl(wh.name) },
    { icon: "pin", label: t("pickup.address"), value: `${tl(wh.address)}${region ? ` — ${tl(region.name)}` : ""}` },
    { icon: "user", label: t("pickup.phone"), value: wh.phone },
  ];

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-bold text-ink-strong">
          <Icon name="building" size={18} className="text-primary" />
          {t("pickup.title")}
        </span>
        <Badge tone="success" icon="check-circle">{t("pickup.free")}</Badge>
      </div>

      <p className="mb-3 text-sm text-muted">{t("pickup.desc")}</p>

      <SupplierBadge supplierId={wh.supplierId} showAvatar className="mb-3" />

      <dl className="flex flex-col gap-2 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-2">
            <Icon name={r.icon} size={15} className="mt-0.5 shrink-0 text-muted" />
            <dt className="shrink-0 text-muted">{r.label}:</dt>
            <dd className="font-bold text-ink-strong" dir="auto">{r.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-start gap-2 rounded-lg bg-surface p-3 text-xs text-muted">
        <Icon name="info" size={14} className="mt-0.5 shrink-0 text-accent" />
        <span>
          <span className="font-bold text-ink">{t("pickup.instructions")}:</span> {t("pickup.instructionsText")}
        </span>
      </div>
    </div>
  );
}
