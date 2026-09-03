import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// PostBody - server-rendered markdown body. Pure presentation: every
// blog post detail page pipes its body_md through this component.
//
// Styles are kept inline as `prose` is not installed in this project.
// The `prose` Tailwind plugin would inject a 70KB stylesheet for one
// use case, so we hand-roll the typography rules here using uk-* tokens.

export function PostBody({ markdown }: { markdown: string }) {
  return (
    <div className="post-prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      <style>{`
        .post-prose h1 { font-size: 2rem; font-weight: 700; color: #0F172A; margin: 2.5rem 0 1rem; line-height: 1.2; }
        .post-prose h2 { font-size: 1.6rem; font-weight: 700; color: #0F172A; margin: 2.25rem 0 0.75rem; line-height: 1.25; }
        .post-prose h3 { font-size: 1.3rem; font-weight: 700; color: #0F172A; margin: 2rem 0 0.5rem; line-height: 1.3; }
        .post-prose h4 { font-size: 1.1rem; font-weight: 700; color: #0F172A; margin: 1.5rem 0 0.5rem; }
        .post-prose p  { font-size: 1.0625rem; line-height: 1.75; color: #334155; margin: 0 0 1.25rem; }
        .post-prose a  { color: #0F766E; text-decoration: underline; text-underline-offset: 3px; }
        .post-prose a:hover { color: #0B5F4F; }
        .post-prose strong { color: #0F172A; font-weight: 700; }
        .post-prose ul, .post-prose ol { margin: 0 0 1.25rem 1.5rem; color: #334155; }
        .post-prose li { margin-bottom: 0.4rem; line-height: 1.7; }
        .post-prose ul li { list-style: disc; }
        .post-prose ol li { list-style: decimal; }
        .post-prose blockquote { border-left: 3px solid #14B8A6; padding: 0.25rem 0 0.25rem 1rem; margin: 1.5rem 0; color: #475569; background: rgba(20, 184, 166, 0.05); border-radius: 0 6px 6px 0; }
        .post-prose code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; background: #F1F5F9; padding: 0.15em 0.35em; border-radius: 4px; font-size: 0.9em; color: #0F172A; }
        .post-prose pre { background: #0F172A; color: #E2E8F0; padding: 1rem 1.25rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0; }
        .post-prose pre code { background: transparent; color: inherit; padding: 0; }
        .post-prose img { max-width: 100%; height: auto; border-radius: 12px; margin: 1.5rem 0; border: 1px solid #E2E8F0; }
        .post-prose hr { border: none; border-top: 1px solid #E2E8F0; margin: 2.5rem 0; }
        .post-prose table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.95rem; }
        .post-prose th, .post-prose td { border: 1px solid #E2E8F0; padding: 0.5rem 0.75rem; text-align: left; }
        .post-prose th { background: #F1F5F9; font-weight: 700; color: #0F172A; }
      `}</style>
    </div>
  )
}