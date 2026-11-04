'use client'

import { motion } from 'motion/react'
import { Search } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'

/**
 * Support hero with a search field. The search input is visual-only for
 * now (no backend) - matching the project brief which says search
 * functionality is out of scope.
 */
export default function SupportHero() {
  return (
    <section
      className="hero-banner relative pt-32 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/hero-support.webp)' }}
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
            { label: 'Trang chủ', href: '/' },
            { label: 'Hỗ trợ' },
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
            Hỗ trợ khách hàng tại Việt Nam
          </span>
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-cw-bold leading-tight text-white mt-5 max-w-3xl capitalize"
        >
          Hôm nay chúng tôi có thể{' '}
          <span className="text-gradient">giúp gì cho bạn?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="mt-5 text-lg sm:text-xl text-white/85 font-cw-light max-w-2xl leading-relaxed"
        >
          Tra cứu hướng dẫn, tải tài liệu hoặc liên hệ với đội ngũ hỗ trợ
          tại Việt Nam. Chúng tôi đồng hành cùng hệ thống của bạn trong
          suốt vòng đời sử dụng.
        </motion.p>

        {/* Visual-only search field - backend wired later. */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 flex items-center max-w-2xl bg-white rounded-full border border-white/40 shadow-lg overflow-hidden"
          role="search"
        >
          <Search className="w-5 h-5 text-uk-slate ml-5 flex-shrink-0" strokeWidth={1.6} />
          <input
            type="search"
            placeholder="Tìm kiếm hướng dẫn, mã lỗi, tài liệu tải về..."
            className="flex-1 px-4 py-4 bg-transparent text-uk-navy placeholder:text-uk-slate focus:outline-none"
          />
          <button
            type="submit"
            className="btn-gradient px-6 py-3 m-1.5 rounded-full font-cw-bold text-sm text-white"
          >
            Tìm kiếm
          </button>
        </motion.form>
      </div>
    </section>
  )
}
