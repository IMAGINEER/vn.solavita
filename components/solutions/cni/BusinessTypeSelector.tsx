'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Building2, Check, Factory, Store } from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import { openFormModal } from '@/lib/form-modal'
import {
  cniPackageForScale,
  cniScales,
  type CniScaleId,
} from '@/lib/data/cni'

/**
 * BusinessTypeSelector — the first-level decision on the C&I page.
 *
 * The brief's complaint was that three package cards left a visitor
 * unable to tell which one was theirs. This block answers that first:
 * pick the size of the business, and the matching configuration is
 * shown immediately — with its own PV / battery / inverter capacities
 * and a link into the full configuration.
 *
 * The second level (the package detail itself) lives in the next
 * section, so the two blocks together cover "choose by business type"
 * and "compare by configuration" without duplicating each other.
 */

const SCALE_ICONS: Record<CniScaleId, typeof Building2> = {
  'small-business': Store,
  commercial: Building2,
  industrial: Factory,
}

export default function BusinessTypeSelector() {
  const [active, setActive] = useState<CniScaleId>('small-business')
  const scale = cniScales.find((s) => s.id === active) ?? cniScales[0]
  const pkg = cniPackageForScale(scale.id)
  const Icon = SCALE_ICONS[scale.id]

  return (
    <section
      id="solutions-by-business-type"
      className="relative py-16 md:py-24 bg-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <SectionEyebrow>SOLUTIONS BY BUSINESS TYPE</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Start With Your <span className="text-gradient">Operation</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Tell us the size of the business and the system follows: the
            array size, the storage and the inverter are matched to the
            load profile that comes with it.
          </p>
        </div>

        {/* Level one — the business-size tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {cniScales.map((s) => {
            const TabIcon = SCALE_ICONS[s.id]
            const isActive = s.id === active
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-cw-bold border transition-all duration-300 ${
                  isActive
                    ? 'border-uk-teal bg-uk-teal text-white shadow-md shadow-uk-teal/20'
                    : 'border-uk-line bg-white text-uk-slate hover:border-uk-teal/40 hover:text-uk-teal-dark'
                }`}
              >
                <TabIcon className="w-4 h-4" strokeWidth={1.8} />
                <span>{s.label}</span>
              </button>
            )
          })}
        </div>

        {/* Level two — the configuration that matches the chosen size */}
        <div
          key={scale.id}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
        >
          <div className="rounded-2xl border border-uk-line bg-sv-light p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-uk-teal-soft flex items-center justify-center">
                <Icon className="w-5 h-5 text-uk-teal-dark" strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-xl md:text-2xl font-cw-bold text-uk-navy leading-tight">
                  {scale.label}
                </h3>
                <p className="text-sm text-uk-teal-dark font-cw-bold">
                  {scale.tagline}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm md:text-base text-uk-slate font-cw-regular leading-relaxed">
              {scale.who}
            </p>

            <h4 className="mt-7 text-xs font-cw-bold text-uk-slate uppercase tracking-wider">
              What we check first
            </h4>
            <ul className="mt-3 space-y-2.5">
              {scale.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-uk-emerald/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-uk-emerald" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-uk-navy font-cw-regular leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-uk-line bg-white overflow-hidden shadow-sm">
            <div className="aspect-[16/9] bg-uk-line/30 overflow-hidden">
              <img
                src={pkg.solution.imagePath}
                alt={pkg.solution.imageAlt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:p-8">
              <p className="text-xs font-cw-bold text-uk-teal-dark uppercase tracking-[0.16em]">
                Recommended configuration
              </p>
              <h3 className="mt-2 text-xl md:text-2xl font-cw-bold text-uk-navy leading-tight">
                {pkg.solution.title}
              </h3>
              <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                {pkg.application}
              </p>

              <dl className="mt-5 divide-y divide-uk-line/60 border-y border-uk-line/60">
                {[
                  { label: 'PV capacity', value: pkg.pv },
                  { label: 'Battery capacity', value: pkg.battery },
                  { label: 'Inverter capacity', value: pkg.inverter },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 py-2.5 text-sm"
                  >
                    <dt className="text-uk-slate font-cw-regular">{row.label}</dt>
                    <dd className="font-cw-bold text-uk-navy text-right">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`#${pkg.anchor}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-cw-bold border border-uk-teal text-uk-teal-dark hover:bg-uk-teal-soft transition-colors"
                >
                  View full configuration
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    openFormModal({
                      solutionType: 'business',
                      interestedProduct: `C&I — ${scale.label}: ${pkg.solution.title}`,
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-cw-bold btn-gradient text-white cursor-pointer"
                >
                  Get a free assessment
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
