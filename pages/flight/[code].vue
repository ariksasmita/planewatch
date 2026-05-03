<template>
  <div>
    <!-- Back link -->
    <button
      @click="router.push('/')"
      class="flex items-center gap-2 text-surface-100/50 hover:text-brand-400 transition-colors mb-6 text-sm"
    >
      <Icon name="lucide:arrow-left" class="w-4 h-4" />
      Back to search
    </button>

    <div v-if="isLoading" class="py-20 text-center">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-brand-400 mx-auto mb-4" />
      <p class="text-surface-100/40 text-sm">Loading flight details…</p>
    </div>

    <div v-else-if="flight">
      <!-- Flight header -->
      <div class="flex items-center gap-3 mb-8">
        <h1 class="font-display text-3xl md:text-4xl font-bold text-surface-50">
          {{ flight.flight.iata }}
        </h1>
        <FlightStatusBadge :status="flight.flight_status" />
        <ProviderBadge :provider="flight.provider" />
      </div>

      <!-- Route info -->
      <RouteInfo :departure="flight.departure" :arrival="flight.arrival" class="mb-8" />

      <!-- Route map -->
      <div v-if="flight.departure.location && flight.arrival.location" class="mb-8">
        <h3 class="font-display text-lg font-semibold text-surface-100 mb-4">Route Map</h3>
        <div class="bg-surface-800/50 rounded-2xl border border-surface-700/30 p-2 overflow-hidden">
          <ClientOnly>
            <RouteMap
              :departure="flight.departure"
              :arrival="flight.arrival"
              :live="flight.live"
            />
          </ClientOnly>
        </div>
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

const flightCode = (route.params.code as string).toUpperCase()
const isLoading = ref(false)
const error = ref<string | null>(null)

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

onMounted(async () => {
  if (flight.value) return

  isLoading.value = true
  error.value = null

  try {
    const flights = await aeroDataBoxApi.fetchByFlightCode(flightCode)
    store.flights = flights
    store.selectedFlight = flights[0] ?? null

    if (!store.selectedFlight) {
      error.value = `No flight data found for ${flightCode}`
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
