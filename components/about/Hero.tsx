'use client'

import { motion } from 'motion/react'
import Breadcrumb from '@/components/Breadcrumb'

/**
 * About hero - same banner image and overlay treatment as the rest of
 * the inner-page heroes so the top-level navigation feels unified.
 *
 * Copy is NG-shaped. Manufacturing origin is SKYWORTH Group's
 * Shenzhen / China factory line (verifiable from public sources);
 * the local last-mile layer is the local warehouse + installer
 * network that delivers the kit and handles after-sales.
 * [TBD]: the specific warehouse city(ies), installer
 * coverage areas, and "TBD — Verified local warehouse and
 * service network" line on a final pass once business confirms.
 */
export default function AboutHero() {
  return (
    <section
      className="hero-banner relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/hero-about.webp)' }}
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
            { label: 'About Us' },
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
            Our local launch
          </span>
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-cw-bold leading-tight text-white mt-5 max-w-3xl capitalize"
        >
          Made in our factory line.
          <br />
          <span className="text-gradient">Stocked locally.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="mt-5 text-lg sm:text-xl text-white/85 font-cw-light max-w-2xl leading-relaxed"
        >
          Solavita is the residential solar brand of the
          SKYWORTH Group — solar and battery systems built on the
          group's Chinese manufacturing line and held in a local
          warehouse, so installation is two weeks from
          signed contract to commissioned power.{' '}
          <span className="text-red-300/90 font-cw-bold">
            TBD — Verified local warehouse location and installer coverage areas.
          </span>
        </motion.p>
      </div>
    </section>
  )
}
