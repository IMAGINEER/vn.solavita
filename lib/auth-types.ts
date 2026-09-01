// Server auth types for the UK admin. Kept in a separate module so
// client components can import the type without pulling in crypto /
// cookies code from lib/auth.ts.

export type AdminRole = 'admin'

export interface AdminUser {
  id: string
  username: string
  role: AdminRole
  isActive: boolean
}