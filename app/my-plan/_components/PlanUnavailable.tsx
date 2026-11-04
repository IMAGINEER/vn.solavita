'use client'

import { motion } from 'motion/react'
import { Shield, RefreshCw } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { openFormModal } from '@/lib/form-modal'

interface PlanUnavailableProps {
  /**
   * When set, the screen renders a "Try again" affordance and copy that
   * signals a transient error (DB unreachable / network blip) rather than
   * a permanently missing token. When unset, copy assumes the token is
   * invalid and the user should request a new plan.
   */
  onRetry?: () => void
}

/**
 * Fallback screen for `/my-plan` - used in three scenarios:
 *   1. Empty / missing `?id=...` query param (handled by page.tsx).
 *   2. Token returned 404 from `/api/my-plan/[token]` (no row).
 *   3. Token returned 500 (DB unreachable) - when `onRetry` is provided,
 *      copy swaps to a recoverable error message with a retry button.
 *
 * Mirrors the page shell of legal pages so the visual hierarchy stays
 * consistent - the only thing missing is the configuration panel below.
 */
export default function PlanUnavailable({ onRetry }: PlanUnavailableProps = {}) {
  const isError = Boolean(onRetry)

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header logoHref="/" />

      <section className="pt-24 pb-8 lg:pt-32 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Phương án của tôi' },
            ]}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl lg:text-4xl font-cw-bold text-[#0A1628] mt-6 mb-2"
          >
            {isError ? 'Đã xảy ra sự cố khi tải phương án của bạn' : 'Phương án không khả dụng'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="text-sm text-[#4A5568] mb-4"
          >
            {isError
              ? 'Đã xảy ra sự cố mạng hoặc máy chủ khi tải. Vui lòng thử lại sau giây lát.'
              : 'Liên kết bạn truy cập có thể đã hết hạn hoặc không hợp lệ.'}
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-[#0F766E] to-[#10B981] rounded"
          />
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-uk-teal-soft text-uk-teal-dark flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8" strokeWidth={1.75} />
          </div>

          <h2 className="text-3xl md:text-4xl font-cw-bold text-uk-navy mb-4">
            {isError
              ? 'Vui lòng thử lại'
              : 'Chúng tôi không thể tải phương án này'}
          </h2>

          <p className="text-base text-uk-slate leading-relaxed mb-8">
            {isError
              ? 'Nếu tình trạng này tiếp diễn, hãy yêu cầu một phương án cá nhân hóa mới bên dưới.'
              : 'Vui lòng dùng liên kết trong email xác nhận của bạn, hoặc yêu cầu một phương án cá nhân hóa mới — chỉ mất khoảng một phút.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isError && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-uk-line bg-white hover:border-uk-teal hover:text-uk-teal-dark text-uk-navy text-sm font-cw-bold transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <RefreshCw className="w-4 h-4" strokeWidth={1.75} />
                Thử lại
              </button>
            )}
            <button
              type="button"
              onClick={openFormModal}
              className="btn-gradient text-white px-8 py-4 rounded-full font-cw-bold text-base"
            >
              Yêu cầu phương án mới
            </button>
          </div>
        </motion.div>
      </section>

      <Footer variant="dark" />
    </main>
  )
}