<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'move-right'">
      <path d="M18 8l4 4-4 4" />
      <path d="M2 12h20" />
    </template>
    <template v-else-if="name === 'plane-takeoff'">
      <path d="M2 22h20" />
      <path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1 2.18 1.24 3.88-2.42L8 4l1.4-.7a2 2 0 0 1 2.65.8l2.56 4.99 4.75-2.97a2.5 2.5 0 1 1 2.65 4.24L8.77 18.63a2 2 0 0 1-1.41.27Z" />
    </template>
    <template v-else-if="name === 'plane-landing'">
      <path d="M2 22h20" />
      <path d="M3.77 10.77 2 9l2-4 1.1.55a2 2 0 0 1 1.1 1.8v.2l-.1 2.51 4.39 2.2L12 4l1.4.7a2 2 0 0 1 1.1 1.8v5.61l5.11 2.56a2.5 2.5 0 1 1-2.24 4.47L3.77 10.77Z" />
    </template>
    <template v-else-if="name === 'chevron-right'">
      <path d="m9 18 6-6-6-6" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </template>
    <template v-else-if="name === 'loader'">
      <path d="M21 12a9 9 0 1 1-6.22-8.56" />
    </template>
    <template v-else-if="name === 'plane-off'">
      <path d="M2 2l20 20" />
      <path d="M10.5 10.5 3.5 5.8a1.5 1.5 0 0 0-2.1.4 1.5 1.5 0 0 0 .4 2.1l6.7 4.5" />
      <path d="M13.5 13.5 21 18.5a1.5 1.5 0 0 0 1.7-2.5l-6.6-4.4" />
      <path d="M8.5 12.8 7 22l3-2 2.5-5" />
      <path d="M15.5 11.2 17 2l-3 2-2.5 5" />
    </template>
    <template v-else-if="name === 'radar'">
      <path d="M19.07 4.93A10 10 0 0 1 21.99 12" />
      <path d="M4.93 4.93A10 10 0 0 0 2.01 12" />
      <path d="M12 8a4 4 0 0 1 4 4" />
      <path d="M12 12l8.5-8.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 14v7" />
      <path d="M8 21h8" />
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  name: 'move-right' | 'plane-takeoff' | 'plane-landing' | 'chevron-right' | 'search' | 'loader' | 'plane-off' | 'radar'
}>()
</script>
