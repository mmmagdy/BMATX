import type { Account, Address, Company, Order } from "./types";

export const account: Account = {
  type: "individual",
  name: { ar: "محمد عبدالله", en: "Mohammed Abdullah" },
  email: "m.abdullah@example.com",
  phone: "+966 5x xxx xxxx",
  memberSince: "2025",
};

export const company: Company = {
  name: { ar: "شركة الإعمار للمقاولات", en: "Al-Emar Contracting Co." },
  crNumber: "1010xxxxxx",
  contact: "+966 11 xxx xxxx",
  status: "pending",
  admin: {
    name: { ar: "خالد العتيبي", en: "Khalid Al-Otaibi" },
    phone: "+966 5x xxx xxxx",
    email: "k.alotaibi@al-emar.example",
  },
};

export const addresses: Address[] = [
  {
    id: "addr-home",
    type: "home",
    recipient: "محمد عبدالله",
    phone: "+966 5x xxx xxxx",
    regionId: "riyadh",
    line: "حي الياسمين، شارع الأمير، مبنى 14",
    location: { lat: 24.8264, lng: 46.6402 },
    isDefault: true,
  },
  {
    id: "addr-work",
    type: "work",
    recipient: "محمد عبدالله",
    phone: "+966 5x xxx xxxx",
    regionId: "riyadh",
    line: "حي العليا، طريق الملك فهد، برج المكاتب، الدور 8",
    isDefault: false,
  },
  {
    id: "addr-branch",
    type: "branch",
    recipient: "خالد العتيبي",
    phone: "+966 5x xxx xxxx",
    regionId: "dammam",
    line: "المنطقة الصناعية الثانية، مستودع 7",
    isDefault: false,
  },
  {
    id: "addr-project",
    type: "project",
    recipient: "موقع مشروع العليا",
    phone: "+966 5x xxx xxxx",
    regionId: "riyadh",
    line: "مشروع برج العليا، طريق الملك فهد، قطعة C-12",
    location: { lat: 24.6925, lng: 46.6855 },
    isDefault: false,
  },
];

export const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
export const defaultRegionId = defaultAddress?.regionId ?? "riyadh";

export const orders: Order[] = [
  {
    id: "o-1",
    number: "BMX-24910",
    dateLabel: "2026/06/18",
    status: "shipped",
    items: [
      { productId: "p-cement-opc", quantity: 60, price: 18 },
      { productId: "p-block-20", quantity: 400, price: 2.4 },
    ],
    subtotal: 60 * 18 + 400 * 2.4,
    delivery: 300,
    total: 60 * 18 + 400 * 2.4 + 300,
    regionId: "riyadh",
  },
  {
    id: "o-2",
    number: "BMX-24788",
    dateLabel: "2026/06/09",
    status: "delivered",
    items: [{ productId: "p-tile-porcelain", quantity: 40, price: 39 }],
    subtotal: 40 * 39,
    delivery: 90,
    total: 40 * 39 + 90,
    regionId: "riyadh",
  },
  {
    id: "o-3",
    number: "BMX-24655",
    dateLabel: "2026/05/30",
    status: "processing",
    items: [
      { productId: "p-steel-rebar12", quantity: 2, price: 2650 },
      { productId: "p-elec-cable", quantity: 3, price: 420 },
    ],
    subtotal: 2 * 2650 + 3 * 420,
    delivery: 410,
    total: 2 * 2650 + 3 * 420 + 410,
    regionId: "dammam",
  },
];
