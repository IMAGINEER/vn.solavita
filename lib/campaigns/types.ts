// Shared types for the campaigns plugin.
// Keep this file framework-free so it can be imported from server or client components.

export type CtaCopy = {
  label: string
}

export type HeroCopy = {
  badge: string
  // H1 is rendered as three stacked lines, with the middle line emphasized via text-gradient
  h1: [string, string, string]
  subhead: string
  primaryCta: CtaCopy
  // When true, replace the right-side live system render panel with the campaign media
  hideRightPanelSystemRender?: boolean
  // Campaign-only media rendered in the right panel when `hideRightPanelSystemRender` is true.
  // When absent, falls back to the TV placeholder card.
  media?: { kind: 'youtube'; id: string }
}

export type FormSectionCopy = {
  background: 'gradient-placeholder'
  badge: string
  // H2 is rendered as three stacked lines, with the middle line emphasized via text-gradient
  h2: [string, string, string]
  subhead: string
  // When true, render <CampaignBody /> (campaign steps + FAQ) below the <Form /> in FooterCTA
  showCampaignBody?: boolean
}

export type ActiveCampaign = {
  slug: string
  // ISO 8601 strings; evaluated against the user's local clock
  startsAt: string
  endsAt: string
  hero?: HeroCopy
  formSection?: FormSectionCopy
}