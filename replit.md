# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## NYC Museums App

### What it does
A full-stack NYC museums directory listing 26+ major museums across all 5 boroughs. Displays real-time open/closed status, today's hours, and full weekly schedules.

### Architecture
- **Frontend**: `artifacts/nyc-museums` — React + Vite + Tailwind app at `/`
- **Backend**: `artifacts/api-server` — Express 5 API at `/api`

### Key files
- `artifacts/api-server/src/data/museums.ts` — Curated list of 26 NYC museums with hours
- `artifacts/api-server/src/services/museumUtils.ts` — Open/closed detection utilities
- `artifacts/api-server/src/services/museumScraper.ts` — Web scraping with cheerio
- `artifacts/api-server/src/routes/museums.ts` — Museum API routes

### API Endpoints
- `GET /api/museums` — List museums (filters: borough, openNow, search)
- `GET /api/museums/:id` — Get single museum
- `GET /api/museums/stats/summary` — Aggregate stats
- `POST /api/museums/:id/refresh` — Scrape fresh hours from museum website

### Features
- Live open/closed detection based on current time
- Borough filter (Manhattan, Brooklyn, Queens, Bronx, Staten Island)
- Category filter (art, science, history, natural history, specialty, children)
- "Open Right Now" toggle
- Full text search
- Per-museum detail page with 7-day hours table and "Refresh Hours" button
- Web scraping with cheerio to pull fresh hours from official museum websites
