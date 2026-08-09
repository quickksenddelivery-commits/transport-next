'use client'
import { useEffect, useState, useCallback } from 'react'

export interface TourStep {
  tab?: string
  target: string
  title: string
  body: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

interface Rect { top: number; left: number; width: number; height: number }

const PAD = 8

function measure(selector: string): Rect | null {
  // A selector can match more than one element when a mobile/desktop pair
  // both carry the same data-tour anchor (only one is actually visible at
  // a given viewport) — pick the first with real dimensions.
  const candidates = document.querySelectorAll(selector)
  for (const el of candidates) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0) {
      return { top: r.top, left: r.left, width: r.width, height: r.height }
    }
  }
  return null
}

export default function AdminTour({
  steps,
  onNavigateTab,
  onClose,
}: {
  steps: TourStep[]
  onNavigateTab: (tab: string) => void
  onClose: () => void
}) {
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const step = steps[index]

  const remeasure = useCallback(() => {
    setRect(measure(step.target))
  }, [step.target])

  useEffect(() => {
    if (step.tab) onNavigateTab(step.tab)
    setRect(null)
    // A tab switch triggers an async route change + re-render in the parent
    // before the target even exists in the DOM — poll briefly instead of
    // assuming any fixed number of frames is enough.
    let cancelled = false
    const start = Date.now()
    const tryMeasure = () => {
      if (cancelled) return
      const r = measure(step.target)
      if (r) { setRect(r); return }
      if (Date.now() - start < 2000) requestAnimationFrame(tryMeasure)
    }
    requestAnimationFrame(tryMeasure)
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  useEffect(() => {
    window.addEventListener('resize', remeasure)
    window.addEventListener('scroll', remeasure, true)
    return () => {
      window.removeEventListener('resize', remeasure)
      window.removeEventListener('scroll', remeasure, true)
    }
  }, [remeasure])

  useEffect(() => {
    if (rect) {
      const el = document.querySelector(step.target)
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.target])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') back()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const next = () => setIndex(i => Math.min(i + 1, steps.length - 1))
  const back = () => setIndex(i => Math.max(i - 1, 0))
  const isLast = index === steps.length - 1

  if (!rect) {
    // Target not found yet (still switching tabs / rendering) — show a
    // dimmed overlay only, no spotlight, rather than nothing at all
    return (
      <div className="fixed inset-0 z-[200]" style={{ background: 'rgba(15,20,35,0.6)' }} />
    )
  }

  const spotlightStyle: React.CSSProperties = {
    position: 'fixed',
    top: rect.top - PAD,
    left: rect.left - PAD,
    width: rect.width + PAD * 2,
    height: rect.height + PAD * 2,
    borderRadius: 14,
    boxShadow: '0 0 0 9999px rgba(15,20,35,0.72)',
    border: '2px solid #FF9800',
    pointerEvents: 'none',
    transition: 'top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease',
    zIndex: 201,
  }

  // Position the tooltip relative to the spotlight, flipping to fit the viewport
  const placement = step.placement ?? 'bottom'
  const gap = 16
  let tooltipStyle: React.CSSProperties = { position: 'fixed', zIndex: 202, maxWidth: 320 }
  const vw = window.innerWidth
  const vh = window.innerHeight
  const cx = rect.left + rect.width / 2

  if (placement === 'bottom' && rect.top + rect.height + gap + 160 < vh) {
    tooltipStyle = { ...tooltipStyle, top: rect.top + rect.height + PAD + gap, left: Math.min(Math.max(cx - 160, 16), vw - 336) }
  } else if (placement === 'top' && rect.top - gap - 160 > 0) {
    tooltipStyle = { ...tooltipStyle, bottom: vh - (rect.top - PAD) + gap, left: Math.min(Math.max(cx - 160, 16), vw - 336) }
  } else if (placement === 'left' && rect.left - gap - 320 > 0) {
    tooltipStyle = { ...tooltipStyle, top: Math.min(Math.max(rect.top - 20, 16), vh - 220), right: vw - (rect.left - PAD) + gap }
  } else if (placement === 'right' && rect.left + rect.width + gap + 320 < vw) {
    tooltipStyle = { ...tooltipStyle, top: Math.min(Math.max(rect.top - 20, 16), vh - 220), left: rect.left + rect.width + PAD + gap }
  } else {
    // fallback: center bottom of viewport
    tooltipStyle = { ...tooltipStyle, bottom: 24, left: Math.max(16, vw / 2 - 160) }
  }

  return (
    <>
      <div style={spotlightStyle} />
      <div
        className="rounded-2xl p-5 bg-white shadow-2xl"
        style={{ ...tooltipStyle, border: '1px solid rgba(0,0,0,0.08)' }}
        role="dialog"
        aria-label="Dashboard tour"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#FF9800' }}>
            Step {index + 1} of {steps.length}
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Close tour">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <h3 className="font-black text-slate-800 text-base mb-1.5">{step.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4">{step.body}</p>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip tour
          </button>
          <div className="flex gap-2">
            {index > 0 && (
              <button onClick={back} className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Back
              </button>
            )}
            <button
              onClick={isLast ? onClose : next}
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
              style={{ background: '#FF9800', color: '#1F2937' }}
            >
              {isLast ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
        <div className="flex gap-1 mt-3">
          {steps.map((_, i) => (
            <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= index ? '#FF9800' : '#e2e8f0' }} />
          ))}
        </div>
      </div>
    </>
  )
}
