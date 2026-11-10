'use client'

import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import TbdText from '@/components/ui/tbd-text'
import { cniProjects } from '@/lib/data/cni'

/**
 * RealProjects — the delivered commercial references.
 *
 * Every card is a project from the published Skyworth PV case deck, so
 * the capacities and the photographs are the record of what was built,
 * not a marketing image. The two numbers the deck does not carry —
 * annual generation and the verified saving — stay visible as TBD
 * placeholders until the operating data is confirmed.
 */

export default function RealProjects() {
  return (
    <section
      id="real-projects"
      className="relative py-16 md:py-24 bg-uk-line/30 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <SectionEyebrow>REAL PROJECTS</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Powering Businesses with{' '}
            <span className="text-gradient">Real Results</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Commercial and industrial systems delivered by Solavita and
            SKYWORTH — from a campus array to a multi-megawatt storage
            project.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cniProjects.map((project) => (
            <article
              key={project.slug}
              className="flex flex-col rounded-2xl border border-uk-line bg-white overflow-hidden hover:border-uk-teal/50 hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-uk-line/30 overflow-hidden">
                <img
                  src={project.imagePath}
                  alt={project.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="inline-flex w-fit items-center rounded-full bg-uk-teal-soft px-3 py-1 text-[11px] font-cw-bold text-uk-teal-dark">
                  {project.sector}
                </span>
                <h3 className="mt-3 text-lg font-cw-bold text-uk-navy leading-tight">
                  {project.site}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-uk-slate font-cw-regular">
                  <MapPin className="w-3.5 h-3.5 text-uk-teal" strokeWidth={2} />
                  {project.country}
                </p>
                <p className="mt-3 text-sm text-uk-slate font-cw-regular leading-relaxed">
                  {project.summary}
                </p>

                <dl className="mt-4 divide-y divide-uk-line/60 border-t border-uk-line/60">
                  <div className="flex items-baseline justify-between gap-3 py-2 text-sm">
                    <dt className="text-uk-slate font-cw-regular">PV</dt>
                    <dd className="font-cw-bold text-uk-navy text-right">
                      {project.pv}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 py-2 text-sm">
                    <dt className="text-uk-slate font-cw-regular">Storage</dt>
                    <dd className="font-cw-bold text-uk-navy text-right">
                      {project.storage}
                    </dd>
                  </div>
                  {project.completed && (
                    <div className="flex items-baseline justify-between gap-3 py-2 text-sm">
                      <dt className="text-uk-slate font-cw-regular">
                        Completed
                      </dt>
                      <dd className="font-cw-bold text-uk-navy text-right">
                        {project.completed}
                      </dd>
                    </div>
                  )}
                </dl>

                <p className="mt-3 text-[11px] leading-relaxed">
                  <TbdText
                    text="Annual generation and verified saving — pending operating data (chờ xác nhận)"
                    inline
                  />
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/cases"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-cw-bold border border-uk-teal text-uk-teal-dark hover:bg-uk-teal-soft transition-colors"
          >
            See the full project library
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  )
}
