<template>
  <div class="bg-surface-800/50 rounded-2xl border border-surface-700/30 p-6">
    <h3 class="font-display text-lg font-semibold text-surface-100 mb-4">Airport Weather</h3>
    <div class="grid sm:grid-cols-2 gap-4">
      <WeatherTile label="Departure" :airport="departureCode" :weather="departure" />
      <WeatherTile label="Arrival" :airport="arrivalCode" :weather="arrival" />
    </div>
    <p class="mt-4 text-xs text-surface-100/35">Weather by Open-Meteo. Conditions are airport-area estimates.</p>
  </div>
</template>

<script setup lang="ts">
import type { AirportWeather } from '~/composables/useWeatherApi'

defineProps<{
  departureCode: string
  arrivalCode: string
  departure: AirportWeather | null
  arrival: AirportWeather | null
}>()
</script>
