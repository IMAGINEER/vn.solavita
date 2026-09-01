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
    { label: 'Solar Essential', href: '#products' },
    { label: 'Storage Core', href: '#products' },
    { label: 'Smart Home', href: '#products' },
    { label: 'Premium Backup', href: '#products' },
    { label: 'Installation Process', href: '#delivery' },
  ]

  const defaultCompanyLinks: FooterLink[] = [
    { label: 'About Solavita', href: '#about' },
    { label: 'SKYWORTH Group', href: 'https://www.skyworth-pv.com/about-us', external: true },
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
            <div className="flex gap-3">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/skyworth-pv/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center transition-all hover:bg-white/10 hover:border-white/30"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@skyworth-pv"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center transition-all hover:bg-white/10 hover:border-white/30"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M23.5 6.2c-.3-1-1.1-1.8-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5c-1 .3-1.8 1.1-2.1 2.1C0 8 0 12 0 12s0 4 .5 5.8c.3 1 1.1 1.8 2.1 2.1 1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5c1-.3 1.8-1.1 2.1-2.1.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.6 15.5V8.5l6.5 3.5-6.5 3.5z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/globalskyworthpv"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center transition-all hover:bg-white/10 hover:border-white/30"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/skysolar_latam/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center transition-all hover:bg-white/10 hover:border-white/30"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
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
                <a href="#hems" className={linkClass}>
                  HEMS Apps
                </a>
              </li>
              <li>
                <a href="#faq" className={linkClass}>
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