/**
 * Microgrid page data — Nigeria.
 *
 * Source of truth: `docs/修改建议.docx` §"Solutions - For Microgrid -
 * 详情页：①微电网实景图+②微电网优势+③典型应用场景+④APP（沿用之前的）
 * +⑤FAQ" (Oct 2026).
 *
 * The page introduces the 125 kW / 261 kWh All-in-One ESS (see
 * `lib/data/products.ts`) as a microgrid product for commercial and
 * community sites.
 *
 * The real-scene photograph is a reference image in the docx and has
 * not been supplied yet, so the hero uses the shared `ImagePlaceholder`
 * component per the NG content strategy.
 */

/** One of the three operating modes. */
export interface MicrogridMode {
  id: string
  /** Mode name, e.g. "Off-Grid". */
  name: string
  /** One-line description. */
  description: string
}

/** One advantage tile in the "Why Choose Microgrid" icon wall. */
export interface MicrogridAdvantage {
  id: string
  /** Icon key, resolved inside the page component. */
  icon: 'wallet' | 'clock' | 'smartphone' | 'battery' | 'shield'
  /** Short label, e.g. "Cut Diesel". */
  title: string
  /** The headline number, e.g. "70%~90%". */
  value: string
}

/** One typical application scenario (image + short line). */
export interface MicrogridScenario {
  id: string
  /** Scenario name, e.g. "Cold Chain / Supermarket". */
  title: string
  /** Small supporting line, e.g. "Freezers stay cold when the grid goes dark." */
  caption: string
  /** What the scenario image should show. */
  imageDescription: string
}

export const microgridHero = {
  eyebrow: 'MICROGRID SOLUTIONS',
  title: 'One Microgrid, Three Ways to Power Your Business',
  body: 'A 125 kW / 261 kWh all-in-one energy storage system for factories, supermarkets, community mini-grids and telecom sites. Off-grid, hybrid or on-grid — the same cabinet, configured for how you actually operate.',
  imageDescription:
    'Solavita 125 kW / 261 kWh all-in-one C&I energy storage cabinet standing in front of a utility-scale solar array',
}

export const microgridModes: MicrogridMode[] = [
  {
    id: 'off-grid',
    name: 'Off-Grid',
    description: 'Total energy independence. No grid, no problem.',
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    description:
      'Smart savings with zero downtime. Grid or no grid, you stay running.',
  },
  {
    id: 'on-grid',
    name: 'On-Grid',
    description: 'Slash demand charges and secure critical loads.',
  },
]

export const microgridAdvantages: MicrogridAdvantage[] = [
  { id: 'cut-diesel', icon: 'wallet', title: 'Cut Diesel', value: '70%~90%' },
  { id: 'zero-downtime', icon: 'clock', title: 'Zero Downtime', value: '<10ms' },
  { id: 'remote-monitor', icon: 'smartphone', title: 'Remote Monitor', value: '24/7' },
  { id: 'cycles', icon: 'battery', title: '6000+ Cycles', value: '5+ years' },
  { id: 'local-service', icon: 'shield', title: 'Local Service', value: '<24h Response' },
]

export const microgridScenarios: MicrogridScenario[] = [
  {
    id: 'medium-factory',
    title: 'Medium Factory / Light Processing',
    caption: "Outage doesn't stop your machines.",
    imageDescription:
      'A medium-sized factory floor running on battery power during a grid outage',
  },
  {
    id: 'cold-chain',
    title: 'Cold Chain / Supermarket',
    caption: 'Freezers stay cold when the grid goes dark.',
    imageDescription:
      'A supermarket cold-room with freezer and refrigeration units running on backup power',
  },
  {
    id: 'community-mini-grid',
    title: 'Community Mini-Grid',
    caption: 'One box powers the whole street.',
    imageDescription:
      'A residential street with homes and street lighting supplied by a community mini-grid cabinet',
  },
  {
    id: 'telecom-edge',
    title: 'Telecom / Edge Site',
    caption: 'Towers stay online, generators stay silent.',
    imageDescription:
      'A telecom edge site with antenna mast and equipment shelter running on battery storage',
  },
]
