'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { openFormModal } from '@/lib/form-modal'
import {
  solaHomeMounts,
  solaHomeRoofChecks,
  solaHomeRoofOptions,
  type SolaHomeRoofOption,
} from '@/lib/data/solahome'

/**
 * SolaHomeRoofPicker — "which installation fits my roof?"
 *
 * The roof material is the one thing a homeowner can answer straight
 * away, so the section starts from it. Each tab carries a photo of that
 * roof; the content below switches with it.
 *
 * Layout is deliberately two columns of very different weight:
 *   - left  — the explanation: what this roof is, how it is mounted,
 *     and the three things the survey has to confirm
 *   - right — the scheme cards: a large scene photo, the product name
 *     and one sentence
 *
 * The old version put four feature tiles plus a five-row spec table
 * into the right card and repeated the product names on the left. All
 * of that moved to the package section, where the specs live in one
 * place; here only the choice between roof types belongs.
 */

/**
 * House outline icons — one per roof type.
 *
 * Deliberately symbolic: the same house silhouette with a different
 * roof line, nothing more. No tiles, no panels, no corrugation — the
 * photo beside it already names the material, and the icon only has to
 * say "this kind of roof".
 *
 * What separates the three is the pitch, which is also the thing that
 * actually differs in practice: mái ngói needs a steep roof, mái tôn is
 * normally laid shallow, mái bằng has no pitch at all.
 *
 * Stroke-only and `currentColor`, so the icon inherits the teal/white
 * colour of the state it sits in.
 */
const HOUSE_ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

/** The wall below the roof — identical in all three icons. */
const HOUSE_BODY = 'M5.5 11.5 V19.5 H18.5 V11.5'

function HouseIcon({
  variant,
  className = 'h-6 w-6',
}: {
  variant: SolaHomeRoofOption['id']
  className?: string
}) {
  if (variant === 'tile') {
    // Steep gable.
    return (
      <svg {...HOUSE_ICON_PROPS} className={className}>
        <path d="M3 11.5 L12 4 L21 11.5" />
        <path d={HOUSE_BODY} />
      </svg>
    )
  }

  if (variant === 'metal') {
    // Shallow gable.
    return (
      <svg {...HOUSE_ICON_PROPS} className={className}>
        <path d="M3 11.5 L12 7 L21 11.5" />
        <path d={HOUSE_BODY} />
      </svg>
    )
  }

  // Flat roof.
  return (
    <svg {...HOUSE_ICON_PROPS} className={className}>
      <path d="M3 11.5 H21" />
      <path d={HOUSE_BODY} />
    </svg>
  )
}

