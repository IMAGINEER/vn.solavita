'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'cookie_consent'

interface ConsentState {
  /** always true — strictly necessary cookies can't be opted out of */
  necessary: true
  analytics: boolean
  marketing: boolean
}

/**
 * Event name for the same-tab consent broadcast.
 *
 * Consumed by `GoogleAnalyticsConsent` (and any future consent-gated
 * third party) so they can react to a banner click with zero polling.
 * The `storage` event covers the cross-tab case but does NOT fire on
 * the originating tab, which is why this CustomEvent exists.
 *
 * The detail payload is the full `ConsentState` so listeners don't
 * need to re-read localStorage to act on the change.
 */
export const CONSENT_CHANGE_EVENT = 'solavita:consent-change'

declare global {
  interface WindowEventMap {
    'solavita:consent-change': CustomEvent<ConsentState>
  }
}

function persist(next: ConsentState, value: 'accepted' | 'rejected') {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      value,
      analytics: next.analytics,
      marketing: next.marketing,
    })
  )
  // Same-tab broadcast for consent-gated loaders (e.g. GA4). The
  // `storage` event does NOT fire in the originating tab, so consumers
  // that need instant reaction to a banner click listen for this event.
  // Cross-tab updates still rely on the `storage` event in the loader.
  // `CONSENT_CHANGE_EVENT` is exported so other modules can typecheck
  // their `addEventListener` payload against `ConsentState`.
  window.dispatchEvent(
    new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: next })
  )
}

/**
 * First-visit cookie consent banner. Reads/writes the `cookie_consent`
 * key so the user's choice persists across visits.
 *
 * Banner only appears when no decision has been recorded yet
 * (`localStorage` empty). For details about the cookies we use, see the
 * Cookie Policy at /cookies.
 */
export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(STORAGE_KEY)
    // Only show the banner if the user has not made a decision yet.
    // Both the new JSON shape and the legacy plain-string shape count.
    if (raw === null) {
      setIsVisible(true)
    }
  }, [])

  function handleAccept() {
    persist({ necessary: true, analytics: true, marketing: true }, 'accepted')
    setIsVisible(false)
  }

  function handleReject() {
    persist({ necessary: true, analytics: false, marketing: false }, 'rejected')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4">
      <div className="max-w-7xl mx-auto bg-white border border-uk-line rounded-xl p-4 md:p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm text-uk-navy font-cw-regular leading-relaxed">
              Quyền riêng tư của Bạn rất quan trọng đối với chúng tôi. Khi truy cập trang web của chúng tôi, Bạn đồng ý với việc sử dụng tất cả cookie.{' '}
              <a
                href="/cookies/"
                rel="noopener noreferrer"
                className="text-uk-teal hover:text-uk-teal-dark transition-colors"
              >
                Đọc Chính sách cookie của chúng tôi.
              </a>
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={handleReject}
              className="px-5 py-2.5 rounded-full text-sm font-cw-bold text-uk-slate border border-uk-line hover:bg-uk-teal-soft transition-all"
            >
              Từ chối
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 rounded-full text-sm font-cw-bold text-white bg-uk-teal hover:bg-uk-teal-dark transition-all"
            >
              Chấp nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}