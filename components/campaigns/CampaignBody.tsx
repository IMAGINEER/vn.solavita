'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const steps: { n: number; title: string; body: string }[] = [
  {
    n: 1,
    title: 'Send enquiry',
    body: 'Free design & quote in 15 minutes - completely no obligation.',
  },
  {
    n: 2,
    title: 'Quote & order',
    body: 'Fixed-price quote including installation slot. Everything is laid out clearly before you commit.',
  },
  {
    n: 3,
    title: 'Install & generate',
    body: 'Two-day installation by Solavita-certified installers. Your system starts generating on day one.',
  },
]

const faqItems: { q: string; a: string }[] = [
  {
    q: 'How does solar save me money?',
    a: 'Once your system is commissioned, it generates electricity from sunlight to power your home and reduce the energy you buy from your utility or generator. Excess daytime energy is stored in the battery to cover evening and night-time use. The exact savings depend on your home, your usage pattern and your current electricity tariff — request a quote for a tailored estimate.',
  },
  {
    q: 'Do I need planning permission?',
    a: 'In most cases in Nigeria, rooftop solar does not require special permission. Exceptions include some estate covenants, conservation-designated properties, and certain flat-roof installations. We assess this as part of your design.',
  },
  {
    q: 'What about taxes and import duties on solar?',
    a: 'Nigerian solar imports currently benefit from specific duty concessions for renewable energy equipment — see the latest Finance Act or ask our team for the current position. All our quotes lay out the full landed cost up front; no extra paperwork needed.',
  },
  {
    q: 'How is my system monitored?',
    a: 'Every Solavita system ships with the Solavita HEMS app, available on iOS and Android. You can track generation, consumption and export in real time, see lifetime savings, and receive automatic fault notifications.',
  },
]

export default function CampaignBody() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null)

  return (
    <div className="relative z-10 max-w-3xl mx-auto px-6 mt-16">
      {/* How it works - the CTA process (second screen = call to action) */}
      <div className="mb-12">
        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-uk-line bg-white p-5 shadow-sm"
            >
              <div className="text-sm font-cw-bold mb-1 text-uk-teal">
                Step {s.n}
              </div>
              <h4 className="text-lg font-cw-bold mb-1 text-uk-navy">
                {s.title}
              </h4>
              <p className="text-sm leading-relaxed text-uk-slate">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-sm font-cw-bold uppercase tracking-wider mb-4 text-uk-navy">
        Frequently asked questions
      </h3>
      <ul className="divide-y divide-uk-line">
        {faqItems.map((item, idx) => {
          const isOpen = openFaqIdx === idx
          return (
            <li key={item.q}>
              <button
                type="button"
                onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                className="w-full text-left py-4 flex items-start justify-between gap-4 group"
                aria-expanded={isOpen}
              >
                <span className="text-base md:text-lg font-cw-bold transition-colors text-uk-navy">
                  {item.q}
                </span>
                <ChevronDown
                  className={`flex-shrink-0 w-4 h-4 mt-1.5 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  strokeWidth={2}
                  style={{ color: '#64748B' }}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="pb-4 pr-8 text-sm font-cw-regular leading-relaxed text-uk-slate">
                  {item.a}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}