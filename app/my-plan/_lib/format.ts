/**
 * Locale-aware formatters for `/my-plan` UI.
 *
 * All formatters use `en-GB` so currency and dates look consistent for UK
 * customers regardless of their browser locale. Wrap with `tabular-nums`
 * on the consumer side for stable column widths.
 */

export function formatGBP(value: number): string {
  return '£' + Math.round(value).toLocaleString('en-GB')
}

/**
 * Nigerian Naira formatter. Uses the `en-GB` locale so the thousands
 * grouping matches the existing UK formatters and column widths stay
 * stable. The ₦ symbol is rendered as a non-breaking space + currency
 * mark so it doesn't wrap awkwardly at the line edge.
 */
export function formatNGN(value: number): string {
  if (!Number.isFinite(value)) return '₦0'
  return '₦' + Math.round(value).toLocaleString('en-GB')
}

export function formatKwh(value: number): string {
  return Math.round(value).toLocaleString('en-GB') + ' kWh'
}

export function formatKw(value: number): string {
  return value.toFixed(1) + ' kWp'
}

/**
 * UK-style "31 Aug 2026" date. Falls back gracefully if `Intl` is unavailable.
 */
export function formatDateEnGB(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}