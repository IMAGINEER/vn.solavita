import type { ReactNode } from 'react'

/**
 * SectionEyebrow — the small pill that opens every Section on the
 * NG marketing pages. Mirrors the original UK eyebrow pattern but
 * renders against a light surface (the white pill version, not the
 * dark hero version which lives in `PageHero`).
 *
 * Two variants:
 *   - default `light` : used on white / slate-50 section backgrounds.
 *     Pill = `border border-uk-line bg-white` with a green dot.
 *   - `dark`           : used on dark section backgrounds if any are
 *     added later. Pill = `border-white/20 bg-white/10` with a green
 *     dot.
 *
 * The `<span data-section-eyebrow="true">` marker lets QA tooling
 * count eyebrow occurrences and verify every section has one.
 */

export interface SectionEyebrowProps {
  children: ReactNode
  variant?: 'light' | 'dark'
  className?: string
  /** Optional dot colour. Default emerald. */
  dotClassName?: string
  /** Disable the pulsing animation. Default false. */
  static?: boolean
}

export default function SectionEyebrow({
  children,
  variant = 'light',
  className = '',
  dotClassName = 'bg-uk-emerald',
  static: isStatic = false,
}: SectionEyebrowProps) {
  const base =
    variant === 'dark'
      ? 'border-white/20 text-white/90'
      : 'border-uk-line bg-white text-uk-slate'
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-cw-regular ${base} ${className}`.trim()}
      data-section-eyebrow="true"
    >
      <span
        className={`w-2 h-2 rounded-full ${dotClassName} ${
          isStatic ? '' : 'animate-pulse'
        }`}
      />
      {children}
    </span>
  )
}
