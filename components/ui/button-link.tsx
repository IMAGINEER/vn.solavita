import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Link styled as a Button. The Button primitive in this project is a
// pure <button> element (no radix Slot, no asChild), so callers that
// want a navigation action use ButtonLink with the same variant / size
// tokens - kept in lock-step with components/ui/button.tsx.

type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'

type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  default:
    'bg-uk-teal-dark text-white hover:bg-uk-teal-dark/90 shadow-sm',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  outline:
    'border border-uk-line bg-white text-uk-navy hover:bg-uk-teal-soft hover:text-uk-teal-dark hover:border-uk-teal/40 shadow-sm',
  secondary:
    'bg-uk-teal-soft text-uk-teal-dark hover:bg-uk-teal-soft/80',
  ghost:
    'text-uk-navy hover:bg-uk-teal-soft hover:text-uk-teal-dark',
  link:
    'text-uk-teal-dark underline-offset-4 hover:underline',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  default: 'h-9 px-4 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-10 px-6 text-base',
  icon: 'h-9 w-9',
}

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-md font-cw-bold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uk-teal/40 disabled:pointer-events-none disabled:opacity-50'

export interface ButtonLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  /** Open in a new tab. */
  external?: boolean
}

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    { className, variant = 'default', size = 'default', href, external, ...props },
    ref,
  ) {
    if (external) {
      return (
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            BASE_CLASSES,
            VARIANT_CLASSES[variant],
            SIZE_CLASSES[size],
            className,
          )}
          {...props}
        />
      )
    }
    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          BASE_CLASSES,
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        {...props}
      />
    )
  },
)
