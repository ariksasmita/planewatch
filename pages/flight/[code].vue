<template>
  <div>
    <!-- Back link -->
    <button
      @click="router.push('/')"
      class="flex items-center gap-2 text-surface-100/50 hover:text-brand-400 transition-colors mb-6 text-sm"
    >
      <IconArrowLeft class="w-4 h-4" />
      Back to search
    </button>

    <LoadingDetailSkeleton v-if="isLoading" />

    <div v-else-if="flight">
      <!-- Flight header -->
      <div class="flex flex-wrap items-center gap-3 mb-8">
        <h1 class="font-display text-3xl md:text-4xl font-bold text-surface-50">
          {{ flight.flight.iata }}
        </h1>
        <FlightStatusBadge :status="flight.flight_status" />
        <ProviderBadge :provider="flight.provider" />
        <button
          class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors"
          :class="store.isWatched(flight.flight.iata) ? 'border-amber-400/40 bg-amber-500/10 text-amber-300' : 'border-surface-700/50 text-surface-100/45 hover:border-amber-400/40 hover:text-amber-300'"
          @click="store.toggleWatched(flight.flight.iata)"
        >
          <IconStar class="w-4 h-4" :filled="store.isWatched(flight.flight.iata)" />
          {{ store.isWatched(flight.flight.iata) ? 'Watched' : 'Watch' }}
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-full border border-surface-700/50 px-3 py-1.5 text-sm text-surface-100/45 hover:border-brand-400/40 hover:text-brand-300 transition-colors"
          @click="refreshFlight"
        >
          <IconRefresh class="w-4 h-4" :class="isRefreshing ? 'animate-spin' : ''" />
          Refresh
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-full border border-surface-700/50 px-3 py-1.5 text-sm text-surface-100/45 hover:border-brand-400/40 hover:text-brand-300 transition-colors"
          @click="shareFlight"
        >
          <IconShare class="w-4 h-4" />
          {{ shareFeedback || 'Share' }}
        </button>
      </div>

      <ShareFlightCard :flight="flight" class="mb-8" />

      <!-- Route info -->
      <RouteInfo :departure="flight.departure" :arrival="flight.arrival" class="mb-8" />

      <!-- Route map -->
      <div v-if="flight.departure.location && flight.arrival.location" class="mb-8">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h3 class="font-display text-lg font-semibold text-surface-100">Route Map</h3>
          <span v-if="isLoadingLiveOverlay" class="text-xs text-surface-100/30">Checking live ADS-B…</span>
          <span v-else-if="liveOverlay" class="text-xs text-amber-400">Live ADS-B overlay</span>
        </div>
        <div class="bg-surface-800/50 rounded-2xl border border-surface-700/30 p-2 overflow-hidden">
          <ClientOnly>
            <RouteMap
              :departure="flight.departure"
              :arrival="flight.arrival"
              :live="flight.live || liveOverlay"
            />
          </ClientOnly>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6 mb-8">
        <TimingInsight :departure="flight.departure" :arrival="flight.arrival" />
        <AirportWeatherCard
          v-if="flight.departure.location && flight.arrival.location"
          :departure-code="flight.departure.iata || flight.departure.icao || 'DEP'"
          :arrival-code="flight.arrival.iata || flight.arrival.icao || 'ARR'"
          :departure="departureWeather"
          :arrival="arrivalWeather"
        />
      </div>

      <!-- Timeline -->
      <FlightTimeline :departure="flight.departure" :arrival="flight.arrival" class="mb-8" />

      <!-- Details grid -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <AircraftInfo :aircraft="flight.aircraft" :airline="flight.airline" />
        <div class="bg-surface-800/50 rounded-2xl border border-surface-700/30 p-6">
          <h3 class="font-display text-lg font-semibold text-surface-100 mb-4">Flight Details</h3>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between">
              <dt class="text-surface-100/50">Flight Number</dt>
              <dd class="text-surface-50 font-medium">{{ flight.flight.number }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-surface-100/50">IATA Code</dt>
              <dd class="text-surface-50 font-medium">{{ flight.flight.iata }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-surface-100/50">ICAO Code</dt>
              <dd class="text-surface-50 font-medium">{{ flight.flight.icao }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-surface-100/50">Date</dt>
              <dd class="text-surface-50 font-medium">{{ flight.flight_date }}</dd>
            </div>
            <div v-if="flight.flight.codeshared" class="flex justify-between">
              <dt class="text-surface-100/50">Codeshare</dt>
              <dd class="text-surface-50 font-medium">{{ flight.flight.codeshared }}</dd>
            </div>
            <div v-if="flight.codeshareStatus" class="flex justify-between">
              <dt class="text-surface-100/50">Operation</dt>
              <dd class="text-surface-50 font-medium">{{ flight.codeshareStatus }}</dd>
            </div>
            <div v-if="flight.distanceKm" class="flex justify-between">
              <dt class="text-surface-100/50">Distance</dt>
              <dd class="text-surface-50 font-medium">{{ Math.round(flight.distanceKm).toLocaleString() }} km</dd>
            </div>
            <div v-if="flight.lastUpdatedUtc" class="flex justify-between">
              <dt class="text-surface-100/50">Last Updated</dt>
              <dd class="text-surface-50 font-medium">{{ formatDateTime(flight.lastUpdatedUtc) }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Not found state -->
    <div v-else class="text-center py-20">
      <div class="w-20 h-20 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
        <Icon name="lucide:plane-off" class="w-10 h-10 text-surface-100/20" />
      </div>
      <h2 class="font-display text-xl font-semibold text-surface-100 mb-2">Flight not found</h2>
      <p class="text-surface-100/50 text-sm mb-6">{{ error || 'Try searching again from the homepage.' }}</p>
      <NuxtLink to="/" class="text-brand-400 hover:text-brand-300 text-sm transition-colors">
        ← Go to search
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useFlightStore()
const route = useRoute()
const router = useRouter()
const aeroDataBoxApi = useAeroDataBoxApi()
const adsbApi = useAdsbApi()
const weatherApi = useWeatherApi()
const cache = useFlightSearchCache()

const flightCode = (route.params.code as string).toUpperCase()
const isLoading = ref(false)
const isRefreshing = ref(false)
const isLoadingLiveOverlay = ref(false)
const error = ref<string | null>(null)
const shareFeedback = ref('')
const departureWeather = ref(null as Awaited<ReturnType<typeof weatherApi.fetchCurrent>>)
const arrivalWeather = ref(null as Awaited<ReturnType<typeof weatherApi.fetchCurrent>>)
const liveOverlay = ref(null as null | {
  updated: string
  latitude: number
  longitude: number
  altitude: number
  direction: number
  speed_horizontal: number
  speed_vertical: number
  is_ground: boolean
})

const flight = computed(() => {
  if (store.selectedFlight?.flight.iata === flightCode || store.selectedFlight?.flight.icao === flightCode) {
    return store.selectedFlight
  }

  return store.flights.find(f => f.flight.iata === flightCode || f.flight.icao === flightCode) ?? null
})

function formatDateTime(iso: string) {
  if (!iso) return '—'
  const date = new Date(iso)
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function shareFlight() {
  if (!flight.value || !import.meta.client) return

  const text = `${flight.value.flight.iata} ${flight.value.departure.iata || flight.value.departure.icao} → ${flight.value.arrival.iata || flight.value.arrival.icao} · ${flight.value.flight_status}`
  const url = window.location.href

  try {
    if (navigator.share) {
      await navigator.share({ title: `PlaneWatch ${flight.value.flight.iata}`, text, url })
      shareFeedback.value = 'Shared'
    }
    else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      shareFeedback.value = 'Copied!'
    }
  }
  catch {
    shareFeedback.value = ''
  }

  window.setTimeout(() => {
    shareFeedback.value = ''
  }, 2000)
}

async function loadWeather() {
  if (!flight.value?.departure.location || !flight.value?.arrival.location) return

  const [departure, arrival] = await Promise.all([
    weatherApi.fetchCurrent(flight.value.departure.location.lat, flight.value.departure.location.lon),
    weatherApi.fetchCurrent(flight.value.arrival.location.lat, flight.value.arrival.location.lon),
  ])

  departureWeather.value = departure
  arrivalWeather.value = arrival
}

async function refreshFlight() {
  isRefreshing.value = true
  error.value = null

  try {
    const flights = await aeroDataBoxApi.fetchByFlightCode(flightCode)
    store.flights = flights
    store.selectedFlight = flights.find(f => f.flight.iata === flightCode || f.flight.icao === flightCode) ?? flights[0] ?? null
    liveOverlay.value = null
    await Promise.all([loadLiveOverlay(), loadWeather()])
  }
  catch (refreshError: any) {
    error.value = refreshError?.message || `Could not refresh ${flightCode}`
  }
  finally {
    isRefreshing.value = false
  }
}

async function loadLiveOverlay() {
  if (!flight.value || flight.value.live) return

  isLoadingLiveOverlay.value = true

  try {
    const callsign = flight.value.flight.icao || flightCode
    const results = await adsbApi.fetchByFlightCodeVariants(callsign)
    const aircraft = results[0]?.aircraft

    if (aircraft && typeof aircraft.lat === 'number' && typeof aircraft.lon === 'number') {
      liveOverlay.value = {
        updated: new Date().toISOString(),
        latitude: aircraft.lat,
        longitude: aircraft.lon,
        altitude: aircraft.alt_baro === 'ground' ? 0 : aircraft.alt_baro || aircraft.alt_geom || 0,
        direction: aircraft.track || 0,
        speed_horizontal: aircraft.gs || 0,
        speed_vertical: aircraft.baro_rate || 0,
        is_ground: aircraft.alt_baro === 'ground',
      }
    }
  }
  finally {
    isLoadingLiveOverlay.value = false
  }
}

onMounted(async () => {
  if (flight.value) {
    await Promise.all([loadLiveOverlay(), loadWeather()])
    return
  }

  const cached = cache.get(flightCode)
  if (cached?.flights.length) {
    store.flights = cached.flights
    store.selectedFlight = cached.flights.find(f => f.flight.iata === flightCode || f.flight.icao === flightCode) ?? cached.flights[0]
    await Promise.all([loadLiveOverlay(), loadWeather()])
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const flights = await aeroDataBoxApi.fetchByFlightCode(flightCode)
    store.flights = flights
    store.selectedFlight = flights.find(f => f.flight.iata === flightCode || f.flight.icao === flightCode) ?? flights[0] ?? null

    if (flights.length) {
      cache.set(flightCode, {
        flights,
        liveAircraft: [],
      })
    }

    if (!store.selectedFlight) {
      error.value = `No flight data found for ${flightCode}`
    }
    else {
      await Promise.all([loadLiveOverlay(), loadWeather()])
    }
  }
  catch (e: any) {
    error.value = e?.message || `Failed to load ${flightCode}`
  }
  finally {
    isLoading.value = false
  }
})
</script>
