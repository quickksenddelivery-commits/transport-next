'use client'
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

type NavChild = { label: string; to: string; desc: string; icon: React.ReactNode }
type NavItem  = { label: string; to: string; children?: NavChild[] }

const ICON = (d: string | string[]) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Services', to: '/services',
    children: [
      { label: 'Express Delivery',  to: '/services/express-delivery', desc: 'Same-day & next-day parcel delivery',    icon: ICON('M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z') },
      { label: 'Air Freight',       to: '/freight/air-freight',       desc: 'Global air cargo in 2–4 days',           icon: ICON('M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5') },
      { label: 'Sea Freight',       to: '/freight/ocean-freight',      desc: 'FCL & LCL ocean shipping worldwide',     icon: ICON(['M12 3v4','M3 17l2-6h14l2 6H3z','M1 21h22','M7 11V7a5 5 0 0110 0v4']) },
      { label: 'Road Transport',    to: '/freight/road-freight',       desc: 'Cross-border ground freight',            icon: ICON(['M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z','M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1V8h3l3 3v4l1 1h-1m-6 0h-3']) },
      { label: 'Warehousing',       to: '/services/warehousing',      desc: 'Storage & fulfilment in 50+ locations',  icon: ICON(['M3 9.5L12 3l9 6.5V21H3V9.5z','M9 21V12h6v9']) },
      { label: 'Customs Clearance', to: '/customs',                   desc: 'Licensed brokers, 24-hr clearance',      icon: ICON('M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z') },
    ],
  },
  {
    label: 'Freight', to: '/freight',
    children: [
      { label: 'Air Freight Carrier',      to: '/freight/air-freight',    desc: '500+ airports · 2–4 day transit',       icon: ICON('M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5') },
      { label: 'Ocean Freight Forwarding', to: '/freight/ocean-freight',  desc: '300+ ports · FCL & LCL options',        icon: ICON(['M12 3v4','M3 17l2-6h14l2 6H3z','M1 21h22','M7 11V7a5 5 0 0110 0v4']) },
      { label: 'Road Freight Forwarding',  to: '/freight/road-freight',   desc: '2,000+ vehicles · cross-border routes', icon: ICON(['M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z','M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1V8h3l3 3v4l1 1h-1m-6 0h-3']) },
      { label: 'SOC Movements',            to: '/freight/soc-movements',  desc: 'Shipper-owned container management',    icon: ICON('M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9') },
    ],
  },
  {
    label: 'Movers', to: '/movers',
    children: [
      { label: 'Household Goods',      to: '/movers/household-goods',     desc: 'Residential home moving',            icon: ICON('M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75') },
      { label: 'Commercial Goods',     to: '/movers/commercial-goods',    desc: 'Office & business relocation',       icon: ICON('M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21') },
      { label: 'International Moving', to: '/movers/international-moving',desc: 'Cross-border relocation service',    icon: ICON('M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418') },
      { label: 'Storage & Packing',    to: '/movers/storage-packing',     desc: 'Secure short & long-term storage',  icon: ICON('M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z') },
    ],
  },
  {
    label: 'Customs', to: '/customs',
    children: [
      { label: 'Import Clearance',            to: '/customs/import-clearance',         desc: 'Full import clearance, duties & compliance', icon: ICON('M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3') },
      { label: 'Export Clearance',            to: '/customs/export-clearance',         desc: 'Export declarations & permit filing',        icon: ICON('M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5') },
      { label: 'Trade Consulting',            to: '/customs/trade-consulting',         desc: 'Tariff optimisation & FTA advice',           icon: ICON('M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18') },
      { label: "Importer's Representative",   to: '/customs/importer-representative',  desc: 'Local compliance & IOR services',            icon: ICON(['M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z','M4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z']) },
    ],
  },
  { label: 'About',   to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [openDesktop, setOpenDesktop] = useState<string | null>(null)
  const [openMobile,  setOpenMobile]  = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location   = useLocation()

  const enterDesktop = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenDesktop(label)
  }
  const leaveDesktop = () => {
    closeTimer.current = setTimeout(() => setOpenDesktop(null), 140)
  }
  const toggleDesktop = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenDesktop(prev => (prev === label ? null : label))
  }
  const toggleMobile = (label: string) =>
    setOpenMobile(prev => (prev === label ? null : label))

  // Dismiss an open desktop dropdown on Escape or an outside click —
  // hover-only worked for mouse users, not keyboard or touch
  useEffect(() => {
    if (!openDesktop) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenDesktop(null) }
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-nav-group]')) setOpenDesktop(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [openDesktop])

  // Close the mobile menu on route change
  useEffect(() => { setMenuOpen(false); setOpenMobile(null) }, [location.pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ══ Tier 1 — top contact bar ══════════════════════════════ */}
      <div style={{ background: '#0D47A1', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="container mx-auto px-6 flex items-center justify-between" style={{ height: 42 }}>

          {/* Logo */}
          <Logo size={34} theme="dark" />

          {/* Contact info — hidden on small/medium screens */}
          <div className="hidden lg:flex items-center gap-7" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12.5 }}>
            <a
              href="mailto:support@accessiblexpress.com"
              className="flex items-center gap-2 transition-colors hover:text-white"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}>
                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
              </svg>
              support@accessiblexpress.com
            </a>

            <span className="w-px h-4 bg-white/10" />

            <span className="flex items-center gap-2 whitespace-nowrap">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}>
                <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Office Hours: 07 AM – 06 PM WAT
            </span>

            <span className="w-px h-4 bg-white/10" />

            <a
              href="tel:+15126785033"
              className="flex items-center gap-2 transition-colors hover:text-white"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}>
                <path d="M2.25 6.338c0 .768.107 1.51.303 2.21 1.14 4.075 4.833 7.77 8.908 8.907.7.196 1.443.303 2.21.303 2.074 0 4.012-.594 5.644-1.625M2.25 6.338C2.25 4.517 3.663 3 5.406 3h1.125c.337 0 .662.088.948.254L9.374 4.46a1.125 1.125 0 01.414 1.512L8.73 7.67a.75.75 0 00-.05.544l.052.213c.398 1.625 1.455 3.178 2.73 4.504 1.325 1.275 2.879 2.332 4.504 2.73l.213.052a.75.75 0 00.544-.05l1.696-1.057a1.125 1.125 0 011.512.414l1.207 1.9c.167.287.255.61.255.949v1.125c0 1.742-1.516 3.156-3.338 3.156"/>
              </svg>
              +1 (512) 678-5033
            </a>
          </div>

          {/* Hamburger — visible below the desktop breakpoint */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-[5px]"
            style={{ background: menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent' }}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="block rounded-full transition-all duration-300"
                style={{
                  width: i === 1 ? (menuOpen ? 20 : 13) : 20,
                  height: 2,
                  background: 'rgba(255,255,255,0.8)',
                  transform: menuOpen
                    ? i === 0 ? 'translateY(7px) rotate(45deg)'
                      : i === 2 ? 'translateY(-7px) rotate(-45deg)'
                      : 'none'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* ══ Tier 2 — main navigation bar ═════════════════════════ */}
      <nav style={{ background: '#1565C0', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        {/* Red underline accent */}
        <div style={{ height: 2, background: 'linear-gradient(90deg,#1565C0 0%,#1565C0 50%,transparent 100%)' }} />

        <div className="container mx-auto px-6">
          <div className="hidden lg:flex items-center" style={{ height: 54 }}>

            {/* Nav links */}
            <div className="flex items-center flex-1">
              {NAV.map(item => {
                const active = location.pathname === item.to

                if (!item.children) {
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="relative flex items-center px-4 text-xs font-bold tracking-widest transition-colors duration-150 whitespace-nowrap h-full"
                      style={{
                        color: active ? '#FF9800' : 'rgba(255,255,255,0.75)',
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        height: 54,
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#FF9800' }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                    >
                      {item.label}
                      {active && (
                        <span
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                          style={{ width: 28, height: 2, background: '#FF9800' }}
                        />
                      )}
                    </Link>
                  )
                }

                const isOpen = openDesktop === item.label
                const wide = item.children.length > 4

                return (
                  <div
                    key={item.label}
                    data-nav-group
                    className="relative h-full flex items-center"
                    onMouseEnter={() => enterDesktop(item.label)}
                    onMouseLeave={leaveDesktop}
                    style={{ height: 54 }}
                  >
                    <button
                      className="flex items-center gap-1 px-4 text-xs font-bold tracking-widest transition-colors duration-150 whitespace-nowrap"
                      style={{
                        color: active || isOpen ? '#FF9800' : 'rgba(255,255,255,0.75)',
                        textTransform: 'uppercase',
                        background: 'transparent',
                        height: 54,
                      }}
                      onClick={() => toggleDesktop(item.label)}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                    >
                      {item.label}
                      <svg
                        className="w-3 h-3 shrink-0"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                        style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                      >
                        <path d="M19 9l-7 7-7-7"/>
                      </svg>
                      {active && (
                        <span
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                          style={{ width: 28, height: 2, background: '#FF9800' }}
                        />
                      )}
                    </button>

                    {/* Dropdown panel */}
                    <div
                      className="absolute top-full left-0 pt-2"
                      style={{
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)',
                        pointerEvents: isOpen ? 'auto' : 'none',
                        transition: 'opacity 0.2s cubic-bezier(0.16,1,0.3,1), transform 0.2s cubic-bezier(0.16,1,0.3,1)',
                        transformOrigin: 'top left',
                        width: wide ? 560 : 300,
                        zIndex: 60,
                      }}
                    >
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{ background: 'white', boxShadow: '0 20px 60px rgba(13,20,50,0.2)', border: '1px solid rgba(0,0,0,0.06)' }}
                      >
                        {/* Gradient accent line */}
                        <div style={{ height: 3, background: 'linear-gradient(90deg,#FF9800,#1565C0)' }} />

                        {/* Header */}
                        <div className="px-5 py-3.5 flex items-center justify-between" style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>{item.label}</p>
                          <Link
                            to={item.to}
                            className="flex items-center gap-1 text-xs font-bold transition-colors"
                            style={{ color: '#1565C0', textDecoration: 'none' }}
                          >
                            View all
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M9 5l7 7-7 7"/></svg>
                          </Link>
                        </div>

                        {/* Items */}
                        <div className={`p-2 grid gap-1 ${wide ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {item.children.map(child => (
                            <Link
                              key={child.label}
                              to={child.to}
                              className="group relative flex items-start gap-3 px-3 py-2.5 rounded-xl overflow-hidden transition-colors duration-150 hover:bg-slate-50"
                              style={{ textDecoration: 'none' }}
                            >
                              <span
                                className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-200"
                                style={{ background: '#FF9800', transformOrigin: 'center' }}
                              />
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150"
                                style={{ color: '#FF9800', background: 'rgba(255,152,0,0.1)' }}
                              >
                                {child.icon}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold leading-tight" style={{ color: '#1e293b' }}>{child.label}</p>
                                <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{child.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Get a Quote CTA */}
            <Link
              to="/contact"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold shrink-0 transition-all duration-150"
              style={{
                background: '#FF9800',
                color: '#1F2937',
                textDecoration: 'none',
                boxShadow: '0 2px 12px rgba(255,152,0,0.3)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E68900'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,152,0,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF9800'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(255,152,0,0.3)' }}
            >
              Get a Quote
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M9 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ Mobile menu ═══════════════════════════════════════════ */}
      <div
        className="lg:hidden"
        style={{
          maxHeight: menuOpen ? 'calc(100vh - 42px)' : 0,
          opacity: menuOpen ? 1 : 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
          transition: 'max-height 0.35s ease, opacity 0.25s ease',
        }}
      >
        <div style={{ background: '#1565C0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-3 py-3" key={menuOpen ? 'open' : 'closed'}>

            {NAV.map((item, i) => {
              const active   = location.pathname === item.to
              const expanded = openMobile === item.label
              const itemStyle = menuOpen ? { animation: `revealUp 0.4s cubic-bezier(0.16,1,0.3,1) both`, animationDelay: `${i * 0.04}s` } : {}

              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold tracking-wider transition-colors"
                    style={{
                      color: active ? '#FF9800' : 'rgba(255,255,255,0.75)',
                      background: active ? 'rgba(255,152,0,0.08)' : 'transparent',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      ...itemStyle,
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#FF9800' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                  >
                    {item.label}
                    {active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF9800' }} />}
                  </Link>
                )
              }

              return (
                <div key={item.label} className="mb-0.5" style={itemStyle}>
                  <button
                    onClick={() => toggleMobile(item.label)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold tracking-wider transition-colors"
                    style={{
                      color: expanded || active ? '#FF9800' : 'rgba(255,255,255,0.75)',
                      background: expanded ? 'rgba(255,152,0,0.08)' : 'transparent',
                      textTransform: 'uppercase',
                    }}
                    aria-expanded={expanded}
                  >
                    <span>{item.label}</span>
                    <svg
                      className="w-4 h-4 shrink-0"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      style={{ transition: 'transform 0.22s', transform: expanded ? 'rotate(180deg)' : 'none', color: 'rgba(255,255,255,0.3)' }}
                    >
                      <path d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>

                  <div
                    className="overflow-hidden"
                    style={{ maxHeight: expanded ? `${item.children.length * 58 + 52}px` : 0, transition: 'max-height 0.28s ease' }}
                  >
                    <div className="mx-3 mb-2 rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
                      <Link
                        to={item.to}
                        className="flex items-center justify-between px-4 py-3 text-xs font-bold tracking-widest uppercase border-b transition-colors"
                        style={{ color: '#1565C0', textDecoration: 'none', borderColor: 'rgba(0,0,0,0.07)' }}
                      >
                        <span>{item.label} Overview</span>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M9 5l7 7-7 7"/></svg>
                      </Link>
                      {item.children.map((child, idx) => (
                        <Link
                          key={child.label}
                          to={child.to}
                          className="flex items-center gap-3 px-4 py-3 transition-colors"
                          style={{ textDecoration: 'none', borderTop: idx > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ color: '#1565C0', background: 'rgba(21,101,192,0.08)' }}>
                            {child.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold leading-tight" style={{ color: '#1e293b' }}>{child.label}</p>
                            <p className="text-xs mt-0.5 truncate" style={{ color: '#64748b' }}>{child.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile CTAs */}
          <div className="px-4 pb-5 pt-1 flex flex-col gap-2">
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: '#FF9800', color: '#1F2937', textDecoration: 'none', boxShadow: '0 4px 16px rgba(255,152,0,0.3)' }}
            >
              Get a Quote
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M9 5l7 7-7 7"/></svg>
            </Link>
            <Link
              to="/track"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
              Track Shipment
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
