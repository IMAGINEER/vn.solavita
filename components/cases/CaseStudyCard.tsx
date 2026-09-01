'use client'

import { Sun, Banknote, ArrowRight } from 'lucide-react'
import { type CaseStudy } from '@/lib/data/cases'

/* Lucide icons - theme-neutral via currentColor. */
const SunIcon = ({ className }: { className?: string }) => (
  <Sun className={className ?? 'w-4 h-4'} strokeWidth={1.5} />
)
const PoundIcon = ({ className }: { className?: string }) => (
  <Banknote className={className ?? 'w-4 h-4'} strokeWidth={1.6} />
)

interface CaseStudyCardProps {
  caseStudy: CaseStudy
  /** When true the card acts as a link (default). Set false if you want
   *  a static card inside a non-link container. */
  linked?: boolean
}

/**
 * Reusable case study card - reused by the /cases grid and any future
 * place a single case needs to appear (homepage cards, search results,
 * related-cases modules). Mirrors the homepage CasesSection card so the
 * visual language stays consistent.
 */
export default function CaseStudyCard({
  caseStudy,
  linked = true,
}: CaseStudyCardProps) {
  const inner = (
    <>
      {/* Image - full-bleed at the top, no fixed height. */}
      <div className="mb-5 -mx-6 -mt-6 overflow-hidden rounded-t-2xl">
        <img
          src={caseStudy.imagePath}
          alt={caseStudy.city}
          loading="lazy"
          className="w-full h-48 object-cover block transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* System tag */}
      <span className="text-[10px] font-cw-bold tracking-wider uppercase text-uk-teal-dark">
        {caseStudy.postcode} · {caseStudy.region}
      </span>

      {/* City - primary identifier */}
      <h3 className="mt-2 text-xl font-cw-bold text-uk-navy leading-tight">
        {caseStudy.city}
      </h3>

      {/* System label */}
      <p className="text-sm text-uk-slate mt-1">{caseStudy.systemLabel}</p>

      {/* Description / short result */}
      <p className="mt-3 text-sm text-uk-slate leading-relaxed line-clamp-3">
        {caseStudy.description}
      </p>

      {/* Data row - generation & saving */}
      {(caseStudy.annualGeneration || caseStudy.annualSaving) && (
        <div className="mt-auto pt-4 border-t border-uk-line space-y-3">
          {caseStudy.annualGeneration && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-uk-slate">
                <SunIcon className="w-4 h-4 text-uk-teal-dark" />
                <span className="text-xs">Annual Generation</span>
              </div>
              <span className="font-cw-bold text-uk-navy tabular-nums">
                {caseStudy.annualGeneration}
              </span>
            </div>
          )}
          {caseStudy.annualSaving && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-uk-slate">
                <PoundIcon className="w-4 h-4 text-uk-emerald" />
                <span className="text-xs">Annual Saving</span>
              </div>
              <span className="font-cw-bold text-uk-emerald tabular-nums">
                {caseStudy.annualSaving}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer link */}
      {linked && (
        <div className="mt-4 pt-3 border-t border-uk-line flex items-center justify-between">
          <span className="text-xs text-uk-slate">
            {caseStudy.systemType}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-cw-bold text-uk-teal-dark group-hover:text-uk-teal transition-colors">
            Read case
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </span>
        </div>
      )}
    </>
  )

  const cardClass =
    'group case-card rounded-2xl p-6 bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col'

  if (!linked) {
    return <div className={cardClass}>{inner}</div>
  }

  return (
    <a href={`#${caseStudy.slug}`} className={cardClass}>
      {inner}
    </a>
  )
}
