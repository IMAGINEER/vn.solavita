'use client'

import { useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Drill,
  ShieldCheck,
  Timer,
} from 'lucide-react'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import CTA from '@/components/solutions/CTA'
import FaqSection from '@/components/solutions/FaqSection'
import SolaMateLoadStrip from '@/components/solutions/SolaMateLoadStrip'
import SolaMatePainCarousel from '@/components/solutions/SolaMatePainCarousel'
import SolaMatePaybackChart from '@/components/solutions/SolaMatePaybackChart'
import PhoneShowcase from '@/components/monitoring-app/PhoneShowcase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { openFormModal } from '@/lib/form-modal'
import {
  solaMateCertifications,
  solaMateFaqs,
  solaMateInstallSteps,
  solaMateModule,
  solaMatePackages,
  solaMateComicFrames,
  solaMateRoi,
  solaMateScenarios,
  solaMateSpecs,
} from '@/lib/data/solamate'

/**
 * /solutions/solamate — SolaMate, the balcony & mobile PV line.
 *
 * Structure (VN):
 *   1. Hero — "60 phút lắp đặt, 30 năm dùng điện miễn phí"
 *   2. Pain points (image carousel)
 *   3. Three installation scenarios (lan can / mái che / cắm đất)
 *   4. Two power packages (800 W / 1600 W); the load & runtime strip is
 *      always visible on the card, and the old "what the system can run"
 *      block is folded into these cards
 *   5. Payback — the cumulative-profit curve plus the four figures
 *   6. The 5-step install flow — horizontal, one photo per step
 *   7. The 450 Wp all-black module — feature list beside the product shot
 *   8. Zero-export & safety (the spec table is collapsed by default)
 *   9. Smart app
 *  10. Certifications & warranty
 *  11. FAQ
 *  12. Survey CTA
 *
 * Section backgrounds alternate white / soft grey so no two adjacent
 * bands share the same surface.
 *
 * Copy is written for a Vietnamese reader — it does not mirror the
 * source page line by line, but every number comes from the official
 * Skyworth VN flyer / product page.
 */

