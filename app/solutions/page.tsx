'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SolutionsHero from '@/components/solutions/Hero'
import ProductSelector from '@/components/ProductSelector'
import SolutionDetailSection from '@/components/solutions/SolutionDetail'
import WhySolavita from '@/components/solutions/WhySolavita'
import CTA from '@/components/solutions/CTA'
import {
  PRODUCT_TO_SOLUTION_ANCHOR,
  solutionDetails,
} from '@/lib/data/solutions'

/**
 * /solutions — Solutions overview page.
 *
 * Composition (per project brief):
 *   Hero → Product range (matches homepage #products grid) →
 *   4 detail blocks → Why Solavita → CTA
 *
 * The second screen reuses the homepage `<ProductSelector>` so the
 * card layout, image, pricing and Plan Details behaviour stays in
 * sync with `/`. Each Plan Details link scrolls to the matching
 * detail section below via the per-product mapping in
 * `PRODUCT_TO_SOLUTION_ANCHOR`.
 */

export default function SolutionsPage() {
  // Alternate left/right image placement and bg surfaces down the four
  // detail sections so the page reads as one flowing series rather than
  // four identical blocks.
  const surfaces: Array<'white' | 'light'> = ['light', 'white', 'light', 'white']

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header logoHref="/" />

      <SolutionsHero />

      <ProductSelector
        planDetailsAnchorFor={(id) => `#${PRODUCT_TO_SOLUTION_ANCHOR[id] ?? id}`}
      />

      {solutionDetails.map((d, i) => (
        <SolutionDetailSection
          key={d.id}
          detail={d}
          reverse={i % 2 === 1}
          surface={surfaces[i]}
        />
      ))}

      <WhySolavita />

      <CTA
        eyebrow="Free design · No obligation"
        title={
          <>
            Not sure which solution fits?
            <br />
            <span className="text-gradient">Get a free design & quote.</span>
          </>
        }
        description="Tell us about your home. Our UK engineers will design the right system — solar, battery, HEMS or whole-home — and send you a clear, no-obligation quote."
        secondaryLabel="Talk to our team"
        secondaryHref="mailto:uk@solavita.com"
      />

      <Footer variant="light" />
    </main>
  )
}
