'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getToken } from '../lib/api'

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (!getToken()) {
      router.replace('/admin/login')
    } else {
      setOk(true)
    }
  }, [router, pathname])

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f2444' }}>
        <div className="flex items-center gap-3 text-white/80 text-sm">
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
          Verifying access…
        </div>
      </div>
    )
  }

  return <>{children}</>
}
