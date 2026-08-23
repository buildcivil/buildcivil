import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { supabaseRequest } from '@/lib/supabase-admin'

type AdminUserRow = {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'editor' | 'content_manager' | 'leads_manager' | 'media_manager' | 'project_manager'
  status: 'active' | 'disabled'
  password_hash: string
  password_salt: string
}

export type VerifiedAdminUser = Pick<AdminUserRow, 'id' | 'email' | 'name' | 'role'>

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString('hex')
}

/** Create a salted scrypt hash suitable for storing on admin_users. */
export function createPasswordCredentials(password: string) {
  const password_salt = randomBytes(16).toString('hex')
  const password_hash = hashPassword(password, password_salt)
  return { password_hash, password_salt }
}

/** Strip password fields from an admin user row before returning to the client. */
export function sanitizeAdminUserRow<T extends Record<string, unknown>>(row: T) {
  const { password_hash: _h, password_salt: _s, password: _p, ...safe } = row as T & {
    password_hash?: unknown
    password_salt?: unknown
    password?: unknown
  }
  return safe
}

function safeCompareHex(left: string, right: string) {
  try {
    const leftBuffer = Buffer.from(left, 'hex')
    const rightBuffer = Buffer.from(right, 'hex')
    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
  } catch {
    return false
  }
}

export async function verifyAdminUser(email: string, password: string): Promise<VerifiedAdminUser | null> {
  const normalizedEmail = email.trim()
  if (!normalizedEmail || !password) return null

  const rows = await supabaseRequest<AdminUserRow[]>(
    `/rest/v1/admin_users?email=eq.${encodeURIComponent(normalizedEmail)}&status=eq.active&select=id,email,name,role,status,password_hash,password_salt&limit=1`,
    {
      method: 'GET',
    },
  )

  const user = rows[0]
  if (!user) return null

  const suppliedHash = hashPassword(password, user.password_salt)
  if (!safeCompareHex(suppliedHash, user.password_hash)) return null

  await supabaseRequest<void>(
    `/rest/v1/admin_users?id=eq.${encodeURIComponent(user.id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ last_login_at: new Date().toISOString() }),
      headers: {
        Prefer: 'return=minimal',
      },
      expectJson: false,
    },
  )

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}
