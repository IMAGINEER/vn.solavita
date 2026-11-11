import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import ClientOnlyCookieConsent from '@/components/ClientOnlyCookieConsent'
import GoogleAnalyticsConsent from '@/components/GoogleAnalyticsConsent'
import JsonLd from '@/components/seo/JsonLd'
import { SITE_URL, SITE_INDEXING_ENABLED, absoluteUrl } from '@/lib/seo/site'
import {
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/seo/jsonld'

/**
 * Site typeface — Be Vietnam Pro, self-hosted by next/font.
 *
 * It replaces the old `Chuangwei-*` stack, which never shipped a font file,
 * so the site was silently rendering in the OS default sans-serif. Be
 * Vietnam Pro is drawn for Vietnamese: the stacked tone marks (ế, ộ, ữ)
 * sit at consistent heights across weights instead of colliding with the
 * line above.
 *
 * The weights map onto the existing `font-cw-*` utilities (see the
 * `:where()` rules in globals.css): 300 = light, 400 = regular,
 * 700 = bold the three the design already used. 500/600/800 cover the
 * Tailwind `font-medium` / `font-semibold` / `font-extrabold` classes.
 */
const vnSans = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-vn',
})

export const metadata: Metadata = {
  // metadataBase derives from the same SITE_URL constant every other URL
  // builder (canonical / OG / sitemap / JSON-LD) uses. Single source of
  // truth - change SITE_URL, this follows.
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Hệ thống điện mặt trời & pin lưu trữ cho gia đình Việt Nam',
    template: '%s | Solavita Việt Nam',
  },
  description:
    'Khám phá giải pháp điện mặt trời và pin lưu trữ cho hộ gia đình và doanh nghiệp nhỏ tại Việt Nam. So sánh cấu hình hệ thống và tìm giải pháp giúp nguồn điện ổn định hơn.',
  keywords:
    'điện mặt trời Việt Nam, pin lưu trữ điện, điện mặt trời hộ gia đình, điện mặt trời doanh nghiệp, Solavita, SKYWORTH, năng lượng tái tạo Việt Nam',
  // Pre-launch the site is closed to indexing (see
  // `SITE_INDEXING_ENABLED` in lib/seo/site.ts). Every page that
  // builds its own metadata applies the same switch, because a
  // page-level `robots` replaces the inherited one.
  robots: { index: SITE_INDEXING_ENABLED, follow: SITE_INDEXING_ENABLED },
  alternates: {
    languages: {
      'vi-VN': 'https://vn.solavita.com',
      // Sibling hosts.
      //
      // These were the apex domains `solavita.uk` / `solavita.de`,
      // inherited from the NG build (NG's layout.tsx has the same
      // two values). Every other place in this codebase that links to
      // a sister site — the footer country directory in
      // `lib/data/footer-sites.ts` and `public/js/geo-redirect.js` —
      // uses the SUBDOMAIN form, so the hreflang entries pointed at
      // different hosts than the ones the site actually sends visitors
      // to. A hreflang that points at a redirect is treated as
      // invalid, so the two forms have to agree; this now matches the
      // footer's form.
      //
      // TODO(launch): confirm both hosts resolve before re-enabling
      // indexing — this pair is the last thing to check. Inert today,
      // because the whole site is `noindex` (see SITE_INDEXING_ENABLED
      // in lib/seo/site.ts).
      'en-GB': 'https://uk.solavita.com',
      'de-DE': 'https://de.solavita.com',
    },
  },
  // Deliberately NO `alternates.canonical` here. Every page exports its
  // own canonical via `buildPageMetadata()`. A root-level canonical
  // propagates to every child page (this was the Phase 1 P0-1 root
  // cause) - the whole site canonicalised to `/`.
  //
  // Cross-domain alternates for the SKYWORTH Group family of sites.
  // Google treats these as `hreflang`-style language alternates that
  // associate regional sites for the same brand. The vi-VN entry points
  // at this site; the en-GB (`uk`) and de-DE (`de`) sibling sites are
  // also declared. Any future country site extends this list.
  //
  // Site-wide OG defaults. Page-level `buildPageMetadata()` overrides
  // these with the page's hero asset. Twitter card is `summary_large_image`
  // so WhatsApp / LinkedIn / X show the full hero instead of a small icon.
  openGraph: {
    title: 'Solavita Việt Nam - Điện mặt trời & pin lưu trữ',
    description:
      'Giải pháp điện mặt trời và pin lưu trữ cho hộ gia đình và doanh nghiệp nhỏ tại Việt Nam.',
    url: absoluteUrl('/'),
    siteName: 'Solavita Việt Nam',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/og-default.jpg`,
        // The asset is rendered at exactly the 1200x630 OG box, so the
        // declared size matches the file and every platform crops
        // nothing. Keep in sync with OG_IMAGE_WIDTH/HEIGHT in
        // lib/seo/site.ts.
        width: 1200,
        height: 630,
        alt: 'Solavita Việt Nam - Hệ thống điện mặt trời và pin lưu trữ cho gia đình và doanh nghiệp Việt Nam',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solavita Việt Nam - Điện mặt trời & pin lưu trữ',
    description:
      'Giải pháp điện mặt trời và pin lưu trữ cho hộ gia đình và doanh nghiệp nhỏ tại Việt Nam.',
    images: [`${SITE_URL}/images/og-default.jpg`],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // SSR default is `light-mode` so the very first paint (before any
    // inline script runs, and even when JS is disabled/blocked) matches
    // what `.light-mode X` rules expect. Previously `<html>` shipped with
    // no className; because `:root` itself is dark, browsers would paint
    // a frame of :root dark before the head script could add `.light-mode`,
    // producing the "pre-hydration dark mode looks different from the
    // manually-toggled dark mode" mismatch users reported.
    //
    // `suppressHydrationWarning` on <html> is needed because the inline
    // script below may swap the class before React hydrates.
    <html
      lang="vi"
      className={`light-mode ${vnSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/favicon.ico" />
        {/* Site-wide Schema.org entities. Emitted in the root layout so
           every page can `@id`-reference the same Organization / WebSite
           (Article.publisher, WebPage.isPartOf, ...) instead of duplicating
           inline nodes per page. See lib/seo/jsonld.ts for the builders. */}
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {/* Pre-hydration theme bootstrap - must run before React paints.
           SSR ships <html class="light-mode"> as the safe default; this
           script only flips to `.dark` when the user previously opted in
           (localStorage.theme === 'dark'). The legacy `.light-mode` class
           is kept on the element in the light case so existing
           `.light-mode X` overrides keep firing; when dark, `.dark` is
           added so the new `.dark X` overrides + Tailwind v4 `dark:`
           utilities activate. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.remove('light-mode');document.documentElement.classList.add('dark');}}catch(e){}",
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <ClientOnlyCookieConsent />
        {/*
          GA4 fires only after the user accepts "analytics" cookies.
          See components/GoogleAnalyticsConsent.tsx for the PECR-
          compliant consent-gate pattern. Must be the LAST child of
          <body> so the loader's effect runs after CookieConsent
          mounts and reads the latest localStorage state.
        */}
        <GoogleAnalyticsConsent />
      </body>
    </html>
  )
}
