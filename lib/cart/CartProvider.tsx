"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/data/types";
import { productById } from "@/data/products";
import { defaultWarehouseFor } from "@/data/logistics";

interface CartValue {
  lines: CartLine[];
  count: number;
  /** subtotal of product prices × quantity */
  subtotal: number;
  add: (productId: string, quantity?: number, warehouseId?: string) => void;
  setQuantity: (productId: string, warehouseId: string, quantity: number) => void;
  remove: (productId: string, warehouseId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);
const STORAGE_KEY = "bmatx.cart";

const sameLine = (l: CartLine, productId: string, warehouseId: string) =>
  l.productId === productId && l.warehouseId === warehouseId;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<CartLine>[];
      // migrate older carts that have no warehouseId
      const migrated: CartLine[] = parsed
        .map((l) => {
          const p = l.productId && productById(l.productId);
          if (!p) return null;
          return {
            productId: p.id,
            quantity: l.quantity ?? p.moq ?? 1,
            warehouseId: l.warehouseId ?? defaultWarehouseFor(p),
          } as CartLine;
        })
        .filter(Boolean) as CartLine[];
      setLines(migrated);
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const add = useCallback((productId: string, quantity = 1, warehouseId?: string) => {
    const product = productById(productId);
    if (!product) return;
    const wh = warehouseId ?? defaultWarehouseFor(product);
    setLines((prev) => {
      const existing = prev.find((l) => sameLine(l, productId, wh));
      if (existing) {
        return prev.map((l) =>
          sameLine(l, productId, wh) ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      const start = quantity > 1 ? quantity : product.moq ?? 1;
      return [...prev, { productId, quantity: start, warehouseId: wh }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, warehouseId: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) => (sameLine(l, productId, warehouseId) ? { ...l, quantity: Math.max(1, quantity) } : l))
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const remove = useCallback(
    (productId: string, warehouseId: string) =>
      setLines((prev) => prev.filter((l) => !sameLine(l, productId, warehouseId))),
    [],
  );

  const clear = useCallback(() => setLines([]), []);

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const line of lines) {
      const product = productById(line.productId);
      if (!product) continue;
      count += line.quantity;
      subtotal += product.price * line.quantity;
    }
    return { count, subtotal };
  }, [lines]);

  const value = useMemo<CartValue>(
    () => ({ lines, count, subtotal, add, setQuantity, remove, clear }),
    [lines, count, subtotal, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
