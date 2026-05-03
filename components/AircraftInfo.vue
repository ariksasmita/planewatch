<template>
  <div class="bg-surface-800/50 rounded-2xl border border-surface-700/30 p-6">
    <h3 class="font-display text-lg font-semibold text-surface-100 mb-4">Aircraft & Airline</h3>

    <!-- Airline -->
    <div class="flex items-center gap-3 mb-5 pb-5 border-b border-surface-700/30">
      <div class="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
        <Icon name="lucide:building-2" class="w-5 h-5 text-brand-400" />
      </div>
      <div>
        <div class="text-surface-50 font-medium">{{ airline.name }}</div>
        <div class="text-xs text-surface-100/40">
          <span v-if="airline.iata">{{ airline.iata }}</span>
          <span v-if="airline.iata && airline.icao"> · </span>
          <span v-if="airline.icao">{{ airline.icao }}</span>
        </div>
      </div>
    </div>

    <!-- Aircraft -->
    <div v-if="aircraft" class="space-y-3 text-sm">
      <TimelineRow label="Registration" :value="aircraft.registration" />
      <TimelineRow v-if="aircraft.iata" label="Type (IATA)" :value="aircraft.iata" />
      <TimelineRow v-if="aircraft.icao" label="Type (ICAO)" :value="aircraft.icao" />
    </div>
    <div v-else class="text-sm text-surface-100/30">
      Aircraft info not available for this flight.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AircraftInfo, AirlineInfo } from '~/types/flight'

defineProps<{
  aircraft: AircraftInfo | null
  airline: AirlineInfo
}>()
</script>
