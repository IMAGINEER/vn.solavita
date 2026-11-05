'use client'

import {
  ArrowRight,
  BatteryCharging,
  Check,
  CloudSun,
  Home,
  Layers,
  ShieldCheck,
  Sun,
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
  solaHomeBackups,
  solaHomeCases,
  solaHomeCertifications,
  solaHomeEconomics,
  solaHomeFaqs,
  solaHomeModes,
  solaHomeMounts,
  solaHomePackagePriceNote,
  solaHomePackages,
  solaHomeProcess,
  solaHomeRoofTable,
  solaHomeRoofTableNote,
  solaHomeWarranty,
} from '@/lib/data/solahome'

/**
 * /solutions/solahome — SolaHome, the rooftop PV line for villas & houses.
 *
 * Structure (VN):
 *   1. Hero — the roof as an unexploited power plant
 *   2. Two installation types: SolaRoof (on the roof) vs SolaLoft (steel
 *      frame, sky loft)
 *   3. The four packages — 5 / 10 / 10 three-phase / 15 kWp, each with a
 *      SolaRoof and a SolaLoft price
 *   4. Roof-area lookup table (published sizing table)
 *   5. Two optional backup solutions — battery + hybrid inverter
 *   6. Three operating modes
 *   7. Eight-step delivery flow
 *   8. Published economics (payback + cash-flow example)
 *   9. Certifications & warranty
 *  10. FAQ
 *  11. Survey CTA
 *
 * Copy is written for a Vietnamese reader. Every figure comes from the
 * official Skyworth VN flyers / product pages.
 */

