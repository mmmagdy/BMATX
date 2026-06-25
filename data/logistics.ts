import type {
  CartLine,
  DeliveryQuote,
  Fulfillment,
  IconNameLike,
  Product,
  Shipment,
  Warehouse,
} from "./types";
import { products, productById } from "./products";
import { warehouseById, warehousesBySupplier } from "./warehouses";

/* ---------------------------------------------------------------- zones --- */
const ZONES: Record<string, string> = {
  riyadh: "central",
  buraidah: "central",
  jeddah: "west",
  makkah: "west",
  madinah: "west",
  dammam: "east",
  khobar: "east",
  tabuk: "north",
};
const zoneOf = (regionId: string) => ZONES[regionId] ?? "central";

/* ----------------------------------------------- product ⇄ warehouse ------ */

/** Per-(warehouse, product) stock override; absent ⇒ follows product.inStock. */
const stockOverride: Record<string, boolean> = {
  "wh-rajhi-buraidah::p-cement-white": false, // white cement only in Riyadh wh
  "wh-rajhi-buraidah::p-pipe-pvc": false,
  "wh-steel-khobar::p-tool-mixer": false,
};

/** Warehouses that can fulfil a product (its supplier's warehouses). */
export function productWarehouses(product: Product): Warehouse[] {
  return warehousesBySupplier(product.supplierId);
}

export function warehouseHasStock(warehouseId: string, product: Product): boolean {
  const key = `${warehouseId}::${product.id}`;
  if (key in stockOverride) return stockOverride[key];
  return product.inStock;
}

/** Best default warehouse for a product: in-stock first, prefer the user's region. */
export function defaultWarehouseFor(product: Product, regionId?: string): string {
  const whs = productWarehouses(product);
  const inStock = whs.filter((w) => warehouseHasStock(w.id, product));
  const pool = inStock.length ? inStock : whs;
  if (regionId) {
    const local = pool.find((w) => w.regionId === regionId);
    if (local) return local.id;
    const sameZone = pool.find((w) => zoneOf(w.regionId) === zoneOf(regionId));
    if (sameZone) return sameZone.id;
  }
  return pool[0]?.id ?? whs[0]?.id ?? "";
}

export const hasMultipleWarehouses = (product: Product) => productWarehouses(product).length > 1;

/* ------------------------------------------------------- delivery quote --- */
const round5 = (n: number) => Math.round(n / 5) * 5;

export function quoteDelivery(
  warehouseId: string,
  regionId: string,
  product: Product,
  quantity = 1,
): DeliveryQuote {
  const wh = warehouseById(warehouseId);
  const base = product.deliveryEstimate;
  let factor = 1.2;
  let minDays = 3;
  let maxDays = 5;

  if (wh) {
    if (wh.regionId === regionId) {
      factor = 0.65;
      minDays = 1;
      maxDays = 2;
    } else if (zoneOf(wh.regionId) === zoneOf(regionId)) {
      factor = 0.95;
      minDays = 2;
      maxDays = 4;
    } else if (zoneOf(wh.regionId) === "north" || zoneOf(regionId) === "north") {
      factor = 1.4;
      minDays = 4;
      maxDays = 7;
    }
  }

  const flags = product.flags ?? [];
  let surcharge = 0;
  if (flags.includes("heavy")) surcharge += 0.2;
  if (flags.includes("special")) surcharge += 0.25;
  if (flags.includes("fragile")) surcharge += 0.1;

  // large orders nudge cost a little
  const bulk = product.moq && quantity > product.moq * 3 ? 1.1 : 1;

  const cost = Math.max(0, round5(base * factor * (1 + surcharge) * bulk));
  return { cost, minDays, maxDays };
}

/* ----------------------------------------------------------- shipments ---- */

/** Group cart lines into per-warehouse shipments with cost + ETA. */
export function buildShipments(lines: CartLine[], regionId: string): Shipment[] {
  const groups = new Map<string, CartLine[]>();
  for (const l of lines) {
    const arr = groups.get(l.warehouseId) ?? [];
    arr.push(l);
    groups.set(l.warehouseId, arr);
  }

  const shipments: Shipment[] = [];
  for (const [warehouseId, group] of groups) {
    const wh = warehouseById(warehouseId);
    if (!wh) continue;

    const quotes = group
      .map((l) => {
        const p = productById(l.productId);
        return p ? { line: l, p, q: quoteDelivery(warehouseId, regionId, p, l.quantity) } : null;
      })
      .filter(Boolean) as { line: CartLine; p: Product; q: DeliveryQuote }[];

    const groupable = quotes.filter((x) => x.p.delivery === "groupable");
    const singles = quotes.filter((x) => x.p.delivery === "single");

    const baseTrip = groupable.length ? Math.max(...groupable.map((x) => x.q.cost)) : 0;
    const singlesCost = singles.reduce((n, x) => n + x.q.cost, 0);
    const deliveryCost = baseTrip + singlesCost;

    const minDays = Math.min(...quotes.map((x) => x.q.minDays));
    const maxDays = Math.max(...quotes.map((x) => x.q.maxDays));

    shipments.push({
      id: `ship-${warehouseId}`,
      supplierId: wh.supplierId,
      warehouseId,
      lines: group,
      deliveryCost,
      minDays,
      maxDays,
    });
  }
  return shipments;
}

/* ----------------------------------------------------- delivery rules ----- */

export const productFulfillment = (p: Product): Fulfillment => p.fulfillment ?? "both";

export interface RuleChip {
  key: string;
  icon: IconNameLike;
  tone: "neutral" | "success" | "warning" | "info" | "primary";
}

/** Important delivery restrictions to surface on PDP / cart / checkout. */
export function productRules(p: Product): RuleChip[] {
  const out: RuleChip[] = [];
  const f = productFulfillment(p);

  if (f === "pickup_only") out.push({ key: "rule.pickupOnly", icon: "building", tone: "primary" });
  else if (f === "delivery_only") out.push({ key: "rule.deliveryOnly", icon: "truck", tone: "info" });
  else out.push({ key: "rule.pickupDelivery", icon: "check-circle", tone: "neutral" });

  if (p.delivery === "single") out.push({ key: "rule.separate", icon: "truck", tone: "info" });
  else out.push({ key: "rule.groupable", icon: "layers", tone: "success" });

  for (const flag of p.flags ?? []) {
    if (flag === "fragile") out.push({ key: "rule.fragile", icon: "info", tone: "warning" });
    if (flag === "heavy") out.push({ key: "rule.heavy", icon: "package", tone: "warning" });
    if (flag === "special") out.push({ key: "rule.special", icon: "spark", tone: "primary" });
  }
  return out;
}

export const allProductIds = products.map((p) => p.id);
