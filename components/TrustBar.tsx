'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ngTrustItems } from '@/lib/data/uk-trust'
import TbdText from '@/components/ui/tbd-text'

gsap.registerPlugin(ScrollTrigger)

/**
 * Slim horizontal trust / certification strip.
 *
 * Nigeria site: the trust item list is intentionally empty
 * (`ngTrustItems` in `lib/data/uk-trust.ts`) because no NG certification
 * or warranty mark has been verified. Per the NG content strategy, the
 * UK marks (MCS / NICEIC / RECC / TUV / CE / 25-year) must not be
 * carried over and DARES-style claims are forbidden.
 *
 * When the list is empty, the component renders a single muted
 * `TBD — Verified Nigeria trust marks` line so the strip's vertical
 * footprint collapses and the rest of the page composition stays
 * intact. When NG trust marks are added later, the same component
 * renders them with the same visual treatment as before.
 */
export default function TrustBar() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ngTrustItems.length === 0) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  if (ngTrustItems.length === 0) {
    return (
      <div
        ref={sectionRef}
        className="trust-bar relative py-6 border-y border-white/5 bg-sv-dark/50"
        data-trust-bar-state="empty"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-cw-regular text-white/60 uppercase tracking-wider">
            <TbdText text="Verified Nigeria trust marks" className="text-red-400/90 text-[11px] font-cw-bold uppercase tracking-wider" />
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={sectionRef}
      className="trust-bar relative py-8 border-y border-white/5 bg-sv-dark/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center flex-wrap sm:justify-between gap-6 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
          {ngTrustItems.filter((it) => !it.hidden).map((item, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div
              key={i}
              className="flex flex-col items-center min-w-[80px] text-center flex-shrink-0"
            >
              <img
                src={item.image}
                alt={item.title}
                width={160}
                height={133}
                loading="lazy"
                className="h-12 w-auto mb-2 object-contain"
              />
              <div className="text-[12px] font-cw-bold uppercase tracking-wider leading-tight text-white">
                <span className="block whitespace-nowrap">{item.title}</span>
                {item.titleBold && (
                  <span className="block whitespace-nowrap">
                    {item.titleBold}
                  </span>
                )}
              </div>
              <div className="text-[10px] font-cw-regular mt-0.5 opacity-70 whitespace-nowrap">
                {item.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
