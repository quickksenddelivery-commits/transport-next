'use client'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuickTrack() {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (q) navigate(`/track?q=${encodeURIComponent(q)}`)
  }

  return (
    <section style={{ background: '#0D47A1', borderTop: '1px solid rgba(255,152,0,0.15)' }}>
      <div className="container mx-auto px-6 py-12 md:py-16">

        <div className="max-w-4xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-px" style={{ background: '#FF9800' }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(255,152,0,0.7)' }}>
                Real-Time Tracking
              </span>
              <div className="w-8 h-px" style={{ background: '#FF9800' }} />
            </div>
            <h2 className="font-black text-white" style={{ fontSize: 'clamp(24px,3vw,36px)', letterSpacing: '-0.5px' }}>
              Where Is Your Shipment?
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Enter your tracking number for live updates on location, status, and estimated delivery.
            </p>
          </div>

          {/* Input */}
          <form onSubmit={submit} className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              >
                <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
              </svg>
              <input
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="e.g. QSD-2025-123456"
                className="w-full pl-11 pr-4 py-4 rounded-xl text-sm font-medium outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white',
                  caretColor: '#FF9800',
                }}
                onFocus={e => { e.currentTarget.style.border = '1px solid rgba(255,152,0,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)' }}
                onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              />
            </div>
            <button
              type="submit"
              className="shrink-0 flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-bold transition-all duration-150"
              style={{ background: '#FF9800', color: '#1F2937' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E68900' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF9800' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}>
                <path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
              </svg>
              Track
            </button>
          </form>

          {/* Footer row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {[
              { val: '1M+', label: 'Packages tracked' },
              { val: '120+', label: 'Countries covered' },
              { val: 'Live', label: 'Real-time updates' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="font-black text-sm" style={{ color: '#FF9800' }}>{s.val}</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</span>
              </div>
            ))}
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <a
              href="https://wa.me/15126785033"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.853L0 24l6.335-1.51A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.213-3.728.889.929-3.628-.234-.373A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
              Track via WhatsApp
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
