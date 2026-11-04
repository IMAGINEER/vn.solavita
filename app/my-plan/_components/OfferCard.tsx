'use client'

import ContactSuccessCard from './ContactSuccessCard'
import type { PlanRoi } from '../_lib/calc'
import { formatNGN, formatDateEnGB } from '../_lib/format'

interface OfferCardProps {
  metrics: PlanRoi
  /** The plan's full price, used to display "System price". */
  systemPriceGbp: number
  onContactExpert: () => void
  /** When true, the offer/CTA swap for an inline success card. */
  submitted?: boolean
  /** Optional "← Back to plan" reset action shown on the success card. */
  onBackToPlan?: () => void
}

/**
 * 3-col offer summary + "Talk to an expert" CTA. Pricing pulls from the
 * current plan + ROI engine, so switching plans shifts every figure
 * without a page refresh.
 *
 * "Your offer" is visually emphasised (highlighted background + larger
 * value) - that's the figure the customer will actually pay, so it sits
 * at the centre of attention.
 *
 * After `submitted` flips true, the entire body is replaced by
 * `<ContactSuccessCard />` - the container's background / border stay
 * so the section still looks like part of the layout.
 */
export default function OfferCard({
  metrics,
  systemPriceGbp,
  onContactExpert,
  submitted,
  onBackToPlan,
}: OfferCardProps) {
  return (
    <section className="rounded-2xl p-6 bg-uk-teal-soft/40 border border-uk-teal/30 flex flex-col lg:flex-row gap-6 lg:items-end lg:justify-between">
      {submitted ? (
        <ContactSuccessCard onBackToPlan={onBackToPlan} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            <div>
              <div className="text-xs font-cw-regular text-uk-slate uppercase tracking-wider">
                Giá hệ thống
              </div>
              <div className="mt-1 text-2xl md:text-3xl font-cw-bold text-uk-navy tabular-nums">
                {formatNGN(systemPriceGbp)}
              </div>
            </div>
            {/* "Your offer" - emphasised. Highlighted background + larger
                value + emerald accent so the customer's actual price is the
                focal point of the row. */}
            <div className="rounded-xl bg-white border border-uk-teal/40 px-4 py-3 -my-1 shadow-sm">
              <div className="text-xs font-cw-bold text-uk-emerald uppercase tracking-wider">
                Báo giá của bạn
              </div>
              <div className="mt-1 text-3xl md:text-4xl font-cw-bold text-uk-emerald tabular-nums">
                {formatNGN(metrics.offerPriceGbp)}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs font-cw-regular text-uk-slate uppercase tracking-wider">
                Báo giá có hiệu lực đến
              </div>
              <div className="mt-1 text-base md:text-lg font-cw-bold text-uk-navy">
                {formatDateEnGB(metrics.offerValidUntil)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onContactExpert}
            className="btn-gradient text-white px-8 py-4 rounded-full font-cw-bold text-base w-full lg:w-auto whitespace-nowrap"
          >
            Liên hệ chuyên gia
          </button>
        </>
      )}
    </section>
  )
}