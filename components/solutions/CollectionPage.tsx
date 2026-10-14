'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import TrustBar from '@/components/TrustBar'
import type { SolutionDetail } from '@/lib/data/solutions'
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

export interface CollectionFaq {
  q: string
  a: string
}

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

      {/* Tailored CTA */}
      <TailoredCtaSection cta={props.tailoredCta} />

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
              <>Home Solar solutions, sized to your <span className="text-gradient">appliances and backup needs</span></>
            ) : (
              <>Business Solar solutions, sized to your <span className="text-gradient">loads and operating hours</span></>
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
        <dl className="mt-5 space-y-2 text-sm">
          {sol.bullets.slice(0, 4).map((b, i) => (
            <div key={i} className="flex items-start gap-2 text-uk-navy">
              <Check className="w-4 h-4 text-uk-emerald flex-shrink-0 mt-0.5" strokeWidth={3} />
              <span>{b}</span>
            </div>
          ))}
        </dl>
        <div className="mt-6 grid grid-cols-2 gap-2 text-center">
          {sol.headlineStats.map((s, i) => (
            <div key={i} className="rounded-xl border border-uk-line bg-uk-line/30 px-2 py-2">
              <div className="text-sm font-cw-bold text-uk-teal-dark">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-uk-slate font-cw-regular mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
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
   FAQ
   ────────────────────────────────────────────────────────────────────── */

function FaqSection({ faqs }: { faqs: CollectionFaq[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <section id="faq" className="relative py-16 md:py-20 bg-uk-line/30">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-8">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((item, i) => {
            const open = openIdx === i
            return (
              <div
                key={i}
                className="rounded-2xl border border-uk-line bg-white overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                  aria-expanded={open}
                >
                  <span className="text-sm md:text-base font-cw-bold text-uk-navy">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-uk-slate flex-shrink-0 transition-transform duration-200 ${
                      open ? 'rotate-180' : ''
                    }`}
                    strokeWidth={2}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-5 text-sm text-uk-slate font-cw-regular leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
