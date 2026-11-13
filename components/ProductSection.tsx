'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Battery,
  Check,
  ChevronDown,
  Construction,
  PanelTop,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * "Chi tiết từng linh kiện" — the product / components block on the
 * home page.
 *
 * Ported from the NG template's `<section id="product">` in
 * `components/solutions/CollectionPage.tsx` (same tabs, carousel,
 * spec table and highlight list). Only the copy is localised; the
 * numeric specs follow the Vietnamese product pages in
 * `lib/data/products.ts` so the home page cannot contradict
 * /products/module, /products/inverter or /products/battery.
 *
 * UK-only wording ("tested to Eurocode", snow load) was dropped
 * rather than translated — those standards do not apply in Vietnam.
 */

interface ProductDetailTab {
  id: 'module' | 'inverter' | 'battery' | 'mounting'
  label: string
  Icon: LucideIcon
}

const PRODUCT_DETAIL_TABS: ProductDetailTab[] = [
  { id: 'module', label: 'Tấm quang năng', Icon: PanelTop },
  { id: 'inverter', label: 'Bộ biến tần', Icon: Zap },
  { id: 'battery', label: 'Pin lưu trữ', Icon: Battery },
  { id: 'mounting', label: 'Hệ giá đỡ', Icon: Construction },
]

interface ProductDetailContent {
  title: string
  subtitle: string
  /** Target of the carousel's "Xem thêm" overlay — the product detail
      page for this tab's family (`/products/<slug>`). */
  href: string
  description: string
  specs: { label: string; value: string }[]
  highlights: string[]
  images: string[]
}

const PRODUCT_DETAIL_CONTENT: Record<
  ProductDetailTab['id'],
  ProductDetailContent
