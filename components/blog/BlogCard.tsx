import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'
import type { BlogPostSummary } from '@/lib/types/blog'

// Blog card - same hierarchy as CasesSection card (image · tag · h3 ·
// data row) but adapted for posts (no annual generation / saving,
// instead: reading time + author). Used by the index page, category
// page, and the homepage ArticlesSection.

export interface BlogCardProps {
  post: BlogPostSummary
  /** When provided, overrides the auto-built detail URL. */
  href?: string
}

export function BlogCard({ post, href }: BlogCardProps) {
  const url =
    href ?? `/blog/${post.category.slug}/${post.slug}`

  return (
    <Link
      href={url}
      className="group block rounded-2xl bg-white border border-uk-line hover:border-uk-teal/50 hover:shadow-md transition-all flex flex-col"
    >
      <div className="mb-0 -mx-px overflow-hidden rounded-t-2xl">
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.title}
            loading="lazy"
            className="w-full h-48 object-cover block transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-48 bg-uk-teal-soft/50 flex items-center justify-center text-uk-teal-dark">
            <BookOpen className="size-10" strokeWidth={1.4} />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <span className="text-[10px] font-cw-bold tracking-wider uppercase text-uk-teal-dark">
          {post.category.name_en}
        </span>

        <h3 className="mt-2 text-xl font-cw-bold text-uk-navy leading-tight group-hover:text-uk-teal-dark transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 text-sm text-uk-slate font-cw-regular leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="mt-4 mb-4 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center rounded-full bg-uk-teal-soft/60 text-uk-teal-dark text-[10px] font-cw-bold tracking-wider uppercase px-2 py-0.5"
              >
                {t.name_en}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-uk-line flex items-center justify-between text-uk-slate">
          <span className="text-xs">{post.author.display_name}</span>
          <span className="inline-flex items-center gap-1 text-xs tabular-nums">
            <Clock className="size-3.5" strokeWidth={1.6} />
            {post.reading_time_min} phút đọc
          </span>
        </div>
      </div>
    </Link>
  )
}