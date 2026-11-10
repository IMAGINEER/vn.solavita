'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ClipboardList } from 'lucide-react'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import { openFormModal } from '@/lib/form-modal'

/**
 * TailoredAssessment — the "Let's Tailor a Solution" block, rebuilt as a
 * real step of the buying process.
 *
 * The old block was a headline and a button. This one asks the five
 * questions that actually change the design, and it deliberately asks
 * for no contact details: the visitor completes the energy profile
 * first, then decides whether to talk to us. That is the order the
 * brief asked for — energy requirements first, enquiry second.
 *
 * The form stores nothing and sends nothing until the visitor presses
 * the final button, which opens the consultation modal with the profile
 * attached as a note for the sales team.
 */

const BUSINESS_TYPES = [
  'Retail / shop',
  'Hotel / hospitality',
  'Restaurant / food production',
  'Factory / manufacturing',
  'Warehouse / cold storage',
  'Office building',
  'Agriculture / processing',
  'Other',
]

const OPERATING_HOURS = [
  'Daytime only (8–10 h)',
  'Two shifts (10–16 h)',
  'Around the clock (24 h)',
]

const BACKUP_NEEDS = [
  'Critical circuits only',
  'Most of the site',
  'The whole site',
  'No backup requirement yet',
]

const vnNumber = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
})

export default function TailoredAssessment() {
  const [businessType, setBusinessType] = useState('')
  const [bill, setBill] = useState('')
  const [roofArea, setRoofArea] = useState('')
  const [hours, setHours] = useState('')
  const [backup, setBackup] = useState('')
  const [done, setDone] = useState(false)

  const complete =
    businessType !== '' && bill !== '' && roofArea !== '' && hours !== '' && backup !== ''

  const summary = [
    businessType,
    `bill ${vnNumber.format(Number(bill))} ₫/month`,
    `roof ${roofArea} ㎡`,
    hours,
    `backup: ${backup}`,
  ].join(' · ')

  return (
    <section
      id="tailored-solution"
      className="relative py-16 md:py-24 bg-sv-light scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <SectionEyebrow>LET&apos;S TAILOR A SOLUTION</SectionEyebrow>
          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-cw-bold text-uk-navy leading-tight">
            Your Business. <span className="text-gradient">Your Energy Solution</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
            Five questions about the site. No contact details needed yet —
            you will see what we would size first, and then decide whether
            to take it further.
          </p>
        </div>

        <div className="rounded-2xl border border-uk-line bg-white p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <SelectField
              id="cni-business-type"
              label="Business type"
              value={businessType}
              onChange={(value) => {
                setBusinessType(value)
                setDone(false)
              }}
              options={BUSINESS_TYPES}
            />

            <NumberField
              id="cni-bill"
              label="Average monthly electricity bill"
              value={bill}
              onChange={(value) => {
                setBill(value)
                setDone(false)
              }}
              placeholder="50.000.000"
              suffix="₫/month"
              inputMode="numeric"
            />

            <NumberField
              id="cni-roof"
              label="Available roof area"
              value={roofArea}
              onChange={(value) => {
                setRoofArea(value)
                setDone(false)
              }}
              placeholder="120"
              suffix="㎡"
              inputMode="decimal"
            />

            <SelectField
              id="cni-hours"
              label="Operating hours"
              value={hours}
              onChange={(value) => {
                setHours(value)
                setDone(false)
              }}
              options={OPERATING_HOURS}
            />

            <div className="md:col-span-2">
              <SelectField
                id="cni-backup"
                label="Backup power requirements"
                value={backup}
                onChange={(value) => {
                  setBackup(value)
                  setDone(false)
                }}
                options={BACKUP_NEEDS}
              />
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              type="button"
              disabled={!complete}
              onClick={() => setDone(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-cw-bold btn-gradient text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <ClipboardList className="w-4 h-4" strokeWidth={2} />
              Build my energy profile
            </button>
            <p className="text-xs text-uk-slate font-cw-regular leading-relaxed">
              Nothing is submitted at this step — the profile is assembled
              in your browser.
            </p>
          </div>

          {done && complete && (
            <div className="mt-6 rounded-xl border border-uk-teal bg-white p-6">
              <h3 className="text-lg font-cw-bold text-uk-navy">
                Here is what we would size first
              </h3>
              <p className="mt-3 text-sm text-uk-slate font-cw-regular leading-relaxed">
                <span className="font-cw-bold text-uk-navy">Your profile: </span>
                {summary}
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  'The array size your roof area can carry, and the output it is expected to produce.',
                  'The battery and inverter sizing for your operating hours and the load you need protected.',
                  'The backup window your critical circuits get, and what would have to change for more.',
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm text-uk-navy font-cw-regular leading-relaxed"
                  >
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-uk-teal flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() =>
                    openFormModal({
                      solutionType: 'business',
                      interestedProduct: `C&I profile — ${summary}`,
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-cw-bold btn-gradient text-white cursor-pointer"
                >
                  Get my tailored recommendation
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </button>
                <Link
                  href="#investment"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-cw-bold border border-uk-teal text-uk-teal-dark hover:bg-uk-teal-soft transition-colors"
                >
                  See the savings estimate
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/** A labelled select. */
function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-sm font-cw-bold text-uk-navy">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-uk-line bg-white px-4 py-2.5 text-base font-cw-regular text-uk-navy outline-none transition-colors focus:border-uk-teal focus:ring-2 focus:ring-uk-teal/20"
      >
        <option value="">Select…</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

/** A labelled number field with a unit suffix. */
function NumberField({
  id,
  label,
  value,
  onChange,
  placeholder,
  suffix,
  inputMode,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  suffix: string
  inputMode: 'numeric' | 'decimal'
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-sm font-cw-bold text-uk-navy">{label}</span>
      <span className="mt-2 flex items-baseline gap-2 rounded-xl border border-uk-line bg-white px-4 py-2.5 transition-colors focus-within:border-uk-teal focus-within:ring-2 focus-within:ring-uk-teal/20">
        <input
          id={id}
          value={value}
          onChange={(event) =>
            onChange(
              inputMode === 'numeric'
                ? event.target.value.replace(/\D/g, '').slice(0, 12)
                : event.target.value.replace(/[^\d.]/g, '').slice(0, 10),
            )
          }
          inputMode={inputMode}
          autoComplete="off"
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-base font-cw-bold text-uk-navy outline-none placeholder:text-uk-slate/50"
        />
        <span className="shrink-0 text-sm text-uk-slate">{suffix}</span>
      </span>
    </label>
  )
}
