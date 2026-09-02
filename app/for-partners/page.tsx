'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PartnersHero from '@/components/partners/Hero'
import WhyPartner from '@/components/partners/WhyPartner'
import PartnerTypes from '@/components/partners/PartnerTypes'
import PartnershipProcess from '@/components/partners/PartnershipProcess'
import PartnerCTA from '@/components/partners/PartnerCTA'

/**
 * /for-partners - B2B partner recruitment page.
 *
 * Composition (per project brief):
 *   Hero → Why Partner with Solavita → Partner Types (Installer /
 *   Energy · Business) → Partner Benefits (folded into Why Partner as
 *   a 6-card block) → How Partnership Works (horizontal process
 *   timeline) → Partner CTA / Enquiry Form
 *
 * No new backend - the enquiry form is a visual placeholder per the
 * project brief. Submits to a no-op handler so the page is
 * demonstrably a destination without leaking email addresses.
 */
export default function ForPartnersPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header logoHref="/" />

      <PartnersHero />

      <WhyPartner />

      <PartnerTypes />

      <PartnershipProcess />

      <PartnerCTA />

      <Footer variant="light" />
    </main>
  )
}
