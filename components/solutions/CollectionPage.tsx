'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'
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
import TrustBar from '@/components/TrustBar'
import FaqSection from '@/components/solutions/FaqSection'
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
 *   Header → Hero → Solar-vs-Diesel math → 3 solution cards → Tailored CTA
 *   → FAQ → Trust bar → Footer.
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

export interface CollectionPageProps {
  scenario: 'home' | 'business'
  heroProps: CollectionHeroProps
  contextCopy: CollectionContextCopy
  solutions: SolutionDetail[]
  tailoredCta: {
    eyebrow: string
    title: ReactNode
    body: string
    primaryCta: { label: string; onClick?: () => void; href?: string }
    secondaryCta?: { label: string; onClick?: () => void; href?: string }
  }
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

      {/* 3 solution cards */}
      <SolutionsSection
        scenario={props.scenario}
        solutions={props.solutions}
      />

      {/* LOAD & RUNTIME — appliance load profiles per package */}
      <LoadRuntimeSection
        solutions={props.solutions}
        scenario={props.scenario}
      />

      {/* PRODUCT — default collapsed; placeholder tabs pending images */}
      <ProductSection />

      {/* Tailored CTA */}
      <TailoredCtaSection cta={props.tailoredCta} />

      {/* Monitoring System — app download block */}
      <MonitoringSystemSection />

      {/* FAQ */}
      <FaqSection faqs={props.faqs} />

