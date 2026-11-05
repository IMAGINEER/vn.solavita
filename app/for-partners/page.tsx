import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PartnersHero from '@/components/partners/Hero'
import GoldPartnerTeaser from '@/components/partners/GoldPartnerTeaser'
import WhyPartner from '@/components/partners/WhyPartner'
import PartnerEconomics from '@/components/partners/PartnerEconomics'
import PartnerTypes from '@/components/partners/PartnerTypes'
import PartnershipProcess from '@/components/partners/PartnershipProcess'
import PartnerTraining from '@/components/partners/PartnerTraining'
import PartnerCTA from '@/components/partners/PartnerCTA'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  partnerProgramJsonLd,
} from '@/lib/seo/jsonld'

export const metadata = buildPageMetadata({
  // The root layout's `title.template` already appends
  // "| Solavita Việt Nam" — passing it here too produced a doubled
  // suffix ("… | Solavita Việt Nam | Solavita Việt Nam").
  title: 'Hợp tác lắp đặt & kinh doanh điện mặt trời',
  path: '/for-partners',
  description:
    'Trở thành Đại lý kinh doanh, Đối tác lắp đặt hoặc Đối tác kinh doanh của Solavita: hoa hồng theo mỗi watt, không vốn đầu tư, không tồn kho. Đăng ký Chương trình Đối tác Vàng ngay.',
  ogImage: '/images/og-partners.jpg',
  ogImageAlt:
    'Hợp tác cùng Solavita Việt Nam - chương trình đối tác giới thiệu khách hàng, đối tác lắp đặt và đại lý kinh doanh',
})

/**
 * /for-partners - B2B partner recruitment page.
 *
 * Composition (per the VN partner recruitment brochure
 * `Vietnam Partner Recruitment Brochure_VN 20260911.pdf`):
 *
 *   Hero (offer + the four commercial barriers)
 *     -> Gold Partner teaser (pointer to the standalone
 *        "Chương trình Đối tác Vàng" campaign page)
 *     -> Why Partner with Solavita (group scale + one-stop model)
 *     -> Partner Economics (commission per watt, per-barch tiers)
 *     -> Partner Types (Đại lý kinh doanh / Đối tác lắp đặt /
 *        Đối tác kinh doanh)
 *     -> Partnership Process (4-step cooperation model + the four
 *        "bạn không cần" statements)
 *     -> Partner Training (3 training programmes + support contacts)
 *     -> Partner CTA / general enquiry form
 *
 * The "Chương trình Đối tác Vàng" campaign (standee 20/09/2026) was
 * split out of this page into `/for-partners/gold-partner/` on
 * 2026-11-05 — it is a capped intake with its own economics and its
 * own sign-up form, so it needs its own URL (the one printed on the
 * roll-up standee and behind the QR code). This page keeps a teaser
 * pointing at it.
 *
 * Three VN tracks are offered: Đại lý kinh doanh, Đối tác lắp đặt,
 * Đối tác kinh doanh.
 *
 * Both enquiry paths post to /api/partner → `vn_partner_leads`:
 *   - the general form sends `partnerTrack` only
 *   - the Đối tác Vàng form sends `partnerTrack: 'lead-partner'` plus
 *     `campaign: 'gold-partner'`, which tags the stored message so
 *     campaign applicants can be filtered out of the generic enquiries.
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
              'Trở thành Đại lý kinh doanh, Đối tác lắp đặt hoặc Đối tác kinh doanh của Solavita Việt Nam — hoa hồng theo mỗi watt, không vốn đầu tư, không tồn kho.',
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

        <GoldPartnerTeaser />

        <WhyPartner />

        <PartnerEconomics />

        <PartnerTypes />

        <PartnershipProcess />

        <PartnerTraining />

        <PartnerCTA />

        <Footer variant="light" />
      </main>
    </>
  )
}
