import type { Flight, AviationStackResponse } from '~/types/flight'

const BASE_URL = 'http://api.aviationstack.com/v1'

interface ParsedFlightCode {
  raw: string
  airlineCode: string
  flightNumber: string
  isIcao: boolean
  isIata: boolean
}

function parseFlightCode(input: string): ParsedFlightCode | null {
  const raw = input.trim().toUpperCase().replace(/\s+/g, '')
  const match = raw.match(/^([A-Z]{2,3})(\d{1,4}[A-Z]?)$/)

  if (!match) return null

  const airlineCode = match[1]
  const flightNumber = match[2]

  return {
    raw,
    airlineCode,
    flightNumber,
    isIata: airlineCode.length === 2,
    isIcao: airlineCode.length === 3,
  }
}

function buildUrl(apiKey: string, params: Record<string, string | number>) {
  const searchParams = new URLSearchParams({ access_key: apiKey })

  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, String(value))
  })

  return `${BASE_URL}/flights?${searchParams.toString()}`
}

function dedupeFlights(flights: Flight[]) {
  const seen = new Set<string>()

  return flights.filter((flight) => {
    const key = [
      flight.flight_date,
      flight.flight.iata,
      flight.flight.icao,
      flight.departure.iata,
      flight.arrival.iata,
      flight.departure.scheduled,
    ].join('|')

    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function useAviationApi() {
  const config = useRuntimeConfig()
  const apiKey = config.public.aviationStackApiKey

  async function fetchFlights(params: Record<string, string | number>): Promise<Flight[]> {
    const response = await $fetch<AviationStackResponse>(buildUrl(apiKey, params))
    return response.data ?? []
  }

  async function fetchByFlightCode(flightCode: string): Promise<Flight[]> {
    if (!apiKey) {
      throw new Error('AviationStack API key not configured. Set NUXT_PUBLIC_AVIATION_STACK_API_KEY in .env')
    }

    const parsed = parseFlightCode(flightCode)

    if (!parsed) {
      throw new Error('Use a flight code like GA401, GIA401, DL496, or DAL496')
    }

    const attempts: Record<string, string | number>[] = []

    // Exact-code attempts first.
    if (parsed.isIata) {
      attempts.push({ flight_iata: parsed.raw, limit: 10 })
      attempts.push({ airline_iata: parsed.airlineCode, flight_number: parsed.flightNumber, limit: 10 })
    }

    if (parsed.isIcao) {
      attempts.push({ flight_icao: parsed.raw, limit: 10 })
      attempts.push({ airline_icao: parsed.airlineCode, flight_number: parsed.flightNumber, limit: 10 })
    }

    // Fallback: some providers only match flight_number loosely.
    attempts.push({ flight_number: parsed.flightNumber, limit: 20 })

    const results: Flight[] = []

    for (const params of attempts) {
      const flights = await fetchFlights(params)
      results.push(...flights)

      // Stop once an exact-ish query succeeds to save free-tier requests.
      if (flights.length > 0 && !('flight_number' in params && Object.keys(params).length === 2)) {
        break
      }
    }

    const deduped = dedupeFlights(results)

    if (deduped.length === 0) {
      throw new Error(
        `No live AviationStack data found for ${parsed.raw}. Tried ${parsed.isIata ? 'IATA' : 'ICAO'} exact code and flight number fallback.`,
      )
    }

    return deduped
  }

  return { fetchByFlightCode }
}
