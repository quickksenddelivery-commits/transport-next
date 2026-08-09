'use client'
import { useLayoutEffect, useRef, useState } from 'react'

type Dir = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

const HIDDEN: Record<Dir, string> = {
  up:    'translateY(52px)',
  down:  'translateY(-40px)',
  left:  'translateX(-64px)',
  right: 'translateX(64px)',
  scale: 'scale(0.82)',
  fade:  'none',
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 0.72,
  direction = 'up',
  threshold = 0.1,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: Dir
  threshold?: number
  as?: React.ElementType
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true)
          obs.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -16% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : HIDDEN[direction],
        transition: `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  )
}
