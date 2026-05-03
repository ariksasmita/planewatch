<template>
  <div
    class="relative overflow-hidden rounded-xl bg-surface-700/50 flex items-center justify-center text-surface-50 font-display font-bold ring-1 ring-white/5"
    :class="sizeClass"
  >
    <img
      v-if="iata && !failed"
      :src="logoUrl"
      :alt="`${name || iata} logo`"
      class="w-full h-full object-contain p-2 bg-white/95"
      loading="lazy"
      referrerpolicy="no-referrer"
      @error="failed = true"
    >
    <span v-else class="text-brand-300" :class="textClass">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  iata?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'md',
})

const failed = ref(false)

const cleanIata = computed(() => props.iata?.trim().toUpperCase())
const iata = computed(() => cleanIata.value?.match(/^[A-Z0-9]{2}$/) ? cleanIata.value : '')
const logoUrl = computed(() => `https://images.kiwi.com/airlines/64/${iata.value}.png`)

const initials = computed(() => {
  if (iata.value) return iata.value
  const words = props.name?.split(/\s+/).filter(Boolean) ?? []
  return words.slice(0, 2).map(word => word[0]?.toUpperCase()).join('') || 'PW'
})

const sizeClass = computed(() => ({
  sm: 'w-9 h-9 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-16 h-16 text-lg',
}[props.size]))

const textClass = computed(() => ({
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
}[props.size]))

watch(() => props.iata, () => {
  failed.value = false
})
</script>
