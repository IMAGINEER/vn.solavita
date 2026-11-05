'use client'

import {
  ArrowRight,
  BatteryCharging,
  Check,
  CloudSun,
  Home,
  Plug,
  ShieldCheck,
  Sun,
  Timer,
  Zap,
} from 'lucide-react'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import CTA from '@/components/solutions/CTA'
import FaqSection from '@/components/solutions/FaqSection'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { openFormModal } from '@/lib/form-modal'
import {
  solaMateCertifications,
  solaMateFaqs,
  solaMateInstallSteps,
  solaMatePackages,
  solaMatePainPoints,
  solaMateRoi,
  solaMateScenarios,
  solaMateSpecs,
} from '@/lib/data/solamate'

/**
 * /solutions/solamate — SolaMate, the balcony & mobile PV line.
 *
 * Structure (VN):
 *   1. Hero — "15 phút lắp đặt, 30 năm dùng điện miễn phí"
 *   2. Pain points — the four worries the source page opens with
 *   3. Three installation scenarios (ban công / che nắng / mặt đất)
 *   4. Two power packages (800 W / 1600 W) with published prices
 *   5. What the system can run
 *   6. The 5-step install flow
 *   7. Zero-export & safety
 *   8. Payback & cumulative profit
 *   9. Smart app
 *  10. Certifications & warranty
 *  11. FAQ
 *  12. Survey CTA
 *
 * Copy is written for a Vietnamese reader — it does not mirror the
 * source page line by line, but every number comes from the official
 * Skyworth VN flyer / product page.
 */

const SCENARIO_ICONS = {
  balcony: Home,
  awning: CloudSun,
  ground: Sun,
} as const

