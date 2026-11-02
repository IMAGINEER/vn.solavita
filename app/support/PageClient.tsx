'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SupportHero from '@/components/support/Hero'
import SupportCategories from '@/components/support/SupportCategories'
import DownloadSection from '@/components/support/DownloadSection'
import FAQ from '@/components/support/FAQ'
import ContactSupport from '@/components/support/ContactSupport'
import CTA from '@/components/solutions/CTA'

/**
 * /support - User support centre.
 *
 * Composition (per project brief):
 *   Hero / Search → Support Categories → FAQ → Contact Support → CTA
 *
 * The Download block sits between the categories and the FAQ — it is
 * where the "Product → Download" and "Warranty → Download" card CTAs
 * land. See `docs/修改建议.docx` §"Support页面修改" (Oct 2026) and the
 * product PPTX slide 7.
 *
 * Search input is visual-only (no backend) per the project brief.
 * FAQ accordion uses motion/react for height transitions; no external
 * accordion library needed.
 */
export default function SupportPage() {
  return (
    <main className="min-h-screen">
      <Header logoHref="/" />

      <SupportHero />

      <SupportCategories />

      <DownloadSection />

      <FAQ />

      <ContactSupport />

      <CTA
        eyebrow="Need a new system?"
        title={
          <>
            Not a Current Customer Yet?
            <br />
            <span className="text-gradient">Start with a Free Design.</span>
          </>
        }
        description="If you are still researching, our team can put together a free, no-obligation design showing what solar, storage or a full home energy system would look like for your home."
      />

      <Footer />
    </main>
  )
}
