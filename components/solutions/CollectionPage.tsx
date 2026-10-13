'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TbdText from '@/components/ui/tbd-text'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import TrustBar from '@/components/TrustBar'
import type { SolutionDetail } from '@/lib/data/solutions'
import { openFormModal } from '@/lib/form-modal'

/**
 * CollectionPage — the shared layout for the two NG solution
 * collection pages (`/solutions/home-solar` and
 * `/solutions/business-solar`). Per `content/nigeria/solutions.md`
 * (the collection-pages brief, supersedes the original single
 * `/solutions` overview).
 *
 * Layout (top → bottom):
 *   Header → Hero → Solar-vs-Diesel math → 3 solution cards → Tailored CTA
 *   → FAQ → Trust bar → Footer.
 *
 * Both the comparison table ("COMPARE") and the tech-explainers grid
 * ("UNDERSTAND THE SPECS") were removed at the user's directive —
 * the per-tier detail pages under `/solutions/[slug]` carry that
 * technical detail.
 *
 * The "Solar-vs-Diesel math" section is the core Nigerian narrative
 * (replaces the previous "OVERVIEW" context block per the user's
 * directive). It does not promise specific savings, payback or
 * generator elimination - the only TBD-bound numbers are the
 * local fuel price and the verified savings methodology.
 */

export interface CollectionHeroProps {
  eyebrow: string
  title: string
  body: string
  backgroundImage: string
  primaryCta?: { label: string; onClick?: () => void; href?: string }
  secondaryCta?: { label: string; onClick?: () => void; href?: string }
  breadcrumbs?: { label: string; href?: string }[]
}

export interface CollectionContextCopy {
  heading: string
  body: string
}

export interface CollectionFaq {
  q: string
  a: string
}

export interface CollectionPageProps {
  scenario: 'home' | 'business'
  heroProps: CollectionHeroProps
  contextCopy: CollectionContextCopy
  solutions: SolutionDetail[]
  tailoredCta: {
    eyebrow: string
    title: ReactNode
    body: string
    primaryCta: { label: string; onClick?: () => void; href?: string }
    secondaryCta?: { label: string; onClick?: () => void; href?: string }
  }
  faqs: CollectionFaq[]
}

