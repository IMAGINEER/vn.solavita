'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Wrench, Truck, Handshake, Check, ArrowRight } from 'lucide-react'
import { partnerTypes, type PartnerType } from '@/lib/data/partners'

gsap.registerPlugin(ScrollTrigger)

const CheckIcon = ({ className }: { className?: string }) => (
  <Check className={className ?? 'w-3 h-3'} strokeWidth={3} />
)

const iconFor = (icon: PartnerType['icon']) => {
  const common = 'w-7 h-7'
  const props = { className: common, strokeWidth: 1.6 } as const
  switch (icon) {
    case 'wrench':
      return <Wrench {...props} />
    case 'truck':
      return <Truck {...props} />
    case 'handshake':
      return <Handshake {...props} />
  }
}

/**
 * Three Partner Types — large cards on alternating subtle background
 * blocks so the page reads as a clear B2B offer rather than a generic
 * product grid.
 */
export default function PartnerTypes() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.partner-type-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
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
      id="partner-types"
      className="relative py-16 md:py-24 bg-sv-light overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-uk-teal-soft/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Partner tracks
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Three ways to{' '}
            <span className="text-gradient">work with us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnerTypes.map((p) => (
            <div
              key={p.id}
              className="partner-type-card rounded-3xl p-6 lg:p-8 bg-white border border-uk-line shadow-sm flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-5">
                {iconFor(p.icon)}
              </div>

              <span className="text-[10px] font-cw-bold tracking-wider uppercase text-uk-teal-dark">
                {p.eyebrow}
              </span>
              <h3 className="mt-1 text-2xl font-cw-bold text-uk-navy">
                {p.title}
              </h3>
              <p className="mt-3 text-base text-uk-slate font-cw-regular leading-relaxed">
                {p.description}
              </p>

              <ul className="space-y-3 mt-5">
                {p.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-uk-navy"
                  >
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-uk-emerald/10 flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-3 h-3 text-uk-emerald" />
                    </span>
                    <span className="text-sm font-cw-regular">{b}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#partner-cta"
                className="mt-auto pt-6 inline-flex items-center gap-2 text-uk-teal-dark font-cw-bold hover:text-uk-teal transition-colors"
              >
                Apply for this track
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
