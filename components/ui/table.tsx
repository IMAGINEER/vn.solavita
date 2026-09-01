import * as React from 'react'
import { cn } from '@/lib/utils'

// Shadcn-compatible Table primitives. UK admin uses uk-line borders +
// uk-teal-soft accent so it visually matches the admin shell.

export const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(function Table({ className, ...props }, ref) {
  return (
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  )
})

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableHeader({ className, ...props }, ref) {
  return (
    <thead
      ref={ref}
      className={cn('bg-uk-teal-soft/40 border-b border-uk-line', className)}
      {...props}
    />
  )
})

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, ...props }, ref) {
  return (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
})

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(function TableRow({ className, ...props }, ref) {
  return (
    <tr
      ref={ref}
      className={cn(
        'border-b border-uk-line transition-colors hover:bg-uk-teal-soft/30 data-[state=selected]:bg-uk-teal-soft',
        className,
      )}
      {...props}
    />
  )
})

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(function TableHead({ className, ...props }, ref) {
  return (
    <th
      ref={ref}
      className={cn(
        'h-10 px-4 text-left align-middle font-cw-bold text-uk-slate text-xs uppercase tracking-wider',
        className,
      )}
      {...props}
    />
  )
})

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(function TableCell({ className, ...props }, ref) {
  return (
    <td
      ref={ref}
      className={cn('p-4 align-middle text-uk-navy', className)}
      {...props}
    />
  )
})