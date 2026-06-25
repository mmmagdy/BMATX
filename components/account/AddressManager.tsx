"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Field, TextInput, Textarea, SelectInput } from "@/components/ui/Field";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { LocationPicker } from "./LocationPicker";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { regions, regionById } from "@/data/regions";
import { addresses as seed } from "@/data/account";
import { cn } from "@/lib/cn";
import type { Address, AddressType, GeoPoint } from "@/data/types";

export const addressTypeIcon: Record<AddressType, IconName> = {
  home: "pin",
  work: "building",
  branch: "package",
  project: "blocks",
};

let uid = 0;
const newId = () => `addr-new-${uid++}`;

export function AddressManager() {
  const { t, tl } = useI18n();
  const [items, setItems] = useState<Address[]>(seed);
  const [editing, setEditing] = useState<Address | null>(null);
  const [adding, setAdding] = useState(false);

  function save(addr: Address) {
    setItems((prev) => {
      let next = editing ? prev.map((a) => (a.id === addr.id ? addr : a)) : [...prev, addr];
      if (addr.isDefault) next = next.map((a) => (a.id === addr.id ? a : { ...a, isDefault: false }));
      return next;
    });
    setEditing(null);
    setAdding(false);
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((a) => a.id !== id));
  }

  function setDefault(id: string) {
    setItems((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }

  const showForm = adding || editing;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{t("addr.makeDefaultHint")}</p>
        {!showForm && (
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setAdding(true);
            }}
          >
            <Icon name="plus" size={16} />
            {t("addr.add")}
          </Button>
        )}
      </div>

      {showForm && (
        <AddressForm
          key={editing?.id ?? "new"}
          initial={editing}
          onCancel={() => {
            setEditing(null);
            setAdding(false);
          }}
          onSave={save}
        />
      )}

      {items.length === 0 && !showForm ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-14 text-center">
          <Icon name="pin" size={26} className="text-muted" />
          <h3 className="font-bold text-ink-strong">{t("addr.empty")}</h3>
          <p className="text-sm text-muted">{t("addr.emptyHint")}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((a) => {
            const r = regionById(a.regionId);
            return (
              <article
                key={a.id}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border bg-bg p-4",
                  a.isDefault ? "border-primary" : "border-border",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-surface-2 text-ink">
                      <Icon name={addressTypeIcon[a.type]} size={18} />
                    </span>
                    <span className="font-bold text-ink-strong">{t(`addr.type.${a.type}` as Parameters<typeof t>[0])}</span>
                  </span>
                  {a.isDefault && <Badge tone="primary" icon="check">{t("addr.default")}</Badge>}
                </div>

                <div className="text-sm text-ink">
                  <p className="font-bold">{a.recipient}</p>
                  <p className="text-muted">{a.line}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-muted">
                    <Icon name="pin" size={13} /> {r && tl(r.name)}
                    <span className="nums" dir="ltr">· {a.phone}</span>
                  </p>
                  {a.location && (
                    <span className="mt-1.5 inline-flex items-center gap-1.5">
                      <Badge tone="success" icon="check-circle">{t("addr.locationSet")}</Badge>
                      <span className="nums text-xs text-muted" dir="ltr">
                        {a.location.lat.toFixed(4)}, {a.location.lng.toFixed(4)}
                      </span>
                    </span>
                  )}
                </div>

                <div className="mt-auto flex items-center gap-1 border-t border-border pt-3">
                  {!a.isDefault && (
                    <button
                      onClick={() => setDefault(a.id)}
                      className="rounded-md px-2.5 py-1.5 text-xs font-bold text-accent-strong hover:bg-surface-2"
                    >
                      {t("addr.setDefault")}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setAdding(false);
                      setEditing(a);
                    }}
                    className="ms-auto inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-bold text-ink hover:bg-surface-2"
                  >
                    <Icon name="filter" size={13} /> {t("common.edit")}
                  </button>
                  <button
                    onClick={() => remove(a.id)}
                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-bold text-muted hover:bg-danger-soft hover:text-danger"
                  >
                    <Icon name="trash" size={13} /> {t("common.delete")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Address | null;
  onSave: (a: Address) => void;
  onCancel: () => void;
}) {
  const { t, tl } = useI18n();
  const [type, setType] = useState<AddressType>(initial?.type ?? "home");
  const [recipient, setRecipient] = useState(initial?.recipient ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [regionId, setRegionId] = useState(initial?.regionId ?? "");
  const [line, setLine] = useState(initial?.line ?? "");
  const [location, setLocation] = useState<GeoPoint | null>(initial?.location ?? null);
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);

  return (
    <form
      className="rounded-xl border border-primary/50 bg-surface p-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          id: initial?.id ?? newId(),
          type,
          recipient,
          phone,
          regionId,
          line,
          location: location ?? undefined,
          isDefault,
        });
      }}
    >
      <h3 className="mb-4 font-extrabold text-ink-strong">{initial ? t("common.edit") : t("addr.add")}</h3>

      <div className="flex flex-col gap-4">
        <Field label={t("addr.type")}>
          <SegmentedControl
            wrap
            className="w-full"
            value={type}
            onChange={setType}
            options={[
              { value: "home", label: t("addr.type.home"), icon: "pin" },
              { value: "work", label: t("addr.type.work"), icon: "building" },
              { value: "branch", label: t("addr.type.branch"), icon: "package" },
              { value: "project", label: t("addr.type.project"), icon: "blocks" },
            ]}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("addr.recipient")} htmlFor="a-recipient">
            <TextInput
              id="a-recipient"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </Field>
          <Field label={t("addr.phone")} htmlFor="a-phone">
            <TextInput id="a-phone" required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
        </div>

        <Field label={t("reg.region")} htmlFor="a-region">
          <SelectInput id="a-region" required value={regionId} onChange={(e) => setRegionId(e.target.value)}>
            <option value="" disabled>
              {t("reg.selectRegion")}
            </option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {tl(r.name)}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field label={t("addr.details")} htmlFor="a-line">
          <Textarea
            id="a-line"
            required
            placeholder={t("addr.detailsPh")}
            value={line}
            onChange={(e) => setLine(e.target.value)}
          />
        </Field>

        <Field label={t("addr.location")} optional>
          <LocationPicker value={location} onChange={setLocation} />
        </Field>

        <label className="flex items-center gap-2.5 text-sm font-bold text-ink">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-[18px] w-[18px] accent-[var(--primary)]"
          />
          {t("addr.setDefault")}
        </label>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {t("addr.save")}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
        </div>
      </div>
    </form>
  );
}
