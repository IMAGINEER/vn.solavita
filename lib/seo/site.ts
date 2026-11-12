// Site-wide SEO constants. Every public page's `generateMetadata` +
// the dynamic sitemap/robots feed off these so the brand stays
// consistent across <title>, OG, Twitter, JSON-LD, and the canonical.
//
// VN site — built from the Vietnam localisation brief. Business facts
// that haven't been verified (prices, installation scope, ...) are
// surfaced as visible red TBDs in the UI; this file holds the
// constants that drive metadata so a single edit cascades across every
// page. The legal entity, enterprise code and registered office below
// come from the Vietnamese business registration certificate.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vn.solavita.com'

export const SITE_NAME = 'Solavita Việt Nam'
export const SITE_LOCALE = 'vi_VN'
export const SITE_BRAND_SHORT = 'Solavita'

/**
 * Site-wide indexing switch (pre-launch: OFF).
 *
 * The Vietnam site is not ready to be indexed — prices and the my-plan
 * ROI figures are still awaiting business confirmation, and the
 * /my-plan surface still carries the Nigeria engine's placeholder
 * figures. Until that is finished the whole site must stay out of the
 * search results.
 *
 * This flag is the single half of that switch that lives in the
 * metadata layer:
 *   - `false` → every page renders `<meta name="robots" content="noindex, nofollow">`.
 *   - `true`  → pages go back to `index, follow`.
 *
 * The other half is `app/robots.ts`, which returns a blanket
 * `User-agent: * / Disallow: /` while this flag is false. Both are
 * needed: robots.txt stops crawlers from fetching the pages (so they
 * cannot even read a `noindex` there), and the meta tag tells Google
 * to drop URLs it already knows about.
 *
 * Flip BOTH to true before launch — they are deliberately separate
 * files so neither can be reopened by accident.
 */
export const SITE_INDEXING_ENABLED = false
/**
 * Legal entity name (Terms page, footer, JSON-LD `legalName`).
 * The website operator is the Vietnamese entity named on the business
 * registration certificate (enterprise code 0319578388).
 */
export const SITE_LEGAL_NAME =
  'CÔNG TY TNHH NĂNG LƯỢNG TÁI TẠO SKYWORTH VIỆT NAM'

/**
 * Vietnamese enterprise registration number, as printed on the
 * business registration certificate.
 */
export const SITE_COMPANY_NUMBER = '0319578388'

/**
 * Registered office address, as printed on the business registration
 * certificate.
 */
export const SITE_REGISTERED_OFFICE =
  'Tòa nhà VietOffice, số 14 Trương Quyền, Phường Xuân Hòa, Thành phố Hồ Chí Minh, Việt Nam'

/**
 * Same registered office split for Schema.org `PostalAddress`. Keep
 * aligned with `SITE_REGISTERED_OFFICE` — the certificate prints the
 * ward inside the street line and the city after it.
 */
export const SITE_ADDRESS_PARTS = {
  streetAddress: 'Tòa nhà VietOffice, số 14 Trương Quyền, Phường Xuân Hòa',
  addressLocality: 'Thành phố Hồ Chí Minh',
  addressCountry: 'VN',
} as const

/**
 * No public business phone yet. The number printed on the business
 * registration certificate is the legal representative's personal
 * contact (WANG, CHUNDAN), not a customer-facing business line, so it
 * must not be published. Keep phone-dependent UI as a TBD until a
 * business number is supplied.
 */

/**
 * Default share image. A purpose-built 1200×630 JPEG brand card — the
 * standard 1.91:1 OG box, so social platforms render it without
 * letter-boxing. JPEG rather than WebP because a few crawlers (older
 * LinkedIn / WhatsApp scrapers, some CRMs) still refuse WebP.
 *
 * Every page-level share image lives under `/public/images/og-*.jpg`
 * and is generated at the same 1200×630 box, so the dimensions
 * declared in metadata always match the asset on disk.
 */
export const DEFAULT_OG_IMAGE = '/images/og-default.jpg'

/** Pixel size of every `og-*.jpg` share card in `public/images`. */
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

export const DEFAULT_DESCRIPTION =
  'Khám phá giải pháp điện mặt trời và pin lưu trữ cho hộ gia đình và doanh nghiệp nhỏ tại Việt Nam. So sánh cấu hình hệ thống và tìm giải pháp giúp nguồn điện ổn định hơn.'

/** Append ` | Solavita Việt Nam` consistently. */
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

  // Site-relative paths: guarantee a leading `/` and ADD the trailing
  // slash that `next.config.js#trailingSlash: true` serves as canonical.
  // Every caller (canonical, sitemap, JSON-LD, OG) must agree with the
  // URL Next.js actually serves, otherwise the crawler sees a 308.
  //
  // Exceptions, matching Next's own trailingSlash rules:
  //   - the root is already `/`;
  //   - static files (anything with an extension, e.g. `/images/og.png`,
  //     `/sitemap.xml`) take no slash;
  //   - `?query` / `#hash` stays after the slash (`/support/#faq`).
  const withLeading = path.startsWith('/') ? path : `/${path}`
  const split = withLeading.match(/^([^?#]*)(.*)$/)
  const pathname = split?.[1] ?? withLeading
  const suffix = split?.[2] ?? ''
  const isFile = /\.[^/]+$/.test(pathname)
  const normalized =
    pathname === '/' || isFile
      ? pathname
      : `${pathname.replace(/\/+$/, '')}/`
  return `${SITE_URL}${normalized}${suffix}`
}
