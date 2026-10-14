/**
 * Tiny window-event bus for opening the **partner enquiry** form modal.
 *
 * Why a separate bus instead of reusing `lib/form-modal.ts`?
 * - The consultation form (`/api/consultation`) collects 14 fields across
 *   5 steps and posts to Supabase's `ng_consultations` table.
 * - The partner enquiry form (`/api/partner`) collects 5 fields on a
 *   single step and posts to `ng_partner_leads`. Showing either form
 *   when the user clicked the other CTA confuses them — the partner CTA
 *   should land on the partner form, the contact-CTA on the
 *   consultation form.
 * - The submission endpoints, validation rules, schema columns and
 *   transactional emails are all different. Two buses keep the coupling
 *   one-way and stop callers from accidentally wiring a partner CTA to
 *   the consultation route (and vice versa).
 *
 * Lifecycle: a no-op when called on the server (window is undefined) so
 * it's safe to reference from default-exported component configs.
 */

export const PARTNER_FORM_MODAL_OPEN_EVENT = 'solavita:open-partner-form-modal'

export interface PartnerFormModalOpenDetail {
  /** Optional partner-track seed for the track selector. */
  defaultTrack?: 'installer' | 'referral' | 'community'
}

export function openPartnerFormModal(): void
export function openPartnerFormModal(
  detail: PartnerFormModalOpenDetail,
): void
export function openPartnerFormModal(detail?: PartnerFormModalOpenDetail): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent(PARTNER_FORM_MODAL_OPEN_EVENT, {
      detail: detail ?? {},
    }),
  )
}