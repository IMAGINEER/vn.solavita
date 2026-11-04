'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/admin'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const j = await res.json()
      if (!res.ok || !j.success) {
        setError(translate(j.error) || `Đăng nhập thất bại (${res.status})`)
        setBusy(false)
        return
      }
      router.push(next)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi kết nối mạng')
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white border border-uk-line shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex size-9 items-center justify-center rounded-lg bg-uk-teal-dark text-white font-cw-bold">
            S
          </div>
          <div>
            <div className="font-cw-bold text-uk-navy text-base">
              Solavita Việt Nam
            </div>
            <div className="text-xs text-uk-slate">Đăng nhập quản trị</div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <Button type="submit" disabled={busy} className="w-full" size="lg">
            {busy ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </div>
    </main>
  )
}

// Server returns short error codes; render them with i18n-friendly copy.
function translate(code: string | undefined): string | null {
  switch (code) {
    case 'invalid_credentials':
      return 'Tên đăng nhập hoặc mật khẩu không đúng.'
    case 'account_disabled':
      return 'Tài khoản này đã bị vô hiệu hoá.'
    case 'username_and_password_required':
      return 'Vui lòng nhập cả tên đăng nhập và mật khẩu.'
    case 'invalid_json':
      return 'Đã có lỗi xảy ra - vui lòng thử lại.'
    default:
      return code ? `Đăng nhập thất bại: ${code}` : null
  }
}