import type { Metadata } from "next";
import { SketchBox } from "@/components/sketch/SketchBox";
import { OpenBadge, SectionHead } from "@/components/ui";
import { contact, faq, hours, toFa } from "@/data/menu";
import { Reservation } from "./Reservation";

export const metadata: Metadata = { title: "تماس و رزرو" };

const { lat, lon } = contact;
const mapEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.006}%2C${lat - 0.0035}%2C${lon + 0.006}%2C${lat + 0.0035}&layer=mapnik&marker=${lat}%2C${lon}`;
const mapLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;

export default function ContactPage() {
  return (
    <div className="container contact-page">
      <header className="page-head">
        <SectionHead as="h1" hand="Contact" fa="تماس، مسیر و رزرو میز" seed={3} />
        <p>میز رزرو کنید، مسیر را ببینید یا با ما تماس بگیرید.</p>
      </header>

      <div className="contact-grid">
        <SketchBox as="section" id="reserve" className="panel" tint="#a9bb72" seed={601} aria-labelledby="reserve-title">
          <h2 id="reserve-title" className="panel__title">
            رزرو میز
          </h2>
          <p className="muted">برای گروه‌های بیشتر از ۱۲ نفر تماس بگیرید.</p>
          <Reservation />
        </SketchBox>

        <div className="contact-side">
          <SketchBox as="section" className="panel" tint="#d08a45" seed={611} aria-labelledby="visit-title">
            <h2 id="visit-title" className="panel__title">
              آدرس و تماس
            </h2>
            <OpenBadge />
            <dl className="facts">
              <div>
                <dt>آدرس</dt>
                <dd>{contact.address}</dd>
              </div>
              <div>
                <dt>تلفن</dt>
                <dd dir="ltr" className="selectable">
                  {contact.phone}
                </dd>
              </div>
              <div>
                <dt>اینستاگرام</dt>
                <dd dir="ltr" className="selectable">
                  {contact.instagram}
                </dd>
              </div>
            </dl>
          </SketchBox>

          <SketchBox as="section" className="panel" seed={621} aria-labelledby="hours-title">
            <h2 id="hours-title" className="panel__title">
              ساعت کاری
            </h2>
            <ul className="hours">
              {hours.map((h) => (
                <li key={h.days}>
                  <span>{h.days}</span>
                  <span className="num">
                    {toFa(h.open)}:۰۰ – {toFa(h.close)}:۰۰
                  </span>
                </li>
              ))}
            </ul>
          </SketchBox>
        </div>
      </div>

      <SketchBox as="section" id="map" className="map" seed={631} radius={16} aria-labelledby="map-title">
        <div className="map__head">
          <h2 id="map-title" className="panel__title">
            مسیر روی نقشه
          </h2>
          <a className="link-more" href={mapLink} target="_blank" rel="noopener noreferrer">
            باز کردن در OpenStreetMap ←
          </a>
        </div>
        <iframe className="map__frame" title="نقشه‌ی کافه هاوس در ولیعصر تبریز" src={mapEmbed} loading="lazy" />
      </SketchBox>

      <section className="faq" aria-labelledby="faq-title">
        <SectionHead id="faq-title" hand="FAQ" fa="سؤال‌های پرتکرار" seed={13} />
        <div className="faq__list">
          {faq.map((f, i) => (
            <SketchBox as="details" key={f.q} className="faq__item" radius={14} seed={650 + i * 3}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </SketchBox>
          ))}
        </div>
      </section>
    </div>
  );
}
