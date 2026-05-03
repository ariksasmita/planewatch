<template>
  <div class="flex items-center gap-3 p-5 rounded-2xl bg-surface-800/50 border border-surface-700/30 cursor-pointer hover:border-brand-500/30 hover:bg-surface-800/70 transition-all group"
    @click="$emit('click')"
  >
    <!-- Airline + flight code -->
    <div class="flex-shrink-0">
      <AirlineLogo :iata="flight.airline.iata" :name="flight.airline.name" size="lg" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span class="font-display font-semibold text-surface-50 text-lg">{{ flight.flight.iata }}</span>
        <FlightStatusBadge :status="flight.flight_status" :compact="true" />
        <ProviderBadge :provider="flight.provider" />
      </div>
      <div class="text-sm text-surface-100/50">
        {{ flight.airline.name }}
      </div>
      <div v-if="flight.lastUpdatedUtc" class="text-xs text-surface-100/30 mt-1">
        Updated {{ formatDate(flight.lastUpdatedUtc) }}
      </div>
    </div>

    <!-- Route -->
    <div class="flex items-center gap-3 text-sm">
      <div class="text-right">
        <div class="font-display font-semibold text-surface-50">{{ flight.departure.iata || flight.departure.icao }}</div>
        <div class="text-surface-100/40 text-xs">{{ formatTime(flight.departure.scheduled) }}</div>
      </div>

      <div class="flex items-center text-surface-100/20">
        <Icon name="lucide:move-right" class="w-5 h-5" />
      </div>

      <div class="text-left">
        <div class="font-display font-semibold text-surface-50">{{ flight.arrival.iata || flight.arrival.icao }}</div>
        <div class="text-surface-100/40 text-xs">{{ formatTime(flight.arrival.scheduled) }}</div>
      </div>
    </div>

    <button
      class="w-9 h-9 rounded-full flex items-center justify-center text-surface-100/25 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
      :class="isWatched ? 'text-amber-300 bg-amber-500/10' : ''"
      :title="isWatched ? 'Remove from watched flights' : 'Watch this flight'"
      @click.stop="$emit('toggle-watch')"
    >
      <IconStar class="w-4 h-4" :filled="isWatched" />
    </button>

    <!-- Arrow -->
    <Icon name="lucide:chevron-right" class="w-5 h-5 text-surface-100/20 group-hover:text-brand-400 transition-colors" />
  </div>
</template>

<script setup lang="ts">
import type { Flight } from '~/types/flight'

defineProps<{
  flight: Flight
  isWatched?: boolean
}>()

defineEmits<{
  click: []
  'toggle-watch': []
}>()

function formatDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatTime(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
