'use client'

import { useState } from 'react'
import { Check, ChevronDown, Star } from 'lucide-react'
import {
  PLANS,
  ROI_IMPORT_PRICE_MIN,
  ROI_IMPORT_PRICE_MAX,
  ROI_IMPORT_PRICE_STEP,
  ROI_EXPORT_PRICE_MIN,
  ROI_EXPORT_PRICE_MAX,
  ROI_EXPORT_PRICE_STEP,
  ROI_SELF_CONSUMPTION_MIN,
  ROI_SELF_CONSUMPTION_MAX,
  ROI_SELF_CONSUMPTION_STEP,
  type PlanId,
  type PlanRoi,
  type RoiAssumptions,
} from '../_lib/calc'
import { formatNGN } from '../_lib/format'

interface CustomiseCardProps {
  selectedPlanId: PlanId
  recommendedPlanId: PlanId
  onSelectPlan: (id: PlanId) => void
  /**
   * Effective assumptions for the active plan + any user overrides on
   * top. All three ROI inputs are user-controlled; the plan only seeds
   * the initial self-consumption value (battery=100%, no battery=35%).
   */
  assumptions: RoiAssumptions
  /** Slider handlers - fire on every input event. */
  onImportPriceChange: (value: number) => void
  onExportPriceChange: (value: number) => void
  onSelfConsumptionRateChange: (value: number) => void
  /**
   * Live ROI metrics. Used to source the current annual fuel cost cap
   * (`metrics.appliedAnnualFuelCostNgn`) for the fuel-budget slider
   * so the slider's default value tracks the calculator's
   * path-A / path-B choice automatically.
   */
  metrics: PlanRoi
  /**
   * When defined, replaces the band / back-derive fuel-cost cap. The
   * slider surfaces this; passing `undefined` clears the override and
   * the calculator falls back to the user's reported band or the
   * segment-aware hard cap.
   */
  onFuelBudgetOverrideChange: (value: number | undefined) => void
}

/**
 * 4-plan selector + an interactive "View calculation assumptions"
 * disclosure.
 *
 * Plan selection is the **only** way to change the system's hardware
 * configuration - Solar panels, Battery and Inverter are not
 * independently adjustable. Switching plans swaps the whole bundle
 * (PV size + battery + inverter) at once. The plan's automatic
 * self-consumption default (battery=100%, no battery=35%) is the seed
 * for that slider, but the user's choice persists once they drag it.
 *
 * The "View calculation assumptions" disclosure exposes the three ROI
 * inputs as sliders - import price, export price, self-consumption.
 * All three feed back into the ROI pipeline above so the savings /
 * payback / 30-year numbers reflow in real time.
 */
