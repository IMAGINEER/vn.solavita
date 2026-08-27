'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const steps: { n: number; title: string; body: string }[] = [
  {
    n: 1,
    title: 'Send enquiry',
    body: 'Free design & quote in 15 minutes — completely no obligation.',
  },
  {
    n: 2,
    title: 'Quote & order',
    body: 'Fixed-price quote including SEG setup. Your installation slot is booked.',
  },
  {
    n: 3,
    title: 'Install & generate',
    body: 'Two-day installation by NICEIC engineers. Your system starts generating on day one.',
  },
]

const faqItems: { q: string; a: string }[] = [
  {
    q: 'How does the Smart Export Guarantee (SEG) work?',
    a: 'Once your system is commissioned and registered with your electricity supplier, they pay you for every kWh you export back to the grid. Current SEG rates are set by suppliers and typically range from 4–15p per kWh. We help with the registration paperwork.',
  },
  {
    q: 'Do I need planning permission?',
    a: 'In most cases, no. Solar panels fall under Permitted Development Rights in the UK. Exceptions include listed buildings, conservation areas, and some flat-roof installations. We assess this as part of your design.',
  },
  {
    q: 'What about the 0% VAT on solar?',
    a: 'From 1 April 2022, the UK government applies 0% VAT on the supply and installation of residential solar panels and battery storage for five years. All our quotes include this benefit — no extra paperwork needed.',
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
      {/* How it works — the CTA process (second screen = call to action) */}
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