'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Phone } from 'lucide-react'
import FormModal, { useFormModalEvent } from '@/components/FormModal'
import PartnerFormModal, {
  usePartnerFormModalEvent,
} from '@/components/PartnerFormModal'

gsap.registerPlugin(ScrollTrigger)

/**
 * NG site footer (Nigeria).
 *
 * Composition (mirrors the UK footer structure):
 *   ┌────────────────────────────────────────────────────────────┐
 *   │  Top divider line                                           │
 *   ├────────────────────────────────────────────────────────────┤
 *   │  Brand area          │  Link columns                       │
 *   │  ─────────────────── │  ─────────────────                  │
 *   │  Logo                │  Solutions  Company                 │
 *   │  Tagline             │  Support                            │
 *   │  Legal info (TBD)    │  Legal                              │
 *   ├────────────────────────────────────────────────────────────┤
 *   │  Sub-footer                                              │
 *   │  ──────────────────────────────────────────────────────────│
 *   │  Copyright (TBD)        Nigeria · English                  │
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
 * Per `content/nigeria/products.md` the Solutions column lists the six
 * NG packages (LITE Essential Backup, HOME Standard, HOME High-spec,
 * BUSINESS Entry 3-Phase, BUSINESS Standard 3-Phase, BUSINESS
 * Flagship 3-Phase). Per NG content rules, every unverified company
 * detail (legal entity, CAC number, registered office, contact email /
 * phone, copyright holder) is rendered as a red `TBD — ...` placeholder
 * until the business confirms the value.
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

/* ────────────────────────────────────────────────────────────────────────
   Stylised Union Jack - same artwork used in Hero trust pills and Header.
   ──────────────────────────────────────────────────────────────────────── */
const FlagUK = ({ className = 'w-5 h-3.5' }: { className?: string }) => (
  <svg
    className={`${className} rounded-sm overflow-hidden flex-shrink-0`}
    viewBox="0 0 60 30"
    aria-hidden="true"
  >
    <rect width="60" height="30" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="3.5" />
    <path d="M30,0 V30 M0,15 H60" stroke="#ffffff" strokeWidth="10" />
    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
  </svg>
)

