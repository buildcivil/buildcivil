import { NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, getAdminHomePath } from '@/lib/admin-session'

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL(getAdminHomePath(request.headers.get('host')), request.url))
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}
