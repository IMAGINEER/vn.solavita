'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Sun,
  Wrench,
  Factory,
  XCircle,
  CheckCircle2,
  Ruler,
  ClipboardPenLine,
  ClipboardCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import GetQuoteButton from '@/components/ui/get-quote-button'
import { featuredVnCases } from '@/lib/data/vn-cases'
import VnCaseCard from '@/components/cases/VnCaseCard'
import { openFormModal } from '@/lib/form-modal'

/* ═══════════════════════════════════════════════════════════════════════
   Home — page flow
     1. Hero
     2. Scenario entry cards (Cho hộ gia đình / Cho doanh nghiệp)
     3. GRID VS. SOLAR — See the Difference (visual)
     4. YOUR SOLAR JOURNEY — From Consultation to Clean Power
     5. CUSTOMER STORIES — Real Projects, Real Energy Needs
     6. Final CTA — Take the Next Step Towards Reliable Power

   The diesel-generator comparison section that shipped with the original NG template
   has been removed for the VN site (no diesel messaging). Section 3 now
   compares a grid-only supply against solar + storage, keeping the same
   two-column layout without any diesel content.

   The "WHY SOLAVITA — From Local Warehouse to Your Doorstep" section
   was removed per `docs/修改建议.docx` §3 (Oct 2026).
   ═══════════════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      <Section1Hero />
      <Section2EntryCards />
      <Section3GridVsSolar />
      <Section5ConsultationToCleanPower />
      <Section7CustomerStories />
      <Section9FinalCta />

      {/* The trust-mark strip (formerly TrustBar) has been removed:
          it carried TÜV / CE / MCS / NICEIC / RECC / 25-year warranty
          marks that are unverified for Vietnam. Re-introduce a
          VN-specific strip only once business confirms which approvals
          actually apply. */}
      <Footer />
      <FloatingButtons />
    </main>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 1 — Hero
   New H1 + body built on the three core values (cost / independence
   / stability).
   ────────────────────────────────────────────────────────────────────── */

