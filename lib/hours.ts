import { hours, toFa } from "@/data/menu";

/** Current weekday and hour in Tehran, whatever the visitor's own timezone. */
function tehranNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { weekday, hour: Number(get("hour")) + Number(get("minute")) / 60 };
}

export function openStatus(date = new Date()) {
  const { weekday, hour } = tehranNow(date);
  const today = hours.find((h) => h.weekdays.includes(weekday));
  if (!today) return { open: false, text: "امروز تعطیل است" };
  if (hour >= today.open && hour < today.close) {
    return { open: true, text: `الان باز است · تا ساعت ${toFa(today.close)}` };
  }
  return { open: false, text: hour < today.open ? `ساعت ${toFa(today.open)} باز می‌شود` : "الان بسته است" };
}
