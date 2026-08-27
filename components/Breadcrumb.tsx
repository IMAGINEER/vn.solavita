'use client'

import { motion } from 'motion/react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="hidden lg:block" aria-label="Breadcrumb">
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
                  className="text-[#4A5568] hover:text-[#0A1628] transition-colors duration-300"
                >
                  {item.label}
                </a>
              ) : (
                <span className={isLast ? 'text-[#0A1628] font-cw-bold' : 'text-[#4A5568]'}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-[#9CA3AF]">/</span>
              )}
            </div>
          )
        })}
      </motion.div>
    </nav>
  )
}