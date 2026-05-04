<template>
  <IconLocal v-if="status === 'departed'" name="plane-takeoff" />
  <IconLocal v-else-if="status === 'landed'" name="plane-landing" />
  <svg
    v-else
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="status === 'scheduled' || status === 'expected'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </template>
    <template v-else-if="status === 'active'">
      <path d="M2 16 22 8l-6 12-4-7-7 4-3-1Z" />
    </template>
    <template v-else-if="status === 'cancelled'">
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </template>
    <template v-else-if="status === 'delayed'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
      <path d="M12 17h.01" />
    </template>
    <template v-else-if="status === 'diverted' || status === 'incident'">
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </template>
    <template v-else>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 2-2 2-2 4" />
      <path d="M12 17h.01" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import type { FlightStatus } from '~/types/flight'

defineProps<{
  status: FlightStatus
}>()
</script>
