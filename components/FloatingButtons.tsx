'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun, ArrowUp } from 'lucide-react'

/**
 * Floating action buttons - NG homepage.
 *
 * Original-style structure preserved: theme toggle (dark ↔ light), back-to-top.
 * Language switcher removed - NG homepage is English-only and the
 * balkonkraftwerk paths it gated against don't exist here
 * (lib/bk-lang.ts is also dead in NG).
 *
 * Theme toggle persists to localStorage['theme'] (original key) and toggles
 * `.light-mode` on <body> (original mechanism) - both must stay consistent with
 * the .light-mode CSS overrides in globals.css.
 */
export default function FloatingButtons() {
  // Default to `true` (light) so it matches the SSR-emitted `<html
  // class="light-mode">` in app/layout.tsx. The DOM may still have been
  // swapped to `.dark` by the pre-hydration inline script before
  // hydration if the user prefers dark mode — the useEffect below
  // re-syncs from the live DOM. Reading the DOM inside the lazy
  // initializer would cause a hydration mismatch (server can't read
  // `document`).
  const [isLightMode, setIsLightMode] = useState(true)

  // Source of truth lives on <html> (set pre-hydration by the inline
  // bootstrap script in app/layout.tsx). On mount we just mirror whatever
  // class is currently on <html> so the button icon stays in sync - we
  // never re-add the class here, only toggle.
  //
  // Both `.light-mode` (legacy) and `.dark` (Tailwind v4 standard) classes
  // are managed together - they're mutually exclusive. Light = `.light-mode`
  // on <html>, dark = `.dark` on <html>. The legacy class keeps the existing
  // `.light-mode X` overrides firing; the new class enables `dark:` Tailwind
  // utilities (via the `@custom-variant dark` in globals.css) and the new
  // `.dark X` overrides added at the bottom of globals.css.
  useEffect(() => {
    setIsLightMode(document.documentElement.classList.contains('light-mode'))
  }, [])

  const toggleTheme = () => {
    if (isLightMode) {
      document.documentElement.classList.remove('light-mode')
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsLightMode(false)
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light-mode')
      localStorage.setItem('theme', 'light')
      setIsLightMode(true)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="floating-buttons">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className={`floating-btn ${isLightMode ? 'light-btn' : 'dark-btn'}`}
        title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        aria-label={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {isLightMode ? (
          <Moon size={20} strokeWidth={2} />
        ) : (
          <Sun size={20} strokeWidth={2} />
        )}
      </button>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="floating-btn back-to-top"
        title="Back to Top"
        aria-label="Back to Top"
      >
        <ArrowUp size={20} strokeWidth={2} />
      </button>
    </div>
  )
}
