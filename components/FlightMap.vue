<template>
  <div ref="mapContainer" class="h-80 md:h-96 rounded-xl overflow-hidden"></div>
</template>

<script setup lang="ts">
import type { LiveTracking, AirportInfo } from '~/types/flight'
import type { Map, Marker } from 'leaflet'

const props = defineProps<{
  live: LiveTracking
  departure: AirportInfo
  arrival: AirportInfo
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
let map: Map | null = null

onMounted(async () => {
  // Dynamic import Leaflet (it needs `window`)
  const L = (await import('leaflet')).default

  // Fix default marker icon paths
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  if (!mapContainer.value) return

  map = L.map(mapContainer.value, {
    center: [props.live.latitude, props.live.longitude],
    zoom: 5,
    zoomControl: true,
  })

  // Dark map tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18,
  }).addTo(map)

  // Plane icon (current position)
  const planeIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${props.live.direction}deg)"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })

  L.marker([props.live.latitude, props.live.longitude], { icon: planeIcon }).addTo(map)
    .bindPopup(`
      <div style="font-size:12px">
        <strong>Live Position</strong><br/>
        Alt: ${Math.round(props.live.altitude * 3.28084)} ft<br/>
        Speed: ${Math.round(props.live.speed_horizontal * 1.94384)} kts<br/>
        Heading: ${Math.round(props.live.direction)}°
      </div>
    `)

  // Flight path line
  const depCoords: [number, number] = [props.departure.airport ? 0 : 0, 0] // We only have airport names, not coords
  // Draw route from live position as a simple visualization
  // Origin → plane → destination path
  const routeLine: [number, number][] = [
    [props.live.latitude, props.live.longitude],
  ]

  // Simple dashed circle for current position radius
  L.circle([props.live.latitude, props.live.longitude], {
    radius: 50000,
    color: '#06b6d4',
    fillColor: '#06b6d4',
    fillOpacity: 0.05,
    weight: 1,
    dashArray: '4 8',
  }).addTo(map)

  // Fit to live position
  map.setView([props.live.latitude, props.live.longitude], 5)
})
</script>

<style>
@import 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
</style>
