'use client'
import { IcoBolt, IcoPlane, IcoShip, IcoTruck, IcoWarehouse, IcoShieldCheck } from '../lib/icons'
import Reveal from './Reveal'
import ServiceCard from './ServiceCard'
import type { ServiceCardData } from './ServiceCard'

const SERVICES: ServiceCardData[] = [
  {
    icon: <IcoBolt className="w-6 h-6" />,
    title: 'Express Delivery',
    desc: 'Same-day pickup within 2 hours, next-day international delivery, with real-time GPS tracking every step of the way.',
    img: 'https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    to: '/services',
    featured: false,
  },
  {
    icon: <IcoPlane className="w-6 h-6" />,
    title: 'Air Freight',
    desc: 'Access 500+ airports worldwide. 2–4 day international transit with full customs documentation included.',
    img: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    to: '/freight#air',
    featured: true,
  },
  {
    icon: <IcoShip className="w-6 h-6" />,
    title: 'Ocean Freight',
    desc: 'Move large volumes affordably. FCL & LCL options to 300+ ports worldwide with door-to-door service.',
    img: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    to: '/freight#ocean',
    featured: false,
  },
  {
    icon: <IcoTruck className="w-6 h-6" />,
    title: 'Road Transport',
    desc: 'Our fleet of 2,000+ vehicles covers major corridors across continents with live tracking on every load.',
    img: 'https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    to: '/freight#road',
    featured: false,
  },
  {
    icon: <IcoWarehouse className="w-6 h-6" />,
    title: 'Warehousing',
    desc: 'Climate-controlled storage in 50+ locations. Pick, pack & ship with real-time inventory dashboard.',
    img: 'https://images.pexels.com/photos/4483942/pexels-photo-4483942.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    to: '/services#warehouse',
    featured: true,
  },
  {
    icon: <IcoShieldCheck className="w-6 h-6" />,
    title: 'Customs Clearance',
    desc: 'Licensed brokers handle all documentation, duties, and compliance so your shipments clear borders without delays.',
    img: 'https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    to: '/customs',
    featured: false,
  },
]

export default function Services() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">

        <Reveal direction="up" className="text-center mb-10 sm:mb-14">
          <span className="section-label">What We Offer</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 mt-4 mb-4">
            End-to-End Logistics Services
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            From single parcels to enterprise supply chains — we have the solution for every shipping need.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((svc, i) => (
            <Reveal key={svc.title} direction="up" delay={i * 0.07}>
              <ServiceCard {...svc} />
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}
