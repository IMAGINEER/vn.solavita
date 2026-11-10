'use client'

import { use, useState } from 'react'
import MyPlanHydrator from './_components/MyPlanHydrator'
import PlanUnavailable from './_components/PlanUnavailable'
import FormModal, { useFormModalEvent } from '@/components/FormModal'
import type { FormData } from '@/lib/form-types'

/**
 * `/my-plan?{identifier}` - reads the `id` query param via React 19 `use()`
 * (Next.js 16 hands Client Components a `Promise` for `searchParams`).
 *
 * Two branches:
 *   - Empty / missing identifier → render `PlanUnavailable` directly.
 *   - Non-empty identifier       → hand it to `MyPlanHydrator`, which
 *     fetches the row from `/api/my-plan/[token]`, runs the loading /
 *     ready / unavailable / error state machine, and renders either
 *     `PlanUnavailable` (with retry when errored) or `MyPlanClient`
 *     (with the resolved row).
 *
 * The page also hosts the consultation `FormModal` here (rather than
 * duplicating the listener inside `MyPlanClient`). The modal's open bus
 * lives in `CampaignOverrides` on `/`, so we mirror the same pattern on
 * `/my-plan` to keep `openFormModal()` callsites uniform. The hook also
 * captures any `initialData` carried by the event so the Form prefills
 * with the user's existing consultation fields when "Edit details" is
 * clicked.
 */
export default function MyPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = use(searchParams)
  const [formOpen, setFormOpen] = useState(false)
  const [initialData, setInitialData] = useState<
    Partial<FormData> | undefined
  >(undefined)
  useFormModalEvent(setFormOpen, setInitialData)

  // Resolve identifier with three priorities so the route accepts both
  //   /my-plan?id=abc   (canonical key=value form)
  //   /my-plan?abc      (bare-key form, treated as `{ abc: '' }` by Next.js)
  // while still rejecting truly empty URLs (`/my-plan`, `/my-plan?`).
  let identifier = ''

  // 1) Explicit `id` param wins.
  if (typeof params.id === 'string' && params.id.trim()) {
    identifier = params.id.trim()
  }

  // 2) Any other param with a non-empty value.
  if (!identifier) {
    for (const [k, v] of Object.entries(params)) {
      if (k === 'id') continue
      if (typeof v === 'string' && v.trim()) {
        identifier = v.trim()
        break
      }
    }
  }

  // 3) Bare-key form (`/my-plan?test123`): URL parses to `{ test123: '' }`
  //    so the identifier is the key itself.
  if (!identifier) {
    const keys = Object.keys(params)
    if (keys.length === 1 && keys[0] !== 'id') {
      identifier = keys[0]
    }
  }

  if (!identifier) {
    return (
      <>
        <PlanUnavailable />
        <FormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initialData={initialData}
          hideAddressAndContact
          submitEndpoint="/api/consultation/update"
          submitPayload={(d) => buildUpdatePayload(identifier, d)}
          submitButtonLabel="Xác nhận chỉnh sửa"
          onSubmitSuccess={reloadPage}
        />
      </>
    )
  }

  return (
    <>
      <MyPlanHydrator identifier={identifier} />
      <FormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialData={initialData}
        hideAddressAndContact
        submitEndpoint="/api/consultation/update"
        submitPayload={(d) => buildUpdatePayload(identifier, d)}
        submitButtonLabel="Xác nhận chỉnh sửa"
        onSubmitSuccess={reloadPage}
      />
    </>
  )
}

/**
 * Build the slim, no-PII body for /api/consultation/update. The endpoint
 * identifies the row by `plan_token`; the form never sends PII.
 *
 * `planToken` is the `identifier` resolved from the URL on this page
 * (e.g. the UUID v4 from `/my-plan?id={token}`).
 */
function buildUpdatePayload(
  planToken: string,
  formData: Partial<FormData>,
): unknown {
  return {
    planToken,
    city: formData.city ?? '',
    propertyType: formData.propertyType ?? '',
    householdSize: formData.householdSize ?? '',
    electricityUsage: formData.electricityUsage ?? '',
    daytimeRatio: formData.daytimeRatio ?? '',
    roofType: formData.roofType ?? '',
  }
}

function reloadPage() {
  // Force a hard reload so /api/my-plan/[token] is re-fetched with the
  // freshly-updated row, which recomputes the recommended plan + the
  // entire ROI breakdown. A soft `router.refresh()` would also work but
  // misses the simple reliability of a full reload on a low-traffic page.
  if (typeof window !== 'undefined') window.location.reload()
}
