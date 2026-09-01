import { NextRequest, NextResponse } from 'next/server'
import {
  createSession,
  makeSessionCookie,
  verifyPassword,
} from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'invalid_json' },
      { status: 400 },
    )
  }

  const username = (body.username || '').trim()
  const password = body.password || ''

  if (!username || !password) {
    return NextResponse.json(
      { success: false, error: 'username_and_password_required' },
      { status: 400 },
    )
  }

  const { data: user, error } = await supabase
    .from('admin_users')
    .select('id, username, password_hash, role, is_active')
    .eq('username', username)
    .maybeSingle()

  if (error || !user) {
    return NextResponse.json(
      { success: false, error: 'invalid_credentials' },
      { status: 401 },
    )
  }

  if (!user.is_active) {
    return NextResponse.json(
      { success: false, error: 'account_disabled' },
      { status: 403 },
    )
  }

  if (!verifyPassword(password, user.password_hash)) {
    return NextResponse.json(
      { success: false, error: 'invalid_credentials' },
      { status: 401 },
    )
  }

  const token = await createSession(user.id)
  const cookie = makeSessionCookie(token)

  const response = NextResponse.json({ success: true, role: user.role })
  response.cookies.set(cookie.name, cookie.value, {
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite,
    path: cookie.path,
    maxAge: cookie.maxAge,
  })
  return response
}