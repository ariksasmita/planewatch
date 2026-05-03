<template>
  <div class="bg-surface-800/50 rounded-2xl border border-surface-700/30 p-6">
    <h3 class="font-display text-lg font-semibold text-surface-100 mb-4">Timing Insight</h3>
    <div class="grid sm:grid-cols-2 gap-4">
      <InsightTile label="Departure" :minutes="departureDelay" :time="departureBestTime" />
      <InsightTile label="Arrival" :minutes="arrivalDelay" :time="arrivalBestTime" />
    </div>
    <p class="mt-4 text-xs text-surface-100/35">Based on scheduled vs revised, predicted, runway, or actual times when available.</p>
  </div>
</template>

<script setup lang="ts">
import type { AirportInfo } from '~/types/flight'

const props = defineProps<{
  departure: AirportInfo
  arrival: AirportInfo
}>()

const departureBestTime = computed(() => bestTime(props.departure))
const arrivalBestTime = computed(() => bestTime(props.arrival))
const departureDelay = computed(() => delayMinutes(props.departure.scheduled, departureBestTime.value?.utc))
const arrivalDelay = computed(() => delayMinutes(props.arrival.scheduled, arrivalBestTime.value?.utc))

function bestTime(airport: AirportInfo) {
  const candidates = [
    ['Runway', airport.times?.runwayUtc || airport.actual],
    ['Predicted', airport.times?.predictedUtc || airport.estimated],
    ['Revised', airport.times?.revisedUtc],
    ['Scheduled', airport.times?.scheduledUtc || airport.scheduled],
  ] as const

  const found = candidates.find(([, utc]) => Boolean(utc))
  return found ? { label: found[0], utc: found[1] as string } : null
}

function delayMinutes(scheduled?: string, actual?: string) {
  if (!scheduled || !actual) return null
  const delta = Math.round((new Date(actual).getTime() - new Date(scheduled).getTime()) / 60000)
  return Number.isFinite(delta) ? delta : null
}
</script>
