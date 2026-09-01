import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deleteSession, sessionCookieName } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST() {
  const store = await cookies()
  const token = store.get(sessionCookieName())?.value
  if (token) {
    await deleteSession(token).catch(() => {})
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(sessionCookieName(), '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: 0,
  })
  return response
}