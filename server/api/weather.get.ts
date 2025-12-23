type WeatherSummary = {
  condition: string
  tempF: number
  humidity?: number
  windMph?: number
  updatedAt?: string
  forecast?: Array<{
    label: string
    highF?: number
    lowF?: number
    condition: string
  }>
  tides?: {
    high: Array<string>
    low: Array<string>
  }
}

const formatDateForNOAA = () => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  return formatter.format(new Date()).replaceAll('-', '')
}

const fetchTides = async () => {
  const date = formatDateForNOAA()
  const url = new URL('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter')
  url.searchParams.set('product', 'predictions')
  url.searchParams.set('application', 'storbeck.dev')
  url.searchParams.set('begin_date', date)
  url.searchParams.set('end_date', date)
  url.searchParams.set('datum', 'MLLW')
  url.searchParams.set('station', '8720030')
  url.searchParams.set('time_zone', 'lst_ldt')
  url.searchParams.set('units', 'english')
  url.searchParams.set('interval', 'hilo')
  url.searchParams.set('format', 'json')

  const response = await fetch(url)
  if (!response.ok) return null

  const data = (await response.json()) as {
    predictions?: Array<{ t?: string; type?: string }>
  }
  const highs: string[] = []
  const lows: string[] = []
  for (const prediction of data.predictions ?? []) {
    const time = prediction.t?.split(' ')[1]
    if (!time) continue
    if (prediction.type === 'H') highs.push(time)
    if (prediction.type === 'L') lows.push(time)
  }
  return { high: highs, low: lows }
}

export default defineEventHandler(async (event) => {
  const pointsResponse = await fetch('https://api.weather.gov/points/29.2858,-81.0559', {
    headers: { 'User-Agent': 'storbeck.dev (weather widget)' }
  })
  if (!pointsResponse.ok) {
    return null
  }

  const pointsData = (await pointsResponse.json()) as {
    properties?: { forecast?: string }
  }
  const forecastUrl = pointsData.properties?.forecast
  if (!forecastUrl) {
    return null
  }

  const response = await fetch(forecastUrl, {
    headers: { 'User-Agent': 'storbeck.dev (weather widget)' }
  })
  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as {
    properties?: {
      periods?: Array<{
        shortForecast?: string
        temperature?: number
        temperatureUnit?: string
        icon?: string
        name?: string
        isDaytime?: boolean
        windSpeed?: string
        startTime?: string
        relativeHumidity?: { value?: number }
      }>
    }
  }
  const periods = data.properties?.periods ?? []
  const period = periods[0]
  if (!period) {
    return null
  }

  const windMph = Number.parseInt(String(period.windSpeed || '').split(' ')[0] || '', 10)

  const dailyForecast = (() => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      timeZone: 'America/New_York'
    })
    const grouped = new Map<
      string,
      {
        label: string
        highF?: number
        lowF?: number
        condition?: string
      }
    >()

    for (const entry of periods) {
      if (!entry.startTime) continue
      const dateKey = entry.startTime.slice(0, 10)
      const label = formatter.format(new Date(entry.startTime))
      const isDay = entry.isDaytime ?? !String(entry.name || '').toLowerCase().includes('night')
      const temperature = Number(entry.temperature ?? NaN)

      const current = grouped.get(dateKey) ?? { label }
      if (Number.isFinite(temperature)) {
        if (isDay) {
          current.highF = Math.round(temperature)
          current.condition = entry.shortForecast || current.condition
        } else {
          current.lowF = Math.round(temperature)
          if (!current.condition) {
            current.condition = entry.shortForecast || current.condition
          }
        }
      }
      grouped.set(dateKey, current)
      if (grouped.size >= 5) {
        continue
      }
    }

    return Array.from(grouped.values()).slice(0, 5).map((entry) => ({
      label: entry.label,
      highF: entry.highF,
      lowF: entry.lowF,
      condition: entry.condition || 'Forecast'
    }))
  })()

  const summary: WeatherSummary = {
    condition: period.shortForecast || 'Current weather',
    tempF: Math.round(Number(period.temperature || 0)),
    humidity: period.relativeHumidity?.value ?? undefined,
    windMph: Number.isFinite(windMph) ? windMph : undefined,
    updatedAt: period.startTime,
    forecast: dailyForecast,
    tides: await fetchTides()
  }

  return summary
})
