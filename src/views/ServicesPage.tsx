'use client'
import PageMeta from '../components/PageMeta'
import { Link } from 'react-router-dom'
import ServiceCard from '../components/ServiceCard'
import type { ServiceCardData } from '../components/ServiceCard'

const SERVICES: ServiceCardData[] = [
  {
    id: 'express',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
    title: 'Express Delivery',
    desc: 'When speed is everything, our Express service guarantees same-day (domestic) or next-day (international) delivery with real-time GPS tracking every step of the way.',
    img: 'https://images.pexels.com/photos/4246019/pexels-photo-4246019.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    to: '/services/express-delivery',
    featured: false,
  },
  {
    id: 'air',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>,
    title: 'Air Freight',
    desc: 'Access 500+ airports worldwide. 2–4 day international transit with customs documentation included, dangerous goods certified, and temperature-controlled options.',
    img: 'https://images.pexels.com/photos/747679/pexels-photo-747679.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    to: '/freight/air-freight',
    featured: true,
  },
  {
    id: 'sea',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M12 3v4M3 17l2-6h14l2 6H3zM1 21h22M7 11V7a5 5 0 0110 0v4"/></svg>,
    title: 'Sea Freight',
    desc: 'The most economical solution for large shipments. FCL & LCL options to 300+ ports globally with port-to-port or door-to-door service.',
    img: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    to: '/freight/ocean-freight',
    featured: false,
  },
  {
    id: 'road',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z"/><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1V8h3l3 3v4l1 1h-1m-6 0h-3"/></svg>,
    title: 'Road Transport',
    desc: 'Our fleet of 2,000+ vehicles covers major trade routes across Africa, Europe, and Asia. Refrigerated, oversize, and cross-border with real-time tracking.',
    img: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    to: '/freight/road-freight',
    featured: false,
  },
  {
    id: 'warehouse',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/><path d="M9 21V12h6v9"/></svg>,
    title: 'Warehousing & Fulfillment',
    desc: 'Climate-controlled storage at 50+ locations. Pick, pack & ship with an inventory management portal and returns processing included.',
    img: 'https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    to: '/services/warehousing',
    featured: true,
  },
  {
    id: 'customs',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>,
    title: 'Customs Clearance',
    desc: 'Licensed brokers handle all paperwork, duties, taxes, and compliance. 24-hour clearance guarantee with HS code classification and import/export permits.',
    img: 'https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    to: '/customs',
    featured: false,
  },
]

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <PageMeta title="Shipping &amp; Logistics Services" description="Express delivery, air freight, ocean shipping, warehousing, and customs clearance — all under one roof worldwide." />
      {/* Hero */}
      <div className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <img src="https://images.pexels.com/photos/4483942/pexels-photo-4483942.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop" alt="" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
            Our Services
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ lineHeight: 1.1 }}>
            Every Shipping Need,<br />
            <span className="gradient-text">One Platform</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 36px' }}>
            From a single parcel to a full container — we have the service, the network, and the expertise.
          </p>
          <Link to="/contact" className="btn-primary py-4! px-9! text-base!">Get a Free Quote</Link>
        </div>
      </div>

      {/* Services */}
      <div className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {SERVICES.map(svc => (
              <div id={svc.id} key={svc.id}>
                <ServiceCard {...svc} btnLabel="Get Quote" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-16 bg-white text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-4">Not sure which service you need?</h2>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto">Our logistics experts will recommend the best solution for your cargo type, timeline, and budget — completely free.</p>
        <Link to="/contact" className="btn-primary py-4! px-9!">Talk to an Expert</Link>
      </div>
    </div>
  )
}
