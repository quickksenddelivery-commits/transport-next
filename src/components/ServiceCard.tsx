'use client'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface ServiceCardData {
  id?: string
  icon: ReactNode
  title: string
  desc: string
  img: string
  to: string
  featured?: boolean
  btnLabel?: string
}

export default function ServiceCard({ icon, title, desc, img, to, featured = false, btnLabel = 'Learn More' }: ServiceCardData) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
      style={{ background: featured ? '#1565C0' : 'white' }}
    >
      {/* Image + diagonal cut + icon */}
      <div style={{ position: 'relative' }}>
        <div style={{ height: 200, overflow: 'hidden' }}>
          <img
            src={img}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Diagonal white/navy strip */}
        <div style={{
          position: 'absolute', bottom: -1, left: 0, right: 0, height: 56,
          background: featured ? '#1565C0' : 'white',
          clipPath: 'polygon(0 55%, 100% 0%, 100% 100%, 0 100%)',
        }} />

        {/* Icon circle straddling boundary */}
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translate(-50%, 50%)', zIndex: 10 }}>
          <div style={{
            width: 62, height: 62, borderRadius: '50%',
            background: featured ? '#1565C0' : 'white',
            border: featured ? '3px solid #1565C0' : '3px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: featured ? '#1565C0' : '#1F2937',
            boxShadow: featured
              ? '0 0 0 4px rgba(21,101,192,0.18), 0 8px 24px rgba(0,0,0,0.3)'
              : '0 0 0 4px rgba(13,8,64,0.07), 0 8px 24px rgba(0,0,0,0.12)',
          }}>
            {icon}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 44, padding: '44px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontWeight: 900, fontSize: 20, marginBottom: 10,
          color: featured ? 'white' : '#1e293b',
          textAlign: 'center',
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: 14, lineHeight: 1.7,
          color: featured ? 'rgba(255,255,255,0.58)' : '#64748b',
          textAlign: 'center', flex: 1, marginBottom: 20,
        }}>
          {desc}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            to={to}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 28px', borderRadius: 8,
              fontWeight: 700, fontSize: 13, letterSpacing: '0.5px',
              textTransform: 'uppercase', textDecoration: 'none',
              background: featured ? '#1565C0' : '#1F2937',
              color: 'white',
              transition: 'opacity 0.18s, transform 0.18s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
          >
            {btnLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}>
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
