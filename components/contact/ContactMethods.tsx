'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Phone, MapPin } from 'lucide-react'
import { contactChannels, type ContactChannel } from '@/lib/data/contact'

gsap.registerPlugin(ScrollTrigger)

const iconFor = (icon: ContactChannel['icon']) => {
  const common = 'w-6 h-6'
  const props = { className: common, strokeWidth: 1.6 } as const
  switch (icon) {
    case 'mail':
      return <Mail {...props} />
    case 'phone':
      return <Phone {...props} />
    case 'map-pin':
      return <MapPin {...props} />
  }
}

/**
 * Three contact-method cards (email / phone / office). Mirrors the
 * SupportCategories card primitive and the contact section on the
 * existing /support page so the visual language stays consistent.
 *
 * `clickable` toggles whether the cards render as `<a>` (default) or
 * as plain `<div>`. Used by /about-us, where the section is purely
 * informational for now — no calls / emails open from the cards.
 */
export default function ContactMethods({ clickable = true }: { clickable?: boolean } = {}) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-method-card',
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
      id="contact-methods"
      className="relative py-16 md:py-24 bg-sv-light dark:bg-sv-darker overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-uk-teal/10 blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Choose your channel
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Other ways to{' '}
            <span className="text-gradient">get in touch</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-2xl mx-auto">
            Prefer phone or email? Here are the direct lines into our UK
            service team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactChannels.map((c) => {
            const cardClass =
              'contact-method-card rounded-2xl p-6 lg:p-8 bg-white border border-uk-line flex flex-col items-start ' +
              (clickable
                ? 'hover:border-uk-teal/50 hover:shadow-md transition-all'
                : '')
            const cardInner = (
              <>
                <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-5">
                  {iconFor(c.icon)}
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
              </>
            )
            return clickable ? (
              <a
                key={c.label}
                href={c.href}
                className={cardClass}
              >
                {cardInner}
              </a>
            ) : (
              <div key={c.label} className={cardClass}>
                {cardInner}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
