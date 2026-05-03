import type { LiveAircraftResult } from '~/types/adsb'
import type { Flight } from '~/types/flight'

const CACHE_KEY = 'planewatch-search-cache'
const CACHE_TTL_MS = 60_000

interface CacheEntry {
  createdAt: number
  flights: Flight[]
  liveAircraft: LiveAircraftResult[]
}

type CacheRecord = Record<string, CacheEntry>

function readCache(): CacheRecord {
  if (!import.meta.client) return {}

  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  }
  catch {
    return {}
  }
}

function writeCache(cache: CacheRecord) {
  if (!import.meta.client) return
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}

export function useFlightSearchCache() {
  function get(code: string): CacheEntry | null {
    const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, '')
    const cache = readCache()
    const entry = cache[normalizedCode]

    if (!entry) return null

    if (Date.now() - entry.createdAt > CACHE_TTL_MS) {
      delete cache[normalizedCode]
      writeCache(cache)
      return null
    }

    return entry
  }

  function set(code: string, data: Pick<CacheEntry, 'flights' | 'liveAircraft'>) {
    const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, '')
    const cache = readCache()

    cache[normalizedCode] = {
      createdAt: Date.now(),
      flights: data.flights,
      liveAircraft: data.liveAircraft,
    }

    // Keep cache tiny.
    const entries = Object.entries(cache)
      .sort((a, b) => b[1].createdAt - a[1].createdAt)
      .slice(0, 20)

    writeCache(Object.fromEntries(entries))
  }

  return { get, set }
}
