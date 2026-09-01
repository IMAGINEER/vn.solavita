'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import { supportContactChannels } from '@/lib/data/support'

gsap.registerPlugin(ScrollTrigger)

const iconFor = (label: string) => {
  const common = 'w-6 h-6'
  const props = { className: common, strokeWidth: 1.6 } as const
  switch (label) {
    case 'Email':
      return <Mail {...props} />
    case 'Phone':
      return <Phone {...props} />
    case 'Live chat':
      return <MessageCircle {...props} />
    default:
      return <Mail {...props} />
  }
}

/**
 * Contact Support - three contact channels (email / phone / chat).
 * Sits between FAQ and the page CTA. Reuses the standard card primitive
 * (rounded-2xl · uk-line border · teal hover).
 */
export default function ContactSupport() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
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
      id="contact-support"
      className="relative py-16 md:py-24 bg-white overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-uk-teal/10 blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            UK team ready to help
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Talk to a{' '}
            <span className="text-gradient">real person.</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            UK-based service team · No bots · No long hold music.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportContactChannels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="contact-card rounded-2xl p-6 lg:p-8 bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-5">
                {iconFor(c.label)}
              </div>
              <div className="text-xs font-cw-bold tracking-wider uppercase text-uk-teal-dark">
                {c.label}
              </div>
              <div className="mt-1 text-xl font-cw-bold text-uk-navy break-all">
                {c.value}
              </div>
              {c.description && (
                <p className="mt-3 text-sm text-uk-slate font-cw-regular leading-relaxed">
                  {c.description}
                </p>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
