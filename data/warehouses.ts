import type { Warehouse } from "./types";

export const warehouses: Warehouse[] = [
  // Al-Rajhi — two warehouses (multi-warehouse demo)
  {
    id: "wh-rajhi-riyadh",
    supplierId: "alrajhi",
    name: { ar: "مستودع الياسمين", en: "Al-Yasmin Warehouse" },
    regionId: "riyadh",
    address: { ar: "حي الياسمين، طريق أنس بن مالك، الرياض", en: "Al-Yasmin, Anas ibn Malik Rd, Riyadh" },
    phone: "+966 11 234 5xxx",
    pickupAvailable: true,
  },
  {
    id: "wh-rajhi-buraidah",
    supplierId: "alrajhi",
    name: { ar: "مستودع بريدة", en: "Buraidah Warehouse" },
    regionId: "buraidah",
    address: { ar: "المنطقة الصناعية، بريدة", en: "Industrial Area, Buraidah" },
    phone: "+966 16 321 4xxx",
    pickupAvailable: true,
  },

  // Saudi Steel — two warehouses (one without pickup)
  {
    id: "wh-steel-dammam",
    supplierId: "saudisteel",
    name: { ar: "مستودع الدمام", en: "Dammam Warehouse" },
    regionId: "dammam",
    address: { ar: "المدينة الصناعية الثانية، الدمام", en: "2nd Industrial City, Dammam" },
    phone: "+966 13 845 7xxx",
    pickupAvailable: true,
  },
  {
    id: "wh-steel-khobar",
    supplierId: "saudisteel",
    name: { ar: "مستودع الخبر", en: "Khobar Warehouse" },
    regionId: "khobar",
    address: { ar: "حي العقربية، الخبر", en: "Al-Aqrabiyah, Khobar" },
    phone: "+966 13 887 9xxx",
    pickupAvailable: false,
  },

  // single-warehouse suppliers
  {
    id: "wh-binladen-jeddah",
    supplierId: "binladen",
    name: { ar: "مستودع جدة", en: "Jeddah Warehouse" },
    regionId: "jeddah",
    address: { ar: "حي الصناعية، جدة", en: "Industrial District, Jeddah" },
    phone: "+966 12 612 3xxx",
    pickupAvailable: true,
  },
  {
    id: "wh-ceramic-riyadh",
    supplierId: "ceramicworld",
    name: { ar: "مستودع المعارض - الرياض", en: "Showroom Warehouse - Riyadh" },
    regionId: "riyadh",
    address: { ar: "طريق الدائري الشرقي، الرياض", en: "Eastern Ring Rd, Riyadh" },
    phone: "+966 11 491 2xxx",
    pickupAvailable: true,
  },
  {
    id: "wh-gulfpaint-khobar",
    supplierId: "gulfpaint",
    name: { ar: "مستودع الخبر", en: "Khobar Warehouse" },
    regionId: "khobar",
    address: { ar: "طريق الملك فهد، الخبر", en: "King Fahd Rd, Khobar" },
    phone: "+966 13 894 1xxx",
    pickupAvailable: false,
  },
  {
    id: "wh-noor-makkah",
    supplierId: "noorelec",
    name: { ar: "مستودع مكة", en: "Makkah Warehouse" },
    regionId: "makkah",
    address: { ar: "حي العزيزية، مكة المكرمة", en: "Al-Aziziyah, Makkah" },
    phone: "+966 12 530 8xxx",
    pickupAvailable: true,
  },
];

export const warehouseById = (id: string) => warehouses.find((w) => w.id === id);
export const warehousesBySupplier = (supplierId: string) =>
  warehouses.filter((w) => w.supplierId === supplierId);
