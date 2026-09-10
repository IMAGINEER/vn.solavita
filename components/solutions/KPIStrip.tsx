'use client'

import { Banknote, Clock, ShieldCheck, Timer } from 'lucide-react'
import type { SolutionKpi } from '@/lib/data/solutions'

interface KPIStripProps {
  kpis: SolutionKpi[]
}

/**
 * Pick an icon for a KPI based on its label so the numbers carry the
 * same visual rhythm regardless of which tier is being rendered. Falls
 * through to a clock icon for any label we don't recognise.
 */
const iconFor = (label: string) => {
  const lower = label.toLowerCase()
  if (lower.includes('sav')) return Banknote
  if (lower.includes('pay') || lower.includes('yrs') || lower.includes('year'))
    return Clock
  if (lower.includes('warrant') || lower.includes('programme')) return ShieldCheck
  if (lower.includes('install') || lower.includes('wk')) return Timer
  return Clock
}

/**
 * Horizontal strip of 3-4 large headline numbers + caption labels. Stacks
 * to 2-col on tablet, single col on mobile. Background alternates from
 * the surrounding `bg-sv-light` to `bg-white` so the strip reads as its
 * own band. Numbers are styled in `uk-teal-dark` so they pick up the
 * Solavita brand accent and don't feel like generic dashboard stats.
 */
export default function KPIStrip({ kpis }: KPIStripProps) {
  if (kpis.length === 0) return null

  return (
    <section className="relative py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-sv-light border border-uk-line p-6 lg:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {kpis.map((kpi) => {
              const Icon = iconFor(kpi.label)
              return (
                <div
                  key={kpi.label}
                  className="text-center lg:px-4 lg:border-r lg:border-uk-line/60 lg:last:border-r-0"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-uk-line mb-3">
                    <Icon
                      className="w-5 h-5 text-uk-teal-dark"
                      strokeWidth={1.8}
                    />
                  </div>
                  <div className="text-2xl lg:text-3xl font-cw-bold text-uk-teal-dark tabular-nums leading-none">
                    {kpi.value}
                  </div>
                  <div className="mt-2 text-xs lg:text-sm font-cw-regular text-uk-slate leading-snug">
                    {kpi.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
