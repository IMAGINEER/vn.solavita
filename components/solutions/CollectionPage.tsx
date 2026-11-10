'use client'

import Link from 'next/link'
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Check,
  ChevronDown,
  Lightbulb,
  Tv,
  Snowflake,
  Droplet,
  PanelTop,
  Zap,
  Battery,
  Construction,
  Fan,
  Refrigerator,
  WashingMachine,
  Microwave,
  Monitor,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import FaqSection from '@/components/solutions/FaqSection'
import BrandAdvantageSection from '@/components/solutions/BrandAdvantageSection'
import SolutionAdvantageSection, {
  type SolutionAdvantage,
} from '@/components/solutions/SolutionAdvantageSection'
import ProductsShowcase, {
  type ShowcaseProduct,
} from '@/components/solutions/ProductsShowcase'
import type {
  LoadApplianceIconKey,
  LoadProfile,
  SolutionDetail,
  SolutionFaqItem,
} from '@/lib/data/solutions'
import { openFormModal } from '@/lib/form-modal'

/**
 * CollectionPage — the shared layout for the small-business solution
 * collection page (`/solutions/business-solar`). Per
 * `content/nigeria/solutions.md` (the collection-pages brief,
 * supersedes the original single `/solutions` overview).
 *
 * The residential lines no longer use this layout: SolaMate
 * (`/solutions/solamate`) and SolaHome (`/solutions/solahome`) have
 * their own page components.
 *
 * Layout (top → bottom):
 *   Header → Hero → 3 solution cards → Tailored CTA
 *   → FAQ → Trust bar → Footer.
 *
 * Both the comparison table ("COMPARE") and the tech-explainers grid
 * ("UNDERSTAND THE SPECS") were removed at the user's directive —
 * the per-tier detail pages under `/solutions/[slug]` carry that
 * technical detail.
 *
 * The "grid-cost reduction" narrative is the core story
 * (replaces the previous "OVERVIEW" context block per the user's
 * directive). It does not promise specific savings or payback -
 * the only TBD-bound numbers are the local tariff and the verified
 * savings methodology.
 */

export interface CollectionHeroProps {
  eyebrow: string
  title: string
  body: string
  backgroundImage: string
  primaryCta?: { label: string; onClick?: () => void; href?: string }
  secondaryCta?: { label: string; onClick?: () => void; href?: string }
  breadcrumbs?: { label: string; href?: string }[]
  /**
   * Optional CSS background for the scrim over the hero photo. Use it
   * when the photo is bright behind the copy column and the default
   * left-to-right navy gradient is not enough to keep the text
   * legible — see the business page, whose retail-building shot has a
   * white facade and pale pavement on the left.
   */
  overlay?: string
}

export interface CollectionContextCopy {
  heading: string
  body: string
}

export type CollectionFaq = SolutionFaqItem

/**
 * One category group inside the ①套餐 section.
 *
 * Per `docs/修改建议(2).docx` §"Solutions - Commercial & Industrial -
 * 详情页 ①套餐", the business page splits its packages into two
 * categories:
 *   分类1 — VITAL BUSINESS. VITAL GROWTH.  (shops, clinics, offices…)
 *   分类2 — HEAVY DEMAND. VITAL POWER.      (supermarkets, factories…)
 *
 * The residential page uses a single group with the plain
 * "Residential Solutions, Sized for Your Life and Backup Needs"
 * heading, so `eyebrow`/`title`/`body` are optional on a group.
 */
export interface CollectionSolutionGroup {
  /** Bubble-box title, e.g. "VITAL BUSINESS. VITAL GROWTH.". */
  eyebrow?: string
  /** Heading under the bubble box, e.g. "Shops, clinics, offices…". */
  title?: string
  /** Body under the heading. */
  body?: string
  /** Packages in this group. */
  solutions: SolutionDetail[]
  /**
   * Renders the group's cards with the highlighted (teal-outlined)
   * treatment. Used on the business page for the heavy-demand tier so
   * the third card reads as a different class of system.
   */
  featured?: boolean
  /**
   * Optional promo block under the group (the docx's
   * "INDUSTRIAL POWER, SIMPLIFIED. 125kW / 261kWh All-in-One ESS").
   */
  highlight?: {
    title: string
    spec: string
    body?: string
    href: string
    ctaLabel: string
    backgroundImage?: string
  }
}

export interface CollectionPageProps {
  scenario: 'home' | 'business'
  heroProps: CollectionHeroProps
  contextCopy: CollectionContextCopy
  solutions: SolutionDetail[]
  /**
   * Optional category grouping for the ①套餐 section. When omitted the
   * section falls back to a single heading for the whole scenario.
   */
  solutionGroups?: CollectionSolutionGroup[]
  tailoredCta: {
    eyebrow: string
    title: ReactNode
    body: string
    primaryCta: { label: string; onClick?: () => void; href?: string }
    secondaryCta?: { label: string; onClick?: () => void; href?: string }
  }
  /** ②优势-品牌赋能 — "VITAL ENERGY. VITAL TRUST.". */
  showBrandAdvantage?: boolean
  /** ②优势-解决方案整体优势 — scenario-specific advantage rows. */
  solutionAdvantage?: {
    eyebrow: string
    /** Section heading — the docx does not supply one for this block. */
    heading: ReactNode
    /** Optional lead paragraph under the heading. */
    intro?: string
    items: SolutionAdvantage[]
  }
  /** ③产品简介 — the "Products" card row + "View More Products" link. */
  showcaseProducts?: ShowcaseProduct[]
  faqs: CollectionFaq[]
}

