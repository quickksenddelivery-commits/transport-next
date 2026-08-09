'use client'
import { Link } from 'react-router-dom'

const INDUSTRIES = [
  { icon: '🏭', name: 'Manufacturing', desc: 'Raw materials, machinery parts, and finished goods — on schedule for your production line.' },
  { icon: '🛍️', name: 'Retail & E-commerce', desc: 'Fast last-mile delivery and returns management for online and brick-and-mortar retailers.' },
  { icon: '💊', name: 'Healthcare & Pharma', desc: 'Temperature-controlled, GDP-compliant shipping for medicines, devices, and lab samples.' },
  { icon: '🚗', name: 'Automotive', desc: 'Just-in-time parts delivery and finished vehicle transport with specialist handling.' },
  { icon: '💻', name: 'Technology', desc: 'Secure, insured transport for high-value electronics, components, and server equipment.' },
  { icon: '🌾', name: 'Agriculture & Food', desc: 'Cold chain logistics keeping perishable goods fresh from farm to table — globally.' },
  { icon: '⚡', name: 'Energy & Mining', desc: 'Heavy equipment, project cargo, and hazardous materials handled by certified specialists.' },
  { icon: '👗', name: 'Fashion & Apparel', desc: 'Garment-on-hanger, folded, and branded goods shipped in perfect condition worldwide.' },
]

export default function IndustriesSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5" style={{ background: 'rgba(21,101,192,0.08)', color: '#1565C0', border: '1px solid rgba(21,101,192,0.15)' }}>
            Industries We Serve
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-5">
            Shipping Solutions for<br />
            <span className="gradient-text">Every Industry</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
            From pharmaceuticals to fashion, we understand the unique logistics needs of every sector — and we have the expertise to deliver.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INDUSTRIES.map(ind => (
            <div
              key={ind.name}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <span className="text-4xl block mb-4">{ind.icon}</span>
              <h3 className="font-bold text-slate-800 mb-2 group-hover:text-[#1565C0] transition-colors">
                {ind.name}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{ind.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-slate-400 text-sm mt-10">
          Don't see your industry?{' '}
          <Link to="/contact" className="text-slate-600 font-semibold hover:text-[#1565C0] transition-colors">
            Talk to our team →
          </Link>
        </p>
      </div>
    </section>
  )
}
