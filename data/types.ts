/** Shared domain types for the BMatx portal (mock-data phase). */

export type Locale = "ar" | "en";

/** loose icon-name alias so data modules don't import UI types */
export type IconNameLike = string;

/** A value that exists in both languages. */
export type Localized = Record<Locale, string>;

export type DeliveryType = "single" | "groupable";

export interface Region {
  id: string;
  name: Localized;
}

export interface Category {
  id: string;
  name: Localized;
  /** lucide-style icon key resolved in lib/icons */
  icon: string;
  productCount: number;
}

export interface Supplier {
  id: string;
  name: Localized;
  /** city / area shown under the name */
  location: Localized;
  rating: number;
  reviews: number;
  productCount: number;
  /** solid brand color seed for the avatar (oklch) */
  tint: string;
  verified: boolean;
}

export interface ProductSpec {
  label: Localized;
  value: Localized;
}

export interface Product {
  id: string;
  name: Localized;
  categoryId: string;
  supplierId: string;
  /** price per unit, in the portal's single currency */
  price: number;
  /** optional strike-through reference price */
  oldPrice?: number;
  unit: Localized;
  /** minimum order quantity, if the supplier enforces one */
  moq?: number;
  delivery: DeliveryType;
  /** region ids this product can ship to */
  regionIds: string[];
  /** flat estimate used for the "from X delivery" hint */
  deliveryEstimate: number;
  images: string[];
  shortDesc: Localized;
  specs: ProductSpec[];
  rating: number;
  reviews: number;
  inStock: boolean;
  popularity: number;
  /** epoch-ish ordering value for "newest" sort (higher = newer) */
  addedOrder: number;
  /** handling characteristics (fragile/heavy/special). Default: none. */
  flags?: DeliveryFlag[];
  /** how it can be received. Default: "both". */
  fulfillment?: Fulfillment;
}

export interface CartLine {
  productId: string;
  quantity: number;
  /** which warehouse this line ships/pickups from */
  warehouseId: string;
}

/** stable identity for a cart line (a product can appear from 2 warehouses) */
export const lineKey = (productId: string, warehouseId: string) => `${productId}::${warehouseId}`;

export interface Warehouse {
  id: string;
  supplierId: string;
  name: Localized;
  regionId: string;
  address: Localized;
  phone: string;
  pickupAvailable: boolean;
}

/** extra handling characteristics that affect delivery */
export type DeliveryFlag = "fragile" | "heavy" | "special";

/** how a product may be received */
export type Fulfillment = "both" | "pickup_only" | "delivery_only";

export interface DeliveryQuote {
  cost: number;
  minDays: number;
  maxDays: number;
}

export interface Shipment {
  id: string;
  supplierId: string;
  warehouseId: string;
  lines: CartLine[];
  deliveryCost: number;
  minDays: number;
  maxDays: number;
}

export type WalletTxType = "recharge" | "purchase" | "refund" | "adjustment";
export type WalletTxStatus = "completed" | "pending" | "failed" | "refunded";

export interface WalletTransaction {
  transactionId: string;
  date: string;
  type: WalletTxType;
  /** signed: + credit (recharge/refund), − debit (purchase) */
  amount: number;
  status: WalletTxStatus;
  description: Localized;
  relatedOrderNumber?: string;
}

export type AddressType = "home" | "work" | "branch" | "project";

/** Map pin for precise delivery (mock coordinates). */
export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Address {
  id: string;
  type: AddressType;
  recipient: string;
  phone: string;
  regionId: string;
  line: string;
  location?: GeoPoint;
  isDefault: boolean;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  number: string;
  /** pre-formatted date label (no Date.now in mock layer) */
  dateLabel: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  regionId: string;
}

export type CompanyStatus = "pending" | "approved" | "rejected";

export interface Account {
  type: "individual" | "business";
  name: Localized;
  email: string;
  phone: string;
  memberSince: string;
}

export interface Company {
  name: Localized;
  crNumber: string;
  contact: string;
  status: CompanyStatus;
  admin: { name: Localized; phone: string; email: string };
}
