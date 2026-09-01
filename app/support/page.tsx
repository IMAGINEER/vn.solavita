'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SupportHero from '@/components/support/Hero'
import SupportCategories from '@/components/support/SupportCategories'
import FAQ from '@/components/support/FAQ'
import ContactSupport from '@/components/support/ContactSupport'
import CTA from '@/components/solutions/CTA'

/**
 * /support - User support centre.
 *
 * Composition (per project brief):
 *   Hero / Search → Support Categories → FAQ → Contact Support → CTA
 *
 * Search input is visual-only (no backend) per the project brief.
 * FAQ accordion uses motion/react for height transitions; no external
 * accordion library needed.
 */
export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header logoHref="/" />

      <SupportHero />

      <SupportCategories />

      <FAQ />

      <ContactSupport />

      <CTA
        eyebrow="Need a new system?"
        title={
          <>
            Not a current customer yet?
            <br />
            <span className="text-gradient">Start with a free design.</span>
          </>
        }
        description="If you are still researching, our team can put together a free, no-obligation design showing what solar, storage or a full home energy system would look like for your home."
      />

      <Footer variant="light" />
    </main>
  )
}
