<template>
  <div class="rounded-2xl bg-surface-950/30 p-4">
    <div class="flex items-center justify-between gap-3 mb-2">
      <p class="text-sm text-surface-100/45">{{ label }}</p>
      <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="statusClass">{{ statusLabel }}</span>
    </div>
    <p class="font-display text-2xl font-bold text-surface-50">{{ delayLabel }}</p>
    <p v-if="time" class="text-xs text-surface-100/35 mt-1">{{ time.label }} · {{ formatTime(time.utc) }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  minutes: number | null
  time: null | { label: string; utc: string }
}>()

const delayLabel = computed(() => {
  if (props.minutes === null) return '—'
  if (props.minutes === 0) return 'On schedule'
  return `${props.minutes > 0 ? '+' : ''}${props.minutes} min`
})

const statusLabel = computed(() => {
  const minutes = props.minutes
  if (minutes === null) return 'Unknown'
  if (minutes < -5) return 'Early'
  if (minutes <= 5) return 'On time'
  if (minutes <= 15) return 'Slight delay'
  if (minutes <= 45) return 'Delayed'
  return 'Heavy delay'
})

const statusClass = computed(() => {
  const minutes = props.minutes
  if (minutes === null) return 'bg-surface-700/50 text-surface-100/50'
  if (minutes < -5) return 'bg-cyan-500/15 text-cyan-300'
  if (minutes <= 5) return 'bg-green-500/15 text-green-300'
  if (minutes <= 15) return 'bg-amber-500/15 text-amber-300'
  return 'bg-red-500/15 text-red-300'
})

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
