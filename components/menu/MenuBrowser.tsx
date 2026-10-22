"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SectionHead } from "../ui";
import { SketchBox } from "../sketch/SketchBox";
import { DishDialog, MenuCard } from "./MenuCard";
import { categories, menu, type Category, type MenuItem } from "@/data/menu";

export type Filter = "all" | "special" | Category;

const filters: { id: Filter; label: string; color: string }[] = [
  { id: "all", label: "همه", color: "#efe3c8" },
  { id: "special", label: "ویژه", color: "#efc85c" },
  ...categories.map((c) => ({ id: c.id as Filter, label: c.label, color: c.color })),
];

// Treat Persian/Arabic variants of ی and ک as the same letter when searching.
const norm = (s: string) => s.replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/‌/g, " ").trim().toLowerCase();

export function MenuBrowser({ initial }: { initial: Filter }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>(initial);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<MenuItem | null>(null);

  // Header links (coffee / food / menu) change ?cat while this page stays mounted.
  useEffect(() => setFilter(initial), [initial]);

  const choose = (f: Filter) => {
    setFilter(f);
    router.replace(f === "all" ? "/menu" : `/menu?cat=${f}`, { scroll: false });
  };

  const results = useMemo(() => {
    const nq = norm(q);
    return menu.filter((m) => {
      if (filter === "special" && !m.special) return false;
      if (filter !== "all" && filter !== "special" && m.category !== filter) return false;
      return !nq || norm(m.name).includes(nq) || norm(m.desc).includes(nq);
    });
  }, [filter, q]);

  // "All" without a search reads like a printed menu: one section per category.
  const groups =
    filter === "all" && !q
      ? categories.map((c) => ({ id: c.id, title: c.label, hand: c.hand, items: results.filter((m) => m.category === c.id) }))
      : [{ id: "results", title: "", hand: "", items: results }];

  return (
    <div className="container menu-page">
      <header className="page-head">
        <SectionHead as="h1" hand="Menu" fa="منوی کافه" seed={4} />
        <p>همه‌ی قیمت‌ها به تومان است. روی هر غذا بزنید تا جزئیاتش را ببینید.</p>
      </header>

      <div className="menu-tools">
        <div className="filters" role="tablist" aria-label="دسته‌بندی">
          {filters.map((f, i) => (
            <SketchBox
              key={f.id}
              as="button"
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`pill ${filter === f.id ? "is-on" : ""}`}
              radius={14}
              seed={70 + i}
              style={{ "--pill": f.color } as React.CSSProperties}
              onClick={() => choose(f.id)}
            >
              {f.label}
            </SketchBox>
          ))}
        </div>
        <SketchBox className="search" radius={12} seed={91}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="search__icon">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </svg>
          <label htmlFor="menu-search" className="visually-hidden">
            جستجو در منو
          </label>
          <input id="menu-search" type="search" placeholder="جستجو: لاته، چیزکیک…" value={q} onChange={(e) => setQ(e.target.value)} />
        </SketchBox>
      </div>

      {results.length === 0 ? (
        <div className="empty">
          <p>چیزی با «{q}» پیدا نکردیم.</p>
          <button type="button" className="link-more" onClick={() => { setQ(""); choose("all"); }}>
            نمایش همه‌ی منو
          </button>
        </div>
      ) : (
        groups.map(
          (g) =>
            g.items.length > 0 && (
              <section key={g.id} className="menu-group" aria-labelledby={g.title ? `g-${g.id}` : undefined}>
                {g.title && (
                  <h2 id={`g-${g.id}`} className="menu-group__title">
                    <span>{g.title}</span>
                    <span className="menu-group__hand" dir="ltr">{g.hand}</span>
                  </h2>
                )}
                <div className="dish-grid">
                  {g.items.map((m, i) => (
                    <MenuCard key={m.id} item={m} seed={300 + i * 5} onOpen={setOpen} />
                  ))}
                </div>
              </section>
            ),
        )
      )}

      {open && <DishDialog item={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
