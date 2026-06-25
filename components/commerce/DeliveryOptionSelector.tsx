"use client";

import { Icon, type IconName } from "@/lib/icons";
import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/cn";

export type ReceiveMode = "delivery" | "pickup";

export function DeliveryOptionSelector({
  value,
  onChange,
  pickupAvailable = true,
}: {
  value: ReceiveMode;
  onChange: (m: ReceiveMode) => void;
  pickupAvailable?: boolean;
}) {
  const { t } = useI18n();

  const options: { id: ReceiveMode; icon: IconName; title: string; desc: string; disabled?: boolean }[] = [
    { id: "delivery", icon: "truck", title: t("recv.delivery"), desc: t("recv.deliveryDesc") },
    {
      id: "pickup",
      icon: "building",
      title: t("recv.pickup"),
      desc: t("recv.pickupDesc"),
      disabled: !pickupAvailable,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            disabled={o.disabled}
            onClick={() => onChange(o.id)}
            className={cn(
              "flex items-start gap-3 rounded-xl border-2 p-4 text-start transition-colors disabled:opacity-50",
              active ? "border-primary bg-primary-soft/40" : "border-border hover:border-border-strong",
            )}
          >
            <span
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-lg",
                active ? "bg-primary text-primary-ink" : "bg-surface-2 text-ink",
              )}
            >
              <Icon name={o.icon} size={20} />
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-2 font-bold text-ink-strong">
                {o.title}
                {o.id === "pickup" && <Badge tone="success">{t("pickup.free")}</Badge>}
              </span>
              <span className="block text-sm text-muted">{o.desc}</span>
            </span>
            <span
              className={cn(
                "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                active ? "border-primary bg-primary text-primary-ink" : "border-border",
              )}
            >
              {active && <Icon name="check" size={12} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
