'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import { cn } from '@/lib/utils'

/**
 * FaqSection — the accordion used at the bottom of the solution
 * collection pages.
 *
 * Extracted from `CollectionPage.tsx` so more than one page can share
 * it without duplicating the markup. `CollectionPage` imports this
 * component.
 */

export interface FaqItem {
  q: string
  a: string
}

export default function FaqSection({
  faqs,
  eyebrow = 'FAQ',
  title,
  className,
}: {
  faqs: FaqItem[]
  /** Eyebrow above the heading. Default "FAQ". */
  eyebrow?: string
  /** Heading. Defaults to the original English wording. */
  title?: React.ReactNode
  /** Section background override — the default is white, but a page
   *  that needs the FAQ band to read as grey passes `bg-sv-light`. */
  className?: string
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <section
      id="faq"
      className={cn('relative py-16 md:py-20 bg-white', className)}
    >
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-8">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            {title ?? (
              <>
                Frequently Asked <span className="text-gradient">Questions</span>
              </>
            )}
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
