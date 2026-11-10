/**
 * Renders a Supabase/PostgREST failure in place of an empty table.
 *
 * Why this exists: every admin list used to do
 *
 *   const { data: rows } = await supabase.from(...).select(...)
 *
 * and ignored `error`. A failed query (a column that has not been
 * created in the shared project yet, a wrong SUPABASE_URL, a network
 * blip) returns `rows === null`, so the page rendered
 * "Chưa có khách hàng tiềm năng nào" — visually identical to
 * "there genuinely are no leads". That is exactly how a broken query
 * hides behind a working dashboard counter.
 *
 * This component makes the failure visible to the operator and states
 * plainly that it is a query error, not an empty result set.
 */
export function DataErrorNotice({
  scope,
  error,
}: {
  /** What failed, in the operator's language — e.g. "khách hàng tiềm năng". */
  scope: string
  error: { message?: string; code?: string; details?: string | null } | null
}) {
  const message = error?.message ?? 'Unknown error'
  const details =
    error?.details && error.details !== message ? error.details : null

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <p className="text-sm font-cw-bold text-red-700">
        Không tải được dữ liệu: {scope}
      </p>
      <p className="mt-2 break-words font-mono text-xs text-uk-navy/80">
        {error?.code ? `[${error.code}] ` : ''}
        {message}
      </p>
      {details ? (
        <p className="mt-1 break-words font-mono text-xs text-uk-navy/60">
          {details}
        </p>
      ) : null}
      <p className="mt-3 text-xs leading-relaxed text-uk-slate">
        Đây là lỗi truy vấn, KHÔNG phải "chưa có dữ liệu". Kiểm tra log máy
        chủ và đối chiếu các migration trong{' '}
        <code className="font-mono">supabase/migrations/</code> với project
        đang cấu hình qua <code className="font-mono">SUPABASE_URL</code>.
      </p>
    </div>
  )
}
