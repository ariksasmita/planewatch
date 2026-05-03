<template>
  <div class="flex items-center justify-between text-sm">
    <dt class="text-surface-100/50">{{ label }}</dt>
    <dd :class="valueClass" class="font-medium">{{ value }}</dd>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string
  highlight?: boolean
  warning?: boolean
}>()

const valueClass = computed(() => {
  if (props.warning) return 'text-amber-400'
  if (props.highlight) return 'text-brand-400'
  return 'text-surface-50'
})
</script>
