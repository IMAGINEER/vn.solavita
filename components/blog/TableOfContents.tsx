'use client'

import { useEffect, useRef, useState } from 'react'
import type { Heading } from '@/lib/blog-toc'

// Right-rail sticky table-of-contents for blog post detail pages.
//
// Receives the headings list extracted from the post's markdown (see
// `lib/blog-toc.ts`) and renders anchor links. An IntersectionObserver
// watches each heading element and highlights whichever one is closest
// to the top of the viewport. Clicking a link smooth-scrolls to the
// target and updates the URL hash without a full navigation.
//
// The list itself is vertically constrained to the viewport (sticky
// aside top + "Mục lục" label + breathing room) and scrolls
// internally. When scroll-spy picks an active item that's outside the
// visible portion of the TOC, the list auto-scrolls to bring it into
// view - users always see what's currently highlighted, even on long
// articles where many sections stack up.
//
// Returns null when the post has no headings - saves the sticky rail
// from being a useless empty box on short posts.

export interface TableOfContentsProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (headings.length === 0) return

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // Pick the topmost intersecting heading. `rootMargin` shrinks the
    // observation box so a heading becomes "active" only once it has
    // cleared the sticky header (~80px) and reaches the upper third
    // of the viewport. When the user is above the first real heading
    // (e.g. on the H1 hero), default to the first TOC entry so it
    // shows as active on initial load.
    const observer = new IntersectionObserver(
      () => {
        const above = elements
          .map((el) => ({ id: el.id, top: el.getBoundingClientRect().top }))
          .filter((p) => p.top < 120)
          .sort((a, b) => b.top - a.top)[0]
        if (above) {
          setActiveId(above.id)
        } else {
          setActiveId(headings[0]?.id ?? null)
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: [0, 1],
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  // Auto-scroll the TOC list itself when the active item drifts out of
  // the visible portion of the list (long articles stack many entries;
  // without this the highlight is invisible whenever the user is
  // reading a section far from the list's scroll position). The page
  // itself is NOT scrolled - only the TOC list - so the reader's
  // position on the article never jumps.
  useEffect(() => {
    const list = listRef.current
    if (!list || !activeId) return

    const itemEl = list.querySelector<HTMLLIElement>(
      `li[data-toc-id="${CSS.escape(activeId)}"]`,
    )
    if (!itemEl) return

    const itemRect = itemEl.getBoundingClientRect()
    const containerRect = list.getBoundingClientRect()
    const itemTop = itemRect.top - containerRect.top + list.scrollTop
    const itemBottom = itemTop + itemRect.height
    const viewTop = list.scrollTop
    const viewBottom = viewTop + list.clientHeight
    const margin = 8

    if (itemTop < viewTop) {
      list.scrollTo({ top: itemTop - margin, behavior: 'smooth' })
    } else if (itemBottom > viewBottom) {
      list.scrollTo({
        top: itemBottom - list.clientHeight + margin,
        behavior: 'smooth',
      })
    }
  }, [activeId])

  if (headings.length === 0) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    e.preventDefault()
    if (!el) {
      // No matching element (defensive - shouldn't fire now that the
      // synthetic H1 entry has a real `id="article-top"` target in
      // BlogHero). Fall back to scrolling to the very top.
      window.scrollTo({ top: 0, behavior: 'smooth' })
      history.replaceState(null, '', `#${id}`)
      setActiveId(id)
      return
    }
    const offset = 80
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth',
    })
    history.replaceState(null, '', `#${id}`)
    setActiveId(id)
  }

  return (
    <nav aria-label="Mục lục" className="hidden lg:block text-sm">
      <h3 className="text-xs font-cw-bold uppercase tracking-[0.18em] text-uk-slate mb-3">
        Mục lục
      </h3>
      <ul
        ref={listRef}
        className="toc-list space-y-2 border-l border-uk-line max-h-[calc(100vh-8rem)] overflow-y-auto pr-2"
        style={{ scrollbarWidth: 'none' as const }}
      >
        {headings.map((h) => {
          const isActive = activeId === h.id
          return (
            <li
              key={h.id}
              data-toc-id={h.id}
              className="pl-3"
            >
              <a
                href={`#${h.id}`}
                onClick={(e) => handleClick(e, h.id)}
                className={[
                  'block border-l-2 -ml-px py-1 transition-colors leading-snug',
                  isActive
                    ? 'border-uk-teal text-uk-teal-dark font-cw-bold'
                    : 'border-transparent text-uk-slate hover:text-uk-navy hover:border-uk-line font-cw-regular',
                ].join(' ')}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}