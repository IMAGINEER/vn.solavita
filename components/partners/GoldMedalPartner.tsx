'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  BadgeCheck,
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  Coins,
  Crown,
  FileText,
  GraduationCap,
  Handshake,
  Package,
  Phone,
  Ruler,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react'
import {
  goldMedalCommissionRoles,
  goldMedalProgram,
  goldMedalPromise,
  PARTNER_CONTACT,
  PARTNER_HOTLINE,
  PARTNER_REFERENCE_SYSTEM_KW,
} from '@/lib/data/partners'
import Breadcrumb from '@/components/Breadcrumb'
import GoldMedalSignup from './GoldMedalSignup'
import GoldenEventCarousel from './GoldenEventCarousel'
import GoldEventPreview from './GoldEventPreview'

gsap.registerPlugin(ScrollTrigger)

const GOLD = '#E8B44A'
const GOLD_SOFT = '#F5D48A'

const perkIcons = {
  wallet: Wallet,
  package: Package,
  trending: TrendingUp,
  graduation: GraduationCap,
} as const

/** One icon per step of the 7-step customer journey. */
const JOURNEY_ICONS = [
  UserRound,
  FileText,
  Handshake,
  Package,
  Ruler,
  ClipboardCheck,
  Coins,
] as const

/**
 * "Chương trình Đối tác Vàng" — the flagship recruitment campaign
 * transcribed from the 80x180cm roll-up standee
 * (`docs/越南金牌商务合伙人 展架80x180cm 20260920(2).pdf`).
 *
 * This is the body of the standalone campaign page
 * (`/for-partners/gold-partner/`). The upper block is deliberately
 * dark + gold while the rest of the site is light + teal: the
 * campaign is a capped, time-boxed intake ("50 suất") and should read
 * as its own event rather than another paragraph of the partner pitch.
 * The registration block sits on a light section below it so the form
 * fields stay white.
 *
 * Order follows the standee: promise → numbers → who we want / what
 * you should already have → four core advantages → how a customer
 * order travels → what is included → registration.
 */
