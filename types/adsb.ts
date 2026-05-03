export interface AdsbAircraft {
  hex: string
  type?: string
  flight?: string
  r?: string // registration
  t?: string // aircraft type
  alt_baro?: number | 'ground'
  alt_geom?: number
  gs?: number // ground speed in knots
  track?: number
  baro_rate?: number
  squawk?: string
  emergency?: string
  category?: string
  lat?: number
  lon?: number
  nic?: number
  rc?: number
  seen_pos?: number
  version?: number
  nic_baro?: number
  nac_p?: number
  nac_v?: number
  sil?: number
  sil_type?: string
  gva?: number
  sda?: number
  alert?: number
  spi?: number
  mlat?: string[]
  tisb?: string[]
  messages?: number
  seen?: number
  rssi?: number
}

export interface AdsbResponse {
  ac: AdsbAircraft[]
  msg?: string
  now?: number
  total?: number
  ctime?: number
  ptime?: number
}

export interface LiveAircraftResult {
  source: 'adsb.lol'
  callsign: string
  aircraft: AdsbAircraft
}
