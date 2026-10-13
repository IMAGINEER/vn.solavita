'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CaseStudyCard from './CaseStudyCard'
import {
  caseStudies,
  type CaseStudy,
  type CaseSystemType,
} from '@/lib/data/uk-cases'

gsap.registerPlugin(ScrollTrigger)

type Filter = 'All' | CaseSystemType

const FILTERS: Filter[] = [
  'All',
  'Residential Solar',
  'Solar + Storage',
  'Smart Home / HEMS',
  'Heat Pump + Solar',
]

/**
 * Filterable case study grid. Filter is client-only state - the page
 * itself stays server-renderable for SEO. Filter buttons reuse the
 * `rounded-full` pill style used elsewhere on the site.
 */
export default function CaseStudyGrid() {
  const sectionRef = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<Filter>('All')

  const visible = caseStudies.filter((c) =>
    filter === 'All' ? true : c.systemType === filter,
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.case-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
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
      id="case-grid"
      className="relative py-16 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Solavita in Europe
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Browse{' '}
            <span className="text-gradient">real installations</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-2xl mx-auto">
            Filter by system type to see installations similar to what you
            are considering for your home.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {FILTERS.map((f) => {
            const active = f === filter
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-cw-bold border transition-all ${
                  active
                    ? 'bg-uk-teal text-white border-uk-teal shadow-sm'
                    : 'bg-white text-uk-slate border-uk-line hover:border-uk-teal/50 hover:text-uk-navy'
                }`}
                type="button"
              >
                {f}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {visible.map((c) => (
            <CaseStudyCard key={c.slug} caseStudy={c} />
          ))}
        </div>

        {/* Empty state - only triggers if data filters down to nothing. */}
        {visible.length === 0 && (
          <div className="text-center py-16 text-uk-slate">
            No case studies yet for this system type. Check back soon.
          </div>
        )}
      </div>
    </section>
  )
}
