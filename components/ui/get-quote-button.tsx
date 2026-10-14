'use client'

import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * GetQuoteButton — the "Get a Quote" CTA used across the site.
 *
 * Visual treatment:
 *   - Default: text + a small ArrowUpRight icon at the right
 *   - Hover: icon rotates 90° to point right (→)
 *   - Transition: 300 ms ease
 *
 * Variants mirror the original btn-gradient + outlined secondary pattern
 * used elsewhere on the site.
 */

export interface GetQuoteButtonProps {
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary'
  children?: ReactNode
  className?: string
}

export default function GetQuoteButton({
  onClick,
  href,
  variant = 'primary',
  children = 'Get a Quote',
  className = '',
}: GetQuoteButtonProps) {
  const baseCls =
    'group inline-flex items-center justify-center gap-2 rounded-full text-sm font-cw-bold leading-none transition-all duration-300 px-6 py-3'
  const variantCls =
    variant === 'primary'
      ? 'btn-gradient text-white'
      : 'border border-uk-teal text-uk-teal hover:bg-uk-teal hover:text-white'
  const cls = `${baseCls} ${variantCls} ${className}`.trim()

  const inner = (
    <>
      <span>{children}</span>
      <ArrowUpRight
        className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45"
        strokeWidth={2.5}
      />
    </>
  )

  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}
