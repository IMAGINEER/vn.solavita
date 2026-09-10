'use client'

import ProductGallery from './ProductGallery'
import BuyBox from './BuyBox'
import type { SolutionDetail } from '@/lib/data/solutions'

interface ProductHeroProps {
  detail: SolutionDetail
}

/**
 * Two-column hero for /solutions/[slug]/ detail pages - the Amazon
 * signature of "image gallery left, buy box right". Stacks vertically
 * on mobile so the gallery gets the first paint.
 *
 * Both children are fully data-driven off `detail`:
 *   - ProductGallery reads `detail.galleryImages` and `detail.popular`.
 *   - BuyBox reads `detail.headlineStats`, `detail.bullets`, `detail.addons`,
 *     `detail.metric`, `detail.installationTime`, `detail.warranty`.
 */
export default function ProductHero({ detail }: ProductHeroProps) {
  return (
    <section className="relative bg-sv-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] gap-8 lg:gap-12 items-start">
          {/* Left column - gallery */}
          <div>
            <ProductGallery
              images={detail.galleryImages}
              title={detail.title}
              popular={detail.popular}
            />
          </div>

          {/* Right column - buy box */}
          <div>
            <BuyBox detail={detail} />
          </div>
        </div>
      </div>
    </section>
  )
}
