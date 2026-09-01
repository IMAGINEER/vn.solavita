'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShieldCheck, Clock, Award, Wrench } from 'lucide-react'
import { whySolavita, type WhySolavitaPoint } from '@/lib/data/solutions'

gsap.registerPlugin(ScrollTrigger)

/* Lucide icons — theme-neutral via currentColor. The wrapping
   `text-uk-teal-dark` token controls the tint. */
const iconFor = (i: number) => {
  const common = 'w-6 h-6'
  const props = { className: common, strokeWidth: 1.6 } as const
  switch (i) {
    case 0:
      return <ShieldCheck {...props} />
    case 1:
      return <Clock {...props} />
    case 2:
      return <Award {...props} />
    case 3:
      return <Wrench {...props} />
    default:
      return <ShieldCheck {...props} />
  }
}

/**
 * "Why Solavita" — four-reason block using the same card primitive as
 * the rest of the site (rounded-2xl · uk-line border · teal hover).
 */
export default function WhySolavita() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.why-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
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
      id="why-solavita"
      className="relative py-16 md:py-24 bg-sv-light"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Why UK homeowners choose us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Built for the UK.{' '}
            <span className="text-gradient">Backed for life.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whySolavita.map((p: WhySolavitaPoint, i) => (
            <div
              key={p.title}
              className="why-card rounded-2xl p-6 bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-4">
                {iconFor(i)}
              </div>
              <h3 className="text-lg font-cw-bold text-uk-navy">{p.title}</h3>
              <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
