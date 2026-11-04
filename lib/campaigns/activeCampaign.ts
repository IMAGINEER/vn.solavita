// Single-source-of-truth for the active homepage campaign.
//
// ─────────────────────────────────────────────────────────────────────────────
//   HOW TO SWITCH VERSIONS (the only line you edit):
//     export const activeCampaignSlug: CampaignSlug = 'none'       → default page
//     export const activeCampaignSlug: CampaignSlug = '<new>'      → add a new entry in CAMPAIGNS below
// ─────────────────────────────────────────────────────────────────────────────

import type { ActiveCampaign } from './types'

/** Add a new campaign by appending its slug to this union and a matching key in CAMPAIGNS. */
export type CampaignSlug = 'none'

// Registry of all known campaign versions. 'none' = default page.
// To add a campaign:
//   1. extend the CampaignSlug union above
//   2. add a matching entry here (e.g. 'other': { ... })
const CAMPAIGNS: Record<CampaignSlug, ActiveCampaign | null> = {
  none: null,
}

// ← THE ONLY SWITCH YOU CHANGE: 'none' = default page.
export const activeCampaignSlug: CampaignSlug = 'none'

// Resolved active campaign - driven entirely by the slug above.
export const activeCampaign: ActiveCampaign | null = CAMPAIGNS[activeCampaignSlug]

export function isCampaignActive(now: Date = new Date()): boolean {
  if (!activeCampaign) return false
  const start = new Date(activeCampaign.startsAt).getTime()
  const end = new Date(activeCampaign.endsAt).getTime()
  const t = now.getTime()
  return t >= start && t <= end
}