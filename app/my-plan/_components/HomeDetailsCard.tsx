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
  low: 'Mức dùng thấp',
  medium: 'Mức dùng trung bình',
  high: 'Mức dùng cao',
  'very-high': 'Mức dùng rất cao',
}

/** Map device IDs to short labels. */
const DEVICE_LABEL: Record<string, string> = {
  wallbox: 'Sạc xe điện',
  heatpump: 'Máy bơm nhiệt',
  ac: 'Điều hòa',
}

/**
 * Map house-type IDs (sent by the form, stored in DB) to display labels.
 * Mirrors the labels in `components/Form.tsx`'s HOUSE_TYPES array so
 * the strip reads consistently with the Edit-details modal.
 */
const HOUSE_TYPE_LABEL: Record<string, string> = {
  detached: 'Nhà riêng lẻ',
  'semi-detached': 'Nhà song lập / bán liền kề',
  terraced: 'Nhà phố liền kề',
  apartment: 'Căn hộ / chung cư',
}

/**
 * Map roof-type IDs to display labels. Mirrors `components/Form.tsx`'s
 * ROOF_TYPES array.
 */
const ROOF_TYPE_LABEL: Record<string, string> = {
  gable: 'Mái dốc (hai mái)',
  hip: 'Mái bốn dốc',
  flat: 'Mái bằng',
  pent: 'Mái một dốc',
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
      : 'Không có thiết bị'
  const houseTypeLabel = HOUSE_TYPE_LABEL[home.houseType] ?? home.houseType
  const roofLabel = ROOF_TYPE_LABEL[home.roofOrientation] ?? home.roofOrientation
  // People count, not bedroom count. "5+" maps to 5 (the upper bound on
  // the form's HOUSEHOLD_SIZES picker). Vietnamese does not inflect the
  // noun, so a single label covers every count.
  const peopleSuffix = 'người'

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-white border border-uk-line hover:border-uk-teal/40 hover:shadow-md transition-all flex items-start sm:items-center gap-4">
      <div className="w-12 h-12 shrink-0 rounded-full bg-uk-teal-soft text-uk-teal-dark flex items-center justify-center">
        <Home className="w-5 h-5" strokeWidth={1.75} />
      </div>

      <div className="flex-1 min-w-0">
        <strong className="block text-base font-cw-bold text-uk-navy">
          Nhà của bạn
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
        Chỉnh sửa thông tin
      </button>
    </div>
  )
}
