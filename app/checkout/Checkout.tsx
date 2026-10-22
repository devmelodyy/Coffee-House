"use client";

import { useState, type FormEvent } from "react";
import { Art } from "@/components/illustrations";
import { HandText } from "@/components/sketch/HandText";
import { SketchBox } from "@/components/sketch/SketchBox";
import { Button, Field, Stepper } from "@/components/ui";
import { useCart } from "@/lib/cart";
import { menuById, toFa, toman } from "@/data/menu";
import { nameError, phoneError, type OrderPayload } from "@/lib/validate";

const whenLabels: Record<OrderPayload["when"], string> = { asap: "هرچه زودتر (حدود ۱۵ دقیقه)", "30": "۳۰ دقیقه دیگر", "60": "یک ساعت دیگر" };

export function Checkout() {
  const { lines, total, count, setQty, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", mode: "pickup" as OrderPayload["mode"], table: "", when: "asap" as OrderPayload["when"], notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ code: string; total: number; when: string } | null>(null);
  const entries = Object.entries(lines);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const local: Record<string, string> = {};
    const ne = nameError(form.name);
    if (ne) local.name = ne;
    const pe = phoneError(form.phone);
    if (pe) local.phone = pe;
    if (form.mode === "table" && !form.table.trim()) local.table = "شماره میز را وارد کنید.";
    setErrors(local);
    if (Object.keys(local).length) {
      document.getElementById(`co-${Object.keys(local)[0]}`)?.focus();
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lines } satisfies OrderPayload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? { form: "ثبت سفارش انجام نشد. دوباره امتحان کنید." });
        return;
      }
      setDone({ code: data.code, total: data.total, when: whenLabels[form.when] });
      clear();
      window.scrollTo({ top: 0 });
    } catch {
      setErrors({ form: "اتصال برقرار نشد. اینترنت را بررسی کنید و دوباره امتحان کنید." });
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="container narrow">
        <SketchBox className="panel success" tint="#9db86a" seed={401}>
          <Art name="steam" className="success__art draw-in" />
          <h1 className="section-hand" dir="ltr">
            <HandText text="Thank you!" seed={9} />
          </h1>
          <p>سفارش شما ثبت شد. پرداخت هنگام تحویل در کافه انجام می‌شود.</p>
          <dl className="success__facts">
            <div>
              <dt>کد سفارش</dt>
              <dd dir="ltr">{done.code}</dd>
            </div>
            <div>
              <dt>مبلغ</dt>
              <dd>{toman(done.total)}</dd>
            </div>
            <div>
              <dt>زمان آماده شدن</dt>
              <dd>{done.when}</dd>
            </div>
          </dl>
          <Button href="/menu" variant="ghost">
            بازگشت به منو
          </Button>
        </SketchBox>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="container narrow">
        <SketchBox className="panel empty-cart" tint="#d08a45" seed={402}>
          <Art name="latte" className="empty-cart__art" />
          <h1>سبد خرید خالی است</h1>
          <p>از منو چیزی انتخاب کنید تا اینجا نمایش داده شود.</p>
          <Button href="/menu">دیدن منو</Button>
        </SketchBox>
      </div>
    );
  }

  return (
    <div className="container checkout">
      <header className="page-head">
        <h1 className="section-hand" dir="ltr">
          <HandText text="Checkout" seed={6} />
        </h1>
        <p>سفارش را آنلاین ثبت کنید و در کافه تحویل بگیرید. پرداخت در کافه انجام می‌شود.</p>
      </header>

      <div className="checkout__grid">
        <form className="checkout__form" onSubmit={submit} noValidate>
          <SketchBox as="fieldset" className="panel" seed={410}>
            <legend>اطلاعات شما</legend>
            <Field id="co-name" label="نام" error={errors.name}>
              <input id="co-name" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "co-name-err" : undefined} />
            </Field>
            <Field id="co-phone" label="موبایل" error={errors.phone} hint="برای خبر دادن آماده شدن سفارش">
              <input id="co-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="0912 345 6789" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "co-phone-err" : undefined} />
            </Field>
          </SketchBox>

          <SketchBox as="fieldset" className="panel" seed={420}>
            <legend>تحویل</legend>
            <div className="choice" role="radiogroup" aria-label="نوع تحویل">
              {(
                [
                  ["pickup", "بیرون‌بر", "سر راه تحویل می‌گیرم"],
                  ["table", "سر میز", "الان در کافه هستم"],
                ] as const
              ).map(([v, t, s], i) => (
                <SketchBox as="label" key={v} className={`choice__opt ${form.mode === v ? "is-on" : ""}`} radius={12} seed={430 + i} tint={form.mode === v ? "#c98a4b" : undefined}>
                  <input type="radio" name="mode" value={v} checked={form.mode === v} onChange={set("mode")} />
                  <strong>{t}</strong>
                  <span>{s}</span>
                </SketchBox>
              ))}
            </div>
            {form.mode === "table" ? (
              <Field id="co-table" label="شماره میز" error={errors.table}>
                <input id="co-table" inputMode="numeric" dir="ltr" value={form.table} onChange={set("table")} aria-invalid={!!errors.table} />
              </Field>
            ) : (
              <Field id="co-when" label="زمان تحویل">
                <select id="co-when" value={form.when} onChange={set("when")}>
                  {Object.entries(whenLabels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <Field id="co-notes" label="توضیحات (اختیاری)" hint="مثلاً: شیر بادام، بدون شکر">
              <textarea id="co-notes" rows={3} value={form.notes} onChange={set("notes")} />
            </Field>
          </SketchBox>

          {(errors.form || errors.lines) && (
            <p className="form-error" role="alert">
              {errors.form ?? errors.lines}
            </p>
          )}
          <Button type="submit" className="btn--block checkout__submit" disabled={sending}>
            {sending ? "در حال ثبت…" : `ثبت سفارش · ${toman(total)}`}
          </Button>
        </form>

        <SketchBox as="aside" className="panel summary" tint="#c7c25e" seed={450} aria-label="خلاصه سفارش">
          <h2>
            سفارش شما <span className="muted">({toFa(count)} قلم)</span>
          </h2>
          <ul className="summary__lines">
            {entries.map(([id, q]) => {
              const it = menuById[id];
              return (
                <li key={id} className="line">
                  <Art name={it.art} className="line__art" />
                  <div className="line__info">
                    <span className="line__name">{it.name}</span>
                    <span className="line__price">{toman(it.price * q)}</span>
                  </div>
                  <Stepper value={q} onChange={(n) => setQty(id, n)} label={it.name} />
                </li>
              );
            })}
          </ul>
          <div className="summary__total">
            <span>جمع کل</span>
            <strong>{toman(total)}</strong>
          </div>
        </SketchBox>
      </div>
    </div>
  );
}
