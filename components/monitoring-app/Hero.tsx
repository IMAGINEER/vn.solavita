'use client'

import { motion } from 'motion/react'
import Breadcrumb from '@/components/Breadcrumb'
import { monitoringAppIntro } from '@/lib/data/monitoring-app'

/**
 * Monitoring App hero — light theme.
 *
 * Mirrors the visual rhythm of `<SolutionsHero>` (full-bleed, eyebrow
 * pill + heading + body, soft surface that flows into the next white
 * section). Uses `banner_uk.webp` with a left-to-right LIGHT overlay
 * so the navy headline stays legible while the page stays in the same
 * teal-leaning palette as `/solutions`.
 */
export default function MonitoringAppHero() {
  return (
    <section
      className="hero-banner relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/hero-monitoring-app.webp)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.65) 35%, rgba(15,23,42,0.25) 60%, rgba(15,23,42,0) 80%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Breadcrumb
          theme="light"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Monitoring App' },
          ]}
        />

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mt-6"
        >
          <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
          <span className="text-xs font-cw-regular text-white/90">
            {monitoringAppIntro.eyebrow}
          </span>
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-cw-bold leading-tight text-white mt-5 max-w-3xl capitalize"
        >
          {monitoringAppIntro.title}{' '}
          <span className="text-gradient">{monitoringAppIntro.titleHighlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="mt-5 text-lg sm:text-xl text-white/85 font-cw-light max-w-2xl leading-relaxed"
        >
          {monitoringAppIntro.body}
        </motion.p>
      </div>
    </section>
  )
}