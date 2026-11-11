// Per-page `generateMetadata` builders for the blog surface.
// All callers share `buildPostMetadata` / `buildCategoryMetadata` /
// `buildIndexMetadata` so a future tweak (e.g. locale flip) lands in
// one place.
//
// Vietnam site - the helpers here are unchanged in shape; SITE_NAME /
// SITE_LOCALE / DEFAULT_DESCRIPTION carry the VN values from `./site`.

import type { Metadata } from 'next'
import type { BlogCategory, BlogPostFull } from '@/lib/types/blog'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_INDEXING_ENABLED,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  appendSiteTitle,
} from './site'

/**
 * The `robots` value every page renders.
 *
 * Pre-launch the site is closed to indexing (see
 * `SITE_INDEXING_ENABLED` in ./site). The switch is applied here —
 * rather than only in the root layout — because a page-level
 * `robots` field REPLACES the inherited one, so a page that sets
 * its own `robots` would otherwise opt itself back in.
 */
function siteRobots(extra?: Metadata['robots']): Metadata['robots'] {
  return {
    index: SITE_INDEXING_ENABLED,
    follow: SITE_INDEXING_ENABLED,
    ...extra,
  }
}

export interface BuildIndexOpts {
  title: string
  description?: string
  /** Path of the page - default `/blog`. */
  path?: string
}

export function buildIndexMetadata(opts: BuildIndexOpts): Metadata {
  const path = opts.path ?? '/blog'
  const description = opts.description ?? DEFAULT_DESCRIPTION
  // Pass `opts.title` raw - the root layout's `title.template: '%s | Solavita Việt Nam'`
  // adds the brand suffix exactly once. Calling `appendSiteTitle(opts.title)`
  // here would double the suffix (root template + manual append), producing
  // titles like `Blog | Solavita Việt Nam | Solavita Việt Nam` on `/blog`.
  return {
    title: opts.title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: 'website',
      title: opts.title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: siteRobots(),
  }
}

export function buildCategoryMetadata(category: BlogCategory): Metadata {
  const path = `/blog/category/${category.slug}`
  const description =
    category.description_en ?? DEFAULT_DESCRIPTION
  const title = `${category.name_en} | Blog`
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: 'website',
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: siteRobots(),
  }
}

export interface BuildPostOpts {
  post: BlogPostFull
  /** Pre-built category for the URL (post.category is the joined row). */
  categorySlug: string
}

export function buildPostMetadata({ post, categorySlug }: BuildPostOpts): Metadata {
  const path = `/blog/${categorySlug}/${post.slug}`
  const description = post.meta_description ?? post.excerpt ?? DEFAULT_DESCRIPTION
  const ogTitle = post.meta_title ?? post.title
  const cover = post.cover_image_url ?? DEFAULT_OG_IMAGE
  const canonical = absoluteUrl(path)
  const tagNames = post.tags.map((t) => t.name_en)
  return {
    // Pass `post.title` raw - the root layout's `title.template: '%s | Solavita Việt Nam'`
    // adds the brand suffix exactly once.
    title: post.title,
    description,
    alternates: { canonical },
    // Tags double as SEO keywords. Next.js emits `<meta name="keywords">`
    // from a non-empty string[]. When the post has no tags we omit the
    // field so the page inherits the site-wide keywords from
    // app/layout.tsx instead of rendering an empty <meta> tag.
    ...(tagNames.length > 0 ? { keywords: tagNames } : {}),
    openGraph: {
      type: 'article',
      title: ogTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: [{ url: cover, alt: post.title }],
      // OG article namespace - all optional, but Google reads these.
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [post.author.display_name],
      section: post.category.name_en,
      tags: tagNames,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [cover],
    },
    robots: siteRobots({ 'max-image-preview': 'large' }),
    other: {
      // Twitter / Facebook article tags - helps with rich previews.
      'article:published_time': post.published_at ?? '',
      'article:modified_time': post.updated_at,
      'article:author': post.author.display_name,
      'article:section': post.category.name_en,
      ...Object.fromEntries(
        tagNames.map((t) => [`article:tag`, t] as const),
      ),
    },
  }
}

/** Used by 404 / catch-all fallbacks for blog URLs. */
export const NOINDEX_METADATA: Metadata = {
  robots: { index: false, follow: false },
  title: appendSiteTitle('Page not found'),
}

/** Site root canonical (used by `/`). */
export const SITE_CANONICAL = SITE_URL

/* ────────────────────────────────────────────────────────────────────────
   Static marketing-page builder.

   Every public marketing page calls this so canonical/robots land in one
   place. Title-suffix (` | Solavita Việt Nam`) is added by the root
   layout's `title.template` - pages only pass the page-specific title.
   ──────────────────────────────────────────────────────────────────────── */

export interface BuildPageOpts {
  /** Page title WITHOUT the brand suffix. Root layout appends it. */
  title: string
  /** Site-relative path. Trailing slash is normalised by `absoluteUrl`. */
  path: string
  description?: string
  /** Set false to mark this page as noindex. Default true. */
  index?: boolean
  /** Page-level OG / Twitter share image (site-relative or absolute). If
   * omitted the root layout's `DEFAULT_OG_IMAGE` is used. The OG variant
   * is `summary_large_image` so the share preview fills WhatsApp /
   * LinkedIn / X cards - this is the single point of control.
   *
   * Must point at one of the pre-rendered `public/images/og-*.jpg` cards
   * (1200×630). The dimensions are declared in the metadata below and
   * are not inferred per page, so passing an arbitrary hero asset here
   * would advertise the wrong aspect ratio to crawlers. */
  ogImage?: string
  ogImageAlt?: string
}

export function buildPageMetadata(opts: BuildPageOpts): Metadata {
  const description = opts.description ?? DEFAULT_DESCRIPTION
  const image = opts.ogImage ?? DEFAULT_OG_IMAGE
  const imageUrl = absoluteUrl(image)
  const imageAlt = opts.ogImageAlt ?? opts.title
  return {
    title: opts.title,
    description,
    alternates: { canonical: absoluteUrl(opts.path) },
    robots: siteRobots(
      opts.index === false
        ? // A page that explicitly opts out stays opted out even when
          // the site is open for indexing.
          { index: false, follow: false }
        : undefined,
    ),
    openGraph: {
      title: opts.title,
      description,
      url: absoluteUrl(opts.path),
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      images: [
        {
          url: imageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description,
      images: [imageUrl],
    },
  }
}
