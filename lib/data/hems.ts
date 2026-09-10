/**
 * HEMS page data — UK-localised.
 *
 * UK notes on the German-source content:
 *   - `§14a EnWG` (the German grid code) → G99 / ENA Engineering
 *     Recommendation G99 for UK grid services + ENA G98/G99
 *     for domestic connections. Compliance still translates to
 *     "automatic grid support at the point of connection" but the
 *     regulatory hook is the GB framework, not the German one.
 *   - `EEBUS` keeps its name (it's the European standard protocol
 *     also adopted in the UK for heat-pump integration).
 *   - `OCPP` keeps its name (Open Charge Point Protocol — global).
 *   - `SG Ready` → UK equivalent: `SG Ready` label also exists on UK
 *     heat pumps (Stiebel Eltron etc.) and is widely understood, so
 *     keep it.
 *   - `VPP` (Virtual Power Plant) → "VPP" is the GB industry term too
 *     (e.g. Octopus, Tesla VPP). Keep.
 *   - Currency: `€` → `£` for revenue figures. Negative-price window
 *     is also a real GB phenomenon on EPEX SPOT / Octopus Agile.
 *   - SG Ready / EEBUS / OCPP are protocol names — left intact.
 */

export interface HEMSFeature {
  /** Short emoji-free or emoji icon hint for the card. */
  icon: string
  /** Lucide icon key resolved inside FeaturesGrid. */
  iconKey: 'sun' | 'battery' | 'plug' | 'flame' | 'coins' | 'shield'
  title: string
  description: string
}

/**
 * Six capabilities orchestrated by the HEMS — same ordering as the original
 * German HEMSSection. The "icon" emoji is kept for the dark showcase; the
 * lucide iconKey drives the light-mode card grid.
 */
export const hemsFeatures: HEMSFeature[] = [
  {
    icon: '☀️',
    iconKey: 'sun',
    title: 'PV Optimisation',
    description: 'Real-time MPPT tracking for maximum solar harvest',
  },
  {
    icon: '🔋',
    iconKey: 'battery',
    title: 'Battery Management',
    description: 'Predictive charge / discharge cycles around your tariff',
  },
  {
    icon: '🚗',
    iconKey: 'plug',
    title: 'EV Charge Control',
    description: 'Solar-surplus charging, OCPP-compatible',
  },
  {
    icon: '🌡️',
    iconKey: 'flame',
    title: 'Heat Pump',
    description: 'SG Ready / EEBUS protocol integration',
  },
  {
    icon: '💰',
    iconKey: 'coins',
    title: 'Virtual Power Plant',
    description: 'Dynamic electricity-price arbitrage',
  },
  {
    icon: '🛡️',
    iconKey: 'shield',
    title: 'Backup Power (UPS)',
    description: 'Uninterrupted changeover during outages',
  },
]

/**
 * "One brain for SIX SYSTEMS" — UK-localised.
 */
export const hemsIntro = {
  eyebrow: 'Intelligent control',
  title: 'One brain for',
  titleHighlight: 'SIX SYSTEMS',
  body: 'The HEMS (Home Energy Management System) orchestrates solar PV, battery, EV charger, heat pump, grid and backup power from a single app.',
}

/**
 * Floating HUD card on the phone mockup — retired when the
 * two-column showcase was split into VideoBanner + PhoneShowcase.
 * Original UK-localised copy:
 *   title: 'VPP Revenue'
 *   value: '+£1.07 (neg. price)'
 *
 * §14a EnWG compliance card — retired per product decision.
 * UK-localised copy was:
 *   title: 'G99 / SEG compliant'
 *   body:  'Automatic grid support at the point of connection.
 *           Smart offsetting with the battery keeps your heat pump
 *           and EV charger running at full power — even during a
 *           grid-service event.'
 * Replaced with App Store / Google Play download CTAs below the
 * phone in PhoneShowcase.
 */

export interface HemsVideo {
  src: string
  poster?: string
  caption: string
  duration: string
}

/**
 * Demo video (lives on the marketing CDN — left as-is for parity with
 * the homepage HEMS section).
 */
export const hemsDemoVideo: HemsVideo = {
  src: 'https://www.solavita.com/Public/Uploads/uploadfile/files/20250815/wangyeshipin22.mp4',
  caption: 'HEMS Live Demo: Dynamic Price Arbitrage',
  duration: '1:42',
}