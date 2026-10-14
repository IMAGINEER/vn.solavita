'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ngTrustItems } from '@/lib/data/uk-trust'

gsap.registerPlugin(ScrollTrigger)

/**
 * Slim horizontal trust / certification strip - copied 1:1 from the
 * previous UK site (`/d/UK.solavita/components/TrustBar.tsx`).
 * Renders the UK trust items (TÜV / CE / MCS / NICEIC / RECC /
 * 25-year warranty) as PNG assets under `public/images/`. The
 * `ngTrustItems` array carries the same six entries as the UK data
 * file - per the user's instruction the structure and visual treatment
 * are preserved.
 *
 * Layout: each item shows [icon] / [title] / [subtitle]. Icon height
 * is capped at 48 px; width follows the asset's intrinsic aspect
 * ratio so square and wide marks render cleanly without squashing.
 * Items marked `hidden: true` are filtered out (same as the UK).
 *
 * Note: per the brand-voice memory, UK marks must not be carried
 * over to NG without verification. This component is a 1:1 copy of
 * the UK site per the user's explicit instruction; replace the items
 * here with verified NG equivalents once business confirms them.
 */
export default function TrustBar() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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

  return (
    <div
      ref={sectionRef}
      className="trust-bar relative py-8 border-y border-white/5 bg-uk-navy"
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
              <div className="text-[10px] font-cw-regular mt-0.5 text-white/70 whitespace-nowrap">
                {item.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
