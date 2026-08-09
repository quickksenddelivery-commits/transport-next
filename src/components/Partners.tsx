'use client'
import Reveal from './Reveal'

const CARRIERS = [
  { name: 'DHL Express',    abbr: 'DHL',    bg: '#FFCC00', text: '#CC0000', desc: 'Global Express' },
  { name: 'FedEx',          abbr: 'FedEx',  bg: '#4D148C', text: '#FF6200', desc: 'Air & Ground' },
  { name: 'Maersk Line',    abbr: 'MSK',    bg: '#0073AB', text: '#fff',    desc: 'Ocean Freight' },
  { name: 'UPS',            abbr: 'UPS',    bg: '#351C15', text: '#FFB500', desc: 'Package & Freight' },
  { name: 'Amazon Logistics', abbr: 'AMZ', bg: '#232F3E', text: '#FF9900', desc: 'E-commerce' },
  { name: 'Shopify',        abbr: 'SHO',    bg: '#004C3F', text: '#95BF47', desc: 'Store Integration' },
  { name: 'Alibaba Global', abbr: 'ALI',    bg: '#FF6000', text: '#fff',    desc: 'Global Trade' },
  { name: 'CMA CGM',        abbr: 'CMA',    bg: '#003087', text: '#fff',    desc: 'Container Lines' },
  { name: 'Stripe',         abbr: 'STR',    bg: '#635BFF', text: '#fff',    desc: 'Payments' },
  { name: 'Flexport',       abbr: 'FLP',    bg: '#00C2FF', text: '#1F2937', desc: 'Freight Platform' },
]

import { IcoLock, IcoPlane, IcoShield, IcoLeaf, IcoStar } from '../lib/icons'

const BADGES = [
  { icon: <IcoLock className="w-5 h-5" />,   label: 'ISO 27001 Certified', sub: 'Data Security' },
  { icon: <IcoPlane className="w-5 h-5" />,  label: 'IATA Member',          sub: 'Air Cargo Authority' },
  { icon: <IcoShield className="w-5 h-5" />, label: 'AEO Authorized',       sub: 'Customs Trusted' },
  { icon: <IcoLeaf className="w-5 h-5" />,   label: 'Carbon Neutral',        sub: '2024 Certified' },
  { icon: <IcoStar className="w-5 h-5" />,   label: 'Best Logistics 2024',   sub: 'Industry Award' },
]

export default function Partners() {
  return (
    <section className="py-14 sm:py-16 bg-white border-y border-slate-100 overflow-hidden">
      {/* Header */}
      <Reveal direction="up" className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-10 text-center">
        <p className="text-slate-400 text-xs sm:text-sm uppercase tracking-widest font-semibold mb-1">
          Powering the world's best logistics operations
        </p>
        <p className="text-slate-300 text-xs hidden sm:block">Integrated with 300+ carriers, platforms, and payment providers worldwide</p>
      </Reveal>

      {/* Carrier marquee — forward row */}
      <div className="relative overflow-hidden mb-3">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex gap-3 sm:gap-4 animate-marquee items-stretch" style={{ width: 'max-content' }}>
          {[...CARRIERS, ...CARRIERS].map((c, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center gap-3 px-4 sm:px-5 py-3 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
              style={{ background: 'white', minWidth: '160px' }}
            >
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ background: c.bg, color: c.text, fontSize: '10px', letterSpacing: '-0.5px' }}
              >
                {c.abbr.slice(0, 3)}
              </div>
              <div>
                <p className="text-slate-700 font-bold text-sm leading-none">{c.name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrier marquee — reverse row */}
      <div className="relative overflow-hidden mb-8 sm:mb-10">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex gap-3 sm:gap-4 animate-marquee-reverse items-stretch" style={{ width: 'max-content' }}>
          {[...[...CARRIERS].reverse(), ...[...CARRIERS].reverse()].map((c, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center gap-3 px-4 sm:px-5 py-3 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
              style={{ background: 'white', minWidth: '160px' }}
            >
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ background: c.bg, color: c.text, fontSize: '10px', letterSpacing: '-0.5px' }}
              >
                {c.abbr.slice(0, 3)}
              </div>
              <div>
                <p className="text-slate-700 font-bold text-sm leading-none">{c.name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certification badges */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {BADGES.map((badge, i) => (
            <Reveal key={badge.label} direction="up" delay={0.08 + i * 0.08}>
              <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-50 border border-slate-100 hover:border-yellow-200 hover:bg-yellow-50 transition-all duration-200 cursor-default group">
                <span className="text-slate-500">{badge.icon}</span>
                <div>
                  <p className="text-slate-700 font-semibold text-xs sm:text-sm leading-none">{badge.label}</p>
                  <p className="text-slate-400 text-[10px] hidden sm:block mt-0.5">{badge.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
