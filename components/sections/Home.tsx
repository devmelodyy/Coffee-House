"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { Art, type ArtName } from "../illustrations";
import { HandText } from "../sketch/HandText";
import { SketchBox } from "../sketch/SketchBox";
import { Button, OpenBadge, SectionHead } from "../ui";
import { DishDialog, MenuCard } from "../menu/MenuCard";
import { coffeeOfWeek, contact, events, menu, toman, type MenuItem } from "@/data/menu";

/* ---------- Hero ---------- */

type Scene = { title: string; left: ArtName; center: ArtName; right: ArtName; caption: string };

const scenes: Scene[] = [
  { title: "Delicious Coffee", left: "iced", center: "latte", right: "choco", caption: "آیس‌کافی، لاته و شکلات لوتوس" },
  { title: "Fresh Pastry", left: "cake", center: "croissant", right: "steam", caption: "کروسان تازه با اسپرسو" },
  { title: "Cold & Sweet", left: "cupcake", center: "cheesecake", right: "iced", caption: "چیزکیک لوتوس با آیس‌کافی" },
];

const perks: { art: ArtName; text: string }[] = [
  { art: "bean", text: "برشته‌کاری هفتگی" },
  { art: "croissant", text: "کروسان هر صبح" },
  { art: "steam", text: "سفارش بدون صف" },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % scenes.length), 7000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <SketchBox as="section" className="hero" edges={["bottom"]} tint="#8fa45c" seed={9} aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <OpenBadge />
          <h1 id="hero-title" className="hero__title">
            <span className="hero__hand">
              <HandText text={scenes[current].title} seed={current * 7 + 3} key={current} />
            </span>
            <span className="hero__fa">
              قهوه‌ی تازه، کیک خانگی، <mark className="scribble">حال خوب</mark>
            </span>
          </h1>
          <p className="hero__lead">
            یک کافه‌ی کوچک در ولیعصر تبریز. دانه‌ها را هر هفته خودمان برشته می‌کنیم و کروسان‌ها هر صبح از فر بیرون می‌آیند. آنلاین سفارش
            بدهید و سر راه تحویل بگیرید، یا میزتان را از قبل رزرو کنید.
          </p>
          <div className="hero__cta">
            <Button href="/menu" seed={5}>
              سفارش آنلاین
            </Button>
            <Button href="/contact#reserve" variant="ghost" seed={6}>
              رزرو میز
            </Button>
          </div>
          <ul className="perks">
            {perks.map((p) => (
              <li key={p.text}>
                <Art name={p.art} className="perks__icon" />
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="hero__stage"
          aria-roledescription="carousel"
          aria-label="محصولات منتخب"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span className="float-bean float-bean--1" aria-hidden="true"><Art name="bean" /></span>
          <span className="float-bean float-bean--2" aria-hidden="true"><Art name="bean" /></span>
          <span className="float-bean float-bean--3" aria-hidden="true"><Art name="bean" /></span>
          <div className="hero__scenes">
            {scenes.map((s, i) => (
              <figure key={s.title} className={`scene ${i === current ? "is-active" : ""}`} aria-hidden={i !== current} id={`scene-${i}`}>
                {/* Remount on activation so the pen traces the drawings again */}
                <Fragment key={i === current ? "on" : "off"}>
                  <Art name={s.left} className="scene__art scene__art--side draw-in" />
                  <Art name={s.center} className="scene__art scene__art--center draw-in" />
                  <Art name={s.right} className="scene__art scene__art--side scene__art--tilt draw-in" />
                </Fragment>
                <figcaption className="visually-hidden">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
          <div className="dots" role="tablist" aria-label="انتخاب تصویر">
            {scenes.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-controls={`scene-${i}`}
                aria-label={s.caption}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </SketchBox>
  );
}

/* ---------- Category cards ---------- */

const cats = [
  { hand: "Food", href: "/menu?cat=food", arts: ["fries", "pizza"] as ArtName[], fa: "غذا" },
  { hand: "Cake", href: "/menu?cat=dessert", arts: ["cupcake", "cake"] as ArtName[], fa: "کیک و دسر" },
  { hand: "Special", href: "/menu?cat=special", arts: ["steam"] as ArtName[], fa: "پیشنهاد ویژه" },
];

export function Categories() {
  return (
    <section className="cats container" id="categories" aria-label="دسته‌بندی منو">
      <Art name="leaves" className="cats__leaves" />
      <div className="cats__grid">
        {cats.map((c, i) => (
          <SketchBox key={c.hand} as={Link} href={c.href} className="cat" tint="#d08a45" seed={21 + i * 13} aria-label={c.fa}>
            <span className="cat__art">
              {c.arts.map((a) => (
                <Art key={a} name={a} className={`cat__img cat__img--${a}`} />
              ))}
            </span>
            <HandText text={c.hand} seed={5 + i * 3} className="cat__label" />
            <span className="cat__fa">{c.fa}</span>
          </SketchBox>
        ))}
      </div>
    </section>
  );
}

/* ---------- Specials carousel ---------- */

export function Specials() {
  const specials = menu.filter((m) => m.special);
  const [open, setOpen] = useState<MenuItem | null>(null);
  const track = useRef<HTMLDivElement>(null);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(".dish");
    // RTL track: later cards sit to the left (negative scrollLeft).
    el?.scrollBy({ left: -dir * ((card?.offsetWidth ?? 240) + 18), behavior: "smooth" });
  };

  return (
    <div className="container" id="specials">
      <SketchBox as="section" className="specials" tint="#a9bb72" seed={61} radius={12} aria-labelledby="specials-title">
        <div className="specials__head">
          <SectionHead id="specials-title" hand="Special menu" fa="پیشنهادهای این هفته" seed={17} />
          <Link href="/menu" className="link-more">
            همه‌ی منو ←
          </Link>
        </div>
        <div className="carousel">
          <button type="button" className="carousel__arrow carousel__arrow--prev" onClick={() => step(-1)} aria-label="قبلی">
            ›
          </button>
          <div className="carousel__track" ref={track} tabIndex={0} aria-label="پیشنهادهای ویژه">
            {specials.map((m, i) => (
              <MenuCard key={m.id} item={m} seed={100 + i * 3} onOpen={setOpen} compact />
            ))}
          </div>
          <button type="button" className="carousel__arrow carousel__arrow--next" onClick={() => step(1)} aria-label="بعدی">
            ‹
          </button>
        </div>
      </SketchBox>
      {open && <DishDialog item={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

/* ---------- Coffee of the week ---------- */

export function CoffeeOfWeek() {
  const c = coffeeOfWeek;
  return (
    <section className="container cow" id="coffee-of-week" aria-labelledby="cow-title">
      <SketchBox className="cow__card" tint="#c98a4b" seed={251}>
        <div className="cow__art" aria-hidden="true">
          <Art name="latte" />
          <span className="cow__stamp">
            <HandText text="new" seed={2} />
          </span>
        </div>
        <div className="cow__body">
          <SectionHead id="cow-title" hand="Coffee of the week" fa="دانه‌ی این هفته" seed={23} align="start" />
          <h3 className="cow__name">
            {c.name} <span dir="ltr">{c.hand}</span>
          </h3>
          <ul className="chips" aria-label="طعم‌ها">
            {c.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <dl className="cow__facts">
            <div>
              <dt>فرآوری</dt>
              <dd>{c.process}</dd>
            </div>
            <div>
              <dt>ارتفاع</dt>
              <dd>{c.altitude}</dd>
            </div>
            <div>
              <dt>دم‌آوری</dt>
              <dd>{c.brew.join("، ")}</dd>
            </div>
            <div>
              <dt>درجه‌ی برشت</dt>
              <dd>
                <span className="roast" role="img" aria-label={`روشن، ${c.roast} از ۵`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className={n <= c.roast ? "is-on" : ""} />
                  ))}
                </span>
              </dd>
            </div>
          </dl>
          <div className="cow__foot">
            <strong>{toman(c.price)}</strong>
            <Button href="/menu?cat=coffee" size="sm" seed={14}>
              سفارش قهوه
            </Button>
          </div>
        </div>
      </SketchBox>
    </section>
  );
}

/* ---------- How ordering works (a real sequence, so numbered) ---------- */

const steps = [
  { art: "croissant" as ArtName, title: "از منو انتخاب کنید", text: "قهوه، دسر یا غذا را به سبد اضافه کنید." },
  { art: "iced" as ArtName, title: "سفارش را ثبت کنید", text: "نام و موبایل کافی است؛ بدون ثبت‌نام." },
  { art: "steam" as ArtName, title: "بدون صف تحویل بگیرید", text: "آماده که شد پیامک می‌گیرید." },
];

export function HowItWorks() {
  return (
    <section className="container how" id="how" aria-labelledby="how-title">
      <SectionHead id="how-title" hand="How it works" fa="سفارش آنلاین در سه قدم" seed={29} />
      <ol className="how__list">
        {steps.map((s, i) => (
          <li key={s.title} className="how__step">
            <span className="how__num" aria-hidden="true">
              {["۱", "۲", "۳"][i]}
            </span>
            <Art name={s.art} className="how__art" />
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- Events ---------- */

export function Events() {
  return (
    <section className="container events" id="events" aria-labelledby="events-title">
      <SectionHead id="events-title" hand="Events" fa="برنامه‌های پنجشنبه‌ها" seed={33} />
      <ul className="events__list">
        {events.map((e, i) => (
          <SketchBox as="li" key={e.title} className="event" tint={["#e39a4c", "#9db86a", "#c98a4b"][i % 3]} seed={270 + i * 7}>
            <div className="event__date" aria-label={`${e.weekday} ${e.day} ${e.month}`}>
              <span className="event__day">{e.day}</span>
              <span className="event__month">{e.month}</span>
            </div>
            <div className="event__body">
              <p className="event__meta">
                {e.weekday} · ساعت {e.time}
              </p>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
              <div className="event__foot">
                <span className="chip">{e.tag}</span>
                <Link href="/contact#reserve" className="link-more">
                  رزرو جا ←
                </Link>
              </div>
            </div>
          </SketchBox>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Story + visit ---------- */

export function StoryAndVisit() {
  return (
    <section className="container story" id="visit">
      <SketchBox className="panel story__text" tint="#d08a45" seed={201}>
        <SectionHead hand="About us" fa="ما کی هستیم" seed={31} align="start" />
        <p>
          کافه هاوس یک کافه‌ی کوچک و دنج است برای کسانی که قهوه را آرام می‌نوشند. چیزکیک لوتوس دستور خانگی خودمان است و منوی غذا را
          کوتاه نگه داشته‌ایم تا هر چیزی که می‌آید تازه باشد.
        </p>
        <Link href="/about" className="link-more">
          بیشتر بخوانید ←
        </Link>
      </SketchBox>
      <SketchBox className="panel story__visit" tint="#a9bb72" seed={211}>
        <SectionHead hand="Visit us" fa="کجا هستیم" seed={37} align="start" />
        <OpenBadge />
        <p>{contact.address}</p>
        <p dir="ltr" className="story__phone">
          {contact.phone}
        </p>
        <div className="story__actions">
          <Button href="/contact#reserve" size="sm" seed={8}>
            رزرو میز
          </Button>
          <Button href="/contact#map" size="sm" variant="ghost" seed={9}>
            مسیر روی نقشه
          </Button>
        </div>
      </SketchBox>
    </section>
  );
}
