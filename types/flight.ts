// AviationStack API response types

export interface Flight {
  flight_date: string
  flight_status: FlightStatus
  departure: AirportInfo
  arrival: AirportInfo
  airline: AirlineInfo
  flight: FlightCodeInfo
  aircraft: AircraftInfo | null
  live: LiveTracking | null
}

export type FlightStatus = 'scheduled' | 'active' | 'landed' | 'diverted' | 'cancelled' | 'incident' | 'delayed'

export interface AirportInfo {
  airport: string
  timezone: string
  location?: {
    lat: number
    lon: number
  }
  iata: string | null
  icao: string | null
  terminal: string | null
  gate: string | null
  baggage: string | null
  delay: number | null
  scheduled: string
  estimated: string
  actual: string | null
  estimated_runway: string | null
  actual_runway: string | null
}

export interface AirlineInfo {
  name: string
  iata: string | null
  icao: string | null
}

export interface FlightCodeInfo {
  number: string
  iata: string
  icao: string
  codeshared: string | null
}

export interface AircraftInfo {
  registration: string
  iata: string | null
  icao: string | null
  icao24: string | null
}

export interface LiveTracking {
  updated: string
  latitude: number
  longitude: number
  altitude: number
  direction: number
  speed_horizontal: number
  speed_vertical: number
  is_ground: boolean
}

export interface AviationStackResponse {
  pagination: {
    limit: number
    offset: number
    count: number
    total: number
  }
  data: Flight[]
}

export interface AirportDisplay {
  name: string
  city: string
  country: string
  iata: string | null
  icao: string | null
  terminal: string | null
  gate: string | null
  baggage: string | null
  scheduled: string
  estimated: string
  actual: string | null
  delay: number | null
  timezone: string
}

// Internal app types
export interface FlightSearch {
  code: string
  searchedAt: number
}
