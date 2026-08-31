'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Minus } from 'lucide-react'
import {
  faqItems,
  supportCategories,
  type FaqItem,
  type SupportCategoryId,
} from '@/lib/data/support'

gsap.registerPlugin(ScrollTrigger)

interface AccordionRowProps {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
}

/**
 * One accordion row — motion-driven height/opacity transition. The
 * button is the full row so the click target is generous; chevron
 * rotates for affordance.
 */
function AccordionRow({ item, isOpen, onToggle }: AccordionRowProps) {
  return (
    <div
      className={`rounded-2xl border bg-white transition-colors ${
        isOpen ? 'border-uk-teal/50 shadow-sm' : 'border-uk-line'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
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
          {item.question}
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
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * FAQ accordion grouped by support category. All categories are shown
 * by default — the section is the single source of truth for support
 * questions. (Searching / filtering is out of scope for this iteration.)
 */
export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-row',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Group items by category, but only render categories that actually
  // have items (defensive — keeps the section usable if a category is
  // emptied in the data file).
  const groups = supportCategories
    .map((cat) => ({
      category: cat,
      items: faqItems.filter((f) => f.category === cat.id),
    }))
    .filter((g) => g.items.length > 0)

  const rowKey = (catId: SupportCategoryId, idx: number) =>
    `${catId}-${idx}`

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative py-16 md:py-24 bg-sv-light"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Frequently asked{' '}
            <span className="text-gradient">questions</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Quick answers to the things we get asked most. Can&rsquo;t
            find what you need? Contact our team below.
          </p>
        </div>

        <div className="space-y-10">
          {groups.map(({ category, items }) => (
            <div key={category.id} id={`faq-${category.id}`}>
              <h3 className="text-xl font-cw-bold text-uk-navy mb-4">
                {category.title}
              </h3>
              <div className="space-y-3">
                {items.map((item, idx) => {
                  const id = rowKey(item.category, idx)
                  return (
                    <div className="faq-row" key={id}>
                      <AccordionRow
                        item={item}
                        isOpen={openId === id}
                        onToggle={() =>
                          setOpenId(openId === id ? null : id)
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
