'use client'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HeroTrackBar() {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (q) navigate(`/track?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="flex flex-col md:flex-row shadow-2xl" style={{ borderTop: '4px solid #FF9800' }}>

      {/* Left — tracking input (white panel) */}
      <div className="flex-1 bg-white">
        <form onSubmit={submit} className="flex flex-col md:flex-row items-stretch w-full h-full">
          {/* Input */}
          <div className="flex-1 relative flex items-center">
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
              style={{ color: '#1565C0' }}
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
              placeholder="Enter Your Tracking Number…"
              aria-label="Shipment tracking number"
              className="w-full pl-14 pr-4 outline-none font-semibold"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#1F2937',
                caretColor: '#FF9800',
                fontSize: 15,
                height: 72,
              }}
            />
          </div>
          {/* Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2.5 px-10 font-bold transition-all duration-150 whitespace-nowrap text-sm uppercase tracking-wide"
            style={{ background: '#FF9800', color: '#1F2937', minHeight: 72, letterSpacing: '0.06em' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E68900' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FF9800' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            Track &amp; Trace
          </button>
        </form>
      </div>

      {/* Right — value props (deep blue panel) */}
      <div
        className="flex items-stretch divide-x md:w-auto"
        style={{ background: '#0D47A1', borderLeft: '1px solid rgba(255,255,255,0.1)' }}
      >
        {[
          {
            icon: (
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}>
                <circle cx="12" cy="12" r="9"/>
                <path d="M14.5 9a2.5 2.5 0 00-5 0v1.5a2.5 2.5 0 005 0"/>
                <path d="M12 14v3m0 0H9.5m2.5 0H14.5"/>
              </svg>
            ),
            label: 'Affordable Premium',
            sub: 'Shipping Worldwide',
          },
          {
            icon: (
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}>
                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
              </svg>
            ),
            label: 'Safe & Reliable',
            sub: 'Courier Services',
          },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 px-6 py-5" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
            <span style={{ color: '#FF9800' }}>{item.icon}</span>
            <div>
              <p className="text-white font-bold text-sm leading-tight">{item.label}</p>
              <p className="text-sm leading-tight" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
