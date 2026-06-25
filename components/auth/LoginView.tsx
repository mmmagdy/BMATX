"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "./AuthShell";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function LoginView() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  return (
    <AuthShell>
      <div className="rounded-xl border border-border bg-bg p-6 shadow-[var(--shadow-md)] md:p-8">
        <h1 className="text-2xl font-extrabold">{t("auth.signInTitle")}</h1>
        <p className="mt-1 text-sm text-muted">{t("auth.signInSub")}</p>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = "/account";
          }}
        >
          <Field label={t("auth.emailOrPhone")} htmlFor="login-id">
            <TextInput id="login-id" type="text" autoComplete="username" placeholder="you@example.com" />
          </Field>

          <Field label={t("auth.password")} htmlFor="login-pw">
            <div className="relative">
              <TextInput
                id="login-pw"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="pe-11"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label="toggle password"
                className="absolute end-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted hover:bg-surface-2"
              >
                <Icon name={show ? "info" : "shield"} size={18} />
              </button>
            </div>
          </Field>

          <div className="flex justify-end">
            <Link href="#" className="text-sm font-bold text-accent-strong hover:underline">
              {t("auth.forgot")}
            </Link>
          </div>

          <Button type="submit" size="lg" className="w-full">
            {t("auth.signIn")}
            <Icon name="arrow-end" size={18} className="flip-rtl" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="font-bold text-accent-strong hover:underline">
            {t("auth.createAccount")}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
