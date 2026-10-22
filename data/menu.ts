import type { ArtName } from "@/components/illustrations";

export type Category = "coffee" | "cold" | "dessert" | "food";

export const categories: { id: Category; label: string; hand: string; color: string }[] = [
  { id: "coffee", label: "قهوه", hand: "Coffee", color: "#c98a4b" },
  { id: "cold", label: "نوشیدنی سرد", hand: "Cold", color: "#e39a4c" },
  { id: "dessert", label: "کیک و دسر", hand: "Cake", color: "#a8693a" },
  { id: "food", label: "غذا", hand: "Food", color: "#9db86a" },
];

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  /** Toman */
  price: number;
  art: ArtName;
  category: Category;
  special?: boolean;
  tags?: string[];
};

// Specials come first, in the order the sketch shows them right-to-left.
export const menu: MenuItem[] = [
  { id: "croissant", name: "کروسان شکلاتی", desc: "کروسان کره‌ای با مغز شکلات تلخ که هر صبح در فر کافه پخته می‌شود، کنار یک اسپرسو.", price: 145000, art: "croissant", category: "dessert", special: true, tags: ["تازه‌پز"] },
  { id: "cheesecake", name: "چیزکیک لوتوس", desc: "چیزکیک خامه‌ای روی بیسکویت لوتوس با سس کارامل، همراه آیس‌کافی.", price: 175000, art: "cheesecake", category: "dessert", special: true, tags: ["پرفروش"] },
  { id: "burger", name: "همبرگر مخصوص", desc: "۱۸۰ گرم گوشت گریل‌شده، پنیر چدار، کاهو و نان بریوش، با نوشابه.", price: 285000, art: "burger", category: "food", special: true },
  { id: "pasta", name: "پاستا آلفردو", desc: "پنه با سس خامه و قارچ، پارمزان و ریحان تازه.", price: 265000, art: "pasta", category: "food", special: true, tags: ["گیاهی"] },
  { id: "hotchoc", name: "هات‌چاکلت لوتوس", desc: "شکلات داغ با مارشمالو و یک تکه شکلات لوتوس.", price: 125000, art: "hotchoc", category: "coffee", special: true },
  { id: "latte", name: "لاته", desc: "دو شات اسپرسو با شیر بخارداده و لاته‌آرت.", price: 110000, art: "latte", category: "coffee" },
  { id: "cappuccino", name: "کاپوچینو", desc: "اسپرسو با کف شیر غلیظ و کمی پودر دارچین.", price: 105000, art: "steam", category: "coffee" },
  { id: "espresso", name: "اسپرسو دوبل", desc: "دو شات از دانه‌ی ۷۰/۳۰ عربیکا و روبوستا، برشته‌ی همین هفته.", price: 85000, art: "steam", category: "coffee" },
  { id: "iced", name: "آیس‌کافی کاراملی", desc: "قهوه‌ی سرد با شیر، یخ و سس کارامل که روی دیواره‌ی لیوان می‌ریزد.", price: 130000, art: "iced", category: "cold", tags: ["پرفروش"] },
  { id: "icedlatte", name: "آیس لاته", desc: "اسپرسو روی شیر سرد و یخ.", price: 120000, art: "iced", category: "cold" },
  { id: "affogato", name: "آفوگاتو", desc: "یک اسکوپ بستنی وانیل با یک شات اسپرسوی داغ.", price: 115000, art: "cupcake", category: "cold" },
  { id: "cake", name: "کیک شکلاتی", desc: "کیک خیس شکلاتی با لایه‌ی گاناش.", price: 120000, art: "cake", category: "dessert" },
  { id: "icecream", name: "بستنی وانیلی", desc: "بستنی قیفی وانیل در لیوان کاغذی.", price: 85000, art: "cupcake", category: "dessert" },
  { id: "lotusbar", name: "شکلات لوتوس", desc: "تابلت شکلات شیری با تکه‌های بیسکویت لوتوس.", price: 95000, art: "choco", category: "dessert" },
  { id: "pizza", name: "پیتزا پپرونی", desc: "خمیر نازک، پنیر موتزارلا و پپرونی.", price: 310000, art: "pizza", category: "food", tags: ["تند"] },
  { id: "fries", name: "سیب‌زمینی سرخ‌کرده", desc: "سیب‌زمینی ترد با سس مخصوص کافه.", price: 95000, art: "fries", category: "food", tags: ["گیاهی"] },
];

export const menuById = Object.fromEntries(menu.map((m) => [m.id, m])) as Record<string, MenuItem>;

