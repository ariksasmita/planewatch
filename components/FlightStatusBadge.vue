<template>
  <span :class="badgeClasses">
    <span v-if="!compact" class="mr-1.5">
      <Icon :name="statusIcon" class="w-3.5 h-3.5" />
    </span>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import type { FlightStatus } from '~/types/flight'

const props = defineProps<{
  status: FlightStatus
  compact?: boolean
}>()

const statusConfig: Record<FlightStatus, { label: string; color: string; icon: string }> = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-500/20 text-blue-300', icon: 'lucide:clock' },
  active: { label: 'In Flight', color: 'bg-green-500/20 text-green-300', icon: 'lucide:plane' },
  landed: { label: 'Landed', color: 'bg-emerald-500/20 text-emerald-300', icon: 'lucide:circle-check' },
  diverted: { label: 'Diverted', color: 'bg-orange-500/20 text-orange-300', icon: 'lucide:alert-triangle' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-300', icon: 'lucide:x-circle' },
  delayed: { label: 'Delayed', color: 'bg-amber-500/20 text-amber-400', icon: 'lucide:clock-alert' },
  incident: { label: 'Incident', color: 'bg-red-500/20 text-red-300', icon: 'lucide:alert-octagon' },
  unknown: { label: 'Unknown', color: 'bg-surface-700/60 text-surface-100/60', icon: 'lucide:circle-help' },
  expected: { label: 'Expected', color: 'bg-cyan-500/20 text-cyan-300', icon: 'lucide:calendar-clock' },
  departed: { label: 'Departed', color: 'bg-green-500/20 text-green-300', icon: 'lucide:plane-takeoff' },
}

const config = computed(() => statusConfig[props.status] ?? statusConfig.scheduled)
const label = computed(() => config.value.label)
const statusIcon = computed(() => config.value.icon)

const badgeClasses = computed(() => [
  'inline-flex items-center rounded-full text-xs font-medium px-2.5 py-1',
  config.value.color,
])
</script>
