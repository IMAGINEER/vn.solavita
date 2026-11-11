'use client'

import { useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { openFormModal } from '@/lib/form-modal'
import { solaHomePackages } from '@/lib/data/solahome'

/**
 * SolaHomeBillEstimator — the hero's electricity-bill entry point.
 *
 * The brief asks the first screen to answer "what does this cost me
 * today?" with a control instead of a generic CTA. The control is a
 * dropdown of bill bands, and each band maps to exactly one package in
 * the published four-package line-up:
 *
 *   Dưới 2 triệu ₫/tháng    → Gói Cơ Bản (5 kWp)        tiết kiệm 1.766.500 ₫
 *   2 – 4 triệu ₫/tháng     → Gói Phổ Biến (10 kWp)      tiết kiệm 3.842.500 ₫
 *   4 – 6 triệu ₫/tháng     → Gói 10 kWp Ba Pha          tiết kiệm 3.842.500 ₫
 *   Trên 6 triệu ₫/tháng    → Gói Gia Đình Lớn (15 kWp)  tiết kiệm 5.918.500 ₫
 *
 * Each threshold is the published monthly saving of the package it opens,
 * rounded up to the next million — so a band can never promise more
 * saving than the household actually spends. The saving shown in the
 * result is that published figure, never a personalised computation: the
 * EVN tariff ladder is not confirmed yet, and the footnote hands that
 * calculation to the survey.
 *
 * The two 10 kWp packages publish the same saving, so the only thing
 * separating them is the inverter phase. The bands still cover all four
 * packages (the upper 10 kWp band shows the three-phase variant); the
 * survey confirms which phase the house actually has.
 *
 * Layout: the question is the dropdown's placeholder rather than a
 * heading, and the dropdown sits on the same line as the hero's core
 * CTA — the button that opens the consultation form. Both sit directly
 * on the hero photo with no card behind them, so the first screen stays
 * a single row of actions. Selecting a band shows its reference package
 * immediately in one line underneath; there is no submit button.
 */

const BILL_TIERS = [
  {
    id: 'under-2',
    label: 'Dưới 2 triệu ₫/tháng',
    packageId: 'solahome-5kwp',
  },
  {
    id: '2-4',
    label: '2 – 4 triệu ₫/tháng',
    packageId: 'solahome-10kwp',
  },
  {
    id: '4-6',
    label: '4 – 6 triệu ₫/tháng',
    packageId: 'solahome-10kwp-3p',
  },
  {
    id: 'over-6',
    label: 'Trên 6 triệu ₫/tháng',
    packageId: 'solahome-15kwp-3p',
  },
] as const

const BILL_QUESTION = 'Ước tính hóa đơn điện của gia đình bạn'

export default function SolaHomeBillEstimator() {
  const [tierId, setTierId] = useState('')

  const tier = BILL_TIERS.find((t) => t.id === tierId) ?? null
  const pkg = tier
    ? solaHomePackages.find((p) => p.id === tier.packageId) ?? null
    : null

  const openConsultation = () =>
    openFormModal({
      solutionType: 'home',
      interestedProduct:
        tier && pkg
          ? `SolaHome — ${pkg.name} (${tier.label})`
          : 'SolaHome — tư vấn miễn phí',
    })

  return (
    <div className="mt-6 w-full max-w-2xl">
      {/* The dropdown and the consultation CTA share one row — the two
          things the first screen asks the visitor to do. The dropdown
          reuses `.sv-glass-chip`, the compact pill the old quick-pick
          buttons had, rather than a second, heavier input style. */}
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="relative inline-flex items-center">
          <span className="sr-only">{BILL_QUESTION}</span>
          <select
            value={tierId}
            onChange={(event) => setTierId(event.target.value)}
            aria-label={BILL_QUESTION}
            className="sv-glass-chip h-9 w-full appearance-none rounded-full pl-3.5 pr-8 text-sm font-cw-bold outline-none focus-visible:ring-2 focus-visible:ring-uk-teal/40"
          >
            <option value="">{BILL_QUESTION}</option>
            {BILL_TIERS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-uk-navy/60"
            strokeWidth={2.5}
          />
        </label>

        <button
          type="button"
          onClick={openConsultation}
          className="btn-gradient inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-5 text-sm font-cw-bold text-white"
        >
          Nhận tư vấn miễn phí
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      {tier && pkg && (
        <div className="mt-3 [text-shadow:0_1px_10px_rgba(15,23,42,0.55)]">
          <p className="text-xs text-white/70">
            Với mức hóa đơn {tier.label.toLowerCase()}, gói tham chiếu:
          </p>
          <p className="mt-0.5 text-lg font-cw-bold text-gradient [text-shadow:none]">
            {pkg.name} · {pkg.capacity} {pkg.phase}
          </p>
          {/* Inline pointer to the four-package line-up in the
              "CHỌN THEO NHU CẦU SỬ DỤNG" band, directly under the
              recommendation. `#goi-cards` carries `scroll-mt-24`, so
              the fixed header does not cover the "Bốn gói SolaHome"
              heading after the jump. */}
          <a
            href="#goi-cards"
            className="mt-0.5 inline-block text-[11px] font-cw-regular text-white/70 underline underline-offset-2 transition-colors hover:text-white"
          >
            Xem bốn gói SolaHome
          </a>
          <p className="mt-1 text-xs leading-relaxed text-white/75">
            Mức tiết kiệm tham chiếu đã công bố:{' '}
            <span className="font-cw-bold text-uk-emerald">
              {pkg.monthlySaving}
            </span>{' '}
            cho hệ {pkg.capacity} trên mái {pkg.roofArea}.
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-white/55">
            Số liệu theo bảng sản lượng đã công bố; đây chưa phải báo giá. Kỹ
            thuật viên tính lại theo hóa đơn thực tế, hướng nắng và kết cấu mái.
          </p>
        </div>
      )}
    </div>
  )
}