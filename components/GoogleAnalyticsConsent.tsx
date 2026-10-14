'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { CONSENT_CHANGE_EVENT } from './CookieConsent'

// Declare the gtag global the bootstrap script installs on `window`.
// Kept file-local (NOT exported) so no other module accidentally picks
// up the typing and starts using gtag without going through this
// loader's consent gate.
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

/**
 * UK GDPR / PECR-compliant GA4 loader.
 *
 * Only fires the gtag.js bootstrap + the page_view hit AFTER the user
 * has accepted "analytics" cookies via the CookieConsent banner.
 *
 * Consent propagation:
 *   1. On mount, this loader reads `localStorage.cookie_consent` once
 *      to honour any pre-existing decision (back-button, cross-tab,
 *      /cookies settings page).
 *   2. The `storage` event handles cross-tab consent updates.
 *   3. The `solavita:consent-change` CustomEvent (dispatched by
 *      CookieConsent on click) handles SAME-TAB clicks - the `storage`
 *      event does NOT fire in the originating tab, so without this
 *      CustomEvent a user who accepts in this tab would have to wait
 *      up to 250ms (next SPA-poll tick) or longer for a tab switch.
 *
 * Why not `<GoogleAnalytics gaId="..." />` from `@next/third-parties`?
 * That component ships gtag.js unconditionally on first paint, which
 * means users who click "Reject" are still tracked until gtag boots.
 * Under UK PECR that is a breach regardless of whether we subsequently
 * issue `gtag('consent', 'update', {analytics_storage:'denied'})`. The
 * only safe pattern is "do not load the script until consent is given".
 *
 * We DO send a page_view on every SPA-style route change once analytics
 * is on, because Next.js client routing doesn't reload the page - so a
 * user who accepts on the home page then navigates to /solutions still
 * wants that /solutions navigation counted.
 */

const STORAGE_KEY = 'cookie_consent'
// GA4 measurement IDs are PUBLIC by design — the GA4 docs require the
// ID to be embedded in client-facing JS (gtag('config', 'G-XXXXX') and
// the `googletagmanager.com/gtag/js?id=G-XXXXX` script). Read it from
// the build-time env var `NEXT_PUBLIC_GA4_ID` so we never hardcode the
// literal in source (which Netlify's secrets scanner would otherwise
// match against the env var's resolved value and fail the build). The
// `SECRETS_SCAN_OMIT_KEYS = "NEXT_PUBLIC_GA4_ID"` entry in
// `netlify.toml` whitelists the inlined value in the production bundle.
// When the env var is absent (e.g. local dev without setup) the
// component silently no-ops via the `!GA_ID` guard below — no broken
// gtag calls, no console spam.
const GA_ID = process.env.NEXT_PUBLIC_GA4_ID

/** Read `analytics` consent without doing any I/O beyond localStorage. */
function readAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    // New JSON shape: { value, analytics, marketing }
    const parsed = JSON.parse(raw)
    return Boolean(parsed.analytics)
  } catch {
    // Legacy plain-string shape - "accepted" was the old opt-in to all.
    // Treated as opt-in for analytics for backwards compatibility.
    try {
      return window.localStorage.getItem(STORAGE_KEY) === 'accepted'
    } catch {
      return false
    }
  }
}

export default function GoogleAnalyticsConsent() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  useEffect(() => {
    // Initial decision (covers returning users with prior consent).
    setAnalyticsEnabled(readAnalyticsConsent())

    // Same-tab banner click: CookieConsent dispatches this CustomEvent
    // after writing to localStorage. The detail is the full new state
    // so we don't need to re-read storage.
    const onConsentChange = (e: Event) => {
      const ce = e as CustomEvent<{ analytics: boolean }>
      setAnalyticsEnabled(Boolean(ce.detail?.analytics))
    }

    // Cross-tab updates: a user accepting/rejecting in another tab.
    // `storage` only fires on tabs OTHER than the one that wrote,
    // which is exactly what we want here (same-tab is covered above).
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === STORAGE_KEY) setAnalyticsEnabled(readAnalyticsConsent())
    }

    window.addEventListener(CONSENT_CHANGE_EVENT, onConsentChange)
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, onConsentChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  // SPA route-change tracking - Next.js doesn't reload the page on
  // client navigation, so the initial page_view would only count the
  // landing route. Poll pathname because usePathname() triggers React
  // re-renders across the layout for every nav - 250ms is below the
  // INP "good" threshold and avoids that cost.
  useEffect(() => {
    if (!analyticsEnabled) return
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return
    }
    let prevPath = window.location.pathname
    const id = window.setInterval(() => {
      const next = window.location.pathname
      if (next !== prevPath) {
        prevPath = next
        window.gtag('event', 'page_view', {
          page_path: next,
          page_location: window.location.href,
        })
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [analyticsEnabled])

  if (!analyticsEnabled || !GA_ID) return null

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        // The init script must run after the gtag.js library loads.
        // Setting transport_type='beacon' ensures hits use
        // navigator.sendBeacon when available, surviving page
        // navigations - important because UK visitors often land and
        // leave within a few seconds.
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { transport_type: 'beacon' });
          `,
        }}
      />
    </>
  )
}