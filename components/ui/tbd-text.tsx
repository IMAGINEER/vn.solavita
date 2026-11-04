/**
 * TbdText — every `TBD — [specific missing information]` placeholder on
 * the Vietnam site renders through this component so the colour, weight
 * and aria semantics are consistent.
 *
 * Rules (per VN content strategy):
 *  - Always pass the full string after `TBD — ` as the `text` prop. The
 *    `TBD — ` prefix is added automatically.
 *  - Default colour is red (text-red-600 in both light and dark mode
 *    via Tailwind v4 utilities). Inline copy keeps the red emphasis;
 *    table cells and accordion bodies accept the same className so a
 *    parent can size or wrap.
 *  - `inline` (default false) renders a block-level <span> with a small
 *    left padding for use in flowing prose. `inline` (true) returns an
 *    inline element that does not break the surrounding line.
 *  - `as` (default 'span') controls the rendered element. Use 'p' or
 *    'div' for paragraph-level TBDs that need their own line.
 *  - Adds `aria-label="Chờ xác nhận"` and `data-tbd="true"` so
 *    QA tooling and crawlers can identify the placeholder.
 */

import type { ElementType, ReactNode } from 'react'

export interface TbdTextProps {
  /**
   * The text after the `TBD — ` prefix. Required. Do NOT pass a value
   * that already starts with `TBD — ` — the prefix is added here.
   */
  text: string
  /** Render inline (true) or as a block (false, default). */
  inline?: boolean
  /** Override the wrapping element. Default 'span'. */
  as?: ElementType
  className?: string
  children?: ReactNode
}

export default function TbdText({
  text,
  inline = false,
  as,
  className = '',
  children,
}: TbdTextProps) {
  const Tag = (as ?? (inline ? 'span' : 'span')) as ElementType
  return (
    <Tag
      className={`text-red-600 font-cw-bold ${className}`.trim()}
      data-tbd="true"
      aria-label="Chờ xác nhận"
    >
      TBD — {text}
      {children}
    </Tag>
  )
}
