/**
 * ImagePlaceholder — neutral visual block used for every `IMAGE TBD — …`
 * reference in the Nigeria content briefs.
 *
 * Spec (per NG content strategy):
 *  - Light neutral background.
 *  - Dashed border.
 *  - Image icon.
 *  - Short description of the intended image.
 *  - Preserves the original container dimensions / aspect ratio /
 *    responsive behaviour / crop / layout.
 *
 * Usage:
 *  - The parent MUST provide width, height OR aspectRatio so the
 *    placeholder matches the original image's box.
 *  - Pass `description` exactly as the brief wrote it (e.g. "Nigerian
 *    family in a contemporary home with a visible rooftop solar
 *    system"). The component prepends "IMAGE TBD — " so QA and
 *    crawlers see a single, consistent prefix.
 *  - The `aria-label` is the full "IMAGE TBD — <description>" string,
 *    matching what an alt attribute would have said.
 */

import { ImageIcon } from 'lucide-react'

export interface ImagePlaceholderProps {
  description: string
  className?: string
  /** Aspect ratio as `width / height`, e.g. '16/9', '4/3', '1/1'. */
  aspectRatio?: string
  /** Explicit width / height (CSS values, e.g. '320px', '100%'). */
  width?: string
  height?: string
  /** Optional override for the description label. */
  label?: string
}

export default function ImagePlaceholder({
  description,
  className = '',
  aspectRatio,
  width,
  height,
  label,
}: ImagePlaceholderProps) {
  const style: React.CSSProperties = {
    aspectRatio: aspectRatio ?? undefined,
    width: width ?? undefined,
    height: height ?? undefined,
  }
  return (
    <div
      className={`relative w-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-center px-6 py-10 ${className}`.trim()}
      style={style}
      role="img"
      aria-label={`IMAGE TBD — ${description}`}
      data-image-tbd="true"
    >
      <div className="flex flex-col items-center gap-3 max-w-md">
        <div
          className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center"
          aria-hidden="true"
        >
          <ImageIcon className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
        </div>
        <p className="text-xs font-cw-bold uppercase tracking-wider text-red-600">
          IMAGE TBD
        </p>
        <p className="text-sm text-slate-500 font-cw-regular leading-relaxed">
          {description}
        </p>
        {label && (
          <p className="text-[11px] text-slate-400 font-cw-regular mt-1">
            {label}
          </p>
        )}
      </div>
    </div>
  )
}
