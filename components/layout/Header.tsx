"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SketchBox } from "../sketch/SketchBox";
import { LogoBadge, OpenBadge } from "../ui";
import { useCart } from "@/lib/cart";
import { contact, toFa } from "@/data/menu";

type NavLink = { hand: string; fa: string; href: string; match: (path: string, cat: string | null) => boolean };

// Same order as the sketch: three links, the badge, two links.
const leftLinks: NavLink[] = [
  { hand: "contact", fa: "تماس و رزرو", href: "/contact", match: (p) => p === "/contact" },
  { hand: "coffee", fa: "قهوه", href: "/menu?cat=coffee", match: (p, c) => p === "/menu" && c === "coffee" },
  { hand: "food", fa: "غذا", href: "/menu?cat=food", match: (p, c) => p === "/menu" && c === "food" },
];
const rightLinks: NavLink[] = [
  { hand: "About us", fa: "درباره ما", href: "/about", match: (p) => p === "/about" },
  { hand: "menu", fa: "منو", href: "/menu", match: (p, c) => p === "/menu" && !c },
];

export function Header() {
  return (
    <Suspense fallback={<HeaderInner cat={null} />}>
      <HeaderWithParams />
    </Suspense>
  );
}

function HeaderWithParams() {
  const cat = useSearchParams().get("cat");
  return <HeaderInner cat={cat} />;
}

function HeaderInner({ cat }: { cat: string | null }) {
  const path = usePathname();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the phone menu on navigation, and lock page scroll while it's open.
  useEffect(() => setMenuOpen(false), [path, cat]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const link = (l: NavLink) => (
    <Link key={l.href} href={l.href} className="nav-link" aria-current={l.match(path, cat) ? "page" : undefined}>
      {l.hand}
    </Link>
  );

  const cartButton = (
    <SketchBox
      as="button"
      type="button"
      className="cart-btn"
      radius={14}
      seed={12}
      onClick={() => setOpen(true)}
      aria-label={`سبد خرید، ${toFa(count)} قلم`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="cart-btn__icon">
        <path d="M3 5h2.5l2 10h10l2-7H7" />
        <circle cx="9.5" cy="19" r="1.4" />
        <circle cx="16.5" cy="19" r="1.4" />
      </svg>
      {count > 0 && (
        <span className="cart-btn__count" key={count}>
          {toFa(count)}
        </span>
      )}
    </SketchBox>
  );

  return (
    <>
      <SketchBox as="header" className={`header ${scrolled ? "is-scrolled" : ""}`} edges={["bottom"]} tint="#c9803e" seed={4} dir="ltr">
        <div className="header__inner">
          <nav className="header__nav header__nav--left" aria-label="Main">
            {leftLinks.map(link)}
          </nav>
          <Link href="/" className="header__logo" aria-label="Caffee House, home">
            <LogoBadge />
          </Link>
          <nav className="header__nav header__nav--right" aria-label="More">
            {rightLinks.map(link)}
          </nav>
          <div className="header__actions">
            {cartButton}
            <SketchBox
              as="button"
              type="button"
              className="burger"
              radius={14}
              seed={18}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </SketchBox>
          </div>
        </div>
      </SketchBox>

      <div className={`sheet-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen} style={menuOpen ? undefined : { visibility: "hidden" }}>
        <div className="sheet-menu__backdrop" onClick={() => setMenuOpen(false)} />
        <SketchBox as="nav" id="mobile-menu" className="sheet-menu__panel" tint="#c9803e" edges={["left"]} seed={29} aria-label="منوی اصلی">
          <ul>
            {[...rightLinks.slice().reverse(), ...leftLinks.slice().reverse()].map((l) => (
              <li key={l.href}>
                <Link href={l.href} tabIndex={menuOpen ? 0 : -1} aria-current={l.match(path, cat) ? "page" : undefined}>
                  <span className="sheet-menu__fa">{l.fa}</span>
                  <span className="sheet-menu__hand" dir="ltr">
                    {l.hand}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="sheet-menu__foot">
            <OpenBadge />
            <p>{contact.address}</p>
            <p dir="ltr" className="sheet-menu__phone">
              {contact.phone}
            </p>
          </div>
        </SketchBox>
      </div>
    </>
  );
}
