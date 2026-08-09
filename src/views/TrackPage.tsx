'use client'
import PageMeta from '../components/PageMeta'
import { useState, useEffect, useRef, useMemo } from 'react'
import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import dynamic from 'next/dynamic'
import { api, BASE } from '../lib/api'
import type { PublicShipment } from '../lib/api'
import { getCityCoords } from '../data/cityCoords'
import type { StopEntry, CfgEntry } from '../components/MapCanvas'

/* ─── Types ────────────────────────────────────────────────── */
type ShipStatus =
  | 'pending' | 'confirmed' | 'picked_up'
  | 'in_transit' | 'out_for_delivery' | 'delivered'
  | 'failed' | 'cancelled' | 'returned'
type Tab = 'overview' | 'timeline' | 'details'
type TrackStatus = 'idle' | 'loading' | 'found' | 'notfound'

/* ─── Status config ─────────────────────────────────────────── */
const STATUS_CFG: Record<ShipStatus, { label: string; color: string; bg: string; light: string; dot: string }> = {
  pending:          { label: 'Pending',            color: '#64748b', bg: 'linear-gradient(135deg,#475569,#64748b)', light: '#f8fafc', dot: '#64748b' },
  confirmed:        { label: 'Confirmed',          color: '#7c3aed', bg: 'linear-gradient(135deg,#6d28d9,#8b5cf6)', light: '#f5f3ff', dot: '#7c3aed' },
  picked_up:        { label: 'Picked Up',          color: '#0891b2', bg: 'linear-gradient(135deg,#0e7490,#0891b2)', light: '#ecfeff', dot: '#0891b2' },
  in_transit:       { label: 'In Transit',         color: '#2563eb', bg: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', light: '#eff6ff', dot: '#2563eb' },
  out_for_delivery: { label: 'Out for Delivery',   color: '#1565C0', bg: 'linear-gradient(135deg,#1565C0,#ef4444)', light: '#fff5f5', dot: '#1565C0' },
  delivered:        { label: 'Delivered',          color: '#16a34a', bg: 'linear-gradient(135deg,#15803d,#22c55e)', light: '#f0fdf4', dot: '#16a34a' },
  failed:           { label: 'Failed',             color: '#dc2626', bg: 'linear-gradient(135deg,#b91c1c,#dc2626)', light: '#fef2f2', dot: '#ef4444' },
  cancelled:        { label: 'Cancelled',          color: '#64748b', bg: 'linear-gradient(135deg,#475569,#64748b)', light: '#f8fafc', dot: '#94a3b8' },
  returned:         { label: 'Returned',           color: '#b45309', bg: 'linear-gradient(135deg,#b45309,#d97706)', light: '#fffbeb', dot: '#f59e0b' },
}

/* ─── Event icon by type ────────────────────────────────────── */
const EVT_ICONS: Record<string, JSX.Element> = {
  pickup:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7"/></svg>,
  sort:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/></svg>,
  flight:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
  customs:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  truck:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1V8h3l3 3v4l1 1h-1m-6 0h-3"/></svg>,
  delivered:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>,
}

/* City coordinates lookup moved to ../data/cityCoords (shared with admin) */

const MapCanvas = dynamic(() => import('../components/MapCanvas'), { ssr: false })

/* ─── Leaflet map canvas ─────────────────────────────────────── */

/* ─── Shipment record type ──────────────────────────────────── */
type ShipRecord = {
  status: ShipStatus; trackingNum: string; service: string; weight: string; dimensions: string
  contents: string; value: string; insurance: string; pieces: number
  origin: { city: string; country: string; flag: string; date: string; hub: string }
  dest:   { city: string; country: string; flag: string; hub: string; recipient: string; address: string }
  eta: string; etaFull: string; progress: number
  route: { city: string; country: string; flag: string; done: boolean; active: boolean; date: string; coords?: [number, number] }[]
  events: { time: string; date: string; location: string; country: string; flag: string; desc: string; type: string; note?: string }[]
  alerts: { type: 'info' | 'warn' | 'success'; text: string }[]
}

/* ─── Route Visualizer ───────────────────────────────────────── */
function RouteVisualizer({ ship }: { ship: ShipRecord }) {
  const [progress, setProgress] = useState(0)
  const cfg = STATUS_CFG[ship.status]

  useEffect(() => {
    const t = setTimeout(() => {
      let p = 0
      const interval = setInterval(() => {
        p += 2
        setProgress(Math.min(p, ship.progress))
        if (p >= ship.progress) clearInterval(interval)
      }, 20)
      return () => clearInterval(interval)
    }, 300)
    return () => clearTimeout(t)
  }, [ship.progress])

  const positions = useMemo<StopEntry[]>(
    () =>
      ship.route
        .map(stop => {
          const coords = stop.coords ?? getCityCoords(stop.city)
          return coords ? { coords, stop } : null
        })
        .filter((x): x is StopEntry => x !== null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ship.trackingNum],
  )

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-black text-slate-800 text-lg">Shipment Route</h3>
        <span className="text-sm text-slate-400">
          {ship.route.filter(r => r.done).length} of {ship.route.length} checkpoints reached
        </span>
      </div>

      <div className="h-72">
        {positions.length >= 2 ? (
          <MapCanvas key={ship.trackingNum} positions={positions} cfg={cfg} />
        ) : (
          <div className="h-full bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
            Route map unavailable for this shipment
          </div>
        )}
      </div>

      <div className="px-7 py-4 border-t border-slate-100">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>{ship.origin.city}, {ship.origin.country}</span>
          <span className="font-semibold" style={{ color: cfg.color }}>{progress.toFixed(0)}% complete</span>
          <span>{ship.dest.city}, {ship.dest.country}</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, background: cfg.bg }}
          />
        </div>
      </div>
    </div>
  )
}

