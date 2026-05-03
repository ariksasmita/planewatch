<template>
  <button
    class="inline-flex items-center gap-2 rounded-full border border-surface-700/50 px-3 py-1.5 text-sm text-surface-100/55 hover:border-brand-400/40 hover:text-brand-300 transition-colors"
    title="Toggle theme"
    @click="cycleMode"
  >
    <Icon name="lucide:sun-moon" class="w-4 h-4" />
    <span class="hidden sm:inline capitalize">{{ mode }}</span>
  </button>
</template>

<script setup lang="ts">
const { mode, cycleMode, loadTheme } = useThemeMode()

onMounted(loadTheme)
</script>
