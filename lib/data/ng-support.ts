/**
 * Support page data — Nigeria.
 *
 * Built from `content/nigeria/support.md`. The UK file held a flat list
 * of "what you can do" cards (App, Warranty, Service Request, ...). The
 * NG version keeps the same card shape (for visual parity) but every
 * title / description is NG-shaped and every operational claim
 * (warranty, GDPR-compliance, service request) is surfaced as a TBD
 * until business confirms the actual offering.
 */

export interface NgSupportItem {
  icon:
    | 'app'
    | 'warranty'
    | 'service'
    | 'knowledge'
    | 'contact'
    | 'compliance'
    | 'privacy'
    | 'terms'
  title: string
  description: string
}

export const ngSupportItems: NgSupportItem[] = [
  {
    icon: 'app',
    title: 'HEMS App',
    description:
      'TBD — Confirmed HEMS app download link and supported NG regions.',
  },
  {
    icon: 'warranty',
    title: 'Warranty',
    description:
      'TBD — Approved module, inverter, battery and installation workmanship warranty terms.',
  },
  {
    icon: 'service',
    title: 'Service Request',
    description:
      'TBD — Confirmed NG customer support channels, operating hours and escalation process.',
  },
  {
    icon: 'knowledge',
    title: 'Knowledge Base',
    description:
      'TBD — Confirmed NG guides, manuals and download center.',
  },
  {
    icon: 'contact',
    title: 'Contact Us',
    description:
      'TBD — Verified NG email, WhatsApp and telephone channels.',
  },
  {
    icon: 'compliance',
    title: 'Data Protection',
    description:
      'TBD — Confirmed NDPR-aligned data protection commitments.',
  },
  {
    icon: 'privacy',
    title: 'Secure & Private',
    description:
      'TBD — Confirmed security and privacy practices.',
  },
  {
    icon: 'terms',
    title: 'Transparent Terms',
    description:
      'TBD — Approved written policies (terms, privacy, cookies).',
  },
]

/**
 * Backwards-compat alias. The original UK file exported `ukSupportItems`;
 * `components/support/*` and `app/support/PageClient.tsx` may still
 * import under the old name. Re-exported to avoid a fan-out rename.
 */
export const ukSupportItems: NgSupportItem[] = ngSupportItems

/**
 * Support FAQ data — built from `content/nigeria/support.md` Section 2.
 * Four sub-groups (Choosing a System, Solar Panels and Generation,
 * Batteries and Backup, Installation and Warranty, Pricing and
 * Payments). Every answer is either a verified prose answer or a
 * `TBD — …` string that the page surfaces through `TbdText`.
 */

export interface SupportFaqGroup {
  id: string
  title: string
  items: SupportFaqItem[]
}

export interface SupportFaqItem {
  q: string
  /** Plain text or JSX containing `<TbdText>` for missing answers. */
  a: string
}

export const supportFaqGroups: SupportFaqGroup[] = [
  {
    id: 'choosing-a-system',
    title: 'Choosing a System',
    items: [
      {
        q: 'How do I choose the right solution?',
        a: 'Start with the appliances you need to power, their rated power, how long you use them and how much backup time you need. The solution descriptions are a starting point; a proper load assessment should confirm the final system.',
      },
      {
        q: 'Is a larger inverter always better?',
        a: 'Not necessarily. The inverter must support the combined running demand and starting demand of the appliances you intend to operate. Battery capacity and solar generation must also match your requirements.',
      },
    ],
  },
  {
    id: 'solar-panels-and-generation',
    title: 'Solar Panels and Generation',
    items: [
      {
        q: 'How much electricity will my system generate?',
        a: 'The solution page provides preliminary annual generation estimates. Actual output varies by location, solar conditions, shading, installation design and system losses.',
      },
      {
        q: 'Will the system work on cloudy days?',
        a: 'Solar generation varies with sunlight conditions. Battery storage can provide energy when solar generation is insufficient, but available backup depends on stored energy and the connected load.',
      },
    ],
  },
  {
    id: 'batteries-and-backup',
    title: 'Batteries and Backup',
    items: [
      {
        q: 'How long will my battery last during an outage?',
        a: 'Backup duration depends on usable battery capacity and the appliances drawing power. A larger load uses stored energy more quickly.',
      },
      {
        q: 'Can I run an air conditioner?',
        a: "That depends on the air conditioner's power demand, starting current, inverter capacity and other appliances running simultaneously. Confirm compatibility before installation.",
      },
      {
        q: 'Can I keep my generator?',
        a: 'A solar and battery system may reduce generator runtime. Whether a generator can be integrated into the system depends on the equipment and installation design.',
      },
    ],
  },
  {
    id: 'installation-and-warranty',
    title: 'Installation and Warranty',
    items: [
      {
        q: 'Does the solution include installation?',
        a: 'TBD — Confirmed solution inclusions, exclusions, site assessment process and installation availability.',
      },
      {
        q: 'What warranty is provided?',
        a: 'TBD — Approved warranty terms for panels, inverters, batteries and installation workmanship.',
      },
      {
        q: 'Where is installation available?',
        a: 'TBD — Confirmed Nigeria service coverage.',
      },
    ],
  },
  {
    id: 'pricing-and-payments',
    title: 'Pricing and Payments',
    items: [
      {
        q: 'How much does a system cost?',
        a: 'TBD — Approved Nigerian solution pricing. Request a quote for your requirements.',
      },
      {
        q: 'Are instalment payments available?',
        a: 'TBD — Verified financing providers, payment terms, fees, eligibility and geographic availability. Do not advertise PAYGo, monthly payments, subsidies or financing until the actual offer has been approved.',
      },
    ],
  },
]
