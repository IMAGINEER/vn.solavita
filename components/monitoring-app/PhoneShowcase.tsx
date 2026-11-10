'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

/**
 * Third screen — Monitoring App headline + phone + download CTAs.
 *
 *   ┌────────────────────────────────────┐
 *   │        Solavita Monitoring App          │  ← eyebrow pill
 *   │      Energy Dashboard              │  ← heading
 *   │  Live flows across every device…   │  ← body copy
 *   │   [ Learn about the app → ]        │  ← optional internal link
 *   │                                    │
 *   │            ┌──────┐                │
 *   │            │phone │                │  ← centered phone
 *   │            └──────┘                │
 *   │                                    │
 *   │   [ App Store ]  [ Google Play ]   │  ← download CTAs
 *   └────────────────────────────────────┘
 *
 * The phone frame keeps its dark `bg-sv-navy` body — the
 * dashboard screenshot inside it has a light surface, so a
 * light frame would clash. Download buttons sit directly below
 * the phone so the reader can install the app the moment they
 * decide it fits.
 *
 * Reused verbatim on the homepage (after QUY TRÌNH). `className` lets
 * the caller override the section background — the homepage passes a
 * white band so it does not merge with the `bg-sv-blue/10` process
 * section directly above it.
 */
export default function PhoneShowcase({
  className,
  internalLink,
}: {
  className?: string
  /**
   * Optional internal link rendered under the intro copy and above the
   * phone. Pages that embed this block (homepage, /solutions/solamate)
   * pass a link to /monitoring-app; the /monitoring-app page itself
   * omits it so the block never links to where it already lives.
   */
  internalLink?: { href: string; label: string }
} = {}) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative py-16 md:py-24 bg-sv-blue/10 overflow-hidden',
        className
      )}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title block — restored per product brief */}
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Ứng dụng giám sát Solavita
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Bảng điều khiển <span className="text-gradient">năng lượng</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular max-w-2xl mx-auto leading-relaxed">
            Theo dõi dòng năng lượng trực tiếp trong ngôi nhà của bạn —
            điện mặt trời, pin lưu trữ, điều hòa và lưới điện — trên một màn hình duy nhất.
          </p>
          {/* Internal link — sits between the intro copy and the phone,
              so the copy → link → phone order reads top to bottom. */}
          {internalLink && (
            <a
              href={internalLink.href}
              className="mt-6 inline-flex items-center gap-2 font-cw-bold text-uk-teal-dark underline underline-offset-4 transition-colors hover:text-uk-teal"
            >
              {internalLink.label}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </a>
          )}
        </div>

        {/* Centered phone */}
        <div className="mx-auto max-w-[260px]">
          <div className="relative rounded-[2.5rem] border-[6px] border-uk-navy/80 bg-sv-navy overflow-hidden shadow-2xl">
            <img
              alt="Ứng dụng giám sát Solavita – Bảng điều khiển năng lượng"
              loading="lazy"
              className="w-full h-auto block"
              src="/images/cloud-app-data.webp"
            />
          </div>
        </div>

        {/* App Store + Google Play download CTAs — directly below the
           phone, centered. Light-theme counterpart of the dark-mode
           reference card: teal-soft tile, slate border, navy text. */}
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <a
            href="https://apps.apple.com/us/app/skyworth-pv/id6499499800"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tải ứng dụng trên App Store"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-uk-teal-soft border border-uk-teal/30 hover:bg-uk-teal-soft/80 hover:border-uk-teal/60 transition-colors"
          >
            <svg
              className="w-6 h-6 text-uk-navy"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] text-uk-slate font-cw-regular">
                Tải trên
              </div>
              <div className="text-sm font-cw-bold text-uk-navy">
                App Store
              </div>
            </div>
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.solavita.cloud"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tải ứng dụng trên Google Play"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-uk-teal-soft border border-uk-teal/30 hover:bg-uk-teal-soft/80 hover:border-uk-teal/60 transition-colors"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"
                fill="#00B9EE"
              />
            </svg>
            <div className="text-left">
              <div className="text-[10px] text-uk-slate font-cw-regular">
                Tải trên
              </div>
              <div className="text-sm font-cw-bold text-uk-navy">
                Google Play
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}