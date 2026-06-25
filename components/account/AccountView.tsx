"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon, type IconName } from "@/lib/icons";
import { Badge } from "@/components/ui/Badge";
import { CompanyStatusBadge } from "@/components/ui/StatusBadge";
import { OrdersList } from "./OrdersList";
import { AddressManager } from "./AddressManager";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useWallet } from "@/lib/wallet/WalletProvider";
import { account, company, addresses, orders } from "@/data/account";
import { regionById } from "@/data/regions";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";

type Section = "overview" | "addresses" | "orders" | "company";

const nav: { key: Section; label: string; icon: IconName }[] = [
  { key: "overview", label: "acc.nav.overview", icon: "user" },
  { key: "addresses", label: "acc.nav.addresses", icon: "pin" },
  { key: "orders", label: "acc.nav.orders", icon: "package" },
  { key: "company", label: "acc.nav.company", icon: "building" },
];

export function AccountView() {
  const { t, tl } = useI18n();
  const [section, setSection] = useState<Section>("overview");

  return (
    <div className="page py-8">
      <div className="mb-6 flex items-center gap-3">
        <span
          className="grid h-12 w-12 place-items-center rounded-full text-lg font-extrabold text-primary-ink"
          style={{ background: "var(--primary)" }}
        >
          {tl(account.name).slice(0, 1)}
        </span>
        <div>
          <h1 className="text-xl font-extrabold leading-tight md:text-2xl">
            {t("acc.greeting")}، {tl(account.name)}
          </h1>
          <p className="nums text-sm text-muted">
            {t("acc.member")} {account.memberSince}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* nav */}
        <aside>
          <nav className="flex gap-1 overflow-x-auto hide-scrollbar lg:flex-col lg:overflow-visible">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => setSection(n.key)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-bold transition-colors",
                  section === n.key
                    ? "bg-primary-soft text-ink-strong"
                    : "text-ink hover:bg-surface-2",
                )}
              >
                <Icon name={n.icon} size={18} className={section === n.key ? "text-primary" : "text-muted"} />
                {t(n.label as Parameters<typeof t>[0])}
              </button>
            ))}
            <Link
              href="/account/wallet"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-bold text-ink hover:bg-surface-2"
            >
              <Icon name="spark" size={18} className="text-muted" />
              {t("acc.nav.wallet")}
            </Link>
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-bold text-muted hover:bg-surface-2"
            >
              <Icon name="arrow-end" size={18} className="rotate-180 flip-rtl" />
              {t("acc.nav.signout")}
            </Link>
          </nav>
        </aside>

        {/* content */}
        <div>
          {section === "overview" && <Overview onGo={setSection} />}
          {section === "addresses" && (
            <Panel title={t("addr.title")} sub={t("addr.sub")}>
              <AddressManager />
            </Panel>
          )}
          {section === "orders" && (
            <Panel title={t("orders.title")}>
              <OrdersList orders={orders} />
            </Panel>
          )}
          {section === "company" && <CompanyPanel />}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-extrabold text-ink-strong">{title}</h2>
        {sub && <p className="text-sm text-muted">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function Overview({ onGo }: { onGo: (s: Section) => void }) {
  const { t, tl } = useI18n();
  const { balance: walletBalance } = useWallet();
  const def = addresses.find((a) => a.isDefault) ?? addresses[0];
  const region = def && regionById(def.regionId);

  const stats = [
    { icon: "package" as IconName, value: orders.length, label: t("acc.nav.orders") },
    { icon: "pin" as IconName, value: addresses.length, label: t("acc.nav.addresses") },
  ];

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted">{t("acc.overviewSub")}</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-bg p-4">
            <Icon name={s.icon} size={20} className="text-primary" />
            <p className="nums mt-2 text-2xl font-extrabold text-ink-strong">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
        <button
          onClick={() => onGo("company")}
          className="flex flex-col items-start rounded-xl border border-border bg-bg p-4 text-start hover:border-border-strong"
        >
          <Icon name="building" size={20} className="text-primary" />
          <div className="mt-2">
            <CompanyStatusBadge status={company.status} />
          </div>
          <p className="mt-1 text-xs text-muted">{t("acc.nav.company")}</p>
        </button>

        <Link
          href="/account/wallet"
          className="flex flex-col items-start rounded-xl border border-border bg-bg p-4 hover:border-border-strong"
        >
          <Icon name="spark" size={20} className="text-primary" />
          <p className="nums mt-2 text-2xl font-extrabold text-ink-strong">
            {formatNumber(walletBalance)}
            <span className="ms-1 text-sm font-bold text-muted">{t("common.currency")}</span>
          </p>
          <p className="text-xs text-muted">{t("wallet.title")}</p>
        </Link>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-extrabold text-ink-strong">{t("acc.recentOrders")}</h2>
          <button onClick={() => onGo("orders")} className="text-sm font-bold text-accent-strong hover:underline">
            {t("acc.viewAllOrders")}
          </button>
        </div>
        <OrdersList orders={orders} limit={2} />
      </section>

      {def && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-extrabold text-ink-strong">{t("acc.savedAddresses")}</h2>
            <button onClick={() => onGo("addresses")} className="text-sm font-bold text-accent-strong hover:underline">
              {t("acc.manageAddresses")}
            </button>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-bg p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-surface-2">
              <Icon name="pin" size={18} />
            </span>
            <div className="text-sm">
              <p className="flex items-center gap-2 font-bold text-ink-strong">
                {t(`addr.type.${def.type}` as Parameters<typeof t>[0])}
                <Badge tone="primary" icon="check">{t("addr.default")}</Badge>
              </p>
              <p className="text-muted">{def.line}</p>
              <p className="text-muted">{region && tl(region.name)}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function CompanyPanel() {
  const { t, tl } = useI18n();
  const rows: { label: string; value: string }[] = [
    { label: t("company.crNumber"), value: company.crNumber },
    { label: t("company.contact"), value: company.contact },
    { label: t("company.admin"), value: `${tl(company.admin.name)} · ${company.admin.phone}` },
  ];

  return (
    <Panel title={t("company.title")}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-bg p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent-strong">
              <Icon name="building" size={24} />
            </span>
            <div>
              <p className="font-extrabold text-ink-strong">{tl(company.name)}</p>
              <p className="text-xs text-muted">{t("company.statusLabel")}</p>
            </div>
          </div>
          <CompanyStatusBadge status={company.status} />
        </div>

        {company.status === "pending" && (
          <div className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning-soft p-4 text-sm">
            <Icon name="info" size={18} className="mt-0.5 shrink-0 text-[oklch(0.45_0.12_60)]" />
            <p className="text-[oklch(0.4_0.1_60)]">{t("status.pendingNote")}</p>
          </div>
        )}

        <dl className="overflow-hidden rounded-xl border border-border">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-4 px-4 py-3 odd:bg-surface">
              <dt className="text-sm text-muted">{r.label}</dt>
              <dd className="text-sm font-bold text-ink-strong" dir="auto">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Panel>
  );
}
