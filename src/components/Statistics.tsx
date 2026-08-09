'use client'
import { useEffect, useRef, useState } from 'react'
import { IcoPackage, IcoGlobe, IcoBuilding, IcoCheckCircle } from '../lib/icons'

const STATS = [
  { end: 1000000, suffix: '+', label: 'Packages Delivered', icon: <IcoPackage className="w-8 h-8 text-white/60" />, note: 'and counting' },
  { end: 120, suffix: '+', label: 'Countries Served', icon: <IcoGlobe className="w-8 h-8 text-white/60" />, note: 'global reach' },
  { end: 15000, suffix: '+', label: 'Business Clients', icon: <IcoBuilding className="w-8 h-8 text-white/60" />, note: 'trust us daily' },
  { end: 99.2, suffix: '%', label: 'Delivery Success Rate', icon: <IcoCheckCircle className="w-8 h-8 text-white/60" />, note: 'industry leading', decimal: true },
]

function useCountUp(end: number, duration = 2000, active = false, decimal = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = Date.now()
    const frame = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = end * eased
      setVal(current)
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [active, end, duration])
  const display = decimal ? val.toFixed(1) : Math.round(val).toLocaleString()
  return display
}

function StatItem({ stat, active }: { stat: typeof STATS[0]; active: boolean }) {
  const value = useCountUp(stat.end, 2200, active, stat.decimal)
  return (
    <div className="text-center group">
      <div className="mb-3 flex justify-center">{stat.icon}</div>
      <div className={`text-4xl md:text-5xl font-black text-white mb-2 transition-all duration-300 break-all leading-none ${active ? 'animate-countUp' : 'opacity-0'}`}>
        {value}{stat.suffix}
      </div>
      <div className="text-white font-semibold text-lg mb-1">{stat.label}</div>
      <div className="text-white/40 text-sm">{stat.note}</div>
    </div>
  )
}

export default function Statistics() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&cs=tinysrgb&w=1600&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.4)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(13,8,64,0.92) 0%, rgba(15,36,68,0.85) 50%, rgba(22,49,102,0.88) 100%)' }} />
      </div>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(255,152,0,0.12)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(21,101,192,0.10)' }} />
      {/* Floating glow particles */}
      {[
        { left: '15%', top: '20%', delay: '0s',   size: 6, color: 'rgba(255,152,0,0.6)' },
        { left: '70%', top: '60%', delay: '1.2s', size: 4, color: 'rgba(96,165,250,0.5)' },
        { left: '45%', top: '80%', delay: '2.4s', size: 5, color: 'rgba(167,139,250,0.5)' },
        { left: '85%', top: '25%', delay: '0.8s', size: 3, color: 'rgba(74,222,128,0.6)' },
        { left: '30%', top: '50%', delay: '1.8s', size: 4, color: 'rgba(255,152,0,0.4)' },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            background: p.color,
            filter: `blur(${p.size / 2}px)`,
            animation: `heroParticle ${2.5 + i * 0.4}s ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-semibold uppercase tracking-wider">
            Our Numbers
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-4">
            Trusted at Global Scale
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Real numbers that speak for themselves. No exaggeration — just performance.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {STATS.map(stat => (
            <StatItem key={stat.label} stat={stat} active={active} />
          ))}
        </div>

        {/* Progress bars */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { label: 'On-Time Delivery', pct: 97 },
            { label: 'Customer Satisfaction', pct: 96 },
            { label: 'Same-Day Resolution', pct: 94 },
          ].map(bar => (
            <div key={bar.label}>
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>{bar.label}</span>
                <span className="font-bold text-white">{bar.pct}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(to right, #FF9800, #1565C0)',
                    width: active ? `${bar.pct}%` : '0%',
                    transition: 'width 1.6s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
