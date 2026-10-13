'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Wrench,
  Handshake,
  Package,
  Users,
  Factory,
  Headphones,
  Megaphone,
  ShieldCheck,
  GraduationCap,
  UserCog,
  Check,
  ArrowRight,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  partnerTypes,
  partnerBenefits,
  partnerProcess,
  type PartnerType,
} from '@/lib/data/partners'
import { openPartnerFormModal } from '@/lib/partner-form-modal'

gsap.registerPlugin(ScrollTrigger)

/**
 * UK-style benefit icons (used by the 6-card "Why partner" grid).
 * The 4 NG-type icons (used by `PartnerTypes`) are bound below in
 * `partnerTypeIcon` and only need the 4 NG ids.
 */
const benefitIconFor = (i: number) => {
  const common = { className: 'w-6 h-6', strokeWidth: 1.6 } as const
  switch (i) {
    case 0:
      return <Factory {...common} />
    case 1:
      return <Headphones {...common} />
    case 2:
      return <Megaphone {...common} />
    case 3:
      return <ShieldCheck {...common} />
    case 4:
      return <GraduationCap {...common} />
    case 5:
      return <UserCog {...common} />
    default:
      return <Factory {...common} />
  }
}

const CheckIcon = ({ className }: { className?: string }) => (
  <Check className={className ?? 'w-3 h-3'} strokeWidth={3} />
)

const partnerTypeIcon = (icon: PartnerType['icon']) => {
  const common = { className: 'w-7 h-7', strokeWidth: 1.6 } as const
  switch (icon) {
    case 'wrench':
      return <Wrench {...common} />
    case 'handshake':
      return <Handshake {...common} />
    case 'package':
      return <Package {...common} />
    case 'users':
      return <Users {...common} />
  }
}

/**
 * /for-partners — B2B partner recruitment page (Nigeria).
 *
 * Text is copied verbatim from the UK base page (`ee5uk v1`) per
 * project instruction, with the 3 UK partner types re-rendered as
 * the 4 NG-specific tracks (installer, referral, distribution,
 * community) defined in `lib/data/partners.ts`. The CTA opens the
 * dedicated `PartnerFormModal` (hosted globally in `Footer.tsx`),
 * which posts to `/api/partner` — NOT the consultation `FormModal`.
 *
 * Composition (per UK base page):
 *   Hero → Why Partner with Solavita → Partner Types → Partnership
 *   Process → Partner CTA / Enquiry Form
 */
