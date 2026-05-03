<template>
  <div class="rounded-3xl border border-brand-500/20 bg-gradient-to-br from-surface-800 to-surface-900 p-6 shadow-2xl shadow-brand-950/20">
    <div class="flex items-start justify-between gap-4 mb-6">
      <div class="flex items-center gap-4">
        <AirlineLogo :iata="flight.airline.iata" :name="flight.airline.name" size="xl" />
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-brand-300/70 mb-2">PlaneWatch summary</p>
          <h3 class="font-display text-3xl font-bold text-surface-50">{{ flight.flight.iata }}</h3>
          <p class="text-sm text-surface-100/50">{{ flight.airline.name }}</p>
        </div>
      </div>
      <FlightStatusBadge :status="flight.flight_status" />
    </div>

    <div class="flex items-center justify-between gap-4 mb-6">
      <div>
        <p class="font-display text-4xl font-bold text-surface-50">{{ flight.departure.iata || flight.departure.icao }}</p>
        <p class="text-sm text-surface-100/45 truncate max-w-40">{{ flight.departure.airport }}</p>
      </div>
      <div class="flex-1 flex items-center justify-center text-brand-300">
        <div class="h-px flex-1 bg-brand-500/30" />
        <AppPlaneLogo class="mx-3" size="md" />
        <div class="h-px flex-1 bg-brand-500/30" />
      </div>
      <div class="text-right">
        <p class="font-display text-4xl font-bold text-surface-50">{{ flight.arrival.iata || flight.arrival.icao }}</p>
        <p class="text-sm text-surface-100/45 truncate max-w-40">{{ flight.arrival.airport }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 text-sm">
      <div class="rounded-2xl bg-surface-950/30 p-3">
        <p class="text-surface-100/35 mb-1">Departure</p>
        <p class="font-medium text-surface-50">{{ formatDisplayTime(flight.departure.times?.scheduledLocal, flight.departure.scheduled) }}</p>
      </div>
      <div class="rounded-2xl bg-surface-950/30 p-3">
        <p class="text-surface-100/35 mb-1">Arrival</p>
        <p class="font-medium text-surface-50">{{ formatDisplayTime(flight.arrival.times?.scheduledLocal, flight.arrival.scheduled) }}</p>
      </div>
      <div class="rounded-2xl bg-surface-950/30 p-3">
        <p class="text-surface-100/35 mb-1">Aircraft</p>
        <p class="font-medium text-surface-50 truncate">{{ flight.aircraft?.model || '—' }}</p>
      </div>
      <div class="rounded-2xl bg-surface-950/30 p-3">
        <p class="text-surface-100/35 mb-1">Updated</p>
        <p class="font-medium text-surface-50">{{ formatDate(flight.lastUpdatedUtc) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Flight } from '~/types/flight'

defineProps<{
  flight: Flight
}>()

function formatDisplayTime(localValue?: string, utcFallback?: string): string {
  if (localValue) {
    const match = localValue.match(/(\d{2}:\d{2})/)
    if (match) return `${match[1]} local`
  }

  if (!utcFallback) return '—'
  return new Date(utcFallback).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
