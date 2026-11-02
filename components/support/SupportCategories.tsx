'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Wrench,
  Package,
  Monitor,
  Shield,
  LifeBuoy,
  ArrowRight,
} from 'lucide-react'
import {
  supportCategories,
  type SupportCategory,
} from '@/lib/data/support'

gsap.registerPlugin(ScrollTrigger)

const iconFor = (icon: SupportCategory['icon']) => {
  const common = 'w-6 h-6'
  const props = { className: common, strokeWidth: 1.6 } as const
  switch (icon) {
    case 'wrench':
      return <Wrench {...props} />
    case 'package':
      return <Package {...props} />
    case 'monitor':
      return <Monitor {...props} />
    case 'shield':
      return <Shield {...props} />
    case 'life-buoy':
      return <LifeBuoy {...props} />
  }
}

/**
 * Clickable category cards (Installation / Product / Monitoring /
 * Warranty / Troubleshooting). Each card is an anchor to the
 * matching FAQ section via id, mirroring the SolutionCategories
 * pattern on /solutions.
 */
export default function SupportCategories() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.support-cat-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
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
      id="support-categories"
      className="relative py-16 md:py-24 bg-sv-light"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Pick your topic
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            What Do You Need{' '}
            <span className="text-gradient">Help with?</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-2xl mx-auto">
            Pick a category to jump straight to the most-asked questions
            for that area.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportCategories
            .filter((cat) => cat.card !== false)
            .map((cat) => (
              <a
                key={cat.id}
                href={cat.ctaHref}
                className="support-cat-card group rounded-2xl p-6 bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-4">
                  {iconFor(cat.icon)}
                </div>
                <h3 className="text-lg font-cw-bold text-uk-navy">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                  {cat.description}
                </p>
                <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-cw-bold text-uk-teal-dark group-hover:text-uk-teal transition-colors">
                  {cat.ctaLabel}
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </span>
              </a>
            ))}
        </div>
      </div>
    </section>
  )
}
