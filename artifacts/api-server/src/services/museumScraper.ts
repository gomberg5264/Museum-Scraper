import * as cheerio from "cheerio";
import { Museum, WeeklyHours, DayHours } from "../data/museums.js";

interface FetchResult {
  html: string | null;
  error: string | null;
}

async function fetchPage(url: string): Promise<FetchResult> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; NYCMuseumsBot/1.0; +https://nycmuseums.replit.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      return { html: null, error: `HTTP ${response.status}` };
    }
    const html = await response.text();
    return { html, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { html: null, error: message };
  }
}

function parseTime(raw: string): string {
  const cleaned = raw.trim().replace(/\s+/g, " ");
  const match = cleaned.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!match) return raw.trim();
  const hour = parseInt(match[1], 10);
  const min = match[2] ?? "00";
  const period = match[3].toUpperCase();
  return `${hour}:${min} ${period}`;
}

type DayName =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

function extractHoursFromText(text: string): Partial<WeeklyHours> {
  const days: DayName[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const hours: Partial<WeeklyHours> = {};

  const dayPatterns: Record<DayName, RegExp> = {
    monday: /mon(?:day)?/i,
    tuesday: /tue(?:s(?:day)?)?/i,
    wednesday: /wed(?:nesday)?/i,
    thursday: /thu(?:rs(?:day)?)?/i,
    friday: /fri(?:day)?/i,
    saturday: /sat(?:urday)?/i,
    sunday: /sun(?:day)?/i,
  };

  const timeRangePattern =
    /(\d{1,2}(?::\d{2})?\s*(?:am|pm))\s*[-–—to]+\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm))/gi;
  const closedPattern = /closed/i;

  const lines = text.split(/\n|<br|;/i);
  for (const line of lines) {
    const matchedDay = days.find((d) => dayPatterns[d].test(line));
    if (!matchedDay) continue;

    if (closedPattern.test(line)) {
      hours[matchedDay] = { closed: true };
      continue;
    }

    const timeMatch = timeRangePattern.exec(line);
    timeRangePattern.lastIndex = 0;
    if (timeMatch) {
      hours[matchedDay] = {
        closed: false,
        open: parseTime(timeMatch[1]),
        close: parseTime(timeMatch[2]),
      };
    }
  }

  return hours;
}

async function scrapeMetMuseum(): Promise<Partial<WeeklyHours>> {
  const { html, error } = await fetchPage(
    "https://www.metmuseum.org/plan-your-visit/met-fifth-avenue"
  );
  if (!html || error) return {};
  const $ = cheerio.load(html);
  const hoursText = $('[class*="hours"], [id*="hours"]').text();
  return extractHoursFromText(hoursText);
}

async function scrapeMoMA(): Promise<Partial<WeeklyHours>> {
  const { html, error } = await fetchPage(
    "https://www.moma.org/visit/plan-your-visit/"
  );
  if (!html || error) return {};
  const $ = cheerio.load(html);
  const hoursText = $('[class*="hour"], [class*="visit"]').first().text();
  return extractHoursFromText(hoursText);
}

async function scrapeGeneric(url: string): Promise<Partial<WeeklyHours>> {
  const { html, error } = await fetchPage(url);
  if (!html || error) return {};
  const $ = cheerio.load(html);

  const candidates = [
    $('[class*="hour"]').text(),
    $('[class*="visit"]').text(),
    $('[id*="hour"]').text(),
    $("table").text(),
  ];

  for (const text of candidates) {
    const result = extractHoursFromText(text);
    if (Object.keys(result).length > 0) return result;
  }
  return {};
}

const SCRAPERS: Record<string, (url: string) => Promise<Partial<WeeklyHours>>> =
  {
    met: scrapeMetMuseum,
    moma: scrapeMoMA,
    "moma-ps1": scrapeMoMA,
  };

export async function scrapeMuseumHours(
  museum: Museum
): Promise<{ hours: WeeklyHours; scraped: boolean }> {
  try {
    const scraper = SCRAPERS[museum.id];
    const scrapedHours = scraper
      ? await scraper(museum.website)
      : await scrapeGeneric(museum.website);

    if (Object.keys(scrapedHours).length === 0) {
      return { hours: museum.hours, scraped: false };
    }

    const merged: WeeklyHours = { ...museum.hours };
    const days: DayName[] = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    for (const day of days) {
      if (scrapedHours[day]) {
        merged[day] = scrapedHours[day] as DayHours;
      }
    }

    return { hours: merged, scraped: true };
  } catch {
    return { hours: museum.hours, scraped: false };
  }
}
