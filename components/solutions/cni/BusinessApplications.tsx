'use client'

import Link from 'next/link'
import { ArrowRight, Factory, Hotel, Leaf, Store } from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import { openFormModal } from '@/lib/form-modal'
import {
  cniApplications,
  cniPackages,
  type CniApplicationIcon,
} from '@/lib/data/cni'

/**
 * BusinessApplications — the four industry scenarios, each carrying the
 * configuration it is usually built on.
 *
 * The brief's point: an industry tile is only useful if it says what the
 * system does for that industry. So every card states the load pattern,
 * the configuration and the operational outcome, and links into the
 * matching package instead of stopping at a photograph.
 */

const APPLICATION_ICONS: Record<CniApplicationIcon, typeof Factory> = {
  factory: Factory,
  hotel: Hotel,
  store: Store,
  leaf: Leaf,
}

export default function BusinessApplications() {
  return (
    <section
      id="business-applications"
      className="relative py-16 md:py-24 bg-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <SectionEyebrow>BUSINESS APPLICATIONS</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Energy Solutions for <span className="text-gradient">Every Business</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Each industry has its own load shape. Here is what the system
            looks like for the four we see most — and the configuration it
            is normally built on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cniApplications.map((app) => {
            const Icon = APPLICATION_ICONS[app.icon]
            const pkg = cniPackages.find(
              (p) => p.solution.id === app.packageId,
            )
            return (
              <article
                key={app.id}
                className="flex flex-col rounded-2xl border border-uk-line bg-white p-6 md:p-8 hover:border-uk-teal/50 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-uk-teal-dark" strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-cw-bold text-uk-navy leading-tight">
                      {app.title}
                    </h3>
                    <p className="mt-1 text-xs font-cw-bold text-uk-slate uppercase tracking-[0.14em]">
                      {app.loadPattern}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm md:text-base text-uk-slate font-cw-regular leading-relaxed">
                  {app.body}
                </p>

                {pkg && (
                  <dl className="mt-5 divide-y divide-uk-line/60 border-y border-uk-line/60">
                    {[
                      { label: 'PV capacity', value: pkg.pv },
                      { label: 'Battery capacity', value: pkg.battery },
                      { label: 'Inverter capacity', value: pkg.inverter },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-baseline justify-between gap-4 py-2 text-sm"
                      >
                        <dt className="text-uk-slate font-cw-regular">{row.label}</dt>
                        <dd className="font-cw-bold text-uk-navy text-right">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-4 py-2 text-sm">
                      <dt className="text-uk-slate font-cw-regular">Package</dt>
                      <dd className="font-cw-bold text-uk-navy text-right">
                        {pkg.solution.title}
                      </dd>
                    </div>
                  </dl>
                )}

                <p className="mt-5 text-sm text-uk-navy font-cw-regular leading-relaxed">
                  <span className="font-cw-bold text-uk-teal-dark">Outcome: </span>
                  {app.outcome}
                </p>

                <div className="mt-auto pt-6 flex flex-wrap gap-3">
                  {pkg && (
                    <Link
                      href={`#${pkg.anchor}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-cw-bold border border-uk-teal text-uk-teal-dark hover:bg-uk-teal-soft transition-colors"
                    >
                      See the configuration
                      <ArrowRight className="w-4 h-4" strokeWidth={2} />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      openFormModal({
                        solutionType: 'business',
                        interestedProduct: `C&I — ${app.title}`,
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-cw-bold btn-gradient text-white cursor-pointer"
                  >
                    Discuss this scenario
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
