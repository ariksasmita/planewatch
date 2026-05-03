<template>
  <div class="min-h-screen bg-surface-950">
    <!-- Top nav -->
    <header class="border-b border-surface-700/50 backdrop-blur-sm sticky top-0 z-50 bg-surface-950/80">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center group-hover:bg-brand-500/30 transition-colors text-brand-400">
            <AppPlaneLogo size="md" />
          </div>
          <span class="font-display text-lg font-semibold text-surface-50">
            Plane<span class="text-brand-400">Watch</span>
          </span>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <span class="text-xs text-surface-100/40 hidden md:inline">Flight Status Tracker</span>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-6">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-surface-700/30 mt-16">
      <div class="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-surface-100/30">
        <span>PlaneWatch &copy; {{ new Date().getFullYear() }}</span>
        <span>Powered by AeroDataBox & ADS-B</span>
      </div>
    </footer>
  </div>
</template>
