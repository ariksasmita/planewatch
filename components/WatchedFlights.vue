<template>
  <section v-if="flights.length" class="mb-12">
    <div class="flex items-center justify-between gap-3 mb-4">
      <h2 class="font-display text-xl font-semibold text-surface-100">Watched flights</h2>
      <span class="text-xs text-surface-100/30">Stored on this device</span>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="code in flights"
        :key="code"
        class="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-200 hover:border-brand-400/50 hover:bg-brand-500/15 transition-colors"
        @click="$emit('select', code)"
      >
        <IconStar class="w-3.5 h-3.5" :filled="true" />
        {{ code }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  flights: string[]
}>()

defineEmits<{
  select: [code: string]
}>()
</script>
