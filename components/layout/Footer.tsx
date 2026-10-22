"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Art } from "../illustrations";
import { HandText } from "../sketch/HandText";
import { SketchBox } from "../sketch/SketchBox";
import { LogoBadge } from "../ui";
import { contact, credit, hours, toFa } from "@/data/menu";
import { phoneError } from "@/lib/validate";

const social = [
  { label: "اینستاگرام", handle: contact.instagram, href: "https://instagram.com/caffee.house", icon: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5h.01" },
  { label: "تلگرام", handle: "@caffeehouse_tbz", href: "https://t.me/caffeehouse_tbz", icon: "M21 4 3 11l6 2m12-9-4 16-8-7m12-9L9 13v6l3-3" },
];

export function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <BeanRow />
      <SketchBox className="footer__band" edges={["top"]} tint="#c9803e" seed={233}>
        <div className="container footer__grid">
          <div className="footer__brand">
            <LogoBadge className="footer__logo" />
            <div>
              <p className="footer__name">
                <HandText text="Caffee House" seed={41} />
              </p>
              <p className="footer__tag">قهوه‌ی تازه‌برشته، کیک خانگی و غذای ساده و خوب، در ولیعصر تبریز.</p>
              <ul className="footer__social">
                {social.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} ${s.handle}`}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d={s.icon} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <nav aria-label="صفحه‌ها" className="footer__col">
            <h2 className="footer__h">صفحه‌ها</h2>
            <ul className="footer__links">
              <li><Link href="/menu">منو</Link></li>
              <li><Link href="/menu?cat=special">پیشنهاد ویژه</Link></li>
              <li><Link href="/contact#reserve">رزرو میز</Link></li>
              <li><Link href="/#events">برنامه‌ها</Link></li>
              <li><Link href="/about">درباره ما</Link></li>
              <li><Link href="/checkout">سبد خرید</Link></li>
            </ul>
          </nav>

          <div className="footer__col">
            <h2 className="footer__h">ساعت کاری</h2>
            <ul className="footer__hours">
              {hours.map((h) => (
                <li key={h.days}>
                  <span>{h.days}</span>
                  <span className="num">
                    {toFa(h.open)}:۰۰ – {toFa(h.close)}:۰۰
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h2 className="footer__h">تماس</h2>
            <address className="footer__contact">
              <span>{contact.address}</span>
              <span dir="ltr" className="selectable">
                {contact.phone}
              </span>
              <span dir="ltr" className="selectable">
                {contact.email}
              </span>
            </address>
            <Newsletter />
          </div>
        </div>

        <div className="container footer__bottom">
          <p>© {toFa(1405)} کافه هاوس، تبریز</p>
          <p className="footer__credit">
            <span aria-hidden="true">✎</span> {credit}
          </p>
        </div>
      </SketchBox>
    </footer>
  );
}

function BeanRow() {
  return (
    <div className="footer__beans" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} style={{ transform: `rotate(${(i * 47) % 80 - 40}deg) translateY(${i % 2 ? 5 : -3}px)` }}>
          <Art name={i === 4 ? "steam" : "bean"} />
        </span>
      ))}
    </div>
  );
}

/** Demo newsletter signup: validates and confirms in place, nothing is sent. */
function Newsletter() {
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const pe = phoneError(phone);
    setErr(pe);
    if (!pe) setDone(true);
  };
  if (done) return <p className="footer__ok" role="status">ثبت شد. برنامه‌های پنجشنبه را پیامک می‌کنیم.</p>;
  return (
    <form className="footer__news" onSubmit={submit} noValidate>
      <label htmlFor="news-phone">خبر برنامه‌ها با پیامک</label>
      <div className="footer__news-row">
        <SketchBox className="field__box" radius={10} seed={9}>
          <input
            id="news-phone"
            type="tel"
            inputMode="tel"
            dir="ltr"
            placeholder="0914 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={!!err}
            aria-describedby={err ? "news-err" : undefined}
          />
        </SketchBox>
        <button type="submit" className="footer__news-btn">
          عضویت
        </button>
      </div>
      {err && (
        <p id="news-err" className="field__msg">
          {err}
        </p>
      )}
    </form>
  );
}
