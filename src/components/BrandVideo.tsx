'use client'
import { LogoMark } from './Logo'

const STATS = [
  { value: '120+', label: 'Countries Served' },
  { value: '1M+',  label: 'Packages Delivered' },
  { value: '99.2%', label: 'On-Time Delivery' },
]

/**
 * Self-contained, looping animated brand banner — logo reveal, wordmark,
 * tagline, then a travelling route line with stat badges. Pure CSS/SVG,
 * no video file; every layer shares one 14s cycle so it resyncs on loop.
 */
export default function BrandVideo() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ height: 460, background: 'linear-gradient(135deg, #0D2E63 0%, #1565C0 55%, #0D2E63 100%)' }}
      aria-label="Accessiblexpress — global logistics"
    >
      {/* Dot grid */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,152,0,0.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(21,101,192,0.25) 0%, transparent 70%)' }} />

      {/* Route line + travelling plane — the curve is tuned for a wide aspect
          ratio, so it's hidden below sm where it would just distort */}
      <svg className="absolute inset-0 w-full h-full hidden sm:block" viewBox="0 0 1200 460" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
        <path
          d="M 60 360 C 320 200, 480 420, 700 260 S 1080 120, 1140 100"
          fill="none"
          stroke="#FF9800"
          strokeWidth="2"
          strokeDasharray="900"
          className="brand-route"
        />
      </svg>
      <div className="brand-plane absolute hidden sm:block" style={{ left: 0, top: 0 }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} style={{ filter: 'drop-shadow(0 0 8px rgba(255,152,0,0.8))' }}>
          <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      </div>

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div className="brand-logo mb-5">
          <LogoMark size={64} />
        </div>

        <h2 className="brand-wordmark font-black text-white" style={{ fontSize: 'clamp(28px, 5vw, 46px)', letterSpacing: '-0.5px' }}>
          Accessible<span style={{ color: '#FF9800' }}>xpress</span>
        </h2>

        <p className="brand-tagline mt-2 text-sm font-bold uppercase tracking-widest" style={{ color: 'rgba(255,152,0,0.75)' }}>
          Global Logistics, Delivered
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 mt-9">
          {STATS.map((s, i) => (
            <div key={s.label} className={`brand-stat brand-stat-${i + 1} text-center`}>
              <p className="font-black text-2xl md:text-3xl text-white">{s.value}</p>
              <p className="text-xs uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
