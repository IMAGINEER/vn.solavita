'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import GetQuoteButton from '@/components/ui/get-quote-button'
import { openFormModal } from '@/lib/form-modal'
import {
  vnResidentialCases,
  vnCommercialCases,
} from '@/lib/data/vn-cases'
import VnCaseCard from '@/components/cases/VnCaseCard'

/**
 * /cases - Case studies index.
 *
 * Rebuilt per `docs/修改建议(2).docx` §"Cases页面" (Oct 2026): the
 * published reference installations are split into two bubble-box
 * categories —
 *
 *   Hộ gia đình                     → 12 công trình
 *   Công nghiệp & thương mại       →  4 công trình
 *
 * and every card uses the new format: type badge → capacity → place.
 * The case facts themselves now come from `docs/创维光伏海外案例2.0(1).pptx`
 * (Nov 2026), which supersedes the docx figures.
 *
 * Photos: every published case carries a photo taken from the case deck
 * (`docs/创维光伏海外案例2.0(1).pptx`).
 */
export default function CasesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      {/* Hero */}
      <PageHero
        backgroundImage="/images/hero-cases.webp"
        eyebrow="DỰ ÁN"
        title="Giải pháp điện mặt trời trong thực tế"
        body="Khám phá các công trình điện mặt trời và cấu hình hệ thống trong từng bối cảnh sử dụng."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Dự án' },
        ]}
      />

      {/* Residential */}
      <section
        id="residential-cases"
        className="relative py-16 md:py-20 bg-white scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>HỘ GIA ĐÌNH</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Hệ thống cho hộ gia đình, <span className="text-gradient">thiết kế theo từng mái nhà</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
              Các công trình tham chiếu tại châu Á, châu Âu và Tây Phi —
              thể hiện công suất dàn pin, cấu hình pin lưu trữ và công suất
              bộ biến tần của từng hệ thống.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vnResidentialCases.map((c) => (
              <VnCaseCard key={c.slug} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Commercial & Industrial */}
      <section
        id="commercial-cases"
        className="relative py-16 md:py-20 bg-uk-line/30 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>CÔNG NGHIỆP &amp; THƯƠNG MẠI</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Hệ thống doanh nghiệp, <span className="text-gradient">mở rộng theo phụ tải</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
              Các công trình tham chiếu cho trường học, khu thương mại,
              mái công trình thương mại và lưu trữ quy mô lớn.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vnCommercialCases.map((c) => (
              <VnCaseCard key={c.slug} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - mirrors the homepage Section9FinalCta visual treatment */}
      <section
        className="relative py-20 md:py-28 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: 'url(/images/banner_bottom.webp)' }}
      >
        {/* Directional overlay - keeps the copy column legible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.55) 35%, rgba(15,23,42,0.2) 60%, rgba(15,23,42,0) 80%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <SectionEyebrow variant="dark">BẮT ĐẦU NGAY</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-white leading-tight">
            Bước tiếp theo đến <span className="text-gradient">nguồn điện ổn định</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/85 font-cw-light leading-relaxed">
            Dù cho gia đình hay doanh nghiệp, Solavita giúp bạn tìm đúng
            giải pháp điện mặt trời và pin lưu trữ theo nhu cầu. Hãy chia sẻ
            điều bạn cần, đội ngũ của chúng tôi sẽ đồng hành từ bước đầu tiên.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <GetQuoteButton onClick={openFormModal} />
            <Link
              href="/solutions/home-solar"
              className="px-6 py-3 rounded-full text-sm font-cw-bold bg-white text-uk-navy border border-white hover:bg-uk-teal hover:text-uk-navy hover:border-uk-teal transition-colors"
            >
              Khám phá giải pháp
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
