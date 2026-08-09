'use client'
import PageMeta from '../components/PageMeta'
import { Link } from 'react-router-dom'
import ServiceCard from '../components/ServiceCard'
import type { ServiceCardData } from '../components/ServiceCard'

const SERVICES: ServiceCardData[] = [
  {
    id: 'air',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>,
    title: 'Air Freight',
    desc: 'Access 500+ airports worldwide. 2–4 day international transit, dangerous goods certified, with full documentation and customs clearance end-to-end.',
    img: 'https://images.pexels.com/photos/747679/pexels-photo-747679.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    to: '/freight/air-freight',
    featured: false,
  },
  {
    id: 'ocean',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 3v4M3 17l2-6h14l2 6H3zM1 21h22M7 11V7a5 5 0 0110 0v4"/></svg>,
    title: 'Ocean Freight',
    desc: 'The most economical solution for bulk shipments. FCL & LCL to 300+ ports globally with door-to-door delivery and real-time container tracking.',
    img: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    to: '/freight/ocean-freight',
    featured: true,
  },
  {
    id: 'road',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z"/><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1V8h3l3 3v4l1 1h-1m-6 0h-3"/></svg>,
    title: 'Road Freight',
    desc: 'Our 2,000+ vehicle fleet covers major trade corridors across Africa, Europe, and Asia. FTL & LTL with refrigerated and oversize options.',
    img: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    to: '/freight/road-freight',
    featured: false,
  },
  {
    id: 'soc',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/></svg>,
    title: 'SOC Movements',
    desc: 'Full visibility on your shipper-owned containers across multi-leg journeys — tracking, depot management, and a dedicated coordinator.',
    img: 'https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    to: '/freight/soc-movements',
    featured: true,
  },
]

const STATS = [
  { value: '500+', label: 'Airports Served' },
  { value: '300+', label: 'Global Ports' },
  { value: '2,000+', label: 'Vehicles in Fleet' },
  { value: '85+', label: 'Countries Covered' },
]

export default function FreightPage() {
  return (
    <div className="pt-20">
      <PageMeta title="Air, Ocean &amp; Road Freight" description="End-to-end freight forwarding: air cargo in 2–4 days, FCL/LCL ocean shipping, and cross-border road transport to 120+ countries." />
      {/* Hero */}
      <div className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 60%, #1976D2 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <img src="https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop" alt="" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(21,101,192,0.2), transparent 70%)' }} />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}>
            Freight Services
          </span>
          <h1 className="font-black text-white mb-5" style={{ fontSize: 'clamp(36px, 6vw, 62px)', lineHeight: 1.1 }}>
            Air · Ocean · Road<br />
            <span className="gradient-text">Freight Forwarding</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', maxWidth: '580px', margin: '0 auto 36px' }}>
            End-to-end freight solutions across every mode of transport. We move your cargo safely, on time, and within budget.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary py-4! px-8! text-base!">Get Freight Quote</Link>
            <Link to="/track" className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none' }}>
              Track Shipment
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: '#FF9800' }}>
        <div className="container mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="font-black text-2xl md:text-3xl text-slate-900">{s.value}</p>
              <p className="text-sm font-semibold text-slate-700">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-800 mb-4">Our Freight Services</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Choose the right freight mode for your cargo type, timeline, and budget.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {SERVICES.map(svc => (
              <div id={svc.id} key={svc.id}>
                <ServiceCard {...svc} btnLabel="Get Quote" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why choose us for freight */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-800 mb-4">Why Ship Freight with Us?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">We've moved millions of tonnes of cargo across six continents. Here's what sets us apart.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🌍', title: 'Global Agent Network', desc: 'Partnerships with 400+ freight agents in 85 countries ensure your cargo is handled locally with a global standard.' },
              { icon: '📡', title: 'Real-Time Visibility', desc: 'Track every container, truck, or air shipment in real time through our portal — 24 hours a day, 7 days a week.' },
              { icon: '📋', title: 'Full Documentation', desc: 'We handle all freight documentation — bills of lading, airway bills, certificates of origin, and customs filings.' },
              { icon: '🔒', title: 'Cargo Insurance', desc: 'All freight is covered by our comprehensive cargo insurance. We handle claims directly so you don\'t have to.' },
              { icon: '⚡', title: 'Express Options', desc: 'Need it there fast? Our priority freight lanes guarantee faster transit with dedicated handling at every hub.' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden fees. You get a full cost breakdown — freight, duties, port fees, and handling — before you commit.' },
            ].map(item => (
              <div key={item.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)' }}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Move Your Cargo?</h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">Get a competitive freight quote in minutes. Our team is ready to find the best route and rate for your shipment.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary py-4! px-9!">Request a Quote</Link>
            <Link to="/track" className="px-9 py-4 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors" style={{ textDecoration: 'none' }}>Track Existing Shipment</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
