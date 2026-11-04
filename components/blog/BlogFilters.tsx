'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import type { BlogCategory } from '@/lib/types/blog'

// Client-side category filter chips. Updates ?category= in the URL so
// the page can be statically rendered server-side (good for SEO)
// while still letting users toggle filters without a hard navigation.

export interface BlogFiltersProps {
  categories: BlogCategory[]
  activeSlug?: string
}

export function BlogFilters({ categories, activeSlug }: BlogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  const go = useCallback(
    (slug?: string) => {
      const params = new URLSearchParams()
      if (slug) params.set('category', slug)
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [router, pathname],
  )

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <button
        type="button"
        onClick={() => go(undefined)}
        className={`inline-flex items-center px-4 h-9 text-sm font-cw-bold rounded-full border transition-colors ${
          !activeSlug
            ? 'bg-uk-teal-dark text-white border-uk-teal-dark'
            : 'bg-white text-uk-slate border-uk-line hover:bg-uk-teal-soft hover:text-uk-teal-dark'
        }`}
      >
        Tất cả danh mục
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => go(c.slug)}
          className={`inline-flex items-center px-4 h-9 text-sm font-cw-bold rounded-full border transition-colors ${
            activeSlug === c.slug
              ? 'bg-uk-teal-dark text-white border-uk-teal-dark'
              : 'bg-white text-uk-slate border-uk-line hover:bg-uk-teal-soft hover:text-uk-teal-dark'
          }`}
        >
          {c.name_en}
        </button>
      ))}
    </div>
  )
}