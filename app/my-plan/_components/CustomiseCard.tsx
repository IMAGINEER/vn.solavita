'use client'

import { useState } from 'react'
import { Check, ChevronDown, Star } from 'lucide-react'
import {
  PLANS,
  type PlanId,
  type RoiAssumptions,
} from '../_lib/calc'
import { formatGBP } from '../_lib/format'

interface CustomiseCardProps {
  selectedPlanId: PlanId
  recommendedPlanId: PlanId
  onSelectPlan: (id: PlanId) => void
  /** Read-only assumptions — surfaced in the disclosure below. */
  assumptions: RoiAssumptions
}

/**
 * 4-plan selector + a read-only "View calculation assumptions" disclosure.
 *
 * Plan selection is the **only** way to change the system's configuration
 * — Solar panels, Battery and Inverter are not independently adjustable.
 * Switching plans swaps the whole bundle (PV size + battery + inverter +
 * ROI defaults) at once.
 *
 * The "View calculation assumptions" disclosure explains the ROI inputs
 * (import price, export price, self-consumption) for transparency but is
 * deliberately read-only — there is no UI to mutate them. The values
 * follow the active plan's defaults.
 */
export default function CustomiseCard({
  selectedPlanId,
  recommendedPlanId,
  onSelectPlan,
  assumptions,
}: CustomiseCardProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)

  return (
    <section className="rounded-2xl p-6 bg-white border border-uk-line">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl md:text-2xl font-cw-bold text-uk-navy">
            Choose your plan
          </h2>
          <p className="text-sm text-uk-slate mt-1">
            Pick one of four ready-made plans. Each plan pairs a fixed solar
            array, battery and inverter — they are bundled together, so the
            whole configuration switches as one. ROI updates instantly.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANS.map((plan) => {
          const isSelected = plan.id === selectedPlanId
          const isRecommended = plan.id === recommendedPlanId
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan.id)}
              className={
                'relative text-left rounded-2xl p-5 border-2 transition-all duration-200 ' +
                (isSelected
                  ? 'border-uk-teal bg-uk-teal-soft/50 shadow-md scale-[1.01]'
                  : 'border-uk-line bg-white hover:border-uk-teal/60 hover:-translate-y-0.5 hover:shadow-md')
              }
            >
              {isRecommended && (
                <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 bg-uk-emerald text-white text-[10px] font-cw-bold tracking-wider rounded-full px-2 py-0.5 whitespace-nowrap">
                  <Star className="w-2.5 h-2.5" strokeWidth={3} />
                  Recommended for your home
                </span>
              )}

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-cw-bold text-uk-navy">
                    {plan.name}
                  </div>
                  <div className="text-xs text-uk-slate mt-0.5">
                    {plan.subtitle}
                  </div>
                </div>
                {isSelected && (
                  <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-uk-teal text-white">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-1 text-sm text-uk-slate tabular-nums">
                <div className="flex justify-between">
                  <span>Solar panels</span>
                  <span className="font-cw-bold text-uk-navy">
                    {plan.panels} modules
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Battery</span>
                  <span className="font-cw-bold text-uk-navy">
                    {plan.batteryKwh > 0 ? `${plan.batteryKwh} kWh` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Inverter</span>
                  <span className="font-cw-bold text-uk-navy">
                    {plan.inverterKw} kW
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-uk-line flex items-baseline justify-between">
                <span className="text-xs text-uk-slate">Plan price</span>
                <span className="text-lg font-cw-bold text-uk-teal-dark tabular-nums">
                  {formatGBP(plan.priceGbp)}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Read-only disclosure of the ROI calculation parameters. No
          sliders / reset button — the user can switch plans to swap the
          whole configuration, but cannot tweak individual ROI inputs. */}
      <button
        type="button"
        onClick={() => setAdvancedOpen((v) => !v)}
        className="mt-6 inline-flex items-center gap-1 text-uk-teal hover:text-uk-teal-dark text-sm font-cw-bold transition-colors"
        aria-expanded={advancedOpen}
      >
        View calculation assumptions
        <ChevronDown
          className={
            'w-4 h-4 transition-transform duration-200 ' +
            (advancedOpen ? 'rotate-180' : '')
          }
          strokeWidth={2}
        />
      </button>

      {advancedOpen && (
        <div className="mt-3 rounded-xl bg-uk-teal-soft/40 border border-uk-line p-5">
          <p className="text-xs text-uk-slate leading-relaxed mb-4">
            These figures feed the savings and payback shown above. They are
            tuned to your active plan and current UK averages — you cannot
            change system capacity here, only switch to a different plan.
          </p>

          <dl className="space-y-4 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <dt className="font-cw-bold text-uk-navy">Import price</dt>
                <dd className="text-xs text-uk-slate mt-0.5">
                  What you pay your supplier per kWh of grid electricity
                </dd>
              </div>
              <span className="shrink-0 font-cw-bold text-uk-teal-dark tabular-nums">
                £{assumptions.importPriceGbp.toFixed(4)} /kWh
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-3">
              <div>
                <dt className="font-cw-bold text-uk-navy">
                  Export price (SEG)
                </dt>
                <dd className="text-xs text-uk-slate mt-0.5">
                  What you earn per kWh exported under the Smart Export
                  Guarantee
                </dd>
              </div>
              <span className="shrink-0 font-cw-bold text-uk-teal-dark tabular-nums">
                £{assumptions.exportPriceGbp.toFixed(4)} /kWh
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-3">
              <div>
                <dt className="font-cw-bold text-uk-navy">
                  Self-consumption rate
                </dt>
                <dd className="text-xs text-uk-slate mt-0.5">
                  Share of generation used on-site. With a battery this can
                  reach 100%; without one, it depends on when the sun shines
                  vs. when you are home
                </dd>
              </div>
              <span className="shrink-0 font-cw-bold text-uk-teal-dark tabular-nums">
                {Math.round(assumptions.selfConsumptionRate * 100)}%
              </span>
            </div>
          </dl>
        </div>
      )}
    </section>
  )
}
