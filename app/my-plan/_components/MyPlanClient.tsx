'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

import HomeDetailsCard from './HomeDetailsCard'
import ProductCard from './ProductCard'
import CustomiseCard from './CustomiseCard'
import SavingsSection from './SavingsSection'
import OfferCard from './OfferCard'
import PlanSummaryAside from './PlanSummaryAside'
import MobileStickyCTA from './MobileStickyCTA'

import {
  getPlan,
  recommendPlan,
  calculateROI,
  DEFAULT_ROI_IMPORT_PRICE_GBP,
  DEFAULT_ROI_EXPORT_PRICE_GBP,
  ROI_SELF_CONSUMPTION_BASE_RATE,
  type PlanId,
  type Plan,
  type PlanRoi,
  type RoiAssumptions,
  type ConsultationInput,
  type HomeDetails,
} from '../_lib/calc'
import { openFormModal } from '@/lib/form-modal'
import type { FormData } from '@/lib/form-types'

interface MyPlanClientProps {
  /** Resolved row from /api/my-plan/[token], already adapted to camelCase. */
  consultation: ConsultationInput
  /** Address + house type + bedrooms + roof orientation, for the top strip. */
  home: HomeDetails
  /** Prefill seed for the Edit-details consultation form. */
  prefill: Partial<FormData>
  /** Raw plan_token from the URL - sent to /api/track/my-plan-confirm so
   *  admin can see "Talk to an expert" clicks. The endpoint is idempotent
   *  (RPC COALESCE), so multiple clicks preserve the first timestamp. */
  planToken: string
}

/**
 * Orchestrator for `/my-plan` (valid-id branch).
 *
 * State model:
 *   - `selectedPlanId` controls which plan bundle is active.
 *   - `importPriceGbp` / `exportPriceGbp` are user-tweakable so the
 *     customer can model their actual tariff. They survive plan
 *     switches - they describe the household's tariff, not the
 *     hardware, so a package swap shouldn't reset them.
 *   - Everything else (`plan`, `assumptions`, `metrics`, `systemKw`) is
 *     derived via `useMemo`. Switching plans re-renders only the
 *     affected children - never the whole tree.
 *
 * The "Choose your plan" card is a 4-plan selector. Solar panels /
 * battery / inverter are NOT independently adjustable: switching plans
 * swaps the whole configuration as a bundle. Self-consumption rate is
 * derived from the active plan (battery=100%, no-battery=35%) and is
 * not editable - it depends on hardware. Import and export prices are
 * surfaced as sliders in the "View calculation assumptions" disclosure.
 */
