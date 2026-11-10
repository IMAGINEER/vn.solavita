'use client'

import { useState } from 'react'
import {
  CircleDollarSign,
  Clock,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { solaHomeEconomicsExamples } from '@/lib/data/solahome'

/**
 * SolaHomeEconomics — the four figures a buyer actually asks about.
 *
 * The old page showed two unrelated blocks of rows. This version puts
 * the same published examples behind a two-tab control and gives each
 * one the same four-number shape, so the comparison is instant:
 * investment → yearly saving → payback → long-term value.
 *
 * Every figure comes from the flyers or from arithmetic on two printed
 * figures of the same example (spelled out in each `note`). No
 * adjustable tariff slider: the EVN tariff ladder is not confirmed yet,
 * so the module shows the published scenarios and says so.
 */

const TILE_ICONS: LucideIcon[] = [
  CircleDollarSign,
  TrendingUp,
  Clock,
  Sparkles,
]

export default function SolaHomeEconomics() {
  const [activeId, setActiveId] = useState(
    solaHomeEconomicsExamples[0].id,
  )
  const example =
    solaHomeEconomicsExamples.find((item) => item.id === activeId) ??
    solaHomeEconomicsExamples[0]

  const tiles = [
    { label: 'Chi phí đầu tư', value: example.investment, highlight: false },
    { label: 'Tiết kiệm mỗi năm', value: example.annualSaving, highlight: false },
    { label: 'Thời gian hoàn vốn', value: example.payback, highlight: true },
    { label: example.horizonLabel, value: example.horizonValue, highlight: false },
  ]

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-uk-line bg-white">
      <div
        role="tablist"
        aria-label="Chọn cấu hình kinh tế"
        className="flex flex-wrap gap-2 border-b border-uk-line bg-sv-light p-4"
      >
        {solaHomeEconomicsExamples.map((item) => {
          const active = item.id === example.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveId(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-cw-bold transition-colors ${
                active
                  ? 'bg-uk-navy text-white'
                  : 'bg-white text-uk-slate hover:text-uk-navy'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <p className="text-xs font-cw-bold tracking-[0.16em] text-uk-teal-dark uppercase">
            {example.system}
          </p>
          <h3 className="mt-3 text-2xl font-cw-bold leading-snug text-uk-navy">
            {example.headline}
          </h3>
          <p className="mt-4 text-xs leading-relaxed text-uk-slate">
            {example.note}
          </p>
          <p className="mt-4 rounded-xl border border-uk-line bg-sv-light px-4 py-3 text-xs leading-relaxed text-uk-slate">
            <span className="font-cw-bold text-uk-navy">
              Giá thực tế được báo theo cấu hình
            </span>{' '}
            sau khi khảo sát mái. Các con số trên là mức tham chiếu đã công bố,
            không phải báo giá.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          {tiles.map((tile, index) => {
            const Icon = TILE_ICONS[index] ?? TrendingUp
            return (
              <div
                key={tile.label}
                className={`rounded-2xl border p-4 ${
                  tile.highlight
                    ? 'border-uk-teal/50 bg-uk-teal-soft/60'
                    : 'border-uk-line bg-sv-light'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    tile.highlight ? 'text-uk-teal-dark' : 'text-uk-teal'
                  }`}
                  strokeWidth={1.9}
                />
                <dt
                  className={`mt-3 text-[11px] leading-snug ${
                    tile.highlight ? 'text-uk-teal-dark' : 'text-uk-slate'
                  }`}
                >
                  {tile.label}
                </dt>
                <dd
                  className={`mt-1 font-cw-bold ${
                    tile.highlight
                      ? 'text-lg text-uk-teal-dark'
                      : 'text-base text-uk-navy'
                  }`}
                >
                  {tile.value}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>

      <div className="border-t border-uk-line bg-sv-light/60 px-6 py-4 md:px-8">
        <p className="text-[11px] leading-relaxed text-uk-slate">
          Mô hình tính chi tiết theo kWh, đơn giá điện bậc thang EVN và tỷ lệ
          tự tiêu thụ đang chờ xác nhận — hiện trang hiển thị hai cấu hình đã
          công bố. Khi biểu giá được chốt, phần này sẽ cho phép điều chỉnh
          hóa đơn và mức dùng để tính lại.
        </p>
      </div>
    </div>
  )
}