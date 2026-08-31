'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import Form from '@/components/Form'
import {
  FORM_MODAL_OPEN_EVENT,
  type FormModalOpenDetail,
} from '@/lib/form-modal'
import type { FormData } from '@/lib/form-types'

interface FormModalProps {
  open: boolean
  onClose: () => void
  /** Optional seed values merged into the form's initial state. */
  initialData?: Partial<FormData>
  /**
   * When true, Form skips Steps 3 (Address) and 4 (Contact Info). Used by
   * the /my-plan Edit-details entry — those steps carry PII which we
   * deliberately don't surface to the client. The user can still edit
   * Steps 0/1/2 (region, house type, roof type, household, usage,
   * devices) and submit; if they want to update address/contact, they
   * re-enter those fields from scratch on this modal.
   */
  hideAddressAndContact?: boolean
  /** Submit endpoint override (default /api/consultation). */
  submitEndpoint?: string
  /** Custom request-body builder. Receives the live FormData (whatever
   *  the user has typed), not just the initialData prefill. */
  submitPayload?: (formData: Partial<FormData>) => unknown
  /** Visible label on the Submit button. */
  submitButtonLabel?: string
  /** Fires after a successful submit (e.g. reload the host page). */
  onSubmitSuccess?: () => void
}

/**
 * Full-screen modal that hosts the consultation Form.
 *
 * Behaviour:
 * - Portals to `document.body` so it sits above the Lenis-wrapped page
 *   and escapes any transform / overflow context on the host section.
 * - Closes on: backdrop click, ESC key, the X button, or successful form
 *   submission (`onSuccess` from the Form).
 * - Locks body scroll while open and restores the previous overflow on
 *   close (so the page reflows correctly if the user resizes the window).
 * - SSR-safe: only mounts the portal after hydration (`mounted` flag).
 * - Accepts prefill via the `solavita:open-form-modal` event's `detail`.
 *   The prefill is captured into local state on each open and forwarded
 *   to `<Form initialData={...}>`. Reset on close so the next open starts
 *   from scratch unless the caller supplies a fresh prefill.
 */
export default function FormModal({
  open,
  onClose,
  initialData: initialDataProp,
  hideAddressAndContact = false,
  submitEndpoint,
  submitPayload,
  submitButtonLabel,
  onSubmitSuccess,
}: FormModalProps) {
  const [mounted, setMounted] = useState(false)
  // Event-driven prefill (via useFormModalEvent) — when the caller doesn't
  // pin initialData via props, the event hook writes here.
  const [eventInitialData, setEventInitialData] = useState<
    Partial<FormData> | undefined
  >(undefined)

  useEffect(() => {
    setMounted(true)
  }, [])

  // ESC to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Body scroll lock — restore prior overflow on close.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Clear event-captured prefill when the modal closes so an unrelated
  // future open starts fresh unless the caller pins a new prefill.
  useEffect(() => {
    if (!open) setEventInitialData(undefined)
  }, [open])

  if (!mounted || !open) return null

  const stop = (e: MouseEvent) => e.stopPropagation()

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      {/* Backdrop — visual only; clicks on it are intentionally inert so the
         user has to commit to a close (ESC or the X button). */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Card */}
      <div
        onClick={stop}
        className="relative z-10 w-full max-w-3xl my-4 sm:my-8 bg-white rounded-2xl shadow-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-sm transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        <h2 id="form-modal-title" className="sr-only">
          Get your free solar design and quote
        </h2>

        <Form
          onClose={onClose}
          initialData={initialDataProp ?? eventInitialData}
          hideAddressAndContact={hideAddressAndContact}
          submitEndpoint={submitEndpoint}
          submitPayload={submitPayload}
          submitButtonLabel={submitButtonLabel}
          onSubmitSuccess={onSubmitSuccess}
        />
      </div>
    </div>,
    document.body,
  )
}

/**
 * Hook used by hosts (CampaignOverrides, /my-plan page) to subscribe to
 * the `openFormModal(prefill)` event bus. Updates the parent's `open`
 * state and surfaces the optional prefill via `onPrefill` when provided.
 */
export function useFormModalEvent(
  setOpen: (open: boolean) => void,
  onPrefill?: (initialData: Partial<FormData> | undefined) => void,
): void {
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<FormModalOpenDetail>).detail ?? {}
      onPrefill?.(detail.initialData)
      setOpen(true)
    }
    window.addEventListener(FORM_MODAL_OPEN_EVENT, handler as EventListener)
    return () =>
      window.removeEventListener(
        FORM_MODAL_OPEN_EVENT,
        handler as EventListener,
      )
  }, [setOpen, onPrefill])
}
