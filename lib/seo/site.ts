// Site-wide SEO constants. Every public page's `generateMetadata` +
// the dynamic sitemap/robots feed off these so the brand stays
// consistent across <title>, OG, Twitter, JSON-LD, and the canonical.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://uk.solavita.com'

export const SITE_NAME = 'Solavita UK'
export const SITE_LOCALE = 'en_GB'
export const SITE_BRAND_SHORT = 'Solavita'
/** Legal entity name (Terms page, footer) - distinct from the marketing brand. */
export const SITE_LEGAL_NAME = 'Solavita UK Ltd'

/** Default share image. Currently reuses the homepage hero render
 * (assets already in repo) as a stand-in until a purpose-built 1200x630
 * branded OG asset is produced. The page-level `buildPageMetadata` helper
 * lets each page override this with its own hero asset (see /solutions,
 * /hems, ...). */
export const DEFAULT_OG_IMAGE = '/images/hero-system-render.webp'

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
  // Pass absolute URLs through unchanged (external links, already-built URLs).
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  // Site-relative paths: guarantee a leading `/` and DROP any trailing `/`.
  //
  // Although `next.config.js#trailingSlash: true` *should* make Next.js
  // canonicalise URLs with a trailing slash (per the docs), the actual
  // dev / prod server in this codebase serves the un-slashed form and
  // 308-redirects the slashed form (`/about-us/` → `/about-us`). Every
  // caller of `absoluteUrl` (canonical, sitemap, JSON-LD) must agree
  // with the URL Next.js actually serves, so we build the un-slashed
  // form. The root path `/` is preserved as-is.
  const withLeading = path.startsWith('/') ? path : `/${path}`
  const noTrailing =
    withLeading === '/' ? withLeading : withLeading.replace(/\/+$/, '')
  return `${SITE_URL}${noTrailing}`
}