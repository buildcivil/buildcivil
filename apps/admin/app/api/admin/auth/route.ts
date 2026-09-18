import { NextResponse } from 'next/server'
import { verifyAdminUser } from '@/lib/admin-users'
import { getAdminSession } from '@/lib/admin-access'
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  isAdminAuthConfigured,
} from '@/lib/admin-session'
import { checkRateLimit, enforceSameOrigin, getClientIp, rateLimitError } from '@buildcivil/cms/request-security'
import { isSupabaseConfigured } from '@buildcivil/cms/supabase-admin'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const session = await getAdminSession(request)

  if (!session) {
    return NextResponse.json({ authenticated: false, error: 'Please login to access the admin dashboard.' }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true, session })
}

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request)
  if (sameOriginError) return sameOriginError

  if (!isAdminAuthConfigured()) {
    const url = new URL('/', request.url)
    url.searchParams.set('config', '1')
    return NextResponse.redirect(url)
  }

  const formData = await request.formData()
  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const ip = getClientIp(request)

  const loginRate = checkRateLimit({
    namespace: 'admin-login-ip',
    key: ip,
    limit: 10,
    windowMs: 15 * 60 * 1000,
  })
  if (!loginRate.ok) {
    return rateLimitError('Too many login attempts. Please wait a few minutes and try again.', loginRate.retryAfterSeconds)
  }

  const usernameRate = checkRateLimit({
    namespace: 'admin-login-user',
    key: `${ip}:${username.toLowerCase()}`,
    limit: 6,
    windowMs: 15 * 60 * 1000,
  })
  if (!usernameRate.ok) {
    return rateLimitError('Too many login attempts for this account. Please wait and try again.', usernameRate.retryAfterSeconds)
  }

  let adminSession: { email: string; role: string } | null = null

  if (isSupabaseConfigured()) {
    try {
      const user = await verifyAdminUser(username, password)
      if (user) adminSession = { email: user.email, role: user.role }
    } catch {
      adminSession = null
    }
  }

  if (!adminSession) {
    const url = new URL('/', request.url)
    url.searchParams.set('error', '1')
    return NextResponse.redirect(url)
  }

  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: await createAdminSessionValue(adminSession),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  return response
}
