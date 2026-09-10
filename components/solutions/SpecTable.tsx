'use client'

import { Zap } from 'lucide-react'
import type { SolutionSpecRow } from '@/lib/data/solutions'

interface SpecTableProps {
  rows: SolutionSpecRow[]
}

/**
 * Amazon-style "Technical Details" table - the 2-col label/value list
 * with alternating row backgrounds, exactly the rhythm of Amazon's
 * product page specs block. Section is rendered with a consistent
 * "Component specs" eyebrow pill so it reads as one family with the
 * neighbouring sections on /solutions/[slug]/.
 *
 * Reuses the zebra pattern from `<ProductDetails>` (`#0D1E35` + glass
 * tints, mirrored here on `bg-sv-light`) so the page stays in the UK
 * light palette.
 */
export default function SpecTable({ rows }: SpecTableProps) {
  return (
    <section className="relative py-12 lg:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-uk-line bg-sv-light text-xs font-cw-regular text-uk-slate">
            <Zap className="w-3.5 h-3.5 text-uk-teal-dark" strokeWidth={2} />
            Technical Details
          </span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-uk-line bg-white shadow-sm">
          {rows.map((row, idx) => (
            <div
              key={row.label}
              className={`grid grid-cols-1 sm:grid-cols-[minmax(180px,38%)_1fr] gap-2 sm:gap-6 px-5 py-4 ${
                idx % 2 === 0 ? 'bg-white' : 'bg-sv-light/60'
              } ${idx > 0 ? 'border-t border-uk-line/60' : ''}`}
            >
              <div className="text-xs sm:text-sm font-cw-bold uppercase tracking-wider text-uk-slate">
                {row.label}
              </div>
              <div className="text-sm sm:text-base font-cw-regular text-uk-navy leading-relaxed">
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
