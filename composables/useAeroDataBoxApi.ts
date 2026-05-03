import type { AeroDataBoxFlight } from '~/types/aerodatabox'
import type { AirportInfo, Flight, FlightStatus } from '~/types/flight'

function normalizeDate(value?: string) {
  if (!value) return ''
  // AeroDataBox returns values like "2026-05-03 01:00Z"; JS wants T separator.
  return value.replace(' ', 'T')
}

function mapStatus(status: string): FlightStatus {
  const normalized = status.toLowerCase()

  if (normalized.includes('arriv') || normalized.includes('land')) return 'landed'
  if (normalized.includes('depart')) return 'departed'
  if (normalized.includes('en-route') || normalized.includes('active')) return 'active'
  if (normalized.includes('expect')) return 'expected'
  if (normalized.includes('cancel')) return 'cancelled'
  if (normalized.includes('divert')) return 'diverted'
  if (normalized.includes('delay')) return 'delayed'
  if (normalized.includes('incident')) return 'incident'
  if (normalized.includes('unknown')) return 'unknown'

  return 'scheduled'
}

function mapAirport(event: AeroDataBoxFlight['departure'] | AeroDataBoxFlight['arrival']): AirportInfo {
  const scheduled = normalizeDate(event.scheduledTime?.utc)
  const estimated = normalizeDate(event.revisedTime?.utc || event.predictedTime?.utc || event.scheduledTime?.utc)
  const actual = normalizeDate(event.runwayTime?.utc)

  return {
    airport: event.airport.name || event.airport.shortName || event.airport.iata || event.airport.icao || 'Unknown airport',
    timezone: event.airport.timeZone || '',
    location: event.airport.location,
    times: {
      scheduledUtc: normalizeDate(event.scheduledTime?.utc),
      scheduledLocal: event.scheduledTime?.local,
      revisedUtc: normalizeDate(event.revisedTime?.utc),
      revisedLocal: event.revisedTime?.local,
      predictedUtc: normalizeDate(event.predictedTime?.utc),
      predictedLocal: event.predictedTime?.local,
      runwayUtc: normalizeDate(event.runwayTime?.utc),
      runwayLocal: event.runwayTime?.local,
    },
    quality: event.quality,
    iata: event.airport.iata || null,
    icao: event.airport.icao || null,
    terminal: event.terminal || null,
    gate: event.gate || null,
    baggage: event.baggageBelt || null,
    delay: null,
    scheduled,
    estimated,
    actual: actual || null,
    estimated_runway: null,
    actual_runway: event.runway || null,
  }
}

function normalizeFlightNumber(number: string) {
  return number.replace(/\s+/g, '')
}

function aeroToFlight(flight: AeroDataBoxFlight): Flight {
  const iataCode = normalizeFlightNumber(flight.number)
  const icaoCode = flight.callSign || iataCode

  return {
    provider: 'AeroDataBox',
    lastUpdatedUtc: normalizeDate(flight.lastUpdatedUtc),
    distanceKm: flight.greatCircleDistance?.km,
    codeshareStatus: flight.codeshareStatus,
    flight_date: normalizeDate(flight.departure.scheduledTime?.utc || flight.arrival.scheduledTime?.utc).slice(0, 10),
    flight_status: mapStatus(flight.status),
    departure: mapAirport(flight.departure),
    arrival: mapAirport(flight.arrival),
    airline: {
      name: flight.airline?.name || 'Unknown airline',
      iata: flight.airline?.iata || null,
      icao: flight.airline?.icao || null,
    },
    flight: {
      number: iataCode.replace(/^\D+/, ''),
      iata: iataCode,
      icao: icaoCode,
      codeshared: null,
    },
    aircraft: flight.aircraft
      ? {
          registration: flight.aircraft.reg || 'Unknown',
          iata: null,
          icao: flight.aircraft.model || null,
          icao24: flight.aircraft.modeS || null,
        }
      : null,
    live: null,
  }
}

export function useAeroDataBoxApi() {
  async function fetchByFlightCode(flightCode: string): Promise<Flight[]> {
    const code = flightCode.trim().toUpperCase().replace(/\s+/g, '')
    const flights = await $fetch<AeroDataBoxFlight[]>(`/api/aerodatabox/flights/${code}`)
    return flights.map(aeroToFlight)
  }

  return { fetchByFlightCode }
}
