import * as React from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'default' | 'outline' | 'success' | 'muted'

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-uk-teal-dark text-white border-transparent',
  outline: 'bg-white text-uk-teal-dark border-uk-teal/40',
  success: 'bg-emerald-100 text-emerald-700 border-transparent',
  muted: 'bg-uk-line/40 text-uk-slate border-transparent',
}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-cw-bold tracking-wider uppercase whitespace-nowrap',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  )
}