'use client'

import { ImageIcon } from 'lucide-react'
import type { SolutionGalleryImage } from '@/lib/data/solutions'

interface LifestyleGalleryProps {
  images: SolutionGalleryImage[]
}

/**
 * Full-width lifestyle image strip - 3-4 large horizontal images with
 * breathing room. Adds visual richness between the dense spec table /
 * components tabs and the smaller KPI strip. Mirrors how Amazon drops
 * a "From the manufacturer" lifestyle band after the technical details.
 *
 * Layout:
 *   - Desktop: 3-column grid, first image spans 2 cols × 2 rows for a
 *     magazine-style focal + 3 supporting shots.
 *   - Tablet: 2-col grid.
 *   - Mobile: horizontal scroll-snap so the strip stays one row and
 *     tappable without breaking layout.
 */
export default function LifestyleGallery({ images }: LifestyleGalleryProps) {
  if (images.length === 0) return null

  return (
    <section className="relative py-12 lg:py-20 bg-sv-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate">
            <ImageIcon className="w-3.5 h-3.5 text-uk-teal-dark" strokeWidth={2} />
            In real homes
          </span>
          <span className="text-xs text-uk-slate font-cw-regular">
            A closer look at {images.length} installation views
          </span>
        </div>

        {/* Desktop / tablet grid - magazine layout with first image focal */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {images.map((img, idx) => {
            const isFocal = idx === 0
            return (
              <div
                key={img.src}
                className={`relative rounded-2xl overflow-hidden border border-uk-line bg-white shadow-sm ${
                  isFocal ? 'sm:col-span-2 lg:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-[16/10]' : 'aspect-square'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {img.label && (
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-uk-navy/80 text-white text-[10px] font-cw-bold tracking-wider">
                    {img.label}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile - horizontal scroll-snap */}
        <div className="flex sm:hidden gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4">
          {images.map((img) => (
            <div
              key={img.src}
              className="relative flex-shrink-0 w-[80%] aspect-[4/3] rounded-2xl overflow-hidden border border-uk-line bg-white shadow-sm snap-center"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {img.label && (
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-uk-navy/80 text-white text-[10px] font-cw-bold tracking-wider">
                  {img.label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
