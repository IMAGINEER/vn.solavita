import * as React from 'react'
import { cn } from '@/lib/utils'

// Shadcn-compatible Textarea. Same UK palette as Input so the blog
// editor and admin forms blend in. The `min-h-*` defaults to ~120px
// but callers usually pass an override (the editor passes h-[60vh]).

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[120px] w-full rounded-md border border-uk-line bg-white px-3 py-2 text-sm text-uk-navy shadow-sm transition-colors',
        'placeholder:text-uk-slate/60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uk-teal/40 focus-visible:border-uk-teal',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'font-mono leading-relaxed',
        className,
      )}
      {...props}
    />
  )
})
