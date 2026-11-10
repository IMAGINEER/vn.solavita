'use client'

import { Settings, ShieldCheck, Wallet } from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import { cniBenefits, type CniBenefitIcon } from '@/lib/data/cni'

/**
 * BusinessBenefits — the three commercial outcomes.
 *
 * The brief flagged the old "Zero Downtime" claim as one to drop:
 * solar and storage cannot promise uninterrupted supply on their own.
 * Continuity is a design outcome, so the first card says exactly that
 * and names the three things that make it real.
 */

const BENEFIT_ICONS: Record<CniBenefitIcon, typeof ShieldCheck> = {
  shield: ShieldCheck,
  wallet: Wallet,
  settings: Settings,
}

export default function BusinessBenefits() {
  return (
    <section
      id="business-benefits"
      className="relative py-16 md:py-24 bg-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <SectionEyebrow>BUSINESS BENEFITS</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            What the Business <span className="text-gradient">Actually Gets</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Three outcomes matter to an operator: the site keeps running,
            the energy bill falls, and the system is built to last on that
            site. Here is how each one is delivered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {cniBenefits.map((benefit) => {
            const Icon = BENEFIT_ICONS[benefit.icon]
            return (
              <article
                key={benefit.title}
                className="rounded-2xl border border-uk-line bg-sv-light p-6 md:p-8 flex flex-col"
              >
                <span className="w-12 h-12 rounded-xl bg-uk-teal-soft flex items-center justify-center">
                  <Icon className="w-6 h-6 text-uk-teal-dark" strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 text-xl md:text-2xl font-cw-bold text-uk-navy leading-tight">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-uk-slate font-cw-regular leading-relaxed">
                  {benefit.body}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {benefit.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm text-uk-navy font-cw-regular leading-relaxed"
                    >
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-uk-teal flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
