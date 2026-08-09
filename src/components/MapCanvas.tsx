'use client'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export type StopEntry = { coords: [number, number]; stop: { city: string; country: string; flag: string; done: boolean; active: boolean; date: string } }
export type CfgEntry  = { label: string; color: string; bg: string; light: string; dot: string }

export default function MapCanvas({ positions, cfg }: { positions: StopEntry[]; cfg: CfgEntry }) {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!divRef.current || positions.length < 2) return

    const map = L.map(divRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map)

    const latlngs = positions.map(({ coords }) => [coords[0], coords[1]] as [number, number])
    L.polyline(latlngs, {
      color: cfg.color,
      weight: 2.5,
      dashArray: '6 8',
      opacity: 0.8,
    }).addTo(map)

    positions.forEach(({ coords, stop }) => {
      const isActive = stop.active
      const isDone = stop.done
      const color = isDone || isActive ? cfg.color : '#94a3b8'
      const size = isActive ? 14 : 9

      const icon = L.divIcon({
        className: '',
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.25);${isActive ? `box-shadow:0 0 0 4px ${color}33,0 1px 6px rgba(0,0,0,0.25)` : ''}"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      const popup = L.popup({ closeButton: false, offset: [0, -6] }).setContent(
        `<div style="font-family:system-ui,sans-serif;min-width:130px;padding:2px 0">
          <p style="font-weight:700;font-size:13px;margin:0">${stop.flag} ${stop.city}</p>
          <p style="color:#64748b;font-size:11px;margin:4px 0 0">${stop.country} · ${stop.date}</p>
          ${isActive ? `<p style="color:${cfg.color};font-weight:700;font-size:11px;margin:6px 0 0">● Current location</p>` : ''}
          ${isDone && !isActive ? `<p style="color:#16a34a;font-size:11px;margin:6px 0 0">✓ Checkpoint passed</p>` : ''}
        </div>`
      )

      L.marker([coords[0], coords[1]], { icon }).addTo(map).bindPopup(popup)
    })

    const group = L.featureGroup(positions.map(({ coords }) => L.marker([coords[0], coords[1]])))
    map.fitBounds(group.getBounds().pad(0.3))

    return () => { map.remove() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={divRef} style={{ height: '100%', width: '100%' }} />
}
