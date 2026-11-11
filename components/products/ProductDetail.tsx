'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, Download, FileText } from 'lucide-react'
import TbdText from '@/components/ui/tbd-text'
import SectionEyebrow from '@/components/ui/section-eyebrow'
import CertificationGrid from '@/components/products/CertificationGrid'
import GetQuoteButton from '@/components/ui/get-quote-button'
import CTA from '@/components/solutions/CTA'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { openFormModal } from '@/lib/form-modal'
import { cn } from '@/lib/utils'
import { PRODUCT_SPEC_TBD, type Product, type ProductVariant } from '@/lib/data/products'

/**
 * ProductDetail — the shared layout for every `/products/[slug]` page.
 *
 * Structure follows `docs/修改建议.docx` §"Products - … - 详情页":
 *   ① image + selling points  ② configuration cards  ③ spec table
 *   → downloads.
 *
 * The hero is a gallery driven by the configuration cards: picking a
 * card swaps the hero render for that configuration and points the spec
 * table at the matching model. Where the factory supplied more than one
 * angle of a configuration, a small row of text chips under the image
 * browses the extra views.
 *
 * The hero leads with the advantage copy the old "Why Solavita …"
 * section carried — buyers comparing hardware read the claims first and
 * the numbers second. The former thumbnails are now configuration cards
 * (family / capacity / power class + the two parameters that matter),
 * because the photos only ever showed that more photos existed.
 *
 * The source PPTX supplies three inverter families, so the variant
 * switcher at the top of the spec block is how the user moves between
 * the single-phase hybrid, the three-phase hybrid and the off-grid unit
 * without leaving the page — and it moves the hero image with it.
 */

