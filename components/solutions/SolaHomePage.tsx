'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Check,
  ClipboardCheck,
  ClipboardPenLine,
  Gauge,
  Hammer,
  MapPin,
  PencilRuler,
  Ruler,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import TbdText from '@/components/ui/tbd-text'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import CTA from '@/components/solutions/CTA'
import FaqSection from '@/components/solutions/FaqSection'
import SolaHomeBillEstimator from '@/components/solutions/SolaHomeBillEstimator'
import SolaHomeEconomics from '@/components/solutions/SolaHomeEconomics'
import SolaHomeEnergyFlow from '@/components/solutions/SolaHomeEnergyFlow'
import SolaHomePackageCard from '@/components/solutions/SolaHomePackageCard'
import SolaHomeRoofPicker from '@/components/solutions/SolaHomeRoofPicker'
import SolaHomeSizingMatcher from '@/components/solutions/SolaHomeSizingMatcher'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  solaHomeBackups,
  solaHomeCases,
  solaHomeCertifications,
  solaHomeFaqs,
  solaHomePackages,
  solaHomeRoofTableNote,
  solaHomeService,
  solaHomeWarranty,
  type SolaHomeServiceIconKey,
} from '@/lib/data/solahome'

/** Icons for the delivery-flow steps — same visual language as the
 *  homepage "QUY TRÌNH" cards. */
const serviceIcons: Record<SolaHomeServiceIconKey, LucideIcon> = {
  survey: Ruler,
  design: PencilRuler,
  contract: ClipboardPenLine,
  install: Hammer,
  handover: ClipboardCheck,
  monitor: Gauge,
  maintenance: ShieldCheck,
}

/**
 * /solutions/solahome — SolaHome, the rooftop PV line for villas & houses.
 *
 * The page follows the household's decision order, not the product
 * catalogue order:
 *
 *   1. Hero — the bill input answers "what can this do for me?" first
 *   2. Roof picker — the roof material is the question a homeowner can
 *      answer immediately; SolaRoof / SolaLoft appear as the answer,
 *      not as two products to compare
 *   3. Sizing matcher + package comparison — roof area and bill pick a
 *      package; the table compares output, saving, hardware and the
 *      published daily load runtime
 *   4. Energy flow — one diagram, three states (day / night / outage),
 *      with the HEMS capabilities folded in
 *   5. Economics — investment, yearly saving, payback, long-term value
 *   6. Grid-tied vs hybrid + the two published battery pairings
 *   7. Real installations
 *   8. Delivery & after-sales with an explicit owner per stage
 *   9. Certifications, warranty, FAQ
 *  10. Survey CTA
 *
 * Daily output and monthly saving lead the package comparison; annual
 * saving, payback and long-term value live in the economics module; the
 * full roof-area ladder lives in the sizing table. The comparison table
 * repeats roof area and panel count on purpose — they are the specs
 * behind the recommended package, not a second sizing tool.
 */

/** The two architectures explained in section 6. */
const ARCHITECTURES = [
  {
    id: 'grid',
    name: 'Hòa lưới — không pin',
    tag: 'Đầu tư thấp hơn',
    body: 'Tấm pin và biến tần hòa lưới cấp điện cho nhà vào ban ngày; phần dư phát lên lưới theo cơ chế hiện hành.',
    points: [
      'Dùng điện mặt trời ngay khi có nắng',
      'Không có nguồn dự phòng khi mất lưới',
      'Phù hợp khi phần lớn điện dùng vào giờ ban ngày',
    ],
  },
  {
    id: 'hybrid',
    name: 'Hybrid + pin lưu trữ',
    tag: 'Dùng được cả ban đêm',
    body: 'Biến tần hybrid vừa cấp tải vừa sạc pin; khi mất lưới, hệ thống tự chuyển tải thiết yếu sang pin.',
    points: [
      'Tự tiêu thụ điện mặt trời cả buổi tối',
      'Dự phòng khi mất điện lưới',
      'Dung lượng pin 5 / 10 / 14,3 / 16 kWh',
    ],
  },
]

