import type { Metadata, Viewport } from "next";
import { Aref_Ruqaa, Gochi_Hand, Vazirmatn } from "next/font/google";
import { SketchDefs } from "@/components/sketch/SketchDefs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer, Toast } from "@/components/layout/CartDrawer";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const hand = Gochi_Hand({ weight: "400", subsets: ["latin"], variable: "--font-hand" });
const fa = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-fa" });
const faHand = Aref_Ruqaa({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-fa-hand" });

export const metadata: Metadata = {
  title: { default: "Caffee House | کافه هاوس", template: "%s | Caffee House" },
  description: "کافه هاوس: قهوه‌ی تازه‌برشته، کیک خانگی و غذای ویژه. سفارش آنلاین و رزرو میز.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#dba46c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${hand.variable} ${fa.variable} ${faHand.variable}`}>
      <body>
        <SketchDefs />
        <CartProvider>
          <a href="#main" className="skip-link">
            رفتن به محتوا
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