export default function CustomiseCard({
  selectedPlanId,
  recommendedPlanId,
  onSelectPlan,
  assumptions,
  onImportPriceChange,
  onExportPriceChange,
  onSelfConsumptionRateChange,
  metrics,
  onFuelBudgetOverrideChange,
}: CustomiseCardProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)

  // Snap slider values to the configured step - parseFloat can return
  // tiny float artefacts on some browsers even when step=0.001.
  const snap = (step: number) => (raw: number) =>
    Math.round(raw / step) * step

  return (
    <section className="rounded-2xl p-6 bg-white border border-uk-line">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl md:text-2xl font-cw-bold text-uk-navy">
            Choose your plan
          </h2>
          <p className="text-sm text-uk-slate mt-1">
            Pick one of six ready-made plans. Each plan pairs a fixed solar
            array, battery and inverter - they are bundled together, so the
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
                  <span>Solar</span>
                  <span className="font-cw-bold text-uk-navy">
                    {plan.kwpLabel ?? `${plan.panels} kWp`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Battery</span>
                  <span className="font-cw-bold text-uk-navy">
                    {plan.batteryKwh > 0 ? `${plan.batteryKwh} kWh` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Inverter</span>
                  <span className="font-cw-bold text-uk-navy">
                    {plan.inverterLabel ?? `${plan.inverterKw} kW`}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-uk-line flex items-baseline justify-between">
                <span className="text-xs text-uk-slate">Plan price</span>
                <span className="text-lg font-cw-bold text-uk-teal-dark tabular-nums">
                  {formatNGN(plan.priceNgn)}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Interactive disclosure of the ROI calculation parameters.
          Import / export prices have sliders and feed back into the ROI
          pipeline above. Self-consumption is hardware-bound and stays
          read-only. */}
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
        <div className="mt-3 rounded-xl bg-uk-teal-soft/40 border border-uk-line p-5 space-y-5">
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <strong className="font-cw-bold">Provisional test values</strong> — the
            grid tariff, fuel price and generator efficiency baked into
            the calculator are estimates, not verified national averages.
            Adjust the sliders below to model your actual situation.
          </div>
          <p className="text-xs text-uk-slate leading-relaxed">
            These figures feed the savings and payback shown above. Drag
            the sliders to match your actual tariff and usage pattern -
            the savings / payback / 30-year numbers above reflow in real
            time.
          </p>

          {/* Fuel budget slider — for "Not sure" users (and for fine-tuning
             band picks). Range 0 – 2× segment hard cap so the user can't
             push the calculator into absurd territory. Default value is
             whatever the calculator currently uses
             (`metrics.appliedAnnualFuelCostNgn`), so the slider tracks
             path-A / path-B automatically until the user moves it. */}
          {(() => {
            const segment = PLANS.find((p) => p.id === selectedPlanId)?.segment ?? 'homes'
            const hardCap = segment === 'homes' ? 600_000 : 3_600_000
            const sliderMax = hardCap * 2
            const fuelStep = Math.max(10_000, Math.round(sliderMax / 200 / 10_000) * 10_000)
            const currentCap = metrics.appliedAnnualFuelCostNgn
            const isOverridden = metrics.fuelCostOverridden
            const sliderValue = isOverridden ? currentCap : currentCap
            return (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <label
                    htmlFor="assumption-fuel-budget"
                    className="font-cw-bold text-uk-navy"
                  >
                    Annual generator fuel budget
                    {isOverridden && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-uk-teal text-white text-[10px] font-cw-bold tracking-wider">
                        CUSTOM
                      </span>
                    )}
                  </label>
                  <span className="font-cw-bold text-uk-teal-dark tabular-nums">
                    {formatNGN(sliderValue)} / year
                  </span>
                </div>
                <input
                  id="assumption-fuel-budget"
                  type="range"
                  min={0}
                  max={sliderMax}
                  step={fuelStep}
                  value={sliderValue}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    if (!Number.isFinite(v) || v < 0) return
                    onFuelBudgetOverrideChange(v)
                  }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-uk-line [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-uk-teal [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-uk-teal [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-uk-slate tabular-nums">
                  <span>₦0</span>
                  <span>
                    {formatNGN(sliderMax)}
                    <span className="ml-1 text-uk-slate/70">
                      (2× default cap)
                    </span>
                  </span>
                </div>
                {isOverridden && (
                  <button
                    type="button"
                    onClick={() => onFuelBudgetOverrideChange(undefined)}
                    className="text-xs text-uk-teal hover:text-uk-teal-dark font-cw-bold underline underline-offset-2"
                  >
                    Reset to default ({formatNGN(currentCap)} / year)
                  </button>
                )}
                <p className="text-xs text-uk-slate">
                  Caps the generator-fuel saving the calculator can claim
                  per year. Default reflects your consultation choice
                  (band or back-derive); adjust if you have a better
                  estimate.
                </p>
              </div>
            )
          })()}

          {/* Import price slider — what the household pays the
              distribution company for each kWh it draws from the
              grid. */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="assumption-import-price"
                className="font-cw-bold text-uk-navy"
              >
                Grid import price
              </label>
              <span className="font-cw-bold text-uk-teal-dark tabular-nums">
                ₦{assumptions.importPriceGbp.toFixed(2)} /kWh
              </span>
            </div>
            <p className="text-xs text-uk-slate">
              What your distribution company charges per kWh of grid
              electricity (residential Band A / B / C tariff)
            </p>
            <input
              id="assumption-import-price"
              type="range"
              min={ROI_IMPORT_PRICE_MIN}
              max={ROI_IMPORT_PRICE_MAX}
              step={ROI_IMPORT_PRICE_STEP}
              value={assumptions.importPriceGbp}
              onChange={(e) =>
                onImportPriceChange(snap(ROI_IMPORT_PRICE_STEP)(parseFloat(e.target.value)))
              }
              aria-label="Grid import price in naira per kilowatt-hour"
              className="w-full h-1.5 cursor-pointer accent-uk-teal"
            />
            <div className="flex justify-between text-[10px] text-uk-slate/70 tabular-nums">
              <span>₦{ROI_IMPORT_PRICE_MIN.toFixed(0)}</span>
              <span>₦{ROI_IMPORT_PRICE_MAX.toFixed(0)}</span>
            </div>
          </div>

          {/* Export price slider — what the household earns for each
              kWh pushed back onto the grid. Nigeria has no confirmed
              feed-in tariff yet, so this defaults to ₦0. */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="assumption-export-price"
                className="font-cw-bold text-uk-navy"
              >
                Export price
              </label>
              <span className="font-cw-bold text-uk-teal-dark tabular-nums">
                ₦{assumptions.exportPriceGbp.toFixed(2)} /kWh
              </span>
            </div>
            <p className="text-xs text-uk-slate">
              What you earn per kWh exported back to the grid. Nigeria
              has no confirmed feed-in tariff yet, so this starts at
              ₦0 — dial in your own rate if you have one.
            </p>
            <input
              id="assumption-export-price"
              type="range"
              min={ROI_EXPORT_PRICE_MIN}
              max={ROI_EXPORT_PRICE_MAX}
              step={ROI_EXPORT_PRICE_STEP}
              value={assumptions.exportPriceGbp}
              onChange={(e) =>
                onExportPriceChange(snap(ROI_EXPORT_PRICE_STEP)(parseFloat(e.target.value)))
              }
              aria-label="Export price in naira per kilowatt-hour"
              className="w-full h-1.5 cursor-pointer accent-uk-teal"
            />
            <div className="flex justify-between text-[10px] text-uk-slate/70 tabular-nums">
              <span>₦{ROI_EXPORT_PRICE_MIN.toFixed(0)}</span>
              <span>₦{ROI_EXPORT_PRICE_MAX.toFixed(0)}</span>
            </div>
          </div>

          {/* Self-consumption rate slider. Default seeded from the
              active plan (battery=100%, no battery=35%) - the user can
              drag below that for solar-only homes that export a lot,
              or down from 100% if their usage doesn't match generation. */}
          <div className="space-y-2 pt-1 border-t border-uk-line/60">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="assumption-self-consumption"
                className="font-cw-bold text-uk-navy"
              >
                Self-consumption rate
              </label>
              <span className="font-cw-bold text-uk-teal-dark tabular-nums">
                {Math.round(assumptions.selfConsumptionRate * 100)}%
              </span>
            </div>
            <p className="text-xs text-uk-slate">
              Share of generation used on-site. With a battery this
              reaches 100%; without one, typical solar-only homes
              self-consume around 35%. Drag to match your actual usage
              pattern.
            </p>
            <input
              id="assumption-self-consumption"
              type="range"
              min={ROI_SELF_CONSUMPTION_MIN}
              max={ROI_SELF_CONSUMPTION_MAX}
              step={ROI_SELF_CONSUMPTION_STEP}
              value={assumptions.selfConsumptionRate}
              onChange={(e) =>
                onSelfConsumptionRateChange(
                  snap(ROI_SELF_CONSUMPTION_STEP)(parseFloat(e.target.value)),
                )
              }
              aria-label="Self-consumption rate as a percentage of generation"
              className="w-full h-1.5 cursor-pointer accent-uk-teal"
            />
            <div className="flex justify-between text-[10px] text-uk-slate/70 tabular-nums">
              <span>{Math.round(ROI_SELF_CONSUMPTION_MIN * 100)}%</span>
              <span>{Math.round(ROI_SELF_CONSUMPTION_MAX * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
