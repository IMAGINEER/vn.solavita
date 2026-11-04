'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FormModal, { useFormModalEvent } from '@/components/FormModal'
import LocaleMenu from '@/components/LocaleMenu'
import PartnerFormModal, {
  usePartnerFormModalEvent,
} from '@/components/PartnerFormModal'

gsap.registerPlugin(ScrollTrigger)

/**
 * VN site footer (Vietnam).
 *
 * Composition (mirrors the UK footer structure):
 *   ┌────────────────────────────────────────────────────────────┐
 *   │  Top divider line                                           │
 *   ├────────────────────────────────────────────────────────────┤
 *   │  Brand area          │  Link columns                       │
 *   │  ─────────────────── │  ─────────────────                  │
 *   │  Logo                │  Solutions  Company                 │
 *   │  Tagline             │  Support                            │
 *   │  Contact             │  Legal                              │
 *   │  Social (FB, WA)     │                                     │
 *   ├────────────────────────────────────────────────────────────┤
 *   │  Sub-footer                                              │
 *   │  ──────────────────────────────────────────────────────────│
 *   │  Copyright              Locale menu (flag + country list)  │
 *   └────────────────────────────────────────────────────────────┘
 *
 * Footer surface colour is driven by theme rules (`.light-mode footer`,
 * `.dark footer` in globals.css). No Tailwind bg-* class is applied here -
 * the surface is `#EEF2F7` in light mode and `#060E1A` in dark mode so
 * the footer always matches the project's standard page background
 * palette, regardless of `variant`.
 *
 * Typography reuses existing utilities: headings `text-white`, body
 * links `text-white/70 hover:text-white`, muted `text-white/50`. In
 * light mode the existing global CSS flips `text-white*` to dark
 * navy and `border-white*` to low-opacity navy, so no mode-specific
 * overrides are required in this file.
 *
 * The Solutions column lists the two collection pages. The legal
 * entity is the Hong Kong parent, SKYWORTH RENEWABLE ENERGY COMPANY
 * LIMITED; contact details in the Support column and the copyright
 * line use the VN email address. Details still awaiting verification
 * are rendered as red `TBD — ...` placeholders.
 */

export interface FooterLink {
  label: string
  href: string
  external?: boolean
}

interface FooterProps {
  variant?: 'dark' | 'light'
  logoSrc?: string
  logoAlt?: string
  productLinks?: FooterLink[]
  companyLinks?: FooterLink[]
}

