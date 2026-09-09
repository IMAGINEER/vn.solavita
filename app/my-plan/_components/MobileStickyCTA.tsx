'use client'

import ContactSuccessCard from './ContactSuccessCard'

interface MobileStickyCTAProps {
  onContactExpert: () => void
  /** When true, the CTA swap for an inline success card. */
  submitted?: boolean
  /** Optional "← Back to plan" reset action shown on the success card. */
  onBackToPlan?: () => void
}

/**
 * Fixed bottom CTA bar - only visible below the `lg` breakpoint. Lives
 * inside the parent page section so it doesn't compete with the
 * FloatingButtons (back-to-top / theme toggle) on desktop.
 *
 * After `submitted` flips true, the button disappears and the bar
 * holds the success card instead - the customer keeps a permanent
 * mobile-bottom confirmation without needing to scroll back up.
 */
export default function MobileStickyCTA({
  onContactExpert,
  submitted,
  onBackToPlan,
}: MobileStickyCTAProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-uk-line p-3">
      {submitted ? (
        <ContactSuccessCard onBackToPlan={onBackToPlan} />
      ) : (
        <>
          <button
            type="button"
            onClick={onContactExpert}
            className="btn-gradient text-white px-6 py-4 rounded-full font-cw-bold text-base w-full"
          >
            Talk to an expert
          </button>
          <p className="mt-2 text-center text-xs text-uk-slate">
            Our team will be in touch to discuss your plan.
          </p>
        </>
      )}
    </div>
  )
}