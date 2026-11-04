'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { PlanRoi } from '../_lib/calc'
import { formatNGN, formatKwh } from '../_lib/format'

interface SavingsSectionProps {
  metrics: PlanRoi
  /** Region from the consultation - surfaced in the breakdown so the
   *  customer can see their specific yield was applied, not the
   *  national-average fallback. */
  region?: string
}

interface MetricRow {
  label: string
  value: string
  sub: string
  /** When true, value renders in emerald to highlight a saving. */
  highlight?: boolean
}

/**
 * Six-card savings grid + the "View detailed ROI breakdown" disclosure.
 * Mirrors the ROI Calculator result-card primitive for visual consistency.
 *
 * Layout: 3 cols on lg (2x3), 2 cols on sm, 1 col on mobile.
 */
export default function SavingsSection({ metrics, region }: SavingsSectionProps) {
  const [detailedOpen, setDetailedOpen] = useState(false)

  const rows: MetricRow[] = [
    {
      label: 'Tiết kiệm ròng hằng năm',
      value: formatNGN(metrics.annualNetSavingNgn),
      sub: 'Chi phí năng lượng tiết kiệm được · chế độ lý tưởng (không tính chi phí vận hành)',
      highlight: true,
    },
    {
      label: 'Thời gian hoàn vốn ước tính',
      value:
        metrics.paybackYears === Infinity
          ? '-'
          : `${metrics.paybackYears.toFixed(1)} năm`,
      sub: 'Số năm để hoàn vốn',
    },
    {
      label: 'Lợi ích 30 năm',
      value: formatNGN(metrics.total30YearReturnNgn),
      sub: 'Tiết kiệm ròng cả vòng đời (₦, sau suy giảm hiệu suất)',
      highlight: metrics.total30YearReturnNgn > 0,
    },
  ]

  return (
    <section className="space-y-3">
      <h2 className="text-xl md:text-2xl font-cw-bold text-uk-navy">
        Tiết kiệm ước tính của bạn
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-2xl p-5 bg-white border border-uk-line hover:border-uk-teal/40 hover:shadow-md transition-all"
          >
            <div className="text-xs font-cw-regular text-uk-slate">{row.label}</div>
            <div
              className={
                'mt-2 text-2xl md:text-3xl font-cw-bold tabular-nums ' +
                (row.highlight ? 'text-uk-emerald' : 'text-uk-teal-dark')
              }
            >
              {row.value}
            </div>
            <div className="mt-1 text-xs text-uk-slate">{row.sub}</div>
          </div>
        ))}
      </div>

      {/* Data-source disclosure. The yields and energy-cost assumptions
          in this calculator are PROVISIONAL test values pending business
          verification — they do NOT represent verified national averages.
          Kept above the disclosure button so the customer sees the source
          caveat in the natural reading flow. */}
      <p className="mt-3 text-xs text-uk-slate/70 leading-relaxed">
        <strong className="font-cw-bold text-uk-slate">Giá trị tạm tính</strong>
        {' — '}
        sản lượng điện theo khu vực, đơn giá điện hiện tại và hiệu suất hệ thống là các ước tính đang chờ xác nhận từ bộ phận kinh doanh. Sản lượng được điều chỉnh theo khu vực{region ? ` cho ${region}` : ' (mặc định Việt Nam)'}.
        ROI được tính dựa trên ngân sách năng lượng bạn khai báo khi có, và giới hạn ở mức trần thận trọng theo phân khúc khi không có.
        TBD — mô hình giá điện theo biểu giá EVN tại Việt Nam (chờ xác nhận)
      </p>

      <button
        type="button"
        onClick={() => setDetailedOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-uk-teal hover:text-uk-teal-dark text-sm font-cw-bold transition-colors mt-2"
        aria-expanded={detailedOpen}
      >
        Giả định chính
        <ChevronDown
          className={'w-4 h-4 transition-transform duration-200 ' + (detailedOpen ? 'rotate-180' : '')}
          strokeWidth={2}
        />
      </button>

      {detailedOpen && (
        <div className="rounded-xl bg-uk-teal-soft/40 border border-uk-line p-5 text-sm text-uk-slate leading-relaxed">
          <strong className="block text-uk-navy font-cw-bold mb-2">
            Giả định chính
          </strong>
          <div className="space-y-1 tabular-nums">
            <div className="flex justify-between">
              <span>Sản lượng điện hằng năm</span>
              <span>{formatKwh(metrics.annualGenerationKwh)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tự tiêu thụ</span>
              <span>{formatKwh(metrics.annualSelfConsumedKwh)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phát lên lưới</span>
              <span>{formatKwh(metrics.annualExportedKwh)}</span>
            </div>
            <div className="flex justify-between border-t border-uk-line pt-2 mt-2 font-cw-bold text-uk-navy">
              <span>Tích lũy 30 năm</span>
              <span>{formatNGN(metrics.total30YearSavingNgn)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-uk-slate/80">
            Số liệu 30 năm áp dụng đường cong suy giảm của tấm pin (năm 1 = 100%,
            năm 10 ≈ 95,7%, năm 30 = 85%) theo biểu giá điện lưới tại Việt Nam
            (₦/kWh, đang chờ xác nhận). Chi phí năng lượng hiện tại dựa trên các
            hằng số tạm tính; hiệu suất thực tế thay đổi tùy theo hệ thống và
            phụ tải. Độ nhạy của ROI với thay đổi hiệu suất ±20 % gần như tỷ lệ
            thuận — cộng hoặc trừ cùng tỷ lệ đó vào phần chi phí năng lượng được
            thay thế để ước tính khoảng dao động.
            TBD — mô hình giá điện theo biểu giá EVN tại Việt Nam (chờ xác nhận)
          </p>
        </div>
      )}
    </section>
  )
}