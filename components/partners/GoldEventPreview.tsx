'use client'

import { ArrowRight } from 'lucide-react'
import { goldPartnerEvents } from '@/lib/data/partnerEvents'

/**
 * "Hội nghị đối tác tháng 11" — the two conferences previewed inside
 * the hero, followed by the CTA that takes the visitor to the sign-up
 * form.
 *
 * Deliberately not cards: the hero already carries a headline, the
 * four-word rhythm and a paragraph, so the sessions read as a compact
 * two-row list — date, city, venue, phone, seats — separated by thin
 * rules, the way a schedule is printed on the standee. On a phone the
 * row wraps instead of shrinking a table below readability.
 *
 * Facts follow `lib/data/partnerEvents.ts`: the Hải Phòng venue and
 * phone are not confirmed yet and render as "đang cập nhật" rather
 * than an invented address or number. The seat counters are the
 * business's latest numbers, not a live booking system.
 *
 * The CTA scrolls to #dang-ky with `scrollIntoView` (the site sets
 * `scroll-behavior: auto`, so a bare anchor would jump); the form's
 * first field is the conference picker, so a visitor who arrives this
 * way still records which session they want.
 */
export default function GoldEventPreview() {
  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document
      .getElementById('dang-ky')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="mt-8 max-w-2xl">
      <p className="text-xs font-cw-bold uppercase tracking-[0.14em] text-[#F5D48A]">
        Hội nghị đối tác tháng 11
      </p>

      <ul className="mt-3 border-y border-white/10 divide-y divide-white/10">
        {goldPartnerEvents.map((event) => (
          <li
            key={event.id}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5 text-xs leading-relaxed"
          >
            <span className="font-cw-bold tabular-nums text-white">
              {event.dateLabel}
            </span>
            <span className="font-cw-bold text-[#F5D48A]">{event.city}</span>
            <span className="text-white/65">
              {event.venue ?? 'Địa điểm: đang cập nhật'}
            </span>
            <span className="text-white/55">
              · {event.hotline ?? 'Điện thoại: đang cập nhật'}
            </span>
            <span className="ml-auto whitespace-nowrap text-white/55">
              Đã đăng ký{' '}
              <span className="font-cw-bold text-white/85">
                {event.registered}/{event.capacity}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <a
        href="#dang-ky"
        onClick={scrollToForm}
        className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-cw-bold text-[#0A1628] transition-transform hover:scale-[1.02]"
        style={{
          background: 'linear-gradient(100deg, #D19B2C 0%, #E8B44A 100%)',
        }}
      >
        Đăng ký tham dự
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </a>
    </div>
  )
}