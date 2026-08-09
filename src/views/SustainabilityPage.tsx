'use client'
import PageMeta from '../components/PageMeta'
import { Link } from 'react-router-dom'

const PILLARS = [
  {
    icon: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.728 12.728l.707.707M3 12h1m16 0h1M4.22 19.778l.707-.707m12.728-12.728l.707-.707M9 12a3 3 0 116 0 3 3 0 01-6 0z"/></svg>,
    label: 'Clean Energy',
    title: 'Transitioning to 100% Renewable Energy',
    desc: 'By 2027 all our warehouses and offices will run on certified renewable electricity. We\'ve already converted 62% of facilities.',
    stat: '62%', statLabel: 'facilities on renewables',
  },
  {
    icon: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>,
    label: 'Green Fleet',
    title: 'Electric & Hybrid Delivery Vehicles',
    desc: 'We\'re replacing our last-mile fleet with EVs and hybrids. 340 electric vehicles are now operating in Dubai, Austin, and London.',
    stat: '340', statLabel: 'EVs in active operation',
  },
  {
    icon: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 21a9 9 0 100-18 9 9 0 000 18z"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3c-2.485 0-4.5 4.03-4.5 9s2.015 9 4.5 9 4.5-4.03 4.5-9-2.015-9-4.5-9z"/></svg>,
    label: 'Carbon Offsets',
    title: 'Carbon-Neutral Shipments by 2026',
    desc: 'Every shipment now displays its carbon footprint. Customers can offset emissions at checkout, and we match every offset 1:1.',
    stat: '18,400t', statLabel: 'CO₂ offset so far in 2025',
  },
  {
    icon: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>,
    label: 'Sustainable Packaging',
    title: 'Zero Single-Use Plastic in Our Network',
    desc: 'All Accessiblexpress branded packaging is made from recycled or biodegradable materials. We\'ve eliminated single-use plastic from all warehouses.',
    stat: '0', statLabel: 'single-use plastics',
  },
]

const GOALS = [
  { year: '2025', goal: 'Publish first annual ESG report', done: true },
  { year: '2025', goal: 'Offset 50,000 tonnes of CO₂', done: false },
  { year: '2026', goal: 'Achieve carbon-neutral shipments', done: false },
  { year: '2027', goal: '100% renewable energy across all facilities', done: false },
  { year: '2030', goal: 'Net-zero emissions across entire supply chain', done: false },
]

export default function SustainabilityPage() {
  return (
    <main style={{ paddingTop: 98 }}>
      <PageMeta title="Sustainability" description="Our roadmap to carbon-neutral shipping by 2026 and net-zero logistics operations by 2030." />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#0D47A1 0%,#1565C0 60%,#1976D2 100%)', padding: '80px 0 64px' }}>
        <div className="container mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5" style={{ background: 'rgba(255,152,0,0.12)', border: '1px solid rgba(255,152,0,0.3)', color: '#FF9800' }}>
            Sustainability
          </span>
          <h1 className="font-black text-white mb-4" style={{ fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1.05, letterSpacing: '-1.5px' }}>
            Shipping the World<br />
            <span style={{ color: '#FF9800' }}>Without Wrecking It</span>
          </h1>
          <p className="mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, maxWidth: 520 }}>
            Our mission is zero-emissions logistics by 2030. Here's what we're doing today to get there.
          </p>
        </div>
      </section>

      {/* Impact numbers */}
      <section style={{ background: '#1565C0', borderBottom: '1px solid rgba(255,152,0,0.1)' }}>
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
          {[
            { val: '18,400t', label: 'CO₂ Offset in 2025' },
            { val: '340',     label: 'Electric Vehicles' },
            { val: '62%',     label: 'Renewable Facilities' },
            { val: '2030',    label: 'Net-Zero Target' },
          ].map((s, i) => (
            <div key={i} className="py-8 text-center" style={{ borderRight: i < 3 ? '1px solid rgba(255,152,0,0.1)' : 'none' }}>
              <div className="font-black" style={{ fontSize: 32, color: '#FF9800' }}>{s.val}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20" style={{ background: '#f8fafc' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-black text-slate-900 mb-3" style={{ fontSize: 'clamp(28px,3.5vw,42px)', letterSpacing: '-0.5px' }}>Our Commitments</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Four pillars driving our transition to sustainable logistics.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {PILLARS.map(p => (
              <div key={p.title} className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(21,101,192,0.07)', color: '#1565C0' }}>
                    {p.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#1565C0' }}>{p.label}</p>
                    <h3 className="font-bold text-slate-800 mb-2 leading-snug">{p.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{p.desc}</p>
                    <div className="inline-flex items-baseline gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(255,152,0,0.1)' }}>
                      <span className="font-black" style={{ fontSize: 20, color: '#1F2937' }}>{p.stat}</span>
                      <span className="text-xs text-slate-500">{p.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20" style={{ background: 'white' }}>
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="font-black text-slate-900 mb-10 text-center" style={{ fontSize: 'clamp(28px,3.5vw,42px)', letterSpacing: '-0.5px' }}>Our Net-Zero Roadmap</h2>
          <div className="space-y-4">
            {GOALS.map((g, i) => (
              <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border" style={{ borderColor: g.done ? 'rgba(255,152,0,0.3)' : '#e2e8f0', background: g.done ? 'rgba(255,152,0,0.06)' : 'white' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm" style={{ background: g.done ? '#1565C0' : '#f1f5f9', color: g.done ? 'white' : '#64748b' }}>
                  {g.done
                    ? <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}><path d="M4.5 12.75l6 6 9-13.5"/></svg>
                    : g.year
                  }
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{g.year}</p>
                  <p className="font-semibold text-slate-700 text-sm">{g.goal}</p>
                </div>
                {g.done && <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,152,0,0.15)', color: '#1F2937' }}>Complete</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg,#0D47A1,#1565C0)' }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-black text-white mb-3" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Ship Green With Us</h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>Every shipment you make through Accessiblexpress contributes to our carbon offset programme at no extra cost.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-sm font-bold" style={{ background: '#FF9800', color: '#1F2937', textDecoration: 'none' }}>
            Get Started
          </Link>
        </div>
      </section>
    </main>
  )
}
