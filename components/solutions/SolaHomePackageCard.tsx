'use client'

import { ArrowRight, House } from 'lucide-react'
import SolaHomePackageLoads from '@/components/solutions/SolaHomePackageLoads'
import { openFormModal } from '@/lib/form-modal'
import type { SolaHomePackage } from '@/lib/data/solahome'

const monthlyNumber = (pkg: SolaHomePackage) =>
  pkg.monthlySaving.replace(' VND/tháng', '')

/**
 * SolaHomePackageCard — one of the four packages, rendered as a white
 * card in the comparison grid.
 *
 * The card answers one question, top to bottom: what is this package
 * (name, capacity, household), what does it save (the hero figure),
 * what do I get (five core specs), and how do I order it (CTA). The
 * published appliance runtimes are the noisiest row, so they are not
 * default content — at xl, hovering (or keyboard-focusing) the header
 * art slides the loads in as a dark overlay, the same reveal the
 * SolaMate package cards use.
 *
 * The header art is a placeholder until the package renders exist;
 * drop `imagePath` into `solaHomePackages` and the placeholder swaps
 * for the photo automatically.
 */
export default function SolaHomePackageCard({
  pkg,
  recommended = false,
}: {
  pkg: SolaHomePackage
  /** The sizing matcher's current recommendation. */
  recommended?: boolean
}) {
  const specs = [
    { k: 'Sản lượng/ngày', v: pkg.dailyOutput },
    { k: 'Diện tích mái', v: pkg.roofArea },
    { k: 'Số tấm pin', v: pkg.panels },
    { k: 'Biến tần', v: pkg.inverter },
    { k: 'Hỗ trợ pin', v: pkg.storage },
  ]

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white transition-shadow duration-300 hover:shadow-[0_26px_50px_-28px_rgba(15,23,42,0.55)] ${
        recommended ? 'ring-2 ring-uk-teal-dark' : 'ring-1 ring-black/5'
      }`}
    >
      {/* Header art — placeholder until the package renders exist. */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#E8FAF7] via-[#EAF8F1] to-[#E7F3FB]">
        {pkg.imagePath ? (
          <img
            src={pkg.imagePath}
            alt={pkg.imageAlt ?? ''}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/75 shadow-sm">
              <House
                className="h-7 w-7 text-uk-teal-dark"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>
            <span className="text-[9px] font-cw-bold tracking-[0.18em] text-uk-teal-dark/55 uppercase">
              Ảnh minh hoạ gói
            </span>
          </div>
        )}

        {pkg.popular && (
          <span className="pointer-events-none absolute top-3 left-3 z-20 rounded-full bg-uk-teal-dark px-2.5 py-1 text-[9px] font-cw-bold tracking-[0.14em] text-white uppercase">
            Phổ biến nhất
          </span>
        )}

        {/* Desktop reveal — the same treatment as the SolaMate cards. */}
        <div
          className="absolute inset-0 z-10 hidden flex-col justify-end px-4 pt-6 pb-3.5 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none xl:flex"
          style={{
            background:
              'linear-gradient(180deg, #0F172A 0%, #0F172A 100%)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 80% at 100% 100%, rgba(16,185,129,0.16), transparent 60%)',
            }}
          />
          <p className="relative text-[9px] font-cw-bold tracking-[0.18em] text-uk-emerald uppercase">
            Tải tham chiếu · mỗi ngày
          </p>
          <SolaHomePackageLoads
            loads={pkg.loads}
            tone="dark"
            className="relative mt-2.5"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {recommended && (
          <span className="mb-2 inline-flex w-fit rounded-full bg-uk-teal-soft px-2.5 py-1 text-[9px] font-cw-bold tracking-[0.14em] text-uk-teal-dark uppercase">
            Phù hợp với ước tính
          </span>
        )}
        <h3 className="text-lg leading-snug font-cw-bold text-uk-navy">
          {pkg.name}
        </h3>
        <p className="mt-1 text-xs text-uk-slate">
          {pkg.capacity} · {pkg.phase}
        </p>

        <p className="mt-3 text-sm leading-snug font-cw-bold text-uk-navy">
          {pkg.summary}
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-uk-slate">
          {pkg.fits}
        </p>

        {/* The saving is the card's visual centre. Deep brand ramp keeps
            white type legible (the bright ramp does not). */}
        <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#007A9E] to-[#1A8A30] px-4 py-3.5 text-white">
          <p className="text-[10px] font-cw-bold tracking-[0.16em] text-white/70 uppercase">
            Tiết kiệm mỗi tháng
          </p>
          <p className="mt-1 flex items-baseline gap-1">
            <span className="text-[26px] leading-none font-cw-bold tracking-tight">
              {monthlyNumber(pkg)}
            </span>
            <span className="text-xs font-cw-bold text-white/80">₫</span>
          </p>
        </div>

        <dl className="mt-4 space-y-2 border-t border-uk-line pt-4 text-xs">
          {specs.map((row) => (
            <div
              key={row.k}
              className="flex items-baseline justify-between gap-3"
            >
              <dt className="shrink-0 text-uk-slate">{row.k}</dt>
              <dd className="text-right font-cw-bold text-uk-navy">{row.v}</dd>
            </div>
          ))}
        </dl>

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
      </div>
    </article>
  )
}