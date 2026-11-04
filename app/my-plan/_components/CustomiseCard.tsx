'use client'

import { useState } from 'react'
import { Check, ChevronDown, Star } from 'lucide-react'
import {
  PLANS,
  ROI_IMPORT_PRICE_MIN,
  ROI_IMPORT_PRICE_MAX,
  ROI_IMPORT_PRICE_STEP,
  ROI_EXPORT_PRICE_MIN,
  ROI_EXPORT_PRICE_MAX,
  ROI_EXPORT_PRICE_STEP,
  ROI_SELF_CONSUMPTION_MIN,
  ROI_SELF_CONSUMPTION_MAX,
  ROI_SELF_CONSUMPTION_STEP,
  type PlanId,
  type PlanRoi,
  type RoiAssumptions,
} from '../_lib/calc'
import { formatNGN } from '../_lib/format'

interface CustomiseCardProps {
  selectedPlanId: PlanId
  recommendedPlanId: PlanId
  onSelectPlan: (id: PlanId) => void
  /**
   * Effective assumptions for the active plan + any user overrides on
   * top. All three ROI inputs are user-controlled; the plan only seeds
   * the initial self-consumption value (battery=100%, no battery=35%).
   */
  assumptions: RoiAssumptions
  /** Slider handlers - fire on every input event. */
  onImportPriceChange: (value: number) => void
  onExportPriceChange: (value: number) => void
  onSelfConsumptionRateChange: (value: number) => void
  /**
   * Live ROI metrics. Used to source the current annual energy-budget
   * cap (`metrics.appliedAnnualFuelCostNgn`) for the energy-budget
   * slider so the slider's default value tracks the calculator's
   * path-A / path-B choice automatically.
   */
  metrics: PlanRoi
  /**
   * When defined, replaces the band / back-derive energy-cost cap. The
   * slider surfaces this; passing `undefined` clears the override and
   * the calculator falls back to the user's reported band or the
   * segment-aware hard cap.
   */
  onFuelBudgetOverrideChange: (value: number | undefined) => void
}

/**
 * 6-plan selector + an interactive "View calculation assumptions"
 * disclosure.
 *
 * Plan selection is the **only** way to change the system's hardware
 * configuration - Solar panels, Battery and Inverter are not
 * independently adjustable. Switching plans swaps the whole bundle
 * (PV size + battery + inverter) at once. The plan's automatic
 * self-consumption default (battery=100%, no battery=35%) is the seed
 * for that slider, but the user's choice persists once they drag it.
 *
 * The "View calculation assumptions" disclosure exposes the three ROI
 * inputs as sliders - import price, export price, self-consumption.
 * All three feed back into the ROI pipeline above so the savings /
 * payback / 30-year numbers reflow in real time.
 */
