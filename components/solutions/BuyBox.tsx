'use client'

import {
  Sun,
  Battery,
  Truck,
  ShieldCheck,
  Check,
  Star,
  Mail,
} from 'lucide-react'
import { openFormModal } from '@/lib/form-modal'
import type {
  SolutionAddon,
  SolutionDetail,
  SolutionStat,
} from '@/lib/data/solutions'

interface BuyBoxProps {
  detail: SolutionDetail
}

const statIcon = (icon: SolutionStat['icon']) =>
  icon === 'battery' ? Battery : Sun

/**
 * Amazon-style buy box - the dense right column on /solutions/[slug]/
 * detail pages. Composition (top → bottom):
 *
 *   eyebrow chip → title → rating row → headline spec strip (Amazon's
 *   price slot, repurposed for kWp / kWh) → headline metric pill →
 *   feature checklist → add-on chips → primary CTA → secondary CTA →
 *   delivery strip → trust line.
 *
 * The CTA opens the universal consultation form modal (which lives in
 * `<Footer>`) with `interestedProduct` prefilled so the lead is tagged
 * with the tier the user was looking at.
 */
export default function BuyBox({ detail }: BuyBoxProps) {
  const emailSubject = `Yêu cầu thông tin về ${detail.title} (${detail.slug})`
  const emailHref = `mailto:vn@solavita.com?subject=${encodeURIComponent(emailSubject)}`

  return (
    <div className="w-full">
      {/* Eyebrow chip */}
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-uk-teal-soft text-uk-teal-dark text-xs font-cw-bold tracking-wider uppercase">
        {detail.eyebrow}
      </span>

      {/* Title */}
      <h1 className="mt-3 text-3xl lg:text-4xl font-cw-bold text-uk-navy leading-tight">
        {detail.title}
      </h1>

      {/* Rating + trust row - Amazon's "stars + review count + brand" slot */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-uk-slate">
        <span className="inline-flex items-center gap-0.5 text-uk-emerald">
          <Star className="w-3.5 h-3.5 fill-uk-emerald" strokeWidth={0} />
          <Star className="w-3.5 h-3.5 fill-uk-emerald" strokeWidth={0} />
          <Star className="w-3.5 h-3.5 fill-uk-emerald" strokeWidth={0} />
          <Star className="w-3.5 h-3.5 fill-uk-emerald" strokeWidth={0} />
          <Star className="w-3.5 h-3.5 fill-uk-emerald" strokeWidth={0} />
        </span>
        <span className="font-cw-bold text-uk-navy">4.9 / 5</span>
        <span className="text-uk-slate">·</span>
        <span>Quality-certified · {detail.warranty}</span>
        <span className="text-uk-slate">·</span>
        <span>Nationwide install</span>
      </div>

      {/* Headline spec strip - Amazon's "price" slot, repurposed for kWp / kWh.
          Two big teal numbers side-by-side with a slash separator. The
          "—" placeholder for solar-only tiers dims out so the column
          still balances visually. */}
      <div className="mt-5 flex items-end gap-3 sm:gap-5">
        {detail.headlineStats.map((stat, idx) => {
          const Icon = statIcon(stat.icon)
          const isPlaceholder = stat.value === '—'
          return (
            <div key={stat.label} className="flex items-end gap-3 sm:gap-5">
              <div>
                <div
                  className={`flex items-center gap-2 text-3xl lg:text-4xl font-cw-bold tabular-nums leading-none ${
                    isPlaceholder
                      ? 'text-uk-slate/40'
                      : 'text-uk-teal-dark'
                  }`}
                >
                  {!isPlaceholder && (
                    <Icon className="w-6 h-6 lg:w-7 lg:h-7" strokeWidth={1.8} />
                  )}
                  {stat.value}
                </div>
                <div className="mt-1.5 text-[11px] font-cw-bold tracking-wider uppercase text-uk-slate">
                  {stat.label}
                </div>
              </div>
              {idx < detail.headlineStats.length - 1 && (
                <div className="pb-2 text-2xl text-uk-slate/40 font-cw-light">/</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Headline metric pill - mirrors the SolutionCategory.metric field */}
      {detail.metric && (
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-uk-emerald/10 text-uk-emerald text-xs font-cw-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-uk-emerald" />
          {detail.metric}
        </div>
      )}

      {/* Key feature checklist */}
      <ul className="mt-5 space-y-2.5">
        {detail.bullets.slice(0, 5).map((b, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-sm text-uk-navy font-cw-regular leading-relaxed"
          >
            <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-uk-emerald/15 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-uk-emerald" strokeWidth={3.5} />
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* Add-ons chips - mirrors Amazon's variant picker (informational only) */}
      <div className="mt-6">
        <div className="text-[11px] font-cw-bold tracking-wider uppercase text-uk-slate mb-2">
          Add-ons included
        </div>
        <div className="flex flex-wrap gap-2">
          {detail.addons.map((addon) => (
            <AddonChip key={addon.id} addon={addon} />
          ))}
        </div>
      </div>

      {/* Quantity / system size - read-only, mirrors Amazon's <select>
          visual rhythm without being functional (no SKU to switch). */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs font-cw-bold tracking-wider uppercase text-uk-slate">
          Quantity
        </span>
        <div className="inline-flex items-center border border-uk-line rounded-lg overflow-hidden">
          <button
            type="button"
            disabled
            aria-label="Decrease quantity"
            className="w-9 h-9 flex items-center justify-center text-uk-slate/40 bg-sv-light cursor-not-allowed"
          >
            −
          </button>
          <span className="w-12 h-9 flex items-center justify-center text-sm font-cw-bold text-uk-navy bg-white border-x border-uk-line">
            1
          </span>
          <button
            type="button"
            disabled
            aria-label="Increase quantity"
            className="w-9 h-9 flex items-center justify-center text-uk-slate/40 bg-sv-light cursor-not-allowed"
          >
            +
          </button>
        </div>
        <span className="text-xs text-uk-slate font-cw-regular">
          1 system, installed
        </span>
      </div>

      {/* Primary CTA - opens the consultation form modal pre-filled with the
          tier name so the lead is tagged with which package they wanted. */}
      <button
        type="button"
        onClick={() => openFormModal({ interestedProduct: detail.title })}
        className="mt-6 w-full btn-gradient px-8 py-4 rounded-full font-cw-bold text-base text-white cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        Get Free Quote →
      </button>

      {/* Secondary CTA - mailto with prefilled subject */}
      <a
        href={emailHref}
        className="mt-3 w-full px-8 py-3.5 rounded-full border border-uk-line text-uk-navy font-cw-bold text-sm hover:border-uk-teal hover:text-uk-teal-dark transition-colors flex items-center justify-center gap-2"
      >
        <Mail className="w-4 h-4" strokeWidth={2} />
        Talk to our team
      </a>

      {/* Delivery strip - Truck icon + headline install time */}
      <div className="mt-6 flex items-center gap-2.5 text-xs text-uk-slate font-cw-regular">
        <Truck className="w-4 h-4 text-uk-teal-dark" strokeWidth={1.8} />
        <span>
          <span className="font-cw-bold text-uk-navy">{detail.installationTime}</span>
          {' · '}
          Free design survey
        </span>
      </div>

      {/* Trust line */}
      <div className="mt-3 flex items-center gap-2.5 text-[11px] text-uk-slate/80 font-cw-regular">
        <ShieldCheck className="w-3.5 h-3.5 text-uk-emerald" strokeWidth={2} />
        <span>
          Nationwide install · {detail.warranty} · SKYWORTH-backed service
        </span>
      </div>
    </div>
  )
}

/** One add-on chip in the buy-box addons row. Included chips get a green
 *  dot; excluded chips dim out and show a small "—" affordance so the
 *  user understands the addon isn't part of this tier. */
function AddonChip({ addon }: { addon: SolutionAddon }) {
  if (addon.included) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-uk-teal-soft text-uk-teal-dark text-xs font-cw-bold border border-uk-teal/30">
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
        {addon.label}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sv-light text-uk-slate/60 text-xs font-cw-regular border border-uk-line">
      <span className="w-2 h-2 rounded-full bg-uk-line" />
      {addon.label}
    </span>
  )
}
