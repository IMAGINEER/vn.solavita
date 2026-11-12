/**
 * Partner conference dates for the Gold Partner campaign, November
 * 2026.
 *
 * Details supplied by the business on 2026-11-12. Nothing here is
 * inferred:
 *
 *   - 29.11.2026 — Bắc Giang. Venue and phone as supplied.
 *   - 23.11.2026 — Hải Phòng. Venue and phone are NOT known yet, so
 *     they stay `null` and the UI renders an explicit "đang cập nhật"
 *     instead of an invented address or number.
 *
 * `registered` is the count the business gave ("已招填 10" / "已招填
 * 3"); `capacity` is the planned intake (30 seats each). The counts
 * are a snapshot — they are not wired to a live seat counter, so
 * update them here when the business reports new numbers.
 *
 * The `id` is the identifier that travels with a sign-up (see
 * `GoldMedalSignup` / `GoldStickyForm` -> `/api/partner`). It is stored
 * in `vn_partner_leads.event_ids` (comma-separated, see
 * `20261112000000_vn_partner_leads_tracking.sql`) and also repeated on
 * the first line of the lead's `message`; the admin partner table
 * reads the column and falls back to parsing the message for rows
 * written before the column existed.
 */
export interface GoldPartnerEvent {
  id: string
  /** ISO date, used for the `datetime`-style semantics. */
  isoDate: string
  /** Display date used in the cards and in the form's select. */
  dateLabel: string
  /** Short label for dense surfaces (admin table, filters). */
  shortLabel: string
  city: string
  /** Street address, or `null` when the business has not confirmed it. */
  venue: string | null
  /** Contact phone printed on the event card, or `null` if unknown. */
  hotline: string | null
  /** Planned intake. */
  capacity: number
  /** Registered as of the business's latest count. */
  registered: number
}

export const goldPartnerEvents: GoldPartnerEvent[] = [
  {
    id: 'bac-giang-2026-11-29',
    isoDate: '2026-11-29',
    dateLabel: '29.11.2026',
    shortLabel: 'Bắc Giang 29.11',
    city: 'Bắc Giang',
    venue: '3 Đường Lý Thái Tổ, Bắc Giang, Tỉnh Bắc Giang',
    hotline: '0939 738 000',
    capacity: 30,
    registered: 10,
  },
  {
    id: 'hai-phong-2026-11-23',
    isoDate: '2026-11-23',
    dateLabel: '23.11.2026',
    shortLabel: 'Hải Phòng 23.11',
    city: 'Hải Phòng',
    venue: null,
    hotline: null,
    capacity: 30,
    registered: 3,
  },
]

/** Human label used in the form and in the lead's message. */
export function eventLabel(event: GoldPartnerEvent): string {
  return `${event.dateLabel} · ${event.city}`
}

/** Short label for the admin table and its conference filter. */
export function eventShortLabel(id: string): string {
  return goldPartnerEvents.find((e) => e.id === id)?.shortLabel ?? id
}