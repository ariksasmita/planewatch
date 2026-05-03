<template>
  <div class="rounded-2xl bg-surface-950/30 p-4 min-w-0">
    <p class="text-sm text-surface-100/45 mb-1">{{ label }} · {{ airport }}</p>
    <template v-if="weather">
      <p class="font-display text-2xl font-bold text-surface-50">{{ weather.temperatureC ?? '—' }}°C</p>
      <p class="text-xs text-surface-100/40 truncate">{{ weather.label }}<span v-if="weather.windKph !== null"> · Wind {{ weather.windKph }} km/h</span></p>
    </template>
    <p v-else class="text-sm text-surface-100/30">Weather unavailable</p>
  </div>
</template>

<script setup lang="ts">
import type { AirportWeather } from '~/composables/useWeatherApi'

defineProps<{
  label: string
  airport: string
  weather: AirportWeather | null
}>()
</script>
