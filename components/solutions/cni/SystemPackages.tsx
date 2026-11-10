'use client'

import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import { openFormModal } from '@/lib/form-modal'
import { cniPackages } from '@/lib/data/cni'

/**
 * SystemPackages — the three published business configurations, shown
 * with the numbers a buyer compares: PV capacity, battery capacity,
 * inverter capacity, where the configuration applies and what it buys.
 *
 * The estimated annual generation is the package-level estimate already
 * published with the solution detail pages, and it is labelled as an
 * estimate: actual output depends on location, design, shading, weather
 * and operating conditions.
 */

export default function SystemPackages() {
  return (
    <section
      id="system-packages"
      className="relative py-16 md:py-24 bg-uk-line/30 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <SectionEyebrow>SYSTEM PACKAGES</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Three Configurations, <span className="text-gradient">Sized for Real Loads</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Every configuration is three-phase and sized around equipment
            loads, operating hours and the critical loads that have to stay
            up. The final suitability is confirmed by the load assessment,
            the site survey and the phase review.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {cniPackages.map((pkg) => (
            <article
              key={pkg.solution.id}
              id={pkg.solution.id}
              className="flex flex-col rounded-2xl border border-uk-line bg-white overflow-hidden hover:border-uk-teal/50 hover:shadow-md transition-all duration-300 scroll-mt-24"
            >
              <div className="aspect-[4/3] bg-uk-line/30 overflow-hidden">
                <img
                  src={pkg.solution.imagePath}
                  alt={pkg.solution.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm font-cw-bold">
                  <span className="text-uk-emerald">Three phase</span>
                  <span className="text-uk-slate font-cw-regular"> · </span>
                  <span className="text-uk-slate font-cw-regular italic">
                    {pkg.solution.eyebrow.split(' · ').slice(1).join(' · ')}
                  </span>
                </p>
                <h3 className="mt-1 text-xl font-cw-bold text-uk-navy leading-tight">
                  {pkg.solution.title}
                </h3>
                <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                  {pkg.application}
                </p>

                {/* The four numbers a business buyer compares */}
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
                  <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                    <dt className="text-uk-slate font-cw-regular">
                      Est. annual generation
                    </dt>
                    <dd className="font-cw-bold text-uk-navy text-right">
                      {pkg.solution.kpis[0]?.value} kWh
                    </dd>
                  </div>
                </dl>

                <h4 className="mt-6 text-xs font-cw-bold text-uk-slate uppercase tracking-wider">
                  Key benefits
                </h4>
                <ul className="mt-3 space-y-2">
                  {pkg.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-uk-emerald/15 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-uk-emerald" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-uk-navy font-cw-regular leading-relaxed">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* The full configuration — the per-tier detail pages
                    were removed in the SolaMate / SolaHome restructure,
                    so the package card carries the published spec table
                    and box contents itself. */}
                <details className="mt-6">
                  <summary className="cursor-pointer list-none inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal-dark">
                    <ChevronDown className="w-4 h-4" strokeWidth={2} />
                    Full configuration
                  </summary>
                  <div className="mt-4 rounded-xl border border-uk-line bg-sv-light p-4">
                    <dl className="divide-y divide-uk-line/70">
                      {pkg.solution.specTable.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-baseline justify-between gap-4 py-1.5 text-xs"
                        >
                          <dt className="text-uk-slate font-cw-regular">
                            {row.label}
                          </dt>
                          <dd className="font-cw-bold text-uk-navy text-right">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 text-xs font-cw-bold text-uk-slate uppercase tracking-wider">
                      What is included
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {pkg.solution.boxContents.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs text-uk-navy font-cw-regular leading-relaxed"
                        >
                          <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-uk-teal flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>

                <div className="mt-auto pt-6">
                  <button
                    type="button"
                    onClick={() =>
                      openFormModal({
                        solutionType: 'business',
                        interestedProduct: pkg.solution.title,
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-cw-bold btn-gradient text-white cursor-pointer"
                  >
                    Request this configuration
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-xs text-uk-slate font-cw-regular leading-relaxed max-w-4xl mx-auto text-center">
          Note: the generation figures are package-level estimates for
          Vietnam. Actual output depends on location, system design,
          shading, weather and operating conditions, and is confirmed by
          the site survey.
        </p>
      </div>
    </section>
  )
}
