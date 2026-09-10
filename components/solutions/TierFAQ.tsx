'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Minus, HelpCircle } from 'lucide-react'

export interface TierFaqItem {
  q: string
  a: string
}

interface TierFAQProps {
  items: TierFaqItem[]
  /** Tier title used in the section heading. */
  tierTitle: string
}

/**
 * Per-tier FAQ accordion used on /solutions/[slug]/ detail pages.
 *
 * Reuses the visual rhythm of `components/support/FAQ.tsx` (rounded
 * accordion rows, Plus/Minus toggle, motion height transition) but
 * takes items as a prop rather than reading from a shared data file -
 * every tier has its own question set.
 *
 * Single section (no category grouping) since the per-tier FAQ is
 * focused on the product rather than Solavita-wide support topics.
 */
export default function TierFAQ({ items, tierTitle }: TierFAQProps) {
  const [openId, setOpenId] = useState<number | null>(0)

  if (items.length === 0) return null

  return (
    <section
      id="faq"
      className="relative py-16 md:py-24 bg-sv-light"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Common questions
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            About <span className="text-gradient">{tierTitle}</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Quick answers to the things we get asked most about {tierTitle}.
            Can&rsquo;t find what you need? Use the form to get in touch.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const isOpen = openId === idx
            return (
              <div
                key={idx}
                className={`rounded-2xl border bg-white transition-colors ${
                  isOpen
                    ? 'border-uk-teal/50 shadow-sm'
                    : 'border-uk-line'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 text-left p-5 lg:p-6"
                >
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isOpen
                        ? 'bg-uk-teal text-white'
                        : 'bg-uk-teal-soft text-uk-teal-dark'
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4" strokeWidth={2.5} />
                    ) : (
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                    )}
                  </span>
                  <span className="flex-1 text-base lg:text-lg font-cw-bold text-uk-navy">
                    {item.q}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 lg:px-6 pb-5 lg:pb-6 pl-[4.25rem] text-sm lg:text-base text-uk-slate font-cw-regular leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Footer hint - if user doesn't find their answer */}
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-uk-slate font-cw-regular">
          <HelpCircle className="w-4 h-4 text-uk-teal-dark" strokeWidth={1.8} />
          <span>Still have questions? We&rsquo;re happy to help.</span>
        </div>
      </div>
    </section>
  )
}