export default function SolaHomePage() {
  return (
    <>
      <Header logoHref="/" />
      <PageHero
        backgroundImage="/images/solahome/hero.webp"
        eyebrow="SolaHome · Biệt thự & nhà phố"
        title={'Mái nhà của bạn là một nhà máy điện\nchưa được khai thác.*'}
        body="SolaHome lắp điện mặt trời trực tiếp trên mái nhà, kết hợp biến tần hybrid và pin lưu trữ để cấp điện liên tục 24/7. Hai kiểu lắp — SolaRoof trên mái, SolaLoft trên khung kiến trúc — và bốn gói công suất cho mọi quy mô ngôi nhà."
        primaryCta={{ label: 'Khảo sát miễn phí', onClick: openFormModal }}
        secondaryCta={{ label: 'Xem 4 gói', href: '#goi-solahome' }}
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Giải pháp', href: '/solutions/solahome/' },
          { label: 'SolaHome' },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Sun, text: '4 gói: 5 · 10 · 10 ba pha · 15 kWp' },
            { icon: Layers, text: '2 kiểu lắp: SolaRoof & SolaLoft' },
            { icon: Zap, text: 'Tự chủ 100% điện năng 24/7' },
            { icon: ShieldCheck, text: 'Dưới 15 kW không cần xin phép lưới' },
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

      {/* ② Two installation types */}
      <section id="kieu-lap-dat" className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>2 KIỂU LẮP ĐẶT</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              SolaRoof hay SolaLoft — chọn theo mái và khuôn viên nhà bạn
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate">
              Cùng một hệ tấm pin, biến tần hybrid và pin lưu trữ. Khác biệt
              nằm ở cách hệ thống đặt trên mái — và ở phần giá.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {solaHomeMounts.map((m) => (
              <article
                key={m.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-uk-line bg-white"
              >
                <img
                  src={m.imagePath}
                  alt={m.imageAlt}
                  className="h-64 w-full object-cover"
                  loading="lazy"
                />
                <div className="flex flex-1 flex-col p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-uk-teal-soft text-uk-teal-dark">
                      {m.id === 'solaroof' ? (
                        <Home className="h-6 w-6" strokeWidth={1.8} />
                      ) : (
                        <Layers className="h-6 w-6" strokeWidth={1.8} />
                      )}
                    </span>
                    <h3 className="text-2xl font-cw-bold text-uk-navy">
                      {m.name}
                    </h3>
                  </div>

                  <p className="mt-5 font-cw-bold text-uk-teal-dark">
                    {m.headline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-uk-slate">
                    {m.body}
                  </p>

                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {m.benefits.map((b) => (
                      <li
                        key={b.title}
                        className="rounded-xl bg-sv-light p-4"
                      >
                        <p className="text-sm font-cw-bold text-uk-navy">
                          {b.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-uk-slate">
                          {b.body}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-6 divide-y divide-uk-line border-t border-uk-line">
                    {m.specs.map((s) => (
                      <div
                        key={s.label}
                        className="flex flex-wrap items-baseline justify-between gap-2 py-2.5"
                      >
                        <dt className="text-xs text-uk-slate">{s.label}</dt>
                        <dd className="text-xs font-cw-bold text-uk-navy">
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-6 rounded-xl border border-uk-line px-4 py-3 text-xs leading-relaxed text-uk-slate">
                    <span className="font-cw-bold text-uk-navy">
                      Phù hợp với:{' '}
                    </span>
                    {m.bestFor}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ③ Four packages */}
      <section id="goi-solahome" className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>4 GÓI SẢN PHẨM</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Chọn công suất theo mái — giá theo kiểu lắp
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate">
              Bốn gói, cùng một hệ sinh hoạt — khác nhau ở công suất, số pha
              và cách bố trí trên mái. Mỗi gói có hai mức giá: SolaRoof và
              SolaLoft.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {solaHomePackages.map((p) => (
              <article
                key={p.id}
                className="flex flex-col rounded-3xl border border-uk-line bg-white p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-cw-bold text-uk-navy">
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

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-3xl font-cw-bold text-uk-teal-dark">
                    {p.capacity}
                  </span>
                  <span className="text-sm text-uk-slate">
                    · Biến tần {p.phase}
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-uk-line pt-5 text-sm">
                  {[
                    { k: 'Diện tích mái', v: p.roofArea },
                    { k: 'Công suất DC', v: p.dcRange },
                    { k: 'Biến tần hybrid', v: p.inverter },
                    { k: 'Phù hợp với', v: p.fits },
                  ].map((row) => (
                    <div key={row.k}>
                      <dt className="text-xs text-uk-slate">{row.k}</dt>
                      <dd className="mt-0.5 font-cw-bold text-uk-navy">
                        {row.v}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-uk-line p-4">
                    <p className="text-xs font-cw-bold tracking-wider text-uk-slate uppercase">
                      SolaRoof
                    </p>
                    <p className="mt-1 font-cw-bold text-uk-navy">
                      {p.priceRoof}
                    </p>
                  </div>
                  <div className="rounded-xl border border-uk-teal/30 bg-uk-teal-soft/40 p-4">
                    <p className="text-xs font-cw-bold tracking-wider text-uk-teal-dark uppercase">
                      SolaLoft
                    </p>
                    <p className="mt-1 font-cw-bold text-uk-navy">
                      {p.priceLoft}
                    </p>
                  </div>
                </div>

                <a
                  href="/contact-us/"
                  className="btn-gradient mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-cw-bold text-white"
                >
                  Nhận báo giá {p.capacity}
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </a>
              </article>
            ))}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-uk-slate">
            {solaHomePackagePriceNote}
          </p>
        </div>
      </section>

      {/* ④ Roof-area lookup table */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>TRA BẢNG NHANH</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Mái bao nhiêu ㎡ thì lắp được bao nhiêu kWp
            </h2>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-uk-line">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-sv-light text-uk-slate">
                  {[
                    'Diện tích mái',
                    'Công suất lý thuyết',
                    'Số tấm pin (620 W)',
                    'Sản lượng/ngày',
                    'Tiết kiệm điện/tháng',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-xs font-cw-bold tracking-wider uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-uk-line">
                {solaHomeRoofTable.map((r) => (
                  <tr key={r.area} className="text-uk-navy">
                    <td className="px-5 py-4 font-cw-bold">{r.area}</td>
                    <td className="px-5 py-4">{r.capacity}</td>
                    <td className="px-5 py-4">{r.panels}</td>
                    <td className="px-5 py-4">{r.dailyOutput}</td>
                    <td className="px-5 py-4 font-cw-bold text-uk-teal-dark">
                      {r.monthlySaving}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-uk-slate">
            {solaHomeRoofTableNote}
          </p>
        </div>
      </section>

      {/* ⑤ Backup solutions */}
      <section id="phuong-an-pin" className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>PHƯƠNG ÁN BỔ SUNG PIN</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Hai cách thêm dự phòng — ghép pin với biến tần hybrid
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate">
              Các gói SolaHome không bắt buộc kèm pin. Khi muốn có dự phòng
              khi mất điện, chọn một trong hai phương án bên dưới — mỗi phương
              án là một cặp pin và biến tần tương thích.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {solaHomeBackups.map((b) => (
              <article
                key={b.id}
                className="flex flex-col rounded-3xl border border-uk-line bg-white p-8"
              >
                <h3 className="text-xl font-cw-bold text-uk-navy">{b.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-uk-slate">
                  {b.fits}
                </p>

                <div className="mt-6 rounded-2xl bg-sv-light p-5">
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
                  <p className="mt-2 text-sm font-cw-bold text-uk-teal-dark">
                    {b.battery.price}
                  </p>
                  <p className="mt-1 text-xs text-uk-slate">{b.battery.note}</p>
                </div>

                <div className="mt-4 rounded-2xl bg-sv-light p-5">
                  <p className="flex items-center gap-2 text-xs font-cw-bold tracking-wider text-uk-slate uppercase">
                    <Zap className="h-4 w-4 text-uk-teal-dark" strokeWidth={2} />
                    Biến tần hybrid
                  </p>
                  <p className="mt-2 font-cw-bold text-uk-navy">
                    {b.inverter.model}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-uk-slate">
                    {b.inverter.note}
                  </p>
                </div>

                <ul className="mt-6 space-y-2.5">
                  {b.benefits.map((t) => (
                    <li key={t} className="flex gap-2.5 text-sm text-uk-navy">
                      <Check
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-uk-teal-dark"
                        strokeWidth={2.5}
                      />
                      <span className="leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ⑥ Operating modes */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>3 CHẾ ĐỘ HOẠT ĐỘNG</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Hệ thống tự quyết định lấy điện từ đâu
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {solaHomeModes.map((m, i) => (
              <div
                key={m.title}
                className="rounded-2xl border border-uk-line bg-sv-light p-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-uk-teal-dark">
                  {i === 0 ? (
                    <Sun className="h-5 w-5" strokeWidth={1.9} />
                  ) : i === 1 ? (
                    <BatteryCharging className="h-5 w-5" strokeWidth={1.9} />
                  ) : (
                    <CloudSun className="h-5 w-5" strokeWidth={1.9} />
                  )}
                </span>
                <h3 className="mt-5 text-lg font-cw-bold text-uk-navy">
                  {m.title}
                </h3>
                <p className="mt-1 text-xs font-cw-bold tracking-wider text-uk-teal-dark uppercase">
                  {m.subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-uk-slate">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑦ Process */}
      <section className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>QUY TRÌNH</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Từ đăng ký đến thu hoạch điện
            </h2>
          </div>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solaHomeProcess.map((s, i) => (
              <li
                key={s.title}
                className="rounded-2xl border border-uk-line bg-white p-5"
              >
                <span className="font-cw-bold text-uk-teal text-sm">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-cw-bold text-uk-navy">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-uk-slate">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ⑧ Economics */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>KINH TẾ HỆ THỐNG</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Hoàn vốn và dòng tiền dài hạn
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {solaHomeEconomics.map((e) => (
              <div
                key={e.headline}
                className="rounded-3xl border border-uk-line bg-sv-light p-7"
              >
                <h3 className="text-lg font-cw-bold text-uk-navy">
                  {e.headline}
                </h3>
                <dl className="mt-5 divide-y divide-uk-line">
                  {e.rows.map((r) => (
                    <div
                      key={r.label}
                      className="flex items-baseline justify-between gap-4 py-3"
                    >
                      <dt className="text-sm text-uk-slate">{r.label}</dt>
                      <dd className="font-cw-bold text-uk-navy">{r.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-uk-slate">
                  {e.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑨ Real VN installations */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>DỰ ÁN THỰC TẾ</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Những mái nhà đã thay đổi
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uk-slate">
              Kết quả từ các hộ gia đình đã lắp đặt tại Việt Nam — công suất,
              địa điểm và mức giảm hóa đơn đều theo dữ liệu đã công bố.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {solaHomeCases.map((c) => (
              <figure
                key={c.id}
                className="overflow-hidden rounded-2xl border border-uk-line bg-white"
              >
                <img
                  src={c.imagePath}
                  alt={c.imageAlt}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-lg font-cw-bold text-uk-navy">
                      {c.capacity}
                    </span>
                    <span className="font-cw-bold text-uk-teal-dark">
                      {c.billReduction}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-uk-slate">{c.location}</p>
                  <p className="mt-3 text-sm font-cw-bold text-uk-navy">
                    Tiết kiệm {c.monthlySaving}
                  </p>
                  <p className="mt-1 text-xs text-uk-slate">{c.owner}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ⑩ Certifications + warranty */}
      <section className="bg-sv-light py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <SectionEyebrow>CHỨNG NHẬN & BẢO HÀNH</SectionEyebrow>
            <h2 className="mt-5 text-3xl font-cw-bold leading-tight text-uk-navy md:text-4xl">
              Đạt tiêu chuẩn quốc tế — yên tâm sử dụng dài hạn
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {solaHomeCertifications.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-uk-line bg-white px-5 py-2.5 text-sm font-cw-bold text-uk-navy"
                >
                  {c}
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

      <CTA
        eyebrow="KHẢO SÁT MIỄN PHÍ"
        title={
          <>
            Bắt đầu sử dụng năng lượng thông minh <span className="text-gradient">với SolaHome</span>
          </>
        }
        description="Đăng ký khảo sát miễn phí: kỹ thuật viên đo đạc mái, đánh giá công suất và nhu cầu dự phòng, rồi gửi báo giá trong 24 giờ. Không ràng buộc, không phí ẩn."
        primaryLabel="Đăng ký khảo sát miễn phí"
        secondaryLabel="Xem sản phẩm"
        secondaryHref="/products/module/"
      />
      <Footer />
    </>
  )
}
