'use client'
import { useState, useEffect, useRef } from 'react'
import type { JSX } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api, clearToken, type AdminShipment, type ShipStatus, type ShipEvent, type Subscriber } from '../lib/api'
import { geocodeLocation } from '../lib/geocode'
import AdminTour, { type TourStep } from '../components/AdminTour'
import GeoStatus from '../components/GeoStatus'

const TOUR_SEEN_KEY = 'qsd_admin_tour_seen'

const TOUR_STEPS: TourStep[] = [
  { tab: 'overview', target: '[data-tour="sidebar-nav"]', title: 'Welcome to your Admin Dashboard', body: 'This sidebar takes you everywhere — Overview, Shipments, Create, Track, and Subscribers.', placement: 'right' },
  { tab: 'overview', target: '[data-tour="stat-cards"]', title: 'Dashboard Overview', body: 'A live snapshot of your shipment volume, what’s in transit, delivered, and anything that needs attention.', placement: 'bottom' },
  { tab: 'overview', target: '[data-tour="quick-actions"]', title: 'Quick Actions', body: 'Jump straight to creating a shipment, tracking one, or viewing everything — no need to use the sidebar.', placement: 'left' },
  { tab: 'overview', target: '[data-tour="recent-shipments"]', title: 'Recent Shipments', body: 'The last few shipments to change, right on the overview so you don’t have to go looking.', placement: 'top' },
  { tab: 'shipments', target: '[data-tour="shipments-search"]', title: 'Find Any Shipment', body: 'Search by tracking ID, sender, or recipient name, and filter by status.', placement: 'bottom' },
  { tab: 'shipments', target: '[data-tour="shipments-table"]', title: 'Manage Shipments', body: 'View details, edit info, update status, or delete a shipment — all from this table.', placement: 'top' },
  { tab: 'create', target: '[data-tour="create-form"]', title: 'Create a New Shipment', body: 'Fill in sender, recipient, and package details yourself, or use a quick-fill template to see it in action. A tracking number is generated automatically.', placement: 'bottom' },
  { tab: 'track', target: '[data-tour="track-search"]', title: 'Track & Update', body: 'Search a tracking number to see its full timeline, update its status, and add events. Locations you enter are matched to map coordinates automatically, and the customer is emailed on status changes.', placement: 'bottom' },
  { tab: 'subscribers', target: '[data-tour="subscribers-list"]', title: 'Newsletter Subscribers', body: 'Everyone who has subscribed to shipping updates from the public site, with a quick active/unsubscribed breakdown.', placement: 'bottom' },
  { tab: 'overview', target: '[data-tour="sign-out"]', title: 'That’s the Tour!', body: 'You can restart this tour anytime from the “Take a Tour” button in the header. Sign out securely from here when you’re done.', placement: 'right' },
]

/* ─── Types ──────────────────────────────────────────────────────────────── */
type AdminTab = 'overview' | 'shipments' | 'create' | 'track' | 'subscribers'

/* ─── Status config ──────────────────────────────────────────────────────── */
const STATUS_CFG: Record<ShipStatus, { label: string; color: string; bg: string }> = {
  pending:          { label: 'Pending',           color: '#64748b', bg: '#f1f5f9' },
  confirmed:        { label: 'Confirmed',          color: '#7c3aed', bg: '#f5f3ff' },
  picked_up:        { label: 'Picked Up',          color: '#0891b2', bg: '#ecfeff' },
  in_transit:       { label: 'In Transit',         color: '#2563eb', bg: '#eff6ff' },
  out_for_delivery: { label: 'Out for Delivery',   color: '#1565C0', bg: '#fff5f5' },
  delivered:        { label: 'Delivered',           color: '#16a34a', bg: '#f0fdf4' },
  failed:           { label: 'Failed',              color: '#dc2626', bg: '#fef2f2' },
  cancelled:        { label: 'Cancelled',           color: '#94a3b8', bg: '#f8fafc' },
  returned:         { label: 'Returned',            color: '#b45309', bg: '#fffbeb' },
}


function todayStr(): string { return new Date().toISOString().slice(0, 10) }
function nowTime(): string { return new Date().toTimeString().slice(0, 5) }

function evtIcon(type: string) {
  const icons: Record<string, JSX.Element> = {
    pickup:   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>,
    flight:   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>,
    sort:     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/></svg>,
    customs:  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>,
    truck:    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z"/><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1V8h3l3 3v4l1 1h-1m-6 0h-3"/></svg>,
    delivered:<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M4.5 12.75l6 6 9-13.5"/></svg>,
  }
  return icons[type] ?? icons.sort
}

