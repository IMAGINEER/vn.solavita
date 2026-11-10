'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { openFormModal } from '@/lib/form-modal'
import {
  formatMillions,
  millionsToVnd,
  parseMillions,
  sanitizeMillions,
} from '@/lib/bill-input'
import {
  solaHomePackages,
  solaHomeRoofTable,
  type SolaHomeRoofRow,
} from '@/lib/data/solahome'

/**
 * SolaHomeSizingMatcher — "which package is mine?"
 *
 * Two questions replace the standalone lookup table:
 *   1. how much roof do you have (m²), and
 *   2. what is your monthly bill (triệu ₫)?
 *
 * The recommendation is the largest published sizing row that fits
 * both constraints. Nothing is estimated: every row and every saving
 * is the published table. When an input falls outside the table the
 * matcher clamps to the closest published row and says so.
 *
 * The bill is typed in **triệu ₫/tháng** ("2,5" = 2,5 million VND) so
 * nobody has to type a wall of zeros; the matching still happens in
 * VND. See `lib/bill-input.ts`.
 */

const vnNumber = new Intl.NumberFormat('vi-VN')

interface Recommendation {
  row: SolaHomeRoofRow
  /** The typed roof area is below the smallest published band. */
  areaClamped: boolean
  /** The typed bill is below the smallest row's reference saving. */
  billClamped: boolean
}

function recommend(area: number, bill: number): Recommendation | null {
  if (area <= 0 && bill <= 0) return null

  let rows = solaHomeRoofTable
  let areaClamped = false
  let billClamped = false

  if (area > 0) {
    const fitsArea = rows.filter((row) => row.areaMin <= area)
    if (fitsArea.length > 0) {
      rows = fitsArea
    } else {
      rows = [rows[0]]
      areaClamped = true
    }
  }

  if (bill > 0) {
    const fitsBill = rows.filter((row) => row.monthlySavingVnd <= bill)
    if (fitsBill.length > 0) {
      rows = fitsBill
    } else {
      rows = [rows[0]]
      billClamped = true
    }
  }

  return { row: rows[rows.length - 1], areaClamped, billClamped }
}

function packageLabel(row: SolaHomeRoofRow) {
  if (!row.packageId) return 'Cấu hình riêng'
  const pkg = solaHomePackages.find((item) => item.id === row.packageId)
  return pkg ? `${pkg.name} · ${pkg.capacity}` : 'Cấu hình riêng'
}

