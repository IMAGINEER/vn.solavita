import crypto from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { AdminUser, AdminRole } from '@/lib/auth-types'

export type { AdminUser, AdminRole } from '@/lib/auth-types'

// UK admin session cookie is deliberately separate from DE's
// `sv_admin_session` - UK uses `uk_admin_session`, scoped to /admin so
// the cookie never leaks to the storefront. Logging in on DE does not
// authenticate UK, and vice versa. Cross-row isolation is enforced by:
//   1. Different cookie name (no shared cookie state in the browser).
//   2. `path: '/admin'` (cookie only sent for /admin/* requests).
//   3. Different session tables (`admin_sessions` rows live in the
//      same Supabase project but tokens are UUIDv4 - even if a UK
//      cookie were somehow set on the DE domain, the lookup would
//      miss because DE sessions are written to DE-side rows only).
const SESSION_COOKIE = 'uk_admin_session'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const SESSION_COOKIE_PATH = '/admin'

// ── Password hashing (scrypt) ───────────────────────────────────────────────

const SCRYPT_KEYLEN = 64

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const expected = crypto.scryptSync(password, salt, SCRYPT_KEYLEN)
  const actual = Buffer.from(hash, 'hex')
  if (expected.length !== actual.length) return false
  return crypto.timingSafeEqual(expected, actual)
}

// ── Session helpers ─────────────────────────────────────────────────────────

async function createSession(userId: string): Promise<string> {
  const token = crypto.randomUUID()
  const { error } = await supabase.from('admin_sessions').insert({
    admin_user_id: userId,
    token,
    expires_at: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  })
  if (error) throw new Error(`createSession failed: ${error.message}`)
  return token
}

async function deleteSession(token: string): Promise<void> {
  await supabase.from('admin_sessions').delete().eq('token', token)
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null

  const { data, error } = await supabase
    .from('admin_sessions')
    .select(
      'expires_at, admin_users!inner(id, username, role, is_active)',
    )
    .eq('token', token)
    .maybeSingle()

  if (error) {
    console.error('❌ getCurrentAdmin session query error:', error)
    return null
  }
  if (!data) return null
  if (new Date(data.expires_at).getTime() < Date.now()) return null

  // Supabase returns admin_users as either an object (single FK) or
  // an array - guard for the single-row case.
  const user = Array.isArray(data.admin_users)
    ? data.admin_users[0]
    : (data.admin_users as Record<string, unknown> | null)
  if (!user) return null

  return {
    id: user.id as string,
    username: user.username as string,
    role: (user.role as AdminRole) ?? 'admin',
    isActive: Boolean(user.is_active),
  }
}

// ── Guards ──────────────────────────────────────────────────────────────────

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentAdmin()
  if (!user || !user.isActive) redirect('/admin/login')
  return user
}

export async function requireApiAdmin(): Promise<
  { user: AdminUser } | { response: NextResponse }
> {
  const user = await getCurrentAdmin()
  if (!user || !user.isActive) {
    return {
      response: NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      ),
    }
  }
  return { user }
}

// ── Cookie helpers ──────────────────────────────────────────────────────────

export function sessionCookieName(): string {
  return SESSION_COOKIE
}

export function makeSessionCookie(token: string): {
  name: string
  value: string
  httpOnly: boolean
  secure: boolean
  sameSite: 'lax'
  path: string
  maxAge: number
} {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    // path: '/admin' so the cookie is only attached to admin requests
    // - never leaks to the storefront or to other Next apps on the
    // same domain (e.g. if a /storefront ever lives at the root).
    path: SESSION_COOKIE_PATH,
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  }
}

export { createSession, deleteSession }