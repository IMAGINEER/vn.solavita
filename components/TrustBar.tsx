'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ukTrustItems } from '@/lib/data/uk-trust'

gsap.registerPlugin(ScrollTrigger)

/**
 * Slim horizontal trust / certification strip — direct mirror of the
 * German-site TrustBar markup (dark `bg-sv-dark/50` band with translucent
 * `bg-white/70` glass icon chips).
 *
 * Light-mode overrides in `app/globals.css` (`.light-mode .trust-bar`,
 * `.light-mode [class*="bg-sv-dark/50"]`, `.light-mode [class*="border-white/"]`,
 * `.light-mode [class*="text-white/"]`, `.light-mode [class*="bg-white/"]`)
 * already handle the dark→light inversion, so no project-level
 * token work is required to support both modes.
 *
 * Data source: `ukTrustItems` (UK-flavored, no fabricated certifications).
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
          {ukTrustItems.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center min-w-[80px] text-center flex-shrink-0"
            >
              <div className="w-12 h-12 rounded-xl bg-white/70 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-2 overflow-hidden">
                <img
                  src={item.imagePath}
                  alt={item.label}
                  className="w-9 h-9 object-contain"
                />
              </div>
              <span className="text-[10px] font-cw-bold text-white/70">
                {item.label}
              </span>
              <span className="text-[9px] text-white/40 font-cw-regular">
                {item.sublabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}