import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/solutions/CTA'
import { BlogHero } from '@/components/blog/BlogHero'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogFilters } from '@/components/blog/BlogFilters'
import {
  getCategories,
  listPublishedPosts,
} from '@/lib/data/blog'
import { buildIndexMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildIndexMetadata({
  title: 'Blog',
  description:
    'Guides, product updates and stories from UK solar. Written by Solavita engineers so you can choose with confidence.',
})

export default async function BlogIndexPage(props: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const sp = await props.searchParams
  const activeCategory = sp.category
  const page = Number(sp.page ?? '1') || 1

  const [categories, result] = await Promise.all([
    getCategories(),
    listPublishedPosts({ categorySlug: activeCategory, page, pageSize: 9 }),
  ])

  const activeCat = activeCategory
    ? categories.find((c) => c.slug === activeCategory) ?? null
    : null

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header />
      <BlogHero
        badge={activeCat ? `Category · ${activeCat.name_en}` : 'Solavita UK Blog'}
        h1={activeCat ? activeCat.name_en : 'Insights & updates'}
        h1Accent={activeCat ? 'the latest updates' : 'for UK solar'}
        subhead={
          activeCat?.description_en ??
          'Plain-English guides on solar panels, battery storage, MCS standards and UK regulation. Written by our engineers, never generic.'
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
        eyebrow="Ready when you are"
        title={
          <>
            Not a Solavita customer yet?
            <br />
            <span className="text-gradient">Start with a free design.</span>
          </>
        }
        description="If you're still weighing your options, our team can prepare a free, no-obligation design that shows how solar panels, battery storage or a full home energy system would fit your home."
      />

      <Footer variant="light" />
    </main>
  )
}

function EmptyState({ categoryName }: { categoryName?: string | null }) {
  return (
    <div className="rounded-2xl border border-dashed border-uk-line bg-[#F7F9FC] p-12 text-center">
      <p className="text-uk-slate">
        {categoryName
          ? `The "${categoryName}" category has no published articles yet.`
          : 'The blog is on its way — check back soon.'}
      </p>
      <div className="mt-4">
        <Link
          href="/blog"
          className="inline-flex items-center justify-center h-8 px-3 text-xs font-cw-bold rounded-md border border-uk-line bg-white text-uk-navy hover:bg-uk-teal-soft hover:text-uk-teal-dark hover:border-uk-teal/40 shadow-sm transition-colors"
        >
          All articles
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
          ← Previous
        </Link>
      )}
      <span className="text-sm text-uk-slate">
        Page {page} of {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={makeHref(page + 1)}
          className="inline-flex items-center justify-center h-8 px-3 text-xs font-cw-bold rounded-md border border-uk-line bg-white text-uk-navy hover:bg-uk-teal-soft hover:text-uk-teal-dark hover:border-uk-teal/40 shadow-sm transition-colors"
        >
          Next →
        </Link>
      )}
    </div>
  )
}