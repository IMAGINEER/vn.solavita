'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ukTrustItems } from '@/lib/data/uk-trust'

gsap.registerPlugin(ScrollTrigger)

/**
 * Slim horizontal trust / certification strip.
 *
 * Renders 6 hard-coded certification marks (TÜV / CE / MCS / NICEIC /
 * RECC / 25-year warranty) as PNG assets under `public/images/`. Each
 * item shows: [icon] / [title] / [subtitle]. Icon height is capped at
 * 133px and width follows the asset's intrinsic aspect ratio (so a
 * square mark and a wider mark both render cleanly without squashing).
 *
 * Light-mode overrides in `app/globals.css` (`.light-mode .trust-bar`,
 * `.light-mode [class*="bg-sv-dark/50"]`, `.light-mode [class*="border-white/"]`,
 * `.light-mode [class*="text-white/"]`) invert the dark surface and
 * white type — no per-mode code needed here.
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
      className="trust-bar relative py-8 border-y border-white/5 bg-sv-dark/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center flex-wrap sm:justify-between gap-6 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
          {ukTrustItems.filter((it) => !it.hidden).map((item, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div
              key={i}
              className="flex flex-col items-center min-w-[80px] text-center flex-shrink-0"
            >
              {/* Icon — fixed height (matches the original lucide 48px
                  glass-chip slot); width follows each asset's intrinsic
                  aspect ratio. Logos range 126-266 px wide natively, so
                  h-12 keeps every item on a single row at desktop and
                  keeps the strip's vertical footprint close to its
                  pre-redesign height. */}
              <img
                src={item.image}
                alt={item.title}
                width={160}
                height={133}
                loading="lazy"
                className="h-12 w-auto mb-2 object-contain"
              />
              {/* Title — uppercase + tracking + a real size jump make the
                  bold/regular pair visually distinct even though
                  Chuangwei has no heavier weight than bold. Each line
                  is its own block with whitespace-nowrap so
                  "Up to 25 Years" can't wrap to "Up to 25 / Years"
                  inside the wider row. */}
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