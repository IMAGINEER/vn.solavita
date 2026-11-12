'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FormModal, { useFormModalEvent } from '@/components/FormModal'
import type { FormData } from '@/lib/form-types'
import LocaleMenu from '@/components/LocaleMenu'
import PartnerFormModal, {
  usePartnerFormModalEvent,
} from '@/components/PartnerFormModal'
import {
  SITE_LEGAL_NAME,
  SITE_COMPANY_NUMBER,
  SITE_REGISTERED_OFFICE,
} from '@/lib/seo/site'

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
 *   │  Social (FB/TT/Zalo) │                                     │
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
 * entity is the Vietnamese company named on the business registration
 * certificate; contact details in the Support column and the copyright
 * line use the VN email address, and the sub-footer carries the
 * certificate-confirmed enterprise code and registered office. Details
 * still awaiting verification are rendered as red `TBD — ...`
 * placeholders.
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
  // Callers can seed the form via `openFormModal({ solutionType: ... })`
  // — e.g. the SolaMate package CTAs preselect the balcony answer. The
  // hook hands us the payload; we forward it to FormModal and clear it
  // on close so the next open starts from scratch.
  const [formInitialData, setFormInitialData] = useState<
    Partial<FormData> | undefined
  >(undefined)
  useFormModalEvent(setFormOpen, setFormInitialData)
  const closeFormModal = () => {
    setFormOpen(false)
    setFormInitialData(undefined)
  }
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
    // Three top-level solution lines (Nov 2026 restructure). The
    // detailed package comparison, tech explainers, FAQs and CTAs live
    // on the dedicated `/solutions/solamate`, `/solutions/solahome` and
    // `/solutions/business-solar` pages — there are no per-tier
    // landing pages. Mirrors the Header dropdown.
    { label: 'SolaMate — ban công & di động', href: '/solutions/solamate/' },
    { label: 'SolaHome — mái nhà & khuôn viên', href: '/solutions/solahome/' },
    { label: 'Cho doanh nghiệp nhỏ', href: '/solutions/business-solar/' },
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

  // ─── Social accounts (Vietnam) ──────────────────────────────────────────
  // The official VN channels, supplied by the business (Nov 2026). They
  // replace the single WhatsApp button that was here before. The round
  // icon button matches the DE / IT / UK footers (`w-9 h-9 rounded-full
  // border`), and the `border-white/10` + `text-white` classes are
  // picked up by the theme rules in app/globals.css, so the buttons stay
  // legible on both the light (#EEF2F7) and dark (#060E1A) surfaces.
  const socialAccounts: {
    id: string
    href: string
    label: string
    handle: string
    icon: ReactNode
    /**
     * Set when the brand ships its own square app-style tile (Zalo).
     * The tile then IS the button — no circle chrome around it —
     * because the artwork already carries its own rounded shape.
     */
    image?: string
  }[] = [
    {
      id: 'facebook',
      href: 'https://www.facebook.com/SkyworthPVVN',
      label: 'Facebook',
      handle: '@Solavita Việt Nam',
      icon: (
        <svg
          className="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: 'tiktok',
      href: 'https://www.tiktok.com/@skyworthsolar.vn',
      label: 'TikTok',
      handle: '@solavita.vietnam',
      icon: (
        <svg
          className="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
        </svg>
      ),
    },
    {
      id: 'zalo',
      href: 'https://zalo.me/4285176467678936526',
      label: 'Zalo',
      handle: '@Solavita Việt Nam',
      // The official Zalo mark — a blue speech bubble with the blue
      // wordmark. It replaces the hand-drawn bubble glyph that used to
      // sit here, which no longer read as Zalo.
      image: '/images/zalo-logo.png',
      icon: (
        <img
          src="/images/zalo-logo.png"
          alt=""
          className="h-full w-full object-cover"
          width={36}
          height={36}
          loading="lazy"
        />
      ),
    },
  ]

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
            {/* Social accounts — the official VN channels (Facebook,
                TikTok, Zalo). Each button carries the platform name and
                the account handle, so the handle is discoverable on hover
                and to screen readers. */}
            <div className="mt-5 flex gap-3">
              {socialAccounts.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} — ${s.handle}`}
                  title={`${s.label} · ${s.handle}`}
                  className={
                    s.image
                      ? 'w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center transition-all hover:opacity-80'
                      : 'w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all hover:bg-white/10 hover:border-white/30'
                  }
                >
                  {s.icon}
                </a>
              ))}
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
              legal entity name, enterprise code and registered office
              are the certificate-confirmed Vietnamese details. */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="min-w-0 flex-1 text-center md:text-left">
              <p className="text-white/50 text-xs font-cw-regular">
                © 2026 <span className="font-cw-bold">{SITE_LEGAL_NAME}</span>. Bảo lưu mọi quyền.
              </p>
              <p className="mt-1 text-white/40 text-[11px] font-cw-regular">
                Mã số doanh nghiệp: {SITE_COMPANY_NUMBER}
              </p>
              <p className="text-white/40 text-[11px] font-cw-regular">
                {SITE_REGISTERED_OFFICE}
              </p>
            </div>
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
    <FormModal
      open={formOpen}
      onClose={closeFormModal}
      initialData={formInitialData}
    />

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