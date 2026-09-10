'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { SolutionGalleryImage } from '@/lib/data/solutions'

interface ProductGalleryProps {
  images: SolutionGalleryImage[]
  /** Tier title - used for the alt fallback on the main image. */
  title: string
  /** When true, shows the emerald POPULAR badge in the gallery's top-right. */
  popular?: boolean
}

/**
 * Amazon-style image gallery: one large main image with a horizontal
 * thumbnail strip below it. Click a thumb to swap the main image; left /
 * right chevrons do the same and wrap around. Main image is the focal
 * point - the strip gives Amazon's "5 views" feel without shrinking the
 * hero.
 *
 * Mobile (`< sm`): the thumb strip scrolls horizontally with snap so the
 * row of thumbs can extend past the column edge without breaking layout.
 *
 * The active thumb gets a 2px teal border + ring; inactive thumbs are
 * neutral. Main image swaps instantly via `key` - no carousel autoplay,
 * matching Amazon's "browse on demand" feel.
 */
export default function ProductGallery({
  images,
  title,
  popular = false,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = images.length
  const active = images[activeIndex] ?? images[0]

  const goPrev = () => setActiveIndex((i) => (i - 1 + total) % total)
  const goNext = () => setActiveIndex((i) => (i + 1) % total)

  return (
    <div className="w-full">
      {/* Main image - square aspect so the panel reads as a product card */}
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-uk-line bg-white shadow-sm group">
        {popular && (
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-uk-emerald text-white text-xs font-cw-bold tracking-wider">
            POPULAR
          </div>
        )}

        <img
          key={active.src}
          src={active.src}
          alt={active.alt ?? title}
          loading="eager"
          className="w-full h-full object-contain p-4 transition-opacity duration-300"
        />

        {/* Prev / Next chevrons - only visible on hover, mirror Amazon */}
        <button
          type="button"
          aria-label="Previous image"
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm border border-uk-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <ChevronLeft className="w-4 h-4 text-uk-navy" strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm border border-uk-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <ChevronRight className="w-4 h-4 text-uk-navy" strokeWidth={2} />
        </button>

        {/* Image counter - bottom-right, Amazon pattern */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-uk-navy/80 text-white text-[10px] font-cw-bold tracking-wider">
          {activeIndex + 1} / {total}
        </div>
      </div>

      {/* Thumbnail strip - horizontal row below main image.
          Mobile: scroll-snap-x so 5+ thumbs stay tappable without wrapping. */}
      <div
        className="mt-4 flex gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory pb-1 -mx-1 px-1"
        role="tablist"
        aria-label="Gallery views"
      >
        {images.map((img, idx) => {
          const isActive = idx === activeIndex
          return (
            <button
              key={img.src}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={img.label ?? `View ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 snap-start transition-all ${
                isActive
                  ? 'border-uk-teal ring-2 ring-uk-teal/30'
                  : 'border-uk-line hover:border-uk-teal/50'
              }`}
            >
              <img
                src={img.src}
                alt={img.alt ?? ''}
                loading="lazy"
                className="w-full h-full object-contain p-1"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
