'use client'

import { Activity, ClipboardList, DraftingCompass, Wrench } from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import TbdText from '@/components/ui/tbd-text'
import {
  cniDeliverySteps,
  type CniDeliveryIcon,
} from '@/lib/data/cni'

/**
 * DeliverySupport — "From Project Design to Long-Term Support".
 *
 * The brief asked this block to stop being a service description and
 * start answering the question a business buyer actually has: who does
 * this, and who answers when something breaks. So it is four concrete
 * stages, each with the deliverables named.
 *
 * The photograph is the real Solavita installation crew from the Senegal
 * project reference — it is captioned as what it is, and the Vietnamese
 * local-team slot stays an explicit TBD rather than borrowing a photo
 * from another market.
 */

const DELIVERY_ICONS: Record<CniDeliveryIcon, typeof Wrench> = {
  clipboard: ClipboardList,
  blueprint: DraftingCompass,
  wrench: Wrench,
  activity: Activity,
}

export default function DeliverySupport() {
  return (
    <section
      id="project-delivery"
      className="relative py-16 md:py-24 bg-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <SectionEyebrow>PROJECT DELIVERY & LOCAL SUPPORT</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            From Project Design to{' '}
            <span className="text-gradient">Long-Term Support</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Four stages, each with a deliverable you can hold in your
            hand. Nothing is handed over until the system is commissioned
            and documented.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {/* The four stages */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {cniDeliverySteps.map((step, index) => {
              const Icon = DELIVERY_ICONS[step.icon]
              return (
                <article
                  key={step.id}
                  className="rounded-2xl border border-uk-line bg-sv-light p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-uk-teal-soft flex items-center justify-center flex-shrink-0">
                      <Icon
                        className="w-5 h-5 text-uk-teal-dark"
                        strokeWidth={1.8}
                      />
                    </span>
                    <span className="text-xs font-cw-bold text-uk-slate uppercase tracking-[0.16em]">
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-cw-bold text-uk-navy leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed">
                    {step.body}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {step.points.map((point) => (
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

          {/* The crew photograph */}
          <figure className="rounded-2xl border border-uk-line bg-white overflow-hidden">
            <div className="aspect-[4/3] bg-uk-line/30">
              <img
                src="/images/cases/senegal-1mw-3mwh.webp"
                alt="Solavita installation crew fitting solar panels on a commercial rooftop in Senegal"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="p-5">
              <p className="text-sm font-cw-bold text-uk-navy">
                Solavita installation crew — commercial rooftop, Senegal
              </p>
              <p className="mt-2 text-xs text-uk-slate font-cw-regular leading-relaxed">
                <TbdText
                  text="Vietnam installation team, local service footprint and after-sales response time (chờ xác nhận)"
                  inline
                />
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
