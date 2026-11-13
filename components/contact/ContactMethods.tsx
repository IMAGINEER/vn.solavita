'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Phone, MapPin, Check } from 'lucide-react'
import { contactChannels, type ContactChannel } from '@/lib/data/contact'

gsap.registerPlugin(ScrollTrigger)

const iconFor = (icon: ContactChannel['icon']) => {
  const common = 'w-6 h-6'
  const props = { className: common, strokeWidth: 1.6 } as const
  switch (icon) {
    case 'mail':
      return <Mail {...props} />
    case 'phone':
      return <Phone {...props} />
    case 'map-pin':
      return <MapPin {...props} />
  }
}

/**
 * Copy a string to clipboard. Falls back to a hidden textarea +
 * document.execCommand for browsers / contexts without the async
 * Clipboard API (older Safari, some in-app webviews).
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    if (typeof document === 'undefined') return false
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    ta.style.pointerEvents = 'none'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

/** Strip `mailto:` / `tel:` prefix for display + clipboard. */
function rawAddress(href: string): string {
  return href
    .replace(/^mailto:/i, '')
    .replace(/^tel:/i, '')
    .trim()
}

/**
 * Three contact-method cards (email / phone / office). Mirrors the
 * SupportCategories card primitive and the contact section on the
 * existing /support page so the visual language stays consistent.
 *
 * `clickable` toggles whether the cards render as `<a>` (default) or
 * as plain `<div>`. Used by /about-us, where the section is purely
 * informational for now — no calls / emails open from the cards.
 */
export default function ContactMethods({ clickable = true }: { clickable?: boolean } = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  // Transient toast shown after the user clicks an email card. Tells them
  // the address was copied so they can paste it manually when no mail
  // app is registered with the OS (which is what makes `mailto:` a silent
  // no-op). Auto-dismisses after a few seconds.
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-method-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => {
      ctx.revert()
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 4500)
  }

  /**
   * Email card click handler. Strategy:
   *   1. Copy the bare address to the clipboard so the user always has
   *      something to paste, regardless of OS mail-app state.
   *   2. Try to navigate to mailto: — works when a default mail client
   *      is registered.
   *   3. Show a confirmation toast so the user always sees feedback.
   *      (Browsers can't reliably detect whether `mailto:` actually
   *      opened an app, so the safest UX is to tell the user the address
   *      is on the clipboard and let them proceed either way.)
   */
  const handleEmailClick = async (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    const address = rawAddress(href)
    const copied = await copyToClipboard(address)
    // Fire mailto: in the same gesture so OSes that DO have a handler
    // still open the mail composer.
    window.location.href = href
    showToast(
      copied
        ? `Đã sao chép ${address}. Nếu ứng dụng email không mở, hãy dán địa chỉ này vào trình soạn thư của bạn.`
        : `Đang mở ${address} – nếu ứng dụng email không mở, vui lòng sao chép địa chỉ thủ công.`
    )
  }

  return (
    <section
      ref={sectionRef}
      id="contact-methods"
      className="relative py-16 md:py-24 bg-sv-blue/10 dark:bg-sv-darker overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-uk-teal/10 blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Chọn kênh liên hệ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Những cách khác để{' '}
            <span className="text-gradient">kết nối với chúng tôi</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-2xl mx-auto">
            Bạn thích gọi điện hay gửi email hơn? Dưới đây là các kênh liên hệ
            trực tiếp với đội ngũ dịch vụ Solavita Việt Nam.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 gap-6 ${
            contactChannels.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
          }`}
        >
          {contactChannels.map((c) => {
            const cardClass =
              'contact-method-card rounded-2xl p-6 lg:p-8 bg-white border border-uk-line flex flex-col items-start text-left ' +
              (clickable ? 'hover:border-uk-teal/50 hover:shadow-md transition-all' : '')

            // Top portion of the card: icon + label + value. This is the
            // part that becomes the main clickable region. The description
            // (which can contain an inline `tel:` fallback link for the
            // WhatsApp card) is intentionally rendered as a SIBLING so
            // it isn't trapped inside an outer <a> / <button> — nested
            // interactive elements are invalid HTML and browsers would
            // otherwise follow only the outer href.
            const cardTop = (
              <>
                <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-5">
                  {iconFor(c.icon)}
                </div>
                <div
                  className={`text-xs font-cw-bold tracking-wider text-uk-teal-dark${c.label === 'WhatsApp' ? '' : ' uppercase'}`}
                >
                  {c.label}
                </div>
                <div className="mt-1 text-xl font-cw-bold text-uk-navy break-all">
                  {c.value}
                </div>
              </>
            )
            const descriptionBlock = c.description && (
              <p className="mt-3 text-sm text-uk-slate font-cw-regular leading-relaxed">
                {c.description}
              </p>
            )

            // Email cards (mailto:) get a button + custom handler so we
            // can fall back to clipboard + toast when the OS has no
            // default mail app.
            const isEmail = c.href.startsWith('mailto:')
            // WhatsApp cards carry an inline tel: fallback in their
            // description, so we MUST NOT wrap the whole card in a
            // single <a> — otherwise the tel: link would be ignored
            // and the whole card would only ever open wa.me.
            const isWhatsApp = c.label === 'WhatsApp'

            if (!clickable) {
              return (
                <div key={c.label} className={cardClass}>
                  {cardTop}
                  {descriptionBlock}
                </div>
              )
            }
            if (isEmail) {
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={(e) => handleEmailClick(e, c.href)}
                  className={`${cardClass} cursor-pointer`}
                >
                  {cardTop}
                  {descriptionBlock}
                </button>
              )
            }
            if (isWhatsApp) {
              return (
                <div
                  key={c.label}
                  className={cardClass}
                >
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-m-6 lg:-m-8 p-6 lg:p-8 rounded-2xl transition-colors cursor-pointer flex flex-col items-start text-left w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)]"
                  >
                    {cardTop}
                  </a>
                  {descriptionBlock}
                </div>
              )
            }
            return (
              <a
                key={c.label}
                href={c.href}
                className={`${cardClass} cursor-pointer`}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {cardTop}
                {descriptionBlock}
              </a>
            )
          })}
        </div>
      </div>

      {/* Toast - confirms email was copied. z-index sits above the
         floating buttons (which are at 9999 in globals.css) so it stays
         visible while the user reaches for their mail app. */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] max-w-[min(90vw,520px)] px-5 py-3 rounded-full bg-uk-navy text-white shadow-lg flex items-center gap-2 text-sm font-cw-regular"
        >
          <Check className="w-4 h-4 text-uk-emerald flex-shrink-0" strokeWidth={2.4} />
          <span className="leading-snug">{toast}</span>
        </div>
      )}
    </section>
  )
}
