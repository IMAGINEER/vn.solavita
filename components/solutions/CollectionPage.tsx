'use client'

import Link from 'next/link'
import { Fragment, type ReactNode } from 'react'
import {
  Lightbulb,
  Tv,
  Snowflake,
  Droplet,
  Battery,
  Fan,
  Refrigerator,
  WashingMachine,
  Microwave,
  Monitor,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
 * CollectionPage — the shared layout for the two NG solution
 * collection pages (`/solutions/home-solar` and
 * `/solutions/business-solar`). Per `content/nigeria/solutions.md`
 * (the collection-pages brief, supersedes the original single
 * `/solutions` overview).
 *
 * Layout (top → bottom):
 *   Header → Hero → solution cards → Tailored CTA → Brand advantage
 *   → Solution advantage → Products showcase → FAQ → Footer.
 *
 * The "Technical details" product deep-dive and the "Monitoring
 * System" app block used to render here on both collection pages;
 * they now live on the homepage
 * (`components/sections/ProductDeepDiveSection.tsx` and
 * `components/sections/MonitoringSystemSection.tsx`) so the two
 * solution pages stay focused on the packages.
 *
 * Both the comparison table ("COMPARE") and the tech-explainers grid
 * ("UNDERSTAND THE SPECS") were removed at the user's directive —
 * the per-tier detail pages under `/solutions/[slug]` carry that
 * technical detail.
 *
 * The "Solar-vs-Diesel math" section is the core Nigerian narrative
 * (replaces the previous "OVERVIEW" context block per the user's
 * directive). It does not promise specific savings, payback or
 * generator elimination - the only TBD-bound numbers are the
 * local fuel price and the verified savings methodology.
 */

export interface CollectionHeroProps {
  eyebrow: string
  title: string
  body: string
  backgroundImage: string
  primaryCta?: { label: string; onClick?: () => void; href?: string }
  secondaryCta?: { label: string; onClick?: () => void; href?: string }
  breadcrumbs?: { label: string; href?: string }[]
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
    /**
     * One fixed aspect ratio for every band, e.g. '4 / 1'. Set it to
     * make the three bands uniform strips; omit it and each band
     * follows its own image.
     */
    bandRatio?: string
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
          bandRatio={props.solutionAdvantage.bandRatio}
          advantages={props.solutionAdvantage.items}
        />
      )}

      {/* ③ 产品简介 — the "Products" card row + "View More Products" */}
      {props.showcaseProducts && (
        <ProductsShowcase products={props.showcaseProducts} />
      )}

      {/* FAQ */}
      <FaqSection
        faqs={props.faqs}
        eyebrow="FAQ"
        title={
          <>
            Câu hỏi <span className="text-gradient">thường gặp</span>
          </>
        }
      />

      {/* The trust-mark strip (formerly TrustBar) has been removed:
          it carried TÜV / CE / MCS / NICEIC / RECC / 25-year warranty
          marks that are unverified for Nigeria (NG content strategy
          rule 2). Re-introduce a NG-specific strip only once business
          confirms which approvals actually apply. */}
      <Footer />
    </main>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Solution cards (anchored as #solutions) — six on the home page,
   three on the business page
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
                ? 'GIẢI PHÁP CHO NGÔI NHÀ'
                : 'CÁC GÓI GIẢI PHÁP'}
            </SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              {scenario === 'home' ? (
                <>
                  Điện mặt trời cho ngôi nhà,{' '}
                  <span className="text-gradient">đủ dùng và có dự phòng</span>
                </>
              ) : (
                <>
                  Chọn theo phụ tải,{' '}
                  <span className="text-gradient">vận hành không gián đoạn</span>
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
              ? 'Phụ tải và thời gian tự chủ là ước tính theo hộ gia đình thông thường; thực tế phụ thuộc thiết bị và cách dùng điện.'
              : 'Phụ tải và thời gian tự chủ là ước tính theo doanh nghiệp thông thường; thực tế phụ thuộc thiết bị vận hành và giờ hoạt động.'}
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
          <SectionEyebrow>{scenario === 'home' ? 'GIẢI PHÁP CHO NGÔI NHÀ' : 'CÁC GÓI GIẢI PHÁP'}</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            {scenario === 'home' ? (
              <>Điện mặt trời cho ngôi nhà,{' '}<span className="text-gradient">đủ dùng và có dự phòng</span></>
            ) : (
              <>Chọn theo phụ tải,{' '}<span className="text-gradient">vận hành không gián đoạn</span></>
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
            Phụ tải &amp; thời gian chạy
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
            Nhận báo giá miễn phí →
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
          Phụ tải &amp; thời gian chạy
        </span>
        <span
          className={`text-[10px] font-cw-regular ${
            dark ? 'text-white/50' : 'text-uk-slate'
          }`}
        >
          Giờ ước tính
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

