<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-display text-sm font-semibold text-surface-100/50 uppercase tracking-wider">Recent Searches</h3>
      <button
        @click="$emit('clear')"
        class="text-xs text-surface-100/30 hover:text-red-400 transition-colors"
      >
        Clear all
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="search in searches"
        :key="search.code"
        @click="$emit('select', search.code)"
        class="px-4 py-2 rounded-xl bg-surface-800 border border-surface-700/30 text-surface-100/70 text-sm font-display font-medium hover:border-brand-500/30 hover:text-brand-400 transition-all"
      >
        {{ search.code }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlightSearch } from '~/types/flight'

defineProps<{
  searches: FlightSearch[]
}>()

defineEmits<{
  select: [code: string]
  clear: []
}>()
</script>
