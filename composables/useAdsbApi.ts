import type { AdsbResponse, LiveAircraftResult } from '~/types/adsb'

const ADSB_BASE_URL = 'https://api.adsb.lol/v2'

export function useAdsbApi() {
  async function fetchByCallsign(callsignInput: string): Promise<LiveAircraftResult[]> {
    const callsign = callsignInput.trim().toUpperCase().replace(/\s+/g, '')

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

  return { fetchByCallsign }
}
