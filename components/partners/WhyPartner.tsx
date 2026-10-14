'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Factory,
  Headphones,
  Megaphone,
  ShieldCheck,
  GraduationCap,
  UserCog,
} from 'lucide-react'
import { partnerBenefits } from '@/lib/data/partners'

gsap.registerPlugin(ScrollTrigger)

const iconFor = (i: number) => {
  const common = 'w-6 h-6'
  const props = { className: common, strokeWidth: 1.6 } as const
  switch (i) {
    case 0:
      return <Factory {...props} />
    case 1:
      return <Headphones {...props} />
    case 2:
      return <Megaphone {...props} />
    case 3:
      return <ShieldCheck {...props} />
    case 4:
      return <GraduationCap {...props} />
    case 5:
      return <UserCog {...props} />
    default:
      return <Factory {...props} />
  }
}

/**
 * "Why Partner with Solavita" - six-reason block in a 3-column grid.
 * Mirrors the Why Solavita block on /solutions but B2B-flavoured.
 *
 * Body copy localizes the UK base paragraph: the UK group turnover
 * claim is replaced with the more general "group supply-chain scale"
 * framing until a verified Nigerian group / partner programme figure
 * is approved. Per NG content rules, specific business claims are
 * marked TBD on the partnerBenefits rows themselves.
 */
export default function WhyPartner() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.why-partner-card',
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
      id="why-partner"
      className="relative py-16 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Why partner
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Why partner{' '}
            <span className="text-gradient">with Solavita</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-2xl mx-auto">
            Group supply-chain scale, deep Nigerian engineering
            support and a partner programme built around long-term
            relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerBenefits.map((b, i) => (
            <div
              key={b.title}
              className="why-partner-card rounded-2xl p-6 bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-4">
                {iconFor(i)}
              </div>
              <h3 className="text-lg font-cw-bold text-uk-navy">
                {b.title}
              </h3>
              <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}