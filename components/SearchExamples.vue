<template>
  <div class="flex flex-wrap items-center justify-center gap-2 mt-5">
    <span class="text-xs text-surface-100/30 mr-1">Try</span>
    <button
      v-for="example in examples"
      :key="example"
      type="button"
      class="px-3 py-1.5 rounded-full bg-surface-800/70 border border-surface-700/40 text-xs font-display font-medium text-surface-100/60 hover:text-brand-400 hover:border-brand-500/30 transition-all"
      @click="$emit('select', example)"
    >
      {{ example }}
    </button>
  </div>
</template>

<script setup lang="ts">
const examples = ['GIA401', 'DAL496', 'GA401', 'DL496']

defineEmits<{
  select: [code: string]
}>()
</script>
