'use client'
import { createContext, useContext } from 'react'
import NextLink from 'next/link'
import { useRouter, usePathname, useSearchParams as useNextSearchParams } from 'next/navigation'
import type { ComponentProps } from 'react'

// App-Router shim for the react-router-dom surface the migrated frontend
// used. Components keep calling `Link`, `useNavigate`, `useParams`,
// `useLocation` and `useSearchParams` exactly as before — this module maps
// each onto next/link + next/navigation.

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & { to: string }

export function Link({ to, ...rest }: LinkProps) {
  return <NextLink href={to} {...rest} />
}

export interface RouteParams {
  [key: string]: string | string[]
}

const ParamsContext = createContext<RouteParams>({})

export function ParamsProvider({ params, children }: { params: RouteParams; children: React.ReactNode }) {
  return <ParamsContext.Provider value={params}>{children}</ParamsContext.Provider>
}

export function useParams<T extends RouteParams = RouteParams>(): T {
  return useContext(ParamsContext) as T
}

export function useNavigate() {
  const router = useRouter()
  return (to: string, opts?: { replace?: boolean }) => {
    if (opts?.replace) router.replace(to)
    else router.push(to)
  }
}

export function useLocation() {
  const pathname = usePathname()
  return { pathname, hash: typeof window !== 'undefined' ? window.location.hash : '' }
}

export function useSearchParams() {
  return useNextSearchParams()
}
