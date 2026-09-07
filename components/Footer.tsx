'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Phone, Mail } from 'lucide-react'
import FormModal, { useFormModalEvent } from '@/components/FormModal'

gsap.registerPlugin(ScrollTrigger)

/**
 * UK homepage footer.
 *
 * Composition (per design):
 *   ┌────────────────────────────────────────────────────────────┐
 *   │  Top divider line                                           │
 *   ├────────────────────────────────────────────────────────────┤
 *   │  Brand area          │  6 link columns                     │
 *   │  ─────────────────── │  ─────────────────                  │
 *   │  Logo                │  Solutions  Company  Learn          │
 *   │  Tagline             │  Support    For Partners  Legal     │
 *   │  Social icons        │                                     │
 *   ├────────────────────────────────────────────────────────────┤
 *   │  Sub-footer                                             │
 *   │  ──────────────────────────────────────────────────────────│
 *   │  Copyright         UK locale / flag                       │
 *   │  ──────────────────────────────────────────────────────────│
 *   │  Disclaimer (full width, small, muted)                    │
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
  logoSrc = '/static/images/a1logo02.svg',
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
  const [formOpen, setFormOpen] = useState(false)
  useFormModalEvent(setFormOpen, () => {})

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

  // ─── Link sets (unchanged routing; cleaner labels for UK context) ─────

  const defaultProductLinks: FooterLink[] = [
    // Each product link jumps to its dedicated anchor on /solutions.
    // Was `#products` (works only on the homepage); routing to
    // `/solutions#<id>` makes the footer usable from every page that
    // renders it (about-us, support, hems, cases, ...).
    { label: 'Home Energy One', href: '/solutions#one' },
    { label: 'Home Energy Pro', href: '/solutions#pro' },
    { label: 'Home Energy Max', href: '/solutions#max' },
    { label: 'Home Energy Ultra', href: '/solutions#ultra' },
  ]

  const defaultCompanyLinks: FooterLink[] = [
    { label: 'About Solavita', href: '#about' },
    { label: 'SKYWORTH Group', href: 'https://www.skyworth-pv.com/about-us', external: true },
    { label: 'Blog', href: '/blog' },
  ]

  const products = productLinks ?? defaultProductLinks
  const companies = companyLinks ?? defaultCompanyLinks

  // Legal links - promoted from the bottom bar to a dedicated column.
  const legalLinks: FooterLink[] = [
    { label: 'Terms of Use', href: '/terms', external: false },
    { label: 'Privacy Policy', href: '/privacy', external: false },
    { label: 'Cookie Policy', href: '/cookies', external: false },
    { label: 'Cookie Settings', href: '#' },
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
            <div className="mb-6">
              <img src={logoSrc} alt={logoAlt} className="h-8 w-auto" />
            </div>
            <p className="text-white/70 text-sm font-cw-regular leading-relaxed mb-6 max-w-xs">
              A SKYWORTH Group company.
              Clean energy for every UK home - as easy as any household
              appliance.
            </p>
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
                <a href="mailto:uk@solavita.com" className={linkClass}>
                  uk@solavita.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 flex-shrink-0 text-white/60" strokeWidth={2} />
                <span>Customer Service</span>
              </li>
            </ul>
          </div>

          {/* ── Legal (Terms / Privacy / Cookies / Cookie Settings) ── */}
          <div className="footer-col">
            <h4 className={headingClass}>Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    onClick={
                      link.label === 'Cookie Settings'
                        ? (e) => {
                            e.preventDefault()
                            window.dispatchEvent(
                              new Event('show-cookie-banner')
                            )
                          }
                        : undefined
                    }
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

      {/* ───── Sub-footer: copyright + UK locale ───── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-white/50 text-xs font-cw-regular text-center md:text-left">
              © 2026 Solavita UK Ltd · 130 Wood Street, London EC2V 6DL, United
              Kingdom · A SKYWORTH Group company. All rights reserved.
            </p>
            <div
              className="flex items-center gap-2 text-white/50 text-xs font-cw-regular"
              aria-label="Locale: United Kingdom, English"
            >
              <FlagUK className="w-5 h-3.5 border border-white/20" />
              <span>United Kingdom · English</span>
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
  </>
  )
}