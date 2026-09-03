import type { ReactNode } from 'react'
import Breadcrumb from '@/components/Breadcrumb'

// Blog hero. Reused on three pages:
//   - /blog                  → blog index
//   - /blog/category/[slug]  → category landing
//   - /blog/[cat]/[slug]     → article detail
//
// Same visual treatment as the other sub-page heroes (CasesHero /
// AboutHero / SolutionsHero): full-bleed `/images/hero-blog.webp` bg
// + left-to-right dark overlay so light text reads consistently.
//
// The category name appears ONCE on the badge line — callers pass
// whichever category text fits the page (e.g. `category.name_en`
// directly on detail / category pages, or a free-form brand string
// on the index). No separate category chip: it used to render the
// same name again and ended up visually duplicated against the
// breadcrumb / badge / h1.

export interface BlogHeroProps {
  /** Page-level badge copy rendered inside the pulse-dot pill. */
  badge: string
  /** Main headline (single line). */
  h1: string
  /** Optional second headline line - rendered in gradient on a new line. */
  h1Accent?: string
  /** Subhead under the headline. Pass empty string to hide. */
  subhead?: string
  /** Optional breadcrumb items above the badge. Defaults to Home → Blog. */
  breadcrumb?: Array<{ label: string; href?: string }>
  /**
   * Optional meta strip rendered below the subhead. Used by the
   * article detail page to surface author / date / reading time on
   * the dark hero surface (so the strip must use light-on-dark tokens,
   * not the white-bg `text-uk-slate` used previously).
   */
  meta?: ReactNode
}

export function BlogHero({
  badge,
  h1,
  h1Accent,
  subhead,
  breadcrumb,
  meta,
}: BlogHeroProps) {
  return (
    <section
      className="hero-banner relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/hero-blog.webp)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.65) 35%, rgba(15,23,42,0.25) 60%, rgba(15,23,42,0) 80%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Breadcrumb
          theme="light"
          items={breadcrumb ?? [{ label: 'Home', href: '/' }, { label: 'Blog' }]}
        />

        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mt-6">
          <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
          <span className="text-xs font-cw-regular text-white/90">{badge}</span>
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cw-bold leading-tight text-white mt-5 max-w-3xl">
          {h1}
          {h1Accent && (
            <>
              <br />
              <span className="text-gradient">{h1Accent}</span>
            </>
          )}
        </h1>

        {subhead && (
          <p className="mt-5 text-lg sm:text-xl text-white/85 font-cw-light max-w-2xl leading-relaxed">
            {subhead}
          </p>
        )}

        {meta && (
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
            {meta}
          </div>
        )}
      </div>
    </section>
  )
}