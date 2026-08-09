'use client'
import { useEffect } from 'react'

const SCRIPT_ID = 'tawk-to-embed'

// Loaded only from PublicLayout, never on /admin/* — the widget's iframe
// otherwise sits on top of the admin login/dashboard buttons and silently
// eats taps on narrow mobile viewports (it isn't clipped by the desktop's
// extra width, so it only surfaces there).
export default function TawkWidget() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return

    const w = window as unknown as { Tawk_API?: object; Tawk_LoadStart?: Date }
    w.Tawk_API = w.Tawk_API || {}
    w.Tawk_LoadStart = new Date()

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.async = true
    script.src = 'https://embed.tawk.to/6a145dfcfed09a1c33d08c4f/1jpfou9ck'
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')
    document.body.appendChild(script)

    return () => {
      document.getElementById(SCRIPT_ID)?.remove()
      document.querySelectorAll('iframe[src*="tawk.to"]').forEach(el => el.closest('div')?.remove())
    }
  }, [])

  return null
}
