'use client'
import PageMeta from '../components/PageMeta'
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  {
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>,
    title: 'Tracking & Delivery',
    desc: 'Track your shipment, understand statuses, and delivery timelines.',
    count: 14,
  },
  {
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>,
    title: 'Shipping & Rates',
    desc: 'How to book, get a quote, and understand our pricing.',
    count: 18,
  },
  {
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>,
    title: 'Customs & Clearance',
    desc: 'Import/export requirements, duties, and documentation.',
    count: 11,
  },
  {
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>,
    title: 'Account & Billing',
    desc: 'Managing your account, invoices, and payment methods.',
    count: 9,
  },
  {
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>,
    title: 'Claims & Disputes',
    desc: 'Lost or damaged shipments, refund policies, and how to file a claim.',
    count: 7,
  },
  {
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/></svg>,
    title: 'API & Integrations',
    desc: 'Developer docs, webhooks, and third-party integrations.',
    count: 12,
  },
]

const FAQS = [
  { q: 'How do I track my shipment?', a: 'Visit our Track page and enter your tracking number (format: QSD-XXXX-XXXXXX). You can also track via WhatsApp by sending your tracking number to +1 (512) 678-5033.' },
  { q: 'What does "In Transit" mean?', a: "Your shipment has left the origin facility and is on its way to the destination. You'll receive an update when it arrives at the next hub." },
  { q: 'How do I get a shipping quote?', a: 'Use our online Quote Calculator on the homepage, or contact our sales team at support@accessiblexpress.com for custom business rates.' },
  { q: 'What items are prohibited?', a: 'We cannot ship hazardous materials, live animals, currency, illegal substances, or items prohibited by destination country regulations. Contact us for a full list.' },
  { q: 'What happens if my package is lost?', a: 'All shipments are insured up to $100 by default. You can file a claim within 30 days of the expected delivery date. Visit our Claims page or email claims@accessiblexpress.com.' },
  { q: 'Can I change the delivery address after booking?', a: 'Yes, address changes are possible before the shipment is out for delivery. Contact our support team as soon as possible with your tracking number.' },
]

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const faqRef = useRef<HTMLDivElement>(null)

  const filteredFAQs = FAQS.filter(
    f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  )
  const searchCount = search ? filteredFAQs.length : FAQS.length

  return (
    <main style={{ paddingTop: 98 }}>
      <PageMeta title="Help Center" description="Answers to your shipping questions — tracking, customs, claims, billing, and more." />

      {/* Hero + search */}
      <section style={{ background: 'linear-gradient(135deg,#0D47A1 0%,#1565C0 60%,#1976D2 100%)', padding: '64px 0 56px' }}>
        <div className="container mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5" style={{ background: 'rgba(255,152,0,0.12)', border: '1px solid rgba(255,152,0,0.3)', color: '#FF9800' }}>
            Help Center
          </span>
          <h1 className="font-black text-white mb-3" style={{ fontSize: 'clamp(32px,4.5vw,56px)', letterSpacing: '-1px' }}>
            How Can We Help?
          </h1>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 17, maxWidth: 420, margin: '0 auto 32px' }}>
            Search our knowledge base or browse topics below.
          </p>
          <div className="max-w-xl mx-auto flex gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for answers… e.g. track shipment, customs, refund"
              className="flex-1 rounded-xl px-5 py-3.5 text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
            />
            <button
              onClick={() => faqRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold shrink-0"
              style={{ background: '#FF9800', color: '#1F2937' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
              Search
            </button>
          </div>
          {search && (
            <p className="text-white/50 text-sm mt-4">{searchCount} result{searchCount !== 1 ? 's' : ''} found</p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16" style={{ background: '#f8fafc' }}>
        <div className="container mx-auto px-6">
          <h2 className="font-black text-slate-900 mb-8 text-center" style={{ fontSize: 'clamp(24px,3vw,36px)', letterSpacing: '-0.5px' }}>Browse by Topic</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map(cat => (
              <div key={cat.title} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ background: 'rgba(21,101,192,0.07)', color: '#1565C0' }}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-1.5 group-hover:text-[#1565C0] transition-colors">{cat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-3">{cat.desc}</p>
                <span className="text-xs font-semibold text-slate-400">{cat.count} articles</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section ref={faqRef} className="py-16" style={{ background: 'white' }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-black text-slate-900 mb-8" style={{ fontSize: 'clamp(24px,3vw,36px)', letterSpacing: '-0.5px' }}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {filteredFAQs.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No results found. Try a different search term or <Link to="/contact" className="text-[#1565C0] font-semibold">contact support</Link>.</p>
            ) : filteredFAQs.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  style={{ background: openFaq === i ? 'rgba(21,101,192,0.04)' : 'white' }}
                >
                  <span className="font-semibold text-slate-800 text-sm pr-4">{faq.q}</span>
                  <svg className="w-5 h-5 shrink-0 text-slate-400 transition-transform" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M19 9l-7 7-7-7"/></svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5" style={{ borderTop: '1px solid rgba(21,101,192,0.08)' }}>
                    <p className="text-slate-500 text-sm leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still need help */}
      <section className="py-14" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-bold text-slate-800 mb-2">Still Need Help?</h2>
          <p className="text-slate-500 text-sm mb-6">Our support team is available Mon–Fri 07:00–18:00 WAT</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold" style={{ background: '#1565C0', color: 'white', textDecoration: 'none' }}>
              Contact Support
            </Link>
            <a href="https://wa.me/15126785033" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold" style={{ background: '#25D366', color: 'white', textDecoration: 'none' }}>
              WhatsApp Chat
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