export default function CustomiseCard({
  selectedPlanId,
  recommendedPlanId,
  onSelectPlan,
  assumptions,
  onImportPriceChange,
  onExportPriceChange,
  onSelfConsumptionRateChange,
  metrics,
  onFuelBudgetOverrideChange,
}: CustomiseCardProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)

  // Snap slider values to the configured step - parseFloat can return
  // tiny float artefacts on some browsers even when step=0.001.
  const snap = (step: number) => (raw: number) =>
    Math.round(raw / step) * step

  return (
    <section className="rounded-2xl p-6 bg-white border border-uk-line">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl md:text-2xl font-cw-bold text-uk-navy">
            Chọn gói của bạn
          </h2>
          <p className="text-sm text-uk-slate mt-1">
            Chọn một trong sáu gói có sẵn. Mỗi gói kết hợp một hệ thống điện
            mặt trời, pin lưu trữ và bộ biến tần cố định — các thành phần được
            đóng gói cùng nhau nên toàn bộ cấu hình thay đổi đồng thời. Tỷ suất
            hoàn vốn (ROI) cập nhật tức thì.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANS.map((plan) => {
          const isSelected = plan.id === selectedPlanId
          const isRecommended = plan.id === recommendedPlanId
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan.id)}
              className={
                'relative text-left rounded-2xl p-5 border-2 transition-all duration-200 ' +
                (isSelected
                  ? 'border-uk-teal bg-uk-teal-soft/50 shadow-md scale-[1.01]'
                  : 'border-uk-line bg-white hover:border-uk-teal/60 hover:-translate-y-0.5 hover:shadow-md')
              }
            >
              {isRecommended && (
                <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 bg-uk-emerald text-white text-[10px] font-cw-bold tracking-wider rounded-full px-2 py-0.5 whitespace-nowrap">
                  <Star className="w-2.5 h-2.5" strokeWidth={3} />
                  Đề xuất cho nhà bạn
                </span>
              )}

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-cw-bold text-uk-navy">
                    {plan.name}
                  </div>
                  <div className="text-xs text-uk-slate mt-0.5">
                    {plan.subtitle}
                  </div>
                </div>
                {isSelected && (
                  <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-uk-teal text-white">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-1 text-sm text-uk-slate tabular-nums">
                <div className="flex justify-between">
                  <span>Điện mặt trời</span>
                  <span className="font-cw-bold text-uk-navy">
                    {plan.kwpLabel ?? `${plan.panels} kWp`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pin lưu trữ</span>
                  <span className="font-cw-bold text-uk-navy">
                    {plan.batteryKwh > 0 ? `${plan.batteryKwh} kWh` : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bộ biến tần</span>
                  <span className="font-cw-bold text-uk-navy">
                    {plan.inverterLabel ?? `${plan.inverterKw} kW`}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-uk-line flex items-baseline justify-between">
                <span className="text-xs text-uk-slate">Giá gói</span>
                <span className="text-lg font-cw-bold text-uk-teal-dark tabular-nums">
                  {formatNGN(plan.priceNgn)}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Interactive disclosure of the ROI calculation parameters.
          Import / export prices have sliders and feed back into the ROI
          pipeline above. Self-consumption is hardware-bound and stays
          read-only. */}
      <button
        type="button"
        onClick={() => setAdvancedOpen((v) => !v)}
        className="mt-6 inline-flex items-center gap-1 text-uk-teal hover:text-uk-teal-dark text-sm font-cw-bold transition-colors"
        aria-expanded={advancedOpen}
      >
        Xem giả định tính toán
        <ChevronDown
          className={
            'w-4 h-4 transition-transform duration-200 ' +
            (advancedOpen ? 'rotate-180' : '')
          }
          strokeWidth={2}
        />
      </button>

      {advancedOpen && (
        <div className="mt-3 rounded-xl bg-uk-teal-soft/40 border border-uk-line p-5 space-y-5">
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <strong className="font-cw-bold">Giá trị tạm tính</strong> — biểu giá
            điện lưới, đơn giá điện hiện tại và hiệu suất hệ thống được
            tích hợp trong công cụ tính là ước tính, chưa phải mức trung bình
            quốc gia đã được xác minh. Điều chỉnh thanh trượt bên dưới để mô
            phỏng tình hình thực tế của bạn.
          </div>
          <p className="text-xs text-uk-slate leading-relaxed">
            Các số liệu này được dùng để tính mức tiết kiệm và thời gian hoàn
            vốn hiển thị ở trên. Kéo thanh trượt để khớp với biểu giá và mô
            hình sử dụng thực tế của bạn — các chỉ số tiết kiệm / thời gian
            hoàn vốn / lợi ích 30 năm sẽ cập nhật theo thời gian thực.
          </p>

          {/* Energy budget slider — for "Not sure" users (and for fine-tuning
             band picks). Range 0 – 2× segment hard cap so the user can't
             push the calculator into absurd territory. Default value is
             whatever the calculator currently uses
             (`metrics.appliedAnnualFuelCostNgn`), so the slider tracks
             path-A / path-B automatically until the user moves it. */}
          {(() => {
            const segment = PLANS.find((p) => p.id === selectedPlanId)?.segment ?? 'homes'
            const hardCap = segment === 'homes' ? 600_000 : 3_600_000
            const sliderMax = hardCap * 2
            const fuelStep = Math.max(10_000, Math.round(sliderMax / 200 / 10_000) * 10_000)
            const currentCap = metrics.appliedAnnualFuelCostNgn
            const isOverridden = metrics.fuelCostOverridden
            const sliderValue = isOverridden ? currentCap : currentCap
            return (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <label
                    htmlFor="assumption-fuel-budget"
                    className="font-cw-bold text-uk-navy"
                  >
                    Ngân sách năng lượng hiện tại (mỗi năm)
                    {isOverridden && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-uk-teal text-white text-[10px] font-cw-bold tracking-wider">
                        TÙY CHỈNH
                      </span>
                    )}
                  </label>
                  <span className="font-cw-bold text-uk-teal-dark tabular-nums">
                    {formatNGN(sliderValue)} / năm
                  </span>
                </div>
                <input
                  id="assumption-fuel-budget"
                  type="range"
                  min={0}
                  max={sliderMax}
                  step={fuelStep}
                  value={sliderValue}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    if (!Number.isFinite(v) || v < 0) return
                    onFuelBudgetOverrideChange(v)
                  }}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-uk-line [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-uk-teal [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-uk-teal [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-uk-slate tabular-nums">
                  <span>₦0</span>
                  <span>
                    {formatNGN(sliderMax)}
                    <span className="ml-1 text-uk-slate/70">
                      (2× mức trần mặc định)
                    </span>
                  </span>
                </div>
                {isOverridden && (
                  <button
                    type="button"
                    onClick={() => onFuelBudgetOverrideChange(undefined)}
                    className="text-xs text-uk-teal hover:text-uk-teal-dark font-cw-bold underline underline-offset-2"
                  >
                    Đặt lại mặc định ({formatNGN(currentCap)} / năm)
                  </button>
                )}
                <p className="text-xs text-uk-slate">
                  Đặt mức trần cho khoản tiết kiệm chi phí năng lượng mà công
                  cụ có thể ghi nhận mỗi năm. Giá trị mặc định phản ánh lựa
                  chọn trong buổi tư vấn của bạn (khoảng ước tính hoặc suy ra
                  từ mức sử dụng); hãy điều chỉnh nếu bạn có ước tính chính
                  xác hơn.
                </p>
              </div>
            )
          })()}

          {/* Import price slider — what the household pays the
              distribution company for each kWh it draws from the
              grid. */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="assumption-import-price"
                className="font-cw-bold text-uk-navy"
              >
                Đơn giá điện lưới
              </label>
              <span className="font-cw-bold text-uk-teal-dark tabular-nums">
                ₦{assumptions.importPriceGbp.toFixed(2)} /kWh
              </span>
            </div>
            <p className="text-xs text-uk-slate">
              Đơn giá bạn trả cho mỗi kWh điện lưới. Biểu giá bán lẻ theo
              bậc thang của EVN tại Việt Nam vẫn đang chờ xác nhận.
              TBD — mô hình giá điện theo biểu giá EVN tại Việt Nam (chờ xác nhận)
            </p>
            <input
              id="assumption-import-price"
              type="range"
              min={ROI_IMPORT_PRICE_MIN}
              max={ROI_IMPORT_PRICE_MAX}
              step={ROI_IMPORT_PRICE_STEP}
              value={assumptions.importPriceGbp}
              onChange={(e) =>
                onImportPriceChange(snap(ROI_IMPORT_PRICE_STEP)(parseFloat(e.target.value)))
              }
              aria-label="Đơn giá điện lưới mỗi kilowatt-giờ"
              className="w-full h-1.5 cursor-pointer accent-uk-teal"
            />
            <div className="flex justify-between text-[10px] text-uk-slate/70 tabular-nums">
              <span>₦{ROI_IMPORT_PRICE_MIN.toFixed(0)}</span>
              <span>₦{ROI_IMPORT_PRICE_MAX.toFixed(0)}</span>
            </div>
          </div>

          {/* Export price slider — what the household earns for each
              kWh pushed back onto the grid. The Vietnamese feed-in
              tariff is still to be confirmed, so this defaults to ₦0. */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="assumption-export-price"
                className="font-cw-bold text-uk-navy"
              >
                Giá điện phát lên lưới
              </label>
              <span className="font-cw-bold text-uk-teal-dark tabular-nums">
                ₦{assumptions.exportPriceGbp.toFixed(2)} /kWh
              </span>
            </div>
            <p className="text-xs text-uk-slate">
              Khoản bạn nhận được cho mỗi kWh điện phát ngược lên lưới.
              Mức giá điện phát lên lưới tại Việt Nam đang chờ xác nhận,
              nên giá trị này bắt đầu từ ₦0 — hãy nhập mức giá của bạn nếu có.
            </p>
            <input
              id="assumption-export-price"
              type="range"
              min={ROI_EXPORT_PRICE_MIN}
              max={ROI_EXPORT_PRICE_MAX}
              step={ROI_EXPORT_PRICE_STEP}
              value={assumptions.exportPriceGbp}
              onChange={(e) =>
                onExportPriceChange(snap(ROI_EXPORT_PRICE_STEP)(parseFloat(e.target.value)))
              }
              aria-label="Giá điện phát lên lưới mỗi kilowatt-giờ"
              className="w-full h-1.5 cursor-pointer accent-uk-teal"
            />
            <div className="flex justify-between text-[10px] text-uk-slate/70 tabular-nums">
              <span>₦{ROI_EXPORT_PRICE_MIN.toFixed(0)}</span>
              <span>₦{ROI_EXPORT_PRICE_MAX.toFixed(0)}</span>
            </div>
          </div>

          {/* Self-consumption rate slider. Default seeded from the
              active plan (battery=100%, no battery=35%) - the user can
              drag below that for solar-only homes that export a lot,
              or down from 100% if their usage doesn't match generation. */}
          <div className="space-y-2 pt-1 border-t border-uk-line/60">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="assumption-self-consumption"
                className="font-cw-bold text-uk-navy"
              >
                Tỷ lệ tự tiêu thụ
              </label>
              <span className="font-cw-bold text-uk-teal-dark tabular-nums">
                {Math.round(assumptions.selfConsumptionRate * 100)}%
              </span>
            </div>
            <p className="text-xs text-uk-slate">
              Phần điện năng được sử dụng tại chỗ. Có pin lưu trữ, tỷ lệ
              này đạt 100%; không có pin, các hộ chỉ dùng điện mặt trời
              thường tự tiêu thụ khoảng 35%. Kéo để khớp với mô hình sử
              dụng thực tế của bạn.
            </p>
            <input
              id="assumption-self-consumption"
              type="range"
              min={ROI_SELF_CONSUMPTION_MIN}
              max={ROI_SELF_CONSUMPTION_MAX}
              step={ROI_SELF_CONSUMPTION_STEP}
              value={assumptions.selfConsumptionRate}
              onChange={(e) =>
                onSelfConsumptionRateChange(
                  snap(ROI_SELF_CONSUMPTION_STEP)(parseFloat(e.target.value)),
                )
              }
              aria-label="Tỷ lệ tự tiêu thụ theo phần trăm sản lượng điện"
              className="w-full h-1.5 cursor-pointer accent-uk-teal"
            />
            <div className="flex justify-between text-[10px] text-uk-slate/70 tabular-nums">
              <span>{Math.round(ROI_SELF_CONSUMPTION_MIN * 100)}%</span>
              <span>{Math.round(ROI_SELF_CONSUMPTION_MAX * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
