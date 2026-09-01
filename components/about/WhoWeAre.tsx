'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { aboutStats } from '@/lib/data/about'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Who We Are" - the brand origin story and headline stats. Mirrors
 * the visual treatment of BrandStory on the homepage but with the
 * dedicated about-us copy.
 */
export default function WhoWeAre() {
  const sectionRef = useRef<HTMLElement>(null)
  const countersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counters = countersRef.current?.querySelectorAll('.stat-value')
      if (counters) {
        gsap.fromTo(
          counters,
          { scale: 0.7, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: countersRef.current,
              start: 'top 80%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="who-we-are"
      className="relative py-16 md:py-24 bg-white overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-uk-teal-soft/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-uk-emerald/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="text-uk-teal-dark text-sm font-cw-bold uppercase tracking-wider">
            Who we are
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            <span className="text-uk-teal">Global heritage.</span> Built
            for the UK.
          </h2>
          <p className="mt-5 text-lg text-uk-slate font-cw-regular leading-relaxed">
            Solavita is the UK residential solar brand of the SKYWORTH
            Group - one of the world&rsquo;s largest electronics
            manufacturers. Premium engineering from a £10bn group,
            designed specifically for British homes, weather and
            regulations.
          </p>
        </div>

        <div
          ref={countersRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {aboutStats.map((s) => (
            <div
              key={s.label}
              className="text-center p-6 rounded-2xl border border-uk-line bg-white shadow-sm"
            >
              <div className="stat-value">
                <span className="text-3xl sm:text-4xl font-cw-bold text-uk-teal counter-number">
                  {s.value}
                </span>
                <span className="text-lg font-cw-bold text-uk-slate ml-1">
                  {s.unit}
                </span>
              </div>
              <p className="text-sm text-uk-slate font-cw-regular mt-2">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
