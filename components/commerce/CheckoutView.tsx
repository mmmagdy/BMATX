"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon, type IconName } from "@/lib/icons";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SupplierBadge } from "./SupplierBadge";
import { ShipmentGroup } from "./ShipmentGroup";
import { PickupOptionCard } from "./PickupOptionCard";
import { DeliveryOptionSelector, type ReceiveMode } from "./DeliveryOptionSelector";
import { WalletPaymentToggle } from "@/components/wallet/WalletPaymentToggle";
import { addressTypeIcon } from "@/components/account/AddressManager";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useCart } from "@/lib/cart/CartProvider";
import { productById } from "@/data/products";
import { warehouseById } from "@/data/warehouses";
import { regionById } from "@/data/regions";
import { addresses as savedAddresses, defaultRegionId } from "@/data/account";
import { buildShipments, productFulfillment } from "@/data/logistics";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Address, Shipment } from "@/data/types";

type Step = 0 | 1 | 2 | 3;
type PayMethod = "card";

export function CheckoutView() {
  const { t, tl } = useI18n();
  const { lines, subtotal, clear } = useCart();

  const [step, setStep] = useState<Step>(0);
  const [receive, setReceive] = useState<ReceiveMode>("delivery");
  const [addrId, setAddrId] = useState<string>(
    (savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0])?.id ?? "",
  );
  const [walletUsed, setWalletUsed] = useState(0);
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [placed, setPlaced] = useState<null | { number: string; remaining: number; walletUsed: number }>(null);

  const address = savedAddresses.find((a) => a.id === addrId);
  const regionId = receive === "delivery" ? address?.regionId ?? defaultRegionId : defaultRegionId;

  const shipments = useMemo(() => buildShipments(lines, regionId), [lines, regionId]);

  const pickupAllowed = useMemo(() => {
    if (!shipments.length) return false;
    const allWhPickup = shipments.every((s) => warehouseById(s.warehouseId)?.pickupAvailable);
    const anyDeliveryOnly = lines.some((l) => {
      const p = productById(l.productId);
      return p && productFulfillment(p) === "delivery_only";
    });
    return allWhPickup && !anyDeliveryOnly;
  }, [shipments, lines]);

  const effectiveReceive: ReceiveMode = receive === "pickup" && pickupAllowed ? "pickup" : "delivery";
  const deliveryTotal = effectiveReceive === "pickup" ? 0 : shipments.reduce((n, s) => n + s.deliveryCost, 0);
  const total = subtotal + deliveryTotal;
  const remaining = Math.max(0, total - walletUsed);
  const itemsCount = lines.reduce((n, l) => n + l.quantity, 0);

  if (placed) return <OrderPlaced number={placed.number} remaining={placed.remaining} walletUsed={placed.walletUsed} />;

  if (lines.length === 0) {
    return (
      <div className="page flex flex-col items-center gap-4 py-24 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-surface-2 text-muted">
          <Icon name="cart" size={36} />
        </span>
        <h1 className="text-2xl font-extrabold">{t("cart.empty")}</h1>
        <Link href="/products" className={buttonClasses("primary", "lg")}>{t("cart.startShopping")}</Link>
      </div>
    );
  }

  function placeOrder() {
    const number = `BMX-${24000 + (Math.round(subtotal) % 6000)}`;
    setPlaced({ number, remaining, walletUsed });
    clear();
  }

  // unique pickup warehouses
  const pickupWarehouses = [...new Set(shipments.map((s) => s.warehouseId))];

  return (
    <div className="page py-8">
      <h1 className="mb-6 text-2xl font-extrabold md:text-3xl">{t("co.title")}</h1>

      <Stepper step={step} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          {/* STEP 0 — receive method + address */}
          {step === 0 && (
            <section className="flex flex-col gap-5">
              <div>
                <h2 className="mb-3 text-lg font-extrabold text-ink-strong">{t("recv.title")}</h2>
                <DeliveryOptionSelector value={effectiveReceive} onChange={setReceive} pickupAvailable={pickupAllowed} />
              </div>

              {effectiveReceive === "delivery" ? (
                <AddressStep addresses={savedAddresses} selected={addrId} onSelect={setAddrId} />
              ) : (
                <div className="flex items-start gap-2.5 rounded-lg border border-border bg-surface p-4 text-sm">
                  <Icon name="info" size={18} className="mt-0.5 shrink-0 text-accent" />
                  <p className="text-muted">{t("pickup.desc")}</p>
                </div>
              )}
            </section>
          )}

          {/* STEP 1 — review items per shipment */}
          {step === 1 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-extrabold text-ink-strong">{t("co.reviewItems")}</h2>
              {shipments.length > 1 && (
                <p className="flex items-center gap-1.5 text-sm text-muted">
                  <Icon name="package" size={15} className="text-accent" /> {t("ship.multiNote")}
                </p>
              )}
              {shipments.map((s, i) => (
                <ShipmentGroup key={s.id} shipment={s} index={i + 1} total={shipments.length} mode={effectiveReceive} />
              ))}
            </section>
          )}

          {/* STEP 2 — delivery breakdown OR pickup locations */}
          {step === 2 &&
            (effectiveReceive === "delivery" ? (
              <DeliveryBreakdown shipments={shipments} regionId={regionId} total={deliveryTotal} />
            ) : (
              <section className="flex flex-col gap-4">
                <h2 className="text-lg font-extrabold text-ink-strong">{t("ship.pickupPoint")}</h2>
                {pickupWarehouses.map((wid) => (
                  <PickupOptionCard key={wid} warehouseId={wid} />
                ))}
              </section>
            ))}

          {/* STEP 3 — confirm + payment */}
          {step === 3 && (
            <ConfirmStep
              receive={effectiveReceive}
              address={address}
              regionName={regionId ? tl(regionById(regionId)?.name ?? { ar: "", en: "" }) : ""}
              pickupWarehouses={pickupWarehouses}
              total={total}
              walletUsed={walletUsed}
              setWalletUsed={setWalletUsed}
              remaining={remaining}
              payMethod={payMethod}
              setPayMethod={setPayMethod}
            />
          )}

          {/* nav */}
          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep((s) => (s - 1) as Step)}>
                <Icon name="chevron-end" size={18} className="rotate-180 flip-rtl" />
                {t("co.back")}
              </Button>
            ) : (
              <Link href="/cart" className={buttonClasses("ghost", "md")}>
                <Icon name="cart" size={18} />
                {t("nav.cart")}
              </Link>
            )}

            {step < 3 ? (
              <Button onClick={() => setStep((s) => (s + 1) as Step)} disabled={step === 0 && effectiveReceive === "delivery" && !addrId}>
                {t("co.next")}
                <Icon name="arrow-end" size={18} className="flip-rtl" />
              </Button>
            ) : (
              <Button size="lg" onClick={placeOrder}>
                <Icon name="check-circle" size={20} />
                {t("co.placeOrder")}
              </Button>
            )}
          </div>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-44 lg:self-start">
          <div className="rounded-xl border border-border p-5">
            <h2 className="mb-4 text-lg font-extrabold text-ink-strong">{t("co.summary")}</h2>

            {effectiveReceive === "delivery" && address && (
              <SummaryShipTo title={t("co.shipTo")} icon={addressTypeIcon[address.type]} lines={[
                tl(regionById(address.regionId)?.name ?? { ar: "", en: "" }),
                address.line,
              ]} label={t(`addr.type.${address.type}` as Parameters<typeof t>[0])} />
            )}
            {effectiveReceive === "pickup" && (
              <SummaryShipTo title={t("ship.pickupPoint")} icon="building" label={t("recv.pickup")} lines={[
                `${pickupWarehouses.length} ${t("sup.warehouse")}`,
              ]} />
            )}

            <dl className="flex flex-col gap-3 text-sm">
              <Row label={`${t("cart.subtotal")} (${itemsCount})`} value={`${formatNumber(subtotal)} ${t("common.currency")}`} />
              <Row
                label={effectiveReceive === "pickup" ? t("recv.pickup") : t("sum.deliveryTotal")}
                value={effectiveReceive === "pickup" ? t("pickup.free") : `${formatNumber(deliveryTotal)} ${t("common.currency")}`}
                icon="truck"
              />
              <div className="my-1 h-px bg-border" />
              <Row label={t("cart.total")} value={`${formatNumber(total)} ${t("common.currency")}`} strong />
              {walletUsed > 0 && (
                <Row label={t("sum.walletUsed")} value={`−${formatNumber(walletUsed)} ${t("common.currency")}`} icon="spark" credit />
              )}
              {walletUsed > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-base font-extrabold text-ink-strong">{t("sum.remainingPay")}</dt>
                  <dd className="nums text-xl font-extrabold text-ink-strong">
                    {formatNumber(remaining)} <span className="text-sm font-bold text-muted">{t("common.currency")}</span>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- helpers */
function Row({
  label,
  value,
  icon,
  strong,
  credit,
}: {
  label: string;
  value: string;
  icon?: IconName;
  strong?: boolean;
  credit?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={cn("flex items-center gap-1.5", strong ? "text-base font-extrabold text-ink-strong" : "text-muted")}>
        {icon && <Icon name={icon} size={15} />}
        {label}
      </dt>
      <dd className={cn("nums font-bold", strong ? "text-base text-ink-strong" : credit ? "text-success" : "text-ink")} dir="ltr">
        {value}
      </dd>
    </div>
  );
}

function SummaryShipTo({ title, label, icon, lines }: { title: string; label: string; icon: IconName; lines: string[] }) {
  return (
    <div className="mb-4 rounded-lg bg-surface p-3 text-sm">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-muted">
        <Icon name={icon} size={13} /> {title}
      </p>
      <p className="font-bold text-ink-strong">{label}</p>
      {lines.filter(Boolean).map((l, i) => (
        <p key={i} className="text-muted">{l}</p>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- stepper */
function Stepper({ step }: { step: Step }) {
  const { t } = useI18n();
  const steps: { key: string; icon: IconName }[] = [
    { key: "co.step.address", icon: "pin" },
    { key: "co.step.review", icon: "package" },
    { key: "co.step.delivery", icon: "truck" },
    { key: "co.step.confirm", icon: "check-circle" },
  ];
  return (
    <ol className="flex items-center gap-2">
      {steps.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={s.key} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition-colors",
                done && "border-primary bg-primary text-primary-ink",
                active && "border-primary text-primary",
                !done && !active && "border-border text-muted",
              )}
            >
              {done ? <Icon name="check" size={18} /> : <Icon name={s.icon} size={17} />}
            </span>
            <span className={cn("hidden text-sm font-bold sm:block", active || done ? "text-ink-strong" : "text-muted")}>
              {t(s.key as Parameters<typeof t>[0])}
            </span>
            {i < steps.length - 1 && (
              <span className={cn("mx-1 h-0.5 flex-1 rounded-full", done ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* -------------------------------------------------------------- step: addr */
function AddressStep({
  addresses,
  selected,
  onSelect,
}: {
  addresses: Address[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const { t, tl } = useI18n();
  return (
    <div>
      <h2 className="mb-3 text-lg font-extrabold text-ink-strong">{t("co.selectAddress")}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.map((a) => {
          const r = regionById(a.regionId);
          const active = a.id === selected;
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              className={cn(
                "flex flex-col gap-1.5 rounded-xl border-2 p-4 text-start transition-colors",
                active ? "border-primary bg-primary-soft/40" : "border-border hover:border-border-strong",
              )}
            >
              <span className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-ink-strong">
                  <Icon name={addressTypeIcon[a.type]} size={17} />
                  {t(`addr.type.${a.type}` as Parameters<typeof t>[0])}
                </span>
                <span className={cn("grid h-5 w-5 place-items-center rounded-full border-2", active ? "border-primary bg-primary text-primary-ink" : "border-border")}>
                  {active && <Icon name="check" size={12} />}
                </span>
              </span>
              <span className="text-sm text-muted">{a.line}</span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Icon name="pin" size={12} /> {r && tl(r.name)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ step: delivery cost */
function DeliveryBreakdown({ shipments, regionId, total }: { shipments: Shipment[]; regionId: string; total: number }) {
  const { t, tl } = useI18n();
  const region = regionById(regionId);
  return (
    <section>
      <h2 className="mb-1 text-lg font-extrabold text-ink-strong">{t("co.deliveryBreakdown")}</h2>
      <p className="mb-4 flex items-start gap-1.5 text-sm text-muted">
        <Icon name="info" size={15} className="mt-0.5 shrink-0 text-accent" />
        {t("co.deliveryWhy")}
      </p>

      <div className="flex flex-col gap-3">
        {shipments.map((s, i) => {
          const wh = warehouseById(s.warehouseId);
          return (
            <div key={s.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {shipments.length > 1 && (
                    <Badge tone="primary" icon="package">{t("ship.title")} <span className="nums">{i + 1}</span></Badge>
                  )}
                  <SupplierBadge supplierId={s.supplierId} />
                </div>
                <span className="nums font-extrabold text-ink-strong">
                  {formatNumber(s.deliveryCost)} <span className="text-xs font-bold text-muted">{t("common.currency")}</span>
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge tone="neutral" icon="package">{wh && tl(wh.name)}</Badge>
                <Badge tone="neutral" icon="pin">{region && tl(region.name)}</Badge>
                <Badge tone="info" icon="info">
                  <span className="nums">{s.minDays}–{s.maxDays}</span> {t("del.days")}
                </Badge>
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
          <span className="font-extrabold text-ink-strong">{t("sum.deliveryTotal")}</span>
          <span className="nums font-extrabold text-ink-strong">
            {formatNumber(total)} <span className="text-xs font-bold text-muted">{t("common.currency")}</span>
          </span>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- step: confirm */
function ConfirmStep({
  receive,
  address,
  regionName,
  pickupWarehouses,
  total,
  walletUsed,
  setWalletUsed,
  remaining,
  payMethod,
  setPayMethod,
}: {
  receive: ReceiveMode;
  address?: Address;
  regionName: string;
  pickupWarehouses: string[];
  total: number;
  walletUsed: number;
  setWalletUsed: (n: number) => void;
  remaining: number;
  payMethod: PayMethod;
  setPayMethod: (m: PayMethod) => void;
}) {
  const { t, tl } = useI18n();
  const { lines } = useCart();

  const methods: { id: PayMethod; label: string; icon: IconName }[] = [
    { id: "card", label: t("pay.card"), icon: "shield" },
  ];

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-lg font-extrabold text-ink-strong">{t("co.step.confirm")}</h2>

      {receive === "delivery" && address ? (
        <div className="rounded-xl border border-border p-4">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-muted">
            <Icon name="pin" size={13} /> {t("co.shipTo")}
          </p>
          <p className="font-bold text-ink-strong">
            {t(`addr.type.${address.type}` as Parameters<typeof t>[0])} · {address.recipient}
          </p>
          <p className="text-sm text-muted">{address.line} — {regionName}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border p-4">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-muted">
            <Icon name="building" size={13} /> {t("ship.pickupPoint")}
          </p>
          <p className="font-bold text-ink-strong">
            {pickupWarehouses.length} {t("sup.warehouse")}
          </p>
          <p className="text-sm text-muted">{t("pickup.desc")}</p>
        </div>
      )}

      {/* items */}
      <div className="rounded-xl border border-border p-4">
        <p className="mb-3 text-xs font-bold text-muted">{t("co.summary")}</p>
        <ul className="flex flex-col gap-2">
          {lines.map((l) => {
            const p = productById(l.productId);
            return p ? (
              <li key={`${l.productId}-${l.warehouseId}`} className="flex items-center justify-between gap-2 text-sm">
                <span className="line-clamp-1 text-ink">{tl(p.name)}</span>
                <span className="nums shrink-0 text-muted">
                  × {l.quantity} · <span className="font-bold text-ink-strong">{formatNumber(p.price * l.quantity)}</span>
                </span>
              </li>
            ) : null;
          })}
        </ul>
      </div>

      {/* wallet */}
      <div>
        <h3 className="mb-2 text-sm font-extrabold text-ink-strong">{t("wallet.title")}</h3>
        <WalletPaymentToggle total={total} onChange={setWalletUsed} />
      </div>

      {/* payment method for the remaining amount */}
      {remaining > 0 ? (
        <div>
          <h3 className="mb-2 text-sm font-extrabold text-ink-strong">{t("pay.method")}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {methods.map((m) => {
              const active = payMethod === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setPayMethod(m.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border-2 p-3.5 text-start transition-colors",
                    active ? "border-primary bg-primary-soft/40" : "border-border hover:border-border-strong",
                  )}
                >
                  <Icon name={m.icon} size={20} className={active ? "text-primary" : "text-muted"} />
                  <span className="flex-1 font-bold text-ink-strong">{m.label}</span>
                  <span className={cn("grid h-5 w-5 place-items-center rounded-full border-2", active ? "border-primary bg-primary text-primary-ink" : "border-border")}>
                    {active && <Icon name="check" size={12} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        walletUsed > 0 && (
          <Badge tone="success" icon="check-circle" className="self-start">{t("pay.walletOnly")}</Badge>
        )
      )}
    </section>
  );
}

/* ------------------------------------------------------------ order placed */
function OrderPlaced({ number, remaining, walletUsed }: { number: string; remaining: number; walletUsed: number }) {
  const { t } = useI18n();
  return (
    <div className="page flex flex-col items-center gap-5 py-20 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-success-soft text-success animate-fade-up">
        <Icon name="check-circle" size={40} />
      </span>
      <h1 className="text-2xl font-extrabold md:text-3xl">{t("co.orderPlacedTitle")}</h1>
      <p className="max-w-md text-muted">{t("co.orderPlacedMsg")}</p>

      <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-border bg-surface px-6 py-4">
        <div>
          <p className="text-xs text-muted">{t("co.orderNumber")}</p>
          <p className="nums text-lg font-extrabold text-ink-strong">{number}</p>
        </div>
        {walletUsed > 0 && (
          <>
            <span className="h-8 w-px bg-border" />
            <div>
              <p className="text-xs text-muted">{t("sum.walletUsed")}</p>
              <p className="nums text-lg font-extrabold text-success">−{formatNumber(walletUsed)} {t("common.currency")}</p>
            </div>
          </>
        )}
        <span className="h-8 w-px bg-border" />
        <div>
          <p className="text-xs text-muted">{t("sum.remainingPay")}</p>
          <p className="nums text-lg font-extrabold text-ink-strong">{formatNumber(remaining)} {t("common.currency")}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/orders" className={buttonClasses("primary", "lg")}>
          <Icon name="package" size={18} /> {t("co.trackOrder")}
        </Link>
        <Link href="/products" className={buttonClasses("secondary", "lg")}>
          {t("co.continueShopping")}
        </Link>
      </div>
    </div>
  );
}
