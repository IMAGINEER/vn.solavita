'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import PartnerForm from '@/components/PartnerForm'
import {
  PARTNER_FORM_MODAL_OPEN_EVENT,
  type PartnerFormModalOpenDetail,
} from '@/lib/partner-form-modal'

interface PartnerFormModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Full-screen modal that hosts the partner enquiry PartnerForm.
 *
 * Separate from the consultation `FormModal` because the partner CTA
 * should land on the partner form (not the multi-step consultation
 * form). See `lib/partner-form-modal.ts` for the rationale on the
 * dedicated event bus.
 *
 * Mirrors the FormModal lifecycle (ESC to close, body-scroll lock,
 * SSR-safe portal mount, X button to dismiss). The partner form
 * self-clears on submit (`onClose` called by `PartnerForm` when the
 * success screen's Close button fires).
 */
export default function PartnerFormModal({
  open,
  onClose,
}: PartnerFormModalProps) {
  const [mounted, setMounted] = useState(false)
  const [defaultTrack, setDefaultTrack] = useState<
    'installer' | 'referral' | 'distribution' | 'community' | undefined
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

  // Body scroll lock - restore prior overflow on close.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Reset the event-captured track when the modal closes so a future
  // open without a new seed reverts to the form default.
  useEffect(() => {
    if (!open) setDefaultTrack(undefined)
  }, [open])

  if (!mounted || !open) return null

  const stop = (e: MouseEvent) => e.stopPropagation()

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-form-modal-title"
    >
      {/* Backdrop - visual only; clicks on it are inert so the user
         has to commit to a close (ESC or the X button). */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Card */}
      <div
        onClick={stop}
        className="relative z-10 w-full max-w-2xl my-4 sm:my-8 bg-white rounded-2xl shadow-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-sm transition-colors"
          aria-label="Close partner form"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        <h2 id="partner-form-modal-title" className="sr-only">
          Tell us about your business
        </h2>

        <PartnerForm onClose={onClose} defaultTrack={defaultTrack} />
      </div>
    </div>,
    document.body,
  )
}

/**
 * Hook used by hosts (currently the global `Footer`) to subscribe to
 * the `openPartnerFormModal(detail)` event bus. Updates the parent's
 * `open` state and surfaces the optional `defaultTrack` so callers
 * (e.g. a per-partner-type "Apply for this track" button) can pre-seed
 * the partner-track selector.
 */
export function usePartnerFormModalEvent(
  setOpen: (open: boolean) => void,
  onDetail?: (detail: PartnerFormModalOpenDetail) => void,
): void {
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<PartnerFormModalOpenDetail>).detail ?? {}
      onDetail?.(detail)
      setOpen(true)
    }
    window.addEventListener(
      PARTNER_FORM_MODAL_OPEN_EVENT,
      handler as EventListener,
    )
    return () =>
      window.removeEventListener(
        PARTNER_FORM_MODAL_OPEN_EVENT,
        handler as EventListener,
      )
  }, [setOpen, onDetail])
}