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
  title: 'Hợp tác lắp đặt & kinh doanh điện mặt trời | Solavita Việt Nam',
  path: '/for-partners',
  description:
    'Khám phá cơ hội hợp tác cùng Solavita Việt Nam: giới thiệu khách hàng điện mặt trời, dịch vụ lắp đặt và giải pháp năng lượng tại địa phương.',
  ogImage: '/images/og-partners.jpg',
  ogImageAlt:
    'Hợp tác cùng Solavita Việt Nam - chương trình đơn vị lắp đặt, giới thiệu khách hàng và đối tác dịch vụ',
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
 * Three VN tracks are offered: Đối tác dịch vụ chính, Đơn vị lắp đặt
 * được chứng nhận, Đối tác giới thiệu khách hàng.
 *
 * The enquiry form posts to /api/partner → `vn_partner_leads`.
 */
export default function ForPartnersPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/for-partners',
            name: 'Hợp tác lắp đặt & kinh doanh điện mặt trời | Solavita Việt Nam',
            description:
              'Khám phá cơ hội hợp tác cùng Solavita Việt Nam: giới thiệu khách hàng điện mặt trời, dịch vụ lắp đặt và giải pháp năng lượng tại Việt Nam.',
          }),
          partnerProgramJsonLd(),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Dành cho đối tác', url: '/for-partners' },
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