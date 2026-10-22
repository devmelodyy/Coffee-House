import type { Metadata } from "next";
import { Art, type ArtName } from "@/components/illustrations";
import { SketchBox } from "@/components/sketch/SketchBox";
import { Button, SectionHead } from "@/components/ui";

export const metadata: Metadata = { title: "درباره ما" };

// A real sequence, so the steps are numbered.
const steps: { art: ArtName; title: string; text: string }[] = [
  { art: "bean", title: "دانه", text: "ترکیب ۷۰/۳۰ عربیکا و روبوستا، از یک تأمین‌کننده‌ی ثابت." },
  { art: "steam", title: "برشته‌کاری", text: "هر سه‌شنبه به اندازه‌ی یک هفته برشته می‌کنیم، نه بیشتر." },
  { art: "latte", title: "فنجان", text: "آسیاب درست قبل از دم؛ هر شات ۱۸ گرم قهوه و ۲۸ ثانیه." },
];

export default function AboutPage() {
  return (
    <div className="container about-page">
      <header className="page-head">
        <SectionHead as="h1" hand="About us" fa="داستان کافه هاوس" seed={31} />
      </header>

      <div className="about-intro">
        <SketchBox className="panel" tint="#d08a45" seed={701}>
          <p className="lead">
            کافه هاوس از یک میز کوچک و یک دستگاه اسپرسوی دست‌دوم شروع شد. هنوز هم کوچک است، ولی حالا فر خودمان را داریم و هر صبح کروسان
            می‌پزیم.
          </p>
          <p>
            منو را کوتاه نگه داشته‌ایم تا هر چیزی که سر میز می‌آید تازه باشد. چیزکیک لوتوس دستور خانگی خودمان است و همبرگر را با نان بریوشی
            که خودمان می‌پزیم سرو می‌کنیم. اینجا جایی است برای نشستن کنار پنجره، کتاب خواندن و آرام نوشیدن قهوه.
          </p>
          <Button href="/contact#reserve" seed={11}>
            رزرو میز
          </Button>
        </SketchBox>
        <div className="about-intro__art" aria-hidden="true">
          <Art name="croissant" className="draw-in" />
          <Art name="cheesecake" className="draw-in" />
        </div>
      </div>

      <section aria-labelledby="process-title" className="process">
        <SectionHead id="process-title" hand="From bean to cup" fa="از دانه تا فنجان" seed={19} />
        <ol className="process__list">
          {steps.map((s, i) => (
            <SketchBox as="li" key={s.title} className="process__step" tint="#c7c25e" seed={720 + i * 9}>
              <span className="process__num">{["۱", "۲", "۳"][i]}</span>
              <Art name={s.art} className="process__art" />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </SketchBox>
          ))}
        </ol>
      </section>
    </div>
  );
}
