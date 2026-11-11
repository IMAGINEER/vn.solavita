'use client'

import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import TbdText from '@/components/ui/tbd-text'

/**
 * PageHero — full-bleed background-image hero, matching the UK site's
 * previous visual treatment. Use on every marketing-page hero
 * (homepage, /solutions, /about-us, /monitoring-app, /cases, /support,
 * /for-partners, /contact-us, /solutions/[slug]).
 *
 * Two variants — pass `variant` to pick the section sizing:
 *   - `"home"` — `min-h-[90vh] pt-24 pb-16` with `flex items-center`,
 *     so the copy sits in the vertical middle of a near-full-viewport
 *     hero. Matches the UK `components/HeroSection.tsx` (homepage
 *     hero, line 128). Use on `/`.
 *   - `"inner"` (default) — `pt-32 pb-16 lg:pt-36 lg:pb-24` with
 *     no `min-h` / no flex centering, so the section auto-sizes to
 *     padding + content. Matches the UK inner-page heroes
 *     (`components/about/Hero.tsx`, `components/solutions/Hero.tsx`,
 *     ...). Use on every other marketing page.
 *
 * Visual recipe (per the original UK components/HeroSection.tsx and
 * components/solutions/Hero.tsx):
 *   - Background image at `bg-cover bg-center`.
 *   - Left-to-right dark gradient overlay so the copy column stays
 *     legible while the image shows through on the right.
 *   - Eyebrow pill (white border, white/10 backdrop) with a green
 *     pulsing dot and the eyebrow text.
 *   - Large H1 in the brand gradient (`text-gradient` on the heading
 *     itself, so the whole title — not just a highlighted phrase —
 *     carries the theme ramp).
 *   - Subhead at `text-white/85`.
 *   - One or two CTAs (primary = gradient; secondary = outlined).
 *   - Optional breadcrumb (inner pages only).
 *   - Optional `children` slot below the CTAs for trust pills or a
 *     NG `TBD — Verified …` card.
 *
 * Notes:
 *   - The H1 is a multi-line string in the form `"Line A\nLine B"`.
 *     Legacy `*` markers are stripped when rendering — the whole
 *     heading is gradient now.
 *   - The CTA accepts either an `onClick` (for `openFormModal`) or
 *     an `href` (for static links to /solutions, /contact-us, ...).
 */

export interface PageHeroCta {
  label: string
  onClick?: () => void
  href?: string
  external?: boolean
  /** Visual treatment. Default = primary. */
  variant?: 'primary' | 'secondary'
}

export interface PageHeroProps {
  backgroundImage: string
  eyebrow: string
  /** Use `\n` for line breaks; suffix a line with `*` to wrap it in text-gradient. */
  title: string
  /**
   * Sub-headline. A plain string renders as-is; a ReactNode allows an
   * explicit `<br />` where the copy needs a hard break (used by the
   * homepage hero, which splits its two claims onto separate lines).
   */
  body?: ReactNode
  primaryCta?: PageHeroCta
  secondaryCta?: PageHeroCta
  breadcrumbs?: { label: string; href?: string }[]
  children?: ReactNode
  /**
   * Layout variant.
   *   - `"home"`  → `min-h-[90vh] flex items-center pt-24 pb-16`,
   *     matching the UK `components/HeroSection.tsx`. Use on `/`.
   *   - `"inner"` (default) → `pt-32 pb-16 lg:pt-36 lg:pb-24` with
   *     no `min-h` / no flex centering, matching the UK inner-page
   *     heroes (`components/about/Hero.tsx` etc.). Use on every
   *     other marketing page.
   */
  variant?: 'home' | 'inner'
  /**
   * CSS background for the scrim over the photo. Defaults to the
   * left-to-right navy gradient that keeps the copy column legible.
   * Pass a custom one when the photo is bright on the left (e.g. the
   * SolaMate balcony shot, whose left third is a white facade) and
   * the copy needs a heavier, differently-shaped mask.
   */
  overlay?: string
  /**
   * Tighter vertical rhythm between title, body, CTAs and the children
   * slot. The solution-page heroes use it so the whole first screen —
   * title, promise, two CTAs and the three selling points — reads
   * without scrolling.
   */
  compact?: boolean
}

