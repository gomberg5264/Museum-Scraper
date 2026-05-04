import { Museum, WeeklyHours } from "../data/museums.js";

type DayName = keyof WeeklyHours;

const NY_TZ = "America/New_York";

function getNYDateParts(): { dayIndex: number; hours: number; minutes: number } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: NY_TZ,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);

  const weekdayStr = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hourStr = parts.find((p) => p.type === "hour")?.value ?? "0";
  const minuteStr = parts.find((p) => p.type === "minute")?.value ?? "0";

  const WEEKDAYS: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  return {
    dayIndex: WEEKDAYS[weekdayStr] ?? 0,
    hours: parseInt(hourStr, 10),
    minutes: parseInt(minuteStr, 10),
  };
}

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
  return DAY_NAMES[getNYDateParts().dayIndex];
}

export function getCurrentTimeMinutes(): number {
  const { hours, minutes } = getNYDateParts();
  return hours * 60 + minutes;
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
