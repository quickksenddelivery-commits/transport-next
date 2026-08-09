// The frontend is served by the same Next.js app as the API — every request
// is same-origin, so the base is the empty string.
export const BASE = ''
export const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET

// ── Token helpers ──────────────────────────────────────────────────────────
export const TOKEN_KEY = 'qsd_admin_token'
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

// ── Shared types ───────────────────────────────────────────────────────────
export type ShipStatus =
  | 'pending'
  | 'confirmed'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed'
  | 'cancelled'
  | 'returned'

export interface ShipEvent {
  _id?: string
  time: string
  date: string
  location: string
  lat?: number
  lng?: number
  desc: string
  type: string
}

export interface ShipParty {
  name: string
  phone?: string
  email?: string
  street?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
}

export interface AdminShipment {
  id: string
  trackingNumber: string
  sender: ShipParty
  recipient: ShipParty
  service: string
  weight: number
  dimensions: { length?: number; width?: number; height?: number }
  contents: string
  declaredValue: number
  price?: number
  status: ShipStatus
  createdAt: string
  eta: string
  deliveredAt?: string
  events: ShipEvent[]
  notes?: string
  // Set only on the object returned from updateShipment/addEvent — reflects
  // whether a customer notification email was sent by that specific call,
  // not a persisted property of the shipment itself.
  notifiedOnLastUpdate?: boolean
  notifyErrorOnLastUpdate?: string
}

function normalizeShipment(s: Record<string, unknown>): AdminShipment {
  return { ...(s as unknown as AdminShipment), id: (s._id ?? s.id) as string }
}

export interface QuoteOption {
  label: string
  days: string
  rate: number
}

export interface QuoteResponse {
  basePrice: number
  options: QuoteOption[]
}

export interface QuoteRequest {
  from: string
  to: string
  weight: number
  length: number
  width: number
  height: number
  service?: string
}

// Public track response — personal details are masked by the backend
export interface PublicShipment {
  trackingNumber: string
  status: ShipStatus
  service: string
  eta?: string
  deliveredAt?: string
  createdAt: string
  sender: { name: string; city?: string; country?: string }
  recipient: { name: string; city?: string; country?: string; email?: string }
  weight: number
  events: ShipEvent[]
}

export interface ContactRequest {
  name: string
  email: string
  company?: string
  subject: string
  message: string
}

export interface Subscriber {
  id: string
  email: string
  subscribedAt: string
  active: boolean
}

// ── Core fetch wrapper ─────────────────────────────────────────────────────
async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (res.status === 401) {
    clearToken()
    if (typeof window !== 'undefined') {
      const loginUrl = new URL('/admin/login', window.location.origin).toString()
      window.location.assign(loginUrl)
    }
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  const json = await res.json().catch(() => null)
  if (json && typeof json === 'object' && (json as Record<string, unknown>).status === 'success' && 'data' in (json as Record<string, unknown>)) {
    return ((json as Record<string, unknown>).data ?? json) as T
  }
  return json as T
}

