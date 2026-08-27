// Three-language (DE/EN/CHS) detection + storage helpers for the
// balkonkraftwerk landing pages. Pure client-side: relies on
// navigator.language and localStorage (no server involvement).

export type BkLang = 'de' | 'en' | 'chs'

export const BK_LANG_KEY = 'bk_lang' // explicitly chosen language
export const BK_LANG_DISMISS_KEY = 'bk_lang_dismiss' // suggestion bar dismissed

const BK_PATHS: Record<BkLang, string> = {
  de: '/balkonkraftwerk',
  en: '/balkonkraftwerk/en',
  chs: '/balkonkraftwerk/chs',
}

/** Current page language derived from the pathname. */
export function langFromPath(pathname: string): BkLang {
  if (pathname.startsWith('/balkonkraftwerk/chs')) return 'chs'
  if (pathname.startsWith('/balkonkraftwerk/en')) return 'en'
  return 'de'
}

/** Canonical URL for a language on the balkonkraftwerk pages. */
export function langToPath(lang: BkLang): string {
  return BK_PATHS[lang]
}

/**
 * Browser-language-based preference. zh* → CHS, en* → EN, otherwise DE
 * (German is the target-market default). Reads the first strong signal.
 */
export function detectPreferredLang(): BkLang {
  if (typeof navigator === 'undefined') return 'de'
  const langs = (navigator.languages?.length ? navigator.languages : [navigator.language]) || []
  for (const raw of langs) {
    const l = (raw || '').toLowerCase()
    if (l.startsWith('zh')) return 'chs'
    if (l.startsWith('en')) return 'en'
  }
  return 'de'
}

export function langLabel(lang: BkLang): string {
  return lang === 'de' ? 'Deutsch' : lang === 'en' ? 'English' : '中文'
}

/** Short display token for the floating button (DE / EN / 中). */
export function langShortLabel(lang: BkLang): string {
  return lang === 'de' ? 'DE' : lang === 'en' ? 'EN' : '中'
}

export function readStoredLang(): BkLang | null {
  if (typeof window === 'undefined') return null
  const v = window.localStorage.getItem(BK_LANG_KEY)
  return v === 'de' || v === 'en' || v === 'chs' ? v : null
}

export function storeLang(lang: BkLang): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(BK_LANG_KEY, lang)
}

export function readDismissed(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(BK_LANG_DISMISS_KEY) === '1'
}

export function storeDismissed(): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(BK_LANG_DISMISS_KEY, '1')
}

/**
 * Whether to show the suggestion bar: the browser's preferred language
 * differs from the page's language, the bar hasn't been dismissed, and the
 * browser signal is a strong one (explicit zh / en), so we don't nag users
 * whose browser is already in the page's language.
 */
export function shouldShowSuggestion(current: BkLang): boolean {
  if (readDismissed()) return false
  const preferred = detectPreferredLang()
  if (preferred === current) return false
  // Only propose a switch for a clear non-German preference.
  return preferred === 'en' || preferred === 'chs'
}
