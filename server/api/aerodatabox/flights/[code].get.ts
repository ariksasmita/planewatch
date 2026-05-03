import type { AeroDataBoxFlight } from '~/types/aerodatabox'

type ProviderErrorType = 'missing_key' | 'invalid_code' | 'rate_limit' | 'not_found' | 'provider_error'

function providerError(type: ProviderErrorType, statusCode: number, message: string) {
  return createError({
    statusCode,
    statusMessage: message,
    data: { type, message },
  })
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const code = getRouterParam(event, 'code')?.trim().toUpperCase().replace(/\s+/g, '')

  if (!config.aerodataboxRapidApiKey) {
    throw providerError('missing_key', 500, 'AeroDataBox RapidAPI key is not configured')
  }

  if (!code || !code.match(/^[A-Z0-9]{3,8}$/)) {
    throw providerError('invalid_code', 400, 'Invalid flight code. Use a code like GA401, GIA401, DL496, or DAL496.')
  }

  try {
    const flights = await $fetch<AeroDataBoxFlight[]>(`https://aerodatabox.p.rapidapi.com/flights/number/${code}`, {
      headers: {
        'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
        'x-rapidapi-key': config.aerodataboxRapidApiKey,
      },
      timeout: 10000,
      retry: 0,
    })

    return flights ?? []
  }
  catch (error: any) {
    const statusCode = error?.response?.status || error?.statusCode || 502
    const providerMessage = error?.response?._data?.message || error?.message || 'AeroDataBox request failed'

    if (statusCode === 404) {
      throw providerError('not_found', 404, `No AeroDataBox data found for ${code}`)
    }

    if (statusCode === 429) {
      throw providerError('rate_limit', 429, 'AeroDataBox rate limit reached. Please wait a few seconds and try again.')
    }

    throw providerError('provider_error', statusCode, providerMessage)
  }
})