export default function SolaHomeSizingMatcher({
  selectedPackageId,
  onSelectPackage,
}: {
  selectedPackageId: string | null
  onSelectPackage: (id: string | null) => void
}) {
  const [areaDigits, setAreaDigits] = useState('')
  // The bill is typed in triệu ₫ ("2,5"), not in raw đồng.
  const [billText, setBillText] = useState('')
  // The published table stays folded away until the visitor enters a
  // number — before that, the table is background noise. Typing a value
  // opens it; the header stays a toggle either way.
  const [tableOpen, setTableOpen] = useState(false)

  const area = Number(areaDigits || 0)
  const bill = millionsToVnd(parseMillions(billText))
  const result = useMemo(() => recommend(area, bill), [area, bill])

  // Keep the package cards in sync with the matcher: as soon as there
  // is a result, the matching card carries the "Phù hợp với ước tính"
  // marker — no extra click needed to see which one it is.
  useEffect(() => {
    onSelectPackage(result ? (result.row.packageId ?? null) : null)
  }, [result, onSelectPackage])

  const selectRecommendation = () => {
    onSelectPackage(result?.row.packageId ?? null)
    document
      .getElementById('goi-cards')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-uk-line bg-white">
      <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_1fr] md:p-8">
        <div>
          <p className="flex items-center gap-2 text-xs font-cw-bold tracking-[0.18em] text-uk-teal-dark uppercase">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
            Ước tính theo nhà của bạn
          </p>
          <h3 className="mt-3 text-2xl font-cw-bold leading-snug text-uk-navy">
            Nhập mái và hóa đơn — xem gói gần nhất
          </h3>
          <p className="mt-3 rounded-2xl border border-uk-line bg-sv-light/60 px-4 py-3 text-sm leading-relaxed text-uk-slate">
            Bảng công bố của SolaHome được xây theo diện tích mái — chỉ cần
            diện tích là đủ, có hóa đơn điện thì gợi ý sát hơn. Cấu hình cuối
            cùng còn phụ thuộc kết cấu mái, hướng nắng và khung giờ dùng điện.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-cw-bold text-uk-navy">
                Diện tích mái khả dụng
              </span>
              <span className="mt-1.5 flex items-baseline gap-2 rounded-xl border border-uk-line bg-white px-3.5 py-2.5 transition-colors focus-within:border-uk-teal focus-within:ring-2 focus-within:ring-uk-teal/20">
                <input
                  value={areaDigits}
                  onChange={(event) => {
                    const next = event.target.value
                      .replace(/\D/g, '')
                      .slice(0, 4)
                    setAreaDigits(next)
                    if (next) setTableOpen(true)
                  }}
                  inputMode="numeric"
                  placeholder="50"
                  aria-label="Diện tích mái khả dụng, mét vuông"
                  className="w-full min-w-0 bg-transparent font-cw-bold text-uk-navy outline-none placeholder:text-uk-slate/50"
                />
                <span className="shrink-0 text-xs text-uk-slate">m²</span>
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-cw-bold text-uk-navy">
                Hóa đơn điện mỗi tháng
              </span>
              <span className="mt-1.5 flex items-baseline gap-2 rounded-xl border border-uk-line bg-white px-3.5 py-2.5 transition-colors focus-within:border-uk-teal focus-within:ring-2 focus-within:ring-uk-teal/20">
                <input
                  value={billText}
                  onChange={(event) => {
                    const next = sanitizeMillions(event.target.value)
                    setBillText(next)
                    if (next) setTableOpen(true)
                  }}
                  inputMode="decimal"
                  placeholder="3"
                  aria-label="Hóa đơn điện mỗi tháng, triệu đồng Việt Nam"
                  className="w-full min-w-0 bg-transparent font-cw-bold text-uk-navy outline-none placeholder:text-uk-slate/50"
                />
                <span className="shrink-0 text-xs text-uk-slate">triệu ₫</span>
              </span>
            </label>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-2xl bg-sv-light p-5">
          {result ? (
            <>
              <p className="text-xs text-uk-slate">
                Gói gần nhất trong danh mục SolaHome
              </p>
              <p className="mt-1 text-xl font-cw-bold text-uk-navy">
                {packageLabel(result.row)}
              </p>

              <dl className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-uk-slate">Công suất tham chiếu</dt>
                  <dd className="font-cw-bold text-uk-navy">
                    {result.row.capacity}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-uk-slate">Số tấm pin · 620 W</dt>
                  <dd className="font-cw-bold text-uk-navy">
                    {result.row.panels}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-uk-slate">Diện tích mái</dt>
                  <dd className="font-cw-bold text-uk-navy">
                    {result.row.area}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-uk-slate">Sản lượng/ngày</dt>
                  <dd className="font-cw-bold text-uk-navy">
                    {result.row.dailyOutput}
                  </dd>
                </div>
              </dl>

              {(result.areaClamped || result.billClamped) && (
                <p className="mt-3 text-[11px] leading-relaxed text-uk-slate">
                  {result.areaClamped
                    ? `Mái ${vnNumber.format(area)} m² nhỏ hơn mức tối thiểu đã công bố — đang hiển thị hệ nhỏ nhất. `
                    : ''}
                  {result.billClamped
                    ? 'Hóa đơn thấp hơn mức tiết kiệm tham chiếu của hệ nhỏ nhất — kỹ thuật viên sẽ kiểm tra lại mức dùng thực tế. '
                    : ''}
                  Kết quả cuối cùng phụ thuộc kết cấu mái, hướng nắng và giờ dùng điện.
                </p>
              )}

              <div className="mt-4 flex flex-col gap-2">
                {result.row.packageId && (
                  <button
                    type="button"
                    onClick={selectRecommendation}
                    className="btn-gradient inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-cw-bold text-white"
                  >
                    Xem gói phù hợp
                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    openFormModal({
                      solutionType: 'home',
                      interestedProduct: `SolaHome — ${result.row.capacity} (mái ${result.row.area}${
                        bill > 0
                          ? `, hóa đơn ${formatMillions(parseMillions(billText))} triệu ₫/tháng`
                          : ''
                      })`,
                    })
                  }
                  className="inline-flex items-center justify-center rounded-full border border-uk-line bg-white px-4 py-2.5 text-sm font-cw-bold text-uk-navy transition-colors hover:border-uk-teal hover:text-uk-teal-dark"
                >
                  Nhận báo giá theo cấu hình này
                </button>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[220px] flex-col justify-center">
              <p className="font-cw-bold text-uk-navy">
                Kết quả sẽ hiện ở đây
              </p>
              <p className="mt-2 text-sm leading-relaxed text-uk-slate">
                Công suất, số tấm pin và diện tích mái tương ứng với hai ô
                bên cạnh.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Published lookup table — folded away until the visitor types a
          number, because the matcher above already answers the
          question. The header doubles as the toggle. */}
      <div className="border-t border-uk-line bg-sv-light/60 px-6 py-4 md:px-8">
        <button
          type="button"
          onClick={() => setTableOpen((open) => !open)}
          aria-expanded={tableOpen}
          className="flex w-full items-center justify-between gap-4 text-left"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-cw-bold tracking-[0.16em] text-uk-slate uppercase">
              Bảng tra công bố theo diện tích mái
            </span>
            <span className="mt-1 block text-[11px] leading-relaxed text-uk-slate">
              {tableOpen
                ? 'Ẩn bảng tra cấu hình'
                : 'Nhập diện tích mái hoặc hóa đơn để mở bảng tra cấu hình'}
            </span>
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-uk-teal-dark transition-transform duration-300 ${
              tableOpen ? 'rotate-180' : ''
            }`}
            strokeWidth={2}
          />
        </button>

        {tableOpen && (
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="text-uk-slate">
                    {[
                      'Diện tích mái',
                      'Công suất',
                      'Số tấm pin',
                      'Gói gần nhất',
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="py-2 pr-4 text-[11px] font-cw-bold tracking-wider uppercase"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-uk-line">
                  {solaHomeRoofTable.map((row) => {
                    const highlighted =
                      result?.row.capacity === row.capacity ||
                      (!result &&
                        row.packageId !== null &&
                        row.packageId === selectedPackageId)
                    return (
                      <tr
                        key={row.area}
                        className={
                          highlighted ? 'bg-uk-teal-soft/60' : 'text-uk-navy'
                        }
                      >
                        <td className="py-2.5 pr-4 font-cw-bold">
                          {row.area}
                        </td>
                        <td className="py-2.5 pr-4">{row.capacity}</td>
                        <td className="py-2.5 pr-4 text-uk-slate">
                          {row.panels}
                        </td>
                        <td className="py-2.5 pr-4 font-cw-bold">
                          {packageLabel(row)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-uk-slate">
              Bảng tra công bố theo diện tích mái — thông tin để đối chiếu, không
              phải báo giá.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}