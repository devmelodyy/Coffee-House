import { NextResponse } from "next/server";
import { menuById } from "@/data/menu";
import { nameError, normalizeDigits, phoneError, type OrderPayload } from "@/lib/validate";

type Order = OrderPayload & { code: string; total: number; createdAt: string };

// In-memory store for this demo server. Swap for a database before going live.
const store = globalThis as unknown as { __orders?: Order[] };
store.__orders ??= [];

export async function POST(req: Request) {
  let body: OrderPayload;
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
  if (body.mode === "table" && !normalizeDigits(body.table ?? "").match(/^\d{1,2}$/)) errors.table = "شماره میز را وارد کنید.";
  if (!["asap", "30", "60"].includes(body.when)) errors.when = "زمان تحویل را انتخاب کنید.";

  // Recompute the total on the server from the menu, never trust the client's prices.
  const lines = Object.entries(body.lines ?? {}).filter(([id, q]) => menuById[id] && Number.isInteger(q) && q > 0 && q <= 20);
  if (lines.length === 0) errors.lines = "سبد خرید خالی است.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const total = lines.reduce((s, [id, q]) => s + menuById[id].price * q, 0);
  const code = `CH-${(1000 + store.__orders!.length + 1).toString()}`;
  const order: Order = {
    ...body,
    phone: normalizeDigits(body.phone),
    lines: Object.fromEntries(lines),
    code,
    total,
    createdAt: new Date().toISOString(),
  };
  store.__orders!.push(order);
  return NextResponse.json({ code, total }, { status: 201 });
}
