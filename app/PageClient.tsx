'use client'

import Link from 'next/link'
import {
  ArrowRight,
  ClipboardCheck,
  ClipboardPenLine,
  Ruler,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import GetQuoteButton from '@/components/ui/get-quote-button'
import ProductSection from '@/components/ProductSection'
import PhoneShowcase from '@/components/monitoring-app/PhoneShowcase'
import { featuredVnCases } from '@/lib/data/vn-cases'
import VnCaseCard from '@/components/cases/VnCaseCard'
import { openFormModal } from '@/lib/form-modal'

/* ═══════════════════════════════════════════════════════════════════════
   Home — page flow
     1. Hero
     2. Scenario entry cards (SolaMate / SolaHome / Cho doanh nghiệp)
     3. Product / components (<ProductSection>, ported from the NG
        template's `#product` block, translated)
     4. Process — consultation → installation → activation → clean power
     5. Monitoring — the "Ứng dụng giám sát Solavita" block from
        /monitoring-app (PhoneShowcase), reused as-is after the process
        section; only its background is overridden so it does not merge
        with the QUY TRÌNH band above it
     6. Customer stories — real projects
     7. Final CTA

   The diesel-generator comparison section that shipped with the original NG
   template is gone for the VN site, and the grid-vs-solar comparison that
   briefly replaced it has been removed too.

   The "WHY SOLAVITA — From Local Warehouse to Your Doorstep" section
   was removed per `docs/修改建议.docx` §3 (Oct 2026).
   ═══════════════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      <Section1Hero />
      <Section2EntryCards />
      <ProductSection />
      <Section5ConsultationToCleanPower />
      <PhoneShowcase
        className="bg-white"
        internalLink={{
          href: '/monitoring-app/',
          label: 'Tìm hiểu ứng dụng giám sát',
        }}
      />
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
   H1 + body built on the three core values (cost / independence /
   stability).
   ────────────────────────────────────────────────────────────────────── */

function Section1Hero() {
  return (
    <PageHero
      backgroundImage="/images/banner_home.webp"
      eyebrow="ĐIỆN MẶT TRỜI CHO HỘ GIA ĐÌNH"
      title={'Chủ động nguồn điện.\nChủ động cuộc sống.'}
      body={
        <>
          Giảm chi phí điện, bớt nỗi lo mất điện với hệ thống điện mặt trời
          kèm pin lưu trữ.
          <br />
          Sản xuất trên dây chuyền SKYWORTH, lắp đặt và hỗ trợ tại Việt Nam.
        </>
      }
      primaryCta={{ label: 'Nhận báo giá miễn phí', onClick: openFormModal }}
      secondaryCta={{ label: 'Khám phá giải pháp', href: '/solutions/solahome' }}
    />
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 2 — Quick entry cards
   Three image-led cards pointing to the three solution pages
   (SolaMate / SolaHome / small business).
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ScenarioPanel
            href="/solutions/solamate"
            title="SolaMate — ban công"
            subTitle="Lắp trong 60 phút, cắm vào ổ là dùng"
            body="Trạm điện mặt trời all-in-one cho ban công, cửa sổ và sân thượng. Ba kiểu lắp — lan can, mái che, cắm đất — với thiết bị Zero-export mọi model."
            imageDescription="Nhân vật SolaMate bên tấm pin gắn trên lan can ban công căn hộ"
            imageSrc="/images/home-card-1.webp"
            cta="Xem giải pháp SolaMate"
          />
          <ScenarioPanel
            href="/solutions/solahome"
            title="SolaHome — mái nhà"
            subTitle="Điện ổn định cho tổ ấm"
            body="Giữ đèn sáng và thiết bị hoạt động khi mất điện. Từ nguồn dự phòng thiết yếu đến chủ động hoàn toàn nguồn điện, thiết kế riêng cho hộ gia đình."
            imageDescription="Nhân vật SolaMate đứng trước ngôi nhà có hệ thống điện mặt trời trên mái và pin lưu trữ bên hông"
            imageSrc="/images/home-card-2.webp"
            cta="Xem giải pháp SolaHome"
          />
          <ScenarioPanel
            href="/solutions/business-solar"
            title="Cho doanh nghiệp"
            subTitle="Vận hành liền mạch mỗi ngày"
            body="Bảo vệ hoạt động kinh doanh khỏi sự cố lưới điện bằng hệ thống ba pha vững chắc. Tiết kiệm chi phí điện và duy trì thiết bị quan trọng 24/7."
            imageDescription="Nhân vật SolaMate đội mũ bảo hộ trước kho hàng có dàn pin mặt trời trên mái, xe nâng và xe tải"
            imageSrc="/images/home-card-3.webp"
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
  imagePosition,
  cta,
}: {
  href: string
  title: string
  subTitle: string
  body: string
  imageDescription: string
  imageSrc?: string
  /** CSS `object-position` for the cover crop — used when the source
   *  photo is taller than the 16:9 frame and the subject sits low. */
  imagePosition?: string
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
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
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
            body="Thi công tấm pin mặt trời, pin lưu trữ và thiết bị bởi đội ngũ kỹ thuật."
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
            Công trình thực tế. <span className="text-gradient">Nhu cầu thật.</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
            Xem cách điện mặt trời và pin lưu trữ Solavita được lắp cho hộ gia
            đình và doanh nghiệp, kèm cấu hình từng dự án.
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
            href="/solutions/solahome"
            className="px-6 py-3 rounded-full text-sm font-cw-bold bg-white text-uk-navy border border-white hover:bg-uk-teal hover:text-uk-navy hover:border-uk-teal transition-colors"
          >
            Khám phá giải pháp
          </Link>
        </div>
      </div>
    </section>
  )
}