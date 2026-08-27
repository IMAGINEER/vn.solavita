'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import Form from '@/components/Form'

interface FormModalProps {
  open: boolean
  onClose: () => void
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
 */
export default function FormModal({ open, onClose }: FormModalProps) {
  const [mounted, setMounted] = useState(false)

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

        <Form onSuccess={onClose} onClose={onClose} />
      </div>
    </div>,
    document.body
  )
}
