import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoldMedalPartner from '@/components/partners/GoldMedalPartner'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  goldPartnerProgramJsonLd,
} from '@/lib/seo/jsonld'

export const metadata: Metadata = buildPageMetadata({
  // The root layout's `title.template` already appends
  // "| Solavita Việt Nam" — pages pass the page-specific title only.
  title: 'Chương trình Đối tác Vàng — Liên kết giới thiệu khách hàng',
  path: '/for-partners/gold-partner',
  description:
    'Đợt tuyển chọn 50 đối tác của Solavita Việt Nam: hoa hồng 7,6 triệu đồng mỗi đơn hàng, tăng 25% từ đơn thứ 3, không vốn đầu tư, không tồn kho. Đăng ký ngay.',
  ogImage: '/images/og-partners.jpg',
  ogImageAlt:
    'Chương trình Đối tác Vàng Solavita Việt Nam — tuyển chọn đối tác liên kết giới thiệu khách hàng',
})

/**
 * /for-partners/gold-partner — the standalone "Chương trình Đối tác
 * Vàng" campaign page.
 *
 * Split out of /for-partners (2026-11-05): the campaign is a capped,
 * time-boxed intake with its own economics, its own merchandising and
 * its own sign-up form, so it needs its own URL — the one printed on
 * the roll-up standee and used in the QR code — rather than a section
 * inside the general partner page.
 *
 * The page content lives in `components/partners/GoldMedalPartner.tsx`
 * (transcribed from `docs/越南金牌商务合伙人 展架80x180cm 20260920(2).pdf`).
 * The sign-up form posts to /api/partner with
 * `partnerTrack: 'lead-partner'` + `campaign: 'gold-partner'` → the
 * `vn_partner_leads` table.
 */
export default async function GoldPartnerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  // A campaign URL that carries tracking parameters (?lp=fb, ?utm_…)
  // arrives straight from an advert. The visitor never came from the
  // partner page, so the trail is noise — the breadcrumb is dropped.
  const showBreadcrumb = Object.keys(params).length === 0

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: '/for-partners/gold-partner',
            name: 'Chương trình Đối tác Vàng — Liên kết giới thiệu khách hàng | Solavita Việt Nam',
            description:
              'Đợt tuyển chọn 50 đối tác của Solavita Việt Nam: hoa hồng theo mỗi watt, không vốn đầu tư, không tồn kho, có đào tạo và hỗ trợ đi kèm.',
          }),
          goldPartnerProgramJsonLd(),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Dành cho đối tác', url: '/for-partners/' },
            { name: 'Chương trình Đối tác Vàng', url: '/for-partners/gold-partner/' },
          ]),
        ]}
      />
      <main className="min-h-screen bg-[#F7F9FC]">
        {/* The campaign runs the Solavita | SKYWORTH lockup. `logoSrc`
            is an existing Header prop, so no shared component changes
            and no other page is affected. */}
        <Header
          logoHref="/"
          logoSrc="/images/LOGOlan-skyworth.svg"
          logoAlt="Solavita — SKYWORTH"
        />

        <GoldMedalPartner showBreadcrumb={showBreadcrumb} />

        <Footer variant="light" />
      </main>
    </>
  )
}