export default function GoldMedalPartner({
  showBreadcrumb = true,
  trackingCode,
}: {
  /**
   * The breadcrumb belongs to the hero, not to a strip of its own — but
   * it is dropped on campaign URLs that carry tracking parameters
   * (?lp=fb, ?utm_…), because those land straight from an advert and
   * the trail tells the visitor nothing.
   */
  showBreadcrumb?: boolean
  /**
   * The `?lp=` tracking code from the campaign URL, forwarded to the
   * sign-up form so every lead records which advert brought it in.
   */
  trackingCode?: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gold-stat-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )
      gsap.fromTo(
        '.gold-reveal',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
      // The form block lives in a second section, so it needs its own
      // trigger — otherwise it would already be "revealed" when the
      // dark block above scrolls into view.
      gsap.fromTo(
        formRef.current?.querySelectorAll('.gold-reveal') ?? [],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 85%' },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────
          The photo carries the campaign: the house sits on the right,
          the copy on the dark left. The scrim keeps the text legible
          without hiding the picture. */}
      <section
        className="relative overflow-hidden bg-cover bg-[position:center] lg:bg-[position:right_center]"
        style={{ backgroundImage: 'url(/images/partner/gold-hero.webp)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(10,22,40,0.97) 0%, rgba(10,22,40,0.9) 40%, rgba(10,22,40,0.6) 64%, rgba(10,22,40,0.22) 100%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 lg:pt-8 lg:pb-28">
          {/* This campaign page is a standalone landing page — no site
              header — so the SKYWORTH wordmark lives at the hero's
              top-left, above the breadcrumb, and still links home. The
              supplied SVG is brand blue (#0063B2); `brightness-0
              invert` forces it to pure white so it reads on the dark
              photo scrim.

              The campaign tag sits on the same top row, flush right
              with the wordmark, so the hero opens with a single brand
              line: logo left, "Chương trình Đối tác Vàng" right. When
              the row is too narrow (small phones) it wraps and the tag
              drops onto its own line, still right-aligned. */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <a href="/" aria-label="SKYWORTH" className="inline-block">
              <img
                src="/images/LOGOlan-skyworth.svg"
                alt="SKYWORTH"
                className="h-7 w-auto brightness-0 invert sm:h-8"
              />
            </a>
            <span className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8B44A]/30 bg-[#E8B44A]/10 text-xs font-cw-bold uppercase tracking-wider text-[#F5D48A]">
              <Crown className="w-4 h-4" strokeWidth={1.8} />
              {goldMedalProgram.name}
            </span>
          </div>

          {/* Breadcrumb — inside the hero, not on a strip of its own. */}
          {showBreadcrumb && (
            <div className="mb-8">
              <Breadcrumb
                theme="light"
                items={[
                  { label: 'Trang chủ', href: '/' },
                  { label: 'Dành cho đối tác', href: '/for-partners/' },
                  { label: 'Chương trình Đối tác Vàng' },
                ]}
              />
            </div>
          )}

          {/* ── Header ───────────────────────────────────────────── */}
          {/* Left-aligned to the same gutter as the wordmark and the
              breadcrumb above, with a deliberate gap (mt-12 / lg:mt-20)
              so the copy block reads as a separate block from the top
              row rather than sticking to it. */}
          <div className="max-w-3xl text-left mt-12 lg:mt-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-cw-bold text-white leading-tight">
            {goldMedalProgram.subtitleLead}{' '}
            <span style={{ color: GOLD }}>{goldMedalProgram.subtitleHighlight}</span>
          </h1>

          {/* Four-word rhythm printed at the top of the standee */}
          <div className="mt-6 flex flex-wrap items-center justify-start gap-x-3 gap-y-2 text-sm md:text-base font-cw-bold">
            {goldMedalProgram.pillars.map((p, i) => (
              <span key={p} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8B44A]/60" aria-hidden="true" />
                )}
                <span className="text-white/90">{p}</span>
              </span>
            ))}
          </div>

          <p className="mt-6 text-base md:text-lg text-white/70 font-cw-light leading-relaxed">
            {goldMedalPromise.journey}. {goldMedalProgram.subtitle} — chỉ{' '}
            <span className="font-cw-bold text-[#F5D48A]">
              {goldMedalProgram.slots} suất
            </span>{' '}
            cho đợt tuyển chọn này.
          </p>

          {/* ── This month's conferences + hero CTA ──────────────
              Two sessions in November 2026, then the CTA that takes
              the visitor to the sign-up form. Data and its TBDs live
              in lib/data/partnerEvents.ts. */}
          <GoldEventPreview />
          </div>
        </div>

        {/* Fade into the dark panel below. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0A1628]" />
      </section>

      {/* ── Dark campaign panel ─────────────────────────────────── */}
      <section
        ref={sectionRef}
        id="doi-tac-vang"
        className="relative overflow-hidden bg-[#0A1628] pt-6 pb-16 md:pb-24"
      >
        {/* Gold glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-[#E8B44A]/10 blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[460px] h-[460px] rounded-full bg-[#00B9EE]/10 blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Headline numbers ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 md:mb-16">
          {goldMedalProgram.stats.map((s) => (
            <div
              key={s.label}
              className="gold-stat-card rounded-2xl border border-[#E8B44A]/25 bg-white/[0.04] p-6 backdrop-blur-sm"
            >
              <div
                className="text-3xl md:text-4xl font-cw-bold leading-none"
                style={{ color: GOLD_SOFT }}
              >
                {s.value}
              </div>
              <div className="mt-3 text-sm font-cw-bold text-white/90 leading-snug">
                {s.label}
              </div>
              <p className="mt-2 text-xs text-white/55 font-cw-regular leading-relaxed">
                {s.detail}
              </p>
            </div>
          ))}
        </div>

        {/* ── Who we want / what you already have ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 md:mb-16">
          <div className="gold-reveal relative isolate overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-9">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] via-[#0A1628]/88 to-[#0A1628]/40" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 shrink-0 rounded-xl bg-[#E8B44A]/15 flex items-center justify-center">
                  <Target className="w-5 h-5" style={{ color: GOLD }} strokeWidth={1.8} />
                </span>
                <h3 className="text-xl font-cw-bold text-white leading-snug">
                  Chúng tôi đang tìm kiếm
                </h3>
              </div>

              {/* The two Solavita staff — floated, so the list wraps
                  around them: the heading and the first lines keep the
                  full card width, only the lines beside the figures
                  shorten. `shape-outside` follows the PNG's alpha so
                  the copy skirts their outlines rather than their
                  bounding box. Multiply drops the transparency
                  checkerboard baked into the PNG. */}
              <img
                src="/images/partner/avartar.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="float-right ml-6 mb-4 w-[42%] sm:w-[46%] h-auto mix-blend-multiply pointer-events-none max-sm:float-none max-sm:mx-auto max-sm:ml-0 max-sm:mb-5 max-sm:w-[62%]"
                style={{
                  shapeOutside: 'url("/images/partner/avartar.png")',
                  shapeMargin: '10px',
                }}
              />

              {/* Not flex: a flex item cannot wrap its lines around a
                  float. The check sits absolutely so the text block
                  stays a normal block box. */}
              <ul className="space-y-3.5">
                {goldMedalProgram.lookingFor.map((item) => (
                  <li
                    key={item}
                    className="relative pl-7 text-sm md:text-base text-white/80 font-cw-regular leading-relaxed"
                  >
                    <Check
                      className="absolute left-0 top-1 w-4 h-4"
                      style={{ color: GOLD }}
                      strokeWidth={2.5}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="gold-reveal rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-9">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 rounded-xl bg-[#00B9EE]/15 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#00B9EE]" strokeWidth={1.8} />
              </span>
              <h3 className="text-xl font-cw-bold text-white">
                Nếu bạn có
              </h3>
            </div>
            <ul className="space-y-3.5">
              {goldMedalProgram.ifYouHave.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm md:text-base text-white/80 font-cw-regular leading-relaxed"
                >
                  <Check
                    className="w-4 h-4 mt-1 flex-shrink-0 text-[#00B9EE]"
                    strokeWidth={2.5}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Four core advantages ────────────────────────────── */}
        <div className="mb-12 md:mb-16">
          <h3 className="text-center text-2xl md:text-3xl font-cw-bold text-white mb-8">
            4 lợi thế cốt lõi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {goldMedalProgram.perks.map((perk) => {
              const Icon = perkIcons[perk.icon]
              return (
                <div
                  key={perk.title}
                  className="gold-reveal rounded-2xl border border-[#E8B44A]/20 bg-gradient-to-b from-[#E8B44A]/10 to-transparent p-6"
                >
                  <span className="w-11 h-11 rounded-xl bg-[#E8B44A]/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" style={{ color: GOLD_SOFT }} strokeWidth={1.8} />
                  </span>
                  <h4 className="text-base font-cw-bold text-white leading-snug">
                    {perk.title}
                  </h4>
                  <p className="mt-2 text-sm text-white/60 font-cw-regular leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Commission ramp + income ladder ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 md:mb-16">
          <div className="gold-reveal relative overflow-hidden rounded-3xl border border-white/10">
            {/* The house the commission is paid for — shown complete at
                the card's foot, with the copy floating over its sky. */}
            <img
              src="/images/partner/card-vibe.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-x-0 bottom-0 w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0A1628]/94 to-[#0A1628]/45" />

            <div className="relative p-7 md:p-9">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-xl bg-[#E8B44A]/15 flex items-center justify-center">
                  <Coins className="w-5 h-5" style={{ color: GOLD }} strokeWidth={1.8} />
                </span>
                <h3 className="text-xl font-cw-bold text-white">
                  Hoa hồng theo vai trò
                </h3>
              </div>

              {/* Two fixed roles — no order-volume tiers, no survey
                  bonus. Business correction of 2026-11-11. */}
              <div className="space-y-3">
                {goldMedalCommissionRoles.map((role) => {
                  const RoleIcon = role.id === 'company' ? Building2 : UserRound
                  return (
                    <div
                      key={role.id}
                      className="rounded-2xl bg-white/[0.04] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8B44A]/15">
                            <RoleIcon
                              className="w-4 h-4"
                              style={{ color: GOLD }}
                              strokeWidth={1.8}
                            />
                          </span>
                          <div className="min-w-0">
                            <p className="text-base font-cw-bold text-white">
                              {role.title}
                            </p>
                            <p className="mt-0.5 text-xs text-white/55 font-cw-regular">
                              {role.description}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p
                            className="text-base md:text-lg font-cw-bold leading-tight"
                            style={{ color: GOLD_SOFT }}
                          >
                            {role.perWatt.toLocaleString('vi-VN')} đồng/W
                          </p>
                          <p className="mt-0.5 text-[11px] text-white/55 font-cw-regular">
                            {role.referencePayout.toLocaleString('vi-VN')} đồng / đơn
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-white/50 font-cw-regular">
                Hệ {PARTNER_REFERENCE_SYSTEM_KW} kW ={' '}
                {(PARTNER_REFERENCE_SYSTEM_KW * 1000).toLocaleString('vi-VN')} W.
                Mức hoa hồng cố định theo vai trò — không có thưởng theo số đơn.
              </p>

              <p className="mt-5 pt-5 border-t border-white/10 text-xs text-white/60 font-cw-regular leading-relaxed">
                {goldMedalPromise.headline} — không cần đúng ngành, chỉ cần đúng nhu
                cầu. {goldMedalPromise.reassurance}
              </p>
            </div>
          </div>

          <div className="gold-reveal rounded-3xl border border-[#E8B44A]/25 bg-gradient-to-br from-[#E8B44A]/12 to-transparent p-7 md:p-9">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 rounded-xl bg-[#E8B44A]/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" style={{ color: GOLD_SOFT }} strokeWidth={1.8} />
              </span>
              <h3 className="text-xl font-cw-bold text-white">
                Thu nhập tiềm năng
              </h3>
            </div>

            <div className="space-y-3">
              {[
                { k: '9,5 triệu / khách hàng', v: 'Thu nhập mỗi khách hàng giới thiệu' },
                { k: '5 khách hàng / tháng', v: '~47,5 triệu / tháng' },
                { k: 'Lên đến ~570 triệu', v: 'Thu nhập mỗi năm' },
              ].map((row) => (
                <div
                  key={row.k}
                  className="flex items-baseline justify-between gap-4 py-3 border-b border-white/10 last:border-0"
                >
                  <span className="text-sm md:text-base font-cw-bold text-white">
                    {row.k}
                  </span>
                  <span className="text-sm text-white/60 font-cw-regular text-right">
                    {row.v}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-white/50 font-cw-regular">
              Tính theo mức hoa hồng doanh nghiệp 950 đồng/W.
            </p>

            <div className="mt-6">
              <h4 className="text-xs font-cw-bold uppercase tracking-wider text-[#F5D48A] mb-3">
                Đi kèm chương trình
              </h4>
              <ul className="space-y-2.5">
                {goldMedalProgram.support.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-white/75 font-cw-regular leading-relaxed"
                  >
                    <BadgeCheck
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: GOLD }}
                      strokeWidth={1.8}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── 7-step customer journey ─────────────────────────── */}
        <div className="gold-reveal mb-12 md:mb-16">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8B44A]/30 bg-[#E8B44A]/10 text-xs font-cw-regular text-[#F5D48A] mb-3">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.8} />
              Công thức đơn giản, tiền về nhanh chóng
            </span>
            <h3 className="text-2xl md:text-3xl font-cw-bold text-white">
              Từ lúc bạn giới thiệu đến khi nhận hoa hồng
            </h3>
          </div>

          <ol className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:flex lg:items-start lg:gap-0">
            {goldMedalProgram.journey.map((s, i) => {
              const Icon = JOURNEY_ICONS[i] ?? Coins
              return (
                <li
                  key={s.step}
                  className="relative flex flex-col items-center text-center px-2 py-3 lg:flex-1 lg:py-0"
                >
                  {i > 0 && (
                    <ChevronRight
                      className="hidden lg:block absolute left-0 top-[14px] h-4 w-4 text-white/25"
                      strokeWidth={2}
                    />
                  )}
                  <span
                    className="inline-flex w-11 h-11 items-center justify-center rounded-full border border-[#E8B44A]/40 bg-[#E8B44A]/10"
                    style={{ color: GOLD_SOFT }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
                  </span>
                  <span className="mt-2.5 block text-xs md:text-sm font-cw-bold text-white/85 leading-snug">
                    {s.title}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>

        {/* ── Past partner conferences ──────────────────────────
            Sits directly under the "Công thức đơn giản, tiền về
            nhanh chóng" journey, so a partner who has just read the
            money flow sees the room it actually happens in. The photo
            strip is its own client component (GoldenEventCarousel) —
            it owns the scroll-snap track and the counter. */}
        <div className="gold-reveal mb-12 md:mb-16">
          <GoldenEventCarousel />
        </div>

        {/* ── Registration ────────────────────────────────────── */}
        {/* The form drops out of the dark panel onto a light section
            below so its inputs read as the white fields used by every
            other form on the site. */}
      </div>
      </section>

    {/* ── Registration + direct contact ─────────────────────────── */}
    <section
      ref={formRef}
      id="dang-ky"
      className="relative py-16 md:py-24 bg-gradient-to-b from-[#E4F1FA] via-[#F2F8FC] to-[#F7F9FC] overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-[460px] h-[460px] rounded-full bg-[#E8B44A]/10 blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gold-reveal">
          <GoldMedalSignup trackingCode={trackingCode} />
        </div>

        {/* Direct contact */}
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
          <p className="text-sm text-uk-slate font-cw-regular">
            HOẶC gọi ngay cho chúng tôi qua HOTLINE đối tác:{' '}
            <a
              href={`tel:${PARTNER_HOTLINE}`}
              className="inline-flex items-center gap-1.5 font-cw-bold text-uk-teal-dark hover:text-uk-teal transition-colors"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              {PARTNER_HOTLINE}
            </a>
          </p>
          <p className="text-sm text-uk-slate font-cw-regular">
            Đầu mối đối tác:{' '}
            <span className="font-cw-bold text-uk-navy">{PARTNER_CONTACT.name}</span>{' '}
            ·{' '}
            <a
              href={PARTNER_CONTACT.phoneHref}
              className="font-cw-bold text-uk-teal-dark hover:text-uk-teal transition-colors"
            >
              {PARTNER_CONTACT.phone}
            </a>
          </p>
          <p className="text-sm text-uk-slate font-cw-regular">
            Hoặc xem thêm{' '}
            <Link
              href="/for-partners/"
              className="font-cw-bold text-uk-teal-dark hover:text-uk-teal transition-colors"
            >
              các hình thức hợp tác khác
            </Link>
          </p>
        </div>
      </div>
    </section>
    </>
  )
}
