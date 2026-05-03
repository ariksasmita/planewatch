const IATA_TO_ICAO_AIRLINES: Record<string, string> = {
  GA: 'GIA',
  DL: 'DAL',
  UA: 'UAL',
  AA: 'AAL',
  BA: 'BAW',
  EK: 'UAE',
  SQ: 'SIA',
  QF: 'QFA',
  LH: 'DLH',
  AF: 'AFR',
  KL: 'KLM',
  QR: 'QTR',
  CX: 'CPA',
  NH: 'ANA',
  JL: 'JAL',
  TK: 'THY',
  EY: 'ETD',
  AC: 'ACA',
  AS: 'ASA',
  WN: 'SWA',
}

export function normalizeFlightCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, '')
}

export function getFlightCodeVariants(input: string) {
  const code = normalizeFlightCode(input)
  const variants = new Set<string>([code])
  const match = code.match(/^([A-Z]{2,3})(\d{1,4}[A-Z]?)$/)

  if (!match) return [...variants]

  const [, airline, number] = match

  if (airline.length === 2 && IATA_TO_ICAO_AIRLINES[airline]) {
    variants.add(`${IATA_TO_ICAO_AIRLINES[airline]}${number}`)
  }

  return [...variants]
}
