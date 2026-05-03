<template>
  <div>
    <!-- Hero section -->
    <section class="py-12 md:py-20 text-center">
      <h1 class="font-display text-4xl md:text-6xl font-bold text-surface-50 mb-3">
        Track Any <span class="text-brand-400">Flight</span>
      </h1>
      <p class="text-surface-100/50 text-lg max-w-md mx-auto mb-10">
        Enter an IATA flight code like GA401 or an ICAO callsign like GIA401.
      </p>

      <SearchBar @search="handleSearch" :is-loading="store.isLoading" />
      <SearchExamples @select="handleSearch" />

      <p v-if="store.error" class="mt-4 text-red-400 text-sm max-w-xl mx-auto">{{ store.error }}</p>
    </section>

    <WatchedFlights v-if="!store.isLoading" :flights="store.watchedFlights" @select="handleSearch" />

    <!-- Recent searches -->
    <section v-if="store.recentSearches.length > 0 && !store.isLoading" class="mb-12">
      <RecentSearches :searches="store.recentSearches" @select="handleSearch" @clear="store.clearRecentSearches()" />
    </section>

    <!-- Loading -->
    <section v-if="store.isLoading" class="mb-12">
      <h2 class="font-display text-xl font-semibold text-surface-100 mb-4">Searching</h2>
      <div class="space-y-4">
        <LoadingFlightCardSkeleton v-for="item in 3" :key="item" />
      </div>
    </section>

    <!-- Results -->
    <section v-else-if="store.flights.length > 0 || store.liveAircraft.length > 0">
      <div class="flex items-center gap-3 mb-4">
        <h2 class="font-display text-xl font-semibold text-surface-100">Results</h2>
        <span v-if="store.lastResultFromCache" class="rounded-full bg-surface-700/50 px-2.5 py-1 text-xs text-surface-100/45">Cached</span>
      </div>
      <div class="space-y-4">
        <FlightStatusCard
          v-for="flight in store.flights"
          :key="flight.flight.iata"
          :flight="flight"
          :is-watched="store.isWatched(flight.flight.iata)"
          @toggle-watch="store.toggleWatched(flight.flight.iata)"
          @click="navigateToDetail(flight)"
        />
        <LiveAircraftCard
          v-for="result in store.liveAircraft"
          :key="result.aircraft.hex"
          :result="result"
          @click="navigateToLiveAircraft(result)"
        />
      </div>
    </section>

    <!-- Empty state -->
    <section v-if="store.flights.length === 0 && store.liveAircraft.length === 0 && !store.isLoading && !store.error" class="text-center py-16">
      <div class="w-20 h-20 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
        <Icon name="lucide:radar" class="w-10 h-10 text-surface-100/20" />
      </div>
      <p class="text-surface-100/30 text-sm">Search for a flight to get started</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { LiveAircraftResult } from '~/types/adsb'
import type { Flight } from '~/types/flight'

const store = useFlightStore()
const aeroDataBoxApi = useAeroDataBoxApi()
const aviationStackApi = useAviationApi()
const adsbApi = useAdsbApi()
const cache = useFlightSearchCache()
const router = useRouter()

function friendlySearchError(code: string, errorMessages: string[]) {
  const joined = errorMessages.join(' ').toLowerCase()

  if (joined.includes('429') || joined.includes('rate limit') || joined.includes('too many')) {
    return 'Too many searches too quickly. Please wait a few seconds and try again.'
  }

  if (joined.includes('api key') || joined.includes('not configured')) {
    return 'Flight data provider is not configured. Check your API key settings.'
  }

  if (joined.includes('invalid')) {
    return 'That flight code format looks invalid. Try something like GIA401, GA401, DAL496, or DL496.'
  }

  return `No flight data found for ${code.toUpperCase()}. Try the operator callsign version, like GIA401 instead of GA401.`
}

async function handleSearch(code: string) {
  const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, '')

  store.isLoading = true
  store.error = null
  store.flights = []
  store.liveAircraft = []
  store.selectedFlight = null
  store.selectedLiveAircraft = null
  store.lastResultFromCache = false

  const cached = cache.get(normalizedCode)
  if (cached) {
    store.flights = cached.flights
    store.liveAircraft = cached.liveAircraft
    store.addRecentSearch(normalizedCode)
    store.lastResultFromCache = true
    store.isLoading = false
    return
  }

  const errors: string[] = []

  try {
    // Primary provider: AeroDataBox via server route (keeps RapidAPI key private).
    store.flights = await aeroDataBoxApi.fetchByFlightCode(normalizedCode)
    store.addRecentSearch(normalizedCode)

    if (store.flights.length === 0) {
      throw new Error(`No AeroDataBox results for ${normalizedCode}`)
    }
  }
  catch (aeroError: any) {
    errors.push(aeroError?.message || 'AeroDataBox failed')
    try {
      // Secondary provider: AviationStack, if configured.
      store.flights = await aviationStackApi.fetchByFlightCode(normalizedCode)
      store.addRecentSearch(normalizedCode)
    }
    catch (aviationError: any) {
      errors.push(aviationError?.message || 'AviationStack failed')
      // Last fallback: live ADS-B callsign lookup. Best for ICAO-style callsigns: GIA401, DAL496.
      try {
        store.liveAircraft = await adsbApi.fetchByFlightCodeVariants(normalizedCode)
        store.addRecentSearch(normalizedCode)

        if (store.liveAircraft.length === 0) {
          store.error = friendlySearchError(normalizedCode, errors)
        }
      }
      catch (adsbError: any) {
        errors.push(adsbError?.message || 'ADS-B failed')
        store.error = friendlySearchError(normalizedCode, errors)
      }
    }
  }
  finally {
    if (store.flights.length > 0 || store.liveAircraft.length > 0) {
      cache.set(normalizedCode, {
        flights: store.flights,
        liveAircraft: store.liveAircraft,
      })
    }

    store.isLoading = false
  }
}

function navigateToDetail(flight: Flight) {
  store.selectedFlight = flight
  router.push({
    path: `/flight/${flight.flight.iata}`,
    query: { date: flight.flight_date },
  })
}

function navigateToLiveAircraft(result: LiveAircraftResult) {
  store.selectedLiveAircraft = result
  router.push(`/live/${result.callsign}`)
}
</script>
