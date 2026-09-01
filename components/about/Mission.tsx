'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Compass, Sparkles } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Our Mission - two-card block sitting between Who We Are and Our
 * Approach. The left card carries the mission statement; the right
 * card carries the vision. Same card primitive as the rest of the site.
 */
export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.mission-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="our-mission"
      className="relative py-16 md:py-24 bg-sv-light"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Our UK mission
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Clean energy{' '}
            <span className="text-gradient">for every UK home.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="mission-card rounded-3xl p-8 lg:p-10 bg-white border border-uk-line shadow-sm flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-5">
              <Compass className="w-6 h-6" strokeWidth={1.6} />
            </div>
            <h3 className="text-2xl font-cw-bold text-uk-navy">Mission</h3>
            <p className="mt-4 text-base text-uk-slate font-cw-regular leading-relaxed">
              To make solar, storage and smart home energy as easy to buy
              and live with as any other household appliance - installed
              in two weeks, supported for life.
            </p>
          </div>

          <div className="mission-card rounded-3xl p-8 lg:p-10 bg-white border border-uk-line shadow-sm flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-5">
              <Sparkles className="w-6 h-6" strokeWidth={1.6} />
            </div>
            <h3 className="text-2xl font-cw-bold text-uk-navy">Vision</h3>
            <p className="mt-4 text-base text-uk-slate font-cw-regular leading-relaxed">
              A UK where every home generates, stores and manages its own
              clean energy - and Solavita is the brand that made it
              possible at scale.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
