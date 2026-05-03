# PlaneWatch Test Checklist

## Environment

- [ ] `.env` exists
- [ ] `AERODATABOX_RAPIDAPI_KEY` is set
- [ ] Optional: `NUXT_PUBLIC_AVIATION_STACK_API_KEY` is set
- [ ] `npm install` completed
- [ ] `npm run build` passes

## Search Smoke Tests

Run `npm run dev`, then test:

- [ ] Search `GIA401`
  - [ ] Result appears
  - [ ] Provider badge shows `AeroDataBox`
  - [ ] Route is DPS → CGK, if provider data is current
  - [ ] Detail page opens
- [ ] Search `GA401`
  - [ ] Result appears through IATA/callsign variant handling
  - [ ] Detail page opens
- [ ] Search `DAL496`
  - [ ] Result appears
  - [ ] Provider badge shows `AeroDataBox`
  - [ ] Route is JFK → DFW, if provider data is current
- [ ] Search `DL496`
  - [ ] Result appears through IATA/callsign variant handling

## Detail Page Tests

- [ ] Open `/flight/GIA401` directly in a new tab
  - [ ] Page fetches data without coming from search page
  - [ ] Route map renders
  - [ ] Timeline shows local scheduled/predicted/revised/runway fields when available
- [ ] Refresh a detail page
  - [ ] Page reloads data or uses cache
  - [ ] No blank state unless provider returns no data
- [ ] Route map displays:
  - [ ] departure marker
  - [ ] arrival marker
  - [ ] route line
  - [ ] plane marker
- [ ] If ADS-B aircraft is currently visible:
  - [ ] `Checking live ADS-B…` appears briefly
  - [ ] `Live ADS-B overlay` appears
  - [ ] plane marker is based on live position

## Cache Tests

- [ ] Search `GIA401`
- [ ] Search `GIA401` again within 60 seconds
  - [ ] Result should return quickly from cache
  - [ ] Should not trigger visible rate-limit error
- [ ] Wait more than 60 seconds and search again
  - [ ] Provider should be called again

## Error Handling Tests

- [ ] Search invalid value like `???`
  - [ ] Friendly invalid-format error appears
- [ ] Temporarily remove `AERODATABOX_RAPIDAPI_KEY`
  - [ ] Friendly provider configuration error appears
- [ ] Search a nonsense but valid-looking code like `ZZ9999`
  - [ ] Friendly no-data error appears
- [ ] Trigger/observe RapidAPI 429 if possible
  - [ ] UI says to wait a few seconds

## Responsive Tests

- [ ] Mobile width ~375px
  - [ ] Search bar usable
  - [ ] Result cards do not overflow
  - [ ] Flight detail sections stack cleanly
  - [ ] Map is usable
- [ ] Tablet width ~768px
- [ ] Desktop width ≥1280px

## Visual Checks

- [ ] Plane SVG appears in nav logo
- [ ] Favicon appears in browser tab
- [ ] Flight cards use plane logo
- [ ] Provider badges are readable
- [ ] Loading skeletons appear during search/detail loading
- [ ] Dark theme contrast is acceptable
