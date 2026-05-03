<template>
  <div class="flex items-center gap-3 p-5 rounded-2xl bg-surface-800/50 border border-surface-700/30 cursor-pointer hover:border-brand-500/30 hover:bg-surface-800/70 transition-all group"
    @click="$emit('click')"
  >
    <!-- Airline + flight code -->
    <div class="flex-shrink-0">
      <div class="w-14 h-14 rounded-xl bg-surface-700/50 flex items-center justify-center group-hover:bg-brand-500/10 transition-colors text-brand-400">
        <AppPlaneLogo size="lg" />
      </div>
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

    <!-- Arrow -->
    <Icon name="lucide:chevron-right" class="w-5 h-5 text-surface-100/20 group-hover:text-brand-400 transition-colors" />
  </div>
</template>

<script setup lang="ts">
import type { Flight } from '~/types/flight'

defineProps<{
  flight: Flight
}>()

defineEmits<{
  click: []
}>()

function formatTime(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
