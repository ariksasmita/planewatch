<template>
  <div class="rounded-3xl border border-brand-500/20 bg-gradient-to-br from-surface-800 to-surface-900 p-4 sm:p-6 shadow-2xl shadow-brand-950/20 overflow-hidden">
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div class="flex items-center gap-3 sm:gap-4 min-w-0">
        <AirlineLogo :iata="flight.airline.iata" :name="flight.airline.name" size="xl" />
        <div class="min-w-0">
          <p class="text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.3em] text-brand-300/70 mb-2">PlaneWatch summary</p>
          <h3 class="font-display text-2xl sm:text-3xl font-bold text-surface-50 truncate">{{ flight.flight.iata }}</h3>
          <p class="text-sm text-surface-100/50 truncate">{{ flight.airline.name }}</p>
        </div>
      </div>
      <div class="self-start">
        <FlightStatusBadge :status="flight.flight_status" />
      </div>
    </div>

    <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4 mb-6">
      <div class="min-w-0">
        <p class="font-display text-2xl sm:text-4xl font-bold text-surface-50 truncate">{{ flight.departure.iata || flight.departure.icao }}</p>
        <p class="text-xs sm:text-sm text-surface-100/45 truncate">{{ flight.departure.airport }}</p>
      </div>
      <div class="w-12 sm:w-24 flex items-center justify-center text-brand-300">
        <div class="hidden sm:block h-px flex-1 bg-brand-500/30" />
        <AppPlaneLogo class="mx-2 flex-shrink-0" size="sm" />
        <div class="hidden sm:block h-px flex-1 bg-brand-500/30" />
      </div>
      <div class="min-w-0 text-right">
        <p class="font-display text-2xl sm:text-4xl font-bold text-surface-50 truncate">{{ flight.arrival.iata || flight.arrival.icao }}</p>
        <p class="text-xs sm:text-sm text-surface-100/45 truncate">{{ flight.arrival.airport }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 text-sm">
      <div class="rounded-2xl bg-surface-950/30 p-3 min-w-0">
        <p class="text-surface-100/35 mb-1">Departure</p>
        <p class="font-medium text-surface-50 truncate">{{ formatDisplayTime(flight.departure.times?.scheduledLocal, flight.departure.scheduled) }}</p>
      </div>
      <div class="rounded-2xl bg-surface-950/30 p-3 min-w-0">
        <p class="text-surface-100/35 mb-1">Arrival</p>
        <p class="font-medium text-surface-50 truncate">{{ formatDisplayTime(flight.arrival.times?.scheduledLocal, flight.arrival.scheduled) }}</p>
      </div>
      <div class="rounded-2xl bg-surface-950/30 p-3 min-w-0">
        <p class="text-surface-100/35 mb-1">Aircraft</p>
        <p class="font-medium text-surface-50 truncate">{{ flight.aircraft?.model || flight.aircraft?.registration || '—' }}</p>
      </div>
      <div class="rounded-2xl bg-surface-950/30 p-3 min-w-0">
        <p class="text-surface-100/35 mb-1">Updated</p>
        <p class="font-medium text-surface-50 truncate">{{ formatDate(flight.lastUpdatedUtc) }}</p>
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
