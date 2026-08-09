'use client'
const SITE = 'Accessiblexpress'

export default function PageMeta({ title, description }: { title: string; description: string }) {
  const full = title === SITE ? SITE : `${title} | ${SITE}`
  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
    </>
  )
}
