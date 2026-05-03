<template>
  <div class="bg-surface-800/50 rounded-2xl border border-surface-700/30 p-6">
    <h3 class="font-display text-lg font-semibold text-surface-100 mb-5">Timeline</h3>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Departure -->
      <div class="space-y-3">
        <div class="flex items-center gap-2 text-sm text-surface-100/50">
          <Icon name="lucide:plane-takeoff" class="w-4 h-4 text-brand-400" />
          Departure
        </div>

        <TimelineRow label="Scheduled" :value="formatTime(departure.scheduled)" />
        <TimelineRow label="Estimated" :value="formatTime(departure.estimated)" />
        <TimelineRow v-if="departure.actual" label="Actual" :value="formatTime(departure.actual)" :highlight="true" />
        <TimelineRow v-if="departure.delay" label="Delay" :value="`${departure.delay} min`" :warning="true" />
        <TimelineRow v-if="departure.terminal" label="Terminal" :value="departure.terminal" />
        <TimelineRow v-if="departure.gate" label="Gate" :value="departure.gate" />
      </div>

      <!-- Arrival -->
      <div class="space-y-3">
        <div class="flex items-center gap-2 text-sm text-surface-100/50">
          <Icon name="lucide:plane-landing" class="w-4 h-4 text-brand-400" />
          Arrival
        </div>

        <TimelineRow label="Scheduled" :value="formatTime(arrival.scheduled)" />
        <TimelineRow label="Estimated" :value="formatTime(arrival.estimated)" />
        <TimelineRow v-if="arrival.actual" label="Actual" :value="formatTime(arrival.actual)" :highlight="true" />
        <TimelineRow v-if="arrival.delay" label="Delay" :value="`${arrival.delay} min`" :warning="true" />
        <TimelineRow v-if="arrival.terminal" label="Terminal" :value="arrival.terminal" />
        <TimelineRow v-if="arrival.gate" label="Gate" :value="arrival.gate" />
        <TimelineRow v-if="arrival.baggage" label="Baggage" :value="`Belt ${arrival.baggage}`" />
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

function formatTime(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
