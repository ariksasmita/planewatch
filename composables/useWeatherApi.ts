interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number
    wind_speed_10m?: number
    weather_code?: number
  }
}

const WEATHER_LABELS: Record<number, string> = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Cloudy',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  80: 'Rain showers',
  95: 'Thunderstorm',
}

export interface AirportWeather {
  temperatureC: number | null
  windKph: number | null
  label: string
}

export function useWeatherApi() {
  async function fetchCurrent(lat: number, lon: number): Promise<AirportWeather | null> {
    try {
      const response = await $fetch<OpenMeteoResponse>('https://api.open-meteo.com/v1/forecast', {
        query: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,wind_speed_10m,weather_code',
        },
        timeout: 6000,
        retry: 0,
      })

      const current = response.current
      if (!current) return null

      return {
        temperatureC: typeof current.temperature_2m === 'number' ? Math.round(current.temperature_2m) : null,
        windKph: typeof current.wind_speed_10m === 'number' ? Math.round(current.wind_speed_10m) : null,
        label: WEATHER_LABELS[current.weather_code ?? -1] || 'Weather available',
      }
    }
    catch {
      return null
    }
  }

  return { fetchCurrent }
}
