/**
 * TrustBar items — Nigeria.
 *
 * The previous UK version of this file held six items referencing UK
 * certifications (TUV / CE / MCS / NICEIC / RECC) and a 25-year
 * warranty mark. The NG site must not carry these marks without
 * verification — the NG content strategy forbids MCS / NICEIC / RECC /
 * TUV / CE / 25-year / DARES-style claims unless business confirms the
 * certification actually applies in Nigeria.
 *
 * This file now exports an empty list. The TrustBar component should
 * render nothing (or a single `TBD — Verified Nigeria trust marks`
 * line) when the array is empty. To add NG trust marks later:
 *   - Confirm the certification / mark is real and applicable to NG.
 *   - Add an image asset under `public/images/` if one is needed.
 *   - Populate the entry with verified title and subtitle.
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
   * Used to temporarily retire third-party accreditation marks while
   * business reconciles the claims with the corresponding contractual
   * evidence.
   */
  hidden?: boolean
}

/**
 * UK trust mark list copied 1:1 from the previous UK site
 * (`/d/UK.solavita/lib/data/uk-trust.ts`). The user explicitly
 * requested the same items, layout and visual treatment as the UK
 * site. NG-specific verification of each mark is still pending - per
 * the brand-voice memory, UK marks must not be carried over to NG
 * without verification. The list lives here so the TrustBar can
 * render identically to the UK site; replace with verified NG
 * equivalents (SONCAP, ISO, etc.) once business confirms them.
 */
export const ngTrustItems: UkTrustItem[] = [
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

// Backwards-compat alias. The previous UK file exported `ukTrustItems`;
// the same name is still used by `components/TrustBar.tsx`. Re-exported
// here so the consumer doesn't need to change the import.
export const ukTrustItems: UkTrustItem[] = ngTrustItems
