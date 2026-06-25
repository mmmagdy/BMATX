import type { Category } from "./types";

export const categories: Category[] = [
  { id: "cement", name: { ar: "الأسمنت والخرسانة", en: "Cement & Concrete" }, icon: "cement", productCount: 124 },
  { id: "steel", name: { ar: "حديد التسليح", en: "Steel & Rebar" }, icon: "steel", productCount: 86 },
  { id: "blocks", name: { ar: "الطوب والبلوك", en: "Bricks & Blocks" }, icon: "blocks", productCount: 73 },
  { id: "tiles", name: { ar: "السيراميك والبلاط", en: "Tiles & Ceramics" }, icon: "tiles", productCount: 152 },
  { id: "paint", name: { ar: "الدهانات والعزل", en: "Paint & Insulation" }, icon: "paint", productCount: 98 },
  { id: "wood", name: { ar: "الأخشاب والألواح", en: "Wood & Panels" }, icon: "wood", productCount: 64 },
  { id: "plumbing", name: { ar: "السباكة والصرف", en: "Plumbing" }, icon: "plumbing", productCount: 110 },
  { id: "electrical", name: { ar: "الكهرباء والإضاءة", en: "Electrical & Lighting" }, icon: "electrical", productCount: 131 },
  { id: "tools", name: { ar: "العدد والأدوات", en: "Tools & Equipment" }, icon: "tools", productCount: 89 },
  { id: "aggregates", name: { ar: "الرمل والركام", en: "Sand & Aggregates" }, icon: "aggregates", productCount: 47 },
];

export const categoryById = (id: string) => categories.find((c) => c.id === id);
