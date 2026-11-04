'use client'

import { motion } from 'motion/react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /**
   * Colour theme.
   *   - 'dark' (default): dark navy text on light backgrounds
   *     (existing Privacy / Terms pages).
   *   - 'light': white / translucent text for use on dark banner
   *     heroes (Solutions / Cases / About Us / Support / For Partners).
   */
  theme?: 'dark' | 'light'
}

export default function Breadcrumb({ items, theme = 'dark' }: BreadcrumbProps) {
  const isLight = theme === 'light'
  // Theme-aware palette. `light` uses white at varying opacities so it
  // reads against the dark banner image + overlay without competing
  // with the heading.
  const baseText = isLight ? 'text-white/70' : 'text-[#4A5568]'
  const hoverText = isLight ? 'hover:text-white' : 'hover:text-[#0A1628]'
  const lastText = isLight
    ? 'text-white font-cw-bold'
    : 'text-[#0A1628] font-cw-bold'
  const sepText = isLight ? 'text-white/40' : 'text-[#9CA3AF]'

  return (
    <nav className="hidden lg:block" aria-label="Đường dẫn">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex items-center gap-2 text-sm"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <div key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className={`${baseText} ${hoverText} transition-colors duration-300`}
                >
                  {item.label}
                </a>
              ) : (
                <span className={isLast ? lastText : baseText}>
                  {item.label}
                </span>
              )}
              {!isLast && <span className={sepText}>/</span>}
            </div>
          )
        })}
      </motion.div>
    </nav>
  )
}
