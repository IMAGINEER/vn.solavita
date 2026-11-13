import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/solutions/CTA'
import JsonLd from '@/components/seo/JsonLd'
import { BlogHero } from '@/components/blog/BlogHero'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogFilters } from '@/components/blog/BlogFilters'
import {
  getCategories,
  listPublishedPosts,
} from '@/lib/data/blog'
import { buildIndexMetadata } from '@/lib/seo/metadata'
import {
  blogJsonLd,
  breadcrumbJsonLd,
} from '@/lib/seo/jsonld'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildIndexMetadata({
  title: 'Cẩm nang điện mặt trời — Blog Solavita',
  description:
    'Kinh nghiệm chọn tấm pin, biến tần, pin lưu trữ và hệ điện mặt trời cho hộ gia đình, doanh nghiệp tại Việt Nam — do đội ngũ kỹ sư Solavita viết.',
})

export default async function BlogIndexPage(props: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const sp = await props.searchParams
  const activeCategory = sp.category
  const page = Number(sp.page ?? '1') || 1

  const [categories, result] = await Promise.all([
    // Public surface: hide VN categories with no published posts so the
    // filter chips never surface a dead category page.
    getCategories({ onlyWithPublishedPosts: true }),
    listPublishedPosts({ categorySlug: activeCategory, page, pageSize: 9 }),
  ])

  const activeCat = activeCategory
    ? categories.find((c) => c.slug === activeCategory) ?? null
    : null

  return (
    <main className="min-h-screen">
      <JsonLd
        data={[
          blogJsonLd({
            path: '/blog',
            name: 'Blog Solavita Việt Nam',
            description:
              'Kinh nghiệm chọn tấm pin, biến tần, pin lưu trữ và hệ điện mặt trời cho hộ gia đình, doanh nghiệp tại Việt Nam — do đội ngũ kỹ sư Solavita viết.',
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Blog', url: '/blog' },
          ]),
        ]}
      />
      <Header />
      <BlogHero
        badge={activeCat ? `Danh mục · ${activeCat.name_en}` : 'Blog Solavita Việt Nam'}
        h1={activeCat ? activeCat.name_en : 'Góc chia sẻ & cập nhật'}
        h1Accent={activeCat ? 'những cập nhật mới nhất' : 'về điện mặt trời tại Việt Nam'}
        subhead={
          activeCat?.description_en ??
          'Cẩm nang dễ hiểu về tấm pin mặt trời, pin lưu trữ và quy định năng lượng tại Việt Nam — do đội ngũ kỹ sư Solavita viết.'
        }
      />

      <section className="relative py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogFilters categories={categories} activeSlug={activeCategory} />

          {result.posts.length === 0 ? (
            <EmptyState categoryName={activeCat?.name_en} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.posts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          )}

          {result.totalPages > 1 && (
            <Pagination page={result.page} totalPages={result.totalPages} activeCategory={activeCategory} />
          )}
        </div>
      </section>

      {/* Unified "Ready when you are" closer - same card as
          /support and the category / post pages. The CTA component opens
          the universal FormModal (hosted in Footer) via openFormModal(). */}
      <CTA
        eyebrow="Sẵn sàng khi bạn cần"
        title={
          <>
            Bạn chưa phải khách hàng của Solavita?
            <br />
            <span className="text-gradient">Bắt đầu với thiết kế miễn phí.</span>
          </>
        }
        description="Nếu bạn còn đang cân nhắc, Solavita sẽ chuẩn bị bản thiết kế miễn phí, không ràng buộc — cho bạn thấy tấm pin, pin lưu trữ hoặc trọn hệ thống phù hợp với ngôi nhà mình."
      />

      <Footer />
    </main>
  )
}

function EmptyState({ categoryName }: { categoryName?: string | null }) {
  return (
    <div className="rounded-2xl border border-dashed border-uk-line bg-[#F7F9FC] dark:bg-sv-darker p-12 text-center">
      <p className="text-uk-slate">
        {categoryName
          ? `Danh mục "${categoryName}" chưa có bài viết nào được xuất bản.`
          : 'Blog đang được hoàn thiện — hãy quay lại sớm nhé.'}
      </p>
      <div className="mt-4">
        <Link
          href="/blog"
          className="inline-flex items-center justify-center h-8 px-3 text-xs font-cw-bold rounded-md border border-uk-line bg-white text-uk-navy hover:bg-uk-teal-soft hover:text-uk-teal-dark hover:border-uk-teal/40 shadow-sm transition-colors"
        >
          Tất cả bài viết
        </Link>
      </div>
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  activeCategory,
}: {
  page: number
  totalPages: number
  activeCategory?: string
}) {
  const params = new URLSearchParams()
  if (activeCategory) params.set('category', activeCategory)

  const makeHref = (p: number) => {
    const next = new URLSearchParams(params)
    if (p > 1) next.set('page', String(p))
    const qs = next.toString()
    return qs ? `/blog?${qs}` : '/blog'
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={makeHref(page - 1)}
          className="inline-flex items-center justify-center h-8 px-3 text-xs font-cw-bold rounded-md border border-uk-line bg-white text-uk-navy hover:bg-uk-teal-soft hover:text-uk-teal-dark hover:border-uk-teal/40 shadow-sm transition-colors"
        >
          ← Trước
        </Link>
      )}
      <span className="text-sm text-uk-slate">
        Trang {page} / {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={makeHref(page + 1)}
          className="inline-flex items-center justify-center h-8 px-3 text-xs font-cw-bold rounded-md border border-uk-line bg-white text-uk-navy hover:bg-uk-teal-soft hover:text-uk-teal-dark hover:border-uk-teal/40 shadow-sm transition-colors"
        >
          Sau →
        </Link>
      )}
    </div>
  )
}