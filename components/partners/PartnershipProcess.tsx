'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { partnerProcess } from '@/lib/data/partners'

gsap.registerPlugin(ScrollTrigger)

/**
 * "How Partnership Works" — horizontal process timeline on desktop,
 * vertical stack on mobile. Connector line + step number above each
 * card, mirroring the typography hierarchy of the rest of the site.
 */
export default function PartnershipProcess() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.process-step',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
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
      id="partnership-process"
      className="relative py-16 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            How it works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            From first call to{' '}
            <span className="text-gradient">first install</span>
          </h2>
        </div>

        {/* Connector line — visible on md+ only; a simple gradient bar
            behind the step number row. */}
        <div className="relative">
          <div
            className="hidden md:block absolute left-0 right-0 top-[28px] h-px bg-gradient-to-r from-transparent via-uk-line to-transparent"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
            {partnerProcess.map((s) => (
              <div
                key={s.step}
                className="process-step relative flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-0"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white border-2 border-uk-teal/40 flex items-center justify-center text-uk-teal-dark relative z-10">
                  <span className="font-cw-bold text-sm">{s.step}</span>
                </div>

                <div className="md:mt-5 md:px-2">
                  <h3 className="text-lg font-cw-bold text-uk-navy">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
