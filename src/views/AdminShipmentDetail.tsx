'use client'
import { useState, useEffect, useRef } from 'react'
import type { JSX } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api, type AdminShipment, type ShipStatus, type ShipEvent } from '../lib/api'
import { geocodeLocation } from '../lib/geocode'
import GeoStatus from '../components/GeoStatus'

/* ─── Helpers ────────────────────────────────────────────────── */
const STATUS_CFG: Record<ShipStatus, { label: string; color: string; bg: string; grad: string }> = {
  pending:          { label: 'Pending',           color: '#64748b', bg: '#f1f5f9', grad: 'linear-gradient(135deg,#475569,#64748b)' },
  confirmed:        { label: 'Confirmed',          color: '#7c3aed', bg: '#f5f3ff', grad: 'linear-gradient(135deg,#6d28d9,#8b5cf6)' },
  picked_up:        { label: 'Picked Up',          color: '#0891b2', bg: '#ecfeff', grad: 'linear-gradient(135deg,#0e7490,#0891b2)' },
  in_transit:       { label: 'In Transit',         color: '#2563eb', bg: '#eff6ff', grad: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' },
  out_for_delivery: { label: 'Out for Delivery',   color: '#1565C0', bg: '#fff5f5', grad: 'linear-gradient(135deg,#1565C0,#ef4444)' },
  delivered:        { label: 'Delivered',           color: '#16a34a', bg: '#f0fdf4', grad: 'linear-gradient(135deg,#15803d,#22c55e)' },
  failed:           { label: 'Failed',              color: '#dc2626', bg: '#fef2f2', grad: 'linear-gradient(135deg,#b91c1c,#dc2626)' },
  cancelled:        { label: 'Cancelled',           color: '#94a3b8', bg: '#f8fafc', grad: 'linear-gradient(135deg,#475569,#64748b)' },
  returned:         { label: 'Returned',            color: '#b45309', bg: '#fffbeb', grad: 'linear-gradient(135deg,#b45309,#d97706)' },
}

function todayStr() { return new Date().toISOString().slice(0, 10) }
function nowTime()  { return new Date().toTimeString().slice(0, 5) }
function fmtDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function evtIcon(type: string): JSX.Element {
  const m: Record<string, JSX.Element> = {
    pickup:    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>,
    flight:    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>,
    sort:      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/></svg>,
    customs:   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>,
    truck:     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z"/><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1V8h3l3 3v4l1 1h-1m-6 0h-3"/></svg>,
    delivered: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M4.5 12.75l6 6 9-13.5"/></svg>,
    info:      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>,
  }
  return m[type] ?? m.sort
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm text-slate-800 font-medium">{value ?? '—'}</span>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function AdminShipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [ship, setShip]           = useState<AdminShipment | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  // Status update modal
  const [showUpdate, setShowUpdate]   = useState(false)
  const [newStatus, setNewStatus]     = useState<ShipStatus>('in_transit')
  const [eventNote, setEventNote]     = useState('')
  const [eventLoc, setEventLoc]       = useState('')
  const [updating, setUpdating]       = useState(false)
  const [updateErr, setUpdateErr]     = useState('')

  const [notifyBanner, setNotifyBanner] = useState<{ ok: boolean; text: string } | null>(null)

  // Add timeline event form
  const [addDesc, setAddDesc] = useState('')
  const [addLoc, setAddLoc] = useState('')
  const [addLat, setAddLat] = useState('')
  const [addLng, setAddLng] = useState('')
  const [addGeoStatus, setAddGeoStatus] = useState<'idle' | 'checking' | 'found' | 'notfound'>('idle')
  const [addDate, setAddDate] = useState(todayStr())
  const [addTime, setAddTime] = useState(nowTime())
  const [addType, setAddType] = useState<ShipEvent['type']>('info')
  const [addBusy, setAddBusy] = useState(false)
  const addGeoReq = useRef(0)

  const setAddLocation = (v: string) => {
    setAddLoc(v)
    setAddGeoStatus('idle')
    setAddLat('')
    setAddLng('')
  }

  const resolveAddLocation = async (value?: string) => {
    const v = (value ?? addLoc).trim()
    if (!v) { setAddGeoStatus('idle'); return }
    setAddGeoStatus('checking')
    const reqId = ++addGeoReq.current
    const result = await geocodeLocation(v)
    if (reqId !== addGeoReq.current) return
    if (result) {
      setAddLat(String(result.lat))
      setAddLng(String(result.lng))
      setAddGeoStatus('found')
    } else {
      setAddGeoStatus('notfound')
    }
  }

  // Edit timeline event state
  const [editId, setEditId] = useState<string | null>(null)
  const [editDesc, setEditDesc] = useState('')
  const [editLoc, setEditLoc] = useState('')
  const [editLat, setEditLat] = useState('')
  const [editLng, setEditLng] = useState('')
  const [editGeoStatus, setEditGeoStatus] = useState<'idle' | 'checking' | 'found' | 'notfound'>('idle')
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editType, setEditType] = useState<ShipEvent['type']>('info')
  const [editBusy, setEditBusy] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const editGeoReq = useRef(0)

  const setEditLocation = (v: string) => {
    setEditLoc(v)
    setEditGeoStatus('idle')
    setEditLat('')
    setEditLng('')
  }

  const resolveEditLocation = async () => {
    const v = editLoc.trim()
    if (!v) { setEditGeoStatus('idle'); return }
    setEditGeoStatus('checking')
    const reqId = ++editGeoReq.current
    const result = await geocodeLocation(v)
    if (reqId !== editGeoReq.current) return
    if (result) {
      setEditLat(String(result.lat))
      setEditLng(String(result.lng))
      setEditGeoStatus('found')
    } else {
      setEditGeoStatus('notfound')
    }
  }

  useEffect(() => {
    if (!id) return
    api.getShipment(id)
      .then(s => { setShip(s); setNewStatus(s.status) })
      .catch(() => setError('Shipment not found or you do not have access.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdateStatus = async () => {
    if (!ship) return
    setUpdating(true)
    setUpdateErr('')
    try {
      await api.updateShipment(ship.id, { status: newStatus })
      const desc = eventNote.trim() || `Status updated to: ${STATUS_CFG[newStatus].label}`
      const loc  = eventLoc.trim()  || 'Accessiblexpress Control Centre'
      const ev: Omit<ShipEvent, '_id'> = { time: nowTime(), date: todayStr(), location: loc, desc, type: 'info' }
      const updated = await api.addEvent(ship.id, ev)
      setShip(updated)
      setShowUpdate(false)
      setEventNote('')
      setEventLoc('')
    } catch (err) {
      setUpdateErr((err as Error).message || 'Update failed.')
    } finally {
      setUpdating(false)
    }
  }

  const handleAddEvent = async () => {
    if (!ship || !addDesc.trim()) return
    setAddBusy(true)
    try {
      const updated = await api.addEvent(ship.id, {
        desc: addDesc.trim(),
        location: addLoc.trim() || 'Accessiblexpress Control Centre',
        lat: addLat ? parseFloat(addLat) : undefined,
        lng: addLng ? parseFloat(addLng) : undefined,
        date: addDate, time: addTime, type: addType,
      })
      setShip(updated)
      if (addType === 'exception' || addType === 'transit') {
        if (updated.notifiedOnLastUpdate) {
          setNotifyBanner({ ok: true, text: `Customer notified by email at ${updated.recipient.email || '—'}` })
        } else if (updated.notifyErrorOnLastUpdate) {
          setNotifyBanner({ ok: false, text: `Event saved, but the notification email failed to send: ${updated.notifyErrorOnLastUpdate}` })
        } else if (!updated.recipient.email) {
          setNotifyBanner({ ok: false, text: 'No notification sent — recipient has no email on file' })
        }
        setTimeout(() => setNotifyBanner(null), 6000)
      }
      setAddDesc('')
      setAddLoc('')
      setAddLat('')
      setAddLng('')
      setAddDate(todayStr())
      setAddTime(nowTime())
      setAddType('info')
    } catch (err) {
      alert((err as Error).message || 'Failed to add event.')
    } finally {
      setAddBusy(false)
    }
  }

  const startEdit = (ev: ShipEvent) => {
    setEditId(ev._id ?? null)
    setEditDesc(ev.desc)
    setEditLoc(ev.location)
    setEditLat(ev.lat != null ? String(ev.lat) : '')
    setEditLng(ev.lng != null ? String(ev.lng) : '')
    setEditGeoStatus(ev.lat != null && ev.lng != null ? 'found' : 'idle')
    setEditDate(ev.date)
    setEditTime(ev.time)
    setEditType(ev.type)
  }

  const handleSaveEdit = async () => {
    if (!ship || !editId) return
    setEditBusy(true)
    try {
      const updated = await api.updateEvent(ship.id, editId, {
        desc: editDesc.trim(),
        location: editLoc.trim(),
        lat: editLat ? parseFloat(editLat) : undefined,
        lng: editLng ? parseFloat(editLng) : undefined,
        date: editDate, time: editTime, type: editType,
      })
      setShip(updated)
      setEditId(null)
    } catch (err) {
      alert((err as Error).message || 'Failed to update event.')
    } finally {
      setEditBusy(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!ship || !confirm('Delete this timeline event?')) return
    setDeletingId(eventId)
    try {
      const updated = await api.deleteEvent(ship.id, eventId)
      setShip(updated)
      if (editId === eventId) setEditId(null)
    } catch (err) {
      alert((err as Error).message || 'Failed to delete event.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDelete = async () => {
    if (!ship || !window.confirm(`Delete shipment ${ship.trackingNumber}? This cannot be undone.`)) return
    try {
      await api.deleteShipment(ship.id)
      navigate('/admin')
    } catch (err) {
      alert((err as Error).message || 'Delete failed.')
    }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <span className="w-9 h-9 border-4 border-slate-200 border-t-yellow-400 rounded-full animate-spin" />
      </div>
    )
  }

  /* ── Error ── */
  if (error || !ship) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
        </div>
        <p className="text-slate-700 font-semibold">{error || 'Shipment not found'}</p>
        <button onClick={() => navigate('/admin')} className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors">
          ← Back to Dashboard
        </button>
      </div>
    )
  }

  const cfg = STATUS_CFG[ship.status]
  const events = [...ship.events].reverse()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <div>
              <p className="text-xs text-slate-400 font-mono">{ship.id}</p>
              <p className="font-black text-slate-800 text-base leading-tight">{ship.trackingNumber}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />{cfg.label}
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setShowUpdate(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-85"
              style={{ background: '#FF9800', color: '#0f0900' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
              Update Status
            </button>
            <button onClick={handleDelete}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* ── Status strip ── */}
        <div className="rounded-2xl overflow-hidden">
          <div className="px-6 py-5 flex flex-wrap items-center gap-6" style={{ background: cfg.grad }}>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Current Status</p>
              <p className="text-white font-black text-2xl">{cfg.label}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Tracking Number</p>
              <p className="text-white font-black font-mono text-xl">{ship.trackingNumber}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Service</p>
              <p className="text-white font-bold capitalize">{ship.service}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                {ship.status === 'delivered' ? 'Delivered' : 'Expected ETA'}
              </p>
              <p className="text-white font-bold">{fmtDate(ship.status === 'delivered' ? ship.deliveredAt : ship.eta)}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Created</p>
              <p className="text-white font-bold">{fmtDate(ship.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Sender & Recipient */}
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { label: 'Sender', letter: 'S', letterBg: '#FF9800', letterColor: '#0f0900', party: ship.sender },
                { label: 'Recipient', letter: 'R', letterBg: '#1565C0', letterColor: 'white', party: ship.recipient },
              ].map(({ label, letter, letterBg, letterColor, party }) => (
                <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0"
                      style={{ background: letterBg, color: letterColor }}>{letter}</span>
                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">{label}</span>
                  </div>
                  <div className="space-y-3">
                    <InfoRow label="Full Name"     value={party.name} />
                    <InfoRow label="Phone"         value={party.phone} />
                    <InfoRow label="Email"         value={party.email} />
                    <InfoRow label="Street"        value={party.street} />
                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow label="City"        value={party.city} />
                      <InfoRow label="State"       value={party.state} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow label="Country"     value={party.country} />
                      <InfoRow label="Postal Code" value={party.postalCode} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Package details */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>
                Package Details
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoRow label="Contents"       value={ship.contents} />
                <InfoRow label="Weight"         value={ship.weight ? `${ship.weight} kg` : undefined} />
                <InfoRow label="Declared Value" value={ship.declaredValue ? `$${ship.declaredValue}` : undefined} />
                <InfoRow label="Dimensions"
                  value={
                    ship.dimensions?.length
                      ? `${ship.dimensions.length} × ${ship.dimensions.width} × ${ship.dimensions.height} cm`
                      : undefined
                  }
                />
                <InfoRow label="Price"          value={ship.price ? `$${ship.price}` : undefined} />
              </div>
              {ship.notes && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Notes</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{ship.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right column: Timeline ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Event Timeline</h3>
              <span className="text-xs text-slate-400">{ship.events.length} event{ship.events.length !== 1 ? 's' : ''}</span>
            </div>

            {notifyBanner && (
              <div className={`m-4 mb-0 rounded-xl p-3 text-xs flex items-center gap-2 border ${notifyBanner.ok ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {notifyBanner.text}
              </div>
            )}

            {events.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-12 text-slate-400 text-sm">No events yet</div>
            ) : (
              <div className="p-5 space-y-0 overflow-y-auto flex-1">
                {events.map((ev, i) => (
                  <div key={ev._id ?? i}>
                    {editId === ev._id ? (
                      /* ── Inline edit form ── */
                      <div className="border border-yellow-300 rounded-2xl p-4 bg-yellow-50 mb-3">
                        <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-3">Edit Event</p>
                        <div className="grid sm:grid-cols-2 gap-3 mb-3">
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Description</label>
                            <input value={editDesc} onChange={e => setEditDesc(e.target.value)}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-400" />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Location</label>
                            <input value={editLoc} onChange={e => setEditLocation(e.target.value)} onBlur={resolveEditLocation}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-400" />
                            <GeoStatus status={editGeoStatus} />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Type</label>
                            <select value={editType} onChange={e => setEditType(e.target.value as ShipEvent['type'])}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-400 bg-white">
                              {(['pickup','transit','delivery','exception','info'] as const).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Date</label>
                            <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-400" />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Time</label>
                            <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-400" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleSaveEdit} disabled={editBusy}
                            className="py-2 px-5 rounded-xl text-xs font-bold disabled:opacity-60 transition-all hover:opacity-90"
                            style={{ background: '#FF9800', color: '#0f0900' }}>
                            {editBusy ? 'Saving…' : 'Save'}
                          </button>
                          <button onClick={() => setEditId(null)}
                            className="px-5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3 group">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 mt-0.5"
                            style={i === 0
                              ? { background: cfg.grad, color: 'white', borderColor: cfg.color }
                              : { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }}
                          >
                            {evtIcon(ev.type)}
                          </div>
                          {i < events.length - 1 && (
                            <div className="w-px flex-1 mt-2 mb-1 min-h-[12px]" style={{ background: i === 0 ? `${cfg.color}40` : '#e2e8f0' }} />
                          )}
                        </div>
                        <div className={`pb-5 flex-1 flex items-start justify-between gap-2 ${i > 0 ? 'opacity-75' : ''}`}>
                          <div>
                            <div className="flex items-start gap-2 flex-wrap mb-0.5">
                              <p className="text-slate-800 text-xs font-bold leading-snug">{ev.location || '—'}</p>
                              {i === 0 && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white shrink-0" style={{ background: cfg.color }}>Latest</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mb-1">{ev.date} {ev.time}</p>
                            <p className="text-slate-600 text-xs leading-relaxed">{ev.desc}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button onClick={() => startEdit(ev)} title="Edit event"
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/></svg>
                            </button>
                            <button onClick={() => ev._id && handleDeleteEvent(ev._id)} disabled={deletingId === ev._id} title="Delete event"
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Add Timeline Event ── */}
            <div className="p-5 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
                Add Timeline Event
              </p>

              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Quick Templates</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {([
                  { label: 'Order Received',    desc: 'Shipment order received and confirmed.',                        loc: 'Accessiblexpress Control Centre', type: 'info'      as const },
                  { label: 'Picked Up',         desc: 'Package collected from sender.',                               loc: 'Sender Location',                 type: 'pickup'    as const },
                  { label: 'At Sorting Hub',    desc: 'Package arrived at sorting facility and is being processed.',  loc: 'Sorting Hub',                     type: 'transit'   as const },
                  { label: 'Departed Origin',   desc: 'Package has departed the origin facility.',                    loc: 'Origin Facility',                 type: 'transit'   as const },
                  { label: 'In Transit',        desc: 'Package is in transit to the destination.',                    loc: 'In Transit',                      type: 'transit'   as const },
                  { label: 'Arrived at Hub',    desc: 'Package arrived at destination hub.',                          loc: 'Destination Hub',                 type: 'transit'   as const },
                  { label: 'Customs Clearance', desc: 'Package cleared customs inspection.',                          loc: 'Customs',                         type: 'transit'   as const },
                  { label: 'Out for Delivery',  desc: 'Package is out for delivery with the courier.',                loc: 'Local Delivery Hub',              type: 'delivery'  as const },
                  { label: 'Delivered',         desc: 'Package successfully delivered to the recipient.',             loc: 'Recipient Address',               type: 'delivery'  as const },
                  { label: 'Failed Attempt',    desc: 'Delivery attempt failed — recipient unavailable.',             loc: 'Recipient Address',               type: 'exception' as const },
                  { label: 'Delay',             desc: 'Shipment delayed due to unforeseen circumstances.',            loc: 'In Transit',                      type: 'exception' as const },
                  { label: 'Held at Customs',   desc: 'Package held at customs pending clearance.',                   loc: 'Customs',                         type: 'exception' as const },
                ] as { label: string; desc: string; loc: string; type: ShipEvent['type'] }[]).map(t => (
                  <button key={t.label}
                    onClick={() => { setAddDesc(t.desc); setAddLocation(t.loc); setAddType(t.type); resolveAddLocation(t.loc) }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-800 transition-all">
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Description *</label>
                  <input value={addDesc} onChange={e => setAddDesc(e.target.value)}
                    placeholder="e.g. Package arrived at sorting facility"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-400" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Location</label>
                  <input value={addLoc} onChange={e => setAddLocation(e.target.value)} onBlur={() => resolveAddLocation()}
                    placeholder="e.g. Dubai Cargo Hub"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-400" />
                  <GeoStatus status={addGeoStatus} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Type</label>
                  <select value={addType} onChange={e => setAddType(e.target.value as ShipEvent['type'])}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-400 bg-white">
                    {(['pickup','transit','delivery','exception','info'] as const).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Date</label>
                  <input type="date" value={addDate} onChange={e => setAddDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-400" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Time</label>
                  <input type="time" value={addTime} onChange={e => setAddTime(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-400" />
                </div>
              </div>
              <button onClick={handleAddEvent} disabled={addBusy || !addDesc.trim()}
                className="py-2.5 px-6 rounded-xl text-sm font-bold disabled:opacity-60 transition-all hover:opacity-90"
                style={{ background: '#FF9800', color: '#0f0900' }}>
                {addBusy ? 'Adding…' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Update Status Modal ── */}
      {showUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUpdate(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-black text-slate-800 text-lg mb-1">Update Status</h3>
            <p className="text-slate-500 text-sm mb-5 font-mono">{ship.trackingNumber}</p>

            {updateErr && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 text-red-600 border border-red-100">{updateErr}</div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">New Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as ShipStatus)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 bg-white">
                  {Object.entries(STATUS_CFG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Location <span className="normal-case font-normal">(optional)</span></label>
                <input type="text" value={eventLoc} onChange={e => setEventLoc(e.target.value)}
                  placeholder="e.g. Dubai Sorting Hub"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Event Note <span className="normal-case font-normal">(optional)</span></label>
                <input type="text" value={eventNote} onChange={e => setEventNote(e.target.value)}
                  placeholder="e.g. Package cleared customs"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setShowUpdate(false); setUpdateErr('') }}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleUpdateStatus} disabled={updating}
                  className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: '#FF9800', color: '#0f0900' }}>
                  {updating
                    ? <><span className="w-4 h-4 border-2 rounded-full inline-block" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#0f0900', animation: 'spin 1s linear infinite' }} />Saving…</>
                    : 'Save Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
