"use client";

import { cn } from "@/lib/cn";

/** Centered card frame shared by sign-in / register. */
export function AuthShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 start-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--primary-soft), transparent 65%)" }}
        aria-hidden
      />
      <div className="page relative flex justify-center py-12 md:py-16">
        <div className={cn("w-full", wide ? "max-w-2xl" : "max-w-md")}>{children}</div>
      </div>
    </div>
  );
}
