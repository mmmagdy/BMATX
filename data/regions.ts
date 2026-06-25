import type { Region } from "./types";

export const regions: Region[] = [
  { id: "riyadh", name: { ar: "الرياض", en: "Riyadh" } },
  { id: "jeddah", name: { ar: "جدة", en: "Jeddah" } },
  { id: "dammam", name: { ar: "الدمام", en: "Dammam" } },
  { id: "makkah", name: { ar: "مكة المكرمة", en: "Makkah" } },
  { id: "madinah", name: { ar: "المدينة المنورة", en: "Madinah" } },
  { id: "khobar", name: { ar: "الخبر", en: "Khobar" } },
  { id: "buraidah", name: { ar: "بريدة", en: "Buraidah" } },
  { id: "tabuk", name: { ar: "تبوك", en: "Tabuk" } },
];

export const regionById = (id: string) => regions.find((r) => r.id === id);