export default function SolaMatePage() {
  return (
    <>
      <Header logoHref="/" />
      <PageHero
        backgroundImage="/images/solamate/hero.webp"
        eyebrow="SolaMate · Trạm điện ban công"
        title={'15 phút lắp đặt.\n30 năm dùng điện miễn phí.*'}
        body="SolaMate là trạm điện mặt trời all-in-one cho ban công, cửa sổ và sân thượng. Không đào lắp, không xin phép điện lưới — chỉ cần 15 phút lắp ráp và cắm vào ổ điện trong nhà."
        primaryCta={{
          label: 'Nhận báo giá SolaMate',
          onClick: openFormModal,
        }}
        secondaryCta={{
          label: 'Xem 3 cách lắp đặt',
          href: '#khe-lap-dat',
        }}
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Giải pháp', href: '/solutions/solahome/' },
          { label: 'SolaMate' },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Timer, text: 'Lắp DIY trong 15 phút' },
            { icon: Plug, text: 'Không cần xin phép điện lưới' },
            { icon: ShieldCheck, text: 'Zero-export mọi model' },
            { icon: Zap, text: 'Từ 12.999.000 VND' },
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

      {/* ② Pain points */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>VÌ SAO BẠN ĐANG PHÂN VÂN</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Hóa đơn điện tăng — mà mái ban công thì đang bỏ trống
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate">
              Bốn lo lắng thường gặp nhất của người muốn lắp điện mặt trời
              tại căn hộ. SolaMate được thiết kế để gỡ từng lo lắng đó, không
              phải để tạo thêm một hệ thống phức tạp.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solaMatePainPoints.map((point, i) => (
              <div
                key={point}
                className="rounded-2xl border border-uk-line bg-sv-light p-6"
              >
                <span className="font-cw-bold text-uk-teal-dark text-xs tracking-widest">
                  0{i + 1}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-uk-navy font-cw-regular">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ③ Three installation scenarios */}
      <section id="khe-lap-dat" className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>3 CÁCH LẮP ĐẶT</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Một sản phẩm, <span className="text-gradient">ba bối cảnh</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate">
              Cùng một dòng micro-inverter và tấm pin, ba cách đặt khung: kẹp
              vào lan can, khung che nắng cửa sổ, hoặc chân đế đặt trên mặt
              đất. Chọn theo không gian bạn có.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {solaMateScenarios.map((s) => {
              const Icon = SCENARIO_ICONS[s.id]
              return (
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
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-uk-teal-soft text-uk-teal-dark">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                      <div>
                        <h3 className="text-xl font-cw-bold text-uk-navy">
                          {s.name}
                        </h3>
                        <p className="font-cw-bold text-uk-teal-dark text-xs tracking-wider uppercase">
                          Model {s.suffix}
                        </p>
                      </div>
                    </div>
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
                    <img
                      src={s.renderPath}
                      alt={s.renderAlt}
                      className="mt-6 h-28 w-full self-center object-contain"
                      loading="lazy"
                    />
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ④ Packages */}
      <section id="goi" className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <SectionEyebrow>CHỌN CÔNG SUẤT</SectionEyebrow>
              <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
                Hai gói, một cách lắp
              </h2>
              <p className="mt-4 text-base leading-relaxed text-uk-slate">
                Cả hai gói đều đi kèm micro-inverter, bộ khung lắp ráp sẵn và thiết
                bị Zero-export. Chọn theo mức điện gia đình bạn dùng mỗi ngày.
              </p>
            </div>
            <img
              src="/images/solamate/feature-detail.webp"
              alt="Khung tấm pin màu đen của SolaMate"
              className="hidden h-44 w-auto object-contain lg:block"
              loading="lazy"
            />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {solaMatePackages.map((p) => (
              <article
                key={p.id}
                className="flex flex-col rounded-3xl border border-uk-line bg-white p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-cw-bold text-uk-navy">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-sm text-uk-slate">{p.summary}</p>
                  </div>
                  {p.badge && (
                    <span className="shrink-0 rounded-full bg-uk-teal px-3 py-1 text-[10px] font-cw-bold tracking-wider text-white uppercase">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-end gap-3">
                  <span className="text-4xl font-cw-bold text-uk-teal-dark">
                    {p.power}
                  </span>
                  <span className="pb-1 text-sm text-uk-slate">
                    · {p.systemPower} toàn hệ
                  </span>
                </div>
                <div className="mt-2 text-lg font-cw-bold text-uk-navy">
                  {p.price}
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-uk-line pt-6 text-sm">
                  {[
                    { k: 'Số tấm pin', v: p.panels },
                    { k: 'Micro-inverter', v: p.inverter },
                    { k: 'Sản lượng', v: p.dailyOutput },
                    { k: 'Tiết kiệm/tháng', v: p.monthlySaving },
                  ].map((row) => (
                    <div key={row.k}>
                      <dt className="text-xs text-uk-slate">{row.k}</dt>
                      <dd className="mt-0.5 font-cw-bold text-uk-navy">{row.v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 rounded-xl bg-sv-light p-4">
                  <p className="text-xs font-cw-bold tracking-wider text-uk-slate uppercase">
                    Model theo cách lắp
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-uk-navy">
                    <li>Ban công — {p.models.balcony}</li>
                    <li>Che nắng — {p.models.awning}</li>
                    <li>Mặt đất — {p.models.ground}</li>
                  </ul>
                </div>

                <a
                  href="/contact-us/"
                  className="btn-gradient mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-cw-bold text-white"
                >
                  Nhận báo giá {p.name}
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ What the system runs */}
      <section className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>SẢN LƯỢNG & THIẾT BỊ</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Một ngày nắng, đủ điện cho bao nhiêu thiết bị?
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {solaMatePackages.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-uk-line bg-white p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-uk-teal-soft text-uk-teal-dark">
                    <BatteryCharging className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <div>
                    <h3 className="font-cw-bold text-uk-navy">
                      {p.name} — {p.dailyOutput}
                    </h3>
                    <p className="text-xs text-uk-slate">
                      Tiết kiệm ước tính {p.monthlySaving}
                    </p>
                  </div>
                </div>
                <ul className="mt-5 divide-y divide-uk-line">
                  {p.runs.map((r) => (
                    <li
                      key={r.device}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <span className="text-uk-navy">{r.device}</span>
                      <span className="font-cw-bold text-uk-teal-dark">
                        {r.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-uk-slate">
            Số liệu dựa trên bức xạ mặt trời trung bình tại Đông Nam Á và công
            suất tiêu thụ tiêu chuẩn.
          </p>
        </div>
      </section>

      {/* ⑥ Install flow */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div>
              <SectionEyebrow>QUY TRÌNH LẮP ĐẶT</SectionEyebrow>
              <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
                15 phút, năm bước
              </h2>
              <p className="mt-4 text-base leading-relaxed text-uk-slate">
                Bộ giá đỡ lắp ráp sẵn từ nhà máy — bạn chỉ cần treo lên, cắm
                vào và tải ứng dụng.
              </p>
              <img
                src="/images/solamate/scene-install.webp"
                alt="Tấm pin SolaMate kẹp vào lan can bằng bộ khung thép không gỉ"
                className="mt-8 w-full rounded-2xl border border-uk-line object-cover"
                loading="lazy"
              />
            </div>

            <ol className="grid gap-4 sm:grid-cols-2">
              {solaMateInstallSteps.map((s) => (
                <li
                  key={s.index}
                  className="rounded-2xl border border-uk-line bg-sv-light p-6"
                >
                  <span className="font-cw-bold text-2xl text-uk-teal">
                    {s.index}
                  </span>
                  <h3 className="mt-3 font-cw-bold text-uk-navy">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-uk-slate">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ⑦ Safety + specs */}
      <section className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionEyebrow>AN TOÀN & QUY ĐỊNH</SectionEyebrow>
              <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
                Điện sinh ra ưu tiên dùng trong nhà — không chảy ngược lên lưới
              </h2>
              <p className="mt-4 text-base leading-relaxed text-uk-slate">
                Mọi model đều có thiết bị Zero-export: điện sinh ra được dùng
                ngay trong nhà và không phát ngược lên lưới. Tại Việt Nam, hệ
                thống kết nối cố định với hộp phân phối điện AC theo quy định
                địa phương — không cần thủ tục xin phép lắp đặt điện phức tạp.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Micro-inverter IP67, tấm pin IP68 — chịu mưa, chịu nóng',
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
                src="/images/solamate/feature-microinverter.webp"
                alt="Bộ micro-inverter của SolaMate kèm cảm biến dòng điện"
                className="mx-auto h-48 w-auto object-contain"
                loading="lazy"
              />
              <h3 className="mt-5 font-cw-bold text-uk-navy">
                Thông số kỹ thuật chung
              </h3>
              <dl className="mt-5 divide-y divide-uk-line">
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
              <img
                src="/images/solamate/feature-adjustable.webp"
                alt="Sơ đồ các góc nghiêng có thể điều chỉnh của SolaMate"
                className="mt-6 h-40 w-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ⑧ Economics */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>HOÀN VỐN</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              {solaMateRoi.headline}
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-uk-line bg-sv-light p-7">
              <dl className="divide-y divide-uk-line">
                {solaMateRoi.rows.map((r) => (
                  <div
                    key={r.label}
                    className="flex items-baseline justify-between gap-4 py-3"
                  >
                    <dt className="text-sm text-uk-slate">{r.label}</dt>
                    <dd className="font-cw-bold text-uk-navy">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-uk-line bg-white p-7">
              <h3 className="font-cw-bold text-uk-navy">
                Lợi nhuận tích lũy
              </h3>
              <ul className="mt-5 space-y-3">
                {solaMateRoi.cumulative.map((c) => (
                  <li
                    key={c.year}
                    className="flex items-baseline justify-between gap-4 rounded-xl bg-sv-light px-4 py-3"
                  >
                    <span className="text-sm text-uk-slate">{c.year}</span>
                    <span className="font-cw-bold text-uk-teal-dark">
                      {c.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-uk-slate">
            {solaMateRoi.assumption}
          </p>
        </div>
      </section>

      {/* ⑨ Smart app */}
      <section className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionEyebrow>GIÁM SÁT</SectionEyebrow>
              <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
                Một màn hình, toàn bộ hệ thống
              </h2>
              <p className="mt-4 text-base leading-relaxed text-uk-slate">
                Ứng dụng SKYWORTH Smart App cung cấp dữ liệu 24/7 về sản
                lượng, trạng thái hệ thống và số tiền tiết kiệm theo thời gian
                thực.
              </p>
              <a
                href="/monitoring-app/"
                className="mt-6 inline-flex items-center gap-2 font-cw-bold text-uk-teal-dark underline underline-offset-4"
              >
                Tìm hiểu ứng dụng giám sát
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </div>
            <div className="rounded-2xl border border-uk-line bg-white p-7">
              <img
                src="/images/solamate/feature-app.webp"
                alt="Màn hình ứng dụng SKYWORTH Smart App theo dõi sản lượng điện mặt trời"
                className="mx-auto h-48 w-auto object-contain"
                loading="lazy"
              />
              <ul className="mt-6 space-y-3">
                {[
                  'Sản lượng điện theo giờ, theo ngày',
                  'Trạng thái micro-inverter và kết nối Wi-Fi',
                  'Số tiền tiết kiệm tích lũy theo thời gian thực',
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-sm text-uk-navy">
                    <CloudSun
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-uk-teal-dark"
                      strokeWidth={2}
                    />
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ⑩ Certifications */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionEyebrow>CHỨNG NHẬN</SectionEyebrow>
          <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
            Đạt tiêu chuẩn quốc tế — yên tâm sử dụng dài hạn
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
          <p className="mt-8 text-sm leading-relaxed text-uk-slate">
            Bảo hành 10 năm cho micro-inverter, 30 năm hiệu suất cho tấm pin,
            25 năm cho khung thép không gỉ — và tuổi thọ hệ thống đến 30 năm.
          </p>
        </div>
      </section>

      <FaqSection
        faqs={solaMateFaqs}
        eyebrow="FAQ"
        title={
          <>
            Câu hỏi <span className="text-gradient">thường gặp</span>
          </>
        }
      />

      <CTA
        eyebrow="BẮT ĐẦU NGAY"
        title={
          <>
            Bắt đầu tiết kiệm điện <span className="text-gradient">từ tháng đầu tiên</span>
          </>
        }
        description="Đăng ký khảo sát miễn phí: chọn tỉnh/thành và kiểu lắp đặt (ban công, che nắng, mặt đất). Kỹ thuật viên liên hệ trong vòng 2 giờ, không ràng buộc, không phí ẩn."
        primaryLabel="Đăng ký khảo sát miễn phí"
        secondaryLabel="Nhắn Zalo ngay"
        secondaryHref="https://wa.me/8618500875025"
      />
      <Footer />
    </>
  )
}
