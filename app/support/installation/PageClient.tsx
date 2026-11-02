'use client'

import Link from 'next/link'
import {
  ClipboardPenLine,
  PencilRuler,
  HardHat,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHero from '@/components/ui/page-hero'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import CTA from '@/components/solutions/CTA'
import { openFormModal } from '@/lib/form-modal'

/**
 * /support/installation — the "How to Install" landing page.
 *
 * Linked from the Support page's Installation card, whose CTA changed
 * from "View FAQs" to "How to Install →" per `docs/修改建议.docx`
 * §"Support页面修改" (Oct 2026).
 *
 * Content (4 steps + 4 FAQs) is taken verbatim from the same docx
 * section.
 *
 * ⚠ The step-3 copy and the first FAQ state a 7-day / 7-working-day
 * installation lead time, and the last FAQ names "Solavita-certified
 * engineers". These are the business's own claims in the brief, so
 * they are published as written. `ng-content-strategy` rule 1 flags
 * unverified installation lead times, so confirm them with the
 * operations team before launch — the per-package `installationTime`
 * field on the solution pages is still a TBD marker.
 */

interface Step {
  id: string
  Icon: LucideIcon
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    id: 'survey',
    Icon: ClipboardPenLine,
    title: 'Free Survey',
    body: 'We check your roof load and energy needs, no cost involved.',
  },
  {
    id: 'quote',
    Icon: PencilRuler,
    title: 'Design & Quote',
    body: 'We create a tailored solution and send you a quote for approval.',
  },
  {
    id: 'installation',
    Icon: HardHat,
    title: 'Installation',
    body: 'Our certified team installs panels, inverters and batteries, typically completed within 7 days.',
  },
  {
    id: 'commissioning',
    Icon: ClipboardCheck,
    title: 'Commissioning',
    body: 'We test the full system and activate it, so you start saving from day one.',
  },
]

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How long does installation take?',
    a: 'Usually 7 working days depending on system size.',
  },
  {
    q: 'Do I need to prepare anything before installation?',
    a: 'No. Our team handles roof assessment, permits and setup.',
  },
  {
    q: 'Will my power be interrupted during installation?',
    a: 'No, we install with zero downtime to your home or business.',
  },
  {
    q: 'Who installs the system?',
    a: 'All installations are carried out by Solavita-certified engineers.',
  },
]

export default function SupportInstallationPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      <PageHero
        backgroundImage="/images/banner_ng.webp"
        eyebrow="INSTALLATION"
        title={'Get Your *Solavita System'}
        body="Getting your Solavita system is simple — we guide you through 4 steps, from the first free survey to the moment your system goes live."
        primaryCta={{ label: 'Get Free Quote', onClick: openFormModal }}
        secondaryCta={{ label: 'Back to Support', href: '/support' }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Support', href: '/support' },
          { label: 'Installation' },
        ]}
      />

      {/* The 4 steps — chevron-linked, per the reference image. */}
      <section className="relative py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>THE PROCESS</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Get Your <span className="text-gradient">Solavita System</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.id} className="relative">
                <div className="rounded-2xl border border-uk-line bg-white p-7 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-uk-emerald/15 flex items-center justify-center text-uk-emerald mb-4">
                    <step.Icon className="w-6 h-6" strokeWidth={1.6} />
                  </div>
                  <div className="text-xs font-cw-bold uppercase tracking-wider text-uk-slate">
                    Step {i + 1}
                  </div>
                  <h3 className="mt-1 text-lg font-cw-bold text-uk-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed flex-1">
                    {step.body}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden lg:flex absolute right-[-14px] top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-uk-teal text-white items-center justify-center z-10"
                  >
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 4 FAQs */}
      <section className="relative py-16 md:py-20 bg-uk-line/30">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <SectionEyebrow>INSTALLATION FAQS</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Installation <span className="text-gradient">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-uk-line bg-white overflow-hidden"
              >
                <h3 className="px-5 py-4 text-sm md:text-base font-cw-bold text-uk-navy">
                  {item.q}
                </h3>
                <div className="px-5 pb-5 text-sm text-uk-slate font-cw-regular leading-relaxed">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/support#faq-installation"
              className="inline-flex items-center gap-2 text-sm font-cw-bold text-uk-teal-dark hover:text-uk-teal transition-colors"
            >
              More installation FAQs on Support
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      <CTA
        eyebrow="Ready when you are"
        title={
          <>
            Not a Solavita Customer Yet?
            <br />
            <span className="text-gradient">Start with a Free Design.</span>
          </>
        }
        description="If you're still weighing your options, our team can prepare a free, no-obligation design that shows how solar panels, battery storage or a full home energy system would fit your home."
      />

      <Footer />
    </main>
  )
}
