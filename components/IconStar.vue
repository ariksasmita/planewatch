<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 3.25l2.66 5.39 5.95.86-4.31 4.2 1.02 5.93L12 16.83l-5.32 2.8 1.02-5.93-4.31-4.2 5.95-.86L12 3.25z"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linejoin="round"
      :fill="filled ? 'currentColor' : 'none'"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  filled?: boolean
}>()
</script>
