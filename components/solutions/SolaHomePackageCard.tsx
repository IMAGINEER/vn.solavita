'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import LoadStrip from '@/components/solutions/LoadStrip'
import { openFormModal } from '@/lib/form-modal'
import {
  solaHomeLoadReference,
  solaHomeMounts,
  type SolaHomePackage,
} from '@/lib/data/solahome'

/**
 * SolaHomePackageCard — one of the four SolaHome packages.
 *
 * The card answers the four questions the sizing matcher leaves open:
 * how much roof it needs, how many panels and which inverter ship, what
 * it generates and saves per month, and whether storage can be added.
 *
 *  1. The **mount tab** in the top-right corner. SolaRoof and SolaLoft
 *     are the two ways to install the same package, so the card picks
 *     one and the panel below the specs shows what that mount changes.
 *
 *  2. The **load panel** as the panel's hover state, mirroring the
 *     SolaMate package cards. The loads shown are the published
 *     reference loads of the site's savings model
 *     (`solaHomeLoadReference`). Below xl — where there is no hover —
 *     the same panel renders inline so the data is never hover-only.
 *
 *  3. `recommended` is set by the sizing matcher. It gets a teal ring
 *     and a chip so the visitor can find "their" card without reading
 *     all four.
 *
 * The hover/focus group covers the mount panel and the CTA only,
 * deliberately NOT the tab row: hovering a tab must not hide the note
 * that the tab itself swaps.
 */

export default function SolaHomePackageCard({
  pkg,
  recommended = false,
}: {
  pkg: SolaHomePackage
  recommended?: boolean
}) {
  const [mountId, setMountId] = useState<'solaroof' | 'solaloft'>('solaroof')
  const mount = solaHomeMounts.find((m) => m.id === mountId) ?? solaHomeMounts[0]

  const loadItems = solaHomeLoadReference.map((l) => ({
    icon: l.icon,
    value: l.value,
    label: l.label,
  }))

  const monthlyNumber = pkg.monthlySaving.replace(' VND/tháng', '')
  const dailyNumber = pkg.dailyOutput.replace(' kWh/ngày', '')

  return (
    <article
      className={`flex flex-col rounded-3xl border bg-white p-5 transition-shadow duration-300 hover:shadow-xl ${
        recommended
          ? 'border-uk-teal ring-2 ring-uk-teal/30'
          : 'border-uk-line'
      }`}
    >
      {/* Mount switch — top-right corner */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          {recommended && (
            <span className="inline-block w-fit rounded-full bg-uk-teal px-2.5 py-0.5 text-[9px] font-cw-bold tracking-wider text-white uppercase">
              Phù hợp với ước tính
            </span>
          )}
        </div>

        <div
          role="tablist"
          aria-label="Kiểu lắp đặt"
          className="inline-flex shrink-0 rounded-full border border-uk-line bg-sv-light p-0.5"
        >
          {solaHomeMounts.map((m) => {
            const active = m.id === mountId
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMountId(m.id)}
                className={`rounded-full px-2 py-1 text-[9px] font-cw-bold tracking-wider uppercase transition-colors ${
                  active
                    ? 'bg-uk-teal-dark text-white'
                    : 'text-uk-slate hover:text-uk-navy'
                }`}
              >
                {m.name}
              </button>
            )
          })}
        </div>
      </div>

      <h3 className="mt-3 text-lg leading-snug font-cw-bold text-uk-navy">
        {pkg.name}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-uk-slate">{pkg.summary}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-cw-bold text-uk-teal-dark">
          {pkg.capacity}
        </span>
        <span className="text-xs text-uk-slate">· {pkg.phase}</span>
      </div>

      <dl className="mt-4 space-y-2 border-t border-uk-line pt-4 text-xs">
        {[
          { k: 'Diện tích mái', v: pkg.roofArea },
          { k: 'Số tấm pin', v: pkg.panels },
          { k: 'Biến tần hybrid', v: pkg.inverter },
          { k: 'Hỗ trợ pin', v: pkg.storage },
        ].map((row) => (
          <div key={row.k} className="flex items-baseline justify-between gap-3">
            <dt className="shrink-0 text-uk-slate">{row.k}</dt>
            <dd className="text-right font-cw-bold text-uk-navy">{row.v}</dd>
          </div>
        ))}
      </dl>

      {/* The two numbers that carry the offer */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-uk-teal-soft/50 p-3">
        <div>
          <div className="text-[10px] leading-snug text-uk-slate">
            Sản lượng/ngày
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-cw-bold text-uk-teal-dark">
              {dailyNumber}
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
              {monthlyNumber}
            </span>
            <span className="text-[10px] font-cw-bold text-uk-teal-dark/75">
              ₫
            </span>
          </div>
        </div>
      </div>

      {/* The hover / focus group: the mount panel and the CTA. */}
      <div className="group/panel">
        {/* Mount note — replaced by the load panel on hover */}
        <div className="relative mt-4 min-h-[176px]">
          <div className="rounded-xl border border-uk-line p-4 transition-opacity duration-300 xl:group-hover/panel:opacity-0 xl:group-focus-within/panel:opacity-0">
            <p className="text-[10px] font-cw-bold tracking-wider text-uk-slate uppercase">
              {mount.name}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-uk-slate">
              {mount.body}
            </p>
            <p className="mt-2.5 font-cw-bold text-uk-teal-dark">
              Liên hệ báo giá
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-uk-slate/90">
              <span className="font-cw-bold text-uk-slate">Phù hợp: </span>
              {pkg.fits}
            </p>
          </div>

          <div className="pointer-events-none absolute inset-0 hidden rounded-xl bg-uk-navy p-4 opacity-0 transition-opacity duration-300 xl:group-hover/panel:opacity-100 xl:group-focus-within/panel:opacity-100 xl:block">
            <LoadStrip
              items={loadItems}
              tone="dark"
              variant="grid"
              columns={2}
              header="Tải tham chiếu"
              note="Công suất"
              caption="Công suất tải tham chiếu, không phải mức tiêu thụ thực tế."
            />
          </div>
        </div>

        {/* No hover on small screens — the load panel renders inline. */}
        <div className="mt-4 xl:hidden">
          <LoadStrip
            items={loadItems}
            variant="grid"
            columns={2}
            header="Tải tham chiếu"
            note="Công suất"
            caption="Công suất tải tham chiếu, không phải mức tiêu thụ thực tế."
          />
        </div>

        <button
          type="button"
          onClick={() => openFormModal({ solutionType: 'home' })}
          className="btn-gradient mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-cw-bold text-white"
        >
          Nhận báo giá
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </article>
  )
}