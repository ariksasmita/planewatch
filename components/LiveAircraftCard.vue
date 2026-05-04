<template>
  <div
    class="flex items-center gap-3 p-5 rounded-2xl bg-surface-800/50 border border-amber-500/20 cursor-pointer hover:border-amber-500/40 hover:bg-surface-800/70 transition-all group"
    @click="$emit('click')"
  >
    <div class="flex-shrink-0">
      <div class="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors text-amber-400">
        <AppPlaneLogo size="lg" />
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span class="font-display font-semibold text-surface-50 text-lg">{{ result.callsign }}</span>
        <ProviderBadge provider="ADS-B" />
      </div>
      <div class="text-sm text-surface-100/50">
        {{ aircraft.r || 'Unknown registration' }}
        <span v-if="aircraft.t"> · {{ aircraft.t }}</span>
      </div>
    </div>

    <div class="hidden sm:block text-right text-sm">
      <div class="text-surface-50 font-medium">{{ speedLabel }}</div>
      <div class="text-surface-100/40 text-xs">{{ altitudeLabel }}</div>
    </div>

    <IconLocal name="chevron-right" class="w-5 h-5 text-surface-100/20 group-hover:text-amber-400 transition-colors" />
  </div>
</template>

<script setup lang="ts">
import type { LiveAircraftResult } from '~/types/adsb'

const props = defineProps<{
  result: LiveAircraftResult
}>()

defineEmits<{
  click: []
}>()

const aircraft = computed(() => props.result.aircraft)

const speedLabel = computed(() => {
  if (typeof aircraft.value.gs !== 'number') return 'Speed —'
  return `${Math.round(aircraft.value.gs)} kt`
})

const altitudeLabel = computed(() => {
  if (aircraft.value.alt_baro === 'ground') return 'On ground'
  if (typeof aircraft.value.alt_baro === 'number') return `${aircraft.value.alt_baro.toLocaleString()} ft`
  return 'Altitude —'
})
</script>
