'use client'

import { MapPin } from 'lucide-react'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import type { NgCase } from '@/lib/data/ng-cases'

/**
 * Case card for the /cases index and the homepage case strip.
 *
 * Format per `docs/修改建议(2).docx` §"首页显示的案例替换" (the design
 * mock-up in the docx):
 *
 *     ┌─────────────────────────────┐
 *     │  [image]                    │
 *     │  Residential                │  ← type label, teal, sentence case
 *     │  21.59kW                    │  ← capacity, bold navy
 *     │  📍 Malaysia, Balakong      │  ← location, pin icon
 *     └─────────────────────────────┘
 *
 * The location renders as "country, place" — that is the order the
 * docx uses on both the homepage and the /cases index.
 *
 * Photos come from `docs/创维光伏海外案例2.0(1).pptx` — extracted from
 * the slide that documents each case and re-encoded to WebP under
 * `/public/images/cases/`. A case with no `imagePath` falls back to the
 * neutral `ImagePlaceholder`.
 */
export default function NgCaseCard({ c }: { c: NgCase }) {
  return (
    <div className="group case-card rounded-2xl border border-uk-line bg-white overflow-hidden hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col">
      <div className="aspect-[4/3] overflow-hidden bg-uk-line/30">
        {c.imagePath ? (
          <img
            src={c.imagePath}
            alt={`${c.capacity} solar system in ${c.place}, ${c.country}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder
            description={c.imageDescription}
            className="!rounded-none !border-0"
          />
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="text-lg font-cw-bold text-uk-teal leading-tight">
          {c.typeLabel}
        </div>
        <div className="mt-1 text-2xl font-cw-bold text-uk-navy leading-tight">
          {c.capacity}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-uk-slate font-cw-regular">
          <MapPin className="w-4 h-4 flex-shrink-0 text-uk-slate/70" strokeWidth={1.8} />
          <span>
            {c.country}, {c.place}
          </span>
        </div>
        <p className="mt-3 text-sm text-uk-slate font-cw-regular leading-relaxed line-clamp-2">
          {c.description}
        </p>
      </div>
    </div>
  )
}
