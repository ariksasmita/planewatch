<template>
  <div class="flex flex-wrap justify-end gap-1">
    <span
      v-for="item in items"
      :key="item"
      class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-surface-700/50 text-surface-100/50"
    >
      {{ item }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: string[]
}>()
</script>
