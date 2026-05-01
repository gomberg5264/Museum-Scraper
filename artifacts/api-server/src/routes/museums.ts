import { Router } from "express";
import { MUSEUMS, Museum, WeeklyHours } from "../data/museums.js";
import { enrichMuseum } from "../services/museumUtils.js";
import { scrapeMuseumHours } from "../services/museumScraper.js";

const router = Router();

const hoursCache = new Map<string, { hours: WeeklyHours; cachedAt: Date }>();

function getMuseumWithCachedHours(museum: Museum): Museum {
  const cached = hoursCache.get(museum.id);
  if (cached) {
    return enrichMuseum(museum, cached.hours);
  }
  return enrichMuseum(museum);
}

router.get("/museums", (req, res) => {
  let museums = MUSEUMS.map(getMuseumWithCachedHours);

  const { borough, openNow, search } = req.query;

  if (borough && typeof borough === "string") {
    museums = museums.filter(
      (m) => m.borough.toLowerCase() === borough.toLowerCase()
    );
  }

  if (openNow === "true") {
    museums = museums.filter((m) => m.isOpenNow);
  }

  if (search && typeof search === "string" && search.trim()) {
    const q = search.trim().toLowerCase();
    museums = museums.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.neighborhood.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  }

  res.json(museums);
});

router.get("/museums/stats/summary", (req, res) => {
  const museums = MUSEUMS.map(getMuseumWithCachedHours);
  const openNow = museums.filter((m) => m.isOpenNow).length;

  const byBorough: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const m of museums) {
    byBorough[m.borough] = (byBorough[m.borough] ?? 0) + 1;
    byCategory[m.category] = (byCategory[m.category] ?? 0) + 1;
  }

  res.json({
    total: museums.length,
    openNow,
    byBorough,
    byCategory,
  });
});

router.get("/museums/:id", (req, res) => {
  const museum = MUSEUMS.find((m) => m.id === req.params["id"]);
  if (!museum) {
    res.status(404).json({ error: "Not Found", message: "Museum not found" });
    return;
  }
  res.json(getMuseumWithCachedHours(museum));
});

router.post("/museums/:id/refresh", async (req, res) => {
  const museum = MUSEUMS.find((m) => m.id === req.params["id"]);
  if (!museum) {
    res.status(404).json({ error: "Not Found", message: "Museum not found" });
    return;
  }

  const { hours, scraped } = await scrapeMuseumHours(museum);

  hoursCache.set(museum.id, { hours, cachedAt: new Date() });

  const updated = enrichMuseum(museum, hours);
  updated.lastScraped = new Date().toISOString();

  req.log.info({ museumId: museum.id, scraped }, "Museum hours refreshed");

  res.json(updated);
});

export default router;
