'use client'

import { MapPin } from 'lucide-react'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import TbdText from '@/components/ui/tbd-text'
import type { VnCase } from '@/lib/data/vn-cases'

/**
 * Case card for the /cases index and the homepage case strip.
 *
 *     ┌─────────────────────────────┐
 *     │  [image]                    │
 *     │  Hộ gia đình                │  ← type label, teal, sentence case
 *     │  21.59kW                    │  ← capacity, bold navy
 *     │  📍 Malaysia, Balakong      │  ← location, pin icon
 *     └─────────────────────────────┘
 *
 * The location renders as "country, place" on both the homepage and the
 * /cases index.
 *
 * Photos come from the Skyworth PV case decks — extracted from the
 * slide that documents each case and re-encoded to WebP under
 * `/public/images/cases/`. A case with no `imagePath` falls back to the
 * neutral `ImagePlaceholder`.
 *
 * A case whose capacity is still to be read off the deck shows its
 * project name as the headline and a visible TBD for the capacity.
 */
export default function VnCaseCard({ c }: { c: VnCase }) {
  return (
    <div className="group case-card rounded-2xl border border-uk-line bg-white overflow-hidden hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col">
      <div className="aspect-[4/3] overflow-hidden bg-uk-line/30">
        {c.imagePath ? (
          <img
            src={c.imagePath}
            alt={`Hệ thống điện mặt trời ${
              c.name || c.capacity
            } tại ${c.place}, ${c.country}`}
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
        {/* The headline is the capacity — or, while the capacity is
            still to be read from the case deck, the project name with
            the capacity shown as a visible TBD underneath. */}
        {c.name && (
          <div
            className={`font-cw-bold text-uk-navy leading-tight ${
              c.capacity ? 'mt-1 text-base' : 'mt-1 text-xl'
            }`}
          >
            {c.name}
          </div>
        )}
        {c.capacity ? (
          <div className="mt-1 text-2xl font-cw-bold text-uk-navy leading-tight">
            {c.capacity}
          </div>
        ) : (
          <p className="mt-1.5 text-xs leading-relaxed">
            <TbdText inline text="công suất (chờ đối chiếu hồ sơ case)" />
          </p>
        )}
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