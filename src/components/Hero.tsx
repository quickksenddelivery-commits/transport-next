'use client'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const SLIDES = [
  {
    eyebrow: 'Global Logistics · 120+ Countries · Rated 4.9★',
    title: 'Delivering\nExcellence\nWorldwide',
    sub: 'Our service is available 24/7 to meet your unique on-demand and scheduled delivery needs across the globe.',
    cta1: { label: 'Get a Quote',    to: '/contact' },
    cta2: { label: 'Track Shipment', to: '/track' },
    image: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    eyebrow: 'Air Freight · 500+ Airports · 2–4 Day Transit',
    title: 'Air Cargo\nThat Arrives\nin Days, Not Weeks',
    sub: 'Express global air freight with real-time tracking from pickup to delivery at over 500 airports worldwide.',
    cta1: { label: 'Air Freight Services', to: '/freight' },
    cta2: { label: 'Get a Quote',          to: '/contact' },
    image: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    eyebrow: 'Ocean Freight · 300+ Ports · FCL & LCL',
    title: 'Move More.\nSpend Less.\nShip Ocean.',
    sub: 'Cost-effective FCL & LCL ocean shipping to 120+ countries with full customs clearance included.',
    cta1: { label: 'Ocean Freight', to: '/freight' },
    cta2: { label: 'Get a Quote',   to: '/contact' },
    image: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    eyebrow: 'Home & Office Movers · Professional Relocation',
    title: "We Handle\nEvery Move\nLike It's Our Own",
    sub: 'Professional relocation services for households and businesses — local, national, and international.',
    cta1: { label: 'Movers Services', to: '/movers' },
    cta2: { label: 'Get a Quote',     to: '/contact' },
    image: 'https://images.pexels.com/photos/4246122/pexels-photo-4246122.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
]

const LIVE_EVENTS = [
  { city: 'New York, USA',  status: 'Delivered',       dot: '#FF9800' },
  { city: 'London, UK',     status: 'In Transit',       dot: '#1565C0' },
  { city: 'Dubai, UAE',     status: 'Dispatched',       dot: '#FF9800' },
  { city: 'Tokyo, Japan',   status: 'Delivered',        dot: '#FF9800' },
  { city: 'Accra, Ghana',   status: 'Out for Delivery', dot: '#1565C0' },
  { city: 'Sydney, AU',     status: 'Processing',       dot: '#FF9800' },
  { city: 'Paris, France',  status: 'Delivered',        dot: '#FF9800' },
  { city: 'Singapore',      status: 'In Transit',       dot: '#1565C0' },
  { city: 'Austin, TX',     status: 'Delivered',        dot: '#FF9800' },
  { city: 'Toronto, CA',    status: 'Customs Cleared',  dot: '#FF9800' },
]

const STATS = [
  { val: '1M+',   label: 'Packages Delivered', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg> },
  { val: '120+',  label: 'Countries Served',   icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 21a9 9 0 100-18 9 9 0 000 18z"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3c-2.485 0-4.5 4.03-4.5 9s2.015 9 4.5 9 4.5-4.03 4.5-9-2.015-9-4.5-9z"/></svg> },
  { val: '15K+',  label: 'Business Clients',   icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/></svg> },
  { val: '99.2%', label: 'On-Time Delivery',   icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
]

const DURATION = 6000

export default function Hero() {
  const [slide,    setSlide]    = useState(0)
  const [animKey,  setAnimKey]  = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = (i: number) => {
    setSlide(i)
    setAnimKey(k => k + 1)
    setProgress(0)
  }
  const next = () => goTo((slide + 1) % SLIDES.length)
  const prev = () => goTo((slide - 1 + SLIDES.length) % SLIDES.length)

  useEffect(() => {
    if (timerRef.current)  clearTimeout(timerRef.current)
    if (progRef.current)   clearInterval(progRef.current)
    setProgress(0)
    const start = Date.now()
    progRef.current  = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / DURATION) * 100, 100)
      setProgress(pct)
    }, 40)
    timerRef.current = setTimeout(next, DURATION)
    return () => {
      if (timerRef.current)  clearTimeout(timerRef.current)
      if (progRef.current)   clearInterval(progRef.current)
    }
  }, [slide])

  const s = SLIDES[slide]

  return (
    <section className="relative flex flex-col overflow-hidden" style={{ minHeight: '100vh', background: '#1565C0' }}>

      {/* ── Keyframe definitions ─────────────────────────── */}
      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1.0) translate(0%, 0%); }
          to   { transform: scale(1.08) translate(-1.5%, -0.5%); }
        }
        @keyframes heroFadeSlide {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroSlideRight {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes heroBgFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>

      {/* ── Slide backgrounds ─────────────────────────────── */}
      {SLIDES.map((sl, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === slide ? 1 : 0,
            transition: 'opacity 1.1s cubic-bezier(0.4,0,0.2,1)',
            zIndex: 1,
          }}
        >
          {/* key changes when slide becomes active → remounts img → restarts kenBurns */}
          <img
            key={i === slide ? `a${slide}` : `i${i}`}
            src={sl.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ animation: i === slide ? 'kenBurns 7s ease-out forwards' : 'none', transformOrigin: 'center center' }}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          {/* Gradient: dark left → semi-dark right */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(108deg, rgba(8,5,48,0.97) 0%, rgba(13,8,64,0.88) 38%, rgba(13,8,64,0.6) 62%, rgba(13,8,64,0.22) 100%)' }} />
        </div>
      ))}

      {/* ── Content ──────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col justify-center relative"
        style={{
          zIndex: 10,
          paddingTop:    'clamp(110px, 14vw, 140px)',
          paddingBottom: 28,
          paddingLeft:   'clamp(28px, 8vw, 160px)',
          paddingRight:  'clamp(20px, 5vw, 80px)',
        }}
      >
        {/* Eyebrow badge */}
        <div
          key={`eye-${animKey}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
            animation: 'heroSlideRight 0.55s cubic-bezier(0.22,1,0.36,1) both',
            animationDelay: '0s',
          }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(21,101,192,0.18)', border: '1px solid rgba(21,101,192,0.45)', color: '#FF9800' }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#1565C0', boxShadow: '0 0 6px #1565C0' }} />
            {s.eyebrow}
          </span>
        </div>

        {/* Headline — each line staggers in */}
        <div style={{ overflow: 'hidden' }}>
          {s.title.split('\n').map((line, li) => (
            <div
              key={`${animKey}-${li}`}
              style={{
                animation: 'heroFadeSlide 0.6s cubic-bezier(0.22,1,0.36,1) both',
                animationDelay: `${0.08 + li * 0.1}s`,
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontWeight: 900,
                  fontSize: 'clamp(36px, 5.8vw, 80px)',
                  lineHeight: 1.0,
                  letterSpacing: '-2px',
                  color: li === 0 ? 'white' : li === 1 ? '#FF9800' : 'rgba(255,255,255,0.75)',
                }}
              >
                {line}
              </span>
            </div>
          ))}
        </div>

        {/* Red accent line */}
        <div
          key={`ln-${animKey}`}
          style={{
            width: 64,
            height: 3,
            borderRadius: 2,
            background: 'linear-gradient(90deg,#1565C0,#1565C0)',
            marginTop: 16,
            marginBottom: 20,
            transformOrigin: 'left',
            animation: 'lineGrow 0.5s cubic-bezier(0.22,1,0.36,1) both',
            animationDelay: '0.38s',
          }}
        />

        {/* Subtitle */}
        <p
          key={`sub-${animKey}`}
          style={{
            color: 'rgba(255,255,255,0.52)',
            fontSize: 'clamp(14px, 1.5vw, 17px)',
            maxWidth: 500,
            lineHeight: 1.75,
            animation: 'heroFadeSlide 0.6s cubic-bezier(0.22,1,0.36,1) both',
            animationDelay: '0.3s',
          }}
        >
          {s.sub}
        </p>

        {/* CTA buttons */}
        <div
          key={`cta-${animKey}`}
          className="flex flex-wrap items-center gap-3"
          style={{
            marginTop: 28,
            animation: 'heroFadeSlide 0.6s cubic-bezier(0.22,1,0.36,1) both',
            animationDelay: '0.4s',
          }}
        >
          <Link
            to={s.cta1.to}
            className="flex items-center gap-2 px-7 py-3.5 rounded-lg text-sm font-bold transition-all duration-200"
            style={{ background: '#FF9800', color: '#1F2937', textDecoration: 'none', boxShadow: '0 4px 24px rgba(255,152,0,0.35)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,152,0,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,152,0,0.35)' }}
          >
            {s.cta1.label}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M9 5l7 7-7 7"/></svg>
          </Link>
          <Link
            to={s.cta2.to}
            className="flex items-center gap-2 px-7 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.28)', background: 'rgba(255,255,255,0.05)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'none' }}
          >
            {s.cta2.label}
          </Link>
        </div>

        {/* ── Navigation controls ──────────────────────── */}
        <div
          className="flex items-center gap-5"
          style={{ marginTop: 40 }}
        >
          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="flex items-center justify-center rounded-full transition-all duration-200"
              style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'scale(1.08)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none' }}
              aria-label="Previous"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button
              onClick={next}
              className="flex items-center justify-center rounded-full transition-all duration-200"
              style={{ width: 42, height: 42, background: '#1565C0' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0D47A1'; e.currentTarget.style.transform = 'scale(1.08)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1565C0'; e.currentTarget.style.transform = 'none' }}
              aria-label="Next"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>

          {/* Progress bar indicators */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className="relative overflow-hidden rounded-full transition-all duration-400"
                style={{
                  width: i === slide ? 52 : 10,
                  height: 4,
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                {i === slide && (
                  <span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ width: `${progress}%`, background: '#FF9800', transition: 'width 0.04s linear' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Slide counter */}
          <div
            className="ml-2 flex items-baseline gap-1"
            style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', userSelect: 'none' }}
          >
            <span style={{ fontSize: 20, fontWeight: 900, color: 'rgba(255,255,255,0.65)', lineHeight: 1 }}>
              {String(slide + 1).padStart(2, '0')}
            </span>
            <span style={{ margin: '0 2px' }}>/</span>
            <span>{String(SLIDES.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* ── Live Activity Ticker ──────────────────────────── */}
      <div
        className="relative overflow-hidden py-2.5"
        style={{ zIndex: 10, background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex gap-10 animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...LIVE_EVENTS, ...LIVE_EVENTS].map((ev, i) => (
            <span key={i} className="flex items-center gap-2.5 shrink-0" style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12 }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ev.dot }} />
              <strong style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{ev.city}</strong>
              <span style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
              {ev.status}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats strip ──────────────────────────────────── */}
      <div
        className="relative grid grid-cols-2 sm:grid-cols-4"
        style={{ zIndex: 10, background: 'rgba(8,5,48,0.88)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {STATS.map((st, i) => (
          <div
            key={st.label}
            className="flex flex-col items-center justify-center py-5 px-4 text-center"
            style={{ borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
          >
            <div className="mb-1.5 opacity-35 text-white">{st.icon}</div>
            <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, color: 'white', lineHeight: 1 }}>{st.val}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.4px' }}>{st.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