/* ─── Timeline ──────────────────────────────────────────────── */
function Timeline({ ship }: { ship: ShipRecord }) {
  const cfg = STATUS_CFG[ship.status]
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-black text-slate-800 text-lg">Full Event History</h3>
        <span className="text-sm text-slate-400">{ship.events.length} events recorded</span>
      </div>
      <div className="px-7 py-6 space-y-0">
        {ship.events.map((ev, i) => (
          <div key={i} className="flex gap-5">
            {/* Left: dot + line */}
            <div className="flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2"
                style={i === 0
                  ? { background: cfg.bg, color: 'white', borderColor: cfg.color }
                  : { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }}
              >
                {EVT_ICONS[ev.type] || EVT_ICONS.sort}
              </div>
              {i < ship.events.length - 1 && (
                <div className="w-0.5 flex-1 mt-2 mb-1" style={{ background: i === 0 ? `${cfg.color}40` : '#e2e8f0' }} />
              )}
            </div>

            {/* Right: info */}
            <div className={`pb-6 flex-1 ${i === 0 ? '' : 'opacity-80'}`}>
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-800 text-sm">{ev.location}</span>
                    {i === 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ background: cfg.color }}>
                        Latest Update
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{ev.country}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-600">{ev.time}</p>
                  <p className="text-xs text-slate-400">{ev.date}</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{ev.desc}</p>
              {ev.note && (
                <div className="mt-2 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                  <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>
                  <span>{ev.note}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Package Details Panel ─────────────────────────────────── */
function PackageDetails({ ship }: { ship: ShipRecord }) {
  return (
    <div className="space-y-5">
      {/* Shipment summary */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-7 py-5 border-b border-slate-100">
          <h3 className="font-black text-slate-800 text-lg">Shipment Details</h3>
        </div>
        <div className="p-7 grid md:grid-cols-2 gap-6">
          {[
            { icon: <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>, label: 'Service Type', val: ship.service },
            { icon: <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 3v18m-4.5-4.5h9M6 3h12"/></svg>, label: 'Total Weight', val: ship.weight },
            { icon: <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>, label: 'Dimensions', val: ship.dimensions },
            { icon: <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"/></svg>, label: 'Number of Pieces', val: `${ship.pieces} piece${ship.pieces > 1 ? 's' : ''}` },
            { icon: <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/><path d="M6 6h.008v.008H6V6z"/></svg>, label: 'Contents', val: ship.contents },
            { icon: <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, label: 'Declared Value', val: ship.value },
            { icon: <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>, label: 'Insurance', val: ship.insurance },
            { icon: <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"/></svg>, label: 'Reference', val: ship.trackingNum },
          ].map(row => (
            <div key={row.label} className="flex items-start gap-3">
              <span className="mt-0.5">{row.icon}</span>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-0.5">{row.label}</p>
                <p className="text-slate-800 font-semibold text-sm">{row.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Origin & Destination */}
      <div className="grid md:grid-cols-2 gap-5">
        {[
          { title: 'Origin', icon: <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>, data: ship.origin, isOrigin: true },
          { title: 'Destination', icon: <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>, data: ship.dest, isOrigin: false },
        ].map(side => (
          <div key={side.title} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span>{side.icon}</span>
              <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{side.title}</h4>
            </div>
            <p className="font-black text-slate-800 text-lg">{side.data.city}, {side.data.country}</p>
            {'hub' in side.data && <p className="text-slate-500 text-sm mt-1">{side.data.hub}</p>}
            {'date' in side.data && <p className="text-slate-400 text-xs mt-2">Shipped: {(side.data as typeof ship.origin).date}</p>}
            {'recipient' in side.data && (
              <>
                <p className="text-slate-500 text-sm mt-2 flex items-center gap-1.5"><svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/><path d="M4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>{(side.data as typeof ship.dest).recipient}</p>
                <p className="text-slate-400 text-xs mt-1">{(side.data as typeof ship.dest).address}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Documents */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h4 className="font-bold text-slate-800 mb-4">Shipping Documents</h4>
        <div className="grid md:grid-cols-3 gap-3">
          {([
            { label: 'Air Waybill (AWB)',   path: 'awb' },
            { label: 'Commercial Invoice',  path: 'invoice' },
            { label: 'Packing List',        path: 'packing-list' },
          ] as const).map(({ label, path }) => (
            <a
              key={path}
              href={`${BASE}/api/documents/${ship.trackingNum}/${path}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group text-left"
            >
              <svg className="w-8 h-8 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8" fill="none" stroke="white" strokeWidth="1.5"/>
              </svg>
              <div>
                <p className="text-slate-800 text-xs font-semibold">{label}</p>
                <p className="text-slate-400 text-[10px]">PDF · Download</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}


/* ─── Overview Tab ──────────────────────────────────────────── */
function OverviewTab({ ship }: { ship: ShipRecord }) {
  const cfg = STATUS_CFG[ship.status]
  const steps = ['Order Placed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered']
  const stepIndex = ({
    pending: 0, confirmed: 0, cancelled: 0,
    picked_up: 1, failed: 1,
    in_transit: 2,
    out_for_delivery: 3,
    delivered: 4, returned: 4,
  } as Record<string, number>)[ship.status] ?? 2

  return (
    <div className="space-y-5">
      {/* Alerts */}
      {ship.alerts.map((alert, i) => (
        <div key={i} className={`rounded-2xl px-5 py-4 border flex items-start gap-3 ${
          alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800'
          : alert.type === 'warn'  ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
          : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          <span className="text-sm font-medium">{alert.text}</span>
        </div>
      ))}

      {/* Step progress */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7">
        <h3 className="font-black text-slate-800 text-lg mb-6">Delivery Progress</h3>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 rounded-full" />
          <div className="absolute top-4 left-4 h-1 bg-blue-200 rounded-full transition-all duration-1000"
            style={{ width: `${(stepIndex / (steps.length - 1)) * (100)}%`, background: cfg.bg }} />

          <div className="relative flex justify-between">
            {steps.map((step, i) => {
              const done = i < stepIndex
              const active = i === stepIndex
              return (
                <div key={step} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 z-10"
                    style={{
                      background: done || active ? cfg.bg : 'white',
                      borderColor: done || active ? cfg.color : '#e2e8f0',
                      color: done || active ? 'white' : '#94a3b8',
                      boxShadow: active ? `0 0 0 4px ${cfg.color}25` : undefined,
                    }}
                  >
                    {done ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}><path d="M4.5 12.75l6 6 9-13.5"/></svg> : i + 1}
                  </div>
                  <span className="text-[10px] text-center leading-tight font-medium"
                    style={{ color: done || active ? cfg.color : '#94a3b8' }}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick info grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>, label: 'Shipped', val: ship.origin.date },
          { icon: <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>, label: ship.status === 'delivered' ? 'Delivered' : 'Est. Delivery', val: ship.eta },
          { icon: <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>, label: 'Service', val: ship.service },
          { icon: <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 3v18m-4.5-4.5h9M6 3h12"/></svg>, label: 'Weight', val: `${ship.weight} · ${ship.pieces} pc${ship.pieces > 1 ? 's' : ''}` },
        ].map(info => (
          <div key={info.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="mb-2">{info.icon}</div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">{info.label}</p>
            <p className="font-bold text-slate-800 text-sm">{info.val}</p>
          </div>
        ))}
      </div>

      {/* Latest event */}
      {ship.events.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-800 text-lg">Latest Update</h3>
            <span className="text-xs text-slate-400">{ship.events[0].time} · {ship.events[0].date}</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white"
              style={{ background: cfg.bg }}>
              {EVT_ICONS[ship.events[0].type] || EVT_ICONS.sort}
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-1">
                {ship.events[0].location}{ship.events[0].country ? `, ${ship.events[0].country}` : ''}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">{ship.events[0].desc}</p>
              {ship.events[0].note && (
                <p className="text-slate-400 text-xs mt-2 italic">{ship.events[0].note}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Route visualizer */}
      <RouteVisualizer ship={ship} />
    </div>
  )
}

/* ─── Convert public API response to TrackPage format ──────── */


const PROGRESS_MAP: Record<string, number> = {
  pending: 5, confirmed: 15, picked_up: 25,
  in_transit: 55, out_for_delivery: 80, delivered: 100,
  failed: 0, cancelled: 0, returned: 100,
}

function fmtDate(iso?: string, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', opts ?? { month: 'short', day: 'numeric', year: 'numeric' })
}

function apiToShipRecord(a: PublicShipment): ShipRecord {
  const status = a.status as ShipStatus
  const delivered = a.status === 'delivered'
  const etaStr = a.status === 'delivered' && a.deliveredAt
    ? `Delivered ${fmtDate(a.deliveredAt)}`
    : a.eta ? fmtDate(a.eta, { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBD'
  const etaFull = a.status === 'delivered' && a.deliveredAt
    ? `Delivered ${fmtDate(a.deliveredAt, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`
    : a.eta ? `Estimated ${fmtDate(a.eta, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}` : 'ETA not set'
  const createdDate = fmtDate(a.createdAt)
  const senderCity = a.sender.city || '—'
  const senderCountry = a.sender.country || '—'
  const recipientCity = a.recipient.city || '—'
  const recipientCountry = a.recipient.country || '—'

  // Build intermediate waypoints from the actual timeline — events come back
  // newest-first from the API, so reverse for chronological order. Prefer the
  // event's own stored coordinates over fuzzy city-name matching.
  const chronological = [...a.events].reverse()
  const waypoints = chronological
    .map(e => {
      const coords: [number, number] | null =
        (typeof e.lat === 'number' && typeof e.lng === 'number') ? [e.lat, e.lng] : getCityCoords(e.location || '')
      return coords && e.location ? { city: e.location, coords } : null
    })
    .filter((x): x is { city: string; coords: [number, number] } => x !== null)
    .filter(wp => wp.city.toLowerCase() !== senderCity.toLowerCase() && wp.city.toLowerCase() !== recipientCity.toLowerCase())
    .filter((wp, i, arr) => i === 0 || wp.city !== arr[i - 1].city)

  const route: ShipRecord['route'] = [
    { city: senderCity, country: senderCountry, flag: '', done: true, active: false, date: createdDate, coords: getCityCoords(senderCity) ?? undefined },
    ...waypoints.map((wp, i) => ({
      city: wp.city, country: '', flag: '', date: '',
      done: true,
      active: i === waypoints.length - 1 && !delivered,
      coords: wp.coords,
    })),
    {
      city: recipientCity, country: recipientCountry, flag: '', date: etaStr,
      done: delivered,
      active: waypoints.length === 0 && !delivered,
      coords: getCityCoords(recipientCity) ?? undefined,
    },
  ]

  return {
    status,
    trackingNum: a.trackingNumber,
    service: a.service,
    weight: `${a.weight} kg`,
    dimensions: '—', contents: '—', value: '—',
    insurance: 'Standard coverage', pieces: 1,
    origin: { city: senderCity, country: senderCountry, flag: '', date: createdDate, hub: `Accessiblexpress ${senderCity} Hub` },
    dest: {
      city: recipientCity, country: recipientCountry, flag: '',
      hub: `Accessiblexpress ${recipientCity} Delivery Centre`,
      recipient: a.recipient.name,
      address: `${recipientCity}, ${recipientCountry}`,
    },
    eta: etaStr,
    etaFull,
    progress: PROGRESS_MAP[a.status] ?? 30,
    route,
    events: a.events.map(e => ({ time: e.time || '', date: e.date || '', location: e.location || '', country: '', flag: '', desc: e.desc, type: e.type || 'info' })),
    alerts: [],
  }
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function TrackPage({ initialQ }: { initialQ?: string }) {
  const [input, setInput] = useState(() => initialQ ?? '')
  const [trackStatus, setTrackStatus] = useState<TrackStatus>('idle')
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [foundShip, setFoundShip] = useState<ShipRecord | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const ship = trackStatus === 'found' ? foundShip : null
  const cfg = ship ? STATUS_CFG[ship.status] : null

  const track = async () => {
    if (!input.trim()) return
    const key = input.trim().toUpperCase()
    setTrackStatus('loading')
    setActiveTab('overview')

    try {
      const data = await api.track(key)
      const ship = apiToShipRecord(data)
      setFoundShip(ship)
      setTrackStatus('found')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    } catch {
      setFoundShip(null)
      setTrackStatus('notfound')
    }
  }

  useEffect(() => {
    const q = initialQ
    if (q) track()
  }, [initialQ])

  const TABS: { key: Tab; label: string; icon: JSX.Element }[] = [
    { key: 'overview',      label: 'Overview',        icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg> },
    { key: 'timeline',      label: 'Full Timeline',   icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    { key: 'details',       label: 'Package Details', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg> },
  ]

  return (
    <div className="pt-20 min-h-screen" style={{ background: '#f0f4f8' }}>
      <PageMeta title="Track Your Shipment" description="Enter your Accessiblexpress tracking number for live updates on location, transit status, and estimated delivery." />
      {/* ── Header ─────────────────────────────────── */}
      <div className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #071426 0%, #0f2444 60%, #163166 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.3), transparent 70%)' }} />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15), transparent 70%)' }} />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-semibold"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}>
            <span className="w-2 h-2 rounded-full bg-green-400" style={{ animation: 'pulse 2s infinite' }} />
            Real-Time Tracking System
          </div>

          <h1 className="font-black text-white mb-3" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            Track Your Shipment
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', marginBottom: '36px' }}>
            Live GPS updates · Full event history · Delivery notifications
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3 p-2 rounded-2xl" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center gap-3 flex-1 px-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="rgba(255,255,255,0.5)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
                </svg>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && track()}
                  placeholder="Enter your tracking number"
                  className="flex-1 bg-transparent outline-none text-sm font-medium"
                  style={{ color: 'white' }}
                />
              </div>
              <button
                onClick={track}
                disabled={trackStatus === 'loading'}
                className="btn-primary py-3! px-7! text-sm! shrink-0"
              >
                {trackStatus === 'loading'
                  ? <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" style={{ animation: 'spin 1s linear infinite' }} />
                      Tracking…
                    </span>
                  : <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
                      </svg>
                      Track Package
                    </>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* ── Not Found ──────────────────────────────── */}
        {trackStatus === 'notfound' && (
          <div className="max-w-xl mx-auto text-center py-16 animate-fadeInUp">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-12 h-12 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"/></svg>
          </div>
            <h2 className="text-2xl font-black text-slate-800 mb-3">Tracking Number Not Found</h2>
            <p className="text-slate-500 mb-2">We couldn't find any shipment matching <strong className="text-slate-700 font-mono">{input}</strong>.</p>
            <p className="text-slate-400 text-sm mb-8">Double-check for typos, or contact support if you believe this is an error. Your tracking number can be found in your shipping confirmation email.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => { setTrackStatus('idle'); setInput('') }} className="btn-primary">Try Again</button>
              <Link to="/contact" className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-white transition-colors" style={{ textDecoration: 'none' }}>
                Contact Support
              </Link>
            </div>
          </div>
        )}

        {/* ── Result ─────────────────────────────────── */}
        {trackStatus === 'found' && ship && cfg && (
          <div ref={resultRef} className="max-w-5xl mx-auto animate-fadeInUp">
            {/* Status header card */}
            <div className="rounded-3xl overflow-hidden shadow-xl mb-6">
              <div className="px-8 py-7 grid md:grid-cols-3 gap-6 items-center" style={{ background: cfg.bg }}>
                {/* Status */}
                <div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Shipment Status</p>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                    </span>
                    <span className="text-white font-black text-2xl">{cfg.label}</span>
                  </div>
                  <p className="text-white/70 text-sm">{ship.etaFull}</p>
                </div>

                {/* Tracking number */}
                <div className="text-center">
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Tracking Number</p>
                  <p className="text-white font-black text-xl font-mono tracking-wider">{ship.trackingNum}</p>
                  <p className="text-white/60 text-sm mt-1">{ship.service}</p>
                </div>

                {/* Route */}
                <div className="text-right">
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Route</p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-white font-bold">{ship.origin.city}</span>
                    <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                    <span className="text-white font-bold">{ship.dest.city}</span>
                  </div>
                  <p className="text-white/60 text-sm mt-1">
                    {ship.pieces} piece{ship.pieces > 1 ? 's' : ''} · {ship.weight}
                  </p>
                </div>
              </div>

              {/* Mini progress strip */}
              <div className="bg-white px-8 py-4 flex items-center gap-4">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${ship.progress}%`, background: cfg.bg }} />
                </div>
                <span className="text-sm font-bold shrink-0" style={{ color: cfg.color }}>{ship.progress}% Complete</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0"
                  style={{
                    background: activeTab === tab.key ? cfg.bg : 'white',
                    color: activeTab === tab.key ? 'white' : '#64748b',
                    border: `2px solid ${activeTab === tab.key ? cfg.color : '#e2e8f0'}`,
                    boxShadow: activeTab === tab.key ? `0 4px 12px ${cfg.color}30` : '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="animate-fadeInUp" key={activeTab}>
              {activeTab === 'overview'      && <OverviewTab ship={ship} />}
              {activeTab === 'timeline'      && <Timeline ship={ship} />}
              {activeTab === 'details'       && <PackageDetails ship={ship} />}
            </div>
          </div>
        )}

        {/* ── Idle State ─────────────────────────────── */}
        {trackStatus === 'idle' && (
          <div className="max-w-5xl mx-auto">
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-5 mb-10">
              {[
                { icon: <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304-.001a3.75 3.75 0 010 5.304m-7.425 2.122a6.75 6.75 0 010-9.546m9.546-.001a6.75 6.75 0 010 9.547m-2.122-2.122a3.75 3.75 0 000-5.304M13.06 8.47l1.5-1.5m-8.12 8.12l1.5-1.5m5.12-5.12l-1.5 1.5m-2 2l-1.5 1.5M12 12h.008v.008H12V12z"/></svg>, title: 'Live GPS Tracking', desc: 'Every vehicle in our network is GPS-tracked. Watch your package move in real time, updated every 30 seconds.', color: 'bg-blue-50 border-blue-100' },
                { icon: <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>, title: 'Checkpoint History', desc: 'Full audit trail of every hub, airport, customs point, and vehicle your package has passed through.', color: 'bg-yellow-50 border-yellow-100' },
                { icon: <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>, title: 'Instant Notifications', desc: 'SMS and email alerts at every status change — so you never have to wonder where your package is.', color: 'bg-green-50 border-green-100' },
              ].map(f => (
                <div key={f.title} className={`rounded-2xl border p-6 ${f.color}`}>
                  <div className="mb-3">{f.icon}</div>
                  <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Image banner */}
            <div className="rounded-3xl overflow-hidden relative h-72 md:h-96 shadow-xl mb-10">
              <img src="https://images.pexels.com/photos/5025521/pexels-photo-5025521.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop" alt="Delivery" loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center" style={{ background: 'linear-gradient(to right, rgba(7,20,38,0.9) 40%, transparent)' }}>
                <div className="px-10 max-w-lg">
                  <h3 className="text-white font-black text-3xl md:text-4xl mb-3">See Exactly Where Your Package Is</h3>
                  <p className="text-white/70 text-lg leading-relaxed">From pickup to doorstep — every scan, every flight, every handoff. Completely transparent shipping.</p>
                </div>
              </div>
            </div>

            {/* Tracking explained */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h3 className="font-black text-slate-800 text-xl mb-6 text-center">What Your Tracking Results Include</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { icon: <svg className="w-7 h-7 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/></svg>, title: 'Route Visualizer', desc: 'Animated route showing every stop from origin to destination' },
                  { icon: <svg className="w-7 h-7 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, title: 'Full Timeline', desc: 'Timestamped event log with location, country, and detailed descriptions' },
                  { icon: <svg className="w-7 h-7 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>, title: 'Package Details', desc: 'Weight, dimensions, declared value, insurance, and shipping docs' },
                  { icon: <svg className="w-7 h-7 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>, title: 'Customs Status', desc: 'Real-time customs clearance updates for international shipments' },
                ].map(item => (
                  <div key={item.title} className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-center mb-3">{item.icon}</div>
                    <h4 className="font-bold text-slate-800 text-sm mb-2">{item.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