export default function CollectionPage(props: CollectionPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      {/* Hero */}
      <PageHero
        backgroundImage={props.heroProps.backgroundImage}
        eyebrow={props.heroProps.eyebrow}
        title={props.heroProps.title}
        body={props.heroProps.body}
        primaryCta={props.heroProps.primaryCta}
        secondaryCta={props.heroProps.secondaryCta}
        breadcrumbs={props.heroProps.breadcrumbs}
        overlay={props.heroProps.overlay}
      />

      {/* ① 套餐 cards (grouped into categories on the business page) */}
      <SolutionsSection
        scenario={props.scenario}
        solutions={props.solutions}
        groups={props.solutionGroups}
      />

      {/* Tailored CTA — "Don't see your fit? Let's tailor a solution."
          Sits directly under the package cards per
          `docs/修改建议(2).docx` ①三张套餐卡片. */}
      <TailoredCtaSection cta={props.tailoredCta} />

      {/* ② 优势-品牌赋能 — "VITAL ENERGY. VITAL TRUST." */}
      {props.showBrandAdvantage && <BrandAdvantageSection />}

      {/* ② 优势-解决方案整体优势 — scenario-specific rows */}
      {props.solutionAdvantage && (
        <SolutionAdvantageSection
          eyebrow={props.solutionAdvantage.eyebrow}
          heading={props.solutionAdvantage.heading}
          intro={props.solutionAdvantage.intro}
          advantages={props.solutionAdvantage.items}
        />
      )}

      {/* ③ 产品简介 — the "Products" card row + "View More Products" */}
      {props.showcaseProducts && (
        <ProductsShowcase products={props.showcaseProducts} />
      )}

      {/* Components in Detail — tabbed deep dive (PV / inverter / battery
          / mounting). Distinct from the "Products" showcase above,
          which is the teaser that links into /products. */}
      <ProductSection />

      {/* Monitoring System — app download block */}
      <MonitoringSystemSection />

      {/* FAQ */}
      <FaqSection faqs={props.faqs} />

      {/* The trust-mark strip (formerly TrustBar) has been removed:
          it carried TÜV / CE / MCS / NICEIC / RECC / 25-year warranty
          marks that are unverified for Vietnam (VN content strategy
          rule 2). Re-introduce a NG-specific strip only once business
          confirms which approvals actually apply. */}
      <Footer />
    </main>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   3 solution cards (anchored as #solutions)
   ────────────────────────────────────────────────────────────────────── */

function SolutionsSection({
  scenario,
  solutions,
  groups,
}: {
  scenario: 'home' | 'business'
  solutions: SolutionDetail[]
  groups?: CollectionSolutionGroup[]
}) {
  // Grouped layout — the business page defines two categories in the
  // docx (分类1 / 分类2), but both render as ONE row of three equal
  // cards: each category's descriptive line is folded into the matching
  // card intro, and the heavy-demand group carries the teal outline so
  // the category split stays legible without breaking the grid.
  if (groups && groups.length > 0) {
    const cards = groups.flatMap((g) =>
      g.solutions.map((sol) => ({ sol, featured: g.featured })),
    )
    return (
      <section
        id="solutions"
        className="relative py-16 md:py-20 bg-uk-line/30 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <SectionEyebrow>
              {scenario === 'home'
                ? 'SOLUTIONS for HOME'
                : 'SOLUTIONS for BUSINESS'}
            </SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              {scenario === 'home' ? (
                <>
                  Residential Solutions, Sized for Your{' '}
                  <span className="text-gradient">Life and Backup Needs</span>
                </>
              ) : (
                <>
                  Commercial &amp; Industrial Solutions, Built to{' '}
                  <span className="text-gradient">Keep You Running</span>
                </>
              )}
            </h2>
          </div>

          {/* All packages in one equal-width row. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {cards.map(({ sol, featured }) => (
              <SolutionCard
                key={sol.id}
                sol={sol}
                scenario={scenario}
                featured={featured}
              />
            ))}
          </div>

          {/* Promo bands run full width under the two categories */}
          {groups.map(
            (g) => g.highlight && <SolutionHighlight key={g.highlight.title} highlight={g.highlight} />,
          )}

          {/* Reference footnote for the load & runtime figures shown on
              card hover. */}
          <p className="mt-10 text-xs text-uk-slate font-cw-regular leading-relaxed max-w-4xl mx-auto">
            {scenario === 'home'
              ? 'Note: Based on typical home assumptions. Actual peak loads and battery autonomy are affected by multiple factors. Data is for reference only and not an absolute guarantee.'
              : 'Note: This solution is based on typical commercial assumptions. Actual peak loads and battery autonomy are affected by multiple factors. Data is for reference only and does not constitute an absolute performance guarantee.'}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="solutions"
      className="relative py-16 md:py-20 bg-uk-line/30 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>{scenario === 'home' ? 'SOLUTIONS for HOME' : 'SOLUTIONS for BUSINESS'}</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            {scenario === 'home' ? (
              <>Residential Solutions, Sized for Your{' '}<span className="text-gradient">Life and Backup Needs</span></>
            ) : (
              <>Commercial &amp; Industrial Solutions, Built to{' '}<span className="text-gradient">Keep You Running</span></>
            )}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutions.map((sol) => (
            <SolutionCard key={sol.id} sol={sol} scenario={scenario} />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * The promo block under a solution category — the docx's
 * "INDUSTRIAL POWER, SIMPLIFIED. 125kW / 261kWh All-in-One ESS."
 * Full-bleed background band with the headline, the spec line and a
 * link through to the All-in-One ESS product page.
 */
function SolutionHighlight({
  highlight,
}: {
  highlight: NonNullable<CollectionSolutionGroup['highlight']>
}) {
  return (
    <div
      className="relative mt-8 rounded-2xl overflow-hidden bg-uk-navy bg-cover bg-center"
      style={
        highlight.backgroundImage
          ? { backgroundImage: `url(${highlight.backgroundImage})` }
          : undefined
      }
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(15,23,42,0.86) 0%, rgba(15,23,42,0.66) 45%, rgba(15,23,42,0.3) 75%, rgba(15,23,42,0) 100%)',
        }}
      />
      <div className="relative px-6 md:px-10 py-10 md:py-14">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-cw-bold text-white leading-tight">
          {highlight.title}
        </h3>
        <p className="mt-2 text-base md:text-lg text-white/85 font-cw-bold">
          {highlight.spec}
        </p>
        {highlight.body && (
          <p className="mt-3 text-sm md:text-base text-white/80 font-cw-regular leading-relaxed max-w-2xl">
            {highlight.body}
          </p>
        )}
        <Link
          href={highlight.href}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-cw-bold bg-white text-uk-navy border border-white hover:bg-uk-teal hover:text-uk-navy hover:border-uk-teal transition-colors"
        >
          {highlight.ctaLabel}
        </Link>
      </div>
    </div>
  )
}

function SolutionCard({
  sol,
  scenario: _scenario,
  featured = false,
}: {
  sol: SolutionDetail
  scenario: 'home' | 'business'
  /** Heavy-demand tier — teal outline + accent bar so the third card
   * reads as a different class of system in the 3-up row. */
  featured?: boolean
}) {
  // Render the eyebrow line with the spec part ("Single phase" /
  // "Three phase") highlighted in emerald. The descriptor after the "·"
  // stays in slate italic, matching the UK home-page card treatment.
  const eyebrowParts = sol.eyebrow.split(' · ')
  const specPart = eyebrowParts[0] ?? sol.eyebrow
  const descriptorPart = eyebrowParts.slice(1).join(' · ')
  // The load & runtime profile is the card's HOVER state — it used to
  // be its own section below the grid. On desktop the diagram sits ON
  // the cover image, rising out of a navy gradient so the product shot
  // stays visible at the top; on touch (no hover) the same diagram
  // falls into the normal flow under the card content so the data is
  // never hover-only.
  const profile = sol.loadProfile
  return (
    <div
      id={sol.id}
      className={`group relative flex flex-col rounded-2xl border bg-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 scroll-mt-24 ${
        featured
          ? 'border-uk-teal shadow-[0_0_0_1px_rgba(20,184,166,0.32),0_18px_45px_-30px_rgba(15,118,110,0.55)] hover:border-uk-teal-dark hover:shadow-[0_0_0_1px_rgba(20,184,166,0.5),0_24px_52px_-30px_rgba(15,118,110,0.6)]'
          : 'border-uk-line hover:border-uk-teal hover:shadow-md'
      }`}
    >
      {featured && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-[3px] bg-gradient-to-r from-uk-teal via-uk-emerald to-uk-teal" />
      )}
      {/* Solution image - the per-solution files live in /public/images
         named to match the solution id (LITE-Essential-Backup.webp etc). */}
      <div className="aspect-[4/3] bg-uk-line/30 overflow-hidden relative">
        <img
          src={sol.imagePath}
          alt={sol.imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        {/* Discoverability cue for the hover state — fades away as the
            diagram slides in. */}
        {profile && (
          <span className="pointer-events-none absolute bottom-3 left-3 z-[5] hidden xl:inline-flex items-center gap-1.5 rounded-full bg-uk-navy/80 px-2.5 py-1 text-[10px] font-cw-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
            <Battery className="w-3 h-3 text-uk-emerald" strokeWidth={2} />
            Load &amp; runtime
          </span>
        )}
        {/* LOAD & RUNTIME — the card's hover state, rebuilt from the
            reference deck's load strip (`docs/套餐组合-负载及运行时间-参考示意.pptx`):
            appliance icon + estimated hours, joined by "+". A navy
            scrim rises over the lower half of the render so the product
            photo stays readable above the strip. */}
        {profile && (
          <div
            className="absolute inset-0 z-10 hidden xl:flex flex-col justify-end px-4 pb-4 pt-10 opacity-0 pointer-events-none transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(15,23,42,0) 30%, rgba(15,23,42,0.74) 52%, rgba(15,23,42,0.96) 70%, rgba(15,23,42,1) 100%)',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 70% at 100% 100%, rgba(16,185,129,0.18), transparent 60%)',
              }}
            />
            <div className="relative motion-safe:translate-y-2 motion-safe:group-hover:translate-y-0 motion-safe:group-focus-within:translate-y-0 transition-transform duration-300 ease-out">
              <LoadDiagram profile={profile} tone="dark" animate />
            </div>
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg xl:text-xl font-cw-bold text-uk-navy leading-tight">
          {sol.title}
        </h3>
        <p className="mt-1 text-sm font-cw-bold">
          <span className="text-uk-emerald">{specPart}</span>
          {descriptorPart && (
            <>
              <span className="text-uk-slate"> · </span>
              <span className="text-uk-slate font-cw-regular italic">
                {descriptorPart}
              </span>
            </>
          )}
        </p>
        <p className="mt-3 text-sm text-uk-slate font-cw-regular leading-relaxed sm:min-h-[4.25rem] xl:min-h-12">
          {sol.shortIntro ?? sol.intro}
        </p>
        {/* 3-row spec table (Solar / Inverter / Battery) per
            `docs/修改建议.docx` §"①三张套餐卡片 ③表格数量3个". Replaces
            the previous bullet list + 2-box stat strip. */}
        <dl className="mt-5 divide-y divide-uk-line/60 border-y border-uk-line/60">
          {sol.specSummary.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-4 py-2 text-sm"
            >
              <dt className="text-uk-slate font-cw-regular">{row.label}</dt>
              <dd className="font-cw-bold text-uk-navy text-right">{row.value}</dd>
            </div>
          ))}
        </dl>
        {/* Touch / narrow-window fallback: no hover, so the same data
            renders in the normal flow between the specs and the CTA.
            Below `xl` the hover overlay is switched off entirely, so
            the two versions never double up. The grid variant keeps the
            rows readable when the card is narrow (tablet 3-up). */}
        {profile && (
          <div className="xl:hidden mt-4 pt-4 border-t border-uk-line/60">
            <LoadDiagram profile={profile} tone="light" variant="grid" />
          </div>
        )}
        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={() => openFormModal()}
            className="w-full btn-gradient py-2.5 rounded-lg text-sm font-cw-bold text-center text-white transition-all duration-300 block cursor-pointer"
          >
            Get Free Quote →
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * One appliance cell: icon + estimated hours on the top line, name
 * underneath. Shared by the hover strip and the inline grid so both
 * read the same way.
 */
function LoadChip({
  appliance,
  dark,
  delay,
  animate,
}: {
  appliance: LoadProfile['appliances'][number]
  dark: boolean
  delay: number
  animate: boolean
}) {
  const Icon = LOAD_APPLIANCE_ICONS[appliance.icon]
  return (
    <div
      className={`flex min-w-0 flex-col items-center ${
        animate
          ? 'motion-safe:opacity-0 motion-safe:translate-y-1.5 motion-safe:group-hover:translate-y-0 motion-safe:group-hover:opacity-100 transition-all duration-500 ease-out'
          : ''
      }`}
      style={{ transitionDelay: animate ? `${delay}ms` : undefined }}
    >
      <div className="flex items-center gap-0.5">
        <Icon
          className={`h-4 w-4 shrink-0 xl:h-[18px] xl:w-[18px] ${
            dark ? 'text-uk-teal-soft' : 'text-uk-teal-dark'
          }`}
          strokeWidth={1.7}
        />
        <span
          className={`whitespace-nowrap text-[10px] font-cw-bold leading-none xl:text-[11px] ${
            dark ? 'text-white' : 'text-uk-navy'
          }`}
        >
          {appliance.duration}
        </span>
      </div>
      <span
        className={`mt-1 w-full truncate text-center text-[10px] font-cw-regular ${
          dark ? 'text-white/65' : 'text-uk-slate'
        }`}
      >
        {appliance.name}
      </span>
    </div>
  )
}

/**
 * The load & runtime diagram, rebuilt from the reference deck's strip
 * (`docs/套餐组合-负载及运行时间-参考示意.pptx`): appliance icon + est.
 * hours joined by "+".
 *
 * - `strip` — the card's hover overlay: one horizontal row, on navy.
 * - `grid`  — the inline fallback below xl, where cards are too narrow
 *   for the plus-joined strip: a 3-up grid of the same cells.
 */
function LoadDiagram({
  profile,
  tone,
  variant = 'strip',
  animate = false,
}: {
  profile: LoadProfile
  tone: 'light' | 'dark'
  variant?: 'strip' | 'grid'
  animate?: boolean
}) {
  const dark = tone === 'dark'
  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={`text-[10px] font-cw-bold uppercase tracking-[0.2em] ${
            dark ? 'text-uk-emerald' : 'text-uk-teal-dark'
          }`}
        >
          Load &amp; runtime
        </span>
        <span
          className={`text-[10px] font-cw-regular ${
            dark ? 'text-white/50' : 'text-uk-slate'
          }`}
        >
          Est. hours
        </span>
      </div>
      {variant === 'strip' ? (
        <div className="mt-3 flex items-start">
          {profile.appliances.map((a, i) => (
            <Fragment key={`${a.name}-${i}`}>
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={`mt-[2px] shrink-0 px-0.5 text-[10px] font-cw-regular xl:text-[11px] ${
                    dark ? 'text-white/30' : 'text-uk-slate/60'
                  }`}
                >
                  +
                </span>
              )}
              <div className="min-w-0 flex-1">
                <LoadChip
                  appliance={a}
                  dark={dark}
                  delay={100 + i * 60}
                  animate={animate}
                />
              </div>
            </Fragment>
          ))}
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-x-2 gap-y-3">
          {profile.appliances.map((a, i) => (
            <div key={`${a.name}-${i}`} className="min-w-0">
              <LoadChip appliance={a} dark={dark} delay={0} animate={false} />
            </div>
          ))}
        </div>
      )}
      <p
        className={`mt-3 text-[10px] font-cw-regular leading-snug ${
          dark ? 'text-white/55' : 'text-uk-slate'
        }`}
      >
        {profile.caption}
      </p>
    </>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Tailored CTA - the "not a standard fit" block.
   Per the user's directive, the secondary CTA does NOT link to the
   other collection page (no "for home/business instead"). It now
   stays within the current scenario.
   ────────────────────────────────────────────────────────────────────── */

function TailoredCtaSection({
  cta,
}: {
  cta: CollectionPageProps['tailoredCta']
}) {
  return (
    <section className="relative py-16 md:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <SectionEyebrow>{cta.eyebrow}</SectionEyebrow>
        <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
          {cta.title}
        </h2>
        <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
          {cta.body}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <TailoredCtaButton cta={cta.primaryCta} variant="primary" />
          {cta.secondaryCta && (
            <TailoredCtaButton cta={cta.secondaryCta} variant="secondary" />
          )}
        </div>
      </div>
    </section>
  )
}

function TailoredCtaButton({
  cta,
  variant,
}: {
  cta: { label: string; onClick?: () => void; href?: string }
  variant: 'primary' | 'secondary'
}) {
  const cls =
    variant === 'primary'
      ? 'btn-gradient px-6 py-3 rounded-full text-sm font-cw-bold text-white'
      : 'px-6 py-3 rounded-full text-sm font-cw-bold border border-uk-teal text-uk-teal hover:bg-uk-teal hover:text-uk-navy transition-colors'
  if (cta.href) {
    return (
      <Link href={cta.href} className={cls}>
        {cta.label}
      </Link>
    )
  }
  return (
    <button type="button" onClick={cta.onClick} className={cls}>
      {cta.label}
    </button>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   LOAD & RUNTIME — the appliance icon map.
   The load & runtime data itself is no longer a standalone section:
   it is the HOVER state of each package card (see SolutionCard).
   ────────────────────────────────────────────────────────────────────── */

const LOAD_APPLIANCE_ICONS: Record<LoadApplianceIconKey, LucideIcon> = {
  tv: Tv,
  light: Lightbulb,
  fan: Fan,
  refrigerator: Refrigerator,
  ac: Snowflake,
  washer: WashingMachine,
  microwave: Microwave,
  pump: Droplet,
  pc: Monitor,
  freezer: Refrigerator,
}

/* ──────────────────────────────────────────────────────────────────────
   Components in Detail — 4-tab product deep-dive. Pattern ported
   from the UK `solutions/ProductDetails.tsx` and re-skinned for the
   VN light theme (uk-teal / uk-emerald / uk-navy / uk-slate tokens).
   Tabs: PV Modules / Inverters / Battery Storage / Mounting
   System. Each tab surfaces title, subtitle, description, spec
   table, highlights, and a 4-second auto-rotating image carousel
   with arrows + dots. Image hover reveals a "Learn More" CTA that
   routes to the matching product page (`/products/<slug>`).
   ────────────────────────────────────────────────────────────────────── */

interface ProductDetailTab {
  id: 'module' | 'inverter' | 'battery' | 'mounting'
  label: string
  Icon: LucideIcon
}

const PRODUCT_DETAIL_TABS: ProductDetailTab[] = [
  { id: 'module', label: 'PV Modules', Icon: PanelTop },
  { id: 'inverter', label: 'Inverters', Icon: Zap },
  { id: 'battery', label: 'Battery Storage', Icon: Battery },
  { id: 'mounting', label: 'Mounting System', Icon: Construction },
]

interface ProductDetailContent {
  title: string
  subtitle: string
  /** Target of the carousel's "Learn More" overlay — the product
      detail page for this tab's family (`/products/<slug>`). */
  href: string
  description: string
  specs: { label: string; value: string }[]
  highlights: string[]
  images: string[]
}

const PRODUCT_DETAIL_CONTENT: Record<
  ProductDetailTab['id'],
  ProductDetailContent
> = {
  module: {
    title: 'High-Output Monocrystalline PV Modules',
    subtitle: '620 W All-Black · High Efficiency',
    href: '/products/module',
    description:
      'Our all-black 620 W monocrystalline modules deliver high efficiency in a clean residential aesthetic. Engineered for low degradation and durable performance in local site conditions.',
    specs: [
      { label: 'Module series', value: 'All-Black monocrystalline' },
      { label: 'Rated power', value: '620 Wp per module' },
      { label: 'Cell type', value: 'Monocrystalline silicon' },
      { label: 'Module efficiency', value: 'Up to 21%+' },
      { label: 'Degradation', value: '≤2% (1st year), 0.55%/year after' },
      { label: 'Product warranty', value: '12 years' },
      { label: 'Performance warranty', value: '25 years linear' },
      { label: 'Protection class', value: 'IP68 junction box' },
    ],
    highlights: [
      'All-black design — clean integration on residential roofs',
      'High efficiency generation in standard and low-light conditions',
      'Durable construction for harsh climates and coastal humidity',
      'Optimised partial-shade tolerance for complex roof geometries',
      'Low annual degradation — long-term output predictability',
    ],
    images: [
      '/images/product-module-1.webp',
      '/images/product-module-2.webp',
      '/images/product-module-3.webp',
    ],
  },
  inverter: {
    title: 'Hybrid and Off-Grid Inverters',
    subtitle: '3–12 kW Single Phase · 5–20 kW Three Phase · 6 kW Off-Grid',
    href: '/products/inverter',
    description:
      'Three inverter families cover the whole range: a single-phase hybrid from 3 kW to 12 kW for homes, a three-phase hybrid from 5 kW to 20 kW for commercial sites, and a dedicated 6 kW off-grid unit for pure backup.',
    specs: [
      {
        label: 'Model families',
        value: 'SWH single-phase · SWH three-phase · SWO off-grid',
      },
      { label: 'Rated AC output', value: '3–12 kW · 5–20 kW · 6 kW' },
      {
        label: 'PV oversizing',
        value: '200% (single-phase) · up to 160% (three-phase)',
      },
      { label: 'Battery voltage', value: '48 V low voltage' },
      { label: 'Battery type', value: 'Li-ion / lead-acid' },
      {
        label: 'Backup switching',
        value: '<4 ms (single-phase) · <10 ms (three-phase)',
      },
      {
        label: 'Max. efficiency',
        value: '97.6% (single-phase) · 97.8–97.9% (three-phase)',
      },
      { label: 'Protection rating', value: 'IP66 (SWH hybrid) · IP65 (SWO off-grid)' },
      { label: 'Operating temperature', value: '−35 ~ +60 °C' },
      {
        label: 'Communication',
        value: 'RS485 · WiFi + LAN + Bluetooth · Modbus-RTU/TCP',
      },
      { label: 'Certifications', value: 'TBD — Verified local approvals' },
    ],
    highlights: [
      'Single-phase hybrid from 3 kW to 12 kW with 20 A per string and 200% PV oversizing',
      'Three-phase hybrid from 5 kW to 20 kW with up to 40 kW PV input',
      'Backup switching in under 4 ms (single-phase) and under 10 ms (three-phase)',
      'AI-driven AFCI and Type II SPD protection, in IP66 enclosures',
      'Dedicated 6 kW off-grid unit for pure backup, with load balancing',
    ],
    images: [
      '/images/products/inverter/swh-single-phase-1.webp',
      '/images/products/inverter/swh-three-phase-1.webp',
      '/images/products/inverter/swo-6000w.webp',
    ],
  },
  battery: {
    title: 'LiFePO₄ Battery Storage',
    subtitle: 'SWR Series · 51.2 V Low Voltage · 5.12–16.08 kWh',
    href: '/products/battery',
    description:
      'SWR modules come in 5.12 and 16.08 kWh cabinets that combine freely up to 16 units in parallel — enough to size a single home or a whole site. 1C continuous charge and discharge, IP65 for outdoor installation and a 10-year warranty.',
    specs: [
      { label: 'Chemistry', value: 'LiFePO₄ (lithium iron phosphate)' },
      { label: 'Rated voltage', value: '51.2 V (low voltage)' },
      { label: 'Rated energy', value: '5.12 kWh / 16.08 kWh' },
      { label: 'Rated capacity', value: '100 Ah / 314 Ah' },
      { label: 'Max. charge / discharge', value: '100 A / 200 A' },
      {
        label: 'Cycle life',
        value: '>8,000 cycles (0.5C) · ≥10,000 cycles (0.35C), 90% DOD',
      },
      {
        label: 'Dimensions (L × W × H)',
        value: '600 × 480 × 180 mm / 840 × 490 × 250 mm',
      },
      { label: 'Weight', value: '52 kg / 128 kg' },
      {
        label: 'Operating temperature',
        value: 'Charge 0 ~ 55 °C · Discharge −20 ~ 55 °C',
      },
      { label: 'Protection rating', value: 'IP65' },
      { label: 'Communication', value: 'RS485 · RS232 · CAN' },
      { label: 'Max. units in parallel', value: '16' },
      { label: 'Warranty', value: '10 years' },
    ],
    highlights: [
      'Max. 16 modules in parallel for scalable energy storage',
      '1C/1C continuous charge and discharge',
      'Flexible installation — modules at different SOC can be mixed safely',
      'Short-circuit lockout and surge resistance for all-round safety',
      'Automatic self-heating (−20 °C to 55 °C, optional) for outdoor installation',
      '10-year standard warranty',
    ],
    images: [
      '/images/products/battery/swr-5-12-front.webp',
      '/images/products/battery/swr-16-08-front.webp',
      '/images/products/battery/swr-5-12-left.webp',
    ],
  },
  mounting: {
    title: 'Universal Mounting System',
    subtitle: 'Fast · Safe · Roof-Friendly',
    // No standalone mounting product page exists — the mounting system
    // ships with the module line, so route to /products/module.
    href: '/products/module',
    description:
      'Our factory-engineered mounting system is optimised for all common roof types. No roof penetration on tile roofs — your roof integrity stays fully preserved.',
    specs: [
      { label: 'Compatible roof types', value: 'Tile / Slate / Trapezoidal metal / Flat' },
      { label: 'Material', value: 'Anodised aluminium + stainless steel A2' },
      { label: 'Wind load', value: 'Up to 2,400 Pa' },
      { label: 'Snow / uplift load', value: 'Up to 5,400 Pa' },
      { label: 'Module mounting', value: 'Clamp system, tool-optimised' },
      { label: 'Roof hooks', value: 'Height-adjustable, no tile cutting required' },
    ],
    highlights: [
      'No roof penetration — tiles are lifted, not drilled',
      'Tested to Eurocode for local wind and load conditions',
      'Compatible with all common module frames and frameless modules',
      'Black rails for visual unity with all-black modules',
      'Pre-assembled components — faster on-roof installation',
    ],
    images: [
      '/images/product-mounting-1.webp',
      '/images/product-mounting-2.webp',
      '/images/product-mounting-3.webp',
    ],
  },
}

function ProductSection() {
  const [activeTab, setActiveTab] = useState<ProductDetailTab['id']>('module')
  const [imageIdx, setImageIdx] = useState(0)
  const content = PRODUCT_DETAIL_CONTENT[activeTab]
  const imageCount = content.images.length

  // Auto-rotate the carousel every 4s; reset to first image when the
  // tab changes (handled by the `key={activeTab}` reset effect below).
  useEffect(() => {
    const id = setInterval(() => {
      setImageIdx((i) => (i + 1) % imageCount)
    }, 4000)
    return () => clearInterval(id)
  }, [activeTab, imageCount])

  // Reset the carousel to image 0 whenever the user switches tabs.
  useEffect(() => {
    setImageIdx(0)
  }, [activeTab])

  return (
    <section
      id="product"
      className="relative py-16 md:py-24 bg-uk-line/30 overflow-hidden scroll-mt-24"
    >
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header — same eyebrow/heading pattern as the rest
            of the page. "Components in Detail" matches the UK product
            page; the lead sentence echoes the VN product message
            (single-source supply, kit-level integration). */}
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Technical details
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Components in <span className="text-gradient">Detail</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular max-w-2xl mx-auto leading-relaxed">
            Every component is engineered, factory-built and tested as
            one kit — no mixed brands, no compatibility guesswork.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {PRODUCT_DETAIL_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-cw-bold border transition-all duration-300 ${
                activeTab === tab.id
                  ? 'border-uk-teal bg-uk-teal text-white shadow-md shadow-uk-teal/20'
                  : 'border-uk-line bg-white text-uk-slate hover:border-uk-teal/40 hover:text-uk-teal-dark'
              }`}
            >
              <tab.Icon className="w-4 h-4" strokeWidth={1.8} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content: 2-column grid (image carousel | spec + highlights) */}
        <div
          key={activeTab}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Image carousel — auto-rotates, hover reveals "Learn More" */}
          <div className="space-y-3">
            <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-uk-line">
              {content.images.map((img, idx) => (
                <div
                  key={`${activeTab}-${idx}`}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    idx === imageIdx
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${content.title} – image ${idx + 1}`}
                    loading="lazy"
                    // `object-contain`, not `cover`: the inverter and
                    // battery shots are alpha-cutout product renders at
                    // 1:1 / 0.60 / 0.74 ratios — `cover` inside this
                    // 4:3 frame crops their sides/top off. The module
                    // and mounting photos are already exactly 4:3, so
                    // `contain` renders them identically with no
                    // letterboxing.
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}

              {/* Hover-revealed "Learn More" overlay — routes to the
                  product page for the active tab (`content.href`), not
                  the generic /support page. */}
              <Link
                href={content.href}
                className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-uk-navy/55 text-white text-sm font-cw-bold transition-opacity"
              >
                Learn More →
              </Link>

              {/* Prev / Next arrows */}
              <button
                type="button"
                aria-label="Previous image"
                onClick={() =>
                  setImageIdx((prev) => (prev - 1 + imageCount) % imageCount)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-uk-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <svg
                  className="w-5 h-5 text-uk-navy"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => setImageIdx((prev) => (prev + 1) % imageCount)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-uk-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <svg
                  className="w-5 h-5 text-uk-navy"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2">
              {content.images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Show image ${idx + 1}`}
                  onClick={() => setImageIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === imageIdx
                      ? 'w-8 bg-uk-teal'
                      : 'w-2 bg-uk-line hover:bg-uk-teal/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Specs + highlights column */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-cw-bold text-uk-navy leading-tight">
                {content.title}
              </h3>
              <p className="mt-1 text-base text-uk-teal-dark font-cw-bold">
                {content.subtitle}
              </p>
              <p className="mt-3 text-base text-uk-slate font-cw-regular leading-relaxed">
                {content.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-cw-bold text-uk-slate uppercase tracking-wider mb-3">
                Technical data
              </h4>
              <div className="rounded-xl overflow-hidden border border-uk-line bg-white">
                {content.specs.map((spec, idx) => (
                  <div
                    key={`${activeTab}-spec-${idx}`}
                    className={`flex justify-between items-center gap-4 px-4 py-3 ${
                      idx % 2 === 0 ? 'bg-uk-line/20' : 'bg-white'
                    }`}
                  >
                    <span className="text-sm text-uk-slate font-cw-regular">
                      {spec.label}
                    </span>
                    <span className="text-sm text-uk-navy font-cw-bold text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-cw-bold text-uk-slate uppercase tracking-wider mb-3">
                Highlights
              </h4>
              <ul className="space-y-2.5">
                {content.highlights.map((item, idx) => (
                  <li
                    key={`${activeTab}-hl-${idx}`}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-uk-emerald/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-uk-emerald" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-uk-navy font-cw-regular leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/support"
              className="inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal-dark hover:text-uk-teal transition-colors"
            >
              Learn more in Support{' '}
              <ChevronDown className="w-4 h-4 -rotate-90" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Monitoring System — adapted from components/monitoring-app/PhoneShowcase.tsx.
   Centered phone with the dashboard screenshot + App Store / Google
   Play download CTAs. Above the phone, a 2-version rotating headline
   (motion AnimatePresence cross-fade) so the section reads as a
   single live product without splitting into two stacked cards.

   Named "Monitoring System" rather than the app's marketing name:
   the section covers the whole monitoring surface (app + dashboard),
   not just the phone app, and the same component is shared by both
   collection pages.
   ────────────────────────────────────────────────────────────────────── */

const MONITORING_HEADLINE_VARIANTS: ReadonlyArray<{
  title: ReactNode
  body: string
}> = [
  {
    title: (
      <>
        Take Full Control of Your Power,{' '}
        <span className="text-gradient">Anywhere</span>
      </>
    ),
    body:
      "Real-time generation, consumption, and battery status on one screen. Switch modes, set schedules, and maximize savings — from anywhere.",
  },
  {
    title: (
      <>
        One App. Total Visibility.{' '}
        <span className="text-gradient">Real Savings.</span>
      </>
    ),
    body:
      "Track solar generation, battery level, and load consumption live on one screen. No guesswork — just clear data that puts you in charge.",
  },
]

const MONITORING_ROTATE_MS = 5000

function MonitoringSystemSection() {
  const [variantIdx, setVariantIdx] = useState(0)
  // Auto-rotate the headline/body pair. Pause when the section leaves
  // the viewport so the AnimatePresence churn doesn't waste CPU off
  // screen.
  const sectionRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    let timer: ReturnType<typeof setInterval> | null = null
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (timer == null) {
              timer = setInterval(() => {
                setVariantIdx((i) => (i + 1) % MONITORING_HEADLINE_VARIANTS.length)
              }, MONITORING_ROTATE_MS)
            }
          } else if (timer != null) {
            clearInterval(timer)
            timer = null
          }
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      if (timer != null) clearInterval(timer)
    }
  }, [])

  const variant = MONITORING_HEADLINE_VARIANTS[variantIdx]

  return (
    <section
      ref={sectionRef}
      id="monitoring-system"
      className="relative py-16 md:py-24 bg-sv-blue/10 overflow-hidden scroll-mt-24"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title block — trajectory matches every other section on the
            page (SectionEyebrow + `text-3xl md:text-4xl` h2 with `mt-5`).
            Only the headline/body pair rotates, cross-fading every
            MONITORING_ROTATE_MS. */}
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <SectionEyebrow>MONITORING SYSTEM</SectionEyebrow>
          <div className="relative mt-5 min-h-[1em]">
            <AnimatePresence mode="wait">
              <motion.h2
                key={`title-${variantIdx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight"
              >
                {variant.title}
              </motion.h2>
            </AnimatePresence>
          </div>
          <div className="relative mt-4 min-h-[1em]">
            <AnimatePresence mode="wait">
              <motion.p
                key={`body-${variantIdx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="text-base md:text-lg text-uk-slate font-cw-regular max-w-2xl mx-auto leading-relaxed"
              >
                {variant.body}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Variant dots - lets the user see which line is active and
              click to switch manually. Hidden from screen readers since
              the rotation is decorative. */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {MONITORING_HEADLINE_VARIANTS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show headline ${i + 1}`}
                onClick={() => setVariantIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === variantIdx
                    ? 'w-6 bg-uk-teal'
                    : 'w-2 bg-uk-line hover:bg-uk-teal/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Centered phone - same frame treatment as PhoneShowcase.
            Dashboard image is /images/cloud-app-data.webp (same asset
            that the standalone /monitoring-app page uses). */}
        <div className="mx-auto max-w-[260px]">
          <div className="relative rounded-[2.5rem] border-[6px] border-uk-navy/80 bg-sv-navy overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-sv-dark rounded-b-2xl z-10" />
            <img
              alt="Solavita monitoring system - energy dashboard"
              loading="lazy"
              className="w-full h-auto block"
              src="/images/cloud-app-data.webp"
            />
          </div>
        </div>

        {/* App Store + Google Play download CTAs - identical to
            PhoneShowcase so visitors get the same download path whether
            they reach this section from /solutions or /monitoring-app. */}
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <a
            href="https://apps.apple.com/us/app/skyworth-pv/id6499499800"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="App Store download"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-uk-teal-soft border border-uk-teal/30 hover:bg-uk-teal-soft/80 hover:border-uk-teal/60 transition-colors"
          >
            <svg
              className="w-6 h-6 text-uk-navy"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] text-uk-slate font-cw-regular">
                Download on the
              </div>
              <div className="text-sm font-cw-bold text-uk-navy">
                App Store
              </div>
            </div>
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.solavita.cloud"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Google Play download"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-uk-teal-soft border border-uk-teal/30 hover:bg-uk-teal-soft/80 hover:border-uk-teal/60 transition-colors"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"
                fill="#00B9EE"
              />
            </svg>
            <div className="text-left">
              <div className="text-[10px] text-uk-slate font-cw-regular">
                Get it on
              </div>
              <div className="text-sm font-cw-bold text-uk-navy">
                Google Play
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
