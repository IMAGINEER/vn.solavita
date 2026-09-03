import { BlogCard } from './BlogCard'
import type { BlogPostSummary } from '@/lib/types/blog'

// Related posts block - server-rendered grid of 3 cards from the same
// category. Mirrors the CasesSection "scopri altri progetti" footer.

export function RelatedPosts({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) return null

  return (
    <section className="border-t border-uk-line bg-[#F7F9FC] py-16 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-uk-line bg-white text-xs font-cw-regular text-uk-slate mb-3">
            <span className="w-2 h-2 rounded-full bg-uk-emerald animate-pulse" />
            Continue reading
          </span>
          <h2 className="text-3xl md:text-4xl font-cw-bold text-uk-navy leading-tight">
            Related{' '}
            <span className="text-gradient">posts</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </section>
  )
}