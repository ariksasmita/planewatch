<template>
  <div
    class="relative rounded-2xl bg-surface-800/50 border border-surface-700/30 cursor-pointer hover:border-brand-500/30 hover:bg-surface-800/70 transition-all group p-4 sm:p-5"
    @click="$emit('click')"
  >
    <div class="md:flex md:items-center md:gap-6">
      <div class="flex items-start gap-3 min-w-0 pr-20 md:items-center md:pr-0 md:flex-1">
        <!-- Airline + flight code -->
        <div class="flex-shrink-0">
          <AirlineLogo :iata="flight.airline.iata" :name="flight.airline.name" size="lg" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <span class="font-display font-semibold text-surface-50 text-lg leading-tight">{{ flight.flight.iata }}</span>
            <FlightStatusBadge :status="flight.flight_status" :compact="true" />
            <ProviderBadge :provider="flight.provider" />
          </div>
          <div class="text-sm text-surface-100/50 truncate">
            {{ flight.airline.name }}
          </div>
          <div v-if="flight.lastUpdatedUtc" class="text-xs text-surface-100/30 mt-1">
            Updated {{ formatDate(flight.lastUpdatedUtc) }}
          </div>
        </div>

        <div class="absolute right-3 top-3 flex flex-shrink-0 items-center gap-1 md:static md:order-3">
          <button
            class="w-9 h-9 rounded-full flex items-center justify-center text-surface-100/25 hover:text-brand-300 hover:bg-brand-500/10 transition-colors"
            :title="isRefreshing ? 'Refreshing flight' : 'Refresh this flight'"
            :disabled="isRefreshing"
            @click.stop="$emit('refresh')"
          >
            <IconRefresh class="w-4 h-4" :class="isRefreshing ? 'animate-spin text-brand-300' : ''" />
          </button>
          <button
            class="w-9 h-9 rounded-full flex items-center justify-center text-surface-100/25 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
            :class="isWatched ? 'text-amber-300 bg-amber-500/10' : ''"
            :title="isWatched ? 'Remove from watched flights' : 'Watch this flight'"
            @click.stop="$emit('toggle-watch')"
          >
            <IconStar class="w-4 h-4" :filled="isWatched" />
          </button>
        </div>
      </div>

      <!-- Route -->
      <div class="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm sm:ml-[68px] md:mt-0 md:ml-auto md:w-72 lg:w-80 md:flex-shrink-0">
        <div class="min-w-0 text-left sm:text-right">
          <div class="font-display font-semibold text-surface-50 truncate">{{ flight.departure.iata || flight.departure.icao }}</div>
          <div class="text-surface-100/40 text-xs truncate">{{ formatTime(flight.departure.scheduled) }}</div>
        </div>

        <div class="flex items-center text-surface-100/20 px-1">
          <Icon name="lucide:move-right" class="w-5 h-5" />
        </div>

        <div class="min-w-0 text-right sm:text-left">
          <div class="font-display font-semibold text-surface-50 truncate">{{ flight.arrival.iata || flight.arrival.icao }}</div>
          <div class="text-surface-100/40 text-xs truncate">{{ formatTime(flight.arrival.scheduled) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Flight } from '~/types/flight'

defineProps<{
  flight: Flight
  isWatched?: boolean
  isRefreshing?: boolean
}>()

defineEmits<{
  click: []
  refresh: []
  'toggle-watch': []
}>()

function formatDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatTime(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
