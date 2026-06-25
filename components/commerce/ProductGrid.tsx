"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/types";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.32), ease: [0.25, 1, 0.5, 1] }}
        >
          <ProductCard product={p} />
        </motion.div>
      ))}
    </div>
  );
}
