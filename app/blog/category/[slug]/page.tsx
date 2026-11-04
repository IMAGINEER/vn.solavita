import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/solutions/CTA'
import JsonLd from '@/components/seo/JsonLd'
import { BlogHero } from '@/components/blog/BlogHero'
import { BlogCard } from '@/components/blog/BlogCard'
import {
  getCategories,
  getCategoryBySlug,
  listPublishedPosts,
} from '@/lib/data/blog'
import {
  buildCategoryMetadata,
  NOINDEX_METADATA,
} from '@/lib/seo/metadata'
import {
  collectionPageJsonLd,
  breadcrumbJsonLd,
  categoryJsonLd,
} from '@/lib/seo/jsonld'

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const cat = await getCategoryBySlug(slug)
  if (!cat) return NOINDEX_METADATA
  return buildCategoryMetadata(cat)
}

export default async function BlogCategoryPage(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await props.params
  const sp = await props.searchParams
  const page = Number(sp.page ?? '1') || 1

  const category = await getCategoryBySlug(slug, { onlyWithPublishedPosts: true })
  if (!category) notFound()

  const [allCategories, result] = await Promise.all([
    // Sibling-chip navigation: same public-surface rule as /blog index
    // — drop empty VN categories so the chips never link to a page
    // that 404s.
    getCategories({ onlyWithPublishedPosts: true }),
    listPublishedPosts({ categorySlug: slug, page, pageSize: 9 }),
  ])

  return (
    <main className="min-h-screen">
      <JsonLd
        data={[
          collectionPageJsonLd({
            path: `/blog/category/${category.slug}`,
            name: `${category.name_en} - Blog Solavita Việt Nam`,
            description:
              category.description_en ??
              `Các bài viết trong danh mục ${category.name_en}.`,
          }),
          breadcrumbJsonLd([
            { name: 'Trang chủ', url: '/' },
            { name: 'Blog', url: '/blog' },
            {
              name: category.name_en,
              url: `/blog/category/${category.slug}`,
            },
          ]),
          categoryJsonLd(category),
        ]}
      />
      <Header />
      <BlogHero
        badge={category.name_en}
        h1={category.name_en}
        h1Accent="bài viết & hướng dẫn"
        subhead={
          category.description_en ??
          'Tất cả những gì chúng tôi đã viết về danh mục này.'
        }
      />

      <section className="relative py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sibling-category chips - manual so the design is intentional. */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center px-4 h-9 text-sm font-cw-bold rounded-full border border-uk-line bg-white text-uk-slate hover:bg-uk-teal-soft hover:text-uk-teal-dark transition-colors"
            >
              Tất cả
            </Link>
            {allCategories.map((c) => (
              <Link
                key={c.id}
                href={`/blog/category/${c.slug}`}
                className={`inline-flex items-center px-4 h-9 text-sm font-cw-bold rounded-full border transition-colors ${
                  c.id === category.id
                    ? 'bg-uk-teal-dark text-white border-uk-teal-dark'
                    : 'bg-white text-uk-slate border-uk-line hover:bg-uk-teal-soft hover:text-uk-teal-dark'
                }`}
              >
                {c.name_en}
              </Link>
            ))}
          </div>

          {result.posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-uk-line bg-[#F7F9FC] dark:bg-sv-darker p-12 text-center text-uk-slate">
              Danh mục này chưa có bài viết nào được xuất bản.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.posts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          )}

          {result.totalPages > 1 && (
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              slug={slug}
            />
          )}
        </div>
      </section>

      {/* Unified "Ready when you are" closer - same card as
          /support, /blog index and the post detail. The CTA component
          opens the universal FormModal (hosted in Footer) via
          openFormModal(). */}
      <CTA
        eyebrow="Sẵn sàng khi bạn cần"
        title={
          <>
            Bạn chưa phải khách hàng của Solavita?
            <br />
            <span className="text-gradient">Bắt đầu với thiết kế miễn phí.</span>
          </>
        }
        description="Nếu bạn vẫn đang cân nhắc, đội ngũ của chúng tôi có thể chuẩn bị một bản thiết kế miễn phí, không ràng buộc, cho thấy tấm pin mặt trời, pin lưu trữ hoặc trọn bộ hệ thống năng lượng cho gia đình sẽ phù hợp với ngôi nhà của bạn như thế nào."
      />

      <Footer />
    </main>
  )
}

function Pagination({
  page,
  totalPages,
  slug,
}: {
  page: number
  totalPages: number
  slug: string
}) {
  const makeHref = (p: number) => {
    if (p === 1) return `/blog/category/${slug}`
    return `/blog/category/${slug}?page=${p}`
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