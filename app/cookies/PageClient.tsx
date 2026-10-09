'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

const STORAGE_KEY = 'cookie_consent'

type ConsentValue = 'accepted' | 'rejected' | 'custom'

interface ConsentState {
  necessary: true // always on
  analytics: boolean
  marketing: boolean
}

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
}

export default function CookiesPage() {
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT)
  const [savedValue, setSavedValue] = useState<ConsentValue | null>(null)

  // Hydrate from localStorage on mount so the toggle UI reflects the
  // user's current choice rather than starting from the default.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as {
        value?: ConsentValue
        analytics?: boolean
        marketing?: boolean
      }
      setSavedValue(parsed.value ?? null)
      setConsent({
        necessary: true,
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing),
      })
    } catch {
      // Legacy plain-string consent ("accepted" / "rejected") — show
      // as accepted for analytics + marketing off (the conservative
      // default) so the user can opt in to more if they want.
      setSavedValue(raw === 'accepted' ? 'accepted' : 'rejected')
    }
  }, [])

  // Scroll the #settings anchor into view when arriving from the
  // Footer "Cookie Settings" link.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash !== '#settings') return
    const el = document.getElementById('settings')
    if (el) {
      // Defer one frame so layout settles before we scroll.
      requestAnimationFrame(() =>
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      )
    }
  }, [])

  function persist(next: ConsentState, value: ConsentValue) {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        value,
        analytics: next.analytics,
        marketing: next.marketing,
      })
    )
    setSavedValue(value)
  }

  function acceptAll() {
    const next: ConsentState = { necessary: true, analytics: true, marketing: true }
    setConsent(next)
    persist(next, 'accepted')
  }

  function rejectAll() {
    const next: ConsentState = { necessary: true, analytics: false, marketing: false }
    setConsent(next)
    persist(next, 'rejected')
  }

  function saveCustom() {
    persist(consent, 'custom')
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header showBackButton={true} onBack={handleBack} logoHref="/" />

      <section className="pt-24 pb-8 lg:pt-32 lg:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cookie Policy' },
            ]}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl lg:text-4xl font-cw-bold text-[#0A1628] mt-6 mb-2"
          >
            Cookie Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="text-sm text-[#4A5568] mb-4"
          >
            Solavita Energy UK Limited · Last updated: August 2026
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-[#0F766E] to-[#10B981] rounded"
          />
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-6">
                This Cookie Policy explains how Solavita Energy UK Limited ("we", "us") uses cookies and similar
                technologies on our website. It should be read alongside our
                {' '}<a href="/privacy" className="text-[#0F766E] hover:underline">Privacy Policy</a>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">1 What are cookies?</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Cookies are small text files placed on your device when you visit a website. They
                are widely used to make websites work efficiently and to provide information to the
                site owners.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">2 Cookies we use</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                We use the following categories of cookies on this website:
              </p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-2">
                <li>
                  <strong className="text-[#0A1628]">Strictly necessary cookies.</strong> Required
                  for the website to function (e.g. cookie-consent storage). These do not require consent.
                </li>
                <li>
                  <strong className="text-[#0A1628]">Analytics cookies.</strong> Help us understand
                  how visitors use our website so we can improve it. Only set with your consent.
                </li>
                <li>
                  <strong className="text-[#0A1628]">Marketing cookies.</strong> Used to measure the
                  effectiveness of advertising campaigns. Only set with your consent.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">3 Managing your preferences</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                You can change or withdraw your consent at any time by clicking the
                {' '}<strong className="text-[#0A1628]">"Cookie Settings"</strong> link in our footer, which opens the
                controls on this page. You can also block cookies via your browser settings. Blocking
                strictly necessary cookies may affect how the website works.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">4 Third-party cookies</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Some cookies are placed by third parties (e.g. analytics or video providers). These
                third parties may use cookies to collect information about your online activity
                across different websites. We do not control these third-party cookies.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">5 Contact</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Questions about our use of cookies? Email <a href="mailto:uk@solavita.com" className="text-[#0F766E] hover:underline">uk@solavita.com</a>.
              </p>
            </div>

            {/* Cookie Settings panel — anchor target for the Footer link. */}
            <div
              id="settings"
              className="pt-8 mt-4 border-t-2 border-[#0F766E]/30 scroll-mt-24"
            >
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-lg font-cw-bold text-[#0A1628]">
                  6 Cookie Settings
                </h2>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#0F766E]">
                  {savedValue === 'accepted'
                    ? 'All cookies on'
                    : savedValue === 'rejected'
                      ? 'Only necessary'
                      : savedValue === 'custom'
                        ? 'Custom selection'
                        : 'Not set'}
                </span>
              </div>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-5">
                Choose which categories of cookies you allow. Strictly
                necessary cookies are always on because the site cannot
                function without them.
              </p>

              <ul className="space-y-3 mb-6">
                <ConsentRow
                  title="Strictly necessary"
                  description="Required for the site to function (consent storage, page navigation)."
                  checked
                  disabled
                />
                <ConsentRow
                  title="Analytics"
                  description="Helps us understand how visitors use the site so we can improve it."
                  checked={consent.analytics}
                  onChange={(v) => setConsent((c) => ({ ...c, analytics: v }))}
                />
                <ConsentRow
                  title="Marketing"
                  description="Used to measure the effectiveness of advertising campaigns."
                  checked={consent.marketing}
                  onChange={(v) => setConsent((c) => ({ ...c, marketing: v }))}
                />
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="flex-1 rounded-full bg-[#0F766E] px-5 py-3 text-sm font-cw-bold text-white hover:bg-[#0a5d56] transition-colors"
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={rejectAll}
                  className="flex-1 rounded-full border border-[#0A1628]/20 bg-white px-5 py-3 text-sm font-cw-bold text-[#0A1628] hover:bg-[#F7F9FC] transition-colors"
                >
                  Reject all
                </button>
                <button
                  type="button"
                  onClick={saveCustom}
                  disabled={savedValue === 'custom'}
                  className="flex-1 rounded-full border border-[#0F766E] bg-white px-5 py-3 text-sm font-cw-bold text-[#0F766E] hover:bg-[#0F766E]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save preferences
                </button>
              </div>

              {savedValue && (
                <p className="mt-4 text-xs text-[#4A5568]">
                  Last saved: {savedValue === 'accepted'
                    ? 'all categories accepted'
                    : savedValue === 'rejected'
                      ? 'only strictly necessary'
                      : 'custom selection'}.
                </p>
              )}
            </div>

            <div className="pt-6 mt-8 border-t border-[rgba(10,22,40,0.1)]">
              <p className="text-xs text-[#9CA3AF]">
                Last updated: August 2026 · Solavita Energy UK Limited (Company No. 17466951) · C/O Buzzacott LLP, 130 Wood Street, London EC2V 6DL, United Kingdom (registered in England and Wales)
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

/**
 * Single row in the consent settings panel. Title + description + a
 * toggle switch. `disabled` renders the switch as locked-on for the
 * strictly-necessary category.
 */
function ConsentRow({
  title,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  title: string
  description: string
  checked: boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-xl border border-[rgba(10,22,40,0.12)] bg-white p-4">
      <div className="flex-1">
        <div className="text-sm font-cw-bold text-[#0A1628]">{title}</div>
        <div className="mt-1 text-xs text-[#4A5568] leading-relaxed">
          {description}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${title} cookies`}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={
          'relative mt-0.5 h-6 w-11 flex-none rounded-full transition-colors ' +
          (checked ? 'bg-[#0F766E]' : 'bg-[#0A1628]/20') +
          (disabled ? ' opacity-60 cursor-not-allowed' : '')
        }
      >
        <span
          aria-hidden
          className={
            'absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform ' +
            (checked ? 'translate-x-5' : 'translate-x-0.5')
          }
        />
      </button>
    </li>
  )
}