// Site-wide SEO constants. Every public page's `generateMetadata` +
// the dynamic sitemap/robots feed off these so the brand stays
// consistent across <title>, OG, Twitter, JSON-LD, and the canonical.
//
// VN site — built from the Vietnam localisation brief. All business
// facts that haven't been verified (legal entity, address, phone, ...)
// are surfaced as visible red TBDs in the UI; this file holds the
// placeholder strings that drive metadata so a single edit cascades
// across every page.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vn.solavita.com'

export const SITE_NAME = 'Solavita Việt Nam'
export const SITE_LOCALE = 'vi_VN'
export const SITE_BRAND_SHORT = 'Solavita'
/**
 * Legal entity name (Terms page, footer, JSON-LD `legalName`).
 * The website operator is SKYWORTH RENEWABLE ENERGY COMPANY LIMITED, a
 * Hong Kong-incorporated company and the parent entity behind the
 * Solavita brand.
 */
export const SITE_LEGAL_NAME = 'SKYWORTH RENEWABLE ENERGY COMPANY LIMITED'

/**
 * Hong Kong Companies Registry number.
 * Placeholder — supply the actual registration number before launch.
 */
export const SITE_COMPANY_NUMBER = 'TBD — Mã số đăng ký doanh nghiệp tại Hồng Kông (chờ xác minh)'

/**
 * Registered office address (Hong Kong).
 * Placeholder — supply the actual registered office before launch.
 */
export const SITE_REGISTERED_OFFICE =
  'TBD — Địa chỉ văn phòng đã đăng ký tại Hồng Kông (chờ xác minh)'

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
