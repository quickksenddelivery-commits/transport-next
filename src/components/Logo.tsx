'use client'
import { Link } from 'react-router-dom'

/* ─── Logomark ────────────────────────────────────────────────────────────── */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="axG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF9800" />
          <stop offset="100%" stopColor="#1565C0" />
        </linearGradient>
      </defs>
      {/* Badge */}
      <rect width="96" height="96" rx="22" fill="#1565C0" />

      {/* Subtle globe grid lines behind the A */}
      <circle cx="48" cy="52" r="28" stroke="white" strokeWidth="1" opacity="0.07" />
      <ellipse cx="48" cy="52" rx="14" ry="28" stroke="white" strokeWidth="1" opacity="0.07" />
      <line x1="20" y1="52" x2="76" y2="52" stroke="white" strokeWidth="1" opacity="0.07" />

      {/* Left leg of A */}
      <polygon points="42,10 50,10 30,84 12,84" fill="white" />
      {/* Right leg of A */}
      <polygon points="46,10 54,10 84,84 66,84" fill="white" />

      {/* Gradient crossbar */}
      <rect x="21" y="45" width="54" height="13" rx="3.5" fill="url(#axG)" />

      {/* Gold peak cap */}
      <polygon points="48,2 38,16 58,16" fill="#FF9800" />

      {/* Small speed dot accent */}
      <circle cx="48" cy="9" r="4" fill="#FF9800" />
    </svg>
  )
}

/* ─── Full logo (mark + wordmark) ────────────────────────────────────────── */
interface LogoProps {
  size?: number
  theme?: 'dark' | 'light'
  linked?: boolean
  className?: string
}

export default function Logo({ size = 36, theme = 'dark', linked = true, className }: LogoProps) {
  const nameColor  = theme === 'dark' ? 'white'   : '#1F2937'
  const subColor   = theme === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(13,8,64,0.38)'
  const accentColor = '#1565C0'

  const inner = (
    <div className={`flex items-center gap-2.5 select-none ${className ?? ''}`} style={{ textDecoration: 'none' }}>
      <LogoMark size={size} />
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontWeight: 900,
          fontSize: size * 0.38,
          letterSpacing: '-0.4px',
          color: nameColor,
          lineHeight: 1.1,
        }}>
          Accessible<span style={{ color: accentColor }}>xpress</span>
        </div>
        <div style={{
          fontSize: size * 0.215,
          fontWeight: 700,
          letterSpacing: '1.8px',
          color: subColor,
          marginTop: 3,
          textTransform: 'uppercase',
        }}>
          Global Logistics
        </div>
      </div>
    </div>
  )

  return linked
    ? <Link to="/" style={{ textDecoration: 'none' }}>{inner}</Link>
    : inner
}
