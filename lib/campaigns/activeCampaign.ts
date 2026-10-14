// Single-source-of-truth for the active homepage campaign.
//
// ─────────────────────────────────────────────────────────────────────────────
//   HOW TO SWITCH VERSIONS (the only line you edit):
//     export const activeCampaignSlug: CampaignSlug = 'none'       → default page
//     export const activeCampaignSlug: CampaignSlug = 'metz'       → "Metz Google TV" campaign
//     export const activeCampaignSlug: CampaignSlug = 'uk-launch'  → UK homepage redesign
//     export const activeCampaignSlug: CampaignSlug = '<new>'      → add a new entry in CAMPAIGNS below
// ─────────────────────────────────────────────────────────────────────────────

import type { ActiveCampaign } from './types'

/** Add a new campaign by appending its slug to this union and a matching key in CAMPAIGNS. */
export type CampaignSlug = 'none' | 'metz' | 'uk-launch'

// Registry of all known campaign versions. 'none' = default page.
// To add a new campaign:
//   1. extend the CampaignSlug union above
//   2. add a matching entry here (e.g. 'other': { ... })
const CAMPAIGNS: Record<CampaignSlug, ActiveCampaign | null> = {
  none: null,
  metz: {
    slug: 'metz-google-tv',
    startsAt: '2026-08-24T00:00:00+02:00',
    endsAt: '2026-11-24T23:59:59+02:00', // 3 months

    hero: {
      badge: 'Befristete Aktion · In ganz Europa · Solarstromspeicher-Programm',
      h1: ['Jetzt Solaranlage.', 'Gratis Metz Google TV', 'dazu.'],
      subhead:
        'Staatliche Speicherförderung sichern + einen tragbaren Metz Google TV (UVP 399 €) als Zugabe zum Solarauftrag. Drei Vorteile, eine Anfrage.',
      primaryCta: { label: 'Jetzt Aktion sichern →' },
      hideRightPanelSystemRender: true,
      media: { kind: 'youtube', id: 'ND2Y2kxZoRw' },
    },

    formSection: {
      background: 'gradient-placeholder',
      badge: 'Aktion: Nur 50 Sets · Solange der Vorrat reicht',
      // Second screen = call to action + process (NOT a repeat of the Hero intro)
      h2: ["So geht's in", '3 Schritten', 'zum Gratis-TV'],
      subhead:
        'Anfrage senden, Angebot erhalten, Anlage installieren lassen - Ihr Metz MPE7000 ist mit dabei.',
      showCampaignBody: true,
    },
  },

  'uk-launch': {
    slug: 'uk-launch',
    startsAt: '2026-01-01T00:00:00+00:00',
    endsAt: '2099-12-31T23:59:59+00:00', // open-ended UK homepage

    hero: {
      badge: 'Designed for the UK · Premium Quality',
      h1: ['Power Your Home.', 'Shape a Greener UK.', ''],
      subhead:
        'Smart solar & storage solutions for Nigerian homes. Cut your fuel bill. Own your power. Stay lit through any outage.',
      primaryCta: { label: 'Get Free Plan →' },
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

// ← THE ONLY SWITCH YOU CHANGE: 'none' = default page, 'metz' = Metz Google TV campaign,
//   'uk-launch' = UK homepage redesign.
export const activeCampaignSlug: CampaignSlug = 'uk-launch'

// Resolved active campaign - driven entirely by the slug above.
export const activeCampaign: ActiveCampaign | null = CAMPAIGNS[activeCampaignSlug]

export function isCampaignActive(now: Date = new Date()): boolean {
  if (!activeCampaign) return false
  const start = new Date(activeCampaign.startsAt).getTime()
  const end = new Date(activeCampaign.endsAt).getTime()
  const t = now.getTime()
  return t >= start && t <= end
}