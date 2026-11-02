// Single-source-of-truth for the active homepage campaign.
//
// ─────────────────────────────────────────────────────────────────────────────
//   HOW TO SWITCH VERSIONS (the only line you edit):
//     export const activeCampaignSlug: CampaignSlug = 'none'       → default page
//     export const activeCampaignSlug: CampaignSlug = 'ng-launch'  → NG homepage campaign
//     export const activeCampaignSlug: CampaignSlug = '<new>'      → add a new entry in CAMPAIGNS below
// ─────────────────────────────────────────────────────────────────────────────

import type { ActiveCampaign } from './types'

/** Add a new campaign by appending its slug to this union and a matching key in CAMPAIGNS. */
export type CampaignSlug = 'none' | 'ng-launch'

// Registry of all known campaign versions. 'none' = default page.
// To add a new campaign:
//   1. extend the CampaignSlug union above
//   2. add a matching entry here (e.g. 'other': { ... })
const CAMPAIGNS: Record<CampaignSlug, ActiveCampaign | null> = {
  none: null,

  'ng-launch': {
    slug: 'ng-launch',
    startsAt: '2026-01-01T00:00:00+00:00',
    endsAt: '2099-12-31T23:59:59+00:00', // open-ended NG homepage

    hero: {
      badge: 'Designed for Nigeria · Premium Quality',
      h1: ['Power Your Home.', 'Shape a Greener Nigeria.', ''],
      subhead:
        'Smart solar & storage solutions for Nigerian homes. Cut your fuel bill. Own your power. Stay lit through any outage.',
      primaryCta: { label: 'Get Free Quote →' },
    },

    formSection: {
      background: 'gradient-placeholder',
      badge: 'Free Plan · No Obligation',
      h2: ['Get Your Free', 'Plan', 'in 24 hours'],
      subhead:
        'Tell us about your home and energy needs. Our experts will design the best solution and provide a clear, no-obligation quote.',
    },
  },
}

// ← THE ONLY SWITCH YOU CHANGE: 'none' = default page,
//   'ng-launch' = the NG homepage campaign.
export const activeCampaignSlug: CampaignSlug = 'ng-launch'

// Resolved active campaign - driven entirely by the slug above.
export const activeCampaign: ActiveCampaign | null = CAMPAIGNS[activeCampaignSlug]

export function isCampaignActive(now: Date = new Date()): boolean {
  if (!activeCampaign) return false
  const start = new Date(activeCampaign.startsAt).getTime()
  const end = new Date(activeCampaign.endsAt).getTime()
  const t = now.getTime()
  return t >= start && t <= end
}
