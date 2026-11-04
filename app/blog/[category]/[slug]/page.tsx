import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/solutions/CTA'
import { BlogHero } from '@/components/blog/BlogHero'
import { PostBody } from '@/components/blog/PostBody'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { Calendar, Clock, User } from 'lucide-react'
import {
  getPublishedPostBySlug,
  getRelatedPosts,
} from '@/lib/data/blog'
import { extractHeadings } from '@/lib/blog-toc'
import { buildPostMetadata, NOINDEX_METADATA } from '@/lib/seo/metadata'
import { articleJsonLd, breadcrumbJsonLd, jsonLdScript } from '@/lib/seo/jsonld'

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: {
  params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
  const { category, slug } = await props.params
  const post = await getPublishedPostBySlug(category, slug)
  if (!post) return NOINDEX_METADATA
  return buildPostMetadata({ post, categorySlug: post.category.slug })
}

export default async function BlogPostPage(props: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await props.params
  const post = await getPublishedPostBySlug(category, slug)
  if (!post) notFound()

  const related = await getRelatedPosts(post.category_id, post.id, 3)
  // Headings extracted from the body. H3 is intentionally skipped
  // (see `extractHeadings`) to keep the outline to top-level sections
  // only.
  const bodyHeadings = extractHeadings(post.body_md)
  // The on-page TOC prepends a synthetic H1 entry so the article title
  // itself is the first anchor in the list. PostBody consumes only
  // `bodyHeadings` (the synthetic entry has no matching DOM heading to
  // receive an id).
  const tocHeadings = [
    { level: 2 as const, text: post.title, id: 'article-top' },
    ...bodyHeadings,
  ]

  const publishedDateLabel = post.published_at
    ? new Date(post.published_at).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <main className="min-h-screen">
      {/* JSON-LD for SEO: Article + BreadcrumbList. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(articleJsonLd(post, post.category.slug)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: 'Trang chủ', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: post.category.name_en, url: `/blog/category/${post.category.slug}` },
              { name: post.title, url: `/blog/${post.category.slug}/${post.slug}` },
            ]),
          ),
        }}
      />

      <Header />

      <article>
        {/* Hero carries category, title, byline + date + reading time.
           Same component as /blog index and /blog/category pages so the
           three views share the same visual treatment; only the h1,
           subhead (excerpt), meta slot and cover image change. The
           article detail page passes `post.cover_image_url` (the
           editor's cover) so the hero reflects the per-post artwork; the
           index / category pages fall back to the shared
           /images/hero-blog.webp since they don't have a single cover. */}
        <BlogHero
          badge={post.category.name_en}
          h1={post.title}
          headingId="article-top"
          coverImageUrl={post.cover_image_url ?? undefined}
          subhead={post.excerpt ?? undefined}
          breadcrumb={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Blog', href: '/blog' },
            {
              label: post.category.name_en,
              href: `/blog/category/${post.category.slug}`,
            },
            { label: post.title },
          ]}
          meta={
            <>
              <span className="inline-flex items-center gap-1.5">
                <User className="size-4" strokeWidth={1.6} />
                {post.author.display_name}
              </span>
              {publishedDateLabel && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-4" strokeWidth={1.6} />
                  {publishedDateLabel}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" strokeWidth={1.6} />
                {post.reading_time_min} phút đọc
              </span>
            </>
          }
        />

        <div className="relative bg-white pt-10 md:pt-14 pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tag chips live with the body (not the hero) so the hero
               strip stays focused on the listed meta:
               category / title / author / date / reading time. */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {post.tags.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center rounded-full bg-uk-teal-soft/60 text-uk-teal-dark text-[10px] font-cw-bold tracking-wider uppercase px-2 py-0.5"
                  >
                    {t.name_en}
                  </span>
                ))}
              </div>
            )}

            {/* Body + right-rail TOC. The TOC is hidden on mobile
                (saves width and avoids covering the body); it sticks
                on lg+ and scroll-spies the active heading. */}
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10">
              <div className="min-w-0">
                <PostBody markdown={post.body_md} headings={bodyHeadings} />
              </div>
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <TableOfContents headings={tocHeadings} />
                </div>
              </aside>
            </div>
          </div>
        </div>

        <RelatedPosts posts={related} />
      </article>

      {/* Unified "Ready when you are" closer - same card as
          /support, /blog index and the category pages. Replaces the
          old inline teal CTA box. The CTA component opens the
          universal FormModal (hosted in Footer) via openFormModal(). */}
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