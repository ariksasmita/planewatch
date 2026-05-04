<template>
  <div>
    <button
      @click="router.push('/')"
      class="flex items-center gap-2 text-surface-100/50 hover:text-brand-400 transition-colors mb-6 text-sm"
    >
      <IconArrowLeft class="w-4 h-4" />
      Back to search
    </button>

    <div v-if="result">
      <div class="flex items-center gap-3 mb-8">
        <h1 class="font-display text-3xl md:text-4xl font-bold text-surface-50">
          {{ result.callsign }}
        </h1>
        <span class="inline-flex items-center rounded-full text-xs font-medium px-2.5 py-1 bg-amber-500/20 text-amber-400">
          ADS-B Live
        </span>
      </div>

      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="bg-surface-800/50 rounded-2xl border border-surface-700/30 p-6">
          <h3 class="font-display text-lg font-semibold text-surface-100 mb-4">Aircraft</h3>
          <dl class="space-y-3 text-sm">
            <TimelineRow label="Callsign" :value="result.aircraft.flight?.trim() || result.callsign" />
            <TimelineRow label="ICAO Hex" :value="result.aircraft.hex" />
            <TimelineRow v-if="result.aircraft.r" label="Registration" :value="result.aircraft.r" />
            <TimelineRow v-if="result.aircraft.t" label="Type" :value="result.aircraft.t" />
            <TimelineRow v-if="typeof result.aircraft.gs === 'number'" label="Ground Speed" :value="`${Math.round(result.aircraft.gs)} kt`" />
            <TimelineRow v-if="altitudeLabel" label="Altitude" :value="altitudeLabel" />
            <TimelineRow v-if="typeof result.aircraft.track === 'number'" label="Track" :value="`${Math.round(result.aircraft.track)}°`" />
            <TimelineRow v-if="typeof result.aircraft.seen === 'number'" label="Seen" :value="`${Math.round(result.aircraft.seen)}s ago`" />
          </dl>
        </div>

        <div class="bg-surface-800/50 rounded-2xl border border-surface-700/30 p-6">
          <h3 class="font-display text-lg font-semibold text-surface-100 mb-4">Position</h3>
          <dl class="space-y-3 text-sm">
            <TimelineRow v-if="typeof result.aircraft.lat === 'number'" label="Latitude" :value="result.aircraft.lat.toFixed(5)" />
            <TimelineRow v-if="typeof result.aircraft.lon === 'number'" label="Longitude" :value="result.aircraft.lon.toFixed(5)" />
            <TimelineRow label="Source" value="ADSB.lol" />
          </dl>
          <p class="text-xs text-surface-100/30 mt-4">
            ADS-B shows live aircraft position only. It may not include scheduled route, terminal, gate, or airline status.
          </p>
        </div>
      </div>

      <div v-if="typeof result.aircraft.lat === 'number' && typeof result.aircraft.lon === 'number'" class="mb-8">
        <h3 class="font-display text-lg font-semibold text-surface-100 mb-4">Live Map</h3>
        <div class="bg-surface-800/50 rounded-2xl border border-surface-700/30 p-2 overflow-hidden">
          <ClientOnly>
            <LiveAircraftMap :aircraft="result.aircraft" />
          </ClientOnly>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <div class="w-20 h-20 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
        <IconLocal name="radar" class="w-10 h-10 text-surface-100/20" />
      </div>
      <h2 class="font-display text-xl font-semibold text-surface-100 mb-2">Live aircraft not found</h2>
      <p class="text-surface-100/50 text-sm mb-6">Try searching again from the homepage.</p>
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

const callsign = (route.params.callsign as string).toUpperCase()

const result = computed(() => {
  if (store.selectedLiveAircraft) return store.selectedLiveAircraft
  return store.liveAircraft.find(item => item.callsign === callsign) ?? null
})

const altitudeLabel = computed(() => {
  if (!result.value) return ''
  const alt = result.value.aircraft.alt_baro
  if (alt === 'ground') return 'On ground'
  if (typeof alt === 'number') return `${alt.toLocaleString()} ft`
  return ''
})
</script>
