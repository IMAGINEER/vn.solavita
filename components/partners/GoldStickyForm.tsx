'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronDown, Loader2, X } from 'lucide-react'
import { eventLabel, goldPartnerEvents } from '@/lib/data/partnerEvents'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Sticky quick sign-up for the Gold Partner campaign page.
 *
 * Pinned to the bottom of the viewport while the visitor reads the
 * campaign, and hidden (translated out of view) as soon as the full
 * registration section (#dang-ky) scrolls in — the page should never
 * show two sign-up surfaces at the same time.
 *
 * It is a real form, not a link: name, phone and email are the same
 * three required fields the full form asks for, and it posts to the
 * same `/api/partner` endpoint with `partnerTrack: 'lead-partner'` +
 * `campaign: 'gold-partner'`. The chosen conference id is written on
 * the first line of `message` (the leads table has no event column),
 * exactly like the full form.
 *
 * On phones the card starts collapsed to a single bar — an expanded
 * five-control form would cover a third of the screen — and the
 * chevron opens it. The close button dismisses it for the visit.
 */
export default function GoldStickyForm({
  trackingCode,
}: {
  /**
   * `?lp=…` from the campaign URL, forwarded by the page so a quick
   * sign-up records the same advert code as the full form.
   */
  trackingCode?: string
} = {}) {
  const [atSignup, setAtSignup] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [open, setOpen] = useState(true)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  // Hide the bar when the full form is on screen.
  useEffect(() => {
    const target = document.getElementById('dang-ky')
    if (!target) return
    const observer = new IntersectionObserver(
      ([entry]) => setAtSignup(entry.isIntersecting),
      { threshold: 0.15 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  // Phones get the collapsed bar first; desktop shows the fields.
  useEffect(() => {
    if (window.matchMedia('(max-width: 639px)').matches) setOpen(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const fullName = String(data.get('name') || '').trim()
    const whatsapp = String(data.get('whatsapp') || '').trim()
    const email = String(data.get('email') || '').trim()
    const eventIds = data.getAll('event').map(String)

    if (!fullName || !whatsapp) {
      setError('Vui lòng nhập họ tên và số điện thoại.')
      setStatus('error')
      return
    }
    if (!EMAIL_RE.test(email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.')
      setStatus('error')
      return
    }
    if (eventIds.length === 0) {
      setError('Vui lòng chọn ít nhất một buổi hội nghị.')
      setStatus('error')
      return
    }

    const events = goldPartnerEvents.filter((ev) => eventIds.includes(ev.id))
    const message = [
      events.length
        ? `Hội nghị tham dự: ${events
            .map((ev) => `${eventLabel(ev)} (${ev.id})`)
            .join('; ')}`
        : 'Hội nghị tham dự: chưa chọn',
      trackingCode ? `Mã theo dõi: ${trackingCode}` : '',
      'Nguồn: biểu mẫu nhanh cuối trang',
    ]
      .filter(Boolean)
      .join('\n')

    setStatus('submitting')
    setError(null)

    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          whatsapp,
          email,
          company: '',
          partnerTrack: 'lead-partner',
          campaign: 'gold-partner',
          event: events.map((ev) => ev.id).join(','),
          lp: trackingCode || '',
          message,
        }),
      })
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean
        message?: string
      }
      if (!res.ok || !json.success) {
        setError(json.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
        setStatus('error')
        return
      }
      setStatus('success')
      form.reset()
    } catch {
      setError('Lỗi kết nối mạng. Vui lòng thử lại.')
      setStatus('error')
    }
  }

  if (dismissed) return null

  const inputClass =
    'h-10 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm text-white placeholder:text-white/45 focus:border-[#E8B44A]/60 focus:outline-none [&>option]:bg-white [&>option]:text-[#0A1628]'

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[70] px-3 pb-3 sm:px-4 sm:pb-4 transition-transform duration-300 ${
        atSignup ? 'pointer-events-none translate-y-[120%]' : 'translate-y-0'
      }`}
      aria-hidden={atSignup}
      inert={atSignup}
    >
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#E8B44A]/40 bg-[#0A1628]/95 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <p className="min-w-0 flex-1 truncate text-xs font-cw-bold text-[#F5D48A] sm:text-sm">
            Đăng ký tham dự hội nghị đối tác
          </p>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Thu gọn biểu mẫu' : 'Mở rộng biểu mẫu'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open ? '' : 'rotate-180'}`}
              strokeWidth={2}
            />
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Đóng biểu mẫu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {open &&
          (status === 'success' ? (
            <div className="flex items-center gap-2.5 px-4 pb-3 text-sm text-white/80">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-uk-emerald/15 text-uk-emerald">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              Đã nhận đăng ký — đội ngũ Solavita sẽ gọi lại xác nhận.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="px-4 pb-3"
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Họ tên *"
                  aria-label="Họ tên"
                  className={inputClass}
                />
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  placeholder="Số điện thoại *"
                  aria-label="Số điện thoại"
                  className={inputClass}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email *"
                  aria-label="Email"
                  className={inputClass}
                />
              </div>

              {/* Conference picker — checkbox tiles, not a dropdown;
                  both sessions can be ticked, and at least one is
                  required (validated in handleSubmit). */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-white/50">
                  Tham dự: <span className="text-[#E8B44A]">*</span>
                </span>
                {goldPartnerEvents.map((event) => (
                  <label
                    key={event.id}
                    className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1.5 text-[11px] text-white/70 transition-colors hover:border-[#E8B44A]/50 has-[:checked]:border-[#E8B44A]/70 has-[:checked]:bg-[#E8B44A]/10 has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#E8B44A]/40"
                  >
                    <input
                      type="checkbox"
                      name="event"
                      value={event.id}
                      className="sr-only"
                    />
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded border border-white/30 text-[#0A1628] transition-colors group-has-[:checked]:border-[#E8B44A] group-has-[:checked]:bg-[#E8B44A]">
                      <Check
                        className="h-2.5 w-2.5 opacity-0 group-has-[:checked]:opacity-100"
                        strokeWidth={3}
                      />
                    </span>
                    {eventLabel(event)}
                  </label>
                ))}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="ml-auto inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-5 text-sm font-cw-bold text-[#0A1628] transition-transform hover:scale-[1.02] disabled:opacity-70"
                  style={{
                    background: 'linear-gradient(100deg, #D19B2C 0%, #E8B44A 100%)',
                  }}
                >
                  {status === 'submitting' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Gửi đăng ký'
                  )}
                </button>
              </div>

              {error && (
                <p role="alert" className="mt-2 text-xs text-red-400">
                  {error}
                </p>
              )}
            </form>
          ))}
      </div>
    </div>
  )
}