function Section1Hero() {
  return (
    <PageHero
      backgroundImage="/images/banner_home.webp"
      eyebrow="ĐIỆN MẶT TRỜI CHO HỘ GIA ĐÌNH"
      title={'Chủ động nguồn điện.\n*Chủ động cuộc sống.'}
      body={
        <>
          Giảm chi phí điện và lo lắng mất điện với hệ thống điện mặt trời
          kèm pin lưu trữ vận hành 24/7.
          <br />
          Từ nhà máy Solavita đến gia đình, doanh nghiệp và cộng đồng của bạn.
        </>
      }
      primaryCta={{ label: 'Nhận báo giá miễn phí', onClick: openFormModal }}
      secondaryCta={{ label: 'Khám phá giải pháp', href: '/solutions/home-solar' }}
    />
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 2 — Quick entry cards
   Two image-led cards pointing to the two collection pages. No icon,
   no eyebrow on the card itself - the SectionEyebrow above groups
   them.
   ────────────────────────────────────────────────────────────────────── */

function Section2EntryCards() {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-br from-uk-teal/5 to-uk-emerald/15">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>GIẢI PHÁP</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Giải pháp điện mặt trời cho <span className="text-gradient">mọi gia đình và doanh nghiệp</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScenarioPanel
            href="/solutions/home-solar"
            title="Cho hộ gia đình"
            subTitle="Điện ổn định cho tổ ấm"
            body="Giữ đèn sáng và thiết bị hoạt động khi mất điện. Từ nguồn dự phòng thiết yếu đến chủ động hoàn toàn nguồn điện, thiết kế riêng cho hộ gia đình."
            imageDescription="Một ngôi nhà hiện đại với hệ thống điện mặt trời trên mái và pin lưu trữ"
            imageSrc="/images/home_cap.webp"
            cta="Xem giải pháp cho hộ gia đình"
          />
          <ScenarioPanel
            href="/solutions/business-solar"
            title="Cho doanh nghiệp"
            subTitle="Vận hành liền mạch mỗi ngày"
            body="Bảo vệ hoạt động kinh doanh khỏi sự cố lưới điện bằng hệ thống ba pha vững chắc. Tiết kiệm chi phí điện và duy trì thiết bị quan trọng 24/7."
            imageDescription="Kho hàng và trung tâm dịch vụ Solavita với dàn pin mặt trời trên mái"
            imageSrc="/images/warehouse_local.webp"
            cta="Xem giải pháp cho doanh nghiệp"
          />
        </div>
      </div>
    </section>
  )
}

function ScenarioPanel({
  href,
  title,
  subTitle,
  body,
  imageDescription,
  imageSrc,
  cta,
}: {
  href: string
  title: string
  subTitle: string
  body: string
  imageDescription: string
  imageSrc?: string
  cta: string
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-uk-line bg-white overflow-hidden hover:border-uk-teal hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-[16/9] bg-uk-line/30 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageDescription}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <ImagePlaceholder
            description={imageDescription}
            aspectRatio="16/9"
            className="!rounded-none !border-0 !bg-slate-50"
          />
        )}
      </div>
      <div className="p-6 lg:p-8">
        <div className="text-xs font-cw-bold uppercase tracking-wider text-uk-teal">
          {title}
        </div>
        <h3 className="mt-2 text-xl font-cw-bold text-uk-navy leading-tight">
          {subTitle}
        </h3>
        <p className="mt-3 text-base text-uk-slate font-cw-regular leading-relaxed">
          {body}
        </p>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal group-hover:text-uk-teal-dark transition-colors">
          {cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 3 — Grid vs. Solar: See the Difference
   The cost-comparison narrative. Red X for grid-only pain, green check
   for solar upside. Same two-column treatment as the original template, with
   every diesel / generator reference removed.
   ────────────────────────────────────────────────────────────────────── */

function Section3GridVsSolar() {
  return (
    <section className="relative py-16 md:py-20 bg-uk-line/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>SO SÁNH NGUỒN ĐIỆN</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Chỉ dùng lưới điện hay <span className="text-gradient">điện mặt trời + lưu trữ?</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
            Mỗi tháng trôi qua là một hoá đơn nữa. Mỗi giờ nắng là một
            khoản tiết kiệm thêm.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
          {/* Grid-only side - red X */}
          <div className="rounded-2xl border border-red-300 dark:border-red-800/40 bg-red-50 dark:bg-red-950/30 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
                <Factory className="w-5 h-5" strokeWidth={1.6} />
              </div>
              <h3 className="text-xl font-cw-bold text-uk-navy">
                Phụ thuộc hoàn toàn vào lưới điện
              </h3>
            </div>
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-uk-line/30 dark:bg-slate-800 mb-5">
              <img
                src="/images/outage_home.webp"
                alt="Hộ gia đình mất điện khi lưới điện gặp sự cố"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-cw-bold text-uk-navy mb-4">
              Giá điện tăng, mất điện đột ngột và những lo lắng không
              hồi kết — bạn không tự quyết định được nguồn điện của mình.
            </p>
            <ul className="space-y-2 text-sm">
              <CompareXRow text="Hoá đơn điện tăng theo biểu giá bán lẻ" />
              <CompareXRow text="Mất điện làm gián đoạn sinh hoạt và kinh doanh" />
              <CompareXRow text="Thiết bị điện tử chịu rủi ro khi điện chập chờn" />
              <CompareXRow text="Không tận dụng được nguồn nắng tại chỗ" />
            </ul>
          </div>

          {/* VS divider - same style as the WHY SOLAVITA PD2C comparison */}
          <div className="flex items-center justify-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #2F80ED, #22C55E)',
              }}
            >
              <span className="text-sm font-cw-bold text-white">VS</span>
            </div>
          </div>

          {/* Solar side - green check */}
          <div className="rounded-2xl border border-uk-emerald/40 bg-uk-emerald/5 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-uk-emerald/15 flex items-center justify-center text-uk-emerald">
                <Sun className="w-5 h-5" strokeWidth={1.6} />
              </div>
              <h3 className="text-xl font-cw-bold text-uk-navy">
                Solavita điện mặt trời + lưu trữ
              </h3>
            </div>
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-uk-emerald/10 mb-5">
              <img
                src="/images/solar_advantages.webp"
                alt="Hệ thống điện mặt trời và pin lưu trữ Solavita lắp đặt tại một hộ gia đình, tạo ra điện sạch"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-cw-bold text-uk-navy mb-4">
              Nguồn điện sạch, êm ái và do bạn chủ động.
            </p>
            <ul className="space-y-2 text-sm">
              <CompareCheckRow text="Cắt giảm chi phí điện dài hạn" />
              <CompareCheckRow text="Ít bảo trì, tuổi thọ cao" />
              <CompareCheckRow text="Sạch, yên tĩnh, không khí thải" />
              <CompareCheckRow text="Điện ổn định 24/7, thiết kế theo nhu cầu" />
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function CompareXRow({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-uk-navy">
      <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" strokeWidth={2} />
      <span>{text}</span>
    </li>
  )
}

function CompareCheckRow({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-uk-navy">
      <CheckCircle2
        className="w-4 h-4 text-uk-emerald flex-shrink-0"
        strokeWidth={2}
      />
      <span>{text}</span>
    </li>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 5 — Your Solar Journey: From Consultation to Clean Power
   4 steps. The step number sits on the top-edge-center of the card
   (per the previous layout fix).
   ────────────────────────────────────────────────────────────────────── */

function Section5ConsultationToCleanPower() {
  return (
    <section className="relative py-16 md:py-20 bg-sv-blue/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <SectionEyebrow>QUY TRÌNH</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Từ tư vấn đến <span className="text-gradient">nguồn điện sạch</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Quy trình đơn giản, minh bạch để đưa hệ thống điện mặt trời của
            bạn vào vận hành.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard
            step="1"
            icon={ClipboardPenLine}
            title="Khảo sát tại nhà"
            body="Đánh giá vị trí lắp đặt, nhu cầu và mục tiêu sử dụng điện."
          />
          <StepCard
            step="2"
            icon={Ruler}
            title="Lắp đặt chuyên nghiệp"
            body="Thi công tấm quang năng, pin lưu trữ và thiết bị bởi đội ngũ kỹ thuật."
          />
          <StepCard
            step="3"
            icon={Wrench}
            title="Nghiệm thu & kích hoạt"
            body="Kiểm tra hệ thống và kích hoạt tính năng giám sát."
          />
          <StepCard
            step="4"
            icon={ClipboardCheck}
            title="Tận hưởng điện sạch"
            body="Bắt đầu sử dụng nguồn điện sạch, bền vững mỗi ngày."
          />
        </div>
        <div className="mt-10 text-center">
          <GetQuoteButton onClick={openFormModal} />
        </div>
      </div>
    </section>
  )
}

function StepCard({
  step,
  icon: Icon,
  title,
  body,
}: {
  step: string
  icon: LucideIcon
  title: string
  body: string
}) {
  return (
    // The outer <div> is just the positioning context for the badge.
    // The card itself starts at the parent's top edge (no top
    // padding here), so the badge can sit with its bottom edge
    // exactly on the card's top border.
    <div className="relative">
      <div className="rounded-2xl border border-uk-line bg-white p-10 h-full flex flex-col">
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{ top: 'calc(-0.5 * 2.5rem)' }}
        >
          <div className="w-10 h-10 rounded-full bg-uk-emerald text-white text-base font-cw-bold flex items-center justify-center shadow-lg">
            {step}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5 text-uk-emerald flex-shrink-0" strokeWidth={1.6} />
          <h3 className="text-base font-cw-bold text-uk-navy whitespace-nowrap">
            {title}
          </h3>
        </div>
        <p className="text-sm text-uk-slate font-cw-regular leading-relaxed flex-1">
          {body}
        </p>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 7 — Real Projects. Real Energy Needs.
   Featured installs in the card format defined by
   `docs/修改建议(2).docx` §"首页修改" §2:
     [type badge] → [capacity] → [country, place]
   The full case list lives on /cases.
   ────────────────────────────────────────────────────────────────────── */

function Section7CustomerStories() {
  return (
    <section className="relative py-16 md:py-20 bg-uk-line/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>DỰ ÁN</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Dự án thực tế. <span className="text-gradient">Nhu cầu thực tế.</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
            Khám phá cách các giải pháp điện mặt trời và pin lưu trữ Solavita
            được ứng dụng cho hộ gia đình và doanh nghiệp, cùng cấu hình hệ
            thống của từng dự án.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVnCases.map((c) => (
            <VnCaseCard key={c.slug} c={c} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 9 — Final CTA
   "Take the Next Step Towards Reliable Power" with two CTAs
   (Get Free Quote + Explore Solutions).
   ────────────────────────────────────────────────────────────────────── */

function Section9FinalCta() {
  return (
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
        <SectionEyebrow variant="dark">Sẵn sàng bắt đầu</SectionEyebrow>
        <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-white leading-tight">
          Bước tiếp theo đến <span className="text-gradient">nguồn điện ổn định</span>
        </h2>
        <div className="mt-4 text-base md:text-lg text-white/85 font-cw-light leading-relaxed space-y-2 max-w-2xl mx-auto">
          <p>Không còn lo mất điện giữa đêm. Không còn hoá đơn tăng bất ngờ.</p>
          <p>Chỉ còn nguồn điện sạch, êm ái — sẵn sàng khi bạn cần.</p>
        </div>
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
  )
}