'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Sun,
  BatteryCharging,
  Wrench,
  Sparkles,
  Compass,
  Zap,
  ShieldCheck,
  Factory,
  Truck,
  Handshake,
  Users,
  XCircle,
  CheckCircle2,
  Shield,
  Wallet,
  Phone,
  Ruler,
  Headphones,
  Warehouse,
  User,
  ClipboardPenLine,
  ClipboardCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrustBar from '@/components/TrustBar'
import FloatingButtons from '@/components/FloatingButtons'
import PageHero, { HeroPillsRow } from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import TbdText from '@/components/ui/tbd-text'
import ImagePlaceholder from '@/components/ui/image-placeholder'
import GetQuoteButton from '@/components/ui/get-quote-button'
import { caseStudies } from '@/lib/data/uk-cases'
import { openFormModal } from '@/lib/form-modal'

/* ═══════════════════════════════════════════════════════════════════════
   Home — page flow
     1. Hero
     2. Scenario entry cards (For Home / For Business)
     3. COST COMPARISON — Solar vs. Diesel (visual)
     4. SOLUTIONS — Find the Right Solution for Your Needs
     5. YOUR SOLAR JOURNEY — From Consultation to Clean Power
     6. WHY SOLAVITA — A Partner-Driven Approach for Nigeria
     7. CUSTOMER STORIES — Real Homes and Businesses, Real Results
     8. FREQUENTLY ASKED QUESTIONS
     9. Final CTA — Take the Next Step Towards Reliable Power
   ═══════════════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      <Section1Hero />
      <Section2EntryCards />
      <Section6PartnerDrivenApproach />
      <Section3SolarVsDiesel />
      <Section5ConsultationToCleanPower />
      <Section7CustomerStories />
      <Section9FinalCta />

      <TrustBar />
      <Footer />
      <FloatingButtons />
    </main>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 1 — Hero
   New H1 + body built on the three core values (cost / independence
   / crisis). The brand line "Cut Diesel. Own Your Power." is folded
   into the H1 ("More Reliable Way to Power") and reinforced by the
   trust-pill strip.
   ────────────────────────────────────────────────────────────────────── */

