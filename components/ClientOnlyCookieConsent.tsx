'use client'

import { useEffect, useState } from 'react'
import CookieConsent from '@/components/CookieConsent'

export default function ClientOnlyCookieConsent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <CookieConsent />
}