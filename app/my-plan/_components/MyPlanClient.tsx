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
  defaultAssumptions,
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

const TOAST_DURATION_MS = 2600
const CONTACT_TOAST =
  "Thanks - our team will be in touch within 1 business day to discuss your plan."

/**
 * Orchestrator for `/my-plan` (valid-id branch).
 *
 * State model:
 *   - `selectedPlanId` is the single piece of user-controlled state.
 *   - `recommendation`, `plan`, `assumptions`, `metrics`, `systemKw` are
 *     all derived via `useMemo`. Switching plans re-renders only the
 *     affected children - never the whole tree.
 *
 * The "Choose your plan" card is a 4-plan selector. Solar panels / battery
 * / inverter are NOT independently adjustable: switching plans swaps the
 * whole configuration as a bundle. ROI assumptions are also derived from
 * the active plan and surfaced read-only in "View calculation assumptions"
 * - there is no UI to mutate them.
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

  // Single derivation point - every metric comes from this useMemo.
  const plan: Plan = useMemo(() => getPlan(selectedPlanId), [selectedPlanId])
  // Assumptions are derived, not state: they always reflect the active
  // plan's defaults. Switching plans replaces the whole bundle, so
  // assumptions follow automatically. No reset path is needed (or
  // possible) - see CustomiseCard's read-only "View calculation
  // assumptions" disclosure.
  const assumptions: RoiAssumptions = useMemo(
    () => defaultAssumptions(plan),
    [plan],
  )
  const metrics: PlanRoi = useMemo(
    () => calculateROI(plan, consultation, assumptions),
    [plan, consultation, assumptions],
  )
  const systemKw = useMemo(
    () => plan.panels * 0.45, // 450 W per panel - same constant as in calc.ts
    [plan],
  )

  const [toast, setToast] = useState<string | null>(null)

  // Toast auto-dismiss.
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => {
      setToast(null)
      toastTimer.current = null
    }, TOAST_DURATION_MS)
  }, [])
  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
  }, [])

  const handleContactExpert = useCallback(() => {
    // Fire-and-forget confirm tracking. The endpoint is idempotent and
    // returns 200 even on invalid tokens, so the user always gets the
    // toast - the only failure mode is logging.
    if (planToken) {
      void fetch('/api/track/my-plan-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planToken }),
      }).catch((err) => {
        console.error('[/my-plan] confirm tracking failed:', err)
      })
    }
    showToast(CONTACT_TOAST)
  }, [planToken, showToast])

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
            Your Solar Plan
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
                  title="Solar panels"
                  subtitle={`${plan.panels} × 450W modules`}
                  value={`${plan.panels} modules`}
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
                  subtitle={`${plan.inverterKw} kW inverter`}
                  value={`${plan.inverterKw} kW`}
                  onChange={focusCustomise}
                />
              </div>

              <div ref={customiseRef}>
                <CustomiseCard
                  selectedPlanId={selectedPlanId}
                  recommendedPlanId={recommendedPlanId}
                  onSelectPlan={setSelectedPlanId}
                  assumptions={assumptions}
                />
              </div>
              <SavingsSection metrics={metrics} />
              <OfferCard
                metrics={metrics}
                systemPriceGbp={plan.priceGbp}
                onContactExpert={handleContactExpert}
              />
            </div>

            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <PlanSummaryAside
                  plan={plan}
                  metrics={metrics}
                  systemKw={systemKw}
                  onContactExpert={handleContactExpert}
                />
              </div>
            </div>
          </div>

          <MobileStickyCTA onContactExpert={handleContactExpert} />
        </div>
      </section>

      <Footer variant="dark" />

      {/* Toast - fixed bottom-right. Uses bg-uk-teal-dark + text-uk-teal-soft
          so both light and dark modes render with contrast (the project's
          light-mode override forces text-white to dark navy on most
          elements, which would be invisible on a dark teal bg). */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-6 bottom-24 lg:bottom-6 z-50 bg-uk-teal-dark text-uk-teal-soft text-sm font-cw-regular px-5 py-3 rounded-xl shadow-lg max-w-xs"
        >
          {toast}
        </div>
      )}
    </main>
  )
}