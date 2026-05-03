import type { AdsbResponse, LiveAircraftResult } from '~/types/adsb'

const ADSB_BASE_URL = 'https://api.adsb.lol/v2'

export function useAdsbApi() {
  async function fetchByCallsign(callsignInput: string): Promise<LiveAircraftResult[]> {
    const callsign = normalizeFlightCode(callsignInput)

    if (!callsign.match(/^[A-Z0-9]{3,8}$/)) {
      throw new Error('Use a callsign like GIA401 or DAL496')
    }

    const response = await $fetch<AdsbResponse>(`${ADSB_BASE_URL}/callsign/${callsign}`, {
      retry: 1,
      timeout: 8000,
    })

    const aircraft = (response.ac ?? [])
      .filter(ac => ac.flight?.trim().toUpperCase() === callsign || ac.flight?.trim().toUpperCase().startsWith(callsign))
      .filter(ac => typeof ac.lat === 'number' && typeof ac.lon === 'number')

    return aircraft.map(ac => ({
      source: 'adsb.lol' as const,
      callsign,
      aircraft: ac,
    }))
  }

  async function fetchByFlightCodeVariants(flightCode: string): Promise<LiveAircraftResult[]> {
    for (const code of getFlightCodeVariants(flightCode)) {
      try {
        const results = await fetchByCallsign(code)
        if (results.length > 0) return results
      }
      catch {
        // Try next variant.
      }
    }

    return []
  }

  return { fetchByCallsign, fetchByFlightCodeVariants }
}
