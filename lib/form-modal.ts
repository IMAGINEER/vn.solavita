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
 */

export const FORM_MODAL_OPEN_EVENT = 'solavita:open-form-modal'

export const openFormModal = (): void => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(FORM_MODAL_OPEN_EVENT))
}
