'use client'

import { Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import ProductHero from '@/components/solutions/ProductHero'
import SpecTable from '@/components/solutions/SpecTable'
import LifestyleGallery from '@/components/solutions/LifestyleGallery'
import KPIStrip from '@/components/solutions/KPIStrip'
import BoxContents from '@/components/solutions/BoxContents'
import TierFAQ from '@/components/solutions/TierFAQ'
import ProductDetails from '@/components/ProductDetails'
import DeliveryTimeline from '@/components/DeliveryTimeline'
import TrustBar from '@/components/TrustBar'
import WhySolavita from '@/components/solutions/WhySolavita'
import CTA from '@/components/solutions/CTA'
import type { SolutionDetail } from '@/lib/data/solutions'

interface SolutionDetailPageProps {
  detail: SolutionDetail
}

/**
 * /solutions/[slug]/ - Amazon-style tier detail page composition.
 *
 * Layout (top → bottom):
 *   Header → compact breadcrumb → ProductHero (gallery + buy box) →
 *   highlights icon row → "From the manufacturer" intro → SpecTable →
 *   Components tabs (ProductDetails) → LifestyleGallery → KPIStrip →
 *   BoxContents → DeliveryTimeline → TrustBar → WhySolavita →
 *   TierFAQ → bottom CTA → Footer.
 *
 * Heavy reuse: <ProductDetails>, <DeliveryTimeline>, <TrustBar>,
 * <WhySolavita>, <CTA> are existing components (no edits); this file
 * only composes them with the new tier-specific pieces.
 *
 * Footer auto-mounts the universal FormModal so any "Get Free Plan →"
 * call from BuyBox lands in the modal without page-level wiring.
 */
export default function SolutionDetailPage({
  detail,
}: SolutionDetailPageProps) {
  return (
    <main className="min-h-screen bg-sv-light">
      <Header logoHref="/" />

      {/* Compact breadcrumb - matches CaseDetailClient's inner page header. */}
      <section className="pt-24 pb-4 lg:pt-28 lg:pb-6 bg-sv-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Solutions', href: '/solutions/' },
              { label: detail.title },
            ]}
          />
        </div>
      </section>

      {/* Hero + buy box */}
      <ProductHero detail={detail} />

      {/* Highlights - "About this item" icon row */}
      <HighlightsRow highlights={detail.highlights} />

      {/* "From the manufacturer" - long-form intro */}
      <ManufacturerIntro intro={detail.intro} />

      {/* Technical Details - spec table */}
      <SpecTable rows={detail.specTable} />

      {/* Components in detail - 4 tabs (PV Modules / Inverter / Battery / Mounting) */}
      <ProductDetails />

      {/* Lifestyle gallery - 3-4 full-width images */}
      <LifestyleGallery images={detail.lifestyleGallery} />

      {/* KPI strip - savings / payback / warranty / install */}
      <KPIStrip kpis={detail.kpis} />

      {/* What's in the box - 2-col checklist */}
      <BoxContents items={detail.boxContents} />

      {/* Installation timeline - reused */}
      <DeliveryTimeline />

      {/* Trust strip - MCS / NICEIC / RECC / SKYWORTH - reused */}
      <TrustBar />

      {/* Why Solavita - 4-card grid - reused */}
      <WhySolavita />

      {/* Per-tier FAQ - tier-specific accordion */}
      <TierFAQ items={detail.faqs} tierTitle={detail.title} />

      {/* Bottom CTA - opens form modal pre-filled with interestedProduct */}
      <CTA
        eyebrow="Free design · No obligation"
        title={
          <>
            Ready for {detail.title} on{' '}
            <span className="text-gradient">your home?</span>
          </>
        }
        description={`Tell us about your home. Our UK engineers will design the right ${detail.eyebrow.toLowerCase()} system - matched to your roof, your usage and your tariff - and send you a clear, no-obligation quote.`}
        primaryLabel="Get Free Plan →"
        secondaryLabel="Talk to our team"
        secondaryHref={`mailto:uk@solavita.com?subject=${encodeURIComponent(`Enquiry about ${detail.title}`)}`}
      />

      <Footer />
    </main>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Inline section blocks (Highlights + ManufacturerIntro) - small enough
   to keep inline; if they grow beyond ~50 LOC each, promote to their
   own component file.
   ──────────────────────────────────────────────────────────────────────── */

/**
 * "About this item" - 4 short bullets laid out as an icon-row of cards.
 * Mirrors the Solavita solution-card highlight pattern but in a single
 * horizontal band.
 */
function HighlightsRow({ highlights }: { highlights: string[] }) {
  if (highlights.length === 0) return null

  return (
    <section className="relative py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {highlights.map((h, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-uk-line bg-white p-5 lg:p-6 flex items-start gap-3 hover:border-uk-teal/40 transition-colors"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-uk-emerald/15 flex items-center justify-center">
                <Check
                  className="w-4 h-4 text-uk-emerald"
                  strokeWidth={3}
                />
              </span>
              <span className="text-sm lg:text-base font-cw-regular text-uk-navy leading-snug">
                {h}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * "From the manufacturer" - the tier's long-form intro paragraph as a
 * single column with a comfortable max-width. Mirrors Amazon's
 * manufacturer copy block.
 */
function ManufacturerIntro({ intro }: { intro: string }) {
  return (
    <section className="relative py-12 lg:py-16 bg-sv-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-3xl font-cw-bold text-uk-navy leading-tight">
          From the manufacturer
        </h2>
        <p className="mt-5 text-base lg:text-lg text-uk-slate font-cw-regular leading-relaxed">
          {intro}
        </p>
      </div>
    </section>
  )
}
