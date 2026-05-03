<template>
  <div ref="mapContainer" class="h-80 md:h-96 rounded-xl overflow-hidden"></div>
</template>

<script setup lang="ts">
import type { AirportInfo, LiveTracking } from '~/types/flight'
import type { Map } from 'leaflet'

const props = defineProps<{
  departure: AirportInfo
  arrival: AirportInfo
  live?: LiveTracking | null
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
let map: Map | null = null

function popupHtml(label: string, airport: AirportInfo) {
  return `
    <div style="font-size:12px">
      <strong>${label}</strong><br/>
      ${airport.airport}<br/>
      ${airport.iata || airport.icao || ''}
      ${airport.terminal ? `<br/>Terminal ${airport.terminal}` : ''}
      ${airport.gate ? `<br/>Gate ${airport.gate}` : ''}
    </div>
  `
}

onMounted(async () => {
  if (!props.departure.location || !props.arrival.location) return

  const L = (await import('leaflet')).default

  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  if (!mapContainer.value) return

  const dep: [number, number] = [props.departure.location.lat, props.departure.location.lon]
  const arr: [number, number] = [props.arrival.location.lat, props.arrival.location.lon]
  const points: [number, number][] = [dep, arr]

  if (props.live) {
    points.splice(1, 0, [props.live.latitude, props.live.longitude])
  }

  map = L.map(mapContainer.value, {
    center: dep,
    zoom: 5,
    zoomControl: true,
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18,
  }).addTo(map)

  L.marker(dep).addTo(map).bindPopup(popupHtml('Departure', props.departure))
  L.marker(arr).addTo(map).bindPopup(popupHtml('Arrival', props.arrival))

  L.polyline(points, {
    color: '#22d3ee',
    weight: 3,
    opacity: 0.85,
    dashArray: props.live ? undefined : '8 10',
  }).addTo(map)

  const midpoint: [number, number] = props.live
    ? [props.live.latitude, props.live.longitude]
    : [(dep[0] + arr[0]) / 2, (dep[1] + arr[1]) / 2]

  const heading = props.live?.direction ?? 45
  const planeIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 36 36" fill="#22d3ee" style="transform: rotate(${heading}deg); filter: drop-shadow(0 0 8px #22d3ee)"><path d="M35.77,8.16a2.43,2.43,0,0,0-1.9-2L28,4.87a4.5,4.5,0,0,0-3.65.79L7,18.3,2.14,18.1A1.86,1.86,0,0,0,.91,21.41l5,3.93c.6.73,1,.59,10.93-4.82l.93,9.42a1.36,1.36,0,0,0,.85,1.18,1.43,1.43,0,0,0,.54.1,1.54,1.54,0,0,0,1-.41l2.39-2.18a1.52,1.52,0,0,0,.46-.83L25.2,15.9c3.57-2,6.95-3.88,9.36-5.25A2.43,2.43,0,0,0,35.77,8.16Zm-2.2.75c-2.5,1.42-6,3.41-9.76,5.47l-.41.23L21.07,27.28l-1.47,1.34L18.5,17.32,17.17,18C10,22,7.61,23.16,6.79,23.52l-4.3-3.41,5.08.22,18-13.06a2.51,2.51,0,0,1,2-.45l5.85,1.26a.43.43,0,0,1,.35.37A.42.42,0,0,1,33.57,8.91Z"/><path d="M7,12.54l3.56,1,1.64-1.19-4-1.16L10,10.09l5.47-.16,2.3-1.67L10,8.5a1.25,1.25,0,0,0-.7.17L6.67,10.2A1.28,1.28,0,0,0,7,12.54Z"/></svg>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })

  L.marker(midpoint, { icon: planeIcon }).addTo(map)

  map.fitBounds(L.latLngBounds(points), {
    padding: [40, 40],
    maxZoom: 7,
  })
})
</script>

<style>
@import 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
</style>
