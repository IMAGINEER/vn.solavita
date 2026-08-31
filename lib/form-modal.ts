/**
 * Tiny window-event bus for opening the consultation form modal.
 *
 * Why an event bus instead of a React context?
 * - Header / HeroSection / etc. are leaf components that already live in
 *   a `'use client'` tree, but they also need to be callable from inside
 *   the `Header` CTA pattern (which is itself a default value in a config
 *   object, not a prop). Threading `onOpenForm` through every consumer
 *   would force every call site to know about the modal's parent.
 * - The modal's open state lives in `CampaignOverrides`. A custom
 *   DOM event keeps the coupling one-way (callers → host) and survives
 *   Next.js client boundaries without a context provider.
 *
 * Lifecycle: a no-op when called on the server (window is undefined) so
 * it's safe to reference from default-exported component configs.
 *
 * Prefill: optional `prefill` is forwarded via `CustomEvent.detail` so
 * callers (e.g. /my-plan "Edit details") can seed the form with existing
 * Consultation fields before the user opens it.
 */

import type { FormData } from './form-types'

export const FORM_MODAL_OPEN_EVENT = 'solavita:open-form-modal'

export interface FormModalOpenDetail {
  /** Optional seed values merged into the form's initial state. */
  initialData?: Partial<FormData>
}

// Two-call-shape function:
//   - Called as `onClick={openFormModal}` → no args, returns void (acts as
//     a MouseEventHandler).
//   - Called as `openFormModal(prefill)` → returns void; the caller wires
//     the dispatch through e.g. `onClick={() => openFormModal(prefill)}`.
export function openFormModal(): void
export function openFormModal(prefill: Partial<FormData>): void
export function openFormModal(prefill?: Partial<FormData>): void {
  if (typeof window === 'undefined') return
  const detail: FormModalOpenDetail = prefill ? { initialData: prefill } : {}
  window.dispatchEvent(
    new CustomEvent(FORM_MODAL_OPEN_EVENT, { detail }),
  )
}
