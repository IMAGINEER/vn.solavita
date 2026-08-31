'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CTAProps {
  /** Eyebrow label above the title. */
  eyebrow: string
  /** Main heading — supports `text-gradient` for the highlighted span. */
  title: React.ReactNode
  /** Body copy below the heading. */
  description: string
  /** Primary button label. */
  primaryLabel?: string
  /** Anchor target for the primary button (defaults to `#design-quote`). */
  primaryHref?: string
  /** Optional secondary link label + href. */
  secondaryLabel?: string
  secondaryHref?: string
}

/**
 * Generic "bottom-of-page" CTA block. The teal soft glow accent + the
 * rounded border reuse the same visual rhythm as
 * FreeDesignQuoteSection, just slimmer.
 */
export default function CTA({
  eyebrow,
  title,
  description,
  primaryLabel = 'Get Free Design & Quote →',
  primaryHref = '#design-quote',
  secondaryLabel,
  secondaryHref,
}: CTAProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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
    <section ref={sectionRef} className="relative py-16 md:py-24 bg-white overflow-hidden">
      {/* Soft accent — matches FreeDesignQuoteSection so all CTAs feel
         like one family. */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full bg-uk-teal/10 blur-[150px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={cardRef} className="cta-card rounded-3xl border border-uk-line bg-white p-8 md:p-12 lg:p-16 text-center shadow-sm">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-4">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            {eyebrow}
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            {title}
          </h2>

          <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a
              href={primaryHref}
              className="btn-gradient px-8 py-4 rounded-full font-cw-bold text-base text-white"
            >
              {primaryLabel}
            </a>

            {secondaryLabel && secondaryHref && (
              <a
                href={secondaryHref}
                className="px-8 py-4 rounded-full border border-uk-line text-uk-navy font-cw-bold text-base hover:border-uk-teal hover:text-uk-teal-dark transition-colors"
              >
                {secondaryLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
