import type { Metadata } from 'next'
import './globals.css'
import ClientOnlyCookieConsent from '@/components/ClientOnlyCookieConsent'
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
        url: `${SITE_URL}/static/images/hero-system-render.webp`,
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
    images: [`${SITE_URL}/static/images/hero-system-render.webp`],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/favicon.ico" />
        {/* Site-wide Schema.org entities. Emitted in the root layout so
           every page can `@id`-reference the same Organization / WebSite
           (Article.publisher, WebPage.isPartOf, ...) instead of duplicating
           inline nodes per page. See lib/seo/jsonld.ts for the builders. */}
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {/* Pre-hydration theme bootstrap - must run before React paints to
           prevent flash-of-dark when the user has light-mode saved (or no
           preference, which defaults to light for the UK homepage). The
           source of truth is `document.documentElement` so FloatingButtons
           can toggle it from one place.
           Sets the legacy `.light-mode` class so the existing `.light-mode X`
           overrides keep firing, and (when dark) also sets `.dark` so the
           new `.dark X` overrides + Tailwind v4 `dark:` utilities activate. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t==='light'||t===null){document.documentElement.classList.add('light-mode');}else{document.documentElement.classList.add('dark');}}catch(e){}",
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <ClientOnlyCookieConsent />
      </body>
    </html>
  )
}