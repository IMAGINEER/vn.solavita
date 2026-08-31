'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, Quote } from 'lucide-react'
import {
  getFeaturedCase,
  featuredTestimonial,
  type FeaturedTestimonial,
} from '@/lib/data/cases'

gsap.registerPlugin(ScrollTrigger)

const QuoteIcon = ({ className }: { className?: string }) => (
  <Quote className={className ?? 'w-8 h-8'} fill="currentColor" />
)

const StarIcon = ({ className }: { className?: string }) => (
  <Star className={className ?? 'w-4 h-4'} fill="currentColor" />
)

/**
 * Featured Case panel — sits between the case grid and the page CTA.
 * Two-column layout: hero image left, copy + testimonial card right.
 * Uses the same accent gradient + teal/emerald soft surfaces as
 * FreeDesignQuoteSection so the rhythm stays consistent.
 */
export default function FeaturedCase() {
  const sectionRef = useRef<HTMLElement>(null)
  const featured = getFeaturedCase()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.featured-image',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
      gsap.fromTo(
        '.featured-copy',
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id={featured.slug}
      className="relative py-16 md:py-24 bg-sv-light overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-uk-teal-soft/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Featured case
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Spotlight:{' '}
            <span className="text-gradient">
              {featured.city}, {featured.region}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-stretch">
          {/* Image */}
          <div className="featured-image lg:col-span-3">
            <div className="relative h-full rounded-3xl overflow-hidden border border-uk-line bg-uk-teal-soft min-h-[320px] shadow-sm">
              <img
                src={featured.imagePath}
                alt={`${featured.city} Solavita installation`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay tag */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-cw-bold text-uk-navy">
                <span className="w-1.5 h-1.5 rounded-full bg-uk-emerald" />
                {featured.systemType}
              </div>
            </div>
          </div>

          {/* Copy + testimonial */}
          <div className="featured-copy lg:col-span-2 flex flex-col gap-6">
            <div>
              <span className="text-[10px] font-cw-bold tracking-wider uppercase text-uk-teal-dark">
                {featured.postcode} · {featured.region}
              </span>
              <h3 className="mt-2 text-2xl md:text-3xl font-cw-bold text-uk-navy leading-tight">
                {featured.city} · {featured.systemLabel}
              </h3>
              <p className="mt-4 text-base text-uk-slate font-cw-regular leading-relaxed">
                {featured.description}
              </p>

              {/* Metric strip */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {featured.annualGeneration && (
                  <div className="rounded-xl border border-uk-line bg-white p-4">
                    <div className="text-xs text-uk-slate">Annual generation</div>
                    <div className="mt-1 text-xl font-cw-bold text-uk-navy tabular-nums">
                      {featured.annualGeneration}
                    </div>
                  </div>
                )}
                {featured.annualSaving && (
                  <div className="rounded-xl border border-uk-line bg-white p-4">
                    <div className="text-xs text-uk-slate">Annual saving</div>
                    <div className="mt-1 text-xl font-cw-bold text-uk-emerald tabular-nums">
                      {featured.annualSaving}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Testimonial card */}
            <div className="rounded-2xl p-6 bg-white border border-uk-line flex flex-col">
              <QuoteIcon className="w-8 h-8 text-uk-teal-dark" />
              <p className="mt-3 text-uk-navy leading-relaxed text-base">
                {featuredTestimonial.quote}
              </p>
              <div className="mt-auto pt-4 border-t border-uk-line flex items-center justify-between">
                <div>
                  <div className="text-sm font-cw-bold text-uk-navy">
                    {featuredTestimonial.author}
                  </div>
                  <div className="text-xs text-uk-slate mt-0.5">
                    {featuredTestimonial.role}
                  </div>
                </div>
                <div
                  className="flex gap-0.5 text-uk-emerald"
                  aria-label={`${featuredTestimonial.rating} stars`}
                >
                  {Array.from({ length: featuredTestimonial.rating }).map(
                    (_, i) => (
                      <StarIcon key={i} className="w-4 h-4" />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
