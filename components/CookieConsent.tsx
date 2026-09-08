'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'cookie_consent'

interface ConsentState {
  /** always true — strictly necessary cookies can't be opted out of */
  necessary: true
  analytics: boolean
  marketing: boolean
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
}

/**
 * First-visit cookie consent banner. Reads/writes the same
 * `cookie_consent` key the /cookies settings panel uses, so a choice
 * made here is reflected on the settings page (and vice versa).
 *
 * Banner only appears when no decision has been recorded yet
 * (`localStorage` empty). To revisit and change preferences,
 * use the Footer's "Cookie Settings" link → /cookies#settings.
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
              Your privacy is important to us. When you visit our website, you agree to the use of all cookies.{' '}
              <a
                href="/cookies#settings"
                rel="noopener noreferrer"
                className="text-uk-teal hover:text-uk-teal-dark transition-colors"
              >
                Manage your preferences in Cookie Settings.
              </a>
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={handleReject}
              className="px-5 py-2.5 rounded-full text-sm font-cw-bold text-uk-slate border border-uk-line hover:bg-uk-teal-soft transition-all"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 rounded-full text-sm font-cw-bold text-white bg-uk-teal hover:bg-uk-teal-dark transition-all"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}