function Section1Hero() {
  return (
    <PageHero
      backgroundImage="/images/banner_ng.webp"
      eyebrow="SOLAR POWER FOR NIGERIAN HOMES"
      title={'A More Reliable Way to Power* Nigerian Homes and Businesses*'}
      body="Solar and battery systems for Nigerian homes and businesses — direct from the Solavita factory line to your site."
      primaryCta={{ label: 'Get a Quote', onClick: openFormModal }}
      secondaryCta={{ label: 'Explore Solutions', href: '/solutions/home-solar' }}
    >
      <HeroPillsRow
        pills={[
          {
            icon: <Wallet className="w-4 h-4 text-white" strokeWidth={1.6} />,
            text: 'Lower energy costs',
          },
          {
            icon: <Factory className="w-4 h-4 text-white" strokeWidth={1.6} />,
            text: 'Reduce diesel use',
          },
          {
            icon: <Zap className="w-4 h-4 text-white" strokeWidth={1.6} />,
            text: 'Power what matters',
          },
          {
            icon: <ShieldCheck className="w-4 h-4 text-white" strokeWidth={1.6} />,
            text: 'Stable power for key loads',
          },
        ]}
      />
    </PageHero>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 2 — Quick entry cards
   Two image-led cards pointing to the two collection pages. No icon,
   no eyebrow on the card itself - the SectionEyebrow above groups
   them.
   ────────────────────────────────────────────────────────────────────── */

function Section2EntryCards() {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-br from-uk-teal/5 to-uk-emerald/15">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>SOLUTIONS</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Solar Solutions for Every <span className="text-gradient">Home and Business</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
            From essential home backup to higher-capacity business
            systems, find the right solar and battery solution for your
            power needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScenarioPanel
            href="/solutions/home-solar"
            title="HOMES"
            subTitle="Powering homes"
            body="Single-phase solar and battery systems, from essential backup to higher-capacity setups for everyday appliances and selected high-demand loads."
            imageDescription="A modern Nigerian home with a rooftop solar system and battery storage"
            imageSrc="/images/home_cap.webp"
            cta="Explore Home Solutions"
          />
          <ScenarioPanel
            href="/solutions/business-solar"
            title="BUSINESSES"
            subTitle="Powering businesses"
            body="Three-phase solar and battery systems, from entry-level setups to higher-capacity configurations designed around business equipment and operating needs."
            imageDescription="A Nigerian small business — shop, office or restaurant — with a solar + battery system"
            imageSrc="/images/business_cap.webp"
            cta="Explore Business Solutions →"
          />
        </div>
      </div>
    </section>
  )
}

function ScenarioPanel({
  href,
  title,
  subTitle,
  body,
  imageDescription,
  imageSrc,
  cta,
}: {
  href: string
  title: string
  subTitle: string
  body: string
  imageDescription: string
  imageSrc?: string
  cta: string
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-uk-line bg-white overflow-hidden hover:border-uk-teal hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-[16/9] bg-uk-line/30 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageDescription}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <ImagePlaceholder
            description={imageDescription}
            aspectRatio="16/9"
            className="!rounded-none !border-0 !bg-slate-50"
          />
        )}
      </div>
      <div className="p-6 lg:p-8">
        <div className="text-xs font-cw-bold uppercase tracking-wider text-uk-teal">
          {title}
        </div>
        <h3 className="mt-2 text-xl font-cw-bold text-uk-navy leading-tight">
          {subTitle}
        </h3>
        <p className="mt-3 text-base text-uk-slate font-cw-regular leading-relaxed">
          {body}
        </p>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal group-hover:text-uk-teal-dark transition-colors">
          {cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 3 — Solar vs. Diesel: See the Difference
   The cost-comparison narrative. Red X for diesel pain, green check
   for solar upside. Mirrors the image's two-column treatment.
   ────────────────────────────────────────────────────────────────────── */

function Section3SolarVsDiesel() {
  return (
    <section className="relative py-16 md:py-20 bg-uk-line/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>ENERGY COMPARISON</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Solar vs. Diesel: <span className="text-gradient">See the Difference</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
            Every litre burned adds up. Every ray of sunshine
            changes the equation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
          {/* Diesel side - red X */}
          <div className="rounded-2xl border border-red-300 bg-red-50 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <Factory className="w-5 h-5" strokeWidth={1.6} />
              </div>
              <h3 className="text-xl font-cw-bold text-uk-navy">
                Diesel generator
              </h3>
            </div>
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-uk-line/30 mb-5">
              <img
                src="/images/diesel_backup.webp"
                alt="A small diesel generator running outdoors during a power outage in a Nigerian home or business"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-cw-bold text-uk-navy mb-4">
              Ongoing costs keep adding up.
            </p>
            <ul className="space-y-2 text-sm">
              <CompareXRow text="High and volatile fuel costs" />
              <CompareXRow text="Regular maintenance and repairs" />
              <CompareXRow text="Noise and air pollution" />
              <CompareXRow text="Power interruptions and downtime" />
            </ul>
          </div>

          {/* VS divider - same style as the WHY SOLAVITA PD2C comparison */}
          <div className="flex items-center justify-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #2F80ED, #22C55E)',
              }}
            >
              <span className="text-sm font-cw-bold text-white">VS</span>
            </div>
          </div>

          {/* Solar side - green check */}
          <div className="rounded-2xl border border-uk-emerald/40 bg-uk-emerald/5 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-uk-emerald/15 flex items-center justify-center text-uk-emerald">
                <Sun className="w-5 h-5" strokeWidth={1.6} />
              </div>
              <h3 className="text-xl font-cw-bold text-uk-navy">
                Solavita solar + storage
              </h3>
            </div>
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-uk-emerald/10 mb-5">
              <img
                src="/images/solar_advantages.webp"
                alt="A Solavita solar panel and battery system installed at a Nigerian home, generating clean power"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-cw-bold text-uk-navy mb-4">
              Generate your own clean power.
            </p>
            <ul className="space-y-2 text-sm">
              <CompareCheckRow text="Lower long-term energy costs" />
              <CompareCheckRow text="Minimal maintenance" />
              <CompareCheckRow text="Clean and quiet operation" />
              <CompareCheckRow text="Stable power for key loads" />
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function CompareXRow({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-uk-navy">
      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" strokeWidth={2} />
      <span>{text}</span>
    </li>
  )
}

function CompareCheckRow({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-uk-navy">
      <CheckCircle2
        className="w-4 h-4 text-uk-emerald flex-shrink-0"
        strokeWidth={2}
      />
      <span>{text}</span>
    </li>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 5 — Your Solar Journey: From Consultation to Clean Power
   4 steps. The step number sits on the top-edge-center of the card
   (per the previous layout fix).
   ────────────────────────────────────────────────────────────────────── */

function Section5ConsultationToCleanPower() {
  return (
    <section className="relative py-16 md:py-20 bg-sv-blue/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <SectionEyebrow>PROCESS</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            From Consultation to <span className="text-gradient">Clean Power</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            A simple and transparent process to get your solar system
            up and running.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard
            step="1"
            icon={ClipboardPenLine}
            title="Free Survey"
            body="Check roof, load & needs."
          />
          <StepCard
            step="2"
            icon={Ruler}
            title="Design & Quote"
            body="Customized plan for your approval."
          />
          <StepCard
            step="3"
            icon={Wrench}
            title="Installation"
            body="Panels, inverter, and battery in 7 days."
          />
          <StepCard
            step="4"
            icon={ClipboardCheck}
            title="Commissioning"
            body="Test the system & start saving."
          />
        </div>
        <div className="mt-10 text-center">
          <GetQuoteButton onClick={openFormModal} />
        </div>
      </div>
    </section>
  )
}

function StepCard({
  step,
  icon: Icon,
  title,
  body,
}: {
  step: string
  icon: LucideIcon
  title: string
  body: string
}) {
  return (
    // The outer <div> is just the positioning context for the badge.
    // The card itself starts at the parent's top edge (no top
    // padding here), so the badge can sit with its bottom edge
    // exactly on the card's top border.
    <div className="relative">
      <div className="rounded-2xl border border-uk-line bg-white p-10 h-full flex flex-col">
        {/* Step number position uses calc() so the badge's vertical
            offset is always 50% of its own height (2.5rem * 0.5 =
            20 px), regardless of the badge's size. left-1/2 +
            -translate-x-1/2 keeps it horizontally centred. pt-20
            gives the title room below the badge. */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{ top: 'calc(-0.5 * 2.5rem)' }}
        >
          <div className="w-10 h-10 rounded-full bg-uk-emerald text-white text-base font-cw-bold flex items-center justify-center shadow-lg">
            {step}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5 text-uk-emerald flex-shrink-0" strokeWidth={1.6} />
          <h3 className="text-base font-cw-bold text-uk-navy whitespace-nowrap">
            {title}
          </h3>
        </div>
        <p className="text-sm text-uk-slate font-cw-regular leading-relaxed flex-1">
          {body}
        </p>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 6 — Why we cut your costs
   Mirrors the DE site's PD2C comparison: traditional middlemen
   chain (5 steps, +80-150% markup) vs Solavita PD2C (2 steps,
   direct). NG labels + existing uk-teal / uk-emerald theme tokens.
   ────────────────────────────────────────────────────────────────────── */

function Section6PartnerDrivenApproach() {
  return (
    <section className="relative py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>WHY SOLAVITA</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            From Local Warehouse to <span className="text-gradient">Your Doorstep</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
            Direct delivery from local warehouses and professional
            on-site installation, with fewer middlemen in the
            process.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-6">
          {/* TRADITIONAL: 5 middlemen nodes, red treatment, markup badge */}
          <div className="flex-1 w-full max-w-md rounded-2xl border border-red-300 bg-red-50 p-5">
            <div className="flex items-center justify-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-cw-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-300">
                Traditional
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {[
                { name: 'Manufacturer', Icon: Factory },
                { name: 'Wholesaler', Icon: Warehouse },
                { name: 'Distributor', Icon: Truck },
                { name: 'Installer', Icon: Wrench },
                { name: 'Customer', Icon: User },
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-white border border-red-200 flex items-center justify-center">
                      <step.Icon className="w-6 h-6 text-red-500" strokeWidth={1.6} />
                    </div>
                    <span className="text-[10px] text-red-700/80 mt-1 whitespace-nowrap">
                      {step.name}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-red-300 mx-0.5 flex-shrink-0" strokeWidth={2} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-cw-bold bg-red-100 text-red-700 border border-red-200">
                +80-150% markup
              </span>
            </div>
          </div>

          {/* VS divider */}
          <div className="md:flex md:items-center md:justify-center md:w-14 md:flex-shrink-0">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 mx-auto"
              style={{
                background: 'linear-gradient(135deg, #2F80ED, #22C55E)',
              }}
            >
              <span className="text-sm font-cw-bold text-white">VS</span>
            </div>
          </div>

          {/* SOLAVITA PD2C: 2-step direct, green treatment, savings badge */}
          <div className="flex-1 w-full max-w-md rounded-2xl border border-uk-emerald/40 bg-uk-emerald/5 p-5">
            <div className="flex items-center justify-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-cw-bold uppercase tracking-wider bg-uk-emerald/15 text-uk-emerald border border-uk-emerald/30">
                Solavita PD2C
              </span>
            </div>
            <div className="flex items-center justify-center gap-6">
              {[
                { name: 'Solavita warehouse', Icon: Factory },
                { name: 'You', Icon: User },
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-white border border-uk-emerald/30 flex items-center justify-center">
                      <step.Icon className="w-6 h-6 text-uk-emerald" strokeWidth={1.6} />
                    </div>
                    <span className="text-xs text-uk-navy mt-1 font-cw-regular">
                      {step.name}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-uk-emerald/50 mx-3 flex-shrink-0" strokeWidth={2} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-cw-bold bg-uk-emerald/15 text-uk-emerald border border-uk-emerald/30">
                Direct to you
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 7 — Real Homes and Businesses, Real Results
   Three reference installs from the 13 European cases. Country label
   (Germany / Italy) on each card. No price / saving rendered.
   ────────────────────────────────────────────────────────────────────── */

function Section7CustomerStories() {
  const featured = [caseStudies[6], caseStudies[0], caseStudies[11]]
  return (
    <section className="relative py-16 md:py-20 bg-uk-line/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <SectionEyebrow>CASES</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Real Projects. <span className="text-gradient">Real Energy Needs.</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
            Discover how Solavita solar and battery solutions are
            applied in homes and businesses, and see the systems behind
            each project.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((c) => (
            <CaseStoryCard key={c.slug} c={c} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseStoryCard({
  c,
}: {
  c: (typeof caseStudies)[number]
}) {
  return (
    <div className="rounded-2xl border border-uk-line bg-white overflow-hidden flex flex-col">
      <div className="aspect-[4/3] overflow-hidden bg-uk-line/30">
        <img
          src={c.imagePath}
          alt={c.city}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="text-[10px] font-cw-bold tracking-wider uppercase text-uk-teal-dark">
          {c.region}
        </div>
        <h3 className="mt-2 text-lg font-cw-bold text-uk-navy leading-tight">
          {c.city}
        </h3>
        <p className="mt-1 text-sm text-uk-slate font-cw-regular">
          {c.systemLabel}
        </p>
        {c.annualGeneration && (
          <p className="mt-3 text-xs text-uk-slate font-cw-regular pt-3 border-t border-uk-line/40">
            <span className="font-cw-bold text-uk-navy">Annual generation: </span>
            {c.annualGeneration}
          </p>
        )}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   Section 9 — Final CTA
   "Take the Next Step Towards Reliable Power" with two CTAs
   (Get a Quote + Explore Solutions).
   ────────────────────────────────────────────────────────────────────── */

function Section9FinalCta() {
  return (
    <section
      className="relative py-20 md:py-28 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: 'url(/images/banner_bottom.webp)' }}
    >
      {/* Directional overlay - keeps the copy column legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.55) 35%, rgba(15,23,42,0.2) 60%, rgba(15,23,42,0) 80%)',
        }}
      />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        {/* Eyebrow uses the standard SectionEyebrow dark variant so
            it matches every other section's eyebrow shape, just
            styled for a dark background. */}
        <SectionEyebrow variant="dark">Ready to start</SectionEyebrow>
        <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-white leading-tight">
          Take the Next Step Towards <span className="text-gradient">Reliable Power</span>
        </h2>
        <p className="mt-4 text-base md:text-lg text-white/85 font-cw-light leading-relaxed">
          Whether for your home or business, Solavita helps you find
          the right solar and battery storage solution for your energy
          needs. Tell us what you need, and our team will help you get
          started.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <GetQuoteButton onClick={openFormModal} />
          {/* Secondary CTA - white background, dark text so it is
              visible against the dark hero image. Hover flips the
              background to teal and the text to white. */}
          <Link
            href="/solutions/home-solar"
            className="px-6 py-3 rounded-full text-sm font-cw-bold bg-white text-uk-navy border border-white hover:bg-uk-teal hover:text-white hover:border-uk-teal transition-colors"
          >
            Explore Solutions
          </Link>
        </div>
      </div>
    </section>
  )
}