function SpecTable({
  variant,
  highlightColumn,
}: {
  variant: ProductVariant
  /** Index of the model column the configuration cards selected. */
  highlightColumn?: number
}) {
  const dataCols = variant.columns.length - 1
  // Wide families (the 7-model inverter ranges) use tighter cells so
  // every model still fits on a desktop without scrolling sideways.
  const dense = dataCols >= 5
  const cellPad = dense ? 'px-3 py-2.5' : 'px-4 py-3'
  const minWidth = Math.max(560, (dense ? 200 : 260) + dataCols * (dense ? 112 : 130))

  return (
    <div className="overflow-x-auto rounded-2xl border border-uk-line bg-white shadow-sm">
      <Table
        className={cn('border-collapse', dense ? 'text-xs' : 'text-sm')}
        style={{ minWidth: `${minWidth}px` }}
      >
        <TableHeader className="bg-uk-teal-soft/40">
          <TableRow className="border-uk-line">
            {variant.columns.map((col, i) => (
              <TableHead
                key={col}
                scope="col"
                className={cn(
                  cellPad,
                  'h-auto whitespace-nowrap text-xs font-cw-bold normal-case tracking-normal text-uk-navy',
                  // Freeze the parameter column while the model columns
                  // scroll sideways on narrow screens.
                  i === 0 &&
                    'sticky left-0 z-20 min-w-[170px] border-r border-uk-line bg-uk-teal-soft',
                  // The column the hero cards selected.
                  highlightColumn === i - 1 && 'bg-uk-teal-soft',
                )}
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {variant.rows.map((row, ri) => (
            <TableRow
              key={row.label}
              className={cn(
                'group border-uk-line/60',
                ri % 2 === 0 ? 'bg-white' : 'bg-uk-line/10',
              )}
            >
              <TableHead
                scope="row"
                className={cn(
                  cellPad,
                  'sticky left-0 z-10 h-auto whitespace-nowrap border-r border-uk-line/70 bg-white text-xs font-cw-regular normal-case tracking-normal text-uk-slate',
                  'group-hover:bg-uk-teal-soft/40',
                )}
              >
                {row.label}
              </TableHead>
              {row.values.map((value, vi) => (
                <TableCell
                  key={vi}
                  // A single value spans every model column — used for
                  // specs that are identical across the family.
                  colSpan={row.values.length === 1 ? dataCols : undefined}
                  className={cn(
                    cellPad,
                    'font-cw-bold text-uk-navy align-top',
                    // The column the hero cards selected.
                    highlightColumn === vi && 'bg-uk-teal-soft/50',
                  )}
                >
                  {value === null ? (
                    <TbdText
                      text={PRODUCT_SPEC_TBD}
                      inline
                      className="text-[11px] font-cw-regular"
                    />
                  ) : (
                    value
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function ProductDetail({ product }: { product: Product }) {
  const [activeConfig, setActiveConfig] = useState(0)
  const [activeView, setActiveView] = useState(0)
  const [activeVariant, setActiveVariant] = useState(0)
  const [highlightColumn, setHighlightColumn] = useState<number | undefined>(
    undefined,
  )
  /**
   * Hero film lifecycle: `idle` (the still render holds the KV area) →
   * `playing` (the film owns it) → `fading` (the film dissolves while
   * the render comes up) → `done` (the film is unmounted, the render
   * stays).
   */
  const [videoPhase, setVideoPhase] = useState<
    'idle' | 'playing' | 'fading' | 'done'
  >('idle')
  const videoRef = useRef<HTMLVideoElement>(null)

  const hasVideo = Boolean(product.video)

  /**
   * Start the film.
   *
   * The `autoplay` attribute alone is not enough: Chrome declines to
   * start a muted video that is still below the fold, so the file is
   * also started explicitly — and again as soon as it scrolls into
   * view. Visitors who ask for reduced motion keep the still render.
   */
  useEffect(() => {
    if (!hasVideo) return
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVideoPhase('done')
      return
    }
    const el = videoRef.current
    if (!el) return

    const play = () => {
      el.play()
        .then(() => setVideoPhase((p) => (p === 'done' ? p : 'playing')))
        // Autoplay blocked (or the file failed) — keep the still render.
        .catch(() => setVideoPhase((p) => (p === 'done' ? p : 'idle')))
    }
    play()

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            play()
            io.disconnect()
          }
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasVideo])

  /** The film ends → dissolve it and bring the render up. */
  function handleVideoEnd() {
    setVideoPhase('fading')
    window.setTimeout(() => setVideoPhase('done'), 1000)
  }

  const variant = product.variants[activeVariant]
  const config = product.configs[activeConfig]
  const views = config?.views ?? []
  const image = views[activeView] ?? views[0] ?? product.hero
  // Spec rows are fully transcribed from the datasheets, so the red
  // "pending confirmation" footnote only shows if a cell is still null.
  const hasTbd = variant.rows.some((r) => r.values.some((v) => v === null))

  /**
   * Picking a configuration swaps the hero render for that
   * configuration and points the spec table at the matching model.
   */
  function selectConfig(index: number) {
    const next = product.configs[index]
    setActiveConfig(index)
    setActiveView(0)
    if (next.variantIndex !== undefined) setActiveVariant(next.variantIndex)
    setHighlightColumn(next.columnIndex)
  }

  /** The spec-table family tabs and the hero cards drive each other. */
  function selectVariant(index: number) {
    setActiveVariant(index)
    const ci = product.configs.findIndex((c) => c.variantIndex === index)
    if (ci >= 0) {
      setActiveConfig(ci)
      setActiveView(0)
      setHighlightColumn(product.configs[ci].columnIndex)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header logoHref="/" />

      {/* ① image + selling points.
          `pt-32 lg:pt-36` clears the fixed header — same top offset as
          every other inner-page hero (`PageHero variant="inner"`).
          The headline, CTA and benefit list follow the same type scale
          as the rest of the site's heroes. */}
      <section className="relative pt-32 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-br from-uk-teal/5 to-uk-emerald/15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: 'Trang chủ', href: '/' },
                // No Products page to link to — the header opens the
                // dropdown instead — so this crumb is a plain label.
                { label: 'Sản phẩm' },
                { label: product.name },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <SectionEyebrow>SẢN PHẨM</SectionEyebrow>
              {/* `py-[0.15em]` is not decoration: `.text-gradient` paints the
                  headline only inside the element's box
                  (background-clip: text), so Vietnamese diacritics (ấ, ằ,
                  ữ …) and the descenders of g/q that reach past a
                  `leading-tight` line box would be left unpainted —
                  transparent, which reads as the letters being sliced
                  top and bottom. The padding widens the painted area so
                  the full glyphs stay visible. */}
              <h1 className="mt-5 py-[0.15em] text-4xl sm:text-5xl lg:text-6xl font-cw-bold text-gradient leading-tight">
                {product.name}
              </h1>
              <p className="mt-4 text-lg font-cw-bold text-uk-teal-dark">
                {product.tagline}
              </p>
              <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed">
                {product.description}
              </p>

              <div className="mt-7">
                <GetQuoteButton onClick={openFormModal}>
                  Nhận báo giá miễn phí
                </GetQuoteButton>
              </div>

              {/* The selling points that used to live in the separate
                  "Why Solavita …" section, in the same order. Products
                  whose selling points differ per model family (the
                  Inverter page) list them against each variant instead,
                  so the hero list is optional. */}
              {product.advantages && product.advantages.length > 0 && (
                <ul className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {product.advantages.map((a) => (
                    <li key={a.title} className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 text-uk-emerald flex-shrink-0 mt-1"
                        strokeWidth={3}
                      />
                      <div>
                        <div className="text-sm font-cw-bold text-uk-navy leading-snug">
                          {a.title}
                        </div>
                        <p className="mt-1 text-sm text-uk-slate font-cw-regular leading-relaxed">
                          {a.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              {/* KV area. When the product ships a brand film, the film
                  plays here first and dissolves into the product
                  render. Otherwise it is the bare render — no card,
                  border or tinted panel, so it sits straight on the
                  hero gradient. */}
              <div
                className={cn(
                  'relative',
                  hasVideo && 'w-full h-[420px] sm:h-[480px] lg:h-[520px]',
                )}
              >
                {hasVideo && videoPhase !== 'done' && (
                  <video
                    ref={videoRef}
                    src={product.video!.src}
                    /* Product shot stands in for the film until the first
                       frame decodes — the 6 MB mp4 must not leave the
                       hero area blank. */
                    poster="/images/product-module-1.webp"
                    autoPlay
                    muted
                    playsInline
                    /* "metadata" instead of "auto": the browser used to
                       pre-buffer the whole 6 MB file on page load. */
                    preload="metadata"
                    aria-hidden="true"
                    onEnded={handleVideoEnd}
                    onError={() => setVideoPhase('done')}
                    className={cn(
                      'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out',
                      videoPhase === 'playing' ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                )}

                {image && (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className={cn(
                      'mx-auto w-full h-auto max-h-[480px] object-contain transition-opacity duration-1000 ease-out',
                      hasVideo &&
                        'absolute inset-0 h-full w-full object-contain',
                      hasVideo &&
                        (videoPhase === 'playing' ? 'opacity-0' : 'opacity-100'),
                    )}
                  />
                )}
              </div>

              {/* Extra angles of the selected configuration. */}
              {views.length > 1 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {views.map((v, i) => (
                    <button
                      key={v.src}
                      type="button"
                      onClick={() => setActiveView(i)}
                      aria-pressed={i === activeView}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-[11px] font-cw-regular border transition-colors cursor-pointer',
                        i === activeView
                          ? 'border-uk-teal bg-uk-teal text-white'
                          : 'border-uk-line bg-white text-uk-slate hover:border-uk-teal/50',
                      )}
                    >
                      {v.caption}
                    </button>
                  ))}
                </div>
              )}

              {/* Configuration cards — they drive the gallery above and
                  the spec table below. Three at most, so they sit in a
                  single row on every screen size. */}
              <div
                className={cn(
                  'mt-8 grid gap-2 sm:gap-3',
                  product.configs.length === 1
                    ? 'grid-cols-1 max-w-sm mx-auto'
                    : product.configs.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3',
                )}
              >
                {product.configs.map((c, i) => {
                  // A configuration is only clickable when the factory
                  // supplied a render of it — otherwise there is no
                  // picture to switch to, so the card stays a plain
                  // spec summary (the module series photo covers all
                  // five power classes).
                  const interactive = Boolean(c.views?.length)
                  const cardClass = cn(
                    'rounded-xl border bg-white p-2.5 sm:p-3.5 text-left',
                    interactive
                      ? cn(
                          'transition-all duration-200 cursor-pointer',
                          i === activeConfig
                            ? 'border-uk-teal ring-1 ring-uk-teal/30 shadow-sm'
                            : 'border-uk-line hover:border-uk-teal/50',
                        )
                      : 'border-uk-line',
                  )
                  const cardBody = (
                    <>
                      <div className="text-sm font-cw-bold text-uk-navy leading-tight">
                        {c.name}
                      </div>
                      <div className="mt-0.5 text-[9px] sm:text-[10px] text-uk-slate font-cw-regular">
                        {c.summary}
                      </div>
                      <dl className="mt-2.5 space-y-1 border-t border-uk-line/70 pt-2">
                        {c.specs.map((s) => (
                          <div
                            key={s.label}
                            className="flex items-baseline justify-between gap-2"
                          >
                            <dt className="text-[10px] text-uk-slate font-cw-regular">
                              {s.label}
                            </dt>
                            <dd className="text-xs font-cw-bold text-uk-teal-dark whitespace-nowrap">
                              {s.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </>
                  )

                  if (!interactive) {
                    return (
                      <div key={c.name} className={cardClass}>
                        {cardBody}
                      </div>
                    )
                  }
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => selectConfig(i)}
                      aria-pressed={i === activeConfig}
                      className={cardClass}
                    >
                      {cardBody}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ③ reliability — the paragraph plus the quality-system tiles.
          Only products that publish one carry this block; the module
          does, per `docs/修改建议(2).docx` §"Products - PV Modules". */}
      {product.reliability && (
        <section
          id="reliability"
          className="relative py-16 md:py-20 bg-sv-blue/10 scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <SectionEyebrow>ĐỘ TIN CẬY</SectionEyebrow>
              <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
                Thiết kế cho{' '}
                <span className="text-gradient">khí hậu khắc nghiệt</span>
              </h2>
              <p className="mt-4 text-base md:text-lg text-uk-slate font-cw-regular leading-relaxed max-w-3xl mx-auto">
                {product.reliability}
              </p>
            </div>
            {product.certifications && (
              <CertificationGrid
                title={product.certifications.title}
                items={product.certifications.items}
              />
            )}
          </div>
        </section>
      )}

      {/* ③ spec table */}
      <section
        id="specs"
        className="relative py-16 md:py-20 bg-uk-line/30 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>DỮ LIỆU KỸ THUẬT</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Thông số kỹ thuật <span className="text-gradient">tổng quan</span>
            </h2>
          </div>

          {product.variants.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => selectVariant(i)}
                  className={`px-5 py-2.5 rounded-full text-sm font-cw-bold border transition-all duration-300 ${
                    i === activeVariant
                      ? 'border-uk-teal bg-uk-teal text-white shadow-md shadow-uk-teal/20'
                      : 'border-uk-line bg-white text-uk-slate hover:border-uk-teal/40 hover:text-uk-teal-dark'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-lg font-cw-bold text-uk-navy">{variant.name}</h3>
            <p className="mt-1 text-sm font-cw-bold text-uk-teal-dark">
              {variant.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-3xl mx-auto">
            {variant.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-uk-line bg-white px-4 py-3 text-center"
              >
                <div className="text-base font-cw-bold text-uk-teal-dark">
                  {s.value}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-uk-slate font-cw-regular">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {variant.columns.length > 5 && (
            <p className="mb-3 text-xs text-uk-slate font-cw-regular lg:hidden">
              Vuốt ngang để so sánh mọi model.
            </p>
          )}

          {/* Selling points for the selected model family. Only the
              Inverter page has them here — its three families each
              have their own list, so they change with the tab. */}
          {variant.advantages && variant.advantages.length > 0 && (
            <ul className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {variant.advantages.map((a) => (
                <li
                  key={a.title}
                  className="rounded-2xl border border-uk-line bg-white p-5"
                >
                  <div className="flex items-start gap-2.5">
                    <Check
                      className="w-4 h-4 text-uk-emerald flex-shrink-0 mt-1"
                      strokeWidth={3}
                    />
                    <div>
                      <div className="text-sm font-cw-bold text-uk-navy leading-snug">
                        {a.title}
                      </div>
                      <p className="mt-1 text-sm text-uk-slate font-cw-regular leading-relaxed">
                        {a.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <SpecTable variant={variant} highlightColumn={highlightColumn} />

          {hasTbd && (
            <p className="mt-6 text-xs text-uk-slate font-cw-regular leading-relaxed max-w-4xl mx-auto">
              Các thông số được đánh dấu đỏ đang chờ xác nhận từ tài liệu kỹ
              thuật đầy đủ của nhà sản xuất và sẽ được công bố sau khi xác
              minh.
            </p>
          )}

          {/* Quality-system / protection block — reference material, not
              a claim, so it belongs with the technical data. Products
              that publish a reliability paragraph carry their tiles in
              that section instead. */}
          {product.certifications && !product.reliability && (
            <div className="mt-10 rounded-2xl border border-uk-line bg-white p-6">
              <CertificationGrid
                title={product.certifications.title}
                items={product.certifications.items}
              />
            </div>
          )}
        </div>
      </section>

      {/* Downloads — the datasheet(s) and warranty for this product */}
      <section
        id="downloads"
        className="relative py-16 md:py-20 bg-white scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <SectionEyebrow>TẢI XUỐNG</SectionEyebrow>
            <h2 className="mt-5 text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
              Tài liệu kỹ thuật &amp; <span className="text-gradient">Bảo hành</span>
            </h2>
            <p className="mt-4 text-base text-uk-slate font-cw-regular leading-relaxed max-w-2xl mx-auto">
              Mọi thông số trên trang này đều lấy từ các tài liệu bên dưới. Hãy
              tải xuống để xem đầy đủ chi tiết kỹ thuật.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.downloads.map((d) => (
              <a
                key={d.href}
                href={d.href}
                download
                className="group flex items-start gap-4 rounded-2xl border border-uk-line bg-white p-5 transition-all duration-300 hover:border-uk-teal hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-uk-teal-soft/60 border border-uk-teal/20 flex items-center justify-center text-uk-teal-dark">
                  <FileText className="w-5 h-5" strokeWidth={2} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[10px] font-cw-bold uppercase tracking-wider text-uk-teal-dark">
                    {d.kind} · PDF · {d.size}
                  </span>
                  <span className="mt-1 block text-sm font-cw-bold text-uk-navy leading-snug">
                    {d.label}
                  </span>
                  <span className="mt-1 block text-xs text-uk-slate font-cw-regular leading-relaxed">
                    {d.description}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-cw-bold text-uk-teal group-hover:text-uk-teal-dark transition-colors">
                    <Download className="w-4 h-4" strokeWidth={2} />
                    Tải xuống
                    <ArrowRight
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={2}
                    />
                  </span>
                </span>
              </a>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-uk-slate font-cw-regular">
            Bạn cần tìm tài liệu khác?{' '}
            <Link href="/support#download" className="text-uk-teal-dark font-cw-bold hover:underline">
              Xem tất cả tài liệu tải xuống
            </Link>
          </p>
        </div>
      </section>

      <CTA
        eyebrow="Sẵn sàng khi bạn cần"
        title={
          <>
            Chưa phải khách hàng của Solavita?
            <br />
            <span className="text-gradient">Bắt đầu với thiết kế miễn phí.</span>
          </>
        }
        description="Nếu bạn vẫn đang cân nhắc các phương án, đội ngũ của chúng tôi có thể chuẩn bị bản thiết kế miễn phí, không ràng buộc, cho thấy tấm quang năng, pin lưu trữ hoặc hệ thống năng lượng gia đình trọn gói sẽ phù hợp với ngôi nhà của bạn như thế nào."
      />

      <Footer />
    </main>
  )
}
