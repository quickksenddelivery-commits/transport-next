'use client'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

const FEATURES = [
  'API Integration & Webhooks',
  'Bulk Label Generation',
  'Multi-warehouse Management',
  'Dedicated Account Manager',
  'Custom Branding & White-label',
  'Net-30 / Net-60 Payment Terms',
  'Priority Support SLA',
  'Advanced Analytics Dashboard',
]

export default function BusinessSection() {
  const [ref, inView] = useScrollReveal()

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)' }}>
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#1565C0]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-20 w-64 h-64 rounded-full blur-3xl" style={{ background: 'rgba(255,152,0,0.10)' }} />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className={inView ? 'animate-reveal-left' : 'opacity-0'}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-semibold uppercase tracking-wider mb-6">
              Enterprise
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Shipping Solutions{' '}
              <span className="gradient-text">Built for Scale</span>
            </h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Growing businesses need more than a courier. Get a full logistics infrastructure —
              including warehousing, fulfillment, and global shipping — under one roof.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-10">
              {FEATURES.map((feat, i) => (
                <div
                  key={feat}
                  className={`flex items-center gap-2.5 ${inView ? 'animate-reveal-up' : 'opacity-0'}`}
                  style={inView ? { animationDelay: `${0.25 + i * 0.06}s` } : {}}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,152,0,0.2)', border: '1px solid rgba(255,152,0,0.4)' }}>
                    <svg className="w-3 h-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <span className="text-white/70 text-sm">{feat}</span>
                </div>
              ))}
            </div>

            <div
              className={`flex flex-wrap gap-4 ${inView ? 'animate-reveal-up' : 'opacity-0'}`}
              style={inView ? { animationDelay: '0.75s' } : {}}
            >
              <Link to="/contact" className="btn-primary py-4! px-8! shadow-2xl" style={{ boxShadow: '0 25px 50px rgba(255,152,0,0.2)', textDecoration: 'none' }}>
                Talk to Sales
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <Link to="/contact" className="btn-outline-white py-4! px-8!" style={{ textDecoration: 'none' }}>
                View API Docs
              </Link>
            </div>
          </div>

          {/* Right: Visual dashboard mockup */}
          <div
            className={`relative ${inView ? 'animate-reveal-right' : 'opacity-0'}`}
            style={inView ? { animationDelay: '0.15s' } : {}}
          >
            <div className="glass-card rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-white/40 text-xs">Accessiblexpress Enterprise Dashboard</span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Active Shipments', val: '1,247' },
                  { label: 'Delivered Today', val: '342' },
                  { label: 'On-Time Rate', val: '98.7%' },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-white/40 text-[10px] uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-white font-black text-lg">{s.val}</p>
                    <p className="text-green-400 text-[10px] mt-0.5">↑ +12% vs last week</p>
                  </div>
                ))}
              </div>

              {/* Recent shipments table */}
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                  <span className="text-white/70 text-xs font-semibold uppercase tracking-wide">Recent Shipments</span>
                  <span className="text-blue-400 text-xs cursor-pointer">View all</span>
                </div>
                {[
                  { id: 'QSD-78234', dest: 'London, UK', status: 'Delivered', statusColor: 'text-green-400' },
                  { id: 'QSD-78235', dest: 'Dubai, UAE', status: 'In Transit', statusColor: 'text-blue-400' },
                  { id: 'QSD-78236', dest: 'Tokyo, JP', status: 'Picked Up', statusColor: 'text-yellow-400' },
                  { id: 'QSD-78237', dest: 'Paris, FR', status: 'Processing', statusColor: 'text-yellow-400' },
                ].map(row => (
                  <div key={row.id} className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between last:border-0">
                    <div>
                      <p className="text-white text-xs font-mono">{row.id}</p>
                      <p className="text-white/40 text-[10px]">{row.dest}</p>
                    </div>
                    <span className={`text-[11px] font-semibold ${row.statusColor}`}>{row.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg" style={{ background: '#FF9800', color: '#1F2937' }}>
              Enterprise Ready
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
