'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (consent === null) {
      setIsVisible(true)
    }

    const handleShowCookieBanner = () => {
      setIsVisible(true)
    }
    window.addEventListener('show-cookie-banner', handleShowCookieBanner)
    return () => window.removeEventListener('show-cookie-banner', handleShowCookieBanner)
  }, [])

  const handleConfirm = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setIsVisible(false)
  }

  const handleReject = () => {
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
                href="/cookies"
                rel="noopener noreferrer"
                className="text-uk-teal hover:text-uk-teal-dark transition-colors"
              >
                For more information about how we process your personal data, please see our Cookie Policy.
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
              onClick={handleConfirm}
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