> = {
  module: {
    title: 'Tấm quang năng đơn tinh thể công suất cao',
    subtitle: '620 W · N-type TOPCon · Toàn đen',
    href: '/products/module',
    description:
      'Dòng QM210THCD-620-640-66 cho hiệu suất chuyển đổi lên tới 23,7% với tế bào N-type TOPCon và hệ số hai mặt 80%. Thiết kế toàn đen hòa vào mái nhà, suy giảm thấp và độ bền ổn định trong điều kiện nắng nóng, nhiều bụi tại Việt Nam.',
    specs: [
      { label: 'Dòng sản phẩm', value: 'QM210THCD-620-640-66' },
      { label: 'Công suất', value: '620 Wp mỗi tấm' },
      { label: 'Loại tế bào', value: 'N-type TOPCon · 132 tế bào nửa cắt' },
      { label: 'Hiệu suất tấm', value: 'Lên tới 23,7%' },
      { label: 'Hệ số hai mặt', value: '80%' },
      { label: 'Suy giảm', value: '0,4%/năm từ năm thứ 2' },
      { label: 'Bảo hành sản phẩm', value: '15 năm' },
      { label: 'Bảo hành hiệu suất', value: '30 năm tuyến tính' },
      { label: 'Cấp bảo vệ', value: 'IP68 (hộp đấu dây)' },
    ],
    highlights: [
      'Thiết kế toàn đen — hòa vào mái nhà, không phá kiến trúc',
      'Hiệu suất đến 23,7%, tạo nhiều điện hơn trên cùng diện tích mái',
      'Hệ số hai mặt 80% — tận dụng ánh sáng phản xạ, thêm tới 10% sản lượng',
      'Suy giảm 0,4%/năm từ năm thứ 2 — sản lượng ổn định dài hạn',
      'Chịu được nắng nóng, bụi bẩn và khí hậu ven biển',
    ],
    images: [
      '/images/product-module-1.webp',
      '/images/product-module-2.webp',
      '/images/product-module-3.webp',
    ],
  },
  inverter: {
    title: 'Bộ biến tần hybrid và độc lập lưới',
    subtitle: '3–12 kW một pha · 5–20 kW ba pha · 6 kW độc lập lưới',
    href: '/products/inverter',
    description:
      'Ba dòng biến tần phủ toàn bộ nhu cầu: hybrid một pha 3–12 kW cho hộ gia đình, hybrid ba pha 5–20 kW cho công trình lớn, và bộ độc lập lưới 6 kW cho nhu cầu dự phòng thuần túy.',
    specs: [
      {
        label: 'Dòng sản phẩm',
        value: 'SWH một pha · SWH ba pha · SWO độc lập lưới',
      },
      { label: 'Công suất AC', value: '3–12 kW · 5–20 kW · 6 kW' },
      {
        label: 'Quá tải PV',
        value: '200% (một pha) · đến 160% (ba pha)',
      },
      { label: 'Điện áp pin', value: '48 V — điện áp thấp' },
      { label: 'Loại pin', value: 'Li-ion / axit-chì' },
      {
        label: 'Chuyển dự phòng',
        value: '<4 ms (một pha) · <10 ms (ba pha)',
      },
      {
        label: 'Hiệu suất tối đa',
        value: '97,6% (một pha) · 97,8–97,9% (ba pha)',
      },
      { label: 'Cấp bảo vệ', value: 'IP66 (SWH) · IP65 (SWO)' },
      { label: 'Nhiệt độ hoạt động', value: '−35 ~ +60 °C' },
      {
        label: 'Giao tiếp',
        value: 'RS485 · WiFi + LAN + Bluetooth · Modbus',
      },
      { label: 'Chứng nhận', value: 'TBD — chờ xác nhận tại Việt Nam' },
    ],
    highlights: [
      'Hybrid một pha 3–12 kW, mỗi chuỗi 20 A, công suất tấm pin tối đa gấp đôi công suất ra',
      'Hybrid ba pha 5–20 kW với đầu vào PV lên tới 40 kW',
      'Chuyển sang pin dự phòng dưới 4 ms (một pha) và dưới 10 ms (ba pha)',
      'AFCI chủ động bằng AI và chống sét SPD Type II, vỏ IP66',
      'Bộ chạy độc lập lưới 6 kW cho nhu cầu dự phòng, có cân bằng tải',
    ],
    images: [
      '/images/products/inverter/swh-single-phase-1.webp',
      '/images/products/inverter/swh-three-phase-1.webp',
      '/images/products/inverter/swo-6000w.webp',
    ],
  },
  battery: {
    title: 'Pin lưu trữ LiFePO₄',
    subtitle: 'Dòng SWR · 51,2 V điện áp thấp · 5,12–16,08 kWh',
    href: '/products/battery',
    description:
      'Mô-đun SWR có hai dung lượng 5,12 và 16,08 kWh, ghép song song tối đa 16 bộ — đủ cho một hộ gia đình hoặc cả một công trình. Sạc xả liên tục 1C, vỏ IP65 lắp ngoài trời, bảo hành 10 năm.',
    specs: [
      { label: 'Hóa học', value: 'LiFePO₄ (lithium iron phosphate)' },
      { label: 'Điện áp danh định', value: '51,2 V (điện áp thấp)' },
      { label: 'Dung lượng', value: '5,12 kWh / 16,08 kWh' },
      { label: 'Dòng danh định', value: '100 Ah / 314 Ah' },
      { label: 'Sạc / xả tối đa', value: '100 A / 200 A' },
      {
        label: 'Tuổi thọ chu kỳ',
        value: '>8.000 chu kỳ (0,5C) · ≥10.000 chu kỳ (0,35C), DOD 90%',
      },
      {
        label: 'Kích thước (D × R × C)',
        value: '600 × 480 × 180 mm / 840 × 490 × 250 mm',
      },
      { label: 'Khối lượng', value: '52 kg / 128 kg' },
      {
        label: 'Nhiệt độ hoạt động',
        value: 'Sạc 0 ~ 55 °C · Xả −20 ~ 55 °C',
      },
      { label: 'Cấp bảo vệ', value: 'IP65' },
      { label: 'Giao tiếp', value: 'RS485 · RS232 · CAN' },
      { label: 'Số bộ song song tối đa', value: '16' },
      { label: 'Bảo hành', value: '10 năm' },
    ],
    highlights: [
      'Ghép song song tối đa 16 mô-đun, mở rộng dung lượng theo nhu cầu',
      'Sạc xả liên tục 1C/1C',
      'Lắp đặt linh hoạt — các mô-đun khác mức sạc vẫn ghép an toàn',
      'Khóa ngắn mạch và chống xung điện cho an toàn toàn diện',
      'Tự sưởi (−20 °C đến 55 °C, tùy chọn) để lắp ngoài trời',
      'Bảo hành tiêu chuẩn 10 năm',
    ],
    images: [
      '/images/products/battery/swr-5-12-front.webp',
      '/images/products/battery/swr-16-08-front.webp',
      '/images/products/battery/swr-5-12-left.webp',
    ],
  },
  mounting: {
    title: 'Hệ giá đỡ vạn năng',
    subtitle: 'Lắp nhanh · An toàn · Không hại mái',
    // No standalone mounting product page exists — the mounting system
    // ships with the module line, so route to /products/module.
    href: '/products/module',
    description:
      'Hệ giá đỡ được thiết kế và sản xuất tại nhà máy, tối ưu cho mọi loại mái phổ biến. Với mái ngói, không cần xuyên mái — kết cấu mái được giữ nguyên hoàn toàn.',
    specs: [
      {
        label: 'Loại mái tương thích',
        value: 'Ngói / Đá phiến / Tôn sóng / Mái bằng',
      },
      { label: 'Vật liệu', value: 'Nhôm anod + thép không gỉ A2' },
      { label: 'Tải trọng gió', value: 'Đến 2.400 Pa' },
      { label: 'Tải trọng nâng', value: 'Đến 5.400 Pa' },
      { label: 'Kiểu kẹp', value: 'Hệ kẹp tối ưu cho thi công' },
      {
        label: 'Móc mái',
        value: 'Điều chỉnh độ cao, không cần cắt ngói',
      },
    ],
    highlights: [
      'Không xuyên mái — nâng ngói lên thay vì khoan',
      'Tương thích mọi khung tấm phổ biến và cả tấm không viền',
      'Ray đen đồng bộ với tấm pin toàn đen',
      'Linh kiện lắp sẵn — thi công trên mái nhanh hơn',
    ],
    images: [
      '/images/product-mounting-1.webp',
      '/images/product-mounting-2.webp',
      '/images/product-mounting-3.webp',
    ],
  },
}

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState<ProductDetailTab['id']>('module')
  const [imageIdx, setImageIdx] = useState(0)
  const content = PRODUCT_DETAIL_CONTENT[activeTab]
  const imageCount = content.images.length

  // Auto-rotate the carousel every 4s; reset to first image when the
  // tab changes (handled by the `key={activeTab}` reset effect below).
  useEffect(() => {
    const id = setInterval(() => {
      setImageIdx((i) => (i + 1) % imageCount)
    }, 4000)
    return () => clearInterval(id)
  }, [activeTab, imageCount])

  // Reset the carousel to image 0 whenever the user switches tabs.
  useEffect(() => {
    setImageIdx(0)
  }, [activeTab])

  return (
    <section
      id="product"
      className="relative py-16 md:py-24 bg-white overflow-hidden scroll-mt-24"
    >
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header — same eyebrow/heading pattern as the rest
            of the page. */}
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            THÔNG SỐ KỸ THUẬT
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Chi tiết từng <span className="text-gradient">linh kiện</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular max-w-2xl mx-auto leading-relaxed">
            Mọi linh kiện đều được thiết kế, sản xuất tại nhà máy và kiểm
            định như một bộ hoàn chỉnh — không trộn thương hiệu, không phải
            đoán khả năng tương thích.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {PRODUCT_DETAIL_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-cw-bold border transition-all duration-300 ${
                activeTab === tab.id
                  ? 'border-uk-teal bg-uk-teal text-white shadow-md shadow-uk-teal/20'
                  : 'border-uk-line bg-white text-uk-slate hover:border-uk-teal/40 hover:text-uk-teal-dark'
              }`}
            >
              <tab.Icon className="w-4 h-4" strokeWidth={1.8} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content: 2-column grid (image carousel | spec + highlights) */}
        <div
          key={activeTab}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Image carousel — auto-rotates, hover reveals "Xem thêm" */}
          <div className="space-y-3">
            <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-uk-line">
              {content.images.map((img, idx) => (
                <div
                  key={`${activeTab}-${idx}`}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    idx === imageIdx
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${content.title} – ảnh ${idx + 1}`}
                    loading="lazy"
                    // `object-contain`, not `cover`: the inverter and
                    // battery shots are alpha-cutout product renders at
                    // 1:1 / 0.60 / 0.74 ratios — `cover` inside this
                    // 4:3 frame crops their sides/top off. The module
                    // and mounting photos are already exactly 4:3, so
                    // `contain` renders them identically with no
                    // letterboxing.
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}

              {/* Hover-revealed "Xem thêm" overlay — routes to the
                  product page for the active tab (`content.href`). */}
              <Link
                href={content.href}
                className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-uk-navy/55 text-white text-sm font-cw-bold transition-opacity"
              >
                Xem thêm →
              </Link>

              {/* Prev / Next arrows */}
              <button
                type="button"
                aria-label="Ảnh trước"
                onClick={() =>
                  setImageIdx((prev) => (prev - 1 + imageCount) % imageCount)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-uk-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <svg
                  className="w-5 h-5 text-uk-navy"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Ảnh sau"
                onClick={() => setImageIdx((prev) => (prev + 1) % imageCount)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-uk-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <svg
                  className="w-5 h-5 text-uk-navy"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2">
              {content.images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Xem ảnh ${idx + 1}`}
                  onClick={() => setImageIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === imageIdx
                      ? 'w-8 bg-uk-teal'
                      : 'w-2 bg-uk-line hover:bg-uk-teal/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Specs + highlights column */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-cw-bold text-uk-navy leading-tight">
                {content.title}
              </h3>
              <p className="mt-1 text-base text-uk-teal-dark font-cw-bold">
                {content.subtitle}
              </p>
              <p className="mt-3 text-base text-uk-slate font-cw-regular leading-relaxed">
                {content.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-cw-bold text-uk-slate uppercase tracking-wider mb-3">
                Thông số kỹ thuật
              </h4>
              <div className="rounded-xl overflow-hidden border border-uk-line bg-white">
                {content.specs.map((spec, idx) => (
                  <div
                    key={`${activeTab}-spec-${idx}`}
                    className={`flex justify-between items-center gap-4 px-4 py-3 ${
                      idx % 2 === 0 ? 'bg-uk-line/20' : 'bg-white'
                    }`}
                  >
                    <span className="text-sm text-uk-slate font-cw-regular">
                      {spec.label}
                    </span>
                    <span className="text-sm text-uk-navy font-cw-bold text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-cw-bold text-uk-slate uppercase tracking-wider mb-3">
                Điểm nổi bật
              </h4>
              <ul className="space-y-2.5">
                {content.highlights.map((item, idx) => (
                  <li
                    key={`${activeTab}-hl-${idx}`}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-uk-emerald/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-uk-emerald" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-uk-navy font-cw-regular leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/support"
              className="inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal-dark hover:text-uk-teal transition-colors"
            >
              Tài liệu kỹ thuật &amp; hỗ trợ{' '}
              <ChevronDown className="w-4 h-4 -rotate-90" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}