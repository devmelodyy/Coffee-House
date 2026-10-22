"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Art } from "../illustrations";
import { HandText } from "../sketch/HandText";
import { SketchBox } from "../sketch/SketchBox";
import { Button, Stepper } from "../ui";
import { useCart } from "@/lib/cart";
import { menuById, toman } from "@/data/menu";

export function CartDrawer() {
  const { lines, total, setQty, open, setOpen } = useCart();
  const path = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const entries = Object.entries(lines);

  useEffect(() => setOpen(false), [path, setOpen]);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    // Inline visibility too, so the closed drawer can't flash before the stylesheet loads
    <div className={`drawer ${open ? "is-open" : ""}`} aria-hidden={!open} style={open ? undefined : { visibility: "hidden" }}>
      <div className="drawer__backdrop" onClick={() => setOpen(false)} />
      <SketchBox
        as="aside"
        className="drawer__panel"
        edges={["left"]}
        seed={77}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="drawer__head">
          <h2 id="cart-title" dir="ltr">
            <HandText text="Your order" seed={14} />
          </h2>
          <button ref={closeRef} type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="بستن سبد خرید" tabIndex={open ? 0 : -1}>
            ×
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="drawer__empty">
            <Art name="steam" className="drawer__empty-art" />
            <p>سبد شما خالی است.</p>
            <Button href="/menu" variant="ghost" size="sm">
              دیدن منو
            </Button>
          </div>
        ) : (
          <>
            <ul className="drawer__lines">
              {entries.map(([id, qty]) => {
                const item = menuById[id];
                return (
                  <li key={id} className="line">
                    <Art name={item.art} className="line__art" />
                    <div className="line__info">
                      <span className="line__name">{item.name}</span>
                      <span className="line__price">{toman(item.price * qty)}</span>
                    </div>
                    <Stepper value={qty} onChange={(n) => setQty(id, n)} label={item.name} />
                  </li>
                );
              })}
            </ul>
            <div className="drawer__foot">
              <div className="drawer__total">
                <span>جمع کل</span>
                <strong>{toman(total)}</strong>
              </div>
              <Button href="/checkout" className="btn--block">
                ادامه و ثبت سفارش
              </Button>
            </div>
          </>
        )}
      </SketchBox>
    </div>
  );
}

export function Toast() {
  const { notice, setOpen } = useCart();
  const [shown, setShown] = useState<typeof notice>(null);
  useEffect(() => {
    if (!notice) return;
    setShown(notice);
    const t = setTimeout(() => setShown(null), 2600);
    return () => clearTimeout(t);
  }, [notice]);
  return (
    <div className="toast-region" aria-live="polite">
      {shown && (
        <SketchBox key={shown.id} className="toast" radius={14} seed={shown.id % 50} tint="#9db86a">
          <span>{shown.text}</span>
          <button type="button" onClick={() => setOpen(true)}>
            مشاهده سبد
          </button>
        </SketchBox>
      )}
    </div>
  );
}
