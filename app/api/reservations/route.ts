import { NextResponse } from "next/server";
import { nameError, normalizeDigits, phoneError, reservationTimes, todayInTehran, type ReservationPayload } from "@/lib/validate";

type Reservation = ReservationPayload & { code: string; createdAt: string };

// In-memory store for this demo server. Swap for a database before going live.
const store = globalThis as unknown as { __reservations?: Reservation[] };
store.__reservations ??= [];

export async function POST(req: Request) {
  let body: ReservationPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const errors: Record<string, string> = {};
  const ne = nameError(body.name ?? "");
  if (ne) errors.name = ne;
  const pe = phoneError(body.phone ?? "");
  if (pe) errors.phone = pe;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date ?? "") || body.date < todayInTehran()) errors.date = "تاریخی از امروز به بعد انتخاب کنید.";
  if (!reservationTimes.includes(body.time)) errors.time = "ساعت را انتخاب کنید.";
  if (!Number.isInteger(body.guests) || body.guests < 1 || body.guests > 12) errors.guests = "تعداد نفرات باید بین ۱ تا ۱۲ باشد.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const code = `R-${(500 + store.__reservations!.length + 1).toString()}`;
  store.__reservations!.push({ ...body, phone: normalizeDigits(body.phone), code, createdAt: new Date().toISOString() });
  return NextResponse.json({ code }, { status: 201 });
}
