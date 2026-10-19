import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PartnersHero from '@/components/partners/Hero'
import WhyPartner from '@/components/partners/WhyPartner'
import PartnerTypes from '@/components/partners/PartnerTypes'
import PartnershipProcess from '@/components/partners/PartnershipProcess'
import PartnerCTA from '@/components/partners/PartnerCTA'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  partnerProgramJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  title: 'Solar Installer & Business Partnerships | Solavita Nigeria',
  path: '/for-partners',
  description:
    'Explore partnership opportunities with Solavita Nigeria for solar customer referrals, installation services and local energy solutions.',
  ogImage: '/images/hero-partners.webp',
  ogImageAlt:
    'Solavita Nigeria partnerships - installer, referral and community programmes',
})

/**
 * /for-partners - B2B partner recruitment page.
 *
 * Composition (per project brief):
 *   Hero -> Why Partner with Solavita -> Partner Types (Installer /
 *   Referral Partner / Community . Business) -> Partner Benefits (folded
 *   into Why Partner as a 6-card block) -> How Partnership Works
 *   (horizontal process timeline) -> Partner CTA / Enquiry Form
 *
 * Three NG tracks are offered: installer, referral, community. The
 * previous Distributor track has been removed from the NG programme.
 *
 * No new backend - the enquiry form is a visual placeholder per the
 * project brief. Submits to a no-op handler so the page is
 * demonstrably a destination without leaking email addresses.
 */
export default function ForPartnersPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/for-partners',
            name: 'Solar Installer & Business Partnerships | Solavita Nigeria',
            description:
              'Explore partnership opportunities with Solavita Nigeria for solar customer referrals, installation services and local energy solutions in Nigeria.',
          }),
          partnerProgramJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'For Partners', url: '/for-partners' },
          ]),
        ]}
      />
      <main className="min-h-screen bg-[#F7F9FC]">
        <Header logoHref="/" />

        <PartnersHero />

        <WhyPartner />

        <PartnerTypes />

        <PartnershipProcess />

        <PartnerCTA />

        <Footer variant="light" />
      </main>
    </>
  )
}