export default function ForPartnersPage() {
  const whyRef = useRef<HTMLElement>(null)
  const typesRef = useRef<HTMLElement>(null)
  const processRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.why-partner-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: whyRef.current, start: 'top 85%' },
        },
      )
      gsap.fromTo(
        '.partner-type-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: typesRef.current, start: 'top 85%' },
        },
      )
      gsap.fromTo(
        '.process-step',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: processRef.current, start: 'top 85%' },
        },
      )
      gsap.fromTo(
        '.partner-cta-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header logoHref="/" />

      {/* ───── Section 1 — Hero (UK pattern) ───── */}
      <section
        className="hero-banner relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/hero-partners.webp)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.65) 35%, rgba(15,23,42,0.25) 60%, rgba(15,23,42,0) 80%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mt-6">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            <span className="text-xs font-cw-regular text-white/90">
              For partners · B2B
            </span>
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cw-bold leading-tight text-white mt-5 max-w-3xl">
            Grow your business{' '}
            <span className="text-gradient">with Solavita.</span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-white/85 font-cw-light max-w-2xl leading-relaxed">
            Become a Solavita partner — installer, distributor or energy
            / business partner. Group supply-chain scale and a partner
            programme built around long-term relationships.
          </p>
        </div>
      </section>

      {/* ───── Section 2 — Why partner with Solavita (UK pattern) ───── */}
      <section
        ref={whyRef}
        id="why-partner"
        className="relative py-16 md:py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
              <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
              Why partner
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
              Why Partner{' '}
              <span className="text-gradient">with Solavita</span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-2xl mx-auto">
              Group supply-chain scale, deep engineering support and a
              partner programme built around long-term relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerBenefits.map((b, i) => (
              <div
                key={b.title}
                className="why-partner-card rounded-2xl p-6 bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-4">
                  {benefitIconFor(i)}
                </div>
                <h3 className="text-lg font-cw-bold text-uk-navy">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Section 3 — Partner Types (UK pattern, 4 NG tracks) ───── */}
      <section
        ref={typesRef}
        id="partner-types"
        className="relative py-16 md:py-24 bg-sv-light overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-uk-teal-soft/40 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
              <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
              Partner tracks
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
              Four Ways to{' '}
              <span className="text-gradient">work with us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerTypes.map((p) => (
              <div
                key={p.id}
                className="partner-type-card rounded-3xl p-6 lg:p-8 bg-white border border-uk-line shadow-sm flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-uk-teal-soft flex items-center justify-center text-uk-teal-dark mb-5">
                  {partnerTypeIcon(p.icon)}
                </div>

                <span className="text-[10px] font-cw-bold tracking-wider uppercase text-uk-teal-dark">
                  {p.eyebrow}
                </span>
                <h3 className="mt-1 text-2xl font-cw-bold text-uk-navy">
                  {p.title}
                </h3>
                <p className="mt-3 text-base text-uk-slate font-cw-regular leading-relaxed">
                  {p.description}
                </p>

                {p.bullets.length > 0 && (
                  <ul className="space-y-3 mt-5">
                    {p.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-uk-navy"
                      >
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-uk-emerald/10 flex items-center justify-center flex-shrink-0">
                          <CheckIcon className="w-3 h-3 text-uk-emerald" />
                        </span>
                        <span className="text-sm font-cw-regular">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  onClick={() =>
                    openPartnerFormModal({
                      defaultTrack: p.id as
                        | 'installer'
                        | 'referral'
                        | 'distribution'
                        | 'community',
                    })
                  }
                  className="mt-auto pt-6 inline-flex items-center gap-2 text-uk-teal-dark font-cw-bold hover:text-uk-teal transition-colors"
                >
                  Apply for this track
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Section 4 — Partnership Process (UK pattern) ───── */}
      <section
        ref={processRef}
        id="partnership-process"
        className="relative py-16 md:py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
              <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
              How it works
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
              From First Call to{' '}
              <span className="text-gradient">first install</span>
            </h2>
          </div>

          {/* Connector line — visible on md+ only; a simple gradient bar
              behind the step number row. */}
          <div className="relative">
            <div
              className="hidden md:block absolute left-0 right-0 top-[28px] h-px bg-gradient-to-r from-transparent via-uk-line to-transparent"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
              {partnerProcess.map((s) => (
                <div
                  key={s.step}
                  className="process-step relative flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-0"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white border-2 border-uk-teal/40 flex items-center justify-center text-uk-teal-dark relative z-10">
                    <span className="font-cw-bold text-sm">{s.step}</span>
                  </div>

                  <div className="md:mt-5 md:px-2">
                    <h3 className="text-lg font-cw-bold text-uk-navy">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Section 5 — Partner CTA / Enquiry Form (UK pattern) ─────
          The form is the working NG partner form (5 fields, posts to
          `/api/partner` via the PartnerFormModal hosted in Footer.tsx).
          The CTA button opens that modal rather than rendering the form
          inline, because the partner submission goes through the same
          modal pattern as the consultation form elsewhere on the site. */}
      <section
        ref={ctaRef}
        id="partner-cta"
        className="relative py-16 md:py-24 bg-sv-light overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-uk-teal/10 blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-uk-emerald/10 blur-[150px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="partner-cta-card rounded-3xl border border-uk-line bg-white p-8 md:p-12 lg:p-16 shadow-sm">
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
                <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
                Become a Solavita partner
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
                Tell Us About{' '}
                <span className="text-gradient">your business.</span>
              </h2>
              <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
                We&apos;ll get back within two working days with next
                steps — including which partner track fits your business
                best.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
              <button
                type="button"
                onClick={() => openPartnerFormModal()}
                className="btn-gradient px-8 py-4 rounded-full font-cw-bold text-base text-white w-full sm:w-auto"
              >
                Submit enquiry
              </button>
              <p className="text-xs text-uk-slate">
                Or email us directly:{' '}
                <span className="font-cw-bold">
                  TBD — Verified Nigerian partner email
                </span>
              </p>
            </div>

            <p className="mt-6 text-xs text-uk-slate text-center max-w-2xl mx-auto">
              Submissions connect to the existing partner enquiry workflow
              (<code className="text-xs bg-uk-line/40 px-1.5 py-0.5 rounded">/api/partner</code>).
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}