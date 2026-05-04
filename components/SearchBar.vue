<template>
  <form @submit.prevent="handleSubmit" class="max-w-xl mx-auto">
    <div class="relative flex items-center">
      <div class="absolute left-4 text-surface-100/30">
        <IconLocal name="search" class="w-5 h-5" />
      </div>
      <input
        ref="inputRef"
        v-model="code"
        type="text"
        placeholder="e.g. UA123, BA456, EK202"
        class="w-full h-14 pl-12 pr-32 rounded-2xl bg-surface-800 border border-surface-700/50 text-surface-50 placeholder:text-surface-100/30 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all text-lg font-display font-medium uppercase tracking-wider"
        :disabled="isLoading"
      />
      <button
        type="submit"
        :disabled="isLoading || !code.trim()"
        class="absolute right-2 h-10 px-6 rounded-xl bg-brand-500 text-surface-950 font-display font-semibold text-sm hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <span v-if="isLoading">
          <IconLocal name="loader" class="w-5 h-5 animate-spin" />
        </span>
        <span v-else>Track</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  isLoading?: boolean
}>()

const emit = defineEmits<{
  search: [code: string]
}>()

const code = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function handleSubmit() {
  const trimmed = code.value.trim()
  if (trimmed) {
    emit('search', trimmed)
  }
}

// Focus input on mount
onMounted(() => {
  inputRef.value?.focus()
})
</script>
