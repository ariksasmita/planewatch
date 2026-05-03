<template>
  <div class="bg-surface-800/50 rounded-2xl border border-surface-700/30 p-6">
    <div class="flex items-center justify-between gap-4">
      <!-- Departure -->
      <div class="text-center flex-1">
        <div class="font-display text-3xl md:text-4xl font-bold text-surface-50 mb-1">
          {{ departure.iata || departure.icao || '???' }}
        </div>
        <div class="text-sm text-surface-100/50 mb-2">{{ departure.airport }}</div>
        <div class="flex items-center justify-center gap-2 text-xs text-surface-100/40">
          <span v-if="departure.terminal">T{{ departure.terminal }}</span>
          <span v-if="departure.gate">Gate {{ departure.gate }}</span>
        </div>
      </div>

      <!-- Route line -->
      <div class="flex-shrink-0 flex items-center px-2">
        <div class="w-20 md:w-32 h-px bg-surface-700/50 relative">
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-400">
            <AppPlaneLogo size="md" />
          </div>
        </div>
      </div>

      <!-- Arrival -->
      <div class="text-center flex-1">
        <div class="font-display text-3xl md:text-4xl font-bold text-surface-50 mb-1">
          {{ arrival.iata || arrival.icao || '???' }}
        </div>
        <div class="text-sm text-surface-100/50 mb-2">{{ arrival.airport }}</div>
        <div class="flex items-center justify-center gap-2 text-xs text-surface-100/40">
          <span v-if="arrival.terminal">T{{ arrival.terminal }}</span>
          <span v-if="arrival.gate">Gate {{ arrival.gate }}</span>
          <span v-if="arrival.baggage">Belt {{ arrival.baggage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AirportInfo } from '~/types/flight'

defineProps<{
  departure: AirportInfo
  arrival: AirportInfo
}>()
</script>
