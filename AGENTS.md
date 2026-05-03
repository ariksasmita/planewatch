# Project: PlaneWatch

Flight status tracking web app — search by flight code/callsign, get status, route info, aircraft details, airline logos, watched flights, share cards, and maps.

## Tech Stack

### Frontend
- Framework: Vue 3 + Nuxt 3 (CSR mode)
- Language: TypeScript
- Styling: Tailwind CSS
- State management: Pinia
- Maps: Leaflet + OpenStreetMap/CARTO tiles
- Icons: Local inline SVG components plus selected Nuxt icon usage

### API
- Primary provider: AeroDataBox via RapidAPI, called only from Nuxt server route
- Live fallback: ADSB.lol no-key public API
- Airline logos: Kiwi.com airline image CDN with initials fallback
- Private key: `NUXT_AERODATABOX_RAPID_API_KEY` as Nuxt runtime-config env override

### Tooling
- Build: Vite (via Nuxt)
- Package manager: npm

## Project Structure

```
root-level Nuxt app:
├── components/       # Reusable Vue components (PascalCase)
├── composables/      # Shared composables (useCamelCase)
├── docs/             # Testing docs and README screenshots
├── layouts/          # Layout components
├── pages/            # Nuxt auto-routed pages
├── server/           # Nuxt server routes for private provider calls
├── stores/           # Pinia stores
├── types/            # Shared TypeScript types
├── utils/            # Utility functions
├── assets/           # Static assets (CSS, source SVG)
└── public/           # Public static files
```

## Conventions

- Vue 3 Composition API with `<script setup lang="ts">`
- Nuxt 3 auto-imports enabled (no manual imports for composables, components, utils)
- Pinia stores with setup syntax
- Tailwind CSS — dark theme by default
- Aviation/ATC aesthetic: dark bg, cyan/amber accents, Space Grotesk font
- CSR mode, but Nuxt server routes are required for private API keys
- Do not expose provider secrets with `NUXT_PUBLIC_` unless explicitly intended for browser use

## Key Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run generate` — Static generation
- `npm run preview` — Preview production build

## Current Features

- Search by flight number/callsign
- IATA → ICAO callsign variants for common airlines
- AeroDataBox scheduled/status data through `/api/aerodatabox/flights/:code`
- ADSB.lol live fallback and optional live overlay on route maps
- 60-second local cache for search/detail data
- Recent searches and watched flights in localStorage
- Airline logo component with safe fallback
- Shareable flight summary card
- README screenshots and manual QA checklist

## Notes

- Required env var: `NUXT_AERODATABOX_RAPID_API_KEY`
- The key must remain private/server-side only
- ADSB.lol requires no key but only returns currently visible aircraft
- Map tracking uses Leaflet + free tiles, no map key needed
