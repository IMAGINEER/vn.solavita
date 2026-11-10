'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Download, FileText } from 'lucide-react'
import { cniProductTabs } from '@/lib/data/cni'

/**
 * ProductTabs — the product deep-dive that sits under the architecture
 * diagram.
 *
 * Each tab carries what the brief asks for: the product photo, its core
 * parameters, the commercial advantages, and the datasheet download —
 * every datasheet is the real PDF from `public/downloads/products/`, so
 * the numbers on this page and the numbers in the file cannot drift.
 */

export default function ProductTabs() {
  const [activeId, setActiveId] = useState(cniProductTabs[0].id)
  const active =
    cniProductTabs.find((t) => t.id === activeId) ?? cniProductTabs[0]

  return (
    <div className="mt-14 md:mt-16">
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-cw-bold text-uk-navy leading-tight">
          Product <span className="text-gradient">Details</span>
        </h3>
        <p className="mt-3 text-base text-uk-slate font-cw-regular leading-relaxed">
          Four product families, one system. Open a tab for the core
          parameters, the advantages and the datasheet.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {cniProductTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveId(tab.id)}
            aria-pressed={tab.id === activeId}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-cw-bold border transition-all duration-300 ${
              tab.id === activeId
                ? 'border-uk-teal bg-uk-teal text-white shadow-md shadow-uk-teal/20'
                : 'border-uk-line bg-white text-uk-slate hover:border-uk-teal/40 hover:text-uk-teal-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        key={active.id}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
      >
        {/* Product photo */}
        <div className="rounded-2xl border border-uk-line bg-white p-4 md:p-6">
          <div className="relative aspect-[4/3] rounded-xl bg-sv-light overflow-hidden">
            <img
              src={active.imagePath}
              alt={active.imageAlt}
              loading="lazy"
              /* `object-contain` — the inverter, battery and ESS shots are
                 alpha-cutout product renders, so `cover` would crop
                 them. */
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <a
              href={active.datasheet.href}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-cw-bold border border-uk-line text-uk-navy hover:border-uk-teal/50 transition-colors"
            >
              <Download className="w-4 h-4" strokeWidth={2} />
              {active.datasheet.label}
            </a>
            <Link
              href={active.href}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-cw-bold btn-gradient text-white"
            >
              <FileText className="w-4 h-4" strokeWidth={2} />
              Product page
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Parameters + advantages */}
        <div>
          <h4 className="text-xl md:text-2xl font-cw-bold text-uk-navy leading-tight">
            {active.title}
          </h4>
          <p className="mt-1 text-sm md:text-base text-uk-teal-dark font-cw-bold">
            {active.subtitle}
          </p>

          <h5 className="mt-6 text-xs font-cw-bold text-uk-slate uppercase tracking-wider">
            Core parameters
          </h5>
          <div className="mt-3 rounded-xl overflow-hidden border border-uk-line bg-white">
            {active.specs.map((spec, idx) => (
              <div
                key={spec.label}
                className={`flex justify-between items-center gap-4 px-4 py-3 ${
                  idx % 2 === 0 ? 'bg-uk-line/20' : 'bg-white'
                }`}
              >
                <span className="text-sm text-uk-slate font-cw-regular">
                  {spec.label}
                </span>
                <span className="text-sm text-uk-navy font-cw-bold text-right">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          <h5 className="mt-6 text-xs font-cw-bold text-uk-slate uppercase tracking-wider">
            Why it matters on site
          </h5>
          <ul className="mt-3 space-y-2.5">
            {active.advantages.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-uk-emerald/15 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-uk-emerald" strokeWidth={3} />
                </span>
                <span className="text-sm text-uk-navy font-cw-regular leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
