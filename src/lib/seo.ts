import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME, OG_IMAGE } from './site'

export function pageMetadata(opts: {
  title: string
  description: string
  path?: string
  images?: string[]
  robots?: Metadata['robots']
}): Metadata {
  const canonical = opts.path ? `${SITE_URL}${opts.path}` : undefined
  const images = opts.images ?? [OG_IMAGE]
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
      images: [{ url: images[0], width: 1200, height: 630, alt: SITE_NAME }, ...images.slice(1).map((url, i) => ({ url, width: 1200, height: 630, alt: SITE_NAME, id: `img-${i}` }))],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images,
    },
  }
}
