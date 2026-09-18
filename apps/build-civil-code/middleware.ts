import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_HOST,
  ADMIN_SESSION_COOKIE,
  getAdminHomePath,
  hasValidAdminSessionCookie,
  isAdminAuthConfigured,
} from '@/lib/admin-session'

function isProtectedRoute(pathname: string) {
  return pathname.startsWith('/admin/') || pathname.startsWith('/api/admin')
}

export async function middleware(request: NextRequest) {
  const hostname = (request.headers.get('host') || '').split(':')[0]
  const isAdminHost = hostname === ADMIN_HOST

  const url = request.nextUrl.clone()

  // Serve the admin dashboard at the root of its own subdomain instead of requiring /admin.
  if (isAdminHost && !url.pathname.startsWith('/admin') && !url.pathname.startsWith('/api/')) {
    url.pathname = url.pathname === '/' ? '/admin' : `/admin${url.pathname}`
  }

  const rewritten = url.pathname !== request.nextUrl.pathname
  const respond = () => {
    const response = rewritten ? NextResponse.rewrite(url) : NextResponse.next()
    if (isAdminHost) response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  if (!isAdminAuthConfigured()) {
    return respond()
  }

  const pathname = url.pathname

  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/admin/auth') || pathname.startsWith('/api/admin/logout')) {
    if (pathname.startsWith('/admin/login')) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = getAdminHomePath(hostname)
      redirectUrl.search = ''
      return NextResponse.redirect(redirectUrl)
    }
    return respond()
  }

  if (!isProtectedRoute(pathname)) {
    return respond()
  }

  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (await hasValidAdminSessionCookie(sessionCookie)) {
    return respond()
  }

  if (pathname.startsWith('/api/admin')) {
    return new NextResponse(
      JSON.stringify({
        error: 'Authentication required.',
        login: getAdminHomePath(hostname),
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = getAdminHomePath(hostname)
  redirectUrl.searchParams.set('from', request.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
