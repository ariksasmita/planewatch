export interface AeroDataBoxFlight {
  greatCircleDistance?: {
    meter?: number
    km?: number
    mile?: number
    nm?: number
    feet?: number
  }
  departure: AeroDataBoxAirportEvent
  arrival: AeroDataBoxAirportEvent
  lastUpdatedUtc?: string
  number: string
  callSign?: string
  status: string
  codeshareStatus?: string
  isCargo?: boolean
  aircraft?: {
    reg?: string
    modeS?: string
    model?: string
  }
  airline?: {
    name?: string
    iata?: string
    icao?: string
  }
}

export interface AeroDataBoxAirportEvent {
  airport: {
    icao?: string
    iata?: string
    name?: string
    shortName?: string
    municipalityName?: string
    location?: {
      lat: number
      lon: number
    }
    countryCode?: string
    timeZone?: string
  }
  scheduledTime?: AeroDataBoxTime
  revisedTime?: AeroDataBoxTime
  predictedTime?: AeroDataBoxTime
  runwayTime?: AeroDataBoxTime
  terminal?: string
  gate?: string
  baggageBelt?: string
  runway?: string
  quality?: string[]
}

export interface AeroDataBoxTime {
  utc?: string
  local?: string
}
