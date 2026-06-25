import { Suspense } from "react";
import { RegisterView } from "@/components/auth/RegisterView";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="page py-24 text-center text-muted">…</div>}>
      <RegisterView />
    </Suspense>
  );
}
