// Site-wide SEO constants. Every public page's `generateMetadata` +
// the dynamic sitemap/robots feed off these so the brand stays
// consistent across <title>, OG, Twitter, JSON-LD, and the canonical.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://solavita.uk'

export const SITE_NAME = 'Solavita UK'
export const SITE_LOCALE = 'en_GB'
export const SITE_BRAND_SHORT = 'Solavita'

/** Default share image (1200x630). Public asset; bundled with the build. */
export const DEFAULT_OG_IMAGE = '/images/og-default.webp'

export const DEFAULT_DESCRIPTION =
  'Premium solar panels and battery storage for UK homes. MCS-certified. Two-week installation. UK-wide support.'

/** Append ` | Solavita UK` consistently. */
export function appendSiteTitle(title: string | null | undefined): string {
  const t = (title ?? '').trim()
  if (!t) return SITE_NAME
  if (t === SITE_NAME) return t
  if (t.endsWith(`| ${SITE_NAME}`)) return t
  return `${t} | ${SITE_NAME}`
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${clean}`
}