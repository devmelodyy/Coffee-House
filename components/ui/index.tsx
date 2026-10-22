"use client";

import Link from "next/link";
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { Drawing, ell, type DrawingSpec } from "../sketch/Drawing";
import { SketchBox } from "../sketch/SketchBox";
import { HandText } from "../sketch/HandText";
import { openStatus } from "@/lib/hours";
import { toFa } from "@/data/menu";

/* ---------- Buttons ---------- */

type BtnProps = {
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  href?: string;
  seed?: number;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"button">, "className" | "children">;

export function Button({ variant = "primary", size = "md", href, seed = 3, className = "", children, ...rest }: BtnProps) {
  const cls = `btn btn--${variant} btn--${size} ${className}`;
  const tint = variant === "primary" ? "#a8693a" : undefined;
  if (href) {
    return (
      <SketchBox as={Link} href={href} className={cls} tint={tint} radius={14} seed={seed}>
        {children}
      </SketchBox>
    );
  }
  return (
    <SketchBox as="button" type="button" className={cls} tint={tint} radius={14} seed={seed} {...rest}>
      {children}
    </SketchBox>
  );
}

/* ---------- Section heading: hand-lettered English as in the sketch, Persian line under it ---------- */

export function SectionHead({
  id,
  hand,
  fa,
  seed = 1,
  align = "center",
  as: Tag = "h2",
}: {
  id?: string;
  hand: string;
  fa: string;
  seed?: number;
  align?: "center" | "start";
  as?: "h1" | "h2";
}) {
  return (
    <Tag id={id} className={`section-head section-head--${align}`}>
      <HandText text={hand} seed={seed} className="section-head__hand" />
      <span className="section-head__fa">{fa}</span>
    </Tag>
  );
}

/* ---------- Quantity stepper ---------- */

export function Stepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <SketchBox className="stepper" radius={12} seed={value + 5} role="group" aria-label={`تعداد ${label}`}>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="یکی بیشتر">
        +
      </button>
      <output aria-live="polite">{toFa(value)}</output>
      <button type="button" onClick={() => onChange(value - 1)} aria-label={value === 1 ? "حذف از سبد" : "یکی کمتر"}>
        {value === 1 ? "×" : "−"}
      </button>
    </SketchBox>
  );
}

/* ---------- Form fields ---------- */

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <SketchBox className="field__box" radius={10} seed={id.length * 7}>
        {children}
      </SketchBox>
      {error ? (
        <p className="field__msg" id={`${id}-err`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint">{hint}</p>
      ) : null}
    </div>
  );
}

/* ---------- Open / closed badge ---------- */

export function OpenBadge() {
  const [status, setStatus] = useState<ReturnType<typeof openStatus> | null>(null);
  useEffect(() => {
    setStatus(openStatus());
    const t = setInterval(() => setStatus(openStatus()), 60_000);
    return () => clearInterval(t);
  }, []);
  if (!status) return <span className="open-badge open-badge--loading" aria-hidden="true" />;
  return (
    <span className={`open-badge ${status.open ? "is-open" : "is-closed"}`}>
      <span className="open-badge__dot" aria-hidden="true" />
      {status.text}
    </span>
  );
}

/* ---------- Logo badge ---------- */

const beans = [
  [72, 64, -28],
  [100, 54, 0],
  [128, 64, 28],
] as const;

const logoSpec: DrawingSpec = {
  viewBox: "0 0 200 200",
  shapes: [
    { d: ell(100, 100, 94, 94), fill: "#d9a066", shade: "#a8693a", shadeWidth: 22, ink: 2.8 },
    { d: ell(100, 100, 75, 75), fill: "#fbf5e8", shade: "#ead9bd", shadeWidth: 12, ink: 2.4 },
    ...beans.flatMap(([x, y, a]) => [
      { d: ell(x, y, 11, 7.5), fill: "#8a5634", shade: "#4a2914", shadeWidth: 3, ink: 1.8, transform: `rotate(${a} ${x} ${y})` },
      { d: `M${x - 8} ${y + 2} Q${x} ${y - 5} ${x + 8} ${y}`, ink: 1.4, transform: `rotate(${a} ${x} ${y})` },
    ]),
  ],
  extra: (
    <g fill="#3a2a1f" style={{ fontFamily: "var(--font-hand), cursive" }} textAnchor="middle">
      <text x="100" y="116" fontSize="46">
        Caffee
      </text>
      <text x="100" y="146" fontSize="22" letterSpacing="4">
        HOUSE
      </text>
    </g>
  ),
};

export function LogoBadge({ className }: { className?: string }) {
  return <Drawing spec={logoSpec} className={className} />;
}
