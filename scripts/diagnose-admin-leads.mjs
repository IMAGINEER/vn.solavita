/**
 * Read-only diagnostic for the admin lead count vs. admin lead list.
 *
 * Why: the dashboard counts leads with `select('id', {count, head})`
 * while /admin/leads selects the full column list. When the database
 * is missing one of the later columns, PostgREST rejects the whole
 * list query (42703 "column ... does not exist") but the counter keeps
 * working — so the dashboard shows "2" and the list shows nothing.
 *
 * This script runs both queries side by side and probes every column
 * the VN code depends on. It only ever runs SELECTs.
 *
 *   node scripts/diagnose-admin-leads.mjs
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = {}
for (const line of readFileSync(
  new URL('../.env.local', import.meta.url),
  'utf8',
).split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].trim()
}

const url = env.SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env.local')
  process.exit(1)
}
console.log('Project host:', url.replace(/https:\/\/([^.]+)\..*/, '$1'))

const supabase = createClient(url, key, { auth: { persistSession: false } })

// ── A) the admin dashboard's count query ───────────────────────────────────
const a = await supabase
  .from('consultation_leads')
  .select('id', { count: 'exact', head: true })
  .eq('country', 'vn')
console.log('\n[A] dashboard count ->', {
  count: a.count ?? null,
  error: a.error?.message ?? null,
})

// ── B) the admin/leads list query ──────────────────────────────────────────
const LIST_COLUMNS =
  'id, salutation, first_name, last_name, email, phone, ' +
  'street, house_number, postal_code, city, ' +
  'region, house_type, roof_type, household_size, electricity_usage, ' +
  'devices, plan_token, country, created_at, updated_at, ' +
  'business_profile, ' +
  'plan_sent_at, plan_provider_id, plan_first_opened_at, ' +
  'plan_last_opened_at, plan_confirmed_at'

const b = await supabase
  .from('consultation_leads')
  .select(LIST_COLUMNS)
  .eq('country', 'vn')
  .order('updated_at', { ascending: false })
  .order('created_at', { ascending: false })
console.log('\n[B] leads list ->', {
  rowCount: b.data?.length ?? null,
  error: b.error?.message ?? null,
  code: b.error?.code ?? null,
  details: b.error?.details ?? null,
})
for (const r of b.data ?? []) {
  console.log('    row:', r.id, r.email, r.country, r.created_at)
}

// ── C) every row, grouped by country (isolation check) ────────────────────
const c = await supabase
  .from('consultation_leads')
  .select('id,email,country')
  .limit(500)
console.log('\n[C] shared table by country ->', { error: c.error?.message ?? null })
const byCountry = {}
for (const r of c.data ?? []) {
  const key = r.country ?? '(null)'
  byCountry[key] = (byCountry[key] ?? 0) + 1
}
console.log('    ', byCountry, 'total fetched:', c.data?.length ?? 0)

// ── D) column existence probe ─────────────────────────────────────────────
const COLUMNS = [
  'id', 'plan_token', 'country', 'created_at', 'updated_at',
  'solution_type', 'daytime_usage_ratio', 'business_profile',
  'plan_sent_at', 'plan_provider_id', 'plan_first_opened_at',
  'plan_last_opened_at', 'plan_confirmed_at',
]
console.log('\n[D] column probe:')
for (const col of COLUMNS) {
  const r = await supabase.from('consultation_leads').select(col).limit(1)
  console.log(
    `    ${col.padEnd(22)} ${r.error ? 'MISSING — ' + r.error.message : 'ok'}`,
  )
}
