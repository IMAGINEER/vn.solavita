'use client'

import { ArrowRight } from 'lucide-react'
import SolaHomePackageLoads from '@/components/solutions/SolaHomePackageLoads'
import { openFormModal } from '@/lib/form-modal'
import type { SolaHomePackage } from '@/lib/data/solahome'

const monthlyNumber = (pkg: SolaHomePackage) =>
  pkg.monthlySaving.replace(' VND/tháng', '')
const dailyNumber = (pkg: SolaHomePackage) =>
  pkg.dailyOutput.replace(' kWh/ngày', '')

/**
 * SolaHomePackageCard — the mobile rendering of one package (below lg).
 *
 * The lg+ table is the primary comparison surface. This card repeats its
 * fields in the order the table reads, with no mount tabs, no hover state
 * and no "Liên hệ báo giá" line — the load row is always visible and
 * comes from `pkg.loads`, so it differs per package.
 */
export default function SolaHomePackageCard({
  pkg,
  recommended = false,
}: {
  pkg: SolaHomePackage
  recommended?: boolean
}) {
  return (
    <article
      className={`flex flex-col rounded-3xl border bg-white p-5 ${
        recommended
          ? 'border-uk-teal ring-2 ring-uk-teal/30'
          : 'border-uk-line'
      }`}
    >
      {recommended && (
        <span className="mb-2 inline-block w-fit rounded-full bg-uk-teal px-2.5 py-0.5 text-[9px] font-cw-bold tracking-wider text-white uppercase">
          Phù hợp với ước tính
        </span>
      )}

      <h3 className="text-lg leading-snug font-cw-bold text-uk-navy">
        {pkg.name}
      </h3>
      <p className="mt-1 text-xs text-uk-slate">
        {pkg.capacity} · {pkg.phase}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-uk-teal-soft/50 p-3">
        <div>
          <div className="text-[10px] leading-snug text-uk-slate">
            Sản lượng/ngày
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-cw-bold text-uk-teal-dark">
              {dailyNumber(pkg)}
            </span>
            <span className="text-[10px] font-cw-bold text-uk-teal-dark/75">
              kWh
            </span>
          </div>
        </div>
        <div>
          <div className="text-[10px] leading-snug text-uk-slate">
            Tiết kiệm/tháng
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-cw-bold text-uk-teal-dark">
              {monthlyNumber(pkg)}
            </span>
            <span className="text-[10px] font-cw-bold text-uk-teal-dark/75">
              ₫
            </span>
          </div>
        </div>
      </div>

      <dl className="mt-4 space-y-2 border-t border-uk-line pt-4 text-xs">
        {[
          { k: 'Diện tích mái', v: pkg.roofArea },
          { k: 'Số tấm pin', v: pkg.panels },
          { k: 'Biến tần hybrid', v: pkg.inverter },
          { k: 'Hỗ trợ pin', v: pkg.storage },
        ].map((row) => (
          <div
            key={row.k}
            className="flex items-baseline justify-between gap-3"
          >
            <dt className="shrink-0 text-uk-slate">{row.k}</dt>
            <dd className="text-right font-cw-bold text-uk-navy">{row.v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-[11px] leading-relaxed text-uk-slate">
        <span className="font-cw-bold text-uk-slate">Phù hợp: </span>
        {pkg.fits}
      </p>

      <div className="mt-4 rounded-xl border border-uk-line p-3">
        <p className="text-[10px] font-cw-bold tracking-wider text-uk-slate uppercase">
          Tải tham chiếu
          <span className="ml-1 font-cw-regular tracking-normal normal-case text-uk-slate/80">
            · thời gian chạy/ngày
          </span>
        </p>
        <SolaHomePackageLoads loads={pkg.loads} className="mt-2.5" />
      </div>

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={() =>
            openFormModal({
              solutionType: 'home',
              interestedProduct: `SolaHome — ${pkg.name} (${pkg.capacity} · ${pkg.phase})`,
            })
          }
          className="btn-gradient inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-cw-bold text-white"
        >
          Nhận báo giá
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </article>
  )
}