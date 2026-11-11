'use client'

import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { openFormModal } from '@/lib/form-modal'
import {
  formatMillions,
  formatVnd,
  millionsToVnd,
  parseMillions,
  sanitizeMillions,
} from '@/lib/bill-input'
import { solaHomePackages, solaHomeRoofTable } from '@/lib/data/solahome'

/**
 * SolaHomeBillEstimator — the hero's electricity-bill entry point.
 *
 * The brief asks the first screen to answer "what does this cost me
 * today?" with an input instead of a generic CTA. The rule below is
 * deliberately conservative and uses only the published sizing table:
 *
 *   pick the largest published row whose *published* monthly saving
 *   does not exceed the bill the visitor typed.
 *
 * A package cannot save more than the household spends, so the rule
 * cannot over-promise. The result names the nearest package in the
 * four-package line-up and states the published reference saving — it
 * never computes a personalised saving, because the EVN tariff ladder
 * is not confirmed yet. The final sentence hands that calculation to
 * the survey.
 *
 * **Unit**: the visitor types the bill in *triệu ₫/tháng* ("2,5" =
 * 2,5 million VND), the way Vietnamese households actually talk about
 * it ("hóa đơn 3 triệu"). Typing "3.000.000" was the single biggest
 * friction in this field; the internal value is still VND, only the
 * input is scaled.
 */

const BILL_PRESETS = ['2', '3', '5', '8']

function pickRow(bill: number) {
  const affordable = solaHomeRoofTable.filter(
    (row) => row.monthlySavingVnd <= bill,
  )
  // Rows are ordered by capacity, so the last affordable row is the
  // largest system the current bill can plausibly absorb.
  return affordable.length > 0
    ? affordable[affordable.length - 1]
    : solaHomeRoofTable[0]
}

export default function SolaHomeBillEstimator() {
  const [billText, setBillText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const millions = useMemo(() => parseMillions(billText), [billText])
  const bill = millionsToVnd(millions)
  const row = submitted && bill > 0 ? pickRow(bill) : null
  const pkg = row?.packageId
    ? solaHomePackages.find((p) => p.id === row.packageId) ?? null
    : null
  const billIsBelowReference = row ? row.monthlySavingVnd > bill : false

  const submit = () => {
    if (bill > 0) setSubmitted(true)
  }

  return (
    /* A white translucent frosted pane over the hero photo — see the
       `.sv-glass-*` rules in app/globals.css. The copy inside uses
       the deep navy of the brand rather than the light-mode slate,
       because the glass sits over a dark image. */
    <div className="sv-glass-card mt-6 w-full max-w-2xl rounded-2xl p-4 sm:p-5">
      <p className="flex items-center gap-2 text-[11px] font-cw-bold tracking-[0.18em] text-uk-navy uppercase">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-uk-emerald" />
        Ước tính hóa đơn điện của gia đình bạn
      </p>

      <form
        className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <label className="min-w-0 flex-1">
          <span className="sr-only">
            Hóa đơn điện trung bình mỗi tháng, triệu đồng
          </span>
          {/* The input row and the button share one height, and the row
              is pinned to the top of the column — the button used to
              bottom-align against the caption below the field, which
              pushed it a whole line below the input. */}
          <span className="sv-glass-field flex items-baseline gap-2 rounded-xl px-4 py-2.5 sm:h-[50px]">
            <input
              value={billText}
              onChange={(event) => {
                setBillText(sanitizeMillions(event.target.value))
                setSubmitted(false)
              }}
              inputMode="decimal"
              autoComplete="off"
              placeholder="3"
              aria-label="Hóa đơn điện trung bình mỗi tháng, triệu đồng Việt Nam"
              className="w-full min-w-0 bg-transparent text-lg font-cw-bold text-uk-navy outline-none placeholder:text-uk-navy/35"
            />
            <span className="sv-muted shrink-0 text-sm">triệu ₫/tháng</span>
          </span>
          <span className="sv-muted mt-1.5 block text-[11px]">
            Hóa đơn điện trung bình mỗi tháng — nhập theo triệu đồng, ví dụ 2,5
            là 2,5 triệu đồng
          </span>
        </label>

        <button
          type="submit"
          disabled={bill <= 0}
          className="btn-gradient inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 font-cw-bold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-[50px]"
        >
          Xem gói phù hợp
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>

      {/* Quick picks — most visitors should not have to type at all. */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="sv-muted text-[11px]">Hoặc chọn nhanh:</span>
        {BILL_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              setBillText(preset)
              setSubmitted(false)
            }}
            className="sv-glass-chip rounded-full px-3 py-1 text-[11px] font-cw-bold transition-colors"
          >
            {preset} triệu
          </button>
        ))}
      </div>

      {row && (
        <div className="sv-glass-panel mt-4 rounded-xl p-4">
          <p className="sv-muted text-xs">
            Với hóa đơn ~{formatMillions(millions)} triệu ₫/tháng, gói tham
            chiếu:
          </p>
          <p className="mt-1 text-base font-cw-bold text-uk-navy">
            {pkg ? `${pkg.name} · ${pkg.capacity}` : 'Cấu hình riêng theo khảo sát'}
          </p>
          <p className="sv-muted mt-1 text-xs leading-relaxed">
            Mức tiết kiệm tham chiếu đã công bố:{' '}
            <span className="sv-teal-chip inline-block rounded-md px-1.5 py-0.5 font-cw-bold">
              {row.monthlySaving}/tháng
            </span>{' '}
            cho hệ {row.capacity} trên mái {row.area}.
            {billIsBelowReference
              ? ' Hóa đơn của bạn thấp hơn mức tham chiếu của hệ nhỏ nhất — kỹ thuật viên sẽ kiểm tra lại mức dùng thực tế.'
              : ''}
          </p>
          <button
            type="button"
            onClick={() =>
              openFormModal({
                solutionType: 'home',
                interestedProduct: `SolaHome — hóa đơn ${formatVnd(bill)} ₫/tháng`,
              })
            }
            className="btn-gradient mt-3 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-cw-bold text-white"
          >
            Nhận tư vấn miễn phí
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <p className="sv-muted mt-2 text-[10px] leading-relaxed">
            Số liệu theo bảng sản lượng đã công bố; đây chưa phải báo giá. Kỹ
            thuật viên tính lại theo hóa đơn thực tế, hướng nắng và kết cấu mái.
          </p>
        </div>
      )}
    </div>
  )
}
