<template>
  <div ref="mapContainer" class="h-80 md:h-96 rounded-xl overflow-hidden"></div>
</template>

<script setup lang="ts">
import type { AdsbAircraft } from '~/types/adsb'
import type { Map } from 'leaflet'

const props = defineProps<{
  aircraft: AdsbAircraft
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
let map: Map | null = null

onMounted(async () => {
  if (typeof props.aircraft.lat !== 'number' || typeof props.aircraft.lon !== 'number') return

  const L = (await import('leaflet')).default

  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  if (!mapContainer.value) return

  const position: [number, number] = [props.aircraft.lat, props.aircraft.lon]

  map = L.map(mapContainer.value, {
    center: position,
    zoom: 7,
    zoomControl: true,
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18,
  }).addTo(map)

  const heading = typeof props.aircraft.track === 'number' ? props.aircraft.track : 0
  const planeIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${heading}deg); filter: drop-shadow(0 0 8px #fbbf24)"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })

  L.marker(position, { icon: planeIcon }).addTo(map)
    .bindPopup(`
      <div style="font-size:12px">
        <strong>${props.aircraft.flight?.trim() || 'Aircraft'}</strong><br/>
        ${props.aircraft.r ? `Reg: ${props.aircraft.r}<br/>` : ''}
        ${props.aircraft.t ? `Type: ${props.aircraft.t}<br/>` : ''}
        ${typeof props.aircraft.alt_baro === 'number' ? `Alt: ${props.aircraft.alt_baro.toLocaleString()} ft<br/>` : ''}
        ${typeof props.aircraft.gs === 'number' ? `Speed: ${Math.round(props.aircraft.gs)} kt<br/>` : ''}
        ${typeof props.aircraft.track === 'number' ? `Track: ${Math.round(props.aircraft.track)}°` : ''}
      </div>
    `)
    .openPopup()

  L.circle(position, {
    radius: 35000,
    color: '#f59e0b',
    fillColor: '#f59e0b',
    fillOpacity: 0.06,
    weight: 1,
    dashArray: '4 8',
  }).addTo(map)
})
</script>

<style>
@import 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
</style>