export default function SolaHomePage() {
  // Shared between the sizing matcher and the package cards: the
  // matcher's recommendation is the card the visitor is sent to.
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  )

  return (
    <>
      <Header logoHref="/" />
      <PageHero
        backgroundImage="/images/solahome/hero.webp"
        eyebrow="SolaHome · Biệt thự & nhà phố"
        title={'Chủ động nguồn điện,\ntiết kiệm chi phí mỗi ngày.'}
        body="Giải pháp điện mặt trời cho gia đình Việt Nam, được thiết kế theo nhu cầu sử dụng điện, cấu trúc mái nhà và ngân sách của bạn."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'SolaHome' },
        ]}
        compact
      >
        <SolaHomeBillEstimator />
      </PageHero>

      {/* ② Roof-fit solutions */}
      <section id="theo-mai" className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>THEO LOẠI MÁI NHÀ</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Mỗi kiểu mái,{' '}
              <span className="text-gradient">một cách lắp phù hợp.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate">
              Chọn loại mái để xem cách lắp, thiết bị và phương án Solavita
              phù hợp với ngôi nhà.
            </p>
          </div>

          <SolaHomeRoofPicker />
        </div>
      </section>

      {/* ③ Usage ↔ package matching — the colour band of the page, same
          treatment as the SolaMate "CHỌN CÔNG SUẤT" section: the teal→
          emerald gradient with the copy in white and the matcher + the
          package cards floating on it as white panels. */}
      <section
        id="goi-solahome"
        className="relative overflow-hidden bg-gradient-to-br from-uk-teal-dark via-uk-teal to-uk-emerald py-16 md:py-20"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow variant="dark" dotClassName="bg-white">
              CHỌN THEO NHU CẦU SỬ DỤNG
            </SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-white md:text-4xl">
              Từ mái nhà và hóa đơn —{' '}
              <span className="text-gradient">chọn ra gói phù hợp</span>
            </h2>
          </div>

          <SolaHomeSizingMatcher
            selectedPackageId={selectedPackageId}
            onSelectPackage={setSelectedPackageId}
          />

          <div id="goi-cards" className="mt-12 scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="text-2xl font-cw-bold text-white">
                Bốn gói SolaHome
              </h3>
              <p className="text-xs text-white/70">
                Giá báo theo cấu hình sau khảo sát · không niêm yết giá gói
              </p>
            </div>

            <p className="mt-4 max-w-3xl text-xs leading-relaxed text-white/80">
              Cùng một gói có thể lắp{' '}
              <span className="font-cw-bold text-white">SolaRoof</span> hoặc{' '}
              <span className="font-cw-bold text-white">SolaLoft</span> — cách
              lắp không làm thay đổi tải tham chiếu.{' '}
              <a
                href="#theo-mai"
                className="inline-flex items-center gap-1 font-cw-bold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
              >
                Chọn theo mái
                <ArrowRight className="h-3 w-3" />
              </a>
            </p>

            {/* One card per package at every width. The card carries the
                five core specs; the appliance runtimes only surface on
                hover over the header art at xl. */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
              {solaHomePackages.map((p) => (
                <SolaHomePackageCard
                  key={p.id}
                  pkg={p}
                  recommended={selectedPackageId === p.id}
                />
              ))}
            </div>

            <div className="mt-5 space-y-1.5">
              <p className="text-xs leading-relaxed text-white/70">
                {solaHomeRoofTableNote}
              </p>
              <p className="text-[11px] leading-relaxed text-white/60">
                Thời gian chạy/ngày lấy từ cột “Tải tham chiếu &amp; thời gian
                chạy” trong flyer SolaRoof &amp; SolaLoft của Skyworth. Hai gói
                10 kWp dùng chung hàng 10 kW đã công bố; khác nhau ở pha, biến
                tần, pin và nhóm khách hàng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ④ How the energy system works */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>CÁCH HỆ THỐNG VẬN HÀNH</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Một hệ thống —{' '}
              <span className="text-gradient">ba trạng thái trong ngày</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate">
              Điện mặt trời cấp cho nhà trước, phần dư nạp vào pin, thiếu thì
              lưới bù. Chuyển giữa ban ngày, ban đêm và khi mất lưới để thấy
              dòng điện đi đâu trong từng trường hợp.
            </p>
          </div>

          <SolaHomeEnergyFlow />
        </div>
      </section>

      {/* ⑤ Generation & economics */}
      <section className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>SẢN LƯỢNG & KINH TẾ</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Sản lượng đã công bố —{' '}
              <span className="text-gradient">bài toán hoàn vốn</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate">
              Hai cấu hình dưới đây là số liệu công bố của SolaHome. Mỗi cấu
              hình cho thấy bốn con số quyết định: đầu tư, tiết kiệm mỗi năm,
              thời gian hoàn vốn và giá trị dài hạn.
            </p>
          </div>

          <SolaHomeEconomics />
        </div>
      </section>

      {/* ⑥ Grid-tied vs hybrid + published battery pairings */}
      <section id="phuong-an-pin" className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>HÒA LƯỚI HAY HYBRID</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Có pin hay không —{' '}
              <span className="text-gradient">chọn theo mức dự phòng bạn cần</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate">
              Các gói SolaHome không bắt buộc kèm pin. Khác biệt lớn nhất giữa
              hai kiến trúc là khả năng dùng điện mặt trời vào buổi tối và giữ
              điện khi mất lưới.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {ARCHITECTURES.map((arch) => (
              <article
                key={arch.id}
                className="flex flex-col rounded-3xl border border-uk-line bg-sv-light p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-cw-bold text-uk-navy">
                    {arch.name}
                  </h3>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-cw-bold tracking-wider text-uk-teal-dark uppercase">
                    {arch.tag}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-uk-slate">
                  {arch.body}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {arch.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-sm text-uk-navy"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-uk-teal-dark"
                        strokeWidth={2.5}
                      />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-14">
            <h3 className="text-2xl font-cw-bold text-uk-navy">
              Hai phương án pin đã công bố
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-uk-slate">
              Khi chọn hybrid, hệ thống đi theo một trong hai cặp pin và biến
              tần dưới đây. Cả hai đều bảo hành pin 10 năm.
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {solaHomeBackups.map((b) => (
                <article
                  key={b.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-uk-line bg-white"
                >
                  {/* The equipment of this pairing. Scene shots fill the
                      frame; studio shots are cut on white, so they are
                      blended into the light panel. */}
                  <div className="h-56 w-full bg-sv-light">
                    <img
                      src={b.imagePath}
                      alt={b.imageAlt}
                      loading="lazy"
                      className={`h-full w-full ${
                        b.imageFit === 'cover'
                          ? 'object-cover'
                          : 'object-contain mix-blend-multiply p-6'
                      }`}
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <h4 className="text-lg font-cw-bold text-uk-navy">
                      {b.name}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-uk-slate">
                      {b.fits}
                    </p>

                    <div className="mt-5 rounded-2xl bg-sv-light p-5">
                      <p className="flex items-center gap-2 text-xs font-cw-bold tracking-wider text-uk-slate uppercase">
                        <BatteryCharging
                          className="h-4 w-4 text-uk-teal-dark"
                          strokeWidth={2}
                        />
                        Pin lưu trữ
                      </p>
                      <p className="mt-2 font-cw-bold text-uk-navy">
                        {b.battery.model}
                      </p>
                      <p className="mt-1 text-sm text-uk-slate">
                        {b.battery.capacity}
                      </p>
                    </div>

                    <div className="mt-3 rounded-2xl bg-sv-light p-5">
                      <p className="flex items-center gap-2 text-xs font-cw-bold tracking-wider text-uk-slate uppercase">
                        <Zap
                          className="h-4 w-4 text-uk-teal-dark"
                          strokeWidth={2}
                        />
                        Biến tần hybrid
                      </p>
                      <p className="mt-2 font-cw-bold text-uk-navy">
                        {b.inverter.model}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-uk-slate">
                        {b.inverter.note}
                      </p>
                    </div>

                    <ul className="mt-5 space-y-2.5">
                      {b.benefits.map((t) => (
                        <li
                          key={t}
                          className="flex gap-2.5 text-sm text-uk-navy"
                        >
                          <Check
                            className="mt-0.5 h-4 w-4 flex-shrink-0 text-uk-teal-dark"
                            strokeWidth={2.5}
                          />
                          <span className="leading-relaxed">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ⑦ Real installations */}
      <section className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>DỰ ÁN THỰC TẾ</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Những mái nhà{' '}
              <span className="text-gradient">đã vận hành thật</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate">
              Ba dự án tại Việt Nam trong hồ sơ case của Skyworth — mỗi
              dự án ghi rõ hệ SolaRoof hay SolaLoft đang áp dụng.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {solaHomeCases.map((c) => (
              <figure
                key={c.id}
                className="overflow-hidden rounded-2xl border border-uk-line bg-white"
              >
                {c.imagePath ? (
                  <img
                    src={c.imagePath}
                    alt={c.imageAlt}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <ImagePlaceholder
                    description={c.imageAlt}
                    className="!rounded-none !border-0 h-48"
                  />
                )}
                <figcaption className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-lg font-cw-bold text-uk-navy leading-tight">
                      {c.name}
                    </span>
                    <span className="shrink-0 rounded-full bg-uk-teal-soft px-3 py-1 text-xs font-cw-bold text-uk-teal-dark">
                      {c.system}
                    </span>
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-uk-slate">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                    {c.location}
                  </p>
                  <p className="mt-3 text-sm font-cw-bold text-uk-navy">
                    {c.capacity ? (
                      `Công suất ${c.capacity}`
                    ) : (
                      <TbdText
                        inline
                        text="công suất lắp đặt (chờ đối chiếu hồ sơ dự án)"
                      />
                    )}
                  </p>
                  {c.facts && c.facts.length > 0 && (
                    <dl className="mt-3 space-y-1.5 border-t border-uk-line/60 pt-3">
                      {c.facts.map((f) => (
                        <div
                          key={f.label}
                          className="flex items-baseline justify-between gap-3 text-xs"
                        >
                          <dt className="text-uk-slate font-cw-regular">
                            {f.label}
                          </dt>
                          <dd className="text-right font-cw-bold text-uk-navy">
                            {f.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <p className="mt-3 text-xs leading-relaxed text-uk-slate">
                    {c.note}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* The completed-system strip is gone — the case library on
              /cases/ is the one place that keeps the full list. */}
          <div className="mt-10">
            <Link
              href="/cases/"
              className="inline-flex items-center gap-2 font-cw-bold text-uk-teal-dark underline underline-offset-4 transition-colors hover:text-uk-teal"
            >
              Khám phá thêm các dự án
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ⑧ Installation & after-sales — the same card language as the
          homepage "QUY TRÌNH" band: centred header, white step cards
          with the numbered badge sitting on the card's top edge, icon
          + title, and the body below. */}
      <section className="relative bg-sv-blue/10 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow>LẮP ĐẶT & HẬU MÃI</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Từ khảo sát đến hậu mãi —{' '}
              <span className="text-gradient">một đầu mối chịu trách nhiệm</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate md:text-lg">
              Mỗi bước ghi rõ ai phụ trách — từ lúc ký hợp đồng đến khi hệ thống
              vận hành.
            </p>
          </div>

          {/* Snake ("倒 C") flow on lg+: 1–4 left→right on the top row,
              4→5 down the right side, 5–7 right→left on the bottom row.
              Below lg the steps simply stack in reading order. */}
          <ol className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-12 lg:pr-8">
            {solaHomeService.map((stage, index) => {
              const Icon = serviceIcons[stage.icon]
              // The second row is placed explicitly so 5 sits under 4 and
              // the row reads right→left, mirroring the arrows.
              const placement =
                index === 4
                  ? 'lg:col-start-4 lg:row-start-2'
                  : index === 5
                    ? 'lg:col-start-3 lg:row-start-2'
                    : index === 6
                      ? 'lg:col-start-2 lg:row-start-2'
                      : ''
              return (
                <li key={stage.title} className={`relative ${placement}`}>
                  <div className="flex h-full flex-col rounded-2xl border border-uk-line bg-white p-8">
                    <div
                      className="absolute left-1/2 z-10 -translate-x-1/2"
                      style={{ top: 'calc(-0.5 * 2.5rem)' }}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-uk-emerald text-base font-cw-bold text-white shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                    <div className="mb-3 flex items-start gap-2">
                      <Icon
                        className="mt-0.5 h-5 w-5 shrink-0 text-uk-emerald"
                        strokeWidth={1.6}
                      />
                      <h3 className="text-base leading-snug font-cw-bold text-uk-navy">
                        {stage.title}
                      </h3>
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-uk-slate">
                      {stage.body}
                    </p>
                    <p className="mt-4 inline-flex w-fit items-center rounded-full bg-sv-light px-3 py-1 text-[10px] font-cw-bold tracking-wide text-uk-teal-dark">
                      {stage.owner}
                    </p>
                  </div>

                  {/* → between 1–2, 2–3, 3–4 */}
                  {index < 3 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-full hidden w-10 -translate-y-1/2 items-center lg:flex"
                    >
                      <span className="h-0 flex-1 border-t-2 border-dashed border-uk-emerald/70" />
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 text-uk-emerald"
                        strokeWidth={3}
                      />
                    </span>
                  )}

                  {/* ↓ down the right side, 4 → 5 */}
                  {index === 3 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-full hidden h-[calc(100%+3rem)] w-6 lg:block"
                    >
                      <span className="absolute top-0 left-0 h-0 w-full border-t-2 border-dashed border-uk-emerald/70" />
                      <span className="absolute top-0 right-0 h-full w-0 border-r-2 border-dashed border-uk-emerald/70" />
                      <span className="absolute right-0 bottom-0 flex w-full -translate-y-1/2 items-center">
                        <ArrowLeft
                          className="h-3.5 w-3.5 shrink-0 text-uk-emerald"
                          strokeWidth={3}
                        />
                        <span className="h-0 flex-1 border-t-2 border-dashed border-uk-emerald/70" />
                      </span>
                    </span>
                  )}

                  {/* ← between 5–6 and 6–7 */}
                  {index >= 4 && index <= 5 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 right-full hidden w-10 -translate-y-1/2 items-center lg:flex"
                    >
                      <span className="h-0 flex-1 border-t-2 border-dashed border-uk-emerald/70" />
                      <ArrowLeft
                        className="h-3.5 w-3.5 shrink-0 text-uk-emerald"
                        strokeWidth={3}
                      />
                    </span>
                  )}
                </li>
              )
            })}
          </ol>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Lắp đặt & nghiệm thu',
                body: 'Đội thi công Solavita lắp trong 2–3 ngày, đấu nối hộp phân phối AC theo quy định địa phương và chạy thử toàn hệ thống trước khi bàn giao.',
              },
              {
                title: 'Giám sát sau bàn giao',
                body: 'Bàn giao SKYWORTH Smart App ngay khi nghiệm thu, xem sản lượng, mức tiêu thụ và trạng thái pin theo thời gian thực.',
              },
              {
                title: 'Vận hành & bảo trì',
                body: 'Bảo trì vận hành miễn phí 3 năm đầu; sau đó hỗ trợ kỹ thuật qua hotline và Zalo của Solavita.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-uk-line bg-white p-5"
              >
                <h3 className="font-cw-bold text-uk-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-uk-slate">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑨ Certifications + warranty */}
      <section className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <SectionEyebrow>CHỨNG NHẬN & BẢO HÀNH</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Đạt tiêu chuẩn quốc tế —{' '}
              <span className="text-gradient">bảo hành dài hạn</span>
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {solaHomeCertifications.map((c) => (
                <span
                  key={c.name}
                  className="flex h-24 w-40 items-center justify-center rounded-2xl border border-uk-line bg-white p-4"
                >
                  <img
                    src={c.imagePath}
                    alt={c.imageAlt}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </span>
              ))}
            </div>
          </div>

          <dl className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solaHomeWarranty.map((w) => (
              <div
                key={w.label}
                className="rounded-2xl border border-uk-line bg-white p-6 text-center"
              >
                <dt className="text-xs text-uk-slate">{w.label}</dt>
                <dd className="mt-2 text-xl font-cw-bold text-uk-teal-dark">
                  {w.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-uk-slate">
            Kèm theo mỗi hệ thống là 3 năm bảo trì vận hành miễn phí. Điều kiện
            bảo hành chi tiết được ghi trong hợp đồng và phiếu bảo hành bàn giao
            cùng thiết bị.
          </p>
        </div>
      </section>

      <FaqSection
        faqs={solaHomeFaqs}
        eyebrow="FAQ"
        title={
          <>
            Câu hỏi <span className="text-gradient">thường gặp</span>
          </>
        }
      />

      {/* ⑩ Final consultation CTA */}
      <CTA
        eyebrow="KHẢO SÁT MIỄN PHÍ"
        title={
          <>
            Chủ động nguồn điện cho ngôi nhà{' '}
            <span className="text-gradient">cùng SolaHome</span>
          </>
        }
        description="Đăng ký khảo sát miễn phí: kỹ thuật viên đo đạc mái, đối chiếu hóa đơn điện và nhu cầu dự phòng, rồi gửi báo giá trong 24 giờ. Không ràng buộc, không phí ẩn."
        primaryLabel="Đăng ký khảo sát miễn phí"
        secondaryLabel="Xem sản phẩm"
        secondaryHref="/products/module/"
      />
      <Footer />
    </>
  )
}