// ── API surface ────────────────────────────────────────────────────────────
export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string }>(
      'POST',
      '/api/auth/login',
      { email, password },
      ADMIN_SECRET ? { 'x-admin-secret': ADMIN_SECRET } : undefined
    ),

  logout: () =>
    request<void>('POST', '/api/auth/logout'),

  me: () =>
    request<{ username: string }>('GET', '/api/auth/me'),

  // Public — tracking
  track: async (id: string): Promise<PublicShipment> => {
    const res = await request<unknown>('GET', `/api/track/${encodeURIComponent(id)}`)
    const r = res as Record<string, unknown>
    return ((r.data as Record<string, unknown>)?.shipment ?? (r.shipment as PublicShipment) ?? r) as PublicShipment
  },

  // Public — quote calculator
  quote: (body: QuoteRequest) =>
    request<QuoteResponse>('POST', '/api/quotes/calculate', body),

  // Public — contact form
  contact: (body: ContactRequest) =>
    request<void>('POST', '/api/contact', body),

  // Public — newsletter subscription
  subscribe: (email: string) =>
    request<{ message: string }>('POST', '/api/subscribe', { email }),

  unsubscribe: (email: string) =>
    request<{ message: string }>('POST', '/api/subscribe/unsubscribe', { email }),

  // Admin — subscribers list (JWT protected)
  listSubscribers: async () => {
    const res = await request<unknown>('GET', '/api/subscribe')
    const r = res as Record<string, unknown>
    const arr = (r.data as Record<string, unknown>)?.subscribers ?? r.subscribers ?? r
    const raw = Array.isArray(arr) ? arr : []
    return raw.map((s: Record<string, unknown>): Subscriber => ({
      id:           (s._id ?? s.id) as string,
      email:        s.email as string,
      subscribedAt: (s.createdAt ?? s.subscribedAt) as string,
      active:       (s.isActive ?? s.active) as boolean,
    }))
  },

  // Admin — shipments (all protected)
  listShipments: async (params?: { status?: string; search?: string }) => {
    const qs = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : ''
    const res = await request<unknown>('GET', `/api/admin/shipments${qs ? `?${qs}` : ''}`)
    const r = res as Record<string, unknown>
    const arr: Record<string, unknown>[] = Array.isArray(r)
      ? r
      : Array.isArray((r.data as Record<string, unknown>)?.shipments)
        ? (r.data as Record<string, unknown>).shipments as Record<string, unknown>[]
        : Array.isArray(r.shipments) ? r.shipments as Record<string, unknown>[]
        : Array.isArray(r.data) ? r.data as Record<string, unknown>[]
        : []
    return arr.map(normalizeShipment)
  },

  createShipment: async (body: unknown) => {
    const res = await request<unknown>('POST', '/api/admin/shipments', body)
    const r = res as Record<string, unknown>
    const s = ((r.data as Record<string, unknown>)?.shipment ?? r.shipment ?? r) as Record<string, unknown>
    return normalizeShipment(s)
  },

  getShipment: async (id: string) => {
    const res = await request<unknown>('GET', `/api/admin/shipments/${encodeURIComponent(id)}`)
    const r = res as Record<string, unknown>
    const s = ((r.data as Record<string, unknown>)?.shipment ?? r.shipment ?? r) as Record<string, unknown>
    return normalizeShipment(s)
  },

  updateShipment: async (id: string, body: unknown) => {
    const res = await request<unknown>('PATCH', `/api/admin/shipments/${encodeURIComponent(id)}`, body)
    const r = res as Record<string, unknown>
    const data = r.data as Record<string, unknown> | undefined
    const s = (data?.shipment ?? r.shipment ?? r) as Record<string, unknown>
    return {
      ...normalizeShipment(s),
      notifiedOnLastUpdate: Boolean(data?.notified),
      notifyErrorOnLastUpdate: data?.notifyError as string | undefined,
    }
  },

  deleteShipment: (id: string) =>
    request<void>('DELETE', `/api/admin/shipments/${encodeURIComponent(id)}`),

  addEvent: async (id: string, event: Omit<ShipEvent, '_id'>) => {
    const res = await request<unknown>('POST', `/api/admin/shipments/${encodeURIComponent(id)}/events`, event)
    const r = res as Record<string, unknown>
    const data = r.data as Record<string, unknown> | undefined
    const s = (data?.shipment ?? r.shipment ?? r) as Record<string, unknown>
    return {
      ...normalizeShipment(s),
      notifiedOnLastUpdate: Boolean(data?.notified),
      notifyErrorOnLastUpdate: data?.notifyError as string | undefined,
    }
  },

  updateEvent: async (id: string, eventId: string, patch: Partial<Omit<ShipEvent, '_id'>>) => {
    const res = await request<unknown>('PATCH', `/api/admin/shipments/${encodeURIComponent(id)}/events/${encodeURIComponent(eventId)}`, patch)
    const r = res as Record<string, unknown>
    const s = ((r.data as Record<string, unknown>)?.shipment ?? r.shipment ?? r) as Record<string, unknown>
    return normalizeShipment(s)
  },

  deleteEvent: async (id: string, eventId: string) => {
    const res = await request<unknown>('DELETE', `/api/admin/shipments/${encodeURIComponent(id)}/events/${encodeURIComponent(eventId)}`)
    const r = res as Record<string, unknown>
    const s = ((r.data as Record<string, unknown>)?.shipment ?? r.shipment ?? r) as Record<string, unknown>
    return normalizeShipment(s)
  },

  geocode: async (q: string) => {
    const res = await request<unknown>('GET', `/api/admin/geocode?q=${encodeURIComponent(q)}`)
    const r = res as Record<string, unknown>
    const data = r.data as Record<string, unknown> | undefined
    const result = data?.result as { lat: number; lng: number } | null | undefined
    return result ?? null
  },
}
