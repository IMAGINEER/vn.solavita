'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CasesHero from '@/components/cases/Hero'
import CaseStudyGrid from '@/components/cases/CaseStudyGrid'
import CTA from '@/components/solutions/CTA'

/**
 * /cases - Case studies index.
 *
 * Composition (per project brief):
 *   Hero → Case Study Grid → CTA
 *
 * The grid is filterable (client-only state) and the cards themselves
 * are a reusable component (components/cases/CaseStudyCard). Adding a
 * new case study is a single entry in lib/data/uk-cases.ts.
 */
export default function CasesPage() {
  return (
    <main className="min-h-screen">
      <Header logoHref="/" />

      <CasesHero />

      <CaseStudyGrid />

      <CTA
        eyebrow="See it on your home"
        title={
          <>
            Like these homes?
            <br />
            <span className="text-gradient">See what it would look like on yours.</span>
          </>
        }
        description="Send us your address and a recent energy bill. We will prepare a side-by-side design showing what a Solavita system would generate, store and save on your home."
        primaryLabel="Get Free Plan →"
      />

      <Footer />
    </main>
  )
}