export default function Footer({
  variant = 'dark',
  logoSrc = '/images/a1logo02.svg',
  logoAlt = 'Solavita Việt Nam',
  productLinks,
  companyLinks,
}: FooterProps) {
  const footerRef = useRef<HTMLElement>(null)
  const isLight = variant === 'light'

  // Host the consultation FormModal here so every page that renders Footer
  // (homepage, /solutions, /cases, /about-us, /support, /for-partners,
  // /contact-us, etc.) gets the same open-modal event wiring without each
  // page having to host it locally. The /my-plan page is the exception -
  // it intentionally doesn't render Footer because its Edit-details modal
  // uses different props (hideAddressAndContact, custom submit endpoint).
  //
  // PartnerFormModal is hosted here for the same reason — every page that
  // mounts this Footer can dispatch `openPartnerFormModal()` from a partner
  // CTA (currently only /for-partners) without each page having to mount
  // the modal locally. Two modals instead of one because they post to
  // different endpoints (`/api/consultation` vs `/api/partner`) and serve
  // different purposes; see `lib/partner-form-modal.ts` for the rationale.
  const [formOpen, setFormOpen] = useState(false)
  useFormModalEvent(setFormOpen, () => {})
  const [partnerFormOpen, setPartnerFormOpen] = useState(false)
  usePartnerFormModalEvent(setPartnerFormOpen, () => {})

  useEffect(() => {
    const ctx = gsap.context(() => {
      const columns = footerRef.current?.querySelectorAll('.footer-col')
      if (columns) {
        gsap.fromTo(
          columns,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }, footerRef)

    return () => ctx.revert()
  }, [])

  // ─── Link sets (Vietnam) ────────────────────────────────────────────────

  const defaultProductLinks: FooterLink[] = [
    // The collection-pages brief calls for two top-level scenario links
    // (Home / Business).
    // The detailed package comparison, tech explainers, FAQs and CTAs
    // live on the dedicated `/solutions/home-solar` and
    // `/solutions/business-solar` pages — there are no per-tier
    // landing pages. Mirrors the Header dropdown.
    { label: 'Cho hộ gia đình', href: '/solutions/home-solar/' },
    { label: 'Cho doanh nghiệp', href: '/solutions/business-solar/' },
  ]

  const defaultCompanyLinks: FooterLink[] = [
    // Route to the dedicated /about-us page so the footer works from
    // every page that renders it (was previously '#about', which is
    // a same-page hash and dead from any non-homepage context).
    { label: 'Về Solavita', href: '/about-us/' },
    { label: 'Tập đoàn SKYWORTH', href: 'https://www.skyworth-pv.com/about-us', external: true },
    { label: 'Blog', href: '/blog/' },
  ]

  const products = productLinks ?? defaultProductLinks
  const companies = companyLinks ?? defaultCompanyLinks

  // Legal links - promoted from the bottom bar to a dedicated column.
  // The /cookies page now serves as the sole reference for cookie use;
  // there is no longer a separate settings panel.
  const legalLinks: FooterLink[] = [
    { label: 'Điều khoản sử dụng', href: '/terms/', external: false },
    { label: 'Chính sách bảo mật', href: '/privacy/', external: false },
    { label: 'Chính sách cookie', href: '/cookies/', external: false },
  ]

  // ─── Reusable class strings ────────────────────────────────────────────
  const headingClass = `font-cw-bold text-xs uppercase tracking-[0.18em] mb-5 text-white`
  const linkClass = `text-white/70 hover:text-uk-teal-soft text-sm font-cw-regular transition-colors duration-200`

  return (
    <>
    <footer
      ref={footerRef}
      className="relative"
    >
      {/* Top divider - fades into the footer on both sides */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* ───── Main content: Brand + 6 link columns ───── */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-10 lg:gap-8">
          {/* ── Brand column (full row on mobile/tablet; col-span-2 on xl) ── */}
          <div className="col-span-2 md:col-span-4 xl:col-span-2 footer-col">
            <div className="mb-4">
              <img src={logoSrc} alt={logoAlt} className="h-8 w-auto" />
            </div>
            {/* Brand slogan — sits directly under the logo. Colour
               pulled from the UK brand teal (`--color-uk-teal`) to keep
               the line consistent across locales; "Vital Life!" is
               bolded so the call-to-action tail lands harder than the
               prefix. Legal/compliance copy (entity name, company
               number, registered office) lives in the sub-footer
               copyright row, not here. */}
            <p className="text-uk-teal text-sm font-cw-regular leading-snug">
              Vital Energy <span className="font-cw-bold font-extrabold">Vital Life!</span>
            </p>
            {/* Social accounts — WhatsApp only until a verified VN
                Facebook page is supplied (the previous site page ID was removed).
                The round icon button matches the DE / IT / UK footers
                (`w-9 h-9 rounded-full border`), and the `border-white/10`
                + `text-white` classes are picked up by the theme rules
                in app/globals.css, so the button stays legible on both
                the light (#EEF2F7) and dark (#060E1A) footer surfaces. */}
            <div className="mt-5 flex gap-3">
              <a
                href="https://wa.me/8618500875025"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all hover:bg-white/10 hover:border-white/30"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Solutions ── */}
          <div className="footer-col">
            <h4 className={headingClass}>Giải pháp</h4>
            <ul className="space-y-3">
              {products.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ── */}
          <div className="footer-col">
            <h4 className={headingClass}>Công ty</h4>
            <ul className="space-y-3 text-white/70 text-sm font-cw-regular">
              {companies.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Support ── */}
          <div className="footer-col">
            <h4 className={headingClass}>Hỗ trợ</h4>
            <ul className="space-y-3 text-white/70 text-sm font-cw-regular">
              <li>
                <a href="/contact-us/" className={linkClass}>
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="/monitoring-app/" className={linkClass}>
                  Ứng dụng giám sát
                </a>
              </li>
              <li>
                <a href="/support/#faq" className={linkClass}>
                  FAQ
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <a
                  href="mailto:vn@solavita.com"
                  className="text-sm font-cw-regular text-white/80 hover:text-white transition-colors"
                >
                  vn@solavita.com
                </a>
              </li>
            </ul>
          </div>

          {/* ── Legal (Terms / Privacy / Cookies) ── */}
          <div className="footer-col">
            <h4 className={headingClass}>Pháp lý</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ───── Sub-footer: copyright + Vietnam locale ───── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* The copyright paragraph can grow long ("© 2026 ... All
              rights reserved."); letting it claim flex-1 with min-w-0
              means it wraps inside the available space instead of
              shoving the locale row off the right edge. The locale
              row is `shrink-0` so the flag + label always render at
              their natural width — they never compress or break. The
              legal entity is the Hong Kong parent, SKYWORTH RENEWABLE
              ENERGY COMPANY LIMITED. */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <p className="text-white/50 text-xs font-cw-regular text-center md:text-left min-w-0 flex-1">
              © 2026 <span className="font-cw-bold">SKYWORTH RENEWABLE ENERGY COMPANY LIMITED</span>. Bảo lưu mọi quyền.
            </p>
            {/* Locale picker — an expandable menu of every Solavita /
                SKYWORTH Solar site. The old static "flag + label" block
                lived here; see components/LocaleMenu.tsx. */}
            <LocaleMenu />
          </div>
        </div>
      </div>

      {/* Bottom gradient accent line - UK teal-to-emerald */}
      <div className="h-1 w-full bg-uk-gradient" />
    </footer>

    {/* Universal consultation FormModal - listens for `openFormModal()`
        dispatched from Header / Hero / inline CTAs across every page
        that mounts this Footer. Portals to <body> so it sits above the
        Lenis-wrapped page surface. */}
    <FormModal open={formOpen} onClose={() => setFormOpen(false)} />

    {/* Partner enquiry PartnerFormModal - listens for
        `openPartnerFormModal()` dispatched from /for-partners partner CTAs.
        Posts to `/api/partner` (Supabase `vn_partner_leads`); the
        consultation FormModal above posts to `/api/consultation`. */}
    <PartnerFormModal
      open={partnerFormOpen}
      onClose={() => setPartnerFormOpen(false)}
    />
  </>
  )
}