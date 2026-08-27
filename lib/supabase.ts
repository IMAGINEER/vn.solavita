import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization — Next.js evaluates this module during the build to collect
// page data, but env vars aren't injected in the build environment. Creating the
// client at module load would throw and fail the build. We defer creation to first
// access and cache the singleton.
let _client: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (_client) return _client
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Supabase env vars missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the runtime environment (Netlify → Site settings → Environment variables).'
    )
  }
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return _client
}

// Proxy preserves the existing `supabase.from(...)` call sites — every property
// access goes through getSupabase(), so the client is created on first use.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(client) : value
  },
})