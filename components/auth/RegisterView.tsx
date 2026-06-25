"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "./AuthShell";
import { Field, TextInput, SelectInput } from "@/components/ui/Field";
import { Button, buttonClasses } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { CompanyStatusBadge } from "@/components/ui/StatusBadge";
import { Icon } from "@/lib/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { regions } from "@/data/regions";

type AccountKind = "individual" | "business";

export function RegisterView() {
  const { t, tl } = useI18n();
  const params = useSearchParams();
  const initial = (params.get("type") as AccountKind) === "business" ? "business" : "individual";

  const [kind, setKind] = useState<AccountKind>(initial);
  const [done, setDone] = useState<AccountKind | null>(null);

  if (done) return <Success kind={done} />;

  const RegionField = (
    <Field label={t("reg.region")} htmlFor="reg-region">
      <SelectInput id="reg-region" defaultValue="">
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
  );

  return (
    <AuthShell wide>
      <div className="rounded-xl border border-border bg-bg p-6 shadow-[var(--shadow-md)] md:p-8">
        <h1 className="text-2xl font-extrabold">{t("reg.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("reg.sub")}</p>

        <SegmentedControl
          className="mt-5 w-full"
          value={kind}
          onChange={setKind}
          options={[
            { value: "individual", label: t("reg.individual"), icon: "user" },
            { value: "business", label: t("reg.business"), icon: "building" },
          ]}
        />

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(kind);
          }}
        >
          {kind === "individual" ? (
            <>
              <Field label={t("reg.name")} htmlFor="r-name">
                <TextInput id="r-name" required placeholder={t("reg.name")} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("auth.phone")} htmlFor="r-phone">
                  <TextInput id="r-phone" type="tel" required placeholder="+966 5x xxx xxxx" dir="ltr" />
                </Field>
                <Field label={t("auth.email")} htmlFor="r-email">
                  <TextInput id="r-email" type="email" required placeholder="you@example.com" dir="ltr" />
                </Field>
              </div>
              <Field label={t("auth.password")} htmlFor="r-pw" hint={t("reg.passwordHint")}>
                <TextInput id="r-pw" type="password" required placeholder="••••••••" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("reg.address")} htmlFor="r-addr">
                  <TextInput id="r-addr" required placeholder={t("addr.detailsPh")} />
                </Field>
                {RegionField}
              </div>
            </>
          ) : (
            <>
              <Field label={t("reg.companyName")} htmlFor="c-name">
                <TextInput id="c-name" required placeholder={t("reg.companyName")} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("reg.contactNumber")} htmlFor="c-contact">
                  <TextInput id="c-contact" type="tel" required placeholder="+966 11 xxx xxxx" dir="ltr" />
                </Field>
                <Field label={t("auth.email")} htmlFor="c-email">
                  <TextInput id="c-email" type="email" required placeholder="info@company.com" dir="ltr" />
                </Field>
              </div>
              <Field label={t("reg.crNumber")} htmlFor="c-cr" optional>
                <TextInput id="c-cr" placeholder="1010xxxxxx" dir="ltr" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("reg.address")} htmlFor="c-addr">
                  <TextInput id="c-addr" required placeholder={t("addr.detailsPh")} />
                </Field>
                {RegionField}
              </div>

              <div className="mt-2 rounded-lg border border-border bg-surface p-4">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-ink-strong">
                  <Icon name="user" size={16} className="text-accent" />
                  {t("reg.adminData")}
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label={t("reg.adminName")} htmlFor="c-aname">
                    <TextInput id="c-aname" required placeholder={t("reg.adminName")} />
                  </Field>
                  <Field label={t("reg.adminPhone")} htmlFor="c-aphone">
                    <TextInput id="c-aphone" type="tel" required placeholder="+966 5x xxx xxxx" dir="ltr" />
                  </Field>
                  <Field label={t("reg.adminEmail")} htmlFor="c-aemail">
                    <TextInput id="c-aemail" type="email" required placeholder="manager@company.com" dir="ltr" />
                  </Field>
                </div>
              </div>
              <Field label={t("auth.password")} htmlFor="c-pw" hint={t("reg.passwordHint")}>
                <TextInput id="c-pw" type="password" required placeholder="••••••••" />
              </Field>
            </>
          )}

          <Button type="submit" size="lg" className="mt-2 w-full">
            {kind === "individual" ? t("reg.submitIndividual") : t("reg.submitBusiness")}
            <Icon name="arrow-end" size={18} className="flip-rtl" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {t("auth.haveAccount")}{" "}
          <Link href="/login" className="font-bold text-accent-strong hover:underline">
            {t("auth.signIn")}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

function Success({ kind }: { kind: AccountKind }) {
  const { t } = useI18n();
  const business = kind === "business";
  return (
    <AuthShell>
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-bg p-8 text-center shadow-[var(--shadow-md)]">
        <span
          className={`grid h-16 w-16 place-items-center rounded-full ${
            business ? "bg-warning-soft text-[oklch(0.45_0.12_60)]" : "bg-success-soft text-success"
          }`}
        >
          <Icon name={business ? "info" : "check-circle"} size={34} />
        </span>

        {business && <CompanyStatusBadge status="pending" />}

        <h1 className="text-2xl font-extrabold">
          {business ? t("reg.successBusinessTitle") : t("reg.successIndividualTitle")}
        </h1>
        <p className="max-w-md text-muted">
          {business ? t("reg.successBusinessMsg") : t("reg.successIndividualSub")}
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {business ? (
            <Link href="/account" className={buttonClasses("primary", "lg")}>
              {t("reg.goAccount")}
            </Link>
          ) : (
            <>
              <Link href="/products" className={buttonClasses("primary", "lg")}>
                {t("reg.goShopping")}
              </Link>
              <Link href="/account" className={buttonClasses("secondary", "lg")}>
                {t("reg.goAccount")}
              </Link>
            </>
          )}
        </div>
      </div>
    </AuthShell>
  );
}
