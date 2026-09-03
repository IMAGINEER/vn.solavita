import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CTA from '@/components/solutions/CTA'
import { BlogHero } from '@/components/blog/BlogHero'
import { PostBody } from '@/components/blog/PostBody'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { Calendar, Clock, User } from 'lucide-react'
import {
  getPublishedPostBySlug,
  getRelatedPosts,
} from '@/lib/data/blog'
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

  const publishedDateLabel = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
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
              { name: 'Home', url: '/' },
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
           subhead (excerpt) and meta slot change. The post's own cover
           image is intentionally NOT rendered - the shared hero
           background (/images/hero-blog.webp) IS the cover, matching
           how the parent pages present posts. Per-post covers are
           still stored on the row for future OpenGraph / social use. */}
        <BlogHero
          badge={post.category.name_en}
          h1={post.title}
          subhead={post.excerpt ?? undefined}
          breadcrumb={[
            { label: 'Home', href: '/' },
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
                {post.reading_time_min} min read
              </span>
            </>
          }
        />

        <div className="relative bg-white pt-10 md:pt-14 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

            <PostBody markdown={post.body_md} />
          </div>
        </div>

        <RelatedPosts posts={related} />
      </article>

      {/* Unified "Ready when you are" closer - same card as
          /support, /blog index and the category pages. Replaces the
          old inline teal CTA box. The CTA component opens the
          universal FormModal (hosted in Footer) via openFormModal(). */}
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