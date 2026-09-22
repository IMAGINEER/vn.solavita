/**
 * TrustBar items — UK certifications + warranty.
 *
 * Each item renders as: [icon image] / [title] / [subtitle].
 *
 * Icons live in `public/images/` and are sized at render time
 * (`h-12`, `w-auto` — height is fixed at 48px so every item sits on
 * a single row at desktop; width follows each asset's intrinsic
 * aspect ratio, so square and wide marks both render cleanly).
 * Asset inventory:
 *
 *   TUV.png      — TÜV Rheinland-style certification mark
 *   CE.png       — CE conformity mark
 *   MCS.png      — Microgeneration Certification Scheme mark
 *   NICEIC.png   — NICEIC Approved Contractor mark
 *   RECC.png     — Renewable Energy Consumer Code mark
 *   25.png       — 25-year warranty mark
 *
 * `titleBold` exists for items whose title is two lines where the
 * second line should be bold (e.g. "Up to 25 Years / Warranty").
 */

export interface UkTrustItem {
  /** Image path under `public/`. */
  image: string
  /** Alt text — also the title (bolded, first line). */
  title: string
  /** Optional second title line, rendered bold. Omit for single-line titles. */
  titleBold?: string
  /** Subtitle (regular weight, single line). */
  subtitle: string
  /**
   * Set `true` to hide this item from the TrustBar strip.
   *
   * Used to temporarily retire third-party accreditation marks
   * (MCS / NICEIC / RECC) while business reconciles the claims with
   * the corresponding contractual evidence. The data row is kept so
   * the assertion remains auditable in code and can be re-enabled by
   * flipping the flag - much safer than deleting the entry.
   */
  hidden?: boolean
}

export const ukTrustItems: UkTrustItem[] = [
  {
    image: '/images/TUV.png',
    title: 'TUV Certified',
    subtitle: 'Safety you can trust',
  },
  {
    image: '/images/CE.png',
    title: 'CE Certified',
    subtitle: 'Meets EU standards',
  },
  {
    image: '/images/MCS.png',
    title: 'MCS Certified',
    subtitle: 'Quality installation',
    hidden: true,
  },
  {
    image: '/images/NICEIC.png',
    title: 'NICEIC Approved',
    subtitle: 'Trusted installers',
    hidden: true,
  },
  {
    image: '/images/RECC.png',
    title: 'RECC Member',
    subtitle: 'Consumer protection',
    hidden: true,
  },
  {
    image: '/images/25.png',
    title: 'Up to 25 Years',
    titleBold: 'Warranty',
    subtitle: 'Built to last.',
  },
]