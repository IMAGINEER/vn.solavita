import type { Metadata } from 'next'
import './globals.css'
import ClientOnlyCookieConsent from '@/components/ClientOnlyCookieConsent'
import GoogleAnalyticsConsent from '@/components/GoogleAnalyticsConsent'
import JsonLd from '@/components/seo/JsonLd'
import { SITE_URL } from '@/lib/seo/site'
import {
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/seo/jsonld'

export const metadata: Metadata = {
  // metadataBase derives from the same SITE_URL constant every other URL
  // builder (canonical / OG / sitemap / JSON-LD) uses. Single source of
  // truth - change SITE_URL, this follows.
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Solar Panels & Battery Storage for UK Homes',
    template: '%s | Solavita UK',
  },
  description:
    'Solavita delivers premium solar panels and battery storage for UK homes. Two-week installation. MCS-certified. UK-wide support.',
  keywords:
    'solar panels UK, solar battery storage, photovoltaic, UK solar, MCS certified, Solavita, SKYWORTH, renewable energy UK, SEG, Smart Export Guarantee',
  robots: { index: true, follow: true },
  // Deliberately NO `alternates.canonical` here. Every page exports its
  // own canonical via `buildPageMetadata()`. A root-level canonical
  // propagates to every child page (this was the Phase 1 P0-1 root
  // cause) - the whole site canonicalised to `/`.
  //
  // Site-wide OG defaults. Page-level `buildPageMetadata()` overrides
  // these with the page's hero asset. Twitter card is `summary_large_image`
  // so WhatsApp / LinkedIn / X show the full hero instead of a small icon.
  openGraph: {
    title: 'Solavita UK - Power Your Home. Shape a Greener UK.',
    description:
      'Premium solar & storage for UK homes. Two-week turnaround.',
    url: SITE_URL,
    siteName: 'Solavita UK',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/hero-system-render.webp`,
        width: 1200,
        height: 630,
        alt: 'Solavita UK - solar panels and battery storage for UK homes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solavita UK - Power Your Home. Shape a Greener UK.',
    description:
      'Premium solar & storage for UK homes. Two-week turnaround.',
    images: [`${SITE_URL}/images/hero-system-render.webp`],
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
    <html lang="en" className="light-mode" suppressHydrationWarning>
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