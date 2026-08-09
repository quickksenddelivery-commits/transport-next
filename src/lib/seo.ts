import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME } from './site'

export function pageMetadata(opts: {
  title: string
  description: string
  path?: string
  images?: string[]
  robots?: Metadata['robots']
}): Metadata {
  const canonical = opts.path ? `${SITE_URL}${opts.path}` : undefined
  return {
    title: opts.title,
    description: opts.description,
    robots: opts.robots,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical ?? SITE_URL,
      siteName: SITE_NAME,
      title: opts.title,
      description: opts.description,
      ...(opts.images && opts.images.length ? { images: opts.images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      ...(opts.images && opts.images.length ? { images: opts.images } : {}),
    },
  }
}
