'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Smartphone,
  ShieldCheck,
  LifeBuoy,
  BookOpen,
  Phone,
  ShieldMinus,
  Lock,
  FileText,
} from 'lucide-react'
import { ukSupportItems, type NgSupportItem } from '@/lib/data/uk-support'

gsap.registerPlugin(ScrollTrigger)

/**
 * "We're Here to Support You" section.
 * 8 support entries in a 4 × 2 desktop grid (2 cols on mobile).
 * Each entry: tinted icon container · title · one-line description.
 * Card primitive matches ProductSelector / ArticlesSection / CasesSection.
 */

// Lucide icons - theme-neutral via currentColor. Sized to sit inside the
// `w-10 h-10` icon container.
const iconFor = (icon: NgSupportItem['icon']) => {
  const common = 'w-6 h-6'
  const props = { className: common, strokeWidth: 1.5 } as const
  switch (icon) {
    case 'app':
      return <Smartphone {...props} />
    case 'warranty':
      return <ShieldCheck {...props} />
    case 'service':
      return <LifeBuoy {...props} />
    case 'knowledge':
      return <BookOpen {...props} />
    case 'contact':
      return <Phone {...props} />
    case 'compliance':
      return <ShieldMinus {...props} />
    case 'privacy':
      return <Lock {...props} />
    case 'terms':
      return <FileText {...props} />
  }
}

export default function SupportSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.support-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
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
    <section ref={sectionRef} id="support" className="relative py-16 md:py-24 bg-sv-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-cw-bold text-uk-navy">
            We're Here to Support You
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {ukSupportItems.map((item) => (
            <div
              key={item.title}
              className="support-card rounded-2xl p-6 bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className="w-10 h-10 rounded-lg bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-4">
                {iconFor(item.icon)}
              </div>
              <h3 className="text-base font-cw-bold text-uk-navy">{item.title}</h3>
              <p className="text-sm text-uk-slate mt-1.5 leading-snug">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
