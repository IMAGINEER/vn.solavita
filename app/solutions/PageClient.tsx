'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SolutionsHero from '@/components/solutions/Hero'
import ProductSelector from '@/components/ProductSelector'
import SolutionDetailSection from '@/components/solutions/SolutionDetail'
import ProductDetails from '@/components/ProductDetails'
import WhySolavita from '@/components/solutions/WhySolavita'
import DeliveryTimeline from '@/components/DeliveryTimeline'
import CTA from '@/components/solutions/CTA'
import { openFormModal } from '@/lib/form-modal'
import { solutionDetails } from '@/lib/data/solutions'

/**
 * /solutions - Solutions overview page.
 *
 * Composition (per project brief):
 *   Hero → Product range (matches homepage #products grid) →
 *   4 detail blocks → Components in detail → Why Solavita →
 *   Delivery Timeline → CTA
 *
 * The second screen reuses the homepage `<ProductSelector>` so the
 * card layout, image and pricing stays in sync with `/`. Each
 * product card's "Get Free Plan →" button opens the global form
 * modal - the per-product detail sections below remain reachable
 * via the page navigation / scroll instead of an anchor jump.
 */

export default function SolutionsPage() {
  // Alternate left/right image placement and bg surfaces down the four
  // detail sections so the page reads as one flowing series rather than
  // four identical blocks.
  const surfaces: Array<'white' | 'light'> = ['light', 'white', 'light', 'white']

  return (
    <main className="min-h-screen">
      <Header logoHref="/" />

      <SolutionsHero />

      <ProductSelector onOpenForm={openFormModal} />

      {solutionDetails.map((d, i) => (
        <SolutionDetailSection
          key={d.id}
          detail={d}
          reverse={i % 2 === 1}
          surface={surfaces[i]}
        />
      ))}

      <ProductDetails />

      <WhySolavita />

      <DeliveryTimeline />

      <CTA
        eyebrow="Free design · No obligation"
        title={
          <>
            Not sure which solution fits?
            <br />
            <span className="text-gradient">Get a free design & quote.</span>
          </>
        }
        description="Tell us about your home. Our UK engineers will design the right system - solar, battery, HEMS or whole-home - and send you a clear, no-obligation quote."
        secondaryLabel="Talk to our team"
        secondaryHref="mailto:uk@solavita.com"
      />

      <Footer />
    </main>
  )
}