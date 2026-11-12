import type { Metadata } from 'next'
import GoldMedalPartner from '@/components/partners/GoldMedalPartner'
import GoldStickyForm from '@/components/partners/GoldStickyForm'
import { buildPageMetadata } from '@/lib/seo/metadata'
import JsonLd from '@/components/seo/JsonLd'
import {
  webPageJsonLd,
  breadcrumbJsonLd,
  goldPartnerProgramJsonLd,
} from '@/lib/seo/jsonld'
import {
  SITE_LEGAL_NAME,
  SITE_COMPANY_NUMBER,
  SITE_REGISTERED_OFFICE,
} from '@/lib/seo/site'

export const metadata: Metadata = buildPageMetadata({
  // The root layout's `title.template` already appends
  // "| Solavita Việt Nam" — pages pass the page-specific title only.
  title: 'Chương trình Đối tác Vàng — Liên kết giới thiệu khách hàng',
  path: '/for-partners/gold-partner',
  description:
    'Đợt tuyển chọn 50 đối tác của Solavita Việt Nam: hoa hồng 760 đồng/W cho cá nhân và 950 đồng/W cho doanh nghiệp — tương đương 7,6 và 9,5 triệu đồng mỗi đơn 10 kW. Không vốn đầu tư, không tồn kho. Đăng ký ngay.',
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

  // `?lp=` is the tracking code printed on each advert / QR standee.
  // Read here (server-side) and threaded down to both sign-up forms so
  // it is stored with the lead — the leads table has no tracking
  // column, so it travels as a line in `message`. Sanitised: codes are
  // short ASCII slugs, and anything else would just be noise in the
  // admin table.
  const rawLp = Array.isArray(params.lp) ? params.lp[0] : params.lp
  const trackingCode = (rawLp || '')
    .replace(/[^A-Za-z0-9_-]/g, '')
    .slice(0, 64)

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
        {/* A standalone campaign landing page: no site header and no
            site footer. The SKYWORTH logo lives in the hero itself,
            above the breadcrumb (see GoldMedalPartner). */}
        <GoldMedalPartner
          showBreadcrumb={showBreadcrumb}
          trackingCode={trackingCode || undefined}
        />
      </main>

      {/* Sticky quick sign-up — visible while reading, slides away
          once the full form (#dang-ky) is in view. See
          GoldStickyForm for the hide/show logic. */}
      <GoldStickyForm trackingCode={trackingCode || undefined} />

      {/* ── Legal footer ─────────────────────────────────────────
          The campaign page drops the site footer, but the legal
          disclosure must still travel with the page: the (c) line,
          the enterprise code and the registered office are the
          certificate-confirmed details, taken from the same
          constants the site footer uses so the two can never drift
          apart. Light styling — the page ends on a light band — and
          the 1px rule above the block is the campaign gold rather
          than a neutral grey, so the page signs off in the same
          colour as the hero tag and the standee. */}
      <footer className="border-t border-[#E8B44A] bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-xs text-uk-slate font-cw-regular">
            © 2026 <span className="font-cw-bold">{SITE_LEGAL_NAME}</span>. Bảo lưu
            mọi quyền.
          </p>
          <p className="mt-1 text-[11px] text-uk-slate/70 font-cw-regular">
            Mã số doanh nghiệp: {SITE_COMPANY_NUMBER}
          </p>
          <p className="text-[11px] text-uk-slate/70 font-cw-regular">
            {SITE_REGISTERED_OFFICE}
          </p>
        </div>
      </footer>
    </>
  )
}
