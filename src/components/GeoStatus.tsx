'use client'
export type GeoStatusValue = 'idle' | 'checking' | 'found' | 'notfound'

export default function GeoStatus({ status }: { status: GeoStatusValue }) {
  if (status === 'checking') return <p className="text-[10px] text-slate-400 mt-1">🔎 Looking up coordinates…</p>
  if (status === 'found') return <p className="text-[10px] text-green-600 mt-1">📍 Coordinates found</p>
  if (status === 'notfound') return <p className="text-[10px] text-amber-600 mt-1">⚠ Couldn't find this location — event will save without a map pin</p>
  return null
}
