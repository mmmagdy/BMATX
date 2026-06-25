import type { WalletTransaction } from "./types";

export const walletBalance = 1850;

export const walletTransactions: WalletTransaction[] = [
  {
    transactionId: "WTX-10241",
    date: "2026/06/20",
    type: "recharge",
    amount: 1000,
    status: "completed",
    description: { ar: "شحن المحفظة - بطاقة مدى", en: "Wallet recharge - mada card" },
  },
  {
    transactionId: "WTX-10238",
    date: "2026/06/18",
    type: "purchase",
    amount: -480,
    status: "completed",
    description: { ar: "دفع طلب", en: "Order payment" },
    relatedOrderNumber: "BMX-24910",
  },
  {
    transactionId: "WTX-10231",
    date: "2026/06/12",
    type: "refund",
    amount: 230,
    status: "refunded",
    description: { ar: "استرداد - منتج ملغى", en: "Refund - cancelled item" },
    relatedOrderNumber: "BMX-24788",
  },
  {
    transactionId: "WTX-10222",
    date: "2026/06/05",
    type: "recharge",
    amount: 1500,
    status: "completed",
    description: { ar: "شحن المحفظة - تحويل بنكي", en: "Wallet recharge - bank transfer" },
  },
  {
    transactionId: "WTX-10215",
    date: "2026/05/29",
    type: "purchase",
    amount: -120,
    status: "pending",
    description: { ar: "دفع طلب قيد المعالجة", en: "Order payment in process" },
    relatedOrderNumber: "BMX-24655",
  },
  {
    transactionId: "WTX-10208",
    date: "2026/05/21",
    type: "adjustment",
    amount: 50,
    status: "completed",
    description: { ar: "تسوية يدوية - رصيد ترحيبي", en: "Manual adjustment - welcome credit" },
  },
];
