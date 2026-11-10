'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, TrendingUp } from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import TbdText from '@/components/ui/tbd-text'
import { openFormModal } from '@/lib/form-modal'
import {
  CNI_LONG_TERM_YEARS,
  CNI_ROOF_SQM_PER_KWP,
  CNI_SPECIFIC_YIELD_KWH_PER_KWP_PER_DAY,
  cniPackages,
} from '@/lib/data/cni'

/**
 * RoiEstimator — the C&I savings estimator.
 *
 * Rules this component follows, so the numbers it prints can be trusted:
 *
 *  - The electricity price is entered by the visitor. A C&I tariff is
 *    not the residential tier ladder, so there is no default price: the
 *    helper text points at the line on their own bill.
 *  - Generation uses the yield published with the site's own business
 *    packages (3.5 kWh per kWp per day, which is what the three package
 *    estimates work out to).
 *  - Roof area is converted with the published usable density of
 *    5 ㎡ per kWp, and the package is the largest one the roof carries.
 *  - The saving is the generation the site can actually absorb, capped
 *    by the site's own annual consumption — an upper bound, not a
 *    promise. The real number depends on the load curve.
 *  - Payback is NOT calculated: it needs a confirmed system price for
 *    the configuration, which only exists at quotation. It stays a
 *    visible TBD rather than a made-up year count.
 */

const vnNumber = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
})

function digits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 12)
}

function decimal(value: string): string {
  return value.replace(/[^\d.]/g, '').slice(0, 10)
}

