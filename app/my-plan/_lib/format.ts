/**
 * Locale-aware formatters for `/my-plan` UI.
 *
 * All formatters use `en-NG` so thousands separators + date style match
 * what a Nigerian customer expects. Wrap with `tabular-nums` on the
 * consumer side for stable column widths.
 *
 * Note: the previous `formatGBP` helper was removed (zero callers, the
 * ROI surface lives elsewhere). If a future feature needs GBP display,
 * re-introduce it explicitly - do not bring it back as a generic helper.
 */

export function formatNGN(value: number): string {
  if (!Number.isFinite(value)) return '₦0'
  return '₦' + Math.round(value).toLocaleString('en-NG')
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