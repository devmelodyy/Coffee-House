// Shared by the forms and the API routes so both reject the same input.

/** Persian and Arabic-Indic digits → ASCII, spaces and dashes removed. */
export const normalizeDigits = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[\s-]/g, "");

export function phoneError(raw: string) {
  const p = normalizeDigits(raw);
  if (!p) return "شماره موبایل را وارد کنید.";
  if (!/^(\+98|0098|0)?9\d{9}$/.test(p)) return "شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود.";
  return "";
}

export function nameError(raw: string) {
  const n = raw.trim();
  if (!n) return "نام را وارد کنید.";
  if (n.length < 2) return "نام خیلی کوتاه است.";
  return "";
}

export type OrderPayload = {
  name: string;
  phone: string;
  mode: "pickup" | "table";
  table?: string;
  when: "asap" | "30" | "60";
  notes?: string;
  lines: Record<string, number>;
};

export type ReservationPayload = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
};

export const reservationTimes = Array.from({ length: 25 }, (_, i) => {
  const mins = 10 * 60 + i * 30; // 10:00 … 22:00
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${mins % 60 ? "30" : "00"}`;
});

export function todayInTehran(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran" }).format(date); // YYYY-MM-DD
}
