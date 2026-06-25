import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/commerce/ProductDetails";
import { products, productById } from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = productById(id);
  if (!product) notFound();
  return <ProductDetails product={product} />;
}
