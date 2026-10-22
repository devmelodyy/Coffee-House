"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Art } from "../illustrations";
import { SketchBox } from "../sketch/SketchBox";
import { Button, Stepper } from "../ui";
import { useCart } from "@/lib/cart";
import { categories, menuById, pairings, toman, type MenuItem } from "@/data/menu";

/** Add button that turns into a quantity stepper once the dish is in the cart. */
export function AddToCart({ item, size = "sm" }: { item: MenuItem; size?: "sm" | "md" }) {
  const { lines, add, setQty } = useCart();
  const qty = lines[item.id] ?? 0;
  if (qty > 0) return <Stepper value={qty} onChange={(n) => setQty(item.id, n)} label={item.name} />;
  return (
    <Button size={size} onClick={() => add(item.id)} aria-label={`افزودن ${item.name} به سبد`}>
      + افزودن
    </Button>
  );
}

export function MenuCard({ item, seed, onOpen, compact = false }: { item: MenuItem; seed: number; onOpen: (i: MenuItem) => void; compact?: boolean }) {
  return (
    <SketchBox as="article" className={`dish ${compact ? "dish--compact" : ""}`} tint="#c7c25e" seed={seed}>
      {/* Picture is a mouse/touch shortcut; the name button is the one keyboard and screen readers use */}
      <button type="button" className="dish__media" onClick={() => onOpen(item)} tabIndex={-1} aria-hidden="true">
        <Art name={item.art} className="dish__art" />
      </button>
      <div className="dish__body">
        <h3 className="dish__title">
          <button type="button" className="dish__name" onClick={() => onOpen(item)} aria-haspopup="dialog">
            {item.name}
          </button>
        </h3>
        {!compact && <p className="dish__desc">{item.desc}</p>}
        {item.tags && !compact && (
          <ul className="tags" aria-label="ویژگی‌ها">
            {item.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <div className="dish__foot">
          <span className="dish__price">{toman(item.price)}</span>
          <AddToCart item={item} />
        </div>
      </div>
    </SketchBox>
  );
}

export function DishDialog({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [onClose]);

  const cat = categories.find((c) => c.id === item.category);
  const pairs = (pairings[item.id] ?? []).map((id) => menuById[id]).filter(Boolean);

  // Portal to <body> so the dialog isn't trapped in a frame's stacking context.
  return createPortal(
    <div className="modal" onClick={onClose}>
      <SketchBox
        className="modal__panel"
        tint="#d08a45"
        seed={140}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-title"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="icon-btn modal__close" onClick={onClose} aria-label="بستن">
          ×
        </button>
        <Art name={item.art} label={item.name} className="modal__art draw-in" />
        <p className="modal__cat">{cat?.label}</p>
        <h2 id="dish-title" className="modal__title">
          {item.name}
        </h2>
        {item.tags && (
          <ul className="tags tags--center">
            {item.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <p className="modal__desc">{item.desc}</p>
        <div className="modal__foot">
          <strong className="modal__price">{toman(item.price)}</strong>
          <AddToCart item={item} size="md" />
        </div>
        {pairs.length > 0 && (
          <div className="pairs">
            <p className="pairs__title">کنارش خوب است</p>
            <ul className="pairs__list">
              {pairs.map((p) => (
                <li key={p.id} className="pair">
                  <Art name={p.art} className="pair__art" />
                  <span className="pair__name">{p.name}</span>
                  <span className="pair__price">{toman(p.price)}</span>
                  <AddToCart item={p} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </SketchBox>
    </div>,
    document.body,
  );
}
