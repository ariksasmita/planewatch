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

  // Recent searches (persisted to localStorage)
  const recentSearches = ref<FlightSearch[]>([])

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
    addRecentSearch,
    clearRecentSearches,
  }
})
