import { getCityCoords } from '../data/cityCoords'
import { api } from './api'

export interface GeoResult {
  lat: number
  lng: number
  source: 'local' | 'remote'
}

const cache = new Map<string, GeoResult | null>()

// Resolves free-text location input to coordinates so admins never have to
// know or look up a lat/lng themselves: checks the local city dictionary
// first (instant, no network), then falls back to the backend's geocode
// proxy for anything not in that list. The lookup must go through our own
// backend rather than calling Nominatim directly — Nominatim doesn't send
// CORS headers, so a browser fetch to it is blocked outright.
export async function geocodeLocation(query: string): Promise<GeoResult | null> {
  const q = query.trim()
  if (!q) return null

  const local = getCityCoords(q)
  if (local) return { lat: local[0], lng: local[1], source: 'local' }

  const key = q.toLowerCase()
  if (cache.has(key)) return cache.get(key)!

  try {
    const match = await api.geocode(q)
    const result: GeoResult | null = match ? { lat: match.lat, lng: match.lng, source: 'remote' } : null
    cache.set(key, result)
    return result
  } catch {
    return null
  }
}
