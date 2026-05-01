import { Museum, WeeklyHours } from "../data/museums.js";

type DayName = keyof WeeklyHours;

const DAY_NAMES: DayName[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function getTodayDayName(): DayName {
  const idx = new Date().getDay();
  return DAY_NAMES[idx];
}

export function getCurrentTimeMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!match) return -1;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function isMuseumOpenNow(museum: Museum): boolean {
  const dayName = getTodayDayName();
  const todayHours = museum.hours[dayName];
  if (!todayHours || todayHours.closed) return false;
  if (!todayHours.open || !todayHours.close) return false;
  const now = getCurrentTimeMinutes();
  const open = parseTimeToMinutes(todayHours.open);
  const close = parseTimeToMinutes(todayHours.close);
  return now >= open && now < close;
}

export function getTodayHoursString(museum: Museum): string {
  const dayName = getTodayDayName();
  const todayHours = museum.hours[dayName];
  if (!todayHours || todayHours.closed) return "Closed today";
  if (!todayHours.open || !todayHours.close) return "Hours unavailable";
  return `${todayHours.open} – ${todayHours.close}`;
}

export function enrichMuseum(
  museum: Museum,
  overrideHours?: WeeklyHours
): Museum {
  const enriched = overrideHours
    ? { ...museum, hours: overrideHours }
    : { ...museum };
  return {
    ...enriched,
    isOpenNow: isMuseumOpenNow(enriched),
    todayHours: getTodayHoursString(enriched),
    lastScraped: enriched.lastScraped ?? new Date().toISOString(),
  };
}