/* ─── Status badge ───────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: ShipStatus }) {
  const c = STATUS_CFG[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ background: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
      {c.label}
    </span>
  )
}

/* ─── Overview Tab ───────────────────────────────────────────────────────── */
function OverviewTab({ shipments, onNavigate }: { shipments: AdminShipment[]; onNavigate: (t: AdminTab) => void }) {
  const total      = shipments.length
  const inTransit  = shipments.filter(s => ['picked_up','in_transit','out_for_delivery'].includes(s.status)).length
  const delivered  = shipments.filter(s => s.status === 'delivered').length
  const issues     = shipments.filter(s => ['failed','returned','cancelled'].includes(s.status)).length
  const processing = shipments.filter(s => ['pending','confirmed'].includes(s.status)).length

  const recent = [...shipments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm mt-1">Welcome back, Admin. Here's your shipment summary.</p>
      </div>

      {/* Stat cards */}
      <div data-tour="stat-cards" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Shipments', value: total,      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>, color: '#0f2444', bg: '#e8f0fe' },
          { label: 'In Transit',      value: inTransit,  icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>, color: '#2563eb', bg: '#dbeafe' },
          { label: 'Delivered',       value: delivered,  icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Needs Attention', value: issues,     icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>, color: '#b45309', bg: '#fef3c7' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ background: s.bg, color: s.color }}>{s.label}</span>
            </div>
            <p className="text-4xl font-black text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Status Breakdown</h3>
          <div className="space-y-3">
            {(Object.entries(STATUS_CFG) as [ShipStatus, typeof STATUS_CFG[ShipStatus]][]).map(([key, cfg]) => {
              const count = shipments.filter(s => s.status === key).length
              const pct = total ? Math.round((count / total) * 100) : 0
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold flex items-center gap-1.5" style={{ color: cfg.color }}><span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />{cfg.label}</span>
                    <span className="text-slate-400">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: cfg.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div data-tour="quick-actions" className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Create Shipment', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M12 4.5v15m7.5-7.5h-15"/></svg>, tab: 'create' as AdminTab, color: '#FF9800', text: '#0f0900' },
              { label: 'Track Package',   icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>, tab: 'track' as AdminTab, color: '#2563eb', text: 'white' },
              { label: 'All Shipments',   icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>, tab: 'shipments' as AdminTab, color: '#16a34a', text: 'white' },
              { label: 'Processing (' + processing + ')', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>, tab: 'shipments' as AdminTab, color: '#7c3aed', text: 'white' },
            ].map(a => (
              <button key={a.label} onClick={() => onNavigate(a.tab)}
                className="flex items-center gap-2 p-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-85 active:scale-95 text-left"
                style={{ background: a.color, color: a.text }}>
                <span>{a.icon}</span>
                <span className="leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent shipments */}
      <div data-tour="recent-shipments" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Shipments</h3>
          <button onClick={() => onNavigate('shipments')} className="text-sm font-semibold" style={{ color: '#1565C0' }}>
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Tracking ID', 'Sender → Recipient', 'Service', 'Status', 'ETA'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-slate-500 font-semibold text-xs uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                  <td className="px-5 py-3 font-mono text-xs font-bold text-slate-700 whitespace-nowrap">{s.trackingNumber || s.id.slice(-8)}</td>
                  <td className="px-5 py-3 text-xs">
                    <span className="font-medium text-slate-800">{s.sender.name}</span>
                    <span className="text-slate-400 mx-1">→</span>
                    <span className="font-medium text-slate-800">{s.recipient.name}</span>
                    <span className="text-slate-400 ml-1">({s.recipient.city})</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500 capitalize whitespace-nowrap">{s.service}</td>
                  <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">
                    {s.eta ? new Date(s.eta).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ─── Shared form constants ──────────────────────────────────────────────── */
const SERVICES = [
  { label: 'Standard',  value: 'standard'  },
  { label: 'Express',   value: 'express'   },
  { label: 'Overnight', value: 'overnight' },
  { label: 'Same Day',  value: 'same_day'  },
]

const EMPTY_FORM = {
  senderName: '', senderPhone: '', senderEmail: '', senderStreet: '', senderCity: '', senderState: '', senderCountry: '', senderPostal: '',
  recipientName: '', recipientPhone: '', recipientEmail: '', recipientStreet: '', recipientCity: '', recipientState: '', recipientCountry: '', recipientPostal: '',
  service: 'standard', weight: '', dimLength: '', dimWidth: '', dimHeight: '',
  contents: '', declaredValue: '', eta: '', notes: '',
}

const SAMPLE_SHIPMENTS: Array<Omit<typeof EMPTY_FORM, ''> & { label: string }> = [
  {
    label: 'Dubai → London',
    senderName: 'Ahmed Al Mansouri', senderPhone: '+971 50 123 4567', senderEmail: 'ahmed@globalexports.ae',
    senderStreet: '14 Trade Centre Road', senderCity: 'Dubai', senderState: 'Dubai', senderCountry: 'UAE', senderPostal: '00000',
    recipientName: 'James Harrington', recipientPhone: '+44 20 7946 0101', recipientEmail: 'james@harrington.co.uk',
    recipientStreet: '47 Baker Street', recipientCity: 'London', recipientState: 'England', recipientCountry: 'United Kingdom', recipientPostal: 'NW1 6XE',
    service: 'express', weight: '4.2', dimLength: '40', dimWidth: '30', dimHeight: '20',
    contents: 'Electronics — Laptop & Accessories', declaredValue: '1200', eta: '', notes: 'Handle with care — fragile electronics',
  },
  {
    label: 'Accra → New York',
    senderName: 'Kwame Asante', senderPhone: '+233 24 456 7890', senderEmail: 'kwame@asantetraders.gh',
    senderStreet: '5 Independence Avenue', senderCity: 'Accra', senderState: 'Greater Accra', senderCountry: 'Ghana', senderPostal: 'GA-123',
    recipientName: 'Olivia Thompson', recipientPhone: '+1 212 555 0180', recipientEmail: 'olivia.t@acmeinc.com',
    recipientStreet: '350 Fifth Avenue', recipientCity: 'New York', recipientState: 'NY', recipientCountry: 'United States', recipientPostal: '10118',
    service: 'standard', weight: '1.5', dimLength: '25', dimWidth: '20', dimHeight: '5',
    contents: 'Documents & Legal Papers', declaredValue: '50', eta: '', notes: 'Do not bend',
  },
  {
    label: 'Frankfurt → Singapore',
    senderName: 'Klaus Weber', senderPhone: '+49 69 1234 5678', senderEmail: 'k.weber@weberlogistik.de',
    senderStreet: 'Hanauer Landstraße 12', senderCity: 'Frankfurt', senderState: 'Hesse', senderCountry: 'Germany', senderPostal: '60314',
    recipientName: 'Li Wei', recipientPhone: '+65 9123 4567', recipientEmail: 'liwei@sigatech.sg',
    recipientStreet: '10 Raffles Place', recipientCity: 'Singapore', recipientState: 'Central Region', recipientCountry: 'Singapore', recipientPostal: '048621',
    service: 'overnight', weight: '12.0', dimLength: '60', dimWidth: '40', dimHeight: '30',
    contents: 'Industrial Machinery Parts', declaredValue: '5000', eta: '', notes: 'Heavy package — use forklift',
  },
  {
    label: 'London → Accra',
    senderName: 'Sarah Mitchell', senderPhone: '+44 20 7946 0200', senderEmail: 'sarah@mitchellfashion.co.uk',
    senderStreet: '22 Oxford Street', senderCity: 'London', senderState: 'England', senderCountry: 'United Kingdom', senderPostal: 'W1D 1AN',
    recipientName: 'Abena Osei', recipientPhone: '+233 30 220 0001', recipientEmail: 'abena@osei-boutique.gh',
    recipientStreet: '8 Osu Oxford Street', recipientCity: 'Accra', recipientState: 'Greater Accra', recipientCountry: 'Ghana', recipientPostal: 'GA-456',
    service: 'standard', weight: '8.0', dimLength: '50', dimWidth: '40', dimHeight: '25',
    contents: 'Clothing & Fashion Accessories', declaredValue: '800', eta: '', notes: '',
  },
  {
    label: 'New York → Dubai',
    senderName: 'Marcus Johnson', senderPhone: '+1 646 555 0123', senderEmail: 'm.johnson@pharmaworld.com',
    senderStreet: '1600 Broadway', senderCity: 'New York', senderState: 'NY', senderCountry: 'United States', senderPostal: '10019',
    recipientName: 'Fatima Al Zaabi', recipientPhone: '+971 4 345 6789', recipientEmail: 'fatima@zaabimed.ae',
    recipientStreet: '25 Health Care City', recipientCity: 'Dubai', recipientState: 'Dubai', recipientCountry: 'UAE', recipientPostal: '00000',
    service: 'express', weight: '3.0', dimLength: '30', dimWidth: '20', dimHeight: '15',
    contents: 'Medical Supplies & Equipment', declaredValue: '2500', eta: '', notes: 'Requires cold chain — keep below 8°C',
  },
]

/* ─── Shipments Tab ──────────────────────────────────────────────────────── */
type EditForm = typeof EMPTY_FORM & { status: ShipStatus }

function ShipmentsTab({
  shipments, onUpdate, onDelete, onEdit,
}: {
  shipments: AdminShipment[]
  onUpdate: (id: string, status: ShipStatus, note?: string) => Promise<{ notified: boolean; notifyError?: string }>
  onDelete: (id: string) => Promise<void>
  onEdit: (id: string, body: unknown) => Promise<void>
}) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected, setSelected] = useState<AdminShipment | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [newStatus, setNewStatus] = useState<ShipStatus>('in_transit')
  const [eventNote, setEventNote] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({ ...EMPTY_FORM, status: 'pending' })
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [editError, setEditError] = useState('')

  const filtered = shipments.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      s.id.toLowerCase().includes(q) ||
      s.sender.name.toLowerCase().includes(q) ||
      s.recipient.name.toLowerCase().includes(q) ||
      s.recipient.city?.toLowerCase().includes(q)
    return matchSearch && (filterStatus === 'all' || s.status === filterStatus)
  })

  const openUpdate = (s: AdminShipment) => {
    setSelected(s)
    setNewStatus(s.status)
    setShowUpdateModal(true)
  }

  const openEdit = (s: AdminShipment) => {
    setEditId(s.id)
    setEditForm({
      senderName: s.sender.name, senderPhone: s.sender.phone || '', senderEmail: s.sender.email || '',
      senderStreet: s.sender.street || '', senderCity: s.sender.city || '', senderState: s.sender.state || '',
      senderCountry: s.sender.country || '', senderPostal: s.sender.postalCode || '',
      recipientName: s.recipient.name, recipientPhone: s.recipient.phone || '', recipientEmail: s.recipient.email || '',
      recipientStreet: s.recipient.street || '', recipientCity: s.recipient.city || '', recipientState: s.recipient.state || '',
      recipientCountry: s.recipient.country || '', recipientPostal: s.recipient.postalCode || '',
      service: s.service, weight: String(s.weight),
      dimLength: s.dimensions?.length != null ? String(s.dimensions.length) : '',
      dimWidth:  s.dimensions?.width  != null ? String(s.dimensions.width)  : '',
      dimHeight: s.dimensions?.height != null ? String(s.dimensions.height) : '',
      contents: s.contents, declaredValue: String(s.declaredValue || ''),
      eta: s.eta ? new Date(s.eta).toISOString().split('T')[0] : '',
      notes: s.notes || '', status: s.status,
    })
    setEditError('')
    setShowEditModal(true)
  }

  const setEF = (k: string, v: string) => setEditForm(f => ({ ...f, [k]: v }))

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editId) return
    setEditSubmitting(true)
    setEditError('')
    try {
      await onEdit(editId, {
        sender:    { name: editForm.senderName,    phone: editForm.senderPhone,    email: editForm.senderEmail,    street: editForm.senderStreet,    city: editForm.senderCity,    state: editForm.senderState,    country: editForm.senderCountry,    postalCode: editForm.senderPostal },
        recipient: { name: editForm.recipientName, phone: editForm.recipientPhone, email: editForm.recipientEmail, street: editForm.recipientStreet, city: editForm.recipientCity, state: editForm.recipientState, country: editForm.recipientCountry, postalCode: editForm.recipientPostal },
        service: editForm.service,
        weight: parseFloat(editForm.weight) || 0,
        dimensions: { length: parseFloat(editForm.dimLength) || undefined, width: parseFloat(editForm.dimWidth) || undefined, height: parseFloat(editForm.dimHeight) || undefined },
        contents: editForm.contents,
        declaredValue: parseFloat(editForm.declaredValue) || 0,
        status: editForm.status,
        eta: editForm.eta ? new Date(editForm.eta).toISOString() : '',
        notes: editForm.notes,
      })
      setShowEditModal(false)
    } catch (err) {
      setEditError((err as Error).message || 'Update failed. Please try again.')
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!selected) return
    try {
      await onUpdate(selected.id, newStatus, eventNote || undefined)
      setShowUpdateModal(false)
      setSelected(null)
      setEventNote('')
    } catch (err) {
      alert((err as Error).message || 'Update failed. Please try again.')
    }
  }

  const closeUpdateModal = () => {
    setShowUpdateModal(false)
    setSelected(null)
    setEventNote('')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">All Shipments</h2>
          <p className="text-slate-500 text-sm">{filtered.length} of {shipments.length} shipments</p>
        </div>
      </div>

      {/* Filters */}
      <div data-tour="shipments-search" className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search ID, sender, recipient…"
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all"
          />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-yellow-400 bg-white">
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Mobile cards — the table's action buttons scroll off-screen on
          phones with no visual hint, so phones get a stacked card layout
          instead of relying on horizontal table scroll */}
      <div data-tour="shipments-table" className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-14 text-slate-400 text-sm bg-white rounded-2xl border border-slate-100">No shipments found</div>
        ) : filtered.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="text-slate-800 font-semibold text-sm truncate">{s.sender.name} <span className="text-slate-300">→</span> {s.recipient.name}</p>
                <p className="text-slate-400 text-xs truncate">{s.recipient.city}, {s.recipient.country}</p>
                <p className="text-[10px] font-mono text-slate-300 mt-0.5">{s.trackingNumber || s.id.slice(-8)}</p>
              </div>
              <span className="shrink-0"><StatusBadge status={s.status} /></span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-3 border-b border-slate-100">
              <span className="capitalize font-medium">{s.service} · {s.weight} kg</span>
              <span>{s.eta ? new Date(s.eta).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'ETA —'}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => setSelected(s)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-blue-50 text-blue-600 active:scale-95 transition-transform">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span className="text-[10px] font-semibold">View</span>
              </button>
              <button onClick={() => openEdit(s)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-green-50 text-green-600 active:scale-95 transition-transform">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/></svg>
                <span className="text-[10px] font-semibold">Edit</span>
              </button>
              <button onClick={() => openUpdate(s)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-yellow-50 text-yellow-600 active:scale-95 transition-transform">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
                <span className="text-[10px] font-semibold">Status</span>
              </button>
              <button onClick={() => { if (window.confirm(`Delete ${s.trackingNumber}?`)) onDelete(s.id) }}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-red-50 text-red-500 active:scale-95 transition-transform">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                <span className="text-[10px] font-semibold">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div data-tour="shipments-table" className="hidden sm:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['From → To', 'Service · Weight', 'Status', 'ETA', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-slate-500 font-semibold text-xs uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-14 text-slate-400 text-sm">No shipments found</td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id} className={`transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-yellow-50/20`}>
                  {/* From → To */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div>
                        <p className="text-slate-800 font-semibold text-xs">{s.sender.name}</p>
                        <p className="text-slate-400 text-xs">{s.sender.city}, {s.sender.country}</p>
                      </div>
                      <svg className="w-3.5 h-3.5 text-slate-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                      <div>
                        <p className="text-slate-800 font-semibold text-xs">{s.recipient.name}</p>
                        <p className="text-slate-400 text-xs">{s.recipient.city}, {s.recipient.country}</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-mono text-slate-300 mt-1">{s.trackingNumber || s.id.slice(-8)}</p>
                  </td>
                  {/* Service · Weight */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-xs text-slate-700 capitalize font-medium">{s.service}</p>
                    <p className="text-xs text-slate-400">{s.weight} kg</p>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={s.status} /></td>
                  {/* ETA */}
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                    {s.eta ? new Date(s.eta).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  {/* Actions — icon buttons */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      {/* View — opens the quick-preview panel instantly, no page navigation (faster on mobile) */}
                      <button onClick={() => setSelected(s)} title="View details"
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      </button>
                      {/* Edit */}
                      <button onClick={() => openEdit(s)} title="Edit shipment"
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/></svg>
                      </button>
                      {/* Update status */}
                      <button onClick={() => openUpdate(s)} title="Update status"
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
                      </button>
                      {/* Delete */}
                      <button onClick={() => { if (window.confirm(`Delete ${s.trackingNumber}?`)) onDelete(s.id) }} title="Delete"
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail slide-over */}
      {selected && !showUpdateModal && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-2xl overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <p className="text-xs font-mono text-slate-400">{selected.trackingNumber || selected.id}</p>
                <h3 className="font-black text-slate-800 text-lg">Shipment Details</h3>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1">
              <div className="flex items-center justify-between">
                <StatusBadge status={selected.status} />
                <span className="text-xs text-slate-400 font-medium">
                  ETA: {selected.eta ? new Date(selected.eta).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">From</p>
                  <p className="font-bold text-slate-800 text-sm">{selected.sender.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{selected.sender.phone}</p>
                  {selected.sender.street && <p className="text-slate-500 text-xs">{selected.sender.street}</p>}
                  <p className="text-slate-500 text-xs">{selected.sender.city}, {selected.sender.country}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">To</p>
                  <p className="font-bold text-slate-800 text-sm">{selected.recipient.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{selected.recipient.phone}</p>
                  {selected.recipient.street && <p className="text-slate-500 text-xs">{selected.recipient.street}</p>}
                  <p className="text-slate-500 text-xs">{selected.recipient.city}, {selected.recipient.country}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Package Info</p>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  {[
                    ['Service', selected.service],
                    ['Weight', selected.weight ? `${selected.weight} kg` : ''],
                    ['Dimensions', selected.dimensions ? [selected.dimensions.length, selected.dimensions.width, selected.dimensions.height].filter(Boolean).join(' × ') + ' cm' : ''],
                    ['Contents', selected.contents],
                    ['Declared Value', selected.declaredValue ? `$${selected.declaredValue}` : ''],
                    ['Created', selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''],
                  ].map(([k, v]) => (
                    <><span key={k + 'k'} className="text-slate-400">{k}</span><span key={k + 'v'} className="text-slate-800 font-medium">{v || '—'}</span></>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Timeline</p>
                <div className="space-y-1">
                  {[...selected.events].reverse().map((ev, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs shrink-0">{evtIcon(ev.type)}</div>
                        {i < selected.events.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1 min-h-[8px]" />}
                      </div>
                      <div className="pb-2">
                        <p className="text-slate-800 text-xs font-semibold leading-snug">{ev.desc}</p>
                        <p className="text-slate-400 text-xs">{ev.location} · {ev.date} {ev.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate(`/admin/shipments/${selected.id}`)}
                  className="mt-2 text-xs font-semibold flex items-center gap-1" style={{ color: '#1565C0' }}>
                  Manage timeline events
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div className="flex gap-3">
                <button onClick={() => openEdit(selected)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                  Edit Details
                </button>
                <button onClick={() => openUpdate(selected)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: '#FF9800', color: '#0f0900' }}>
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update status modal */}
      {showUpdateModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeUpdateModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-black text-slate-800 text-lg mb-1">Update Status</h3>
            <p className="text-slate-500 text-sm mb-5 font-mono">{selected.id}</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">New Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as ShipStatus)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 bg-white">
                  {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Event Note <span className="normal-case font-normal">(optional)</span></label>
                <input type="text" value={eventNote} onChange={e => setEventNote(e.target.value)}
                  placeholder="e.g. Package arrived at Frankfurt hub"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={closeUpdateModal}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleUpdateStatus}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: '#FF9800', color: '#0f0900' }}>
                  Save Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit shipment modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="font-black text-slate-800 text-lg">Edit Shipment</h3>
                <p className="text-xs font-mono text-slate-400">{editId}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              {editError && (
                <div className="p-3 rounded-xl text-sm flex items-center gap-2 bg-red-50 text-red-600 border border-red-100">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {editError}
                </div>
              )}

              {/* Sample templates */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Quick Fill — Sample Shipments</p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_SHIPMENTS.map(s => (
                    <button key={s.label} type="button"
                      onClick={() => setEditForm(f => ({ ...f, ...s }))}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-800 transition-all">
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender + Recipient */}
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { title: 'Sender', color: '#FF9800', textColor: '#0f0900', letter: 'S', fields: [
                    { k: 'senderName', label: 'Full Name *', ph: 'John Smith' },
                    { k: 'senderPhone', label: 'Phone', ph: '+1 800 000 0000' },
                    { k: 'senderEmail', label: 'Email', ph: 'john@example.com' },
                    { k: 'senderStreet', label: 'Street Address', ph: '14 Main Street' },
                    { k: 'senderCity', label: 'City *', ph: 'Dubai' },
                    { k: 'senderState', label: 'State / Province', ph: 'Dubai' },
                    { k: 'senderCountry', label: 'Country *', ph: 'UAE' },
                    { k: 'senderPostal', label: 'Postal Code', ph: '00000' },
                  ]},
                  { title: 'Recipient', color: '#1565C0', textColor: 'white', letter: 'R', fields: [
                    { k: 'recipientName', label: 'Full Name *', ph: 'Jane Doe' },
                    { k: 'recipientPhone', label: 'Phone', ph: '+44 20 7946 0100' },
                    { k: 'recipientEmail', label: 'Email', ph: 'jane@example.com' },
                    { k: 'recipientStreet', label: 'Street Address', ph: '47 Baker Street' },
                    { k: 'recipientCity', label: 'City *', ph: 'London' },
                    { k: 'recipientState', label: 'State / Province', ph: 'England' },
                    { k: 'recipientCountry', label: 'Country *', ph: 'United Kingdom' },
                    { k: 'recipientPostal', label: 'Postal Code', ph: 'NW1 6XE' },
                  ]},
                ].map(party => (
                  <div key={party.title} className="bg-slate-50 rounded-2xl p-5">
                    <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black" style={{ background: party.color, color: party.textColor }}>{party.letter}</span>
                      {party.title}
                    </h4>
                    <div className="space-y-2.5">
                      {party.fields.map(f => (
                        <div key={f.k}>
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">{f.label}</label>
                          <input type="text" value={(editForm as Record<string,string>)[f.k]} onChange={e => setEF(f.k, e.target.value)} placeholder={f.ph}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400 bg-white" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipment details */}
              <div className="bg-slate-50 rounded-2xl p-5">
                <h4 className="font-bold text-slate-700 mb-3 text-sm">Shipment Details</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { k: 'contents', label: 'Contents *', ph: 'Electronics, Clothing…', type: 'text' },
                    { k: 'weight', label: 'Weight (kg) *', ph: '3.5', type: 'number' },
                    { k: 'declaredValue', label: 'Declared Value (USD)', ph: '500', type: 'number' },
                    { k: 'eta', label: 'Expected ETA', ph: '', type: 'date' },
                    { k: 'notes', label: 'Notes', ph: 'Fragile, keep upright…', type: 'text' },
                  ].map(f => (
                    <div key={f.k}>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">{f.label}</label>
                      <input type={f.type} value={(editForm as Record<string,string>)[f.k]} onChange={e => setEF(f.k, e.target.value)} placeholder={f.ph}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400 bg-white" />
                    </div>
                  ))}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Service *</label>
                    <select value={editForm.service} onChange={e => setEF('service', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400 bg-white">
                      {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Status</label>
                    <select value={editForm.status} onChange={e => setEF('status', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400 bg-white">
                      {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Dimensions (cm) — L × W × H</label>
                    <div className="flex gap-2">
                      {[['dimLength','Length'],['dimWidth','Width'],['dimHeight','Height']].map(([k,ph]) => (
                        <input key={k} type="number" min="0" step="0.1" value={(editForm as Record<string,string>)[k]} onChange={e => setEF(k, e.target.value)} placeholder={ph}
                          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-400 bg-white" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={editSubmitting}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: '#FF9800', color: '#0f0900' }}>
                  {editSubmitting
                    ? <><span className="w-4 h-4 border-2 rounded-full inline-block" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#0f0900', animation: 'spin 1s linear infinite' }} /> Saving…</>
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Create Tab ─────────────────────────────────────────────────────────── */
function CreateTab({ onCreate }: { onCreate: (body: Omit<AdminShipment, 'id' | 'createdAt' | 'events'>) => Promise<string> }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.senderName || !form.senderCity || !form.senderCountry || !form.recipientName || !form.recipientCity || !form.recipientCountry || !form.contents || !form.weight) {
      setError('Please fill all required fields (marked with *).')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const id = await onCreate({
        sender:    { name: form.senderName,    phone: form.senderPhone,    email: form.senderEmail,    street: form.senderStreet,    city: form.senderCity,    state: form.senderState,    country: form.senderCountry,    postalCode: form.senderPostal },
        recipient: { name: form.recipientName, phone: form.recipientPhone, email: form.recipientEmail, street: form.recipientStreet, city: form.recipientCity, state: form.recipientState, country: form.recipientCountry, postalCode: form.recipientPostal },
        service: form.service,
        weight: parseFloat(form.weight) || 0,
        dimensions: { length: parseFloat(form.dimLength) || undefined, width: parseFloat(form.dimWidth) || undefined, height: parseFloat(form.dimHeight) || undefined },
        contents: form.contents,
        declaredValue: parseFloat(form.declaredValue) || 0,
        status: 'pending',
        eta: form.eta ? new Date(form.eta).toISOString() : '',
        notes: form.notes,
      } as unknown as Omit<AdminShipment, 'id' | 'createdAt' | 'events'>)
      setSuccess(id)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError((err as Error).message || 'Failed to create shipment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5"><svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Shipment Created!</h2>
        <p className="text-slate-500 mb-6">The shipment has been added to the system and can now be tracked.</p>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-5 mb-6">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Tracking Number</p>
          <p className="text-2xl font-black font-mono text-slate-800">{success}</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setSuccess(null)} className="btn-primary">
            Create Another
          </button>
        </div>
      </div>
    )
  }

  const inputCls = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all'
  const labelCls = 'text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5'

  const senderFields = [
    { key: 'senderName',    label: 'Full Name *',     ph: 'John Smith' },
    { key: 'senderPhone',   label: 'Phone',            ph: '+1 800 123 4567' },
    { key: 'senderEmail',   label: 'Email',            ph: 'john@example.com' },
    { key: 'senderStreet',  label: 'Street Address',   ph: '14 Main Street' },
    { key: 'senderCity',    label: 'City *',            ph: 'Dubai' },
    { key: 'senderState',   label: 'State / Province', ph: 'Dubai' },
    { key: 'senderCountry', label: 'Country *',         ph: 'UAE' },
    { key: 'senderPostal',  label: 'Postal Code',       ph: '00000' },
  ]
  const recipientFields = [
    { key: 'recipientName',    label: 'Full Name *',     ph: 'Jane Doe' },
    { key: 'recipientPhone',   label: 'Phone',            ph: '+44 20 7946 0100' },
    { key: 'recipientEmail',   label: 'Email',            ph: 'jane@example.com' },
    { key: 'recipientStreet',  label: 'Street Address',   ph: '47 Baker Street' },
    { key: 'recipientCity',    label: 'City *',            ph: 'London' },
    { key: 'recipientState',   label: 'State / Province', ph: 'England' },
    { key: 'recipientCountry', label: 'Country *',         ph: 'United Kingdom' },
    { key: 'recipientPostal',  label: 'Postal Code',       ph: 'NW1 6XE' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Create New Shipment</h2>
        <p className="text-slate-500 text-sm">A tracking number will be automatically generated on submission.</p>
      </div>

      {/* Sample templates */}
      <div data-tour="create-form" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Quick Fill — Sample Shipments</p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_SHIPMENTS.map(s => (
            <button key={s.label} type="button"
              onClick={() => setForm({ ...s })}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-800 transition-all">
              {s.label}
            </button>
          ))}
          <button type="button" onClick={() => setForm(EMPTY_FORM)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-400 hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all">
            Clear All
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl text-sm flex items-center gap-2 bg-red-50 text-red-600 border border-red-100">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sender */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black" style={{ background: '#FF9800', color: '#0f0900' }}>S</span>
              Sender Details
            </h3>
            <div className="space-y-3">
              {senderFields.map(f => (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <input type="text" value={(form as Record<string, string>)[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.ph} className={inputCls} />
                </div>
              ))}
            </div>
          </div>

          {/* Recipient */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black" style={{ background: '#1565C0', color: 'white' }}>R</span>
              Recipient Details
            </h3>
            <div className="space-y-3">
              {recipientFields.map(f => (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <input type="text" value={(form as Record<string, string>)[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.ph} className={inputCls} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipment details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg> Shipment Details
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Service *</label>
              <select value={form.service} onChange={e => set('service', e.target.value)} className={inputCls + ' bg-white'}>
                {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Weight (kg) *</label>
              <input type="number" min="0.01" step="0.01" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="3.5" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Contents *</label>
              <input type="text" value={form.contents} onChange={e => set('contents', e.target.value)} placeholder="Electronics, Clothing…" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Declared Value (USD)</label>
              <input type="number" min="0" step="0.01" value={form.declaredValue} onChange={e => set('declaredValue', e.target.value)} placeholder="500" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Expected ETA</label>
              <input type="date" value={form.eta} onChange={e => set('eta', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Notes</label>
              <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Fragile, keep upright…" className={inputCls} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelCls}>Dimensions (cm) — L × W × H</label>
              <div className="flex gap-3">
                {[['dimLength','Length'],['dimWidth','Width'],['dimHeight','Height']].map(([k,ph]) => (
                  <input key={k} type="number" min="0" step="0.1" value={(form as Record<string,string>)[k]} onChange={e => set(k, e.target.value)} placeholder={ph} className={inputCls} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary py-4! px-8! text-base! disabled:opacity-60">
          {submitting
            ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating…</>
            : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg> Create Shipment</>}
        </button>
      </form>
    </div>
  )
}

/* ─── Track Tab ──────────────────────────────────────────────────────────── */
function TrackTab({ shipments, onUpdate }: { shipments: AdminShipment[]; onUpdate: (id: string, status: ShipStatus, note?: string, location?: string) => Promise<{ notified: boolean; notifyError?: string }> }) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<AdminShipment | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [newStatus, setNewStatus] = useState<ShipStatus>('in_transit')
  const [eventNote, setEventNote] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [updateDone, setUpdateDone] = useState(false)
  const [notifyBanner, setNotifyBanner] = useState<{ ok: boolean; text: string } | null>(null)

  // Add event form
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

  // Edit event state
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

  const search = () => {
    const q = query.trim().toLowerCase()
    const found = shipments.find(s =>
      s.trackingNumber?.toLowerCase() === q ||
      s.id.toLowerCase() === q
    )
    setResult(found || null)
    setNotFound(!found)
    if (found) setNewStatus(found.status)
    setUpdateDone(false)
    setEditId(null)
  }

  const applyUpdate = async () => {
    if (!result) return
    const desc = eventNote || `Status updated to: ${STATUS_CFG[newStatus].label}`
    const loc = eventLocation || 'Accessiblexpress Control Centre'
    const newEvent: ShipEvent = { time: nowTime(), date: todayStr(), location: loc, desc, type: 'info' }
    try {
      const { notified, notifyError } = await onUpdate(result.id, newStatus, eventNote || undefined, eventLocation || undefined)
      setResult(prev => prev ? { ...prev, status: newStatus, events: [...prev.events, newEvent] } : null)
      setEventNote('')
      setEventLocation('')
      setUpdateDone(true)
      setTimeout(() => setUpdateDone(false), 3000)
      if (notified) {
        setNotifyBanner({ ok: true, text: `Customer notified by email at ${result.recipient.email || '—'}` })
      } else if (notifyError) {
        setNotifyBanner({ ok: false, text: `Status saved, but the notification email failed to send: ${notifyError}` })
      } else if (!result.recipient.email) {
        setNotifyBanner({ ok: false, text: 'No notification sent — recipient has no email on file' })
      } else {
        setNotifyBanner(null)
      }
      setTimeout(() => setNotifyBanner(null), 6000)
    } catch (err) {
      alert((err as Error).message || 'Update failed. Please try again.')
    }
  }

  const handleAddEvent = async () => {
    if (!result || !addDesc.trim()) return
    setAddBusy(true)
    try {
      const updated = await api.addEvent(result.id, {
        desc: addDesc.trim(),
        location: addLoc.trim() || 'Accessiblexpress Control Centre',
        lat: addLat ? parseFloat(addLat) : undefined,
        lng: addLng ? parseFloat(addLng) : undefined,
        date: addDate, time: addTime, type: addType,
      })
      setResult(updated)
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
    if (!result || !editId) return
    setEditBusy(true)
    try {
      const updated = await api.updateEvent(result.id, editId, {
        desc: editDesc.trim(),
        location: editLoc.trim(),
        lat: editLat ? parseFloat(editLat) : undefined,
        lng: editLng ? parseFloat(editLng) : undefined,
        date: editDate, time: editTime, type: editType,
      })
      setResult(updated)
      setEditId(null)
    } catch (err) {
      alert((err as Error).message || 'Failed to update event.')
    } finally {
      setEditBusy(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!result || !confirm('Delete this timeline event?')) return
    setDeletingId(eventId)
    try {
      const updated = await api.deleteEvent(result.id, eventId)
      setResult(updated)
      if (editId === eventId) setEditId(null)
    } catch (err) {
      alert((err as Error).message || 'Failed to delete event.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Track Shipment</h2>
        <p className="text-slate-500 text-sm">Search and manage any shipment by tracking ID.</p>
      </div>

      <div data-tour="track-search" className="flex gap-3 max-w-xl">
        <input
          type="text" value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="e.g. QSD-2026-001234"
          className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
        />
        <button onClick={search} className="btn-primary py-3! px-6! text-sm! shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          Search
        </button>
      </div>

      {notFound && !result && (
        <div className="max-w-sm text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3"><svg className="w-7 h-7 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg></div>
          <h3 className="font-bold text-slate-800 mb-1">Not Found</h3>
          <p className="text-slate-500 text-sm">No shipment matches <span className="font-mono font-bold">{query}</span></p>
        </div>
      )}

      {result && (
        <div className="max-w-2xl space-y-4">
          {notifyBanner && (
            <div className={`rounded-xl p-3.5 text-sm flex items-center gap-2 border ${notifyBanner.ok ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {notifyBanner.ok
                ? <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                : <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
              }
              {notifyBanner.text}
            </div>
          )}
          {/* Status header */}
          <div className="rounded-2xl p-5 text-white" style={{ background: STATUS_CFG[result.status].color }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold opacity-70 mb-1">Tracking ID</p>
                <p className="font-mono font-black text-xl">{result.trackingNumber || result.id}</p>
                <p className="opacity-70 text-sm mt-1">{result.sender.city} → {result.recipient.city} · ETA: {result.eta}</p>
              </div>
              <StatusBadge status={result.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Sender</p>
              <p className="font-bold text-slate-800 text-sm">{result.sender.name}</p>
              <p className="text-xs text-slate-500">{result.sender.phone}</p>
              <p className="text-xs text-slate-500">{result.sender.city}, {result.sender.country}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Recipient</p>
              <p className="font-bold text-slate-800 text-sm">{result.recipient.name}</p>
              <p className="text-xs text-slate-500">{result.recipient.phone}</p>
              <p className="text-xs text-slate-500">{result.recipient.city}, {result.recipient.country}</p>
            </div>
          </div>

          {/* Package details */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Package Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs">
              {([['Service', result.service], ['Weight', String(result.weight)], ['Dimensions', result.dimensions ? `${result.dimensions.length ?? '?'}×${result.dimensions.width ?? '?'}×${result.dimensions.height ?? '?'} cm` : '—'], ['Contents', result.contents], ['Value', result.declaredValue ? String(result.declaredValue) : '—'], ['Created', result.createdAt]] as [string, string][]).map(([k, v]) => (
                <div key={k}><span className="text-slate-400 block">{k}</span><span className="text-slate-800 font-semibold">{v}</span></div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-4">Event Timeline ({result.events.length} events)</p>
            {result.events.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">No events yet. Add one below.</p>
            )}
            <div className="space-y-1">
              {[...result.events].reverse().map((ev, i) => (
                <div key={ev._id ?? i}>
                  {editId === ev._id ? (
                    /* ── Inline edit form ── */
                    <div className="border border-yellow-300 rounded-2xl p-4 bg-yellow-50 mb-2">
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
                          className="btn-primary py-2! px-5! text-xs! disabled:opacity-60">
                          {editBusy ? 'Saving…' : 'Save'}
                        </button>
                        <button onClick={() => setEditId(null)}
                          className="px-5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Normal event row ── */
                    <div className="flex gap-3 group">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0">{evtIcon(ev.type)}</div>
                        {i < result.events.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1 min-h-[10px]" />}
                      </div>
                      <div className="pb-3 flex-1 flex items-start justify-between gap-2">
                        <div>
                          <p className="text-slate-800 text-sm font-semibold leading-snug">{ev.desc}</p>
                          <p className="text-slate-400 text-xs">{ev.location} · {ev.date} at {ev.time}</p>
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
          </div>

          {/* Add Event */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
              Add Timeline Event
            </p>

            {/* Templates */}
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
              className="btn-primary py-2.5! px-6! text-sm! disabled:opacity-60">
              {addBusy ? 'Adding…' : 'Add Event'}
            </button>
          </div>

          {/* Status update */}
          <div className="bg-white rounded-2xl border-2 border-yellow-200 p-5 shadow-sm">
            <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-4 flex items-center gap-1.5"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>Update Status</p>
            {updateDone && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm border border-green-200 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Status updated successfully.
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">New Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as ShipStatus)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-400 bg-white">
                  {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Location</label>
                <input type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)}
                  placeholder="e.g. Dubai Cargo Hub" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-400" />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Event Description</label>
              <input type="text" value={eventNote} onChange={e => setEventNote(e.target.value)}
                placeholder="Describe what happened to the package…"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-yellow-400" />
            </div>
            <button onClick={applyUpdate}
              className="btn-primary py-2.5! px-6! text-sm!">
              Apply Update
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Subscribers Tab ────────────────────────────────────────────────────── */
function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.listSubscribers()
      .then(setSubscribers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = subscribers.filter(s =>
    !search || s.email.toLowerCase().includes(search.toLowerCase())
  )
  const active = subscribers.filter(s => s.active).length

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Newsletter Subscribers</h2>
        <p className="text-slate-500 text-sm mt-1">{active} active · {subscribers.length} total</p>
      </div>

      {/* Stat cards */}
      <div data-tour="subscribers-list" className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total',       value: subscribers.length,              icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>, color: '#0f2444', bg: '#e8f0fe' },
          { label: 'Active',      value: active,                                           icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Unsubscribed', value: subscribers.length - active,                    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, color: '#b45309', bg: '#fef3c7' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ background: s.bg, color: s.color }}>{s.label}</span>
            </div>
            <p className="text-4xl font-black text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by email…"
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="w-7 h-7 border-4 border-slate-200 border-t-yellow-400 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Email', 'Subscribed At', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-slate-500 font-semibold text-xs uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-14 text-slate-400 text-sm">No subscribers found</td></tr>
                ) : filtered.map((s, i) => (
                  <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                    <td className="px-5 py-3 text-sm font-medium text-slate-800">{s.email}</td>
                    <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(s.subscribedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3">
                      {s.active
                        ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />Active</span>
                        : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Unsubscribed</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main Dashboard ─────────────────────────────────────────────────────── */
const NAV_ITEMS: { key: AdminTab; label: string; icon: JSX.Element }[] = [
  { key: 'overview',     label: 'Overview',         icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg> },
  { key: 'shipments',    label: 'Shipments',         icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg> },
  { key: 'create',       label: 'Create Shipment',   icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M12 4.5v15m7.5-7.5h-15"/></svg> },
  { key: 'track',        label: 'Track Shipment',    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg> },
  { key: 'subscribers',  label: 'Subscribers',       icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg> },
]

const TAB_PATHS: Record<AdminTab, string> = {
  overview:    '/admin',
  shipments:   '/admin/shipments',
  create:      '/admin/create',
  track:       '/admin/track',
  subscribers: '/admin/subscribers',
}

export default function AdminDashboard() {
  const navigate   = useNavigate()
  const { pathname } = useLocation()
  const tab: AdminTab = (Object.entries(TAB_PATHS).find(([, p]) => p === pathname)?.[0] as AdminTab) ?? 'overview'
  const goTab = (t: AdminTab) => navigate(TAB_PATHS[t])

  const [shipments, setShipments] = useState<AdminShipment[]>([])
  const [loadingShipments, setLoadingShipments] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tourActive, setTourActive] = useState(false)

  // The guided tour's spotlight/step positioning assumes desktop-sized
  // targets and isn't designed for small screens — never auto-launch or
  // allow starting it below the sm breakpoint (matches the "Take a Tour"
  // button, which is likewise hidden on mobile).
  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 640

  useEffect(() => {
    if (!loadingShipments && !isMobile() && !localStorage.getItem(TOUR_SEEN_KEY)) {
      setTourActive(true)
      localStorage.setItem(TOUR_SEEN_KEY, '1')
    }
  }, [loadingShipments])

  const closeTour = () => setTourActive(false)

  useEffect(() => {
    api.listShipments()
      .then(setShipments)
      .catch(console.error)
      .finally(() => setLoadingShipments(false))
  }, [])

  const logout = async () => {
    try { await api.logout() } catch { /* ignore */ }
    clearToken()
    navigate('/admin/login')
  }

  const handleCreate = async (body: Omit<AdminShipment, 'id' | 'createdAt' | 'events'>): Promise<string> => {
    const created = await api.createShipment(body)
    setShipments(prev => [created, ...prev])
    return created.trackingNumber
  }

  const handleUpdate = async (id: string, status: ShipStatus, note?: string, location?: string) => {
    const updatedShipment = await api.updateShipment(id, { status })
    const desc = note || `Status updated to: ${STATUS_CFG[status].label}`
    const loc = location || 'Accessiblexpress Control Centre'
    const newEvent: ShipEvent = { time: nowTime(), date: todayStr(), location: loc, desc, type: 'info' }
    await api.addEvent(id, newEvent)
    setShipments(prev => prev.map(s =>
      s.id !== id ? s : { ...s, status, events: [...s.events, newEvent] }
    ))
    return { notified: updatedShipment.notifiedOnLastUpdate ?? false, notifyError: updatedShipment.notifyErrorOnLastUpdate }
  }

  const handleDelete = async (id: string) => {
    await api.deleteShipment(id)
    setShipments(prev => prev.filter(s => s.id !== id))
  }

  const handleEdit = async (id: string, body: unknown) => {
    const updated = await api.updateShipment(id, body)
    setShipments(prev => prev.map(s => s.id === id ? updated : s))
  }

  const TAB_TITLES: Record<AdminTab, string> = {
    overview:    'Dashboard Overview',
    shipments:   'All Shipments',
    create:      'Create Shipment',
    track:       'Track Shipment',
    subscribers: 'Newsletter Subscribers',
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ width: '256px', background: 'linear-gradient(180deg, #0f2444 0%, #071426 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="adG" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF9800" />
                  <stop offset="100%" stopColor="#1565C0" />
                </linearGradient>
              </defs>
              <rect width="96" height="96" rx="22" fill="#1565C0" />
              <circle cx="48" cy="52" r="28" stroke="white" strokeWidth="1" opacity="0.07" />
              <ellipse cx="48" cy="52" rx="14" ry="28" stroke="white" strokeWidth="1" opacity="0.07" />
              <line x1="20" y1="52" x2="76" y2="52" stroke="white" strokeWidth="1" opacity="0.07" />
              <polygon points="42,10 50,10 30,84 12,84" fill="white" />
              <polygon points="46,10 54,10 84,84 66,84" fill="white" />
              <rect x="21" y="45" width="54" height="13" rx="3.5" fill="url(#adG)" />
              <polygon points="48,2 38,16 58,16" fill="#FF9800" />
              <circle cx="48" cy="9" r="4" fill="#FF9800" />
            </svg>
            <div>
              <p className="font-black text-white text-sm tracking-tight">Accessible<span style={{ color: '#1565C0' }}>xpress</span></p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav data-tour="sidebar-nav" className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = tab === item.key
            return (
              <button
                key={item.key}
                onClick={() => { goTab(item.key); setSidebarOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
                style={{
                  background: active ? 'rgba(255,152,0,0.15)' : 'transparent',
                  color: active ? '#FF9800' : 'rgba(255,255,255,0.55)',
                  borderLeft: active ? '3px solid #FF9800' : '3px solid transparent',
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Bottom user / logout */}
        <div className="px-3 pb-5 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0" style={{ background: '#FF9800', color: '#0f0900' }}>A</div>
            <div>
              <p className="text-white text-xs font-bold">Administrator</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>admin@accessiblexpress</p>
            </div>
          </div>
          <button onClick={logout} data-tour="sign-out"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(21,101,192,0.15)'; e.currentTarget.style.color = '#ff8080' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      {/* min-w-0 is required here: a flex item's default min-width is "auto"
          (its content's intrinsic size), not 0 — without this, any long
          un-wrappable text on any tab (e.g. a long sender/recipient name)
          silently forces this whole column, and the page, wider than the
          viewport instead of letting its own truncate/wrap rules kick in. */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0" style={{ marginLeft: '0', paddingLeft: '0' }}>
        <div className="lg:ml-64">
          {/* Top bar */}
          <header className="sticky top-0 z-20 bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4" style={{ boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex-1">
              <h1 className="font-black text-slate-800 text-lg">{TAB_TITLES[tab]}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" style={{ animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }} />
                {shipments.length} Shipments
              </div>
              <a href="/" target="_blank" rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Site
              </a>
              <button onClick={() => { goTab('overview'); setTourActive(true) }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0"
                style={{ background: 'rgba(255,152,0,0.1)', color: '#b45309' }} title="Take a Tour">
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <span className="hidden sm:inline">Take a Tour</span>
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">
            {loadingShipments ? (
              <div className="flex items-center justify-center py-32">
                <span className="w-8 h-8 border-4 border-slate-200 border-t-yellow-400 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {tab === 'overview'     && <OverviewTab     shipments={shipments} onNavigate={goTab} />}
                {tab === 'shipments'   && <ShipmentsTab   shipments={shipments} onUpdate={handleUpdate} onDelete={handleDelete} onEdit={handleEdit} />}
                {tab === 'create'      && <CreateTab      onCreate={handleCreate} />}
                {tab === 'track'       && <TrackTab       shipments={shipments}  onUpdate={handleUpdate} />}
                {tab === 'subscribers' && <SubscribersTab />}
              </>
            )}
          </main>
        </div>
      </div>

      {tourActive && (
        <AdminTour steps={TOUR_STEPS} onNavigateTab={t => goTab(t as AdminTab)} onClose={closeTour} />
      )}
    </div>
  )
}
