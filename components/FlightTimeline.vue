<template>
  <div class="bg-surface-800/50 rounded-2xl border border-surface-700/30 p-6">
    <h3 class="font-display text-lg font-semibold text-surface-100 mb-5">Timeline</h3>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Departure -->
      <div class="space-y-3">
        <div class="flex items-center justify-between gap-3 text-sm text-surface-100/50">
          <div class="flex items-center gap-2">
            <IconLocal name="plane-takeoff" class="w-4 h-4 text-brand-400" />
            Departure
          </div>
          <QualityTags v-if="departure.quality?.length" :items="departure.quality" />
        </div>

        <TimelineRow label="Scheduled" :value="formatDisplayTime(departure.times?.scheduledLocal, departure.scheduled)" />
        <TimelineRow v-if="departure.times?.revisedLocal" label="Revised" :value="formatDisplayTime(departure.times.revisedLocal, departure.times.revisedUtc)" :highlight="true" />
        <TimelineRow v-if="departure.times?.predictedLocal" label="Predicted" :value="formatDisplayTime(departure.times.predictedLocal, departure.times.predictedUtc)" :highlight="true" />
        <TimelineRow v-if="departure.times?.runwayLocal || departure.actual" label="Runway" :value="formatDisplayTime(departure.times?.runwayLocal, departure.times?.runwayUtc || departure.actual || '')" :highlight="true" />
        <TimelineRow v-if="departure.delay" label="Delay" :value="`${departure.delay} min`" :warning="true" />
        <TimelineRow v-if="departure.terminal" label="Terminal" :value="departure.terminal" />
        <TimelineRow v-if="departure.gate" label="Gate" :value="departure.gate" />
        <TimelineRow v-if="departure.timezone" label="Timezone" :value="departure.timezone" />
      </div>

      <!-- Arrival -->
      <div class="space-y-3">
        <div class="flex items-center justify-between gap-3 text-sm text-surface-100/50">
          <div class="flex items-center gap-2">
            <IconLocal name="plane-landing" class="w-4 h-4 text-brand-400" />
            Arrival
          </div>
          <QualityTags v-if="arrival.quality?.length" :items="arrival.quality" />
        </div>

        <TimelineRow label="Scheduled" :value="formatDisplayTime(arrival.times?.scheduledLocal, arrival.scheduled)" />
        <TimelineRow v-if="arrival.times?.predictedLocal" label="Predicted" :value="formatDisplayTime(arrival.times.predictedLocal, arrival.times.predictedUtc)" :highlight="true" />
        <TimelineRow v-if="arrival.times?.revisedLocal" label="Revised" :value="formatDisplayTime(arrival.times.revisedLocal, arrival.times.revisedUtc)" :highlight="true" />
        <TimelineRow v-if="arrival.times?.runwayLocal || arrival.actual" label="Runway" :value="formatDisplayTime(arrival.times?.runwayLocal, arrival.times?.runwayUtc || arrival.actual || '')" :highlight="true" />
        <TimelineRow v-if="arrival.delay" label="Delay" :value="`${arrival.delay} min`" :warning="true" />
        <TimelineRow v-if="arrival.terminal" label="Terminal" :value="arrival.terminal" />
        <TimelineRow v-if="arrival.gate" label="Gate" :value="arrival.gate" />
        <TimelineRow v-if="arrival.baggage" label="Baggage" :value="`Belt ${arrival.baggage}`" />
        <TimelineRow v-if="arrival.timezone" label="Timezone" :value="arrival.timezone" />
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

function formatDisplayTime(localValue?: string, utcFallback?: string): string {
  if (localValue) {
    const match = localValue.match(/(\d{2}:\d{2})/)
    if (match) return `${match[1]} local`
  }

  if (!utcFallback) return '—'

  const d = new Date(utcFallback)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
