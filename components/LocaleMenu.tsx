'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronUp, ExternalLink } from 'lucide-react'
import {
  COMING_SOON_LABEL,
  CURRENT_SITE_LABEL,
  currentSite,
  footerSiteGroups,
  type FooterSite,
} from '@/lib/data/footer-sites'

/**
 * Footer locale picker — an expandable country / language menu that
 * replaces the old static "flag + label" block.
 *
 * Lists every Solavita and SKYWORTH Solar site. Sites that are not
 * live yet render as disabled rows badged "Sắp ra mắt"; the site the
 * visitor is on is badged "Bạn đang ở đây".
 *
 * Flags are local SVGs (`public/images/flags/`) so the menu never
 * depends on assets hosted on another property.
 */
export default function LocaleMenu() {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  // Close on outside click and on ESC while the menu is open.
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

  return (
    <div ref={wrapperRef} className="relative shrink-0 self-center md:self-auto">
      {/* Trigger — current site's flag + label */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Chọn quốc gia / ngôn ngữ — hiện tại ${currentSite.label}`}
        className="flex items-center gap-2 text-white/60 text-xs font-cw-regular hover:text-white transition-colors cursor-pointer"
      >
        <FlagIcon site={currentSite} />
        <span>{currentSite.label}</span>
        <ChevronUp
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
          strokeWidth={2}
        />
      </button>

      {/* Panel — opens upwards, anchored to the trigger's right edge on
          desktop and centred on it on phones (a right-anchored panel
          would run off the left edge of a narrow viewport). */}
      {open && (
        <div
          role="menu"
          className="absolute bottom-full right-0 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 w-[min(300px,calc(100vw-3rem))] rounded-2xl border border-uk-line bg-white shadow-[0_18px_44px_-16px_rgba(15,23,42,0.35)] p-2 z-50 max-h-[70vh] overflow-y-auto"
        >
          {footerSiteGroups.map((group) => (
            <div key={group.title} className="mb-2 last:mb-0">
              <div className="px-3 pt-2 pb-1 text-[10px] font-cw-bold uppercase tracking-[0.18em] text-uk-slate">
                {group.title}
              </div>
              <ul>
                {group.sites.map((site) => (
                  <li key={`${group.title}-${site.label}`}>
                    {site.href ? (
                      <a
                        role="menuitem"
                        href={site.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-1.5 hover:bg-uk-teal/10 transition-colors"
                      >
                        <FlagIcon site={site} />
                        <span className="flex-1 min-w-0 truncate text-sm font-cw-regular text-uk-navy">
                          {site.label}
                        </span>
                        {site.current ? (
                          <span className="text-[10px] font-cw-bold text-uk-teal-dark">
                            {CURRENT_SITE_LABEL}
                          </span>
                        ) : (
                          <ExternalLink
                            className="w-3 h-3 flex-shrink-0 text-uk-slate"
                            strokeWidth={2}
                          />
                        )}
                      </a>
                    ) : (
                      <span
                        role="menuitem"
                        aria-disabled="true"
                        className="flex items-center gap-3 rounded-xl px-3 py-1.5 opacity-70 cursor-not-allowed"
                      >
                        <FlagIcon site={site} />
                        <span className="flex-1 min-w-0 truncate text-sm font-cw-regular text-uk-navy">
                          {site.label}
                        </span>
                        <span className="flex-shrink-0 text-[9px] font-cw-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-uk-line text-uk-slate">
                          {COMING_SOON_LABEL}
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * The site's flag. Local SVG asset - no remote host, so there is no
 * need for an onError fallback.
 */
function FlagIcon({ site }: { site: FooterSite }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={site.icon}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="w-5 h-3.5 rounded-sm object-cover flex-shrink-0 border border-uk-line"
    />
  )
}
