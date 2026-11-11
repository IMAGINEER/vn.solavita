'use client'

import { ArrowRight } from 'lucide-react'
import SolaHomePackageLoads from '@/components/solutions/SolaHomePackageLoads'
import { openFormModal } from '@/lib/form-modal'
import {
  solaHomePackages,
  type SolaHomePackage,
} from '@/lib/data/solahome'

const labelCell =
  'px-4 py-3 align-top text-[10px] font-cw-bold uppercase tracking-[0.12em] text-uk-slate'
const valueCell = 'border-l border-uk-line px-4 py-3 align-top'

const monthlyNumber = (pkg: SolaHomePackage) =>
  pkg.monthlySaving.replace(' VND/tháng', '')
const dailyNumber = (pkg: SolaHomePackage) =>
  pkg.dailyOutput.replace(' kWh/ngày', '')

const productLabel = (pkg: SolaHomePackage) =>
  `SolaHome — ${pkg.name} (${pkg.capacity} · ${pkg.phase})`

/**
 * SolaHomePackageTable — the four packages as a comparison table on lg+.
 *
 * Replaces the old hover cards. Every row is always visible, so the load
 * runtime can differ by package without being hidden behind a hover.
 * The recommended column is tinted and chipped by `selectedPackageId`
 * from the sizing matcher; the two 10 kWp columns intentionally show the
 * same published load row (the flyer keys loads by capacity, not phase).
 */
export default function SolaHomePackageTable({
  selectedPackageId,
}: {
  selectedPackageId: string | null
}) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-uk-line bg-white">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">
          So sánh bốn gói SolaHome: công suất, sản lượng, tiết kiệm, thiết bị
          và thời gian chạy mỗi ngày.
        </caption>
        <colgroup>
          <col className="w-[150px]" />
          {solaHomePackages.map((pkg) => (
            <col
              key={pkg.id}
              className={
                selectedPackageId === pkg.id ? 'bg-uk-teal-soft/40' : ''
              }
            />
          ))}
        </colgroup>

        <thead>
          <tr className="border-b border-uk-line">
            <th scope="col" className="px-4 py-4 align-bottom">
              <span className="text-[10px] font-cw-bold uppercase tracking-[0.16em] text-uk-slate">
                So sánh gói
              </span>
            </th>
            {solaHomePackages.map((pkg) => {
              const recommended = selectedPackageId === pkg.id
              return (
                <th
                  key={pkg.id}
                  scope="col"
                  className="border-l border-uk-line px-4 py-4 align-top"
                >
                  <div className="mb-2 flex min-h-[16px] items-center">
                    {recommended && (
                      <span className="rounded-full bg-uk-teal px-2 py-0.5 text-[9px] leading-none font-cw-bold tracking-wider text-white uppercase">
                        Phù hợp với ước tính
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-snug font-cw-bold text-uk-navy">
                    {pkg.name}
                  </p>
                  <p className="mt-1 text-xs text-uk-slate">
                    {pkg.capacity} · {pkg.phase}
                  </p>
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-uk-line">
          <tr className="transition-colors hover:bg-uk-teal-soft/40">
            <th scope="row" className={labelCell}>
              Tiết kiệm/tháng
            </th>
            {solaHomePackages.map((pkg) => (
              <td key={pkg.id} className={valueCell}>
                <span className="text-lg font-cw-bold text-uk-teal-dark">
                  {monthlyNumber(pkg)}
                </span>
                <span className="ml-0.5 text-[10px] font-cw-bold text-uk-teal-dark/70">
                  ₫
                </span>
              </td>
            ))}
          </tr>

          <tr className="transition-colors hover:bg-uk-teal-soft/40">
            <th scope="row" className={labelCell}>
              Sản lượng/ngày
            </th>
            {solaHomePackages.map((pkg) => (
              <td key={pkg.id} className={valueCell}>
                <span className="text-base font-cw-bold text-uk-navy">
                  {dailyNumber(pkg)}
                </span>
                <span className="ml-0.5 text-[10px] font-cw-bold text-uk-navy/60">
                  kWh
                </span>
              </td>
            ))}
          </tr>

          <tr className="transition-colors hover:bg-uk-teal-soft/40">
            <th scope="row" className={labelCell}>
              Diện tích mái
            </th>
            {solaHomePackages.map((pkg) => (
              <td
                key={pkg.id}
                className={`${valueCell} text-xs font-cw-bold text-uk-navy`}
              >
                {pkg.roofArea}
              </td>
            ))}
          </tr>

          <tr className="transition-colors hover:bg-uk-teal-soft/40">
            <th scope="row" className={labelCell}>
              Số tấm pin
            </th>
            {solaHomePackages.map((pkg) => (
              <td
                key={pkg.id}
                className={`${valueCell} text-xs font-cw-bold text-uk-navy`}
              >
                {pkg.panels}
              </td>
            ))}
          </tr>

          <tr className="transition-colors hover:bg-uk-teal-soft/40">
            <th scope="row" className={labelCell}>
              Biến tần hybrid
            </th>
            {solaHomePackages.map((pkg) => (
              <td
                key={pkg.id}
                className={`${valueCell} text-xs leading-relaxed text-uk-navy`}
              >
                {pkg.inverter}
              </td>
            ))}
          </tr>

          <tr className="transition-colors hover:bg-uk-teal-soft/40">
            <th scope="row" className={labelCell}>
              Hỗ trợ pin
            </th>
            {solaHomePackages.map((pkg) => (
              <td
                key={pkg.id}
                className={`${valueCell} text-xs leading-relaxed text-uk-navy`}
              >
                {pkg.storage}
              </td>
            ))}
          </tr>

          <tr className="transition-colors hover:bg-uk-teal-soft/40">
            <th scope="row" className={labelCell}>
              Phù hợp
            </th>
            {solaHomePackages.map((pkg) => (
              <td
                key={pkg.id}
                className={`${valueCell} text-[11px] leading-relaxed text-uk-slate`}
              >
                {pkg.fits}
              </td>
            ))}
          </tr>

          <tr className="transition-colors hover:bg-uk-teal-soft/40">
            <th scope="row" className={labelCell}>
              Tải tham chiếu
              <span className="mt-1 block text-[9px] font-cw-regular normal-case tracking-normal text-uk-slate/80">
                thời gian chạy/ngày
              </span>
            </th>
            {solaHomePackages.map((pkg) => (
              <td key={pkg.id} className={valueCell}>
                <SolaHomePackageLoads loads={pkg.loads} />
              </td>
            ))}
          </tr>

          <tr className="transition-colors hover:bg-uk-teal-soft/40">
            <th scope="row" className={labelCell}>
              Báo giá
            </th>
            {solaHomePackages.map((pkg) => (
              <td
                key={pkg.id}
                className="border-l border-uk-line px-4 pt-3 pb-5 align-top"
              >
                <button
                  type="button"
                  onClick={() =>
                    openFormModal({
                      solutionType: 'home',
                      interestedProduct: productLabel(pkg),
                    })
                  }
                  className="btn-gradient inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-cw-bold text-white"
                >
                  Nhận báo giá
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}