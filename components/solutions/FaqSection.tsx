'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'

/**
 * FaqSection — the accordion used at the bottom of the solution
 * collection pages and the microgrid page.
 *
 * Extracted from `CollectionPage.tsx` so more than one page can share
 * it without duplicating the markup. `CollectionPage` imports this
 * component; the microgrid page does too.
 */

export interface FaqItem {
  q: string
  a: string
}

export default function FaqSection({ faqs }: { faqs: FaqItem[] }) {
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
