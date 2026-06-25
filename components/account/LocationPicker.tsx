"use client";

import { useState } from "react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/cn";
import type { GeoPoint } from "@/data/types";

// Pseudo bounds (~Riyadh) used to map click position <-> mock coordinates.
const B = { latTop: 24.95, latBottom: 24.45, lngLeft: 46.45, lngRight: 46.95 };
const round5 = (n: number) => Math.round(n * 1e5) / 1e5;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function xyToGeo(x: number, y: number): GeoPoint {
  return {
    lat: round5(B.latTop - y * (B.latTop - B.latBottom)),
    lng: round5(B.lngLeft + x * (B.lngRight - B.lngLeft)),
  };
}
function geoToXy(p: GeoPoint) {
  return {
    x: clamp01((p.lng - B.lngLeft) / (B.lngRight - B.lngLeft)),
    y: clamp01((B.latTop - p.lat) / (B.latTop - B.latBottom)),
  };
}

// map-ish backdrop: faint blocks grid + two thicker "roads"
const mapBg =
  "repeating-linear-gradient(0deg, transparent 0 37px, var(--border) 37px 38px)," +
  "repeating-linear-gradient(90deg, transparent 0 45px, var(--border) 45px 46px)," +
  "linear-gradient(115deg, transparent 47%, var(--border-strong) 47% 48.4%, transparent 48.4%)," +
  "linear-gradient(var(--surface-2), var(--surface-2))";

export function LocationPicker({
  value,
  onChange,
}: {
  value: GeoPoint | null;
  onChange: (v: GeoPoint | null) => void;
}) {
  const { t } = useI18n();
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pin = value ? geoToXy(value) : null;

  function onMapClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clamp01((e.clientX - rect.left) / rect.width);
    const y = clamp01((e.clientY - rect.top) / rect.height);
    setError(null);
    onChange(xyToGeo(x, y));
  }

  function useCurrent() {
    if (!navigator.geolocation) {
      setError(t("addr.locationDenied"));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onChange({ lat: round5(pos.coords.latitude), lng: round5(pos.coords.longitude) });
      },
      () => {
        setLocating(false);
        setError(t("addr.locationDenied"));
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onMapClick}
        aria-label={t("addr.pickOnMap")}
        className="relative block aspect-[16/9] w-full overflow-hidden rounded-lg border border-border outline-none focus-visible:border-primary"
        style={{ background: mapBg, backgroundBlendMode: "normal" }}
      >
        {!pin && (
          <span className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <span className="flex flex-col items-center gap-1.5 text-muted">
              <Icon name="pin" size={26} />
              <span className="text-xs font-bold">{t("addr.pickOnMap")}</span>
            </span>
          </span>
        )}
        {pin && (
          <span
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full animate-fade-up"
            style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-ink shadow-[var(--shadow-md)] ring-2 ring-bg">
              <Icon name="pin" size={18} />
            </span>
          </span>
        )}
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={useCurrent}
          disabled={locating}
          className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-surface px-3 py-2 text-sm font-bold text-ink hover:bg-surface-2 disabled:opacity-60"
        >
          <Icon name="pin" size={16} className={cn("text-primary", locating && "animate-pulse")} />
          {locating ? t("addr.locating") : t("addr.useCurrent")}
        </button>

        {value && (
          <>
            <Badge tone="success" icon="check-circle">
              {t("addr.locationSet")}
            </Badge>
            <span className="nums text-xs text-muted" dir="ltr">
              {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
            </span>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs font-bold text-muted hover:text-danger"
            >
              {t("addr.clearLocation")}
            </button>
          </>
        )}
      </div>

      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : (
        <p className="text-xs text-muted">{t("addr.locationHint")}</p>
      )}
    </div>
  );
}