export default function SolaMatePage() {
  // The general spec table is long and mostly secondary — it stays
  // collapsed until the reader opens it.
  const [specsOpen, setSpecsOpen] = useState(false)

  return (
    <>
      <Header logoHref="/" />
      <PageHero
        backgroundImage="/images/solamate/hero.webp"
        eyebrow="SolaMate · Trạm điện ban công"
        title={'Giảm Hóa Đơn Điện.\nBắt Đầu Từ Ban Công.'}
        body="Tận dụng năng lượng mặt trời ngay tại nhà với SolaMate. Lắp đặt dễ dàng, sử dụng tiện lợi."
        primaryCta={{
          label: 'Nhận báo giá ngay',
          onClick: () => openFormModal({ solutionType: 'balcony' }),
        }}
        secondaryCta={{
          label: 'Khám phá SolaMate',
          href: '#khe-lap-dat',
        }}
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Giải pháp', href: '/solutions/solahome/' },
          { label: 'SolaMate' },
        ]}
        /* The balcony photo is bright on the left (white facade), so the
           copy column needs a heavier mask than the default, plus a
           soft darkening at the bottom where the CTAs and the selling
           points sit. The panel itself stays clear on the right. */
        overlay="linear-gradient(to right, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.72) 32%, rgba(15,23,42,0.26) 58%, rgba(15,23,42,0) 78%), linear-gradient(to top, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0) 45%)"
      >
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Timer, text: '60 phút lắp đặt' },
            { icon: Drill, text: 'Không cần khoan đục' },
            { icon: ShieldCheck, text: 'Zero-export' },
          ].map((p) => (
            <span
              key={p.text}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/90 backdrop-blur-sm"
            >
              <p.icon className="h-4 w-4 text-uk-emerald" strokeWidth={2} />
              {p.text}
            </span>
          ))}
        </div>
      </PageHero>

      {/* ② Pain points — the worries, each with the photo that answers
          it. The payback block used to sit next to this one; it now
          has its own section further down the page. */}
      <section className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
            <div>
              <SectionEyebrow>VÌ SAO BẠN ĐANG PHÂN VÂN</SectionEyebrow>
              <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
                Bốn nỗi lo khiến ban công vẫn bỏ trống —{' '}
                <span className="text-gradient">và cách gỡ từng nỗi lo</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-uk-slate">
                Hóa đơn tăng, tấm pin treo cao, mưa gió và thủ tục xin phép —
                bốn lý do khiến người ở căn hộ chần chừ. SolaMate được thiết kế
                để gỡ từng lo lắng đó, không phải để tạo thêm một hệ thống phức
                tạp.
              </p>
            </div>

            <div>
              <SolaMatePainCarousel frames={solaMateComicFrames} />
            </div>
          </div>
        </div>
      </section>

      {/* ③ Three installation scenarios */}
      <section id="khe-lap-dat" className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>3 CÁCH LẮP ĐẶT</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Một sản phẩm, <span className="text-gradient">ba bối cảnh</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate">
              Cùng một dòng micro-inverter và tấm pin, ba cách đặt khung: kẹp
              vào lan can, khung mái che cửa sổ, hoặc chân đế cắm đất. Chọn
              theo không gian bạn có.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {solaMateScenarios.map((s) => (
              <article
                key={s.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-uk-line bg-white transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(15,118,110,0.45)]"
              >
                <img
                  src={s.imagePath}
                  alt={s.imageAlt}
                  className="h-56 w-full object-cover"
                  loading="lazy"
                />
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-xl font-cw-bold text-uk-navy">
                    {s.name}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-uk-slate">
                    {s.fits}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-2.5 text-sm text-uk-navy"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 flex-shrink-0 text-uk-teal-dark"
                          strokeWidth={2.5}
                        />
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ④ Packages — the colour band of the page: the same teal→emerald
          gradient and decorative blobs the IT sola-home-core hero uses
          (`from-it-teal-dark via-it-teal to-it-emerald` there; the VN
          `uk-*` tokens carry the identical hexes). The copy column sits
          on the dark end of the ramp, the two package cards float on it
          as white panels. */}
      <section
        id="goi"
        className="relative overflow-hidden bg-gradient-to-br from-uk-teal-dark via-uk-teal to-uk-emerald py-16 md:py-20"
      >
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow variant="dark" dotClassName="bg-white">
              CHỌN CÔNG SUẤT
            </SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-white md:text-4xl">
              Hai gói, <span className="text-gradient">một cách lắp</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/80">
              Chọn gói phù hợp với mức điện gia đình bạn dùng mỗi ngày: gói
              800 W chạy được đèn, tủ lạnh và Wi-Fi suốt ngày, còn gói 1600 W
              thêm cả điều hòa và thiết bị lớn. Hai gói cùng lắp trong 60
              phút, không cần khoan tường.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {solaMatePackages.map((p) => (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-uk-line bg-white transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(15,118,110,0.45)]"
              >
                {/* Header band — the kit render is the card's header photo,
                    and the package name and its power headline sit on it.
                    No scrim and no label chip: the copy block is kept inside
                    the dark PV panel on the left of the shot, so the white
                    type reads directly off the modules and the mounting
                    hardware stays untouched on the right. */}
                <div className="relative aspect-square shrink-0 overflow-hidden bg-white">
                  <img
                    src={p.imagePath}
                    alt={p.imageAlt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-y-0 left-0 flex max-w-[50%] flex-col justify-center py-5 pl-5 pr-1 sm:py-6 sm:pl-6">
                    {p.badge && (
                      <span className="text-[11px] font-cw-bold tracking-[0.18em] text-white/65 uppercase">
                        {p.badge}
                      </span>
                    )}
                    <h3 className="mt-2 text-xl font-cw-bold leading-tight text-white sm:text-2xl">
                      {p.name}
                    </h3>
                    {/* 1 — core power: the anchor of the card */}
                    <div className="mt-4">
                      <div className="text-3xl leading-none font-cw-bold text-white sm:text-4xl">
                        {p.power}
                      </div>
                      <div className="mt-1.5 text-[10px] font-cw-bold tracking-wider text-white/60 uppercase sm:text-[11px]">
                        công suất
                      </div>
                    </div>
                    {/* 2 — total DC nameplate of the system */}
                    <p className="mt-2 text-[11px] text-white/60 sm:text-sm">
                      Công suất hệ thống{' '}
                      <span className="font-cw-bold text-white">
                        {p.systemPower}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-8">
                  {/* 3 + 4 — module count and inverter */}
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                    <div>
                      <dt className="text-xs text-uk-slate">Số module PV</dt>
                      <dd className="mt-1 font-cw-bold text-uk-navy">
                        {p.modules}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-uk-slate">Micro-inverter</dt>
                      <dd className="mt-1 font-cw-bold text-uk-navy">
                        {p.inverter}
                      </dd>
                    </div>
                  </dl>

                  {/* 5 + 6 — the two numbers that sell the package */}
                  <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-uk-teal-soft/60 p-5">
                    <div>
                      <div className="text-xs text-uk-slate">
                        Sản lượng trung bình
                      </div>
                      <div className="mt-1.5 flex items-baseline gap-1">
                        <span className="text-2xl font-cw-bold text-uk-teal-dark md:text-3xl">
                          {p.dailyOutput.value}
                        </span>
                        <span className="text-[11px] font-cw-bold text-uk-teal-dark/75">
                          {p.dailyOutput.unit}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-uk-slate">
                        Tiết kiệm mỗi tháng
                      </div>
                      <div className="mt-1.5 flex items-baseline gap-1">
                        <span className="text-2xl font-cw-bold text-uk-teal-dark md:text-3xl">
                          {p.monthlySaving.value}
                        </span>
                        <span className="text-[11px] font-cw-bold text-uk-teal-dark/75">
                          {p.monthlySaving.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Household load simulation — always visible, both
                      packages show the same structure. `size="lg"` doubles
                      the icons and the type: this strip is a permanent
                      part of the card, not a hover detail. */}
                  <div className="mt-6 rounded-2xl border border-uk-line bg-sv-light p-5">
                    <SolaMateLoadStrip
                      runs={p.runs}
                      tone="light"
                      variant="strip"
                      size="lg"
                      caption="Một ngày nắng, đủ điện cho bao nhiêu thiết bị?"
                    />
                  </div>

                  {/* CTA — the wrapper's `mt-auto` pins both buttons to the
                      bottom edge so the two cards line up even when the
                      spec rows wrap differently. */}
                  <div className="mt-auto pt-7">
                    <button
                      type="button"
                      onClick={() => openFormModal({ solutionType: 'balcony' })}
                      className="btn-gradient inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-cw-bold text-white"
                    >
                      Nhận báo giá {p.name}
                      <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-6 text-xs text-white/70">
            Số liệu dựa trên bức xạ mặt trời trung bình tại Đông Nam Á và công
            suất tiêu thụ tiêu chuẩn.
          </p>
        </div>
      </section>

      {/* ⑤ Payback — the same system seen as money: what it saves and
          when the money comes back. It used to share a section with the
          pain points; it now follows the packages, so the reader meets
          the price, then the payback, then the install. */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>HOÀN VỐN</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              {solaMateRoi.headline}{' '}
              <span className="text-gradient">{solaMateRoi.headlineHighlight}</span>
            </h2>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <div className="solamate-chart rounded-2xl border border-uk-line bg-sv-light p-6">
              <h3 className="font-cw-bold text-uk-navy">
                Lợi nhuận tích lũy (triệu VND)
              </h3>
              <div className="mt-4">
                <SolaMatePaybackChart
                  series={solaMateRoi.series}
                  investment={solaMateRoi.investment}
                  paybackYears={solaMateRoi.paybackYears}
                />
              </div>
            </div>

            <div>
              {/* Four figures. The payback period is the headline
                  number of this block, so it gets the theme highlight —
                  teal border and the deep teal number — while the other
                  three stay neutral. */}
              <dl className="grid grid-cols-2 gap-2.5">
                {solaMateRoi.rows.map((r) => (
                  <div
                    key={r.label}
                    className="rounded-xl border border-uk-line bg-sv-light px-3 py-3"
                  >
                    <dt className="text-[11px] leading-snug text-uk-slate">
                      {r.label}
                    </dt>
                    <dd className="mt-1 font-cw-bold text-sm text-uk-navy">
                      {r.value}
                    </dd>
                  </div>
                ))}
                <div className="rounded-xl border border-uk-teal/50 bg-uk-teal-soft/60 px-3 py-3">
                  <dt className="text-[11px] leading-snug text-uk-teal-dark">
                    Thời gian hoàn vốn
                  </dt>
                  <dd className="mt-1 font-cw-bold text-lg text-uk-teal-dark">
                    {solaMateRoi.paybackYears} năm
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-xs leading-relaxed text-uk-slate">
                {solaMateRoi.assumption}
              </p>

              {/* The illustration closes the column, under the figures it
                  belongs to. */}
              <img
                src="/images/after-4.webp"
                alt="Nhân vật SolaMate bên hệ thống đã lắp đặt xong — không cần phê duyệt, không thủ tục phức tạp"
                loading="lazy"
                className="mt-6 aspect-[16/10] w-full rounded-2xl border border-uk-line object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ⑥ Install flow — five steps in a row, one photo each */}
      <section className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>QUY TRÌNH LẮP ĐẶT</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              60 phút, <span className="text-gradient">năm bước</span>
            </h2>
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {solaMateInstallSteps.map((s) => (
              <li
                key={s.index}
                className="flex flex-col overflow-hidden rounded-2xl border border-uk-line bg-white"
              >
                {/* The photo is absolutely positioned so the band keeps its
                    4:3 height for every step — an in-flow image would
                    size the band by its own aspect ratio. */}
                <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-white p-4">
                  <img
                    src={s.imagePath}
                    alt={s.imageAlt}
                    className={`absolute inset-0 h-full w-full p-4 ${
                      s.fit === 'cover' ? 'object-cover' : 'object-contain'
                    }`}
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-uk-navy/85 font-cw-bold text-sm text-white">
                    {s.index}
                  </span>
                </div>
                <div className="flex flex-1 flex-col border-t border-uk-line p-5">
                  <h3 className="font-cw-bold text-uk-navy">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-uk-slate">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ⑦ The module — what the panels actually are. It sits directly
          before the micro-inverter block, so the two halves of the
          hardware are explained back to back. The band is a pale cyan
          tint: distinct from the grey install band above it and from
          the white safety band below it. */}
      <section className="relative overflow-hidden bg-sv-blue/10 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
            {/* The photo leads on wide screens; on phones the copy
                still comes first, so the DOM order is kept and only
                the desktop placement is flipped. */}
            <div className="lg:order-2">
              <SectionEyebrow>TẤM PIN</SectionEyebrow>
              <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
                Tấm pin toàn đen —{' '}
                <span className="text-gradient">
                  mỗi tấm {solaMateModule.power} {solaMateModule.powerUnit}
                </span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-uk-slate">
                {solaMateModule.body}
              </p>

              <ul className="mt-8 space-y-3.5">
                {solaMateModule.features.map((f) => (
                  <li key={f.title} className="flex gap-3">
                    <Check
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-uk-emerald"
                      strokeWidth={2.5}
                    />
                    <div className="min-w-0">
                      <p className="font-cw-bold text-uk-navy">{f.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-uk-slate">
                        {f.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product shot — no caption on the photo, the figure above
                already carries the power rating. */}
            <div className="overflow-hidden rounded-2xl border border-uk-line bg-white lg:order-1">
              <img
                src={solaMateModule.imagePath}
                alt={solaMateModule.imageAlt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ⑧ Safety + specs */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionEyebrow>AN TOÀN & QUY ĐỊNH</SectionEyebrow>
              <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
                Điện sinh ra ưu tiên dùng trong nhà —{' '}
                <span className="text-gradient">không chảy ngược lên lưới</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-uk-slate">
                Mọi model đều có thiết bị Zero-export: điện sinh ra được dùng
                ngay trong nhà và không phát ngược lên lưới. Tại Việt Nam, hệ
                thống kết nối cố định với hộp phân phối điện AC theo quy định
                địa phương — không cần thủ tục xin phép lắp đặt điện phức tạp.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Micro-inverter IP67 — chịu mưa, chịu bụi quanh năm',
                  'Khung thép không gỉ, thiết kế chống rơi trên lan can',
                  'Chịu gió bão cấp 12, khung gập gọn cho thu gọn khi di chuyển',
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-sm text-uk-navy">
                    <ShieldCheck
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-uk-teal-dark"
                      strokeWidth={2}
                    />
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-uk-line bg-white p-7">
              <img
                src="/images/solamate/microinverter.webp"
                alt="Micro-inverter SolaMate — vỏ kim loại với các đầu nối MC4"
                className="mx-auto h-48 w-auto object-contain"
                loading="lazy"
              />

              {/* Anti-reverse-flow device — the Zero-export unit that
                  keeps the generated power from being pushed back into
                  the grid. It is what the section headline is about, so
                  it gets the device photo and a line of its own. */}
              <div className="mt-6 flex items-center gap-4 rounded-xl bg-sv-light p-4">
                <img
                  src="/images/solamate/feature-microinverter.webp"
                  alt="Thiết bị chống dòng ngược của SolaMate kèm cảm biến dòng điện"
                  className="h-16 w-auto shrink-0 object-contain"
                  loading="lazy"
                />
                <div>
                  <div className="text-sm font-cw-bold text-uk-navy">
                    Thiết bị chống dòng ngược
                  </div>
                  <p className="mt-1 text-xs leading-snug text-uk-slate">
                    Zero-export: điện sinh ra được ưu tiên dùng ngay trong
                    nhà, không phát ngược lên lưới.
                  </p>
                </div>
              </div>

              {/* Spec table — collapsed by default, opened with the
                  chevron. The `grid-rows` trick animates the height
                  without measuring the panel. */}
              <button
                type="button"
                onClick={() => setSpecsOpen((open) => !open)}
                aria-expanded={specsOpen}
                className="mt-5 flex w-full items-center justify-between gap-3 text-left font-cw-bold text-uk-navy transition-colors hover:text-uk-teal-dark"
              >
                <span>Thông số kỹ thuật chung</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-uk-teal-dark transition-transform duration-300 ${
                    specsOpen ? 'rotate-180' : ''
                  }`}
                  strokeWidth={2}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  specsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <dl className="overflow-hidden divide-y divide-uk-line">
                  {solaMateSpecs.map((s) => (
                    <div
                      key={s.label}
                      className="flex flex-wrap items-baseline justify-between gap-2 py-3"
                    >
                      <dt className="text-sm text-uk-slate">{s.label}</dt>
                      <dd className="text-sm font-cw-bold text-uk-navy">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⑨ Smart app — the same "Ứng dụng giám sát Solavita" block the
          homepage uses (PhoneShowcase from /monitoring-app), so the
          phone mock-up, the App Store / Google Play buttons and the
          copy stay identical across the site. The band keeps the
          component's own bg-sv-blue/10 tint: it separates the light
          "safety + specs" section above from the white certifications
          section below. */}
      <PhoneShowcase
        internalLink={{
          href: '/monitoring-app/',
          label: 'Tìm hiểu ứng dụng giám sát',
        }}
      />

      {/* ⑩ Certifications */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionEyebrow>CHỨNG NHẬN</SectionEyebrow>
          <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
            Đạt tiêu chuẩn quốc tế —{' '}
            <span className="text-gradient">yên tâm sử dụng dài hạn</span>
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {solaMateCertifications.map((c) => (
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
            <span className="flex h-24 w-40 items-center justify-center rounded-2xl border border-uk-line bg-white p-4">
              <img
                src="/images/solamate/badge-warranty-30.jpg"
                alt="Bảo hành hiệu suất 30 năm cho tấm pin SolaMate"
                className="max-h-full max-w-full object-contain"
                loading="lazy"
              />
            </span>
          </div>
          {/* No warranty sentence here: the same figures (10 năm
              micro-inverter · 30 năm hiệu suất tấm pin · 25 năm khung thép
              · tuổi thọ đến 30 năm) are already listed in the spec table
              of the "AN TOÀN & QUY ĐỊNH" section — the badge image above
              is the visual summary of it. */}
        </div>
      </section>

      <FaqSection
        faqs={solaMateFaqs}
        eyebrow="FAQ"
        className="bg-sv-light"
        title={
          <>
            Câu hỏi <span className="text-gradient">thường gặp</span>
          </>
        }
      />

      <CTA
        eyebrow="BẮT ĐẦU NGAY"
        className="bg-white"
        title={
          <>
            Bắt đầu tiết kiệm điện <span className="text-gradient">từ tháng đầu tiên</span>
          </>
        }
        description="Đăng ký khảo sát miễn phí: chọn tỉnh/thành và kiểu lắp đặt (lan can, mái che, cắm đất). Kỹ thuật viên liên hệ trong vòng 2 giờ, không ràng buộc, không phí ẩn."
        primaryLabel="Đăng ký khảo sát miễn phí"
        secondaryLabel="Nhắn Zalo ngay"
        secondaryHref="https://wa.me/8618500875025"
      />
      <Footer />
    </>
  )
}