export default function SolaHomeRoofPicker() {
  const [roofId, setRoofId] = useState<SolaHomeRoofOption['id']>('tile')

  const roof =
    solaHomeRoofOptions.find((option) => option.id === roofId) ??
    solaHomeRoofOptions[0]

  const compareSchemes = roof.schemes.length > 1

  return (
    <div className="mt-10">
      {/* Selector — one tap, no product name required. */}
      <div
        role="tablist"
        aria-label="Chọn theo loại mái"
        className="grid gap-4 sm:grid-cols-3"
      >
        {solaHomeRoofOptions.map((option) => {
          const active = option.id === roofId
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setRoofId(option.id)}
              className={`overflow-hidden rounded-2xl border text-left transition-colors ${
                active
                  ? 'border-uk-teal bg-uk-teal-soft/60 ring-2 ring-uk-teal/25'
                  : 'border-uk-line bg-white hover:border-uk-teal/60'
              }`}
            >
              <div className="h-24 w-full overflow-hidden sm:h-28">
                <img
                  src={option.thumbPath}
                  alt={option.thumbAlt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <span className="flex items-center gap-2">
                  <span className="text-uk-teal-dark">
                    <HouseIcon variant={option.id} className="h-5 w-5" />
                  </span>
                  <span className="font-cw-bold text-uk-navy">
                    {option.label}
                  </span>
                </span>
                <span className="mt-1.5 block text-xs leading-relaxed text-uk-slate">
                  {option.short}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        {/* Left — what this roof is and what the survey must confirm */}
        <div>
          <p className="text-xs font-cw-bold tracking-[0.18em] text-uk-teal-dark uppercase">
            {roof.label} · phương án lắp đặt
          </p>
          <h3 className="mt-4 text-2xl font-cw-bold leading-snug text-uk-navy">
            {roof.headline}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-uk-slate">
            {roof.structure}
          </p>

          <div className="mt-6 rounded-2xl bg-sv-light p-5">
            <p className="text-[11px] font-cw-bold tracking-[0.16em] text-uk-slate uppercase">
              Cách lắp
            </p>
            <p className="mt-2 text-sm leading-relaxed text-uk-navy">
              {roof.method}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-uk-teal/30 bg-uk-teal-soft/40 p-5">
            <p className="text-[11px] font-cw-bold tracking-[0.16em] text-uk-teal-dark uppercase">
              Cần kiểm tra khi khảo sát
            </p>
            <ul className="mt-3 space-y-2">
              {solaHomeRoofChecks.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-uk-navy">
                  <Check
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-uk-teal-dark"
                    strokeWidth={2.5}
                  />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-uk-teal/20 pt-3 text-xs leading-relaxed text-uk-slate">
              {roof.check}
            </p>
          </div>

          {/* Survey CTA — it closes the left column instead of sitting
              in its own centred band under the two columns. */}
          <div className="mt-6">
            <p className="text-sm leading-relaxed text-uk-slate">
              Kỹ thuật viên đo đạc mái, kiểm tra kết cấu chịu lực và đối chiếu
              phương án lắp đặt phù hợp với ngôi nhà của bạn.
            </p>
            <button
              type="button"
              onClick={() => openFormModal({ solutionType: 'home' })}
              className="btn-gradient mt-4 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-cw-bold text-white"
            >
              Khảo sát mái nhà miễn phí
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Right — the installation schemes for this roof */}
        <div>
          <div
            className={`grid gap-5 ${
              compareSchemes ? 'sm:grid-cols-2' : ''
            }`}
          >
            {roof.schemes.map((scheme) => {
              const mount = solaHomeMounts.find(
                (item) => item.id === scheme.mountId,
              )
              return (
                <article
                  key={scheme.mountId}
                  className="overflow-hidden rounded-3xl border border-uk-line bg-white"
                >
                  <img
                    src={scheme.imagePath}
                    alt={scheme.imageAlt}
                    loading="lazy"
                    className="h-60 w-full object-cover sm:h-72"
                  />
                  <div className="p-6">
                    <span className="inline-block rounded-full bg-uk-teal-soft px-3 py-1 text-[10px] font-cw-bold tracking-wider text-uk-teal-dark uppercase">
                      {scheme.name}
                    </span>
                    <h4 className="mt-3 text-xl font-cw-bold text-uk-navy">
                      {mount ? mount.name : scheme.mountId}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-uk-slate">
                      {scheme.body}
                    </p>
                    {/* What separates this scheme from the other one on
                        the same roof — on a flat roof the two options
                        share every component and differ only in how the
                        system sits on the slab. */}
                    {scheme.points && scheme.points.length > 0 && (
                      <ul className="mt-4 space-y-2 border-t border-uk-line pt-4">
                        {scheme.points.map((point) => (
                          <li
                            key={point}
                            className="flex gap-2.5 text-sm text-uk-navy"
                          >
                            <Check
                              className="mt-0.5 h-4 w-4 flex-shrink-0 text-uk-teal-dark"
                              strokeWidth={2.5}
                            />
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          {compareSchemes && (
            <p className="mt-4 text-xs leading-relaxed text-uk-slate">
              Cùng một hệ tấm pin, biến tần hybrid và pin lưu trữ — khác
              biệt giữa hai phương án nằm ở cách hệ thống đặt trên mái.
            </p>
          )}
        </div>
      </div>

    </div>
  )
}
