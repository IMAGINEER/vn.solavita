import * as React from 'react'
import { cn } from '@/lib/utils'

// Shadcn-compatible Input. UK admin uses uk-line borders + uk-navy text
// instead of shadcn's neutral `--border` / `--foreground` so it visually
// matches the rest of the admin shell.
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-uk-line bg-white px-3 py-1 text-sm text-uk-navy shadow-sm transition-colors',
        'placeholder:text-uk-slate/60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uk-teal/40 focus-visible:border-uk-teal',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
})