export default function MyPlanClient({
  consultation,
  home,
  prefill,
  planToken,
}: MyPlanClientProps) {
  const recommendedPlanId = useMemo(
    () => recommendPlan(consultation),
    [consultation],
  )

  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(recommendedPlanId)

  // User-tweakable tariff assumptions. Seeded from the NG residential
  // grid tariff (Band A/B/C - TBD, verified rate pending) and the
  // current export rate (TBD - Nigeria has no confirmed feed-in
  // tariff yet). Independent of plan choice - a customer who pays
  // ₦68/kWh on LITE Essential Backup pays ₦68/kWh on BUSINESS
  // Flagship 3-Phase too, so the values survive plan switches.
  const [importPriceGbp, setImportPriceGbp] = useState<number>(DEFAULT_ROI_IMPORT_PRICE_GBP)
  const [exportPriceGbp, setExportPriceGbp] = useState<number>(DEFAULT_ROI_EXPORT_PRICE_GBP)
  // Self-consumption rate is also user-tweakable so a customer can model
  // their actual usage pattern (e.g. all-day-out household). Seeded from
  // the recommended plan's automatic default (battery=100%, no=35%) on
  // first mount; thereafter the value persists across plan switches.
  const [selfConsumptionRate, setSelfConsumptionRate] = useState<number>(
    () => {
      const seedPlan = getPlan(recommendedPlanId)
      return seedPlan.batteryKwh > 0 ? 1 : ROI_SELF_CONSUMPTION_BASE_RATE
    },
  )

  /**
   * User-tweakable annual fuel budget override (₦/year). When set,
   * replaces the band/back-derive cap in the calculator. Surfaced
   * as a slider in `CustomiseCard` "View calculation assumptions"
   * so "Not sure" users can dial their assumed spend without
   * re-opening the consultation form. `undefined` = use the
   * calculator's default (band or back-derive + hard cap).
   */
  const [userFuelBudgetOverrideNgn, setUserFuelBudgetOverrideNgn] =
    useState<number | undefined>(undefined)

  // Single derivation point - every metric comes from this useMemo.
  const plan: Plan = useMemo(() => getPlan(selectedPlanId), [selectedPlanId])
  // Assumptions: legacy RoiAssumptions object. The NG calculator bakes
  // its own tariffs internally so the assumptions are not currently
  // consumed - kept exported to keep the slider UI in the tree without
  // rippling. If user-tweakable tariffs come back, pass `assumptions`
  // into `calculateROI(plan, consultation, assumptions)`.
  const assumptions: RoiAssumptions = useMemo(
    () => ({
      importPriceGbp,
      exportPriceGbp,
      selfConsumptionRate,
    }),
    [importPriceGbp, exportPriceGbp, selfConsumptionRate],
  )
  const metrics: PlanRoi = useMemo(
    () => calculateROI(plan, consultation, userFuelBudgetOverrideNgn),
    [plan, consultation, userFuelBudgetOverrideNgn],
  )
  const systemKw = useMemo(
    () => plan.panels * 0.46, // 460 W per panel - same constant as in calc.ts
    [plan],
  )

  // After "Talk to an expert" the 3 CTA surfaces (OfferCard /
  // PlanSummaryAside / MobileStickyCTA) flip to an inline success
  // card. No floating toast - the message stays visible until the
  // customer explicitly returns to the plan.
  const [contactSubmitted, setContactSubmitted] = useState(false)

  const handleContactExpert = useCallback(() => {
    // Fire-and-forget confirm tracking. The endpoint is idempotent and
    // returns 200 even on invalid tokens, so flipping to the success
    // card is always safe - the only failure mode is logging.
    if (planToken) {
      void fetch('/api/track/my-plan-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planToken }),
      }).catch((err) => {
        console.error('[/my-plan] confirm tracking failed:', err)
      })
    }
    setContactSubmitted(true)
  }, [planToken])

  const handleBackToPlan = useCallback(() => {
    setContactSubmitted(false)
  }, [])

  // "Edit details" → open the consultation form with the current row
  // pre-filled so the user can tweak fields without re-entering them.
  // `prefill` is the DB row adapted to FormData shape in `lib/my-plan/adapter.ts`.
  const handleEditDetails = useCallback(() => {
    openFormModal(prefill)
  }, [prefill])

  // Focus-scroll for "Change ›" buttons in the product cards → plan selector.
  const customiseRef = useRef<HTMLDivElement | null>(null)
  const focusCustomise = useCallback(() => {
    if (typeof window === 'undefined' || !customiseRef.current) return
    customiseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const isSelectedRecommended = selectedPlanId === recommendedPlanId

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header logoHref="/" />

      {/* Hero band - mirrors the legal-page hero with breadcrumb + animated
          underline. Identifier is surfaced as a transparent subtitle so the
          customer sees that the link was consumed. */}
      <section className="pt-24 pb-8 lg:pt-32 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'My Plan' },
            ]}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl lg:text-4xl font-cw-bold text-[#0A1628] mt-6 mb-2"
          >
            Your Initial Solar Plan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="text-sm text-[#4A5568] mb-4"
          >
            A personalised system designed around your home and energy needs.
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-[#0F766E] to-[#10B981] rounded"
          />
        </div>
      </section>

      <section className="py-8 lg:py-12 pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Home details strip - Edit callback opens the form prefilled. */}
          <HomeDetailsCard
            home={home}
            onEdit={handleEditDetails}
          />

          {/* Your system heading + recommended badge */}
          <div className="mt-12 mb-4 flex flex-wrap items-center gap-3">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
              Your system
            </h2>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate">
              <Check className="w-3 h-3 text-uk-emerald" strokeWidth={3} />
              {isSelectedRecommended
                ? 'Recommended for your home'
                : 'Showing your customised plan'}
            </span>
          </div>

          {/* Main grid: product cards + customise (left) + sticky summary aside (right). */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* 3 product cards - fixed by current plan, live in the left column. */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <ProductCard
                  kind="panel"
                  title="Solar"
                  subtitle={
                    plan.kwpLabel
                      ? `${plan.kwpLabel} rated PV`
                      : `${plan.panels} kWp rated PV`
                  }
                  value={plan.kwpLabel ?? `${plan.panels} kWp`}
                  onChange={focusCustomise}
                />
                <ProductCard
                  kind="battery"
                  title="Battery"
                  subtitle={
                    plan.batteryKwh > 0
                      ? `${plan.batteryKwh} kWh storage`
                      : 'No battery'
                  }
                  value={plan.batteryKwh > 0 ? `${plan.batteryKwh} kWh` : '-'}
                  onChange={focusCustomise}
                />
                <ProductCard
                  kind="inverter"
                  title="Inverter"
                  subtitle={
                    plan.inverterLabel
                      ? `${plan.inverterLabel} inverter`
                      : `${plan.inverterKw} kW inverter`
                  }
                  value={plan.inverterLabel ?? `${plan.inverterKw} kW`}
                  onChange={focusCustomise}
                />
              </div>

              <div ref={customiseRef}>
                <CustomiseCard
                  selectedPlanId={selectedPlanId}
                  recommendedPlanId={recommendedPlanId}
                  onSelectPlan={setSelectedPlanId}
                  assumptions={assumptions}
                  onImportPriceChange={setImportPriceGbp}
                  onExportPriceChange={setExportPriceGbp}
                  onSelfConsumptionRateChange={setSelfConsumptionRate}
                  metrics={metrics}
                  onFuelBudgetOverrideChange={setUserFuelBudgetOverrideNgn}
                />
              </div>
              <SavingsSection metrics={metrics} region={consultation.region} />
              <OfferCard
                metrics={metrics}
                systemPriceGbp={plan.priceGbp}
                onContactExpert={handleContactExpert}
                submitted={contactSubmitted}
                onBackToPlan={handleBackToPlan}
              />
            </div>

            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <PlanSummaryAside
                  plan={plan}
                  metrics={metrics}
                  systemKw={systemKw}
                  onContactExpert={handleContactExpert}
                  submitted={contactSubmitted}
                  onBackToPlan={handleBackToPlan}
                />
              </div>
            </div>
          </div>

          <MobileStickyCTA
            onContactExpert={handleContactExpert}
            submitted={contactSubmitted}
            onBackToPlan={handleBackToPlan}
          />
        </div>
      </section>

      <Footer variant="dark" />
    </main>
  )
}