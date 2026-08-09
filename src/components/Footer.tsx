'use client'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import Reveal from './Reveal'
import Logo from './Logo'

const YEAR = new Date().getFullYear()

const LINKS: Record<string, { label: string; href: string }[]> = {
  Company: [
    { label: 'About Us',     href: '/about' },
  ],
  Services: [
    { label: 'Express Delivery',   href: '/services' },
    { label: 'Air & Ocean Freight', href: '/freight' },
    { label: 'Road Freight',       href: '/freight' },
    { label: 'Home & Office Movers',href: '/movers' },
    { label: 'Customs Clearance',  href: '/customs' },
    { label: 'Warehousing',        href: '/services' },
  ],
  Support: [
    { label: 'Help Center',  href: '/help' },
    { label: 'Track Shipment',href: '/track' },
    { label: 'Live Chat',    href: '/contact' },
    { label: 'Contact Sales',href: '/contact' },
    { label: 'System Status',href: '/help' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Cookie Policy', href: '/legal/cookies' },
    { label: 'Shipping Policy', href: '/legal/shipping' },
    { label: 'Insurance Terms', href: '/legal/insurance' },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subState, setSubState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const subscribe = async () => {
    if (!email || subState === 'sending' || subState === 'sent') return
    setSubState('sending')
    try {
      await api.subscribe(email)
      setSubState('sent')
      setEmail('')
    } catch {
      setSubState('error')
      setTimeout(() => setSubState('idle'), 3500)
    }
  }

  return (
    <footer style={{ background: '#1565C0' }}>
      <div className="container mx-auto px-6 pt-16 pb-8">
        {/* Top grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand col (spans 2) */}
          <Reveal direction="left" className="lg:col-span-2">
            <div className="mb-4">
              <Logo size={38} theme="dark" />
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Your trusted global logistics partner. Fast, secure, and transparent shipping to 120+ countries worldwide.
            </p>
            {/* Contact info */}
            <div className="space-y-2 text-sm text-white/50">
              <p className="flex items-start gap-2"><svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>3800 N Lamar Blvd, Suite 200, Austin, TX 78756, USA</p>
              <p className="flex items-center gap-2"><svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M2.25 6.338c0 .768.107 1.51.303 2.21 1.14 4.075 4.833 7.77 8.908 8.907.7.196 1.443.303 2.21.303 2.074 0 4.012-.594 5.644-1.625M2.25 6.338C2.25 4.517 3.663 3 5.406 3h1.125c.337 0 .662.088.948.254L9.374 4.46a1.125 1.125 0 01.414 1.512L8.73 7.67a.75.75 0 00-.05.544l.052.213c.398 1.625 1.455 3.178 2.73 4.504 1.325 1.275 2.879 2.332 4.504 2.73l.213.052a.75.75 0 00.544-.05l1.696-1.057a1.125 1.125 0 011.512.414l1.207 1.9c.167.287.255.61.255.949v1.125c0 1.742-1.516 3.156-3.338 3.156"/></svg>+1 (512) 678-5033</p>
              <p className="flex items-center gap-2"><svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>hello@accessiblexpress.com</p>
            </div>
          </Reveal>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items], colIdx) => (
            <Reveal key={section} direction="up" delay={0.1 + colIdx * 0.08}>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{section}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link to={item.href} className="text-white/45 text-sm hover:text-white hover:translate-x-0.5 inline-block transition-all duration-150">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {/* Newsletter */}
        <Reveal direction="up" delay={0.05}>
        <div className="border border-white/10 rounded-2xl p-6 mb-10 bg-white/[0.03]">
          {subState === 'sent' ? (
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0"><svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></span>
              <div>
                <p className="text-white font-bold">You're subscribed!</p>
                <p className="text-white/50 text-sm">Thanks for joining — check your inbox for a confirmation email.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h4 className="text-white font-bold mb-1">Stay Informed</h4>
                <p className="text-white/50 text-sm">
                  {subState === 'error'
                    ? <span style={{ color: '#1565C0' }}>Something went wrong — please try again.</span>
                    : 'Get shipping tips, industry news, and exclusive offers.'}
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && subscribe()}
                  placeholder="Enter your email address"
                  className="flex-1 md:w-64 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none focus:border-yellow-400 transition-colors"
                />
                <button onClick={subscribe} disabled={subState === 'sending'} className="btn-primary py-3! px-5! text-sm! shrink-0 disabled:opacity-60">
                  {subState === 'sending'
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block animate-spin" />
                    : 'Subscribe'}
                </button>
              </div>
            </div>
          )}
        </div>
        </Reveal>

        {/* Bottom bar */}
        <Reveal direction="up" delay={0.1}>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-sm">© {YEAR} Accessiblexpress Ltd. All rights reserved.</p>
          <div className="flex gap-5 text-white/30 text-xs">
            {[
              { label: 'Privacy',     href: '/legal/privacy' },
              { label: 'Terms',       href: '/legal/terms' },
              { label: 'Cookies',     href: '/legal/cookies' },
              { label: 'Sitemap',     href: '/' },
              { label: 'Admin Login', href: '/admin/login' },
            ].map(l => (
              <Link key={l.label} to={l.href} className="hover:text-white/60 transition-colors" style={{ textDecoration: 'none' }}>{l.label}</Link>
            ))}
          </div>
        </div>
        </Reveal>
      </div>
    </footer>
  )
}
