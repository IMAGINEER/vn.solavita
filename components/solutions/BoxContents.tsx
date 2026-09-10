'use client'

import { Package, Check } from 'lucide-react'

interface BoxContentsProps {
  items: string[]
}

/**
 * Amazon style "What's in the box" - 2-column checklist of every
 * physical + service item the customer receives. Green checkmarks
 * throughout so it reads as a unified inventory. Spits evenly across
 * two columns on `sm`+; single column on mobile.
 */
export default function BoxContents({ items }: BoxContentsProps) {
  if (items.length === 0) return null

  return (
    <section className="relative py-12 lg:py-16 bg-sv-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate">
            <Package className="w-3.5 h-3.5 text-uk-teal-dark" strokeWidth={2} />
            What&rsquo;s in the box
          </span>
        </div>

        <div className="rounded-2xl border border-uk-line bg-white p-6 lg:p-8 shadow-sm">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-uk-navy font-cw-regular leading-relaxed"
              >
                <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-uk-emerald/15 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-uk-emerald" strokeWidth={3.5} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
