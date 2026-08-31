'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { PlanRoi } from '../_lib/calc'
import { formatGBP, formatKwh } from '../_lib/format'

interface SavingsSectionProps {
  metrics: PlanRoi
}

interface MetricRow {
  label: string
  value: string
  sub: string
  /** When true, value renders in emerald to highlight a saving. */
  highlight?: boolean
}

/**
 * Six-card savings grid + the "View detailed ROI breakdown" disclosure.
 * Mirrors the ROI Calculator result-card primitive for visual consistency.
 *
 * Layout: 3 cols on lg (2x3), 2 cols on sm, 1 col on mobile.
 */
export default function SavingsSection({ metrics }: SavingsSectionProps) {
  const [detailedOpen, setDetailedOpen] = useState(false)

  const rows: MetricRow[] = [
    {
      label: 'Annual Saving',
      value: formatGBP(metrics.annualSavingGbp),
      sub: 'Estimated per year',
      highlight: true,
    },
    {
      label: 'Estimated Payback',
      value:
        metrics.paybackYears === Infinity
          ? '—'
          : `${metrics.paybackYears.toFixed(1)} years`,
      sub: 'Years to break even',
    },
    {
      label: '30-Year Return',
      value: formatGBP(metrics.total30YearReturnGbp),
      sub: 'Net lifetime saving',
      highlight: metrics.total30YearReturnGbp > 0,
    },
    {
      label: 'Annual Solar Generation',
      value: formatKwh(metrics.annualGenerationKwh),
      sub: 'Estimated per year',
    },
    {
      label: 'Export Income',
      value: formatGBP(metrics.annualExportIncomeGbp),
      sub: 'SEG export tariff',
      highlight: true,
    },
    {
      label: 'ROI',
      value: `${metrics.roiPct}%`,
      sub: '30-year return on investment',
      highlight: metrics.roiPct > 0,
    },
  ]

  return (
    <section className="space-y-3">
      <h2 className="text-xl md:text-2xl font-cw-bold text-uk-navy">
        Your estimated savings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-2xl p-5 bg-white border border-uk-line hover:border-uk-teal/40 hover:shadow-md transition-all"
          >
            <div className="text-xs font-cw-regular text-uk-slate">{row.label}</div>
            <div
              className={
                'mt-2 text-2xl md:text-3xl font-cw-bold tabular-nums ' +
                (row.highlight ? 'text-uk-emerald' : 'text-uk-teal-dark')
              }
            >
              {row.value}
            </div>
            <div className="mt-1 text-xs text-uk-slate">{row.sub}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setDetailedOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-uk-teal hover:text-uk-teal-dark text-sm font-cw-bold transition-colors mt-2"
        aria-expanded={detailedOpen}
      >
        View detailed ROI breakdown
        <ChevronDown
          className={'w-4 h-4 transition-transform duration-200 ' + (detailedOpen ? 'rotate-180' : '')}
          strokeWidth={2}
        />
      </button>

      {detailedOpen && (
        <div className="rounded-xl bg-uk-teal-soft/40 border border-uk-line p-5 text-sm text-uk-slate leading-relaxed">
          <strong className="block text-uk-navy font-cw-bold mb-2">
            ROI breakdown
          </strong>
          <div className="space-y-1 tabular-nums">
            <div className="flex justify-between">
              <span>Annual generation</span>
              <span>{formatKwh(metrics.annualGenerationKwh)}</span>
            </div>
            <div className="flex justify-between">
              <span>Self-consumed</span>
              <span>{formatKwh(metrics.annualSelfConsumedKwh)}</span>
            </div>
            <div className="flex justify-between">
              <span>Exported</span>
              <span>{formatKwh(metrics.annualExportedKwh)}</span>
            </div>
            <div className="flex justify-between border-t border-uk-line pt-2 mt-2 font-cw-bold text-uk-navy">
              <span>30-year cumulative</span>
              <span>{formatGBP(metrics.total30YearSavingGbp)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-uk-slate/80">
            30-year figures use the panel degradation curve (year 1 = 100%,
            year 10 ≈ 95.7%, year 30 = 85%) at £0.2632/kWh imported and
            £0.15/kWh exported. Replace the engine constants in
            <code className="mx-1">_lib/calc.ts</code> with the real ROI
            model before production.
          </p>
        </div>
      )}
    </section>
  )
}