      <TrustBar />
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
}: {
  scenario: 'home' | 'business'
  solutions: SolutionDetail[]
}) {
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
              <>Home Solar Solutions, Sized for Your{' '}<span className="text-gradient">Life and Backup Needs</span></>
            ) : (
              <>Business Solar Solutions, Built to{' '}<span className="text-gradient">Keep You Running</span></>
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

function SolutionCard({
  sol,
  scenario: _scenario,
}: {
  sol: SolutionDetail
  scenario: 'home' | 'business'
}) {
  // Render the eyebrow line with the spec part ("Single phase" /
  // "Three phase") highlighted in emerald. The descriptor after the "·"
  // stays in slate italic, matching the UK home-page card treatment.
  const eyebrowParts = sol.eyebrow.split(' · ')
  const specPart = eyebrowParts[0] ?? sol.eyebrow
  const descriptorPart = eyebrowParts.slice(1).join(' · ')
  return (
    <div
      id={sol.id}
      className="group flex flex-col rounded-2xl border border-uk-line bg-white overflow-hidden transition-all duration-300 hover:border-uk-teal hover:shadow-md hover:-translate-y-0.5 scroll-mt-24"
    >
      {/* Solution image - the per-solution files live in /public/images
         named to match the solution id (LITE-Essential-Backup.webp etc). */}
      <div className="aspect-[4/3] bg-uk-line/30 overflow-hidden">
        <img
          src={sol.imagePath}
          alt={sol.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-cw-bold text-uk-navy leading-tight">
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
        <p className="mt-3 text-sm text-uk-slate font-cw-regular leading-relaxed">
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
        <button
          type="button"
          onClick={() => openFormModal()}
          className="mt-3 w-full btn-gradient py-2.5 rounded-lg text-sm font-cw-bold text-center text-white transition-all duration-300 block cursor-pointer"
        >
          Get Free Quote →
        </button>
      </div>
    </div>
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
      : 'px-6 py-3 rounded-full text-sm font-cw-bold border border-uk-teal text-uk-teal hover:bg-uk-teal hover:text-white transition-colors'
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
   LOAD & RUNTIME — placeholder layout.
   Per the doc: title "Not sure which fits? Request a tailored config.",
   load icon/name + Est. duration + scenario, plus the
   PSH/NASA-POWER footnote. The actual load rows + reference image
   will be supplied as a separate folder; until then we render a
   skeletal grid with three illustrative rows so the section's CSS,
   spacing and footnote are in place.
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

function LoadRuntimeSection({
  solutions,
  scenario,
}: {
  solutions: SolutionDetail[]
  scenario: 'home' | 'business'
}) {
  const rows = solutions.filter((s) => s.loadProfile)
  const note =
    scenario === 'home'
      ? 'Note: Based on typical home assumptions. Actual peak loads and battery autonomy are affected by multiple factors. Data is for reference only and not an absolute guarantee.'
      : 'Note: This solution is based on typical commercial assumptions. Actual peak loads and battery autonomy are affected by multiple factors. Data is for reference only and does not constitute an absolute performance guarantee.'
  return (
    <section
      id="load-runtime"
      className="relative py-16 md:py-20 bg-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>LOAD &amp; RUNTIME</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Not sure which fits?{' '}
            <span className="text-gradient">Request a tailored config.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rows.map((sol) => (
            <LoadCard key={sol.id} sol={sol} profile={sol.loadProfile!} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/contact-us"
            className="btn-gradient px-6 py-3 rounded-full text-sm font-cw-bold text-white"
          >
            Request a tailored config →
          </Link>
        </div>
        <p className="mt-8 text-xs text-uk-slate font-cw-regular leading-relaxed max-w-4xl mx-auto">
          {note}
        </p>
        <p className="mt-3 text-xs text-uk-slate font-cw-regular leading-relaxed max-w-4xl mx-auto">
          Based on average 5.5 peak sun hours/day for representative
          Nigerian off-grid towns (Lagos/Abuja/North-Central band, NASA
          POWER / GVE 10-yr monitoring avg), after 5.9% system losses,
          96% inverter efficiency, clipping and battery round-trip losses.
          Wet-season worst-month PSH ~3.5–4.0h in Lagos / ~4.0–4.5h in
          Abuja — actual savings may run 10–20% lower in peak rainy
          months, higher in dry season.
        </p>
      </div>
    </section>
  )
}

function LoadCard({
  sol,
  profile,
}: {
  sol: SolutionDetail
  profile: LoadProfile
}) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-uk-line bg-white">
      {/* Faded scene image sits behind the card content. */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={sol.imagePath}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover opacity-15"
        />
      </div>
      <div className="relative p-5 md:p-6">
        <h3 className="text-base font-cw-bold text-uk-navy text-center">
          {sol.title}
        </h3>
        <p className="mt-1 text-[11px] text-uk-slate font-cw-regular text-center">
          {profile.caption}
        </p>
        <ul className="mt-4 space-y-2">
          {profile.appliances.map((a, i) => {
            const Icon = LOAD_APPLIANCE_ICONS[a.icon]
            return (
              <li
                key={`${a.name}-${i}`}
                className="flex items-center gap-2.5"
              >
                <span className="w-7 h-7 rounded-md bg-uk-emerald/15 flex items-center justify-center text-uk-emerald flex-shrink-0">
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                </span>
                <span className="text-xs text-uk-navy font-cw-regular flex-1 min-w-0 truncate">
                  {a.name}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-uk-teal-soft border border-uk-teal/25 text-[11px] font-cw-bold text-uk-teal-dark flex-shrink-0">
                  Est. {a.duration}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Components in Detail — 4-tab product deep-dive. Pattern ported
   from the UK `solutions/ProductDetails.tsx` and re-skinned for the
   NG light theme (uk-teal / uk-emerald / uk-navy / uk-slate tokens).
   Tabs: PV Modules / Hybrid Inverter / Battery Storage / Mounting
   System. Each tab surfaces title, subtitle, description, spec
   table, highlights, and a 4-second auto-rotating image carousel
   with arrows + dots. Image hover reveals a "Learn More" CTA that
   routes to /support (where the Download chapter is built later).
   ────────────────────────────────────────────────────────────────────── */

interface ProductDetailTab {
  id: 'module' | 'inverter' | 'battery' | 'mounting'
  label: string
  Icon: LucideIcon
}

const PRODUCT_DETAIL_TABS: ProductDetailTab[] = [
  { id: 'module', label: 'PV Modules', Icon: PanelTop },
  { id: 'inverter', label: 'Hybrid Inverter', Icon: Zap },
  { id: 'battery', label: 'Battery Storage', Icon: Battery },
  { id: 'mounting', label: 'Mounting System', Icon: Construction },
]

interface ProductDetailContent {
  title: string
  subtitle: string
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
    title: 'Hybrid Inverter',
    subtitle: 'Single-Phase or Three-Phase · On-/Off-Grid',
    description:
      'The Solavita hybrid inverter combines PV conversion, battery management, and seamless on-/off-grid switching in a single unit. Supports essential-circuit backup so your home stays powered through outages.',
    specs: [
      { label: 'Range', value: '3.6 kW (single-phase) — 20 kW (three-phase)' },
      { label: 'PV oversizing', value: 'Up to 150% DC/AC' },
      { label: 'Grid connection', value: '1-phase 230V / 3-phase 400V' },
      { label: 'Backup output', value: 'Yes — full automatic transfer' },
      { label: 'Safety', value: 'DC/AC SPD Type II, integrated protections' },
      { label: 'Communication', value: 'WiFi / Ethernet / RS485 / CAN' },
      { label: 'Protection class', value: 'IP66' },
      { label: 'Operating temperature', value: '-25°C to +60°C' },
      { label: 'Certifications', value: 'TBD — Verified local approvals' },
    ],
    highlights: [
      'Seamless on-/off-grid switching keeps essentials running through outages',
      'High PV oversizing headroom for maximum harvest',
      'Three-phase models for higher-demand business sites',
      'Monitoring-ready — the app exposes live generation, load and battery state',
      'OTA firmware updates — keeps the inverter current without a site visit',
    ],
    images: [
      '/images/product-inverter-1.webp',
      '/images/product-inverter-2.webp',
    ],
  },
  battery: {
    title: 'LiFePO₄ Battery Storage',
    subtitle: 'Safe · Long-Cycle · Modular',
    description:
      'A modular lithium-iron-phosphate storage stack sized to your backup needs. Cells balance in milliseconds to prevent capacity drift; stackable blocks expand capacity as your home grows.',
    specs: [
      { label: 'Chemistry', value: 'LiFePO₄ (lithium iron phosphate)' },
      { label: 'Capacity per module', value: '5 kWh' },
      { label: 'System capacity', value: '5 / 10 / 16 / 32 kWh (modular)' },
      { label: 'Cycle life', value: '> 6,000 cycles at 90% DoD' },
      { label: 'Round-trip efficiency', value: '> 95%' },
      { label: 'Expandable', value: 'Yes — modular stacking (old/new mixable)' },
      { label: 'Mounting', value: 'Floor (stackable) or wall-mounted' },
      { label: 'Connection', value: 'Plug & play connector' },
      { label: 'Protection class', value: 'IP66' },
      { label: 'Warranty', value: '5 years (extendable — TBD)' },
    ],
    highlights: [
      'No thermal runaway possible — LiFePO₄ chemistry',
      'Millisecond cell balancing to prevent capacity drift',
      'Modular: 5 kWh blocks freely combinable, also retroactively',
      'Plug & play — installation time per module under 10 minutes',
      'Integrated BMS with 24/7 cloud monitoring & remote diagnostics',
    ],
    images: [
      '/images/product-battery-1.webp',
      '/images/product-battery-2.webp',
    ],
  },
  mounting: {
    title: 'Universal Mounting System',
    subtitle: 'Fast · Safe · Roof-Friendly',
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
            page; the lead sentence echoes the NG product message
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
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Hover-revealed "Learn More" → /support overlay */}
              <Link
                href="/support"
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
   Monitoring System — adapted from components/hems/PhoneShowcase.tsx.
   Centered phone with the dashboard screenshot + App Store / Google
   Play download CTAs. Above the phone, a 2-version rotating headline
   (motion AnimatePresence cross-fade) so the section reads as a
   single live product without splitting into two stacked cards.

   Named "Monitoring System" rather than "HEMS App": HEMS stands for
   Home Energy Management System, so it is the wrong label on the
   BUSINESS collection page — both collection pages use the neutral
   name and share this component.
   ────────────────────────────────────────────────────────────────────── */

const MONITORING_HEADLINE_VARIANTS: ReadonlyArray<{
  title: ReactNode
  body: string
}> = [
  {
    title: (
      <>
        Take Full Control of Your Power,{' '}
        <span className="text-uk-teal-dark">Anywhere</span>
      </>
    ),
    body:
      "Real-time generation, consumption, and battery status on one screen. Switch modes, set schedules, and maximize savings — from anywhere.",
  },
  {
    title: (
      <>
        One App. Total Visibility.{' '}
        <span className="text-uk-teal-dark">Real Savings.</span>
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
            that the standalone /hems page uses). */}
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
            they reach this section from /solutions or /hems. */}
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
