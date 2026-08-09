'use client'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setToken } from '../lib/api'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token } = await api.login(form.email, form.password)
      setToken(token)
      navigate('/admin')
    } catch (err) {
      const message = (err as Error).message
      setError(
        message === 'Failed to fetch'
          ? 'Could not reach the server. It may still be starting up after being idle — please wait a few seconds and try again.'
          : message || 'Invalid username or password.'
      )
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 60%, #1976D2 100%)' }}>
      {/* Background dot grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      {/* Glow blobs */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,152,0,0.12) 0%, transparent 70%)' }} />
      <div className="fixed bottom-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(21,101,192,0.10) 0%, transparent 70%)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex mb-4">
            <svg width="64" height="64" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="alG" x1="0" y1="0" x2="1" y2="0">
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
              <rect x="21" y="45" width="54" height="13" rx="3.5" fill="url(#alG)" />
              <polygon points="48,2 38,16 58,16" fill="#FF9800" />
              <circle cx="48" cy="9" r="4" fill="#FF9800" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Accessible<span style={{ color: '#1565C0' }}>xpress</span></h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Admin Control Panel</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)' }}>
          <h2 className="text-xl font-black text-white mb-1">Sign in to Admin</h2>
          <p className="text-sm mb-7" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Enter your credentials to access the dashboard.
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-5 text-sm" style={{ background: 'rgba(21,101,192,0.15)', border: '1px solid rgba(21,101,192,0.3)', color: '#1565C0' }}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Email Address
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
                onFocus={e => { e.currentTarget.style.border = '1px solid #FF9800'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
                  onFocus={e => { e.currentTarget.style.border = '1px solid #FF9800'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                  onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-2 transition-all"
              style={{ background: '#FF9800', color: '#1F2937', opacity: loading ? 0.8 : 1 }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 rounded-full inline-block" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#1565C0', animation: 'spin 1s linear infinite' }} />
                  Signing in…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Accessiblexpress · Admin Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