export default function PageHero({
  backgroundImage,
  eyebrow,
  title,
  body,
  primaryCta,
  secondaryCta,
  breadcrumbs,
  children,
  variant = 'inner',
  overlay,
  compact = false,
}: PageHeroProps) {
  // Outer section sizing differs per variant — see JSDoc above. The
  // two class strings mirror the UK originals: home → HeroSection
  // (full-bleed 90vh centered), inner → {about,solutions,...}/Hero
  // (auto-sized, content sits at top after `pt-32/lg:pt-36`).
  const sectionClass =
    variant === 'home'
      ? 'hero-banner relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-cover bg-center'
      : 'hero-banner relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-cover bg-center'

  // Default scrim: darkest behind the copy column, fading out toward
  // the right so the image shows through. Mirrors the UK HeroSection
  // treatment. Pages with a bright photo on the left can pass their own.
  const scrim =
    overlay ??
    'linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.65) 35%, rgba(15,23,42,0.25) 60%, rgba(15,23,42,0) 80%)'

  return (
    <section
      className={sectionClass}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Directional overlay - darkest behind the copy column, fading
         out toward the right so the image shows through. Mirrors the
         UK HeroSection treatment. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: scrim }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {breadcrumbs && (
          <div className="mb-6">
            <Breadcrumb theme="light" items={breadcrumbs} />
          </div>
        )}

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
          data-hero-eyebrow="true"
        >
          <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
          <span className="text-xs font-cw-regular text-white/90">{eyebrow}</span>
        </motion.span>

        {/* `py-[0.15em]` is not decoration: `.text-gradient` paints the
            headline only inside the element's box (background-clip:
            text), so Vietnamese diacritics (ấ, ằ, ữ …) and the
            descenders of g/q that reach past a `leading-tight` line box
            would be left unpainted — transparent, which reads as the
            letters being sliced top and bottom. The padding widens the
            painted area so the full glyphs stay visible. Same treatment
            as the products/module H1 (ProductDetail.tsx). */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-cw-bold leading-tight text-gradient mt-5 py-[0.15em] max-w-3xl capitalize"
        >
          {renderTitle(title)}
        </motion.h1>

        {body && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className={`text-lg sm:text-xl text-white/85 font-cw-light max-w-2xl leading-relaxed ${
              compact ? 'mt-4' : 'mt-5'
            }`}
          >
            {body}
          </motion.p>
        )}

        {(primaryCta || secondaryCta) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
            className={`flex flex-col sm:flex-row gap-4 ${
              compact ? 'mt-6' : 'mt-8'
            }`}
          >
            {primaryCta && <HeroCta cta={primaryCta} variant="primary" />}
            {secondaryCta && <HeroCta cta={secondaryCta} variant="secondary" />}
          </motion.div>
        )}

        {children && <div className={compact ? 'mt-6' : 'mt-8'}>{children}</div>}
      </div>
    </section>
  )
}

function HeroCta({ cta, variant }: { cta: PageHeroCta; variant: 'primary' | 'secondary' }) {
  const cls =
    variant === 'primary'
      ? 'group btn-gradient text-white px-8 py-4 rounded-full font-cw-bold text-center text-base cursor-pointer inline-flex items-center justify-center gap-2 leading-none'
      : 'px-8 py-4 rounded-full border-2 border-white/70 bg-transparent text-white font-cw-regular text-center text-base hover:bg-white/10 hover:border-white transition-colors'
  const inner = (
    <>
      <span>{cta.label}</span>
      {variant === 'primary' && (
        <ArrowUpRight
          className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45"
          strokeWidth={2.5}
        />
      )}
    </>
  )
  if (cta.href) {
    if (cta.external) {
      return (
        <a href={cta.href} target="_blank" rel="noopener noreferrer" className={cls}>
          {inner}
        </a>
      )
    }
    return (
      <a href={cta.href} className={cls}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" onClick={cta.onClick} className={cls}>
      {inner}
    </button>
  )
}

/**
 * Render the H1 with two syntaxes supported:
 *   1. `*` at the end of a line  → entire line is gradient
 *      ("Cut Diesel.*\nOwn Your Power.*")
 *   2. Inline `*` markers         → each `*` toggles gradient on/off
 *      within a single line. The initial state is "plain" if the
 *      line starts with `*` and "gradient" otherwise.
 *      Examples:
 *        "Cut Diesel.*"            → "Cut Diesel." (gradient)
 *        "Solar solutions* plain* gradient"
 *                                  → "Solar solutions" (gradient)
 *                                     " plain" (plain)
 *                                     " gradient" (gradient)
 *        "*plain then* gradient*"  → "plain then" (plain)
 *                                     " gradient" (gradient)
 *
 * The asterisk characters are stripped from the rendered text in both
 * modes. Newline characters split the input into multiple <span
 * class="block"> lines.
 */
function renderTitle(raw: string) {
  // The H1 itself carries `.text-gradient`, so the whole title — every
  // line — is painted with the brand ramp. Legacy `*` markers (which
  // used to switch individual words between plain white and gradient)
  // are stripped here so old title strings keep rendering cleanly.
  const lines = raw.split('\n')
  return (
    <>
      {lines.map((line, idx) => (
        <span key={idx} className="block">
          {line.replace(/\*/g, '')}
        </span>
      ))}
    </>
  )
}

/**
 * TrustPill — a single pill used in the optional `children` slot of
 * PageHero. Renders an icon + label in the dark-on-dark style.
 */
export interface HeroPillProps {
  icon: ReactNode
  text: ReactNode
}
export function HeroPill({ icon, text }: HeroPillProps) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="font-cw-regular text-white text-sm">{text}</span>
    </div>
  )
}

export interface HeroPillsRowProps {
  pills: HeroPillProps[]
}
export function HeroPillsRow({ pills }: HeroPillsRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
      {pills.map((p, i) => (
        <HeroPill key={i} icon={p.icon} text={p.text} />
      ))}
    </div>
  )
}

/**
 * HeroTbdCard — pin a small `TBD — Verified ...` card to the
 * bottom-right of the hero, mirroring the UK Trustpilot card slot.
 * The card content is a red TBD until the equivalent UK / NG
 * "trusted by" claim has a verified source.
 */
export interface HeroTbdCardProps {
  eyebrow: string
  body?: ReactNode
}
export function HeroTbdCard({ eyebrow, body }: HeroTbdCardProps) {
  return (
    <div className="inline-block max-w-xs bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-uk-line">
      <div className="text-xs font-cw-bold text-uk-slate tracking-wider uppercase">
        {eyebrow}
      </div>
      <div className="mt-2 text-sm text-uk-navy font-cw-regular">
        {body ?? <TbdText text="Tín hiệu tin cậy đã xác minh tại Việt Nam (chờ xác nhận)" />}
      </div>
    </div>
  )
}
