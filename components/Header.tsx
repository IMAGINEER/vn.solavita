'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Check, ChevronDown, ChevronLeft } from 'lucide-react'
import { ukProducts } from '@/lib/data/uk-products'

/**
 * Map each product in the homepage Products section to the matching
 * detail section anchor on /solutions so the Solutions dropdown jumps
 * straight to the relevant detail block instead of back to the home
 * products grid.
 */
const PRODUCT_TO_SOLUTION_ANCHOR: Record<string, string> = {
  essential: 'residential-solar',
  'storage-core': 'solar-storage',
  'smart-home': 'smart-home',
  'premium-backup': 'energy-integration',
}

export interface HeaderNavItem {
  label: string
  href: string
  /** If set, the desktop link opens a hover-dropdown of this kind. */
  dropdown?: 'products'
}

interface HeaderCTA {
  label: string
  href?: string
  onClick?: () => void
  /** Render as <a target="_blank"> when true. Default false. */
  external?: boolean
}

interface HeaderProps {
  showBackButton?: boolean
  onBack?: () => void
  logoHref?: string
  logoSrc?: string
  logoAlt?: string
  logoSrcSecondary?: string
  logoAltSecondary?: string
  navItems?: HeaderNavItem[]
  cta?: HeaderCTA
}

const DEFAULT_NAV: HeaderNavItem[] = [
  { label: 'Solutions', href: '/solutions', dropdown: 'products' },
  { label: 'Cases', href: '/cases' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Support', href: '/support' },
  { label: 'For Partners', href: '/for-partners' },
]

const DEFAULT_CTA: HeaderCTA = {
  label: 'Contact Us',
  href: '/contact-us',
}

export default function Header({
  showBackButton = false,
  onBack,
  logoHref = '/',
  logoSrc = '/static/images/a1logo02.svg',
  logoAlt = 'Solavita Logo',
  logoSrcSecondary,
  logoAltSecondary = 'Solavita',
  navItems = DEFAULT_NAV,
  cta = DEFAULT_CTA,
}: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const solutionsWrapperRef = useRef<HTMLDivElement | null>(null)
  const solutionsCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)

    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    )

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the Solutions dropdown on outside click / ESC. The hover handlers
  // cover the link → panel path; these listeners cover every other exit.
  useEffect(() => {
    if (!solutionsOpen) return
    const onClick = (e: MouseEvent) => {
      if (
        solutionsWrapperRef.current &&
        !solutionsWrapperRef.current.contains(e.target as Node)
      ) {
        setSolutionsOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSolutionsOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [solutionsOpen])

  const openSolutions = () => {
    if (solutionsCloseTimeoutRef.current) {
      clearTimeout(solutionsCloseTimeoutRef.current)
      solutionsCloseTimeoutRef.current = null
    }
    setSolutionsOpen(true)
  }
  // 150ms grace period so the user can travel from the trigger link into the
  // panel without it closing mid-traversal.
  const scheduleCloseSolutions = () => {
    solutionsCloseTimeoutRef.current = setTimeout(() => {
      setSolutionsOpen(false)
      solutionsCloseTimeoutRef.current = null
    }, 150)
  }

  const renderCTA = (extraClass = '') => {
    const cls = `${extraClass} btn-gradient px-5 py-2.5 rounded-full text-sm font-cw-bold text-white`
    if (cta.external && cta.href) {
      return (
        <a href={cta.href} target="_blank" rel="noopener noreferrer" className={cls}>
          {cta.label}
        </a>
      )
    }
    if (cta.href) {
      return (
        <a href={cta.href} className={cls}>
          {cta.label}
        </a>
      )
    }
    return (
      <button onClick={cta.onClick} className={cls} type="button">
        {cta.label}
      </button>
    )
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? showBackButton
            ? 'bg-[#F7F9FC]/95 backdrop-blur-xl border-b border-[rgba(10,22,40,0.1)] py-3'
            : 'bg-white/90 backdrop-blur-xl border-b border-uk-line py-3'
          : showBackButton
          ? 'bg-[#F7F9FC]/80 backdrop-blur-sm py-4'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: 3-column layout when back button shown */}
        <div className={`flex items-center ${showBackButton ? 'lg:justify-start justify-between' : 'justify-between'}`}>
          {/* Mobile back button - left side */}
          {showBackButton && (
            <button
              onClick={onBack}
              className="lg:hidden p-2 text-uk-navy"
              aria-label="Back"
            >
              <ChevronLeft size={24} strokeWidth={2} />
            </button>
          )}

          {/* Logo - centered on mobile when back button shown */}
          <div className={`flex items-center gap-3 ${showBackButton ? 'absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0' : ''}`}>
            <a href={logoHref} target={logoHref.startsWith('http') ? '_blank' : undefined} rel={logoHref.startsWith('http') ? 'noopener noreferrer' : undefined}>
              <img src={logoSrc} alt={logoAlt} className="h-6 sm:h-8 w-auto" />
            </a>
            {logoSrcSecondary && (
              <>
                <span className="text-uk-slate/40 text-xl font-light select-none" aria-hidden="true">|</span>
                <a href={logoHref} target={logoHref.startsWith('http') ? '_blank' : undefined} rel={logoHref.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  <img src={logoSrcSecondary} alt={logoAltSecondary} className="h-6 sm:h-8 w-auto" />
                </a>
              </>
            )}
          </div>

          {/* Desktop nav */}
          {!showBackButton && (
            <nav className="hidden lg:flex items-center gap-10 ml-auto mr-8">
              {navItems.map((item) => {
                if (item.dropdown === 'products') {
                  return (
                    <div
                      key={item.href}
                      ref={solutionsWrapperRef}
                      // No extra padding here — the 150ms close-delay handles
                      // the link→panel travel. Adding padding would push the
                      // link text out of vertical alignment with the other
                      // nav items in this `items-center` flex row.
                      className="relative"
                      onMouseEnter={openSolutions}
                      onMouseLeave={scheduleCloseSolutions}
                    >
                      <a
                        href={item.href}
                        onFocus={openSolutions}
                        aria-haspopup="true"
                        aria-expanded={solutionsOpen}
                        className={`text-sm font-cw-regular transition-colors duration-300 inline-flex items-center gap-1.5 ${
                          solutionsOpen
                            ? 'text-uk-teal'
                            : isScrolled
                            ? 'text-uk-navy/70 hover:text-uk-navy'
                            : 'text-uk-navy/80 hover:text-uk-navy'
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-3 h-3 transition-all duration-300 ${
                            solutionsOpen ? 'rotate-180 text-uk-teal' : ''
                          }`}
                          strokeWidth={2}
                        />
                      </a>
                      {/* Panel is always in the DOM so the entry/exit
                         transition can fire; closed = opacity-0 + translate
                         + pointer-events-none. */}
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 w-[580px] pt-3 z-50
                                    transition-all duration-200 ease-out origin-top
                                    ${
                                      solutionsOpen
                                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                                        : 'opacity-0 -translate-y-2 pointer-events-none'
                                    }`}
                        role="menu"
                        aria-hidden={!solutionsOpen}
                      >
                        {/* Tail — rotated square pointing up at the trigger;
                           sits 6px below the outer top with z-1 so it layers
                           over the panel's top border and reads as one piece. */}
                        <span
                          aria-hidden="true"
                          className="absolute top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-uk-line rotate-45 z-[1]"
                        />
                        <div className="relative bg-white rounded-2xl shadow-[0_20px_40px_-12px_rgba(15,118,110,0.18),0_8px_24px_-4px_rgba(10,22,40,0.06)] ring-1 ring-uk-teal/5 border border-uk-line p-4 flex flex-col gap-3">
                          {ukProducts.map((p) => {
                            const anchor =
                              PRODUCT_TO_SOLUTION_ANCHOR[p.id] ?? p.id
                            return (
                            <a
                              key={p.id}
                              href={`/solutions#${anchor}`}
                              onClick={() => setSolutionsOpen(false)}
                              className="group relative p-4 rounded-xl border border-uk-line bg-white
                                         hover:border-uk-teal hover:shadow-md hover:-translate-y-0.5
                                         transition-all duration-300"
                            >
                              {p.popular && (
                                <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-uk-emerald text-white text-[10px] font-cw-bold tracking-wider">
                                  POPULAR
                                </span>
                              )}

                              {/* Horizontal: thumbnail left, text right */}
                              <div className="flex items-center gap-4">
                                {/* Image — bare, no backdrop */}
                                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                                  <img
                                    src={p.imagePath}
                                    alt={p.name}
                                    className="max-h-full max-w-full object-contain
                                               transition-transform duration-500 ease-out
                                               group-hover:scale-110"
                                  />
                                </div>

                                {/* Text block */}
                                <div className="flex-1 min-w-0">
                                  <div className="font-cw-bold text-uk-navy text-sm leading-tight truncate">
                                    {p.name}
                                  </div>
                                  <div className="text-xs text-uk-slate mt-1 truncate">
                                    {p.subtitle}
                                  </div>
                                  {/* Power & storage — teal accent */}
                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <span className="text-uk-teal font-cw-bold text-xs">
                                      {p.power}
                                    </span>
                                    {p.storage !== '—' && (
                                      <>
                                        <span className="text-uk-slate text-xs">/</span>
                                        <span className="text-uk-teal font-cw-bold text-xs">
                                          {p.storage}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Trailing arrow — appears on hover */}
                                <span className="flex-shrink-0 text-uk-slate group-hover:text-uk-teal transition-all duration-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0">
                                  →
                                </span>
                              </div>
                            </a>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <Fragment key={item.href}>
                    <a
                      href={item.href}
                      className={`text-sm font-cw-regular transition-colors duration-300 ${
                        isScrolled
                          ? 'text-uk-navy/70 hover:text-uk-teal'
                          : 'text-uk-navy/80 hover:text-uk-teal'
                      }`}
                    >
                      {item.label}
                    </a>
                  </Fragment>
                )
              })}
            </nav>
          )}

          <div className="flex items-center gap-4">
            {!showBackButton && (
              <div className="hidden sm:inline-flex">
                {renderCTA()}
              </div>
            )}

            {!showBackButton && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-uk-navy"
                aria-label="Menu"
              >
                <div className="w-6 h-5 relative flex flex-col justify-between">
                  <span
                    className={`w-full h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                  />
                  <span
                    className={`w-full h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`w-full h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu - hidden when showBackButton */}
        {!showBackButton && (
          <div
            className={`lg:hidden overflow-x-hidden overflow-y-auto transition-all duration-500 ${
              mobileMenuOpen ? 'max-h-[80vh] mt-6' : 'max-h-0'
            }`}
          >
            <nav className="flex flex-col gap-4 pb-6 bg-white/95 rounded-2xl p-4 -mx-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-cw-regular text-uk-navy/80 hover:text-uk-navy py-2 border-b border-uk-line"
                >
                  {item.label}
                </a>
              ))}
              <div onClick={() => setMobileMenuOpen(false)}>
                {renderCTA('w-full text-center mt-2')}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
