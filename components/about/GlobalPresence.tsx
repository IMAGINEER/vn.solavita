'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin } from 'lucide-react'
import { aboutRegions } from '@/lib/data/about'

gsap.registerPlugin(ScrollTrigger)

const PinIcon = ({ className }: { className?: string }) => (
  <MapPin className={className ?? 'w-4 h-4'} strokeWidth={1.6} />
)

/**
 * Global Presence - a simple list of regions where Solavita / SKYWORTH
 * operates. Intentionally light: a list, not a map widget. Each row
 * uses the standard site card primitives.
 */
export default function GlobalPresence() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.region-row',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="global-presence"
      className="relative py-16 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Heading column */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
              <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
              Global scale, local base
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
              Local on the ground.{' '}
              <span className="text-gradient">Global behind you.</span>
            </h2>
            <p className="mt-5 text-lg text-uk-slate font-cw-regular leading-relaxed max-w-xl">
              Solavita is the local solar brand of the SKYWORTH
              Group. Your system is sized for local site conditions —
              backed by the engineering depth and supply-chain scale of a
              global electronics group.
            </p>

            <div className="mt-8 inline-flex items-center gap-3 px-4 py-3 rounded-xl border border-uk-line bg-white">
              <img
                src="/images/a1logo02.svg"
                alt="Solavita"
                className="h-6 w-auto"
              />
              <span className="text-uk-slate text-xs">×</span>
              <img
                src="/images/LOGOlan.svg"
                alt="SKYWORTH"
                className="h-6 w-auto"
              />
            </div>
          </div>

          {/* Region list */}
          <div className="rounded-2xl border border-uk-line bg-white overflow-hidden divide-y divide-uk-line">
            {aboutRegions.map((r) => (
              <div
                key={`${r.city}-${r.country}`}
                className="region-row flex items-center gap-4 p-5"
              >
                <span className="w-9 h-9 rounded-full bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark flex-shrink-0">
                  <PinIcon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-cw-bold text-uk-navy">
                    {r.city}
                    <span className="ml-2 text-xs font-cw-regular text-uk-slate">
                      {r.country}
                    </span>
                  </div>
                  <div className="text-sm text-uk-slate mt-0.5">{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
