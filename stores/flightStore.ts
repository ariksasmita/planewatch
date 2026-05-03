import type { LiveAircraftResult } from '~/types/adsb'
import type { Flight, FlightSearch } from '~/types/flight'

export const useFlightStore = defineStore('flight', () => {
  // Current flight results
  const flights = ref<Flight[]>([])
  const liveAircraft = ref<LiveAircraftResult[]>([])
  const selectedFlight = ref<Flight | null>(null)
  const selectedLiveAircraft = ref<LiveAircraftResult | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Recent searches and watched flights (persisted to localStorage)
  const recentSearches = ref<FlightSearch[]>([])
  const watchedFlights = ref<string[]>([])
  const lastResultFromCache = ref(false)

  // Load recent searches from localStorage on init
  function loadRecent() {
    if (import.meta.client) {
      const stored = localStorage.getItem('planewatch-recent')
      if (stored) {
        try {
          recentSearches.value = JSON.parse(stored)
        }
        catch {}
      }

      const watched = localStorage.getItem('planewatch-watched')
      if (watched) {
        try {
          watchedFlights.value = JSON.parse(watched)
        }
        catch {}
      }
    }
  }

  function saveRecent() {
    if (import.meta.client) {
      localStorage.setItem('planewatch-recent', JSON.stringify(recentSearches.value))
    }
  }

  function addRecentSearch(code: string) {
    const entry: FlightSearch = { code: code.toUpperCase(), searchedAt: Date.now() }
    // Remove duplicate
    recentSearches.value = recentSearches.value.filter(r => r.code !== entry.code)
    // Add to front
    recentSearches.value.unshift(entry)
    // Keep max 10
    recentSearches.value = recentSearches.value.slice(0, 10)
    saveRecent()
  }

  function clearRecentSearches() {
    recentSearches.value = []
    saveRecent()
  }

  function saveWatched() {
    if (import.meta.client) {
      localStorage.setItem('planewatch-watched', JSON.stringify(watchedFlights.value))
    }
  }

  function isWatched(code: string) {
    return watchedFlights.value.includes(code.toUpperCase())
  }

  function toggleWatched(code: string) {
    const normalized = code.toUpperCase()
    if (isWatched(normalized)) {
      watchedFlights.value = watchedFlights.value.filter(item => item !== normalized)
    }
    else {
      watchedFlights.value.unshift(normalized)
      watchedFlights.value = watchedFlights.value.slice(0, 12)
    }

    saveWatched()
  }

  // Initialize
  loadRecent()

  return {
    flights,
    liveAircraft,
    selectedFlight,
    selectedLiveAircraft,
    isLoading,
    error,
    recentSearches,
    watchedFlights,
    lastResultFromCache,
    addRecentSearch,
    clearRecentSearches,
    isWatched,
    toggleWatched,
  }
})
