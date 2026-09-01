'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sun, Banknote, Star, Quote } from 'lucide-react'
import { ukCases, ukTestimonial } from '@/lib/data/uk-cases'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Real Homes. Real Results." section.
 * 3 city case cards + 1 customer testimonial card.
 * Uses the same card primitive as ProductSelector and ArticlesSection.
 *
 * Visual hierarchy per card:
 *   image · postcode/region tag · city (h3) · system label ·
 *   data row (generation · saving) - divider top.
 *
 * All existing utility tokens only - no new CSS.
 */

// Lucide icons - theme-neutral via currentColor. StarIcon keeps a filled
// silhouette via fill="currentColor" so it matches the prior inline rendering.
const SunIcon = ({ className }: { className?: string }) => (
  <Sun className={className ?? 'w-4 h-4'} strokeWidth={1.5} />
)

const PoundIcon = ({ className }: { className?: string }) => (
  <Banknote className={className ?? 'w-4 h-4'} strokeWidth={1.6} />
)

const StarIcon = ({ className }: { className?: string }) => (
  <Star className={className ?? 'w-4 h-4'} fill="currentColor" />
)

const QuoteIcon = ({ className }: { className?: string }) => (
  <Quote className={className ?? 'w-8 h-8'} fill="currentColor" />
)

export default function CasesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.case-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
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
    <section ref={sectionRef} id="cases" className="relative py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Selected UK installations
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Real Homes.{' '}
            <span className="text-gradient">Real Results.</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-2xl mx-auto">
            Verified installations from Leeds, Manchester and Bristol - actual
            kWh generated, actual £ saved, and a real customer quote from
            someone living with the system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {ukCases.map((c) => (
            <div
              key={c.city}
              className="case-card rounded-2xl p-6 bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col"
            >
              {/* Image - full-bleed banner at the top of the card, no
                 placeholder frame, no fixed height, no background tint. */}
              <div className="mb-5 -mx-6 -mt-6 overflow-hidden rounded-t-2xl">
                <img
                  src={c.imagePath}
                  alt={c.city}
                  loading="lazy"
                  className="w-full h-48 object-cover block"
                />
              </div>

              {/* City tag (postcode · region) */}
              <span className="text-[10px] font-cw-bold tracking-wider uppercase text-uk-teal-dark">
                {c.postcode} · {c.region}
              </span>

              {/* City - primary identifier */}
              <h3 className="mt-2 text-xl font-cw-bold text-uk-navy leading-tight">
                {c.city}
              </h3>

              {/* System label */}
              <p className="text-sm text-uk-slate mt-1">{c.systemLabel}</p>

              {/* Data row - generation & saving with icons */}
              <div className="mt-auto pt-4 border-t border-uk-line space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-uk-slate">
                    <SunIcon className="w-4 h-4 text-uk-teal-dark" />
                    <span className="text-xs">Annual Generation</span>
                  </div>
                  <span className="font-cw-bold text-uk-navy tabular-nums">
                    {c.annualGeneration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-uk-slate">
                    <PoundIcon className="w-4 h-4 text-uk-emerald" />
                    <span className="text-xs">Annual Saving</span>
                  </div>
                  <span className="font-cw-bold text-uk-emerald tabular-nums">
                    {c.annualSaving}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Testimonial card - same white surface as the other cards; section bg is white, so cards rely on border + hover shadow to differentiate */}
          <div className="case-card rounded-2xl p-6 bg-white border border-uk-line hover:shadow-md transition-all flex flex-col">
            <QuoteIcon className="w-8 h-8 text-uk-teal-dark" />
            <p className="text-uk-navy leading-relaxed mt-3 text-base">
              {ukTestimonial.quote}
            </p>
            <div className="mt-auto pt-4 border-t border-uk-teal/30">
              <div className="text-sm font-cw-bold text-uk-navy">
                {ukTestimonial.author}
              </div>
              <div
                className="flex gap-0.5 text-uk-emerald mt-2"
                aria-label={`${ukTestimonial.rating} stars`}
              >
                {Array.from({ length: ukTestimonial.rating }).map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="#cases"
            className="inline-flex items-center gap-2 text-uk-teal-dark font-cw-bold hover:text-uk-teal transition-colors"
          >
            View More Cases →
          </a>
        </div>
      </div>
    </section>
  )
}