const faDigits = "۰۱۲۳۴۵۶۷۸۹";
export const toFa = (s: string | number) => String(s).replace(/\d/g, (d) => faDigits[+d]);
export const toman = (n: number) => `${n.toLocaleString("fa-IR")} تومان`;

/** Opening hours by JS weekday (0 = Sunday), in Tehran time. */
export const hours: { days: string; open: number; close: number; weekdays: number[] }[] = [
  { days: "شنبه تا چهارشنبه", open: 8, close: 23, weekdays: [6, 0, 1, 2, 3] },
  { days: "پنجشنبه", open: 8, close: 24, weekdays: [4] },
  { days: "جمعه", open: 10, close: 24, weekdays: [5] },
];

// Demo details: the address and number are placeholders for a Tabriz café.
export const contact = {
  city: "تبریز",
  address: "تبریز، ولیعصر، خیابان فروغی، کوچه نارنج، پلاک ۱۲",
  phone: "041 3330 4752",
  instagram: "@caffee.house",
  email: "hello@caffeehouse.ir",
  /** Valiasr, Tabriz: for the OpenStreetMap embed */
  lat: 38.0682,
  lon: 46.3305,
};

export const credit = "توسعه یافته توسط مهلا حسینی";

/** Pairings shown in the dish dialog. */
export const pairings: Record<string, string[]> = {
  croissant: ["latte", "cappuccino"],
  cheesecake: ["iced", "espresso"],
  burger: ["fries", "icedlatte"],
  pasta: ["icedlatte", "cake"],
  hotchoc: ["croissant", "lotusbar"],
  latte: ["croissant", "cake"],
  cappuccino: ["croissant", "cheesecake"],
  espresso: ["lotusbar", "cheesecake"],
  iced: ["cheesecake", "icecream"],
  icedlatte: ["croissant", "cake"],
  affogato: ["lotusbar", "espresso"],
  cake: ["latte", "espresso"],
  icecream: ["espresso", "iced"],
  lotusbar: ["hotchoc", "espresso"],
  pizza: ["fries", "icedlatte"],
  fries: ["burger", "pizza"],
};

export const coffeeOfWeek = {
  name: "اتیوپی یرگاچفه",
  hand: "Ethiopia Yirgacheffe",
  process: "فرآوری شسته",
  altitude: "۱۹۰۰ تا ۲۲۰۰ متر",
  roast: 2, // of 5: light
  notes: ["یاس", "لیموترش", "چای سیاه", "عسل"],
  brew: ["V60", "کمکس", "اسپرسو"],
  price: 135000,
};

export const events = [
  { day: "۳۰", month: "مهر", weekday: "پنجشنبه", time: "۱۸:۰۰", title: "کارگاه لاته‌آرت", text: "قلب و لاله را روی فنجان خودتان بکشید. ۸ نفر، با هزینه‌ی دو نوشیدنی.", tag: "ثبت‌نام باز است" },
  { day: "۷", month: "آبان", weekday: "پنجشنبه", time: "۱۹:۳۰", title: "شب موسیقی آکوستیک", text: "تار و گیتار، چای و کیک خانگی. ورود آزاد، رزرو میز توصیه می‌شود.", tag: "ورود آزاد" },
  { day: "۱۴", month: "آبان", weekday: "پنجشنبه", time: "۱۷:۰۰", title: "جلسه‌ی کاپینگ", text: "سه دانه‌ی تازه را کنار هم بچشید و تفاوتشان را یاد بگیرید.", tag: "ظرفیت محدود" },
];

export const faq = [
  { q: "برای سفارش آنلاین باید ثبت‌نام کنم؟", a: "نه. نام و شماره موبایل کافی است. وقتی سفارش آماده شد پیامک می‌گیرید." },
  { q: "پرداخت چطور است؟", a: "فعلاً پرداخت هنگام تحویل در کافه انجام می‌شود؛ کارت‌خوان و نقد." },
  { q: "شیر گیاهی دارید؟", a: "بله، شیر بادام و جو دوسر. در توضیحات سفارش بنویسید." },
  { q: "پارکینگ نزدیک کافه هست؟", a: "پارکینگ عمومی ولیعصر دو دقیقه پیاده تا کافه فاصله دارد." },
  { q: "برای جشن تولد می‌شود رزرو کرد؟", a: "بله، تا ۱۲ نفر را از فرم رزرو ثبت کنید. برای گروه بزرگ‌تر تماس بگیرید." },
];
