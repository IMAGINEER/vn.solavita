'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Wrench,
  Handshake,
  Users,
  Check,
} from 'lucide-react'
import { partnerTypes, type PartnerType } from '@/lib/data/partners'

gsap.registerPlugin(ScrollTrigger)

const iconFor = (icon: PartnerType['icon']) => {
  const common = 'w-6 h-6'
  const props = { className: common, strokeWidth: 1.6 } as const
  switch (icon) {
    case 'wrench':
      return <Wrench {...props} />
    case 'handshake':
      return <Handshake {...props} />
    case 'users':
      return <Users {...props} />
  }
}

/**
 * "Pick the Partnership That Fits" — layout ported from the
 * For-Partner 页面修改参考页 PPTX. Three partner tracks (Core
 * Service / Certified Installer / Lead Partner), each shown as a
 * tall card with a title, "for whom" subtitle, and two bullet
 * blocks (What You Get / Your Role).
 *
 * The subtitle below the section title pre-empts the common "I don't
 * know which track fits" question and points visitors at WhatsApp /
 * email — matches the PPTX verbatim.
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
            Partnership tracks
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Pick the Partnership{' '}
            <span className="text-gradient">That Fits</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Not sure which fits? Reach out on{' '}
            <a
              href="https://wa.me/8618500875025"
              target="_blank"
              rel="noopener noreferrer"
              className="text-uk-teal-dark font-cw-bold hover:text-uk-teal transition-colors"
            >
              WhatsApp
            </a>{' '}
            or{' '}
            <a
              href="mailto:ng@solavita.com"
              className="text-uk-teal-dark font-cw-bold hover:text-uk-teal transition-colors"
            >
              Email
            </a>{' '}
            and our local team will help you choose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnerTypes.map((p) => (
            <div
              key={p.id}
              className="partner-type-card flex flex-col rounded-3xl p-6 lg:p-8 bg-white border border-uk-line shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-4">
                {iconFor(p.icon)}
              </div>

              <h3 className="text-2xl font-cw-bold text-uk-navy">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                {p.description}
              </p>

              <div className="mt-5 pt-5 border-t border-uk-line/60">
                <h4 className="text-xs font-cw-bold uppercase tracking-wider text-uk-teal-dark mb-3">
                  What You Get
                </h4>
                <ul className="space-y-2.5">
                  {p.whatYouGet.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-uk-navy font-cw-regular"
                    >
                      <Check
                        className="w-4 h-4 text-uk-emerald flex-shrink-0 mt-0.5"
                        strokeWidth={2.5}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-5 border-t border-uk-line/60">
                <h4 className="text-xs font-cw-bold uppercase tracking-wider text-uk-teal-dark mb-3">
                  Your Role
                </h4>
                <ul className="space-y-2.5">
                  {p.yourRole.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-uk-navy font-cw-regular"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full bg-uk-slate/60 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
