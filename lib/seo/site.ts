// Site-wide SEO constants. Every public page's `generateMetadata` +
// the dynamic sitemap/robots feed off these so the brand stays
// consistent across <title>, OG, Twitter, JSON-LD, and the canonical.
//
// Nigeria site — built from `content/nigeria/*` briefs. All business
// facts that haven't been verified (legal entity, address, phone, ...)
// are surfaced as visible red TBDs in the UI; this file holds the
// placeholder strings that drive metadata so a single edit cascades
// across every page.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ng.solavita.com'

export const SITE_NAME = 'Solavita Nigeria'
export const SITE_LOCALE = 'en_NG'
export const SITE_BRAND_SHORT = 'Solavita'
/**
 * Legal entity name (Terms page, footer, JSON-LD `legalName`).
 * Placeholder — the verified Nigerian legal entity must replace this
 * before production launch. See implementation-audit.md §5.
 */
export const SITE_LEGAL_NAME = 'TBD — Verified Nigeria legal entity'

/**
 * Nigerian corporate registry number (CAC).
 * Placeholder — supply the actual registration number before launch.
 */
export const SITE_COMPANY_NUMBER = 'TBD — Verified CAC registration number'

/**
 * Registered office address.
 * Placeholder — supply the actual registered office before launch.
 */
export const SITE_REGISTERED_OFFICE =
  'TBD — Verified Nigeria registered office address'

/**
 * Default share image. Reuses the homepage hero render as a stand-in
 * until a purpose-built 1200×630 branded NG OG asset is produced. The
 * page-level `buildPageMetadata` helper lets each page override this
 * with its own hero asset.
 *
 * Launch-blocker: replace with an NG-specific 1200×630 OG before
 * production release. Tracked in implementation-qa.md.
 */
export const DEFAULT_OG_IMAGE = '/images/hero-system-render.webp'

export const DEFAULT_DESCRIPTION =
  'Explore solar and battery solutions for Nigerian homes and small businesses. Compare system configurations and find a solution for more reliable power and less generator dependence.'

/** Append ` | Solavita Nigeria` consistently. */
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
