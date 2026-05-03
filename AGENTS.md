# Project: PlaneWatch

Flight status tracking web app — search by flight code, get real-time status, route info, aircraft details, and map tracking.

## Tech Stack

### Frontend
- Framework: Vue 3 + Nuxt 3 (CSR mode)
- Language: TypeScript
- Styling: Tailwind CSS
- State management: Pinia
- Icons: Lucide Icons
- Maps: Leaflet + OpenStreetMap (free, no API key)

### API
- Provider: AviationStack (free tier, 100 req/mo)
- HTTP: Native fetch via composables
- Direct frontend calls (no backend proxy)

### Tooling
- Build: Vite (via Nuxt)
- Package manager: npm

## Project Structure

```
src/ (Nuxt convention — no src/ dir, root-level:)
├── components/       # Reusable Vue components (PascalCase)
├── composables/      # Shared composables (useCamelCase)
├── layouts/          # Layout components
├── pages/            # Nuxt auto-routed pages
├── server/           # Nuxt server routes (minimal, if needed)
├── stores/           # Pinia stores
├── types/            # Shared TypeScript types
├── utils/            # Utility functions
├── assets/           # Static assets (CSS, images)
└── public/           # Public static files
```

## Conventions

- Vue 3 Composition API with `<script setup lang="ts">`
- Nuxt 3 auto-imports enabled (no manual imports for composables, components, utils)
- Pinia stores with setup syntax (not options API)
- Tailwind CSS — dark theme by default
- Aviation/ATC aesthetic: dark bg, cyan/amber accents, Space Grotesk font
- CSR mode only (no SSR)

## Key Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run generate` — Static generation
- `npm run preview` — Preview production build

## Priority / Roadmap

1. **P0**: Search by flight code → status card (live status, airline, scheduled/actual times)
2. **P0**: Route info — origin/destination airports (city, country, terminal, gate)
3. **P0**: Aircraft details — type, registration, airline logo
4. **P0**: Flight timeline — departure → arrival with delays
5. **P1**: Recent searches — localStorage persistence via Pinia plugin
6. **P1**: Responsive mobile-first layout
7. **P1**: Dark mode (default) with light toggle
8. **P2**: Map tracking — Leaflet + OpenStreetMap, plot flight path with origin/destination markers
9. **P2**: Animated route line on map

## Notes

- AviationStack API key required (free signup at aviationstack.com)
- API key stored in runtime config (`nuxt.config.ts` → `runtimeConfig.public`)
- Map tracking uses Leaflet + OpenStreetMap tiles (free, no key needed)
- Free tier limit: 100 API requests/month — cache aggressively in Pinia
