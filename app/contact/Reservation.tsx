"use client";

import { useEffect, useState, type FormEvent } from "react";
import { SketchBox } from "@/components/sketch/SketchBox";
import { Button, Field, Stepper } from "@/components/ui";
import { toFa } from "@/data/menu";
import { nameError, phoneError, reservationTimes, todayInTehran, type ReservationPayload } from "@/lib/validate";

export function Reservation() {
  const [today, setToday] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "19:00", guests: 2, notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    const t = todayInTehran();
    setToday(t);
    setForm((f) => (f.date ? f : { ...f, date: t }));
  }, []);

  const set = (k: "name" | "phone" | "date" | "time" | "notes") => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const local: Record<string, string> = {};
    const ne = nameError(form.name);
    if (ne) local.name = ne;
    const pe = phoneError(form.phone);
    if (pe) local.phone = pe;
    if (!form.date || form.date < today) local.date = "تاریخی از امروز به بعد انتخاب کنید.";
    setErrors(local);
    if (Object.keys(local).length) {
      document.getElementById(`rs-${Object.keys(local)[0]}`)?.focus();
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form satisfies ReservationPayload),
      });
      const data = await res.json();
      if (!res.ok) return setErrors(data.errors ?? { form: "رزرو ثبت نشد. دوباره امتحان کنید." });
      setDone(data.code);
    } catch {
      setErrors({ form: "اتصال برقرار نشد. اینترنت را بررسی کنید و دوباره امتحان کنید." });
    } finally {
      setSending(false);
    }
  }

  if (done) {
    const d = new Intl.DateTimeFormat("fa-IR", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${form.date}T12:00:00`));
    return (
      <SketchBox className="panel success" tint="#9db86a" seed={501} role="status">
        <h3>میز شما رزرو شد</h3>
        <p>
          {d}، ساعت {toFa(form.time)} برای {toFa(form.guests)} نفر. کد رزرو: <strong dir="ltr">{done}</strong>
        </p>
        <p className="muted">اگر برنامه‌تان عوض شد، با کافه تماس بگیرید.</p>
        <Button variant="ghost" size="sm" onClick={() => { setDone(null); setForm((f) => ({ ...f, notes: "" })); }}>
          رزرو دیگر
        </Button>
      </SketchBox>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="reserve-form">
      <div className="form-row">
        <Field id="rs-name" label="نام" error={errors.name}>
          <input id="rs-name" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} />
        </Field>
        <Field id="rs-phone" label="موبایل" error={errors.phone}>
          <input id="rs-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="0912 345 6789" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.phone} />
        </Field>
      </div>
      <div className="form-row form-row--3">
        <Field id="rs-date" label="تاریخ" error={errors.date}>
          <input id="rs-date" type="date" min={today} value={form.date} onChange={set("date")} aria-invalid={!!errors.date} />
        </Field>
        <Field id="rs-time" label="ساعت" error={errors.time}>
          <select id="rs-time" value={form.time} onChange={set("time")}>
            {reservationTimes.map((t) => (
              <option key={t} value={t}>
                {toFa(t)}
              </option>
            ))}
          </select>
        </Field>
        <div className="field">
          <span className="field__label" id="rs-guests-label">
            تعداد نفرات
          </span>
          <Stepper value={form.guests} onChange={(n) => setForm((f) => ({ ...f, guests: Math.max(1, Math.min(12, n)) }))} label="نفرات" />
          {errors.guests && <p className="field__msg">{errors.guests}</p>}
        </div>
      </div>
      <Field id="rs-notes" label="توضیحات (اختیاری)" hint="مثلاً: میز کنار پنجره، جشن تولد">
        <textarea id="rs-notes" rows={2} value={form.notes} onChange={set("notes")} />
      </Field>
      {errors.form && (
        <p className="form-error" role="alert">
          {errors.form}
        </p>
      )}
      <Button type="submit" disabled={sending}>
        {sending ? "در حال ثبت…" : "رزرو میز"}
      </Button>
    </form>
  );
}
