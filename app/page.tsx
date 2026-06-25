import { Hero } from "@/components/home/Hero";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FeaturedSuppliers } from "@/components/home/FeaturedSuppliers";
import { PopularProducts } from "@/components/home/PopularProducts";
import { HowDeliveryWorks } from "@/components/home/HowDeliveryWorks";
import { BusinessSection } from "@/components/home/BusinessSection";
import { CtaSection } from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesGrid />
      <FeaturedSuppliers />
      <PopularProducts />
      <HowDeliveryWorks />
      <BusinessSection />
      <CtaSection />
    </>
  );
}