export default function Footer({
  variant = 'dark',
  logoSrc = '/images/a1logo02.svg',
  logoAlt = 'Solavita UK',
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

  // ─── Link sets (Nigeria) ────────────────────────────────────────────────

  const defaultProductLinks: FooterLink[] = [
    // Per `content/nigeria/solutions.md` the collection-pages brief
    // calls for two top-level scenario links (For Home / For Business).
    // The detailed package comparison, tech explainers, FAQs and CTAs
    // live on the dedicated `/solutions/home-solar` and
    // `/solutions/business-solar` pages — there are no per-tier
    // landing pages. Mirrors the Header dropdown.
    { label: 'For Home', href: '/solutions/home-solar' },
    { label: 'For Business', href: '/solutions/business-solar' },
  ]

  const defaultCompanyLinks: FooterLink[] = [
    // Route to the dedicated /about-us page so the footer works from
    // every page that renders it (was previously '#about', which is
    // a same-page hash and dead from any non-homepage context).
    { label: 'About Solavita', href: '/about-us' },
    { label: 'SKYWORTH Group', href: 'https://www.skyworth-pv.com/about-us', external: true },
    { label: 'Blog', href: '/blog' },
  ]

  const products = productLinks ?? defaultProductLinks
  const companies = companyLinks ?? defaultCompanyLinks

  // Legal links - promoted from the bottom bar to a dedicated column.
  // The /cookies page now serves as the sole reference for cookie use;
  // there is no longer a separate settings panel.
  const legalLinks: FooterLink[] = [
    { label: 'Terms of Use', href: '/terms', external: false },
    { label: 'Privacy Policy', href: '/privacy', external: false },
    { label: 'Cookie Policy', href: '/cookies', external: false },
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
               prefix. Legal/compliance copy (company number, registered
               office, etc.) sits directly below the slogan in the brand
               column, matching the UK footer layout. NG has no verified
               legal details, so every clause is a `TBD — ...` red
               placeholder per project content rules. */}
            <p className="text-uk-teal text-sm font-cw-regular leading-snug">
              Vital Energy <span className="font-cw-bold font-extrabold">Vital Life!</span>
            </p>
            <div className="mt-3 text-white/40 text-[11px] font-cw-regular leading-relaxed">
              <span className="text-red-400/90">TBD — Verified Nigeria legal entity</span>
              <br />
              <span className="text-red-400/90">TBD — Verified CAC registration number</span>
              <br />
              <span className="text-red-400/90">TBD — Verified Nigeria registered office address</span>
            </div>
          </div>

          {/* ── Solutions ── */}
          <div className="footer-col">
            <h4 className={headingClass}>Solutions</h4>
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
            <h4 className={headingClass}>Company</h4>
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
            <h4 className={headingClass}>Support</h4>
            <ul className="space-y-3 text-white/70 text-sm font-cw-regular">
              <li>
                <a href="/contact-us" className={linkClass}>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/hems" className={linkClass}>
                  HEMS Apps
                </a>
              </li>
              <li>
                <a href="/support#faq" className={linkClass}>
                  FAQ
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 flex-shrink-0 text-white/60" strokeWidth={2} />
                {/* No verified Nigerian sales/support email — render as a
                   red TBD placeholder (no mailto: link) per project
                   content rules. */}
                <span className="text-red-400/90 text-sm font-cw-bold">
                  TBD — Verified Nigerian sales/support email
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 flex-shrink-0 text-white/60" strokeWidth={2} />
                {/* No verified Nigerian business number — render as a
                   red TBD placeholder (no wa.me: link) per project
                   content rules. */}
                <span className="text-red-400/90 text-sm font-cw-bold">
                  TBD — Verified Nigerian business number
                </span>
              </li>
            </ul>
          </div>

          {/* ── Legal (Terms / Privacy / Cookies) ── */}
          <div className="footer-col">
            <h4 className={headingClass}>Legal</h4>
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

      {/* ───── Sub-footer: copyright + Nigeria locale ───── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* The copyright paragraph can grow long ("© 2026 ... All
              rights reserved."); letting it claim flex-1 with min-w-0
              means it wraps inside the available space instead of
              shoving the locale row off the right edge. The locale
              row is `shrink-0` so the flag + label always render at
              their natural width — they never compress or break. The
              entity name is a red TBD placeholder until the Nigerian
              business confirms its registered name. */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <p className="text-white/50 text-xs font-cw-regular text-center md:text-left min-w-0 flex-1">
              © 2026 <span className="text-red-400/90 font-cw-bold">TBD — Verified Nigerian legal entity name</span>. All rights reserved.
            </p>
            <div
              className="flex items-center gap-2 text-white/50 text-xs font-cw-regular shrink-0 self-center md:self-auto"
              aria-label="Locale: Nigeria, English"
            >
              {/* NG flag intentionally not rendered - brand team to
                  confirm the official visual identity. */}
              <span
                className="w-5 h-3.5 border border-white/20 rounded-sm flex items-center justify-center text-[8px] font-cw-bold text-white/70"
                aria-hidden="true"
              >
                NG
              </span>
              <span>Nigeria · English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient accent line - UK teal-to-emerald */}
      <div className="h-1 w-full bg-uk-gradient" />
    </footer>

    {/* Universal consultation FormModal - listens for `openFormModal()`
        dispatched from Header / HeroSection / inline CTAs across every page
        that mounts this Footer. Portals to <body> so it sits above the
        Lenis-wrapped page surface. */}
    <FormModal open={formOpen} onClose={() => setFormOpen(false)} />

    {/* Partner enquiry PartnerFormModal - listens for
        `openPartnerFormModal()` dispatched from /for-partners partner CTAs.
        Posts to `/api/partner` (Supabase `ng_partner_leads`); the
        consultation FormModal above posts to `/api/consultation`. */}
    <PartnerFormModal
      open={partnerFormOpen}
      onClose={() => setPartnerFormOpen(false)}
    />
  </>
  )
}