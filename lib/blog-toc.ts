/**
 * Blog post table-of-contents extraction.
 *
 * Pure-string scan of `body_md` for ATX-style `##` / `###` headings.
 * Skips lines inside fenced code blocks (`` ``` ``) and ignores setext
 * underlines (`===` / `---`); the blog editor emits ATX only.
 *
 * Stable IDs are derived from heading text with the same slugify rules
 * used by the post slug + tag-name helpers elsewhere in this repo, so a
 * heading and the slug of a post whose title matches it produce the
 * same anchor shape. Duplicates are suffixed `-2`, `-3`, ... in document
 * order; the first occurrence keeps the bare slug.
 */

export interface Heading {
  level: 2 | 3
  text: string
  id: string
}

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  const seen = new Map<string, number>()
  let inCodeFence = false

  for (const rawLine of markdown.split('\n')) {
    // Fenced code-block toggle - applies to the line that opens or closes
    // the fence (and the next iteration sees lines until the matching fence).
    if (/^\s*(```|~~~)/.test(rawLine)) {
      inCodeFence = !inCodeFence
      continue
    }
    if (inCodeFence) continue

    // ATX heading: optional leading whitespace, then `##` (H3 is intentionally
    // ignored - the TOC only anchors top-level sections, not subsections,
    // to avoid a noisy multi-level outline).
    const m = /^\s*(#{2})\s+(.+?)\s*#*\s*$/.exec(rawLine)
    if (!m) continue

    const level = m[1].length as 2
    const text = stripInlineMarkdown(m[2].trim())
    if (text.length === 0) continue

    const baseId = slugifyHeading(text)
    if (baseId.length === 0) continue

    const count = seen.get(baseId) ?? 0
    seen.set(baseId, count + 1)
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`
    headings.push({ level, text, id })
  }

  return headings
}

/** Strip the most common emphasis markers so a heading like
 *  `## **Save** up to *50%*` reads as `Save up to 50%` in the TOC. */
function stripInlineMarkdown(s: string): string {
  return s
    .replace(/`+([^`]+)`+/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}