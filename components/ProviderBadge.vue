<template>
  <span :class="classes">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  provider?: 'AeroDataBox' | 'AviationStack' | 'ADS-B' | 'adsb.lol'
}>()

const label = computed(() => {
  if (props.provider === 'adsb.lol') return 'ADS-B'
  return props.provider || 'Provider'
})

const classes = computed(() => {
  const base = 'inline-flex items-center rounded-full text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider'

  if (label.value === 'AeroDataBox') return `${base} bg-brand-500/15 text-brand-300`
  if (label.value === 'AviationStack') return `${base} bg-blue-500/15 text-blue-300`
  if (label.value === 'ADS-B') return `${base} bg-amber-500/15 text-amber-400`

  return `${base} bg-surface-700/50 text-surface-100/50`
})
</script>
