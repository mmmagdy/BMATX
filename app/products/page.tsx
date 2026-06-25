import { Suspense } from "react";
import { ProductsView } from "@/components/commerce/ProductsView";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="page py-24 text-center text-muted">…</div>}>
      <ProductsView />
    </Suspense>
  );
}
