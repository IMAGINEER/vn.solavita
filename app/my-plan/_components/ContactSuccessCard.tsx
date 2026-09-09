'use client'

import { CheckCircle } from 'lucide-react'

interface ContactSuccessCardProps {
  /** Reset the page back to its idle state so the customer can review
   *  their plan numbers again. Optional - mobile sticky variant omits it. */
  onBackToPlan?: () => void
}

/**
 * Inline success state shown in-place of the "Talk to an expert" CTA
 * surfaces (OfferCard / PlanSummaryAside / MobileStickyCTA) after the
 * customer has clicked. Replaces a floating toast so the message
 * doesn't disappear after a few seconds and the customer can re-read
 * what happens next at their own pace.
 *
 * Renders as a content-only block - the parent's outer container
 * (section / aside / fixed bar) handles sizing and background.
 */
export default function ContactSuccessCard({ onBackToPlan }: ContactSuccessCardProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center text-center gap-1"
    >
      <div className="size-12 rounded-full bg-uk-emerald/15 flex items-center justify-center mb-1">
        <CheckCircle
          className="size-7 text-uk-emerald"
          strokeWidth={2}
          aria-hidden
        />
      </div>
      <h3 className="text-lg font-cw-bold text-uk-navy leading-snug">
        Got it — we'll be in touch within 1 business day
      </h3>
      <p className="mt-1 text-sm text-uk-slate leading-relaxed">
        Our team will review your plan and reach out to discuss the next steps.
      </p>
      {onBackToPlan && (
        <button
          type="button"
          onClick={onBackToPlan}
          className="mt-3 text-sm font-cw-bold text-uk-teal-dark hover:underline"
        >
          ← Back to plan
        </button>
      )}
    </div>
  )
}