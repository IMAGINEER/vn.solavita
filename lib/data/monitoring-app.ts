/**
 * Monitoring App page data — Nigeria.
 *
 * Six Monitoring App capabilities as they apply to Nigerian homes and small
 * businesses. All copy is NG-shaped:
 *   - diesel displacement framing (per ng-brand-voice cost / crisis values)
 *   - no UK / EU regulatory hooks (§14a EnWG, EPEX SPOT, Octopus Agile,
 *     Stiebel Eltron, G99, ENA G98) - those were UK-localised from the
 *     earlier DE-source HEMSSection; the NG app is solar + battery +
 *     load orchestration with the inverter, no tariff-arbitrage or
 *     grid-service framing.
 *
 * Demo video URL is intentionally preserved as-is from the source CDN;
 * the user opted to keep the existing asset. Per ng-content-strategy
 * rule 1 (no fabrication) we do not inject a fake NG-specific CDN
 * path here until business confirms where the production video lives.
 */

export interface MonitoringAppFeature {
  /** Short emoji-free or emoji icon hint for the card. */
  icon: string
  /** Lucide icon key resolved inside FeaturesGrid. */
  iconKey: 'sun' | 'battery' | 'plug' | 'flame' | 'coins' | 'shield'
  title: string
  description: string
}

/**
 * Six app capabilities for the NG site, ordered by how a Nigerian
 * homeowner experiences them: solar first, battery next, appliance
 * control, climate, household economics, last the backup-ride-through.
 */
export const monitoringAppFeatures: MonitoringAppFeature[] = [
  {
    icon: '☀️',
    iconKey: 'sun',
    title: 'PV Optimisation',
    description:
      'Real-time MPPT tracking to draw the maximum energy your panels can produce today.',
  },
  {
    icon: '🔋',
    iconKey: 'battery',
    title: 'Battery Management',
    description:
      'Schedules charging and discharging around your home loads, prioritising evening and grid-outage windows.',
  },
  {
    icon: '🚗',
    iconKey: 'plug',
    title: 'EV Charge Control',
    description:
      'Solar-surplus EV charging and time-of-use scheduling once your vehicle and charger are paired.',
  },
  {
    icon: '🌡️',
    iconKey: 'flame',
    title: 'Air Conditioner Coordination',
    description:
      'Coordinates inverter capacity with AC starting demand so heavy loads do not trip the system.',
  },
  {
    icon: '💰',
    iconKey: 'coins',
    title: 'Fuel-cost Tracking',
    description:
      'Compares your solar generation against your previous diesel / petrol spend so you see the monthly saving.',
  },
  {
    icon: '🛡️',
    iconKey: 'shield',
    title: 'Outage Ride-through',
    description:
      'Seamless changeover to battery backup during grid outages - keep lights, fans and connectivity on.',
  },
]

/**
 * Page-intro block: "One brain for SIX SYSTEMS".
 */
export const monitoringAppIntro = {
  eyebrow: 'Intelligent control',
  title: 'One brain for',
  titleHighlight: 'SIX SYSTEMS',
  body: 'The Solavita Monitoring App coordinates solar PV, battery storage, air conditioner, household loads and outage backup from one screen.',
}

/**
 * The original UK file carried floating HUD card copy that quoted
 * £-denominated revenue figures and German / GB regulatory framing.
 * Those have been retired for the NG site. Retaining the export shape
 * so callers in components/monitoring-app/* keep typechecking; consumers
 * render the NG-shaped monitoringAppFeatures / monitoringAppIntro above
 * instead.
 */

export interface MonitoringAppVideo {
  src: string
  poster?: string
  caption: string
  duration: string
}

/**
 * Demo video - URL preserved per the user's explicit instruction to
 * keep the existing asset. Move to `public/videos/monitoring-app-ng-demo.webp`
 * (or the production NG CDN) once business confirms the final host.
 */
export const monitoringAppDemoVideo: MonitoringAppVideo = {
  src: 'https://www.solavita.com/Public/Uploads/uploadfile/files/20250815/wangyeshipin22.mp4',
  caption: 'Monitoring App live demo: dynamic energy orchestration',
  duration: '1:42',
}