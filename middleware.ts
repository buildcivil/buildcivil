import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_SESSION_COOKIE,
  hasValidAdminSessionCookie,
  isAdminAuthConfigured,
} from '@/lib/admin-session'

function isProtectedRoute(pathname: string) {
  return pathname.startsWith('/admin/') || pathname.startsWith('/api/admin')
}

export async function middleware(request: NextRequest) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/admin/auth') || pathname.startsWith('/api/admin/logout')) {
    if (pathname.startsWith('/admin/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      url.search = ''
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  if (!isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (await hasValidAdminSessionCookie(sessionCookie)) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/admin')) {
    return new NextResponse(
      JSON.stringify({
        error: 'Authentication required.',
        login: '/admin',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  const url = request.nextUrl.clone()
  url.pathname = '/admin'
  url.searchParams.set('from', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