export default function CollectionPage(props: CollectionPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      {/* Hero */}
      <PageHero
        backgroundImage={props.heroProps.backgroundImage}
        eyebrow={props.heroProps.eyebrow}
        title={props.heroProps.title}
        body={props.heroProps.body}
        primaryCta={props.heroProps.primaryCta}
        secondaryCta={props.heroProps.secondaryCta}
        breadcrumbs={props.heroProps.breadcrumbs}
      />

      {/* Solar-vs-Diesel math (replaces the previous "OVERVIEW" block) */}
      <DieselMathSection scenario={props.scenario} />

      {/* 3 solution cards */}
      <SolutionsSection
        scenario={props.scenario}
        solutions={props.solutions}
      />

      {/* Tailored CTA */}
      <TailoredCtaSection cta={props.tailoredCta} />

      {/* FAQ */}
      <FaqSection faqs={props.faqs} />

      <TrustBar />
      <Footer />
    </main>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Solar-vs-Diesel math (replaces the previous "OVERVIEW" block)
   ────────────────────────────────────────────────────────────────────── */

function DieselMathSection({ scenario }: { scenario: 'home' | 'business' }) {
  return (
    <section className="relative py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>THE CORE QUESTION</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            What does your generator <span className="text-gradient">actually cost you?</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
            Adjust the values to match what your generator actually
            runs on. The result updates as you change them.
          </p>
        </div>

        <FuelCostCalculator scenario={scenario} />

        <p className="mt-6 text-center text-xs text-uk-slate font-cw-regular max-w-3xl mx-auto">
          Illustrative estimate only. Actual results depend on
          generator efficiency, solar generation, battery capacity,
          supported loads, weather and usage. This estimate excludes
          system purchase, installation, maintenance and financing
          costs.
        </p>
      </div>
    </section>
  )
}

/**
 * FuelCostCalculator — interactive Nigeria generator-fuel-cost
 * calculator. Replaces the previous icon-heavy two-column
 * explanation (now removed). Pure client-side `useState` math, no
 * submit button: results update as the user types or drags a
 * slider. The "What if solar reduced generator runtime?" slider is
 * a user-controlled scenario assumption, NOT a system prediction -
 * the disclosure paragraph below the calculator spells this out.
 *
 * Inputs are sanitized: `Number.isFinite` rejects NaN/Infinity, the
 * safe helpers then clamp negatives / over-large values to keep the
 * math finite and the figures readable. Currency is rendered with
 * the same `en-GB` locale helper pattern as
 * `app/my-plan/_lib/format.ts` (no existing NGN formatter was
 * available, so the formatter is local to this component).
 *
 * Defaults (illustrative, not verified national averages):
 *   Petrol (PMS): ₦1,400/L
 *   Diesel (AGO): ₦1,900/L
 *   Home fuel use:   1 L/h,  6 hours/day, 30 days/month
 *   Business fuel use: 4 L/h, 8 hours/day, 30 days/month
 *   Runtime reduction slider: starts at 50% (illustrative)
 */
function FuelCostCalculator({ scenario }: { scenario: 'home' | 'business' }) {
  const isHome = scenario === 'home'

  const [fuelType, setFuelType] = useState<'petrol' | 'diesel'>('petrol')
  const [fuelPrice, setFuelPrice] = useState<number>(1400)
  const [fuelConsumption, setFuelConsumption] = useState<number>(isHome ? 1 : 4)
  const [hoursPerDay, setHoursPerDay] = useState<number>(isHome ? 6 : 8)
  const [daysPerMonth, setDaysPerMonth] = useState<number>(30)
  const [reductionPct, setReductionPct] = useState<number>(50)

  function handleFuelTypeChange(type: 'petrol' | 'diesel') {
    setFuelType(type)
    setFuelPrice(type === 'petrol' ? 1400 : 1900)
  }

  // Sanitize inputs - clamp to safe ranges, fall back to 0 for
  // empty / invalid / NaN / Infinity values.
  const safePrice = Number.isFinite(fuelPrice) ? Math.max(0, fuelPrice) : 0
  const safeConsumption = Number.isFinite(fuelConsumption)
    ? Math.max(0, fuelConsumption)
    : 0
  const safeHours = Number.isFinite(hoursPerDay)
    ? Math.max(0, Math.min(24, hoursPerDay))
    : 0
  const safeDays = Number.isFinite(daysPerMonth)
    ? Math.max(0, Math.min(31, daysPerMonth))
    : 0
  const safeReduction = Number.isFinite(reductionPct)
    ? Math.max(0, Math.min(100, reductionPct))
    : 0

  // === CORE CALCULATION ===
  const monthlyLitres = safeConsumption * safeHours * safeDays
  const monthlyFuelCost = monthlyLitres * safePrice
  const annualFuelCost = monthlyFuelCost * 12
  const potentialMonthlyAvoided = (monthlyFuelCost * safeReduction) / 100
  const remainingMonthlyFuelCost = monthlyFuelCost - potentialMonthlyAvoided

  // Locale-aware NGN formatter (₦ + comma-separated thousands).
  // Matches the existing /my-plan formatters in app/my-plan/_lib/format.ts
  // which use en-GB for stable column widths.
  const formatNgn = (n: number) =>
    '₦' + Math.round(n).toLocaleString('en-GB')

  const afterRatio =
    monthlyFuelCost > 0
      ? Math.max(
          0,
          Math.min(100, (remainingMonthlyFuelCost / monthlyFuelCost) * 100)
        )
      : 0

  const sliderTealCls =
    'w-full h-1.5 rounded-full appearance-none cursor-pointer bg-uk-line ' +
    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 ' +
    '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-uk-teal [&::-webkit-slider-thumb]:cursor-pointer ' +
    '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full ' +
    '[&::-moz-range-thumb]:bg-uk-teal [&::-moz-range-thumb]:border-0'

  const sliderEmeraldCls =
    'w-full h-1.5 rounded-full appearance-none cursor-pointer bg-uk-line ' +
    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 ' +
    '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-uk-emerald [&::-webkit-slider-thumb]:cursor-pointer ' +
    '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full ' +
    '[&::-moz-range-thumb]:bg-uk-emerald [&::-moz-range-thumb]:border-0'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT - Inputs */}
      <div className="rounded-2xl border border-uk-line bg-uk-line/20 p-6 lg:p-8">
        <h3 className="text-xl font-cw-bold text-uk-navy mb-6">
          Your generator today
        </h3>

        {/* Fuel type segmented control */}
        <div className="mb-5">
          <label className="block text-sm font-cw-bold text-uk-navy mb-2">
            Fuel type
          </label>
          <div
            role="radiogroup"
            aria-label="Fuel type"
            className="grid grid-cols-2 gap-1 rounded-full border border-uk-line bg-white p-1"
          >
            <button
              type="button"
              role="radio"
              aria-checked={fuelType === 'petrol'}
              onClick={() => handleFuelTypeChange('petrol')}
              className={`px-3 py-2 text-sm font-cw-bold rounded-full transition-colors ${
                fuelType === 'petrol'
                  ? 'bg-uk-teal text-white'
                  : 'text-uk-slate hover:text-uk-navy'
              }`}
            >
              Petrol (PMS)
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={fuelType === 'diesel'}
              onClick={() => handleFuelTypeChange('diesel')}
              className={`px-3 py-2 text-sm font-cw-bold rounded-full transition-colors ${
                fuelType === 'diesel'
                  ? 'bg-uk-teal text-white'
                  : 'text-uk-slate hover:text-uk-navy'
              }`}
            >
              Diesel (AGO)
            </button>
          </div>
        </div>

        {/* Fuel price */}
        <div className="mb-5">
          <label
            htmlFor="fuel-price"
            className="block text-sm font-cw-bold text-uk-navy mb-1"
          >
            Fuel price (₦/litre)
          </label>
          <input
            id="fuel-price"
            type="number"
            min={0}
            step={1}
            inputMode="decimal"
            value={fuelPrice}
            onChange={(e) =>
              setFuelPrice(parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-2 rounded-lg border border-uk-line bg-white text-uk-navy font-cw-regular focus:outline-none focus:border-uk-teal"
          />
          <p className="mt-1 text-xs text-uk-slate font-cw-regular">
            Indicative fuel price. Update this to match your local
            pump price.
          </p>
        </div>

        {/* Fuel consumption */}
        <div className="mb-5">
          <label
            htmlFor="fuel-consumption"
            className="block text-sm font-cw-bold text-uk-navy mb-1"
          >
            Estimated fuel use (L/hour)
          </label>
          <input
            id="fuel-consumption"
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={fuelConsumption}
            onChange={(e) =>
              setFuelConsumption(parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-2 rounded-lg border border-uk-line bg-white text-uk-navy font-cw-regular focus:outline-none focus:border-uk-teal"
          />
          <p className="mt-1 text-xs text-uk-slate font-cw-regular">
            Editable example. Adjust to match your generator.
          </p>
        </div>

        {/* Hours per day */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="hours-per-day"
              className="text-sm font-cw-bold text-uk-navy"
            >
              Hours of use per day
            </label>
            <span className="text-sm font-cw-bold text-uk-teal tabular-nums">
              {safeHours}
            </span>
          </div>
          <input
            id="hours-per-day"
            type="range"
            min={0}
            max={24}
            step={1}
            value={hoursPerDay}
            onChange={(e) =>
              setHoursPerDay(parseInt(e.target.value, 10) || 0)
            }
            className={sliderTealCls}
          />
          <div className="flex justify-between text-xs text-uk-slate font-cw-regular mt-1">
            <span>0</span>
            <span>24</span>
          </div>
        </div>

        {/* Days per month */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="days-per-month"
              className="text-sm font-cw-bold text-uk-navy"
            >
              Days of use per month
            </label>
            <span className="text-sm font-cw-bold text-uk-teal tabular-nums">
              {safeDays}
            </span>
          </div>
          <input
            id="days-per-month"
            type="range"
            min={0}
            max={31}
            step={1}
            value={daysPerMonth}
            onChange={(e) =>
              setDaysPerMonth(parseInt(e.target.value, 10) || 0)
            }
            className={sliderTealCls}
          />
          <div className="flex justify-between text-xs text-uk-slate font-cw-regular mt-1">
            <span>0</span>
            <span>31</span>
          </div>
        </div>
      </div>

      {/* RIGHT - Results */}
      <div
        className="rounded-2xl border border-uk-line bg-uk-emerald/5 p-6 lg:p-8"
        aria-live="polite"
      >
        <h3 className="text-xl font-cw-bold text-uk-navy mb-6">
          Your estimated fuel cost
        </h3>

        {/* Main monthly cost */}
        <div className="text-center pb-4 border-b border-uk-line/40">
          <div className="text-xs uppercase tracking-wider text-uk-slate font-cw-bold">
            Estimated monthly fuel cost
          </div>
          <div className="mt-2 text-4xl md:text-5xl font-cw-bold text-uk-navy tabular-nums">
            {formatNgn(monthlyFuelCost)}
          </div>
          <div className="mt-1 text-xs text-uk-slate font-cw-regular tabular-nums">
            {monthlyLitres.toLocaleString('en-GB', {
              maximumFractionDigits: 1,
            })}{' '}
            litres / month
          </div>
        </div>

        {/* Annual cost (secondary) */}
        <div className="text-center py-4 border-b border-uk-line/40">
          <div className="text-xs uppercase tracking-wider text-uk-slate font-cw-bold">
            Estimated annual fuel cost
          </div>
          <div className="mt-1 text-xl font-cw-bold text-uk-navy tabular-nums">
            {formatNgn(annualFuelCost)}
          </div>
        </div>

        {/* Reduction slider */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="reduction-pct"
              className="text-sm font-cw-bold text-uk-navy"
            >
              What if solar reduced generator runtime?
            </label>
            <span className="text-base font-cw-bold text-uk-emerald tabular-nums">
              {safeReduction}%
            </span>
          </div>
          <input
            id="reduction-pct"
            type="range"
            min={0}
            max={100}
            step={5}
            value={reductionPct}
            onChange={(e) =>
              setReductionPct(parseInt(e.target.value, 10) || 0)
            }
            className={sliderEmeraldCls}
          />
          <p className="mt-1 text-xs text-uk-slate font-cw-regular">
            User-set scenario assumption, not a system prediction.
          </p>
        </div>

        {/* Potential avoided */}
        <div className="mt-4 rounded-xl bg-white/70 p-4 border border-uk-emerald/20">
          <div className="text-xs uppercase tracking-wider text-uk-emerald font-cw-bold">
            Potential monthly fuel cost avoided
          </div>
          <div className="mt-1 text-2xl font-cw-bold text-uk-emerald tabular-nums">
            {formatNgn(potentialMonthlyAvoided)}
          </div>
        </div>

        {/* Remaining */}
        <div className="mt-3 rounded-xl bg-uk-line/30 p-4">
          <div className="text-xs uppercase tracking-wider text-uk-slate font-cw-bold">
            Estimated remaining monthly generator fuel cost
          </div>
          <div className="mt-1 text-2xl font-cw-bold text-uk-navy tabular-nums">
            {formatNgn(remainingMonthlyFuelCost)}
          </div>
        </div>

        {/* Before / after bar */}
        <div className="mt-6">
          <div className="text-xs text-uk-slate font-cw-bold uppercase tracking-wider mb-2">
            Before / after solar
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-uk-slate font-cw-regular w-14 shrink-0">
                Before
              </span>
              <div className="flex-1 h-3 bg-uk-line rounded-full overflow-hidden">
                <div className="h-full bg-uk-navy" style={{ width: '100%' }} />
              </div>
              <span className="text-xs font-cw-bold text-uk-navy w-24 text-right tabular-nums">
                {formatNgn(monthlyFuelCost)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-uk-slate font-cw-regular w-14 shrink-0">
                After
              </span>
              <div className="flex-1 h-3 bg-uk-line rounded-full overflow-hidden">
                <div
                  className="h-full bg-uk-emerald transition-all"
                  style={{ width: `${afterRatio}%` }}
                />
              </div>
              <span className="text-xs font-cw-bold text-uk-emerald w-24 text-right tabular-nums">
                {formatNgn(remainingMonthlyFuelCost)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   3 solution cards (anchored as #solutions)
   ────────────────────────────────────────────────────────────────────── */

function SolutionsSection({
  scenario,
  solutions,
}: {
  scenario: 'home' | 'business'
  solutions: SolutionDetail[]
}) {
  return (
    <section
      id="solutions"
      className="relative py-16 md:py-20 bg-uk-line/30 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>{scenario === 'home' ? 'SOLUTIONS for HOME' : 'SOLUTIONS for BUSINESS'}</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            {scenario === 'home' ? (
              <>Home Solar solutions, sized to your <span className="text-gradient">appliances and backup needs</span></>
            ) : (
              <>Business Solar solutions, sized to your <span className="text-gradient">loads and operating hours</span></>
            )}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutions.map((sol) => (
            <SolutionCard key={sol.id} sol={sol} scenario={scenario} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SolutionCard({
  sol,
  scenario: _scenario,
}: {
  sol: SolutionDetail
  scenario: 'home' | 'business'
}) {
  // Render the eyebrow line with the spec part ("Single phase" /
  // "Three phase") highlighted in emerald. The descriptor after the "·"
  // stays in slate italic, matching the UK home-page card treatment.
  const eyebrowParts = sol.eyebrow.split(' · ')
  const specPart = eyebrowParts[0] ?? sol.eyebrow
  const descriptorPart = eyebrowParts.slice(1).join(' · ')
  return (
    <div
      id={sol.id}
      className="group flex flex-col rounded-2xl border border-uk-line bg-white overflow-hidden transition-all duration-300 hover:border-uk-teal hover:shadow-md hover:-translate-y-0.5 scroll-mt-24"
    >
      {/* Solution image - the per-solution files live in /public/images
         named to match the solution id (LITE-Essential-Backup.webp etc). */}
      <div className="aspect-[4/3] bg-uk-line/30 overflow-hidden">
        <img
          src={sol.imagePath}
          alt={sol.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-cw-bold text-uk-navy leading-tight">
          {sol.title}
        </h3>
        <p className="mt-1 text-sm font-cw-bold">
          <span className="text-uk-emerald">{specPart}</span>
          {descriptorPart && (
            <>
              <span className="text-uk-slate"> · </span>
              <span className="text-uk-slate font-cw-regular italic">
                {descriptorPart}
              </span>
            </>
          )}
        </p>
        <p className="mt-3 text-sm text-uk-slate font-cw-regular leading-relaxed">
          {sol.shortIntro ?? sol.intro}
        </p>
        <dl className="mt-5 space-y-2 text-sm">
          {sol.bullets.slice(0, 4).map((b, i) => (
            <div key={i} className="flex items-start gap-2 text-uk-navy">
              <Check className="w-4 h-4 text-uk-emerald flex-shrink-0 mt-0.5" strokeWidth={3} />
              <span>{b}</span>
            </div>
          ))}
        </dl>
        <div className="mt-6 grid grid-cols-2 gap-2 text-center">
          {sol.headlineStats.map((s, i) => (
            <div key={i} className="rounded-xl border border-uk-line bg-uk-line/30 px-2 py-2">
              <div className="text-sm font-cw-bold text-uk-teal-dark">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-uk-slate font-cw-regular mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => openFormModal()}
          className="mt-3 w-full btn-gradient py-2.5 rounded-lg text-sm font-cw-bold text-center text-white transition-all duration-300 block cursor-pointer"
        >
          Get Free Quote →
        </button>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Tailored CTA - the "not a standard fit" block.
   Per the user's directive, the secondary CTA does NOT link to the
   other collection page (no "for home/business instead"). It now
   stays within the current scenario.
   ────────────────────────────────────────────────────────────────────── */

function TailoredCtaSection({
  cta,
}: {
  cta: CollectionPageProps['tailoredCta']
}) {
  return (
    <section className="relative py-16 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <SectionEyebrow>{cta.eyebrow}</SectionEyebrow>
        <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
          {cta.title}
        </h2>
        <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
          {cta.body}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <TailoredCtaButton cta={cta.primaryCta} variant="primary" />
          {cta.secondaryCta && (
            <TailoredCtaButton cta={cta.secondaryCta} variant="secondary" />
          )}
        </div>
        <p className="mt-4 text-sm text-uk-slate font-cw-regular">
          <TbdText text="Approved NG installation and warranty terms" inline />
        </p>
      </div>
    </section>
  )
}

function TailoredCtaButton({
  cta,
  variant,
}: {
  cta: { label: string; onClick?: () => void; href?: string }
  variant: 'primary' | 'secondary'
}) {
  const cls =
    variant === 'primary'
      ? 'btn-gradient px-6 py-3 rounded-full text-sm font-cw-bold text-white'
      : 'px-6 py-3 rounded-full text-sm font-cw-bold border border-uk-teal text-uk-teal hover:bg-uk-teal hover:text-white transition-colors'
  if (cta.href) {
    return (
      <Link href={cta.href} className={cls}>
        {cta.label}
      </Link>
    )
  }
  return (
    <button type="button" onClick={cta.onClick} className={cls}>
      {cta.label}
    </button>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   FAQ
   ────────────────────────────────────────────────────────────────────── */

function FaqSection({ faqs }: { faqs: CollectionFaq[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <section id="faq" className="relative py-16 md:py-20 bg-uk-line/30">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-8">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((item, i) => {
            const open = openIdx === i
            return (
              <div
                key={i}
                className="rounded-2xl border border-uk-line bg-white overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                  aria-expanded={open}
                >
                  <span className="text-sm md:text-base font-cw-bold text-uk-navy">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-uk-slate flex-shrink-0 transition-transform duration-200 ${
                      open ? 'rotate-180' : ''
                    }`}
                    strokeWidth={2}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-5 text-sm text-uk-slate font-cw-regular leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
