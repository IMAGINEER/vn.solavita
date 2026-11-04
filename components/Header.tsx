'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ChevronDown, ChevronLeft, ArrowRight, Download } from 'lucide-react'
import { openFormModal } from '@/lib/form-modal'

export interface HeaderNavItem {
  label: string
  /**
   * Omit on a dropdown-only item (e.g. Products) so the label opens the
   * menu without navigating — there is no aggregate page behind it.
   */
  href?: string
  /**
   * If set, the desktop link opens a hover-dropdown of this kind. The
   * `solutions` / `products` variants surface the entries listed in
   * `NAV_DROPDOWNS` — the information architecture from
   * `docs/修改建议.docx` (Oct 2026).
   */
  dropdown?: 'solutions' | 'products'
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

/** One entry inside a nav dropdown. */
interface NavDropdownEntry {
  label: string
  href: string
  description: string
}

/** A highlight CTA pinned under a dropdown's entries. */
interface NavDropdownQuickCta {
  label: string
  href: string
  description: string
}

interface NavDropdownGroup {
  entries: NavDropdownEntry[]
  /** Optional accent CTA, rendered above the "Get Free Quote" button. */
  quickCta?: NavDropdownQuickCta
}

/**
 * The two dropdown groups, per the IA table in `docs/修改建议.docx`
 * (Oct 2026):
 *
 *   Solutions  → For Home / For Business
 *   Products   → Module / Inverter / Battery / All-in-One ESS
 *
 * Each Products entry goes straight to its own detail page — there is
 * no aggregate /products hub (removed Oct 2026).
 *
 * The Solutions group also carries a quick CTA to the Solavita
 * Monitoring App so the download path is one hover away from the main
 * nav.
 */
const NAV_DROPDOWNS: Record<'solutions' | 'products', NavDropdownGroup> = {
  solutions: {
    entries: [
      {
        label: 'Cho hộ gia đình',
        href: '/solutions/home-solar/',
        description:
          'Dòng HOME — ba gói giải pháp điện mặt trời và pin lưu trữ cho hộ gia đình.',
      },
      {
        label: 'Cho doanh nghiệp',
        href: '/solutions/business-solar/',
        description:
          'Dòng BUSINESS — ba gói giải pháp ba pha cho cửa hàng, doanh nghiệp vừa và nhỏ và công trình lớn hơn.',
      },
    ],
    quickCta: {
      label: 'Tải ứng dụng giám sát',
      href: '/monitoring-app/',
      description:
        'Theo dõi sản lượng, pin và phụ tải ngay trên điện thoại — iOS và Android.',
    },
  },
  products: {
    entries: [
      {
        label: 'Tấm quang năng',
        href: '/products/module/',
        description:
          'Tấm pin TOPCon 620–640 W — hiệu suất lên đến 23,7%, sản lượng hai mặt, bảo hành hiệu suất 30 năm.',
      },
      {
        label: 'Bộ biến tần',
        href: '/products/inverter/',
        description:
          'Biến tần hybrid và off-grid từ 3 kW đến 20 kW, một pha và ba pha.',
      },
      {
        label: 'Pin lưu trữ',
        href: '/products/battery/',
        description:
          'Pin LiFePO₄ dạng mô-đun — khối 5,12–16,08 kWh, ghép tối đa 16 đơn vị.',
      },
      {
        label: 'ESS tất cả trong một',
        href: '/products/all-in-one-ess/',
        description:
          'Tủ lưu trữ năng lượng C&I 125 kW / 261 kWh — một thiết bị cho toàn bộ công trình.',
      },
    ],
  },
}

const DEFAULT_NAV: HeaderNavItem[] = [
  // "Solutions" and "Products" are hover-dropdowns. Solutions still
  // navigates to its landing page when the label is clicked; Products
  // has no landing page, so its label only opens the menu.
  { label: 'Giải pháp', href: '/solutions/home-solar/', dropdown: 'solutions' },
  { label: 'Sản phẩm', dropdown: 'products' },
  { label: 'Dự án', href: '/cases/' },
  { label: 'Về chúng tôi', href: '/about-us/' },
  { label: 'Hỗ trợ', href: '/support/' },
  { label: 'Dành cho đối tác', href: '/for-partners/' },
]

const DEFAULT_CTA: HeaderCTA = {
  label: 'Liên hệ',
  href: '/contact-us/',
}

export default function Header({
  showBackButton = false,
  onBack,
  logoHref = '/',
  logoSrc = '/images/a1logo02.svg',
  logoAlt = 'Solavita Logo',
  logoSrcSecondary,
  logoAltSecondary = 'Solavita',
  navItems = DEFAULT_NAV,
  cta = DEFAULT_CTA,
}: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
              aria-label="Quay lại"
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
                if (item.dropdown) {
                  return (
                    <NavDropdown
                      key={item.label}
                      triggerHref={item.href}
                      triggerLabel={item.label}
                      isScrolled={isScrolled}
                      group={NAV_DROPDOWNS[item.dropdown]}
                    />
                  )
                }
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`text-sm font-cw-regular transition-colors duration-300 ${
                      isScrolled
                        ? 'text-uk-navy/70 hover:text-uk-teal'
                        : 'text-uk-navy/80 hover:text-uk-teal'
                    }`}
                  >
                    {item.label}
                  </a>
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
            <nav className="flex flex-col gap-2 pb-6 bg-white/95 rounded-2xl p-4 -mx-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  {/* Dropdown-only items (Products) have no href — their
                      label is a plain heading above the inline entries. */}
                  {item.href ? (
                    <a
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-cw-regular text-uk-navy/80 hover:text-uk-navy py-2 border-b border-uk-line block"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-base font-cw-regular text-uk-navy/80 py-2 border-b border-uk-line block">
                      {item.label}
                    </span>
                  )}
                  {/* Mobile has no hover, so the dropdown entries are
                      listed inline under their parent. */}
                  {item.dropdown && (
                    <div className="pl-4 -mt-1 mb-1 flex flex-col">
                      {NAV_DROPDOWNS[item.dropdown].entries.map((entry) => (
                        <a
                          key={entry.href}
                          href={entry.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-sm font-cw-regular text-uk-slate hover:text-uk-teal py-2"
                        >
                          {entry.label}
                        </a>
                      ))}
                      {NAV_DROPDOWNS[item.dropdown].quickCta && (
                        <a
                          href={NAV_DROPDOWNS[item.dropdown].quickCta!.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="mt-1 inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal-dark py-2"
                        >
                          <Download className="w-4 h-4" strokeWidth={2} />
                          {NAV_DROPDOWNS[item.dropdown].quickCta!.label}
                        </a>
                      )}
                    </div>
                  )}
                </div>
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

/* ──────────────────────────────────────────────────────────────────────
   NavDropdown - one dropdown panel per top-level nav item with a
   `dropdown` type. Encapsulates open/close state + outside-click + ESC
   + 150ms hover grace so the user can travel from the trigger to the
   panel without it snapping shut.

   `triggerHref` is optional: Solutions navigates to its landing page,
   Products has no landing page so its trigger only toggles the panel.
   ────────────────────────────────────────────────────────────────────── */

interface NavDropdownProps {
  triggerHref?: string
  triggerLabel: string
  isScrolled: boolean
  group: NavDropdownGroup
}

function NavDropdown({
  triggerHref,
  triggerLabel,
  isScrolled,
  group,
}: NavDropdownProps) {
  const { entries, quickCta } = group
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const openPanel = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setOpen(true)
  }
  const scheduleClose = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false)
      closeTimeoutRef.current = null
    }, 150)
  }

  /** Shared trigger typography — identical for the link and button forms. */
  const triggerClass =
    'text-sm font-cw-regular transition-colors duration-300 inline-flex items-center gap-1.5'

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={openPanel}
      onMouseLeave={scheduleClose}
    >
      {triggerHref ? (
        <a
          href={triggerHref}
          onFocus={openPanel}
          aria-haspopup="true"
          aria-expanded={open}
          className={`${triggerClass} ${
            open
              ? 'text-uk-teal'
              : isScrolled
              ? 'text-uk-navy/70 hover:text-uk-navy'
              : 'text-uk-navy/80 hover:text-uk-navy'
          }`}
        >
          {triggerLabel}
          <ChevronDown
            className={`w-3 h-3 transition-all duration-300 ${
              open ? 'rotate-180 text-uk-teal' : ''
            }`}
            strokeWidth={2}
          />
        </a>
      ) : (
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openPanel())}
          onFocus={openPanel}
          aria-haspopup="true"
          aria-expanded={open}
          className={`${triggerClass} cursor-pointer ${
            open
              ? 'text-uk-teal'
              : isScrolled
              ? 'text-uk-navy/70 hover:text-uk-navy'
              : 'text-uk-navy/80 hover:text-uk-navy'
          }`}
        >
          {triggerLabel}
          <ChevronDown
            className={`w-3 h-3 transition-all duration-300 ${
              open ? 'rotate-180 text-uk-teal' : ''
            }`}
            strokeWidth={2}
          />
        </button>
      )}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 w-[420px] pt-3 z-50
                    transition-all duration-200 ease-out origin-top
                    ${
                      open
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
        role="menu"
        aria-hidden={!open}
      >
        <span
          aria-hidden="true"
          className="absolute top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-uk-line rotate-45 z-[1]"
        />
        <div className="relative bg-white rounded-2xl shadow-[0_20px_40px_-12px_rgba(15,118,110,0.18),0_8px_24px_-4px_rgba(10,22,40,0.06)] ring-1 ring-uk-teal/5 border border-uk-line p-3 flex flex-col gap-1.5">
          {entries.map((entry) => (
            <a
              key={entry.href}
              href={entry.href}
              onClick={() => setOpen(false)}
              className="group flex items-start gap-3 p-3 rounded-xl border border-transparent
                         hover:border-uk-line hover:bg-uk-teal-soft/40
                         transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <div className="font-cw-bold text-uk-navy text-sm leading-tight">
                  {entry.label}
                </div>
                <div className="text-xs text-uk-slate mt-1 leading-relaxed">
                  {entry.description}
                </div>
              </div>
              <ArrowRight
                className="flex-shrink-0 w-4 h-4 mt-0.5 text-uk-slate
                           transition-all duration-200 opacity-0 -translate-x-1
                           group-hover:opacity-100 group-hover:translate-x-0
                           group-hover:text-uk-teal"
                strokeWidth={2}
              />
            </a>
          ))}
          {/* Optional accent CTA — the Solutions group uses it for the
              Monitoring App download, so the app is one hover from the
              nav. */}
          {quickCta && (
            <a
              href={quickCta.href}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 p-3 rounded-xl border border-uk-teal/30
                         bg-uk-teal-soft/50 hover:bg-uk-teal-soft/80 hover:border-uk-teal/60
                         transition-all duration-200"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-uk-teal/25 flex items-center justify-center text-uk-teal-dark">
                <Download className="w-4 h-4" strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-cw-bold text-uk-navy text-sm leading-tight">
                  {quickCta.label}
                </div>
                <div className="text-xs text-uk-slate mt-1 leading-relaxed">
                  {quickCta.description}
                </div>
              </div>
              <ArrowRight
                className="flex-shrink-0 w-4 h-4 mt-0.5 text-uk-teal
                           transition-all duration-200 opacity-0 -translate-x-1
                           group-hover:opacity-100 group-hover:translate-x-0"
                strokeWidth={2}
              />
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              openFormModal()
            }}
            className="btn-gradient w-full mt-1 px-5 py-3 rounded-lg text-sm font-cw-bold text-white cursor-pointer"
          >
            Nhận báo giá miễn phí →
          </button>
        </div>
      </div>
    </div>
  )
}
