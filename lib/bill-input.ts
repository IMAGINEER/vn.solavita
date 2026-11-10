/**
 * Shared helpers for the "monthly electricity bill" fields.
 *
 * Visitors type the bill in **triệu ₫/tháng** ("2,5" = 2,5 million VND)
 * — the way Vietnamese households actually talk about it ("hóa đơn 3
 * triệu"). Asking for "3.000.000" put a wall of zeros in front of
 * every visitor; the internal value stays in VND, only the input is
 * scaled.
 */

const VN_NUMBER = new Intl.NumberFormat('vi-VN')

/**
 * Normalise what the visitor types into "millions" text: digits only,
 * one decimal separator (always a comma, the Vietnamese convention),
 * at most two decimals.
 */
export function sanitizeMillions(raw: string): string {
  const cleaned = raw.replace(/[^\d.,]/g, '')
  const sep = cleaned.search(/[.,]/)
  if (sep === -1) return cleaned.slice(0, 4)
  const head = cleaned.slice(0, sep).replace(/[.,]/g, '')
  const tail = cleaned
    .slice(sep + 1)
    .replace(/[.,]/g, '')
    .slice(0, 2)
  return `${head},${tail}`.slice(0, 5)
}

/** "2,5" → 2.5 (millions of VND). 0 when the field is empty or invalid. */
export function parseMillions(text: string): number {
  const n = Number(text.replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : 0
}

/** Millions → VND. */
export function millionsToVnd(millions: number): number {
  return millions * 1_000_000
}

/** 2.5 → "2,5" for display. */
export function formatMillions(millions: number): string {
  return VN_NUMBER.format(millions)
}

/** 2_500_000 → "2.500.000" for display. */
export function formatVnd(vnd: number): string {
  return VN_NUMBER.format(vnd)
}
