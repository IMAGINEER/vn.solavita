import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Noindex on 404 is non-negotiable: a 404 page that returns `index:true`
// teaches crawlers that arbitrary URLs at this host are valid, which
// dilutes crawl budget and can surface broken pages in search results.
// The default Next.js 404 inherited the root layout's
// `robots: { index: true, follow: true }` and would have indexed; this
// override flips both to false.
export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: false },
  // No canonical on 404 - crawlers should NOT pin this URL.
  alternates: { canonical: undefined },
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-sv-darker">
      <Header />

      <section className="flex-1 flex items-center justify-center px-6 py-20 md:py-28">
        <div className="max-w-2xl w-full text-center">
          <p className="text-sm font-cw-bold uppercase tracking-[0.18em] text-uk-teal-dark">
            404
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-cw-bold text-uk-navy leading-tight">
            Page not found
          </h1>
          <p className="mt-6 text-base md:text-lg font-cw-regular text-uk-slate leading-relaxed">
            The page you are looking for might have moved, been retired, or
            never existed. Use one of the links below to get back on track.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-12 px-6 text-sm font-cw-bold rounded-full bg-uk-teal-dark text-white hover:bg-uk-teal transition-colors"
            >
              Back to homepage
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center h-12 px-6 text-sm font-cw-bold rounded-full border border-uk-line bg-white text-uk-navy hover:border-uk-teal/40 transition-colors"
            >
              Contact support
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-left">
            {[
              { label: 'Solutions', href: '/solutions' },
              { label: 'Case Studies', href: '/cases' },
              { label: 'About Solavita', href: '/about-us' },
              { label: 'Blog', href: '/blog' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-2xl border border-uk-line bg-white px-4 py-4 text-sm font-cw-bold text-uk-navy hover:border-uk-teal/40 hover:bg-uk-teal-soft/40 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}