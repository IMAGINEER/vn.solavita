'use client'

import { ShieldCheck } from 'lucide-react'
import ContactSuccessCard from './ContactSuccessCard'
import type { Plan, PlanRoi } from '../_lib/calc'
import { formatNGN, formatKw } from '../_lib/format'

interface PlanSummaryAsideProps {
  plan: Plan
  metrics: PlanRoi
  systemKw: number
  onContactExpert: () => void
  /** When true, the summary / CTA swap for an inline success card. */
  submitted?: boolean
  /** Optional "← Back to plan" reset action shown on the success card. */
  onBackToPlan?: () => void
}

/**
 * Sticky right-rail summary. Shows the active plan's name, fixed
 * configuration, headline ROI numbers, and the Talk-to-an-expert CTA.
 *
 * After `submitted` flips true, the entire body becomes the success
 * card - the customer keeps the same visual anchor on the right rail
 * but the numbers are hidden behind a confirmation so the next step is
 * unambiguous.
 */
export default function PlanSummaryAside({
  plan,
  metrics,
  systemKw,
  onContactExpert,
  submitted,
  onBackToPlan,
}: PlanSummaryAsideProps) {
  return (
    <aside className="rounded-2xl p-6 bg-white border border-uk-line shadow-sm flex flex-col gap-4">
      {submitted ? (
        <ContactSuccessCard onBackToPlan={onBackToPlan} />
      ) : (
        <>
          <div>
            <h3 className="text-lg font-cw-bold text-uk-navy">Your plan summary</h3>
            <p className="mt-1 text-xs text-uk-slate">{plan.subtitle}</p>
          </div>

          <div className="rounded-xl bg-uk-teal-soft/40 border border-uk-line px-3 py-2">
            <div className="text-base font-cw-bold text-uk-teal-dark">
              {plan.name}
            </div>
          </div>

          {/* Configuration rows */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-uk-slate">System size</span>
              <b className="font-cw-bold text-uk-navy tabular-nums">
                {formatKw(systemKw)}
              </b>
            </div>
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-uk-slate">Battery capacity</span>
              <b className="font-cw-bold text-uk-navy tabular-nums">
                {plan.batteryKwh > 0 ? `${plan.batteryKwh} kWh` : '-'}
              </b>
            </div>
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-uk-slate">Inverter</span>
              <b className="font-cw-bold text-uk-navy tabular-nums">
                {plan.inverterKw} kW
              </b>
            </div>
          </div>

          <div className="border-t border-uk-line" />

          {/* Investment */}
          <div>
            <div className="text-xs text-uk-slate">Estimated investment</div>
            <div className="mt-1 text-2xl font-cw-bold text-uk-navy tabular-nums">
              {formatNGN(plan.priceNgn)}
            </div>
            <p className="mt-1 text-[10px] text-uk-slate font-cw-regular">
              Test-baseline price · Pending verified Nigerian pricing
            </p>
          </div>

          <div className="border-t border-uk-line" />

          {/* Annual saving */}
          <div>
            <div className="text-xs text-uk-slate">Estimated annual saving</div>
            <div className="mt-1 text-2xl font-cw-bold text-uk-emerald tabular-nums">
              {formatNGN(metrics.annualNetSavingNgn)}
              <span className="ml-1 text-sm font-cw-regular text-uk-slate">/ year</span>
            </div>
            <p className="mt-1 text-[10px] text-uk-slate font-cw-regular">
              Grid offset + generator fuel saved · ideal mode (no opex)
            </p>
          </div>

          <div className="border-t border-uk-line" />

          {/* Payback */}
          <div>
            <div className="text-xs text-uk-slate">Estimated payback</div>
            <div className="mt-1 text-2xl font-cw-bold text-uk-navy tabular-nums">
              {metrics.paybackYears === Infinity
                ? '-'
                : `${metrics.paybackYears.toFixed(1)} years`}
            </div>
            <p className="mt-1 text-[10px] text-uk-slate font-cw-regular">
              Provisional test values — pending business verification
            </p>
          </div>

          {/* CTAs */}
          <button
            type="button"
            onClick={onContactExpert}
            className="btn-gradient text-white px-6 py-3 rounded-full font-cw-bold text-sm mt-2"
          >
            Talk to an expert
          </button>
          <p className="text-xs text-uk-slate text-center -mt-2">
            Our team will be in touch to discuss your plan.
          </p>

          <div className="pt-4 border-t border-uk-line flex items-start gap-2 text-xs text-uk-slate leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-uk-teal shrink-0 mt-0.5" strokeWidth={1.75} />
            <span>
              Your plan is saved and secure.
              <br />
              You can come back at any time.
            </span>
          </div>
        </>
      )}
    </aside>
  )
}