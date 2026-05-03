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

      <p v-if="store.error" class="mt-4 text-red-400 text-sm">{{ store.error }}</p>
    </section>

    <!-- Recent searches -->
    <section v-if="store.recentSearches.length > 0 && !store.isLoading" class="mb-12">
      <RecentSearches :searches="store.recentSearches" @select="handleSearch" @clear="store.clearRecentSearches()" />
    </section>

    <!-- Results -->
    <section v-if="store.flights.length > 0 || store.liveAircraft.length > 0">
      <h2 class="font-display text-xl font-semibold text-surface-100 mb-4">Results</h2>
      <div class="space-y-4">
        <FlightStatusCard
          v-for="flight in store.flights"
          :key="flight.flight.iata"
          :flight="flight"
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
const router = useRouter()

async function handleSearch(code: string) {
  store.isLoading = true
  store.error = null
  store.flights = []
  store.liveAircraft = []
  store.selectedFlight = null
  store.selectedLiveAircraft = null

  try {
    // Primary provider: AeroDataBox via server route (keeps RapidAPI key private).
    store.flights = await aeroDataBoxApi.fetchByFlightCode(code)
    store.addRecentSearch(code)

    if (store.flights.length === 0) {
      throw new Error(`No AeroDataBox results for ${code.toUpperCase()}`)
    }
  }
  catch (aeroError: any) {
    try {
      // Secondary provider: AviationStack, if configured.
      store.flights = await aviationStackApi.fetchByFlightCode(code)
      store.addRecentSearch(code)
    }
    catch (aviationError: any) {
      // Last fallback: live ADS-B callsign lookup. Best for ICAO-style callsigns: GIA401, DAL496.
      try {
        store.liveAircraft = await adsbApi.fetchByCallsign(code)
        store.addRecentSearch(code)

        if (store.liveAircraft.length === 0) {
          store.error = `${aeroError.message || 'No AeroDataBox data found'} ${aviationError.message || 'No AviationStack data found'} Also found no live ADS-B aircraft for ${code.toUpperCase()}.`
        }
      }
      catch (adsbError: any) {
        store.error = `${aeroError.message || 'No AeroDataBox data found'} ${aviationError.message || 'No AviationStack data found'} ADS-B fallback failed: ${adsbError.message || 'unknown error'}`
      }
    }
  }
  finally {
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
