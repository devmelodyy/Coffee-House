"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { menuById } from "@/data/menu";

type Lines = Record<string, number>;

type Cart = {
  lines: Lines;
  count: number;
  total: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  /** Last "added to cart" message, for the toast. */
  notice: { id: number; text: string } | null;
};

const KEY = "caffee-cart-v1";
const Ctx = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Lines>({});
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<Cart["notice"]>(null);
  const loaded = useRef(false);

  // Restore after hydration so server and client render the same first frame.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Lines;
        setLines(Object.fromEntries(Object.entries(parsed).filter(([id, q]) => menuById[id] && q > 0)));
      }
    } catch {}
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(qty, 20);
      return next;
    });
  }, []);

  const add = useCallback((id: string, qty = 1) => {
    setLines((prev) => ({ ...prev, [id]: Math.min((prev[id] ?? 0) + qty, 20) }));
    setNotice({ id: Date.now(), text: `${menuById[id]?.name ?? ""} به سبد اضافه شد` });
  }, []);

  const clear = useCallback(() => setLines({}), []);

  const { count, total } = useMemo(() => {
    let count = 0,
      total = 0;
    for (const [id, q] of Object.entries(lines)) {
      count += q;
      total += (menuById[id]?.price ?? 0) * q;
    }
    return { count, total };
  }, [lines]);

  return <Ctx.Provider value={{ lines, count, total, add, setQty, clear, open, setOpen, notice }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}
