'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { PlanRoi } from '../_lib/calc'
import { formatNGN, formatKwh } from '../_lib/format'

interface SavingsSectionProps {
  metrics: PlanRoi
  /** Region from the consultation - surfaced in the breakdown so the
   *  customer can see their specific yield was applied, not the UK
   *  fallback (which can overstate by ~6% on average). */
  region?: string
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
export default function SavingsSection({ metrics, region }: SavingsSectionProps) {
  const [detailedOpen, setDetailedOpen] = useState(false)

  const rows: MetricRow[] = [
    {
      label: 'Annual Net Saving',
      value: formatNGN(metrics.annualNetSavingNgn),
      sub: 'Grid + generator fuel saved · ideal mode (no opex)',
      highlight: true,
    },
    {
      label: 'Estimated Payback',
      value:
        metrics.paybackYears === Infinity
          ? '-'
          : `${metrics.paybackYears.toFixed(1)} years`,
      sub: 'Years to break even',
    },
    {
      label: '30-Year Return',
      value: formatNGN(metrics.total30YearReturnNgn),
      sub: 'Net lifetime saving (₦, post-degradation)',
      highlight: metrics.total30YearReturnNgn > 0,
    },
    {
      label: 'Annual Solar Generation',
      value: formatKwh(metrics.annualGenerationKwh),
      sub: 'Estimated per year (year 1)',
    },
    {
      label: 'Generator Fuel Saved',
      value: formatNGN(metrics.annualGeneratorOffsetNgn),
      sub: 'Capped by your reported fuel budget',
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

      {/* Data-source disclosure. The yields, fuel price, and generator
          efficiency in this calculator are PROVISIONAL test values
          pending business verification — do NOT represent verified
          national averages. Kept above the disclosure button so the
          customer sees the source caveat in the natural reading flow. */}
      <p className="mt-3 text-xs text-uk-slate/70 leading-relaxed">
        <strong className="font-cw-bold text-uk-slate">Provisional test values</strong>
        {' — '}
        regional yield, fuel price and generator efficiency are
        estimates pending business confirmation. Generation is
        region-adjusted{region ? ` for ${region}` : ' (Nigeria default)'}.
        ROI is computed against your reported fuel budget where
        available, and capped at conservative segment-level hard
        limits where not.
      </p>

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
              <span>{formatNGN(metrics.total30YearSavingNgn)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-uk-slate/80">
            30-year figures use the panel degradation curve (year 1 = 100%,
            year 10 ≈ 95.7%, year 30 = 85%) at the Nigerian grid tariff
            (₦/kWh, TBD - verified rate). Generator fuel cost uses
            PROVISIONAL constants: ₦1,533/L PMS @ 1.85 kWh/L, ₦1,915/L AGO
            @ 2.95 kWh/L. Real efficiency varies with generator power
            and load. ROI sensitivity to ±20 % efficiency variation
            is roughly proportional — add or subtract the same
            fraction to the generator offset to estimate the range.
          </p>
        </div>
      )}
    </section>
  )
}