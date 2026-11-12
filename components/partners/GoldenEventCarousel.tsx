'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * "Nhìn lại hội nghị đối tác" photo strip for the Gold Partner
 * campaign page.
 *
 * The photos live in /public/images/partner/golden, re-encoded from
 * the original JPEGs to WebP at 1200 px wide (quality 76) — roughly
 * 1.2 MB for all twelve instead of ~3 MB. The originals stay in
 * docs/assets/partner-golden-originals/ (not shipped) if a different
 * crop is ever needed.
 *
 * Framing: every card is 16:9. Landscape sources fill the card with
 * object-cover (cropped, never stretched). The two portrait sources
 * (810×1080, event-10/11) switch to object-contain on the dark card
 * background, so they sit whole and centred in the 16:9 frame instead
 * of being blown up or cropped down to a sliver.
 *
 * Autoplay advances one card every four seconds and loops, but only
 * while the strip is in view and the visitor is not interacting with
 * it. Hovering, focusing the arrows or the track, or the OS
 * reduced-motion setting all stop it — autoplay should never fight
 * someone who is looking at a particular photo.
 *
 * No carousel library: a native overflow-x track with CSS
 * scroll-snap keeps swipe / trackpad / keyboard scrolling working for
 * free, and the arrows only call scrollTo() on that track. Captions
 * are intentionally generic — the page does not claim an event name,
 * date or venue for these photographs.
 */

const PORTRAIT = new Set([10, 11])

const PHOTOS = Array.from({ length: 12 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return {
    src: `/images/partner/golden/event-${n}.webp`,
    alt: `Hình ảnh hội nghị đối tác Solavita — ảnh ${i + 1}`,
    portrait: PORTRAIT.has(i + 1),
  }
})

const AUTOPLAY_MS = 4000

export default function GoldenEventCarousel() {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const cardLeft = useCallback((track: HTMLDivElement, card: HTMLElement) => {
    return (
      card.getBoundingClientRect().left -
      track.getBoundingClientRect().left +
      track.scrollLeft
    )
  }, [])

  const scrollToCard = useCallback(
    (i: number) => {
      const track = trackRef.current
      if (!track) return
      const card = track.children[i] as HTMLElement | undefined
      if (!card) return
      track.scrollTo({
        left: cardLeft(track, card),
        behavior: reducedMotion ? 'auto' : 'smooth',
      })
      setIndex(i)
    },
    [cardLeft, reducedMotion]
  )

  // Keep the counter in sync when the visitor swipes or scrolls the
  // track directly, so the arrows and autoplay continue from what is
  // actually on screen.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cards = Array.from(track.children) as HTMLElement[]

    const onScroll = () => {
      let nearest = 0
      let best = Infinity
      cards.forEach((card, i) => {
        const distance = Math.abs(cardLeft(track, card) - track.scrollLeft)
        if (distance < best) {
          best = distance
          nearest = i
        }
      })
      setIndex(nearest)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [cardLeft])

  // Autoplay only while the strip is on screen and untouched; any
  // index change (manual or automatic) restarts the timer.
  useEffect(() => {
    if (reducedMotion || paused || !inView) return
    const id = window.setInterval(() => {
      scrollToCard(index === PHOTOS.length - 1 ? 0 : index + 1)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [index, paused, inView, reducedMotion, scrollToCard])

  useEffect(() => {
    setReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )

    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const step = (dir: 1 | -1) => {
    scrollToCard(Math.min(PHOTOS.length - 1, Math.max(0, index + dir)))
  }

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 mb-4">
        <h3 className="text-sm md:text-base font-cw-bold text-[#F5D48A]">
          Nhìn lại hội nghị đối tác
        </h3>

        <div className="flex items-center gap-3">
          <span className="text-xs font-cw-bold text-white/50 tabular-nums">
            {String(index + 1).padStart(2, '0')} / {PHOTOS.length}
          </span>
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={index === 0}
            aria-label="Ảnh trước"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#E8B44A]/50 hover:text-[#F5D48A] disabled:opacity-35 disabled:hover:border-white/15 disabled:hover:text-white/80"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={index === PHOTOS.length - 1}
            aria-label="Ảnh tiếp theo"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#E8B44A]/50 hover:text-[#F5D48A] disabled:opacity-35 disabled:hover:border-white/15 disabled:hover:text-white/80"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Native scroll track: swipe, trackpad, keyboard and the arrow
          buttons all move the same element. `.no-scrollbar` (defined
          in globals.css) removes the scrollbar itself in every
          engine — the page's global `::-webkit-scrollbar` rule would
          otherwise paint an 8 px gradient bar under the strip. */}
      <div
        ref={trackRef}
        role="region"
        aria-label="Hình ảnh hội nghị đối tác"
        tabIndex={0}
        className="no-scrollbar flex gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth outline-none focus-visible:ring-2 focus-visible:ring-[#E8B44A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1628]"
      >
        {PHOTOS.map((photo) => (
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={1200}
            height={675}
            loading="lazy"
            decoding="async"
            className={`snap-start shrink-0 w-[84%] sm:w-[58%] lg:w-[36%] aspect-video rounded-2xl border border-white/10 object-center ${
              photo.portrait ? 'object-contain bg-black/40' : 'object-cover'
            }`}
          />
        ))}
      </div>
    </div>
  )
}