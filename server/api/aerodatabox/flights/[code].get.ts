import type { AeroDataBoxFlight } from '~/types/aerodatabox'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const code = getRouterParam(event, 'code')?.trim().toUpperCase().replace(/\s+/g, '')

  if (!config.aerodataboxRapidApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'AeroDataBox RapidAPI key is not configured',
    })
  }

  if (!code || !code.match(/^[A-Z0-9]{3,8}$/)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid flight code. Use a code like GA401, GIA401, DL496, or DAL496.',
    })
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
    throw createError({
      statusCode: error?.response?.status || error?.statusCode || 502,
      statusMessage: error?.response?._data?.message || error?.message || 'AeroDataBox request failed',
    })
  }
})
