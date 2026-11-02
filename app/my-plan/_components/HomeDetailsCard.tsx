'use client'

import { Home, Edit } from 'lucide-react'
import type { HomeDetails } from '../_lib/calc'

interface HomeDetailsCardProps {
  home: HomeDetails
  /**
   * Fires when the user clicks "Edit details". The host (MyPlanClient)
   * wires this to `openFormModal(prefill)` so the form opens with the
   * user's existing consultation fields pre-filled.
   */
  onEdit: () => void
}

/** Map electricity-usage tier IDs to a label for the strip. */
const USAGE_LABEL: Record<string, string> = {
  low: 'Low use',
  medium: 'Medium use',
  high: 'High use',
  'very-high': 'Very high use',
}

/** Map device IDs to short labels. */
const DEVICE_LABEL: Record<string, string> = {
  wallbox: 'EV charger',
  heatpump: 'Heat pump',
  ac: 'AC',
}

/**
 * Map house-type IDs (sent by the form, stored in DB) to display labels.
 * Mirrors the labels in `components/Form.tsx`'s HOUSE_TYPES array so
 * the strip reads consistently with the Edit-details modal.
 */
const HOUSE_TYPE_LABEL: Record<string, string> = {
  detached: 'Detached house',
  'semi-detached': 'Duplex / semi-detached',
  terraced: 'Terraced house',
  apartment: 'Flat / Apartment',
}

/**
 * Map roof-type IDs to display labels. Mirrors `components/Form.tsx`'s
 * ROOF_TYPES array.
 */
const ROOF_TYPE_LABEL: Record<string, string> = {
  gable: 'Pitched (gable)',
  hip: 'Hipped',
  flat: 'Flat roof',
  pent: 'Mono-pitched',
}

/**
 * The "Your home" strip that sits at the top of the plan content. Edit
 * button reopens the existing consultation form via the host's callback,
 * which forwards a prefill built from the current consultation row so
 * the form's first paint already has region / house type / address / etc.
 *
 * The strip surfaces all 6 editable consultation fields (region, house
 * type, roof type, household, usage, devices) so the user sees their
 * edits reflected after the post-confirm reload. PII columns (street,
 * house number, name, email, phone) stay server-side.
 */
export default function HomeDetailsCard({ home, onEdit }: HomeDetailsCardProps) {
  const usageLabel = USAGE_LABEL[home.electricityUsage] ?? home.electricityUsage
  const deviceList =
    home.devices.length > 0
      ? home.devices.map((d) => DEVICE_LABEL[d] ?? d).join(', ')
      : 'No devices'
  const houseTypeLabel = HOUSE_TYPE_LABEL[home.houseType] ?? home.houseType
  const roofLabel = ROOF_TYPE_LABEL[home.roofOrientation] ?? home.roofOrientation
  // People count, not bedroom count. "5+" maps to 5 (the upper bound on
  // the form's HOUSEHOLD_SIZES picker). Display suffix is "people" to
  // mirror the form Step 2 label "How many people live in your
  // household?".
  const peopleSuffix = home.householdSize === 1 ? 'person' : 'people'

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-white border border-uk-line hover:border-uk-teal/40 hover:shadow-md transition-all flex items-start sm:items-center gap-4">
      <div className="w-12 h-12 shrink-0 rounded-full bg-uk-teal-soft text-uk-teal-dark flex items-center justify-center">
        <Home className="w-5 h-5" strokeWidth={1.75} />
      </div>

      <div className="flex-1 min-w-0">
        <strong className="block text-base font-cw-bold text-uk-navy">
          Your home
        </strong>
        <p className="mt-1 text-sm text-uk-slate leading-relaxed">
          {home.region} · {houseTypeLabel} · {home.householdSize} {peopleSuffix} · {roofLabel}
        </p>
        <p className="mt-1 text-sm text-uk-slate leading-relaxed">
          {usageLabel} · {deviceList}
        </p>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white hover:border-uk-teal hover:text-uk-teal-dark text-uk-navy text-sm font-cw-bold transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        <Edit className="w-4 h-4" strokeWidth={1.75} />
        Edit details
      </button>
    </div>
  )
}
