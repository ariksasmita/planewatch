<template>
  <span
    class="inline-block bg-current"
    :class="sizeClass"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'md',
})

const sizeClass = computed(() => ({
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-10 h-10',
}[props.size]))
</script>

<style scoped>
span {
  mask: url('~/assets/plane.svg') center / contain no-repeat;
  -webkit-mask: url('~/assets/plane.svg') center / contain no-repeat;
}
</style>