export default function RoiEstimator() {
  const [bill, setBill] = useState('')
  const [tariff, setTariff] = useState('')
  const [roofArea, setRoofArea] = useState('')

  const result = useMemo(() => {
    const billValue = Number(bill || 0)
    const tariffValue = Number(tariff || 0)
    const areaValue = Number(roofArea || 0)
    if (billValue <= 0 || tariffValue <= 0 || areaValue <= 0) return null

    const monthlyKwh = billValue / tariffValue
    const annualConsumption = monthlyKwh * 12

    // The largest package the roof can physically carry.
    const maxKwp = areaValue / CNI_ROOF_SQM_PER_KWP
    const fitting = cniPackages.filter(
      (p) => parseFloat(p.pv) <= maxKwp,
    )
    const pkg = fitting.length > 0 ? fitting[fitting.length - 1] : cniPackages[0]
    const kwp = parseFloat(pkg.pv)
    const roofTooSmall = fitting.length === 0

    const annualGeneration = Math.round(
      kwp * CNI_SPECIFIC_YIELD_KWH_PER_KWP_PER_DAY * 365,
    )
    // The saving can never exceed what the site actually buys.
    const offsetKwh = Math.min(annualGeneration, annualConsumption)
    const annualSaving = Math.round(offsetKwh * tariffValue)
    const longTermSaving = annualSaving * CNI_LONG_TERM_YEARS

    return {
      pkg,
      kwp,
      roofTooSmall,
      monthlyKwh,
      annualConsumption,
      annualGeneration,
      offsetKwh,
      annualSaving,
      longTermSaving,
      // The array covers only part of the consumption — worth saying out loud.
      coverage: annualConsumption > 0
        ? Math.min(1, offsetKwh / annualConsumption)
        : 0,
    }
  }, [bill, tariff, roofArea])

  const summary = result
    ? `C&I assessment — ${result.pkg.solution.title} (${result.kwp} kWp), bill ${vnNumber.format(Number(bill))} ₫/month, roof ${roofArea} sqm`
    : undefined

  return (
    <section
      id="investment"
      className="relative py-16 md:py-24 bg-uk-line/30 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <SectionEyebrow>INVESTMENT & ROI</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Make Your Energy Investment <span className="text-gradient">Count</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Put your own numbers in — your bill, your price per kWh and
            your roof. The estimate uses the yield published with our
            business packages and your electricity price, so the result is
            yours to check rather than ours to defend.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          {/* Inputs */}
          <div className="lg:col-span-2 rounded-2xl border border-uk-line bg-white p-6 md:p-8">
            <h3 className="text-lg font-cw-bold text-uk-navy">
              Your energy profile
            </h3>
            <p className="mt-1.5 text-sm text-uk-slate font-cw-regular">
              Three numbers. Nothing is sent anywhere until you ask us to
              contact you.
            </p>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="block text-sm font-cw-bold text-uk-navy">
                  Average monthly electricity bill
                </span>
                <span className="mt-2 flex items-baseline gap-2 rounded-xl border border-uk-line bg-white px-4 py-2.5 transition-colors focus-within:border-uk-teal focus-within:ring-2 focus-within:ring-uk-teal/20">
                  <input
                    value={bill ? vnNumber.format(Number(bill)) : ''}
                    onChange={(event) => setBill(digits(event.target.value))}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="50.000.000"
                    aria-label="Average monthly electricity bill in Vietnamese dong"
                    className="w-full min-w-0 bg-transparent text-lg font-cw-bold text-uk-navy outline-none placeholder:text-uk-slate/50"
                  />
                  <span className="shrink-0 text-sm text-uk-slate">₫/month</span>
                </span>
              </label>

              <label className="block">
                <span className="block text-sm font-cw-bold text-uk-navy">
                  Average price you pay per kWh
                </span>
                <span className="mt-2 flex items-baseline gap-2 rounded-xl border border-uk-line bg-white px-4 py-2.5 transition-colors focus-within:border-uk-teal focus-within:ring-2 focus-within:ring-uk-teal/20">
                  <input
                    value={tariff}
                    onChange={(event) => setTariff(decimal(event.target.value))}
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="VD/kWh"
                    aria-label="Average electricity price per kWh in Vietnamese dong"
                    className="w-full min-w-0 bg-transparent text-lg font-cw-bold text-uk-navy outline-none placeholder:text-uk-slate/50"
                  />
                </span>
                <span className="mt-1.5 block text-xs text-uk-slate leading-relaxed">
                  From your bill: total amount ÷ total kWh. We do not
                  substitute a standard price, because a business tariff
                  is not the residential ladder.
                </span>
              </label>

              <label className="block">
                <span className="block text-sm font-cw-bold text-uk-navy">
                  Usable roof area
                </span>
                <span className="mt-2 flex items-baseline gap-2 rounded-xl border border-uk-line bg-white px-4 py-2.5 transition-colors focus-within:border-uk-teal focus-within:ring-2 focus-within:ring-uk-teal/20">
                  <input
                    value={roofArea}
                    onChange={(event) =>
                      setRoofArea(decimal(event.target.value))
                    }
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="120"
                    aria-label="Usable roof area in square metres"
                    className="w-full min-w-0 bg-transparent text-lg font-cw-bold text-uk-navy outline-none placeholder:text-uk-slate/50"
                  />
                  <span className="shrink-0 text-sm text-uk-slate">㎡</span>
                </span>
                <span className="mt-1.5 block text-xs text-uk-slate leading-relaxed">
                  Roof area that can actually carry panels — walkways and
                  setbacks are already allowed for.
                </span>
              </label>
            </div>

            {!result && (
              <p className="mt-6 text-xs text-uk-slate leading-relaxed">
                Fill in the three fields to see the estimate.
              </p>
            )}
          </div>

          {/* Outputs */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <MetricTile
                label="Annual energy generation"
                value={result ? vnNumber.format(result.annualGeneration) : '—'}
                unit="kWh / year"
                note={
                  result
                    ? `Reference estimate for ${result.kwp} kWp — ${result.pkg.solution.title}.`
                    : 'Reference estimate once the fields are filled in.'
                }
              />
              <MetricTile
                label="Annual cost savings"
                value={
                  result ? vnNumber.format(result.annualSaving) : '—'
                }
                unit="VND / year"
                note={
                  result
                    ? `At your price of ${vnNumber.format(Number(tariff))} ₫/kWh.`
                    : 'Calculated at the price you enter.'
                }
                accent
              />
              <MetricTile
                label="Investment payback"
                value="TBD"
                unit="years"
                note={
                  <>
                    <TbdText
                      text="Confirmed at quotation — it depends on the system price for your configuration and on how much generation your site can absorb directly."
                      inline
                    />
                  </>
                }
              />
              <MetricTile
                label={`Long-term savings (${CNI_LONG_TERM_YEARS} years)`}
                value={
                  result ? vnNumber.format(result.longTermSaving) : '—'
                }
                unit="VND"
                note={
                  result
                    ? 'No tariff escalation and no degradation applied — the estimate is deliberately flat.'
                    : 'Projected from the annual saving.'
                }
              />
            </div>

            {result && (
              <div className="mt-5 rounded-2xl border border-uk-line bg-white p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-uk-teal-dark" strokeWidth={2} />
                  <h3 className="text-base font-cw-bold text-uk-navy">
                    What this means for your site
                  </h3>
                </div>
                <p className="mt-3 text-sm text-uk-slate font-cw-regular leading-relaxed">
                  Your roof carries{' '}
                  <span className="font-cw-bold text-uk-navy">
                    {result.pkg.solution.title}
                  </span>{' '}
                  ({result.kwp} kWp). The array is estimated to produce{' '}
                  <span className="font-cw-bold text-uk-navy">
                    {vnNumber.format(result.annualGeneration)} kWh
                  </span>{' '}
                  a year against a consumption of about{' '}
                  <span className="font-cw-bold text-uk-navy">
                    {vnNumber.format(Math.round(result.annualConsumption))} kWh
                  </span>
                  , so it covers roughly{' '}
                  <span className="font-cw-bold text-uk-navy">
                    {Math.round(result.coverage * 100)}%
                  </span>{' '}
                  of what the site buys.
                </p>
                {result.roofTooSmall && (
                  <p className="mt-3 text-sm text-uk-slate font-cw-regular leading-relaxed">
                    The roof area is below what the smallest published
                    configuration needs — a ground-mounted array or a
                    larger site is worth discussing.
                  </p>
                )}
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      openFormModal({
                        solutionType: 'business',
                        interestedProduct: summary,
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-cw-bold btn-gradient text-white cursor-pointer"
                  >
                    Get a formal assessment
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}

            {/* The assumptions, stated openly */}
            <details className="mt-5 rounded-2xl border border-uk-line bg-white">
              <summary className="cursor-pointer list-none px-6 py-4 text-sm font-cw-bold text-uk-navy">
                How this estimate is calculated
              </summary>
              <div className="px-6 pb-6 space-y-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                <p>
                  Generation uses {CNI_SPECIFIC_YIELD_KWH_PER_KWP_PER_DAY} kWh
                  per kWp per day — the yield the published business
                  packages already work out to for Vietnam. Actual output
                  depends on location, tilt, shading, soiling and weather.
                </p>
                <p>
                  Roof area is converted at {CNI_ROOF_SQM_PER_KWP} ㎡ per
                  kWp, the usable density from the published sizing
                  table, including walkways and setbacks.
                </p>
                <p>
                  The saving is the generation your site can absorb, capped
                  at your own annual consumption. How much of it is used
                  directly depends on your load curve and operating hours,
                  so this figure is an upper bound.
                </p>
                <p>
                  Payback is left open on purpose: it needs the quoted
                  price of the configuration, which is why it is confirmed
                  at quotation rather than published here.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  )
}

/** One metric tile — the four headline numbers of the section. */
function MetricTile({
  label,
  value,
  unit,
  note,
  accent = false,
}: {
  label: string
  value: string
  unit: string
  note: React.ReactNode
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        accent
          ? 'border-uk-teal bg-uk-teal-soft'
          : 'border-uk-line bg-white'
      }`}
    >
      <p className="text-xs font-cw-bold text-uk-slate uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-3 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-none">
        {value}
      </p>
      <p className="mt-2 text-sm font-cw-bold text-uk-teal-dark">{unit}</p>
      <p className="mt-3 text-xs text-uk-slate font-cw-regular leading-relaxed">
        {note}
      </p>
    </div>
  )
}
