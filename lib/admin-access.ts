import { ADMIN_SESSION_COOKIE, getAdminSessionFromCookie, type AdminSession } from '@/lib/admin-session'

export type AdminPermission =
  | 'overview'
  | 'pages'
  | 'projects'
  | 'services'
  | 'packages'
  | 'media'
  | 'leads'
  | 'settings'
  | 'theme'
  | 'forms'
  | 'users'
  | 'revalidate'
  | 'seo'

const rolePermissions: Record<string, AdminPermission[]> = {
  super_admin: ['overview', 'pages', 'projects', 'services', 'packages', 'media', 'leads', 'settings', 'theme', 'forms', 'users', 'revalidate', 'seo'],
  admin: ['overview', 'pages', 'projects', 'services', 'packages', 'media', 'leads', 'settings', 'theme', 'forms', 'revalidate', 'seo'],
  content_manager: ['overview', 'pages', 'projects', 'services', 'packages', 'media', 'settings', 'theme', 'forms', 'revalidate', 'seo'],
  project_manager: ['overview', 'projects', 'services', 'media', 'revalidate', 'seo'],
  media_manager: ['overview', 'media'],
  leads_manager: ['overview', 'leads'],
  editor: ['overview', 'pages', 'projects', 'services', 'media', 'revalidate', 'seo'],
}

export function getCookieValue(request: Request, name: string) {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const cookies = cookieHeader.split(';').map((part) => part.trim())
  const cookie = cookies.find((part) => part.startsWith(`${name}=`))
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null
}

export async function getAdminSession(request: Request): Promise<AdminSession | null> {
  return getAdminSessionFromCookie(getCookieValue(request, ADMIN_SESSION_COOKIE))
}

export async function hasAdminPermission(request: Request, permission: AdminPermission) {
  const session = await getAdminSession(request)
  if (!session) return false
  return (rolePermissions[session.role] ?? rolePermissions.editor).includes(permission)
}

export async function requireAdminPermission(request: Request, permission: AdminPermission) {
  const session = await getAdminSession(request)
  if (!session) {
    return {
      ok: false as const,
      status: 401,
      error: 'Please login to access the admin dashboard.',
      session: null,
    }
  }

  if (!(rolePermissions[session.role] ?? rolePermissions.editor).includes(permission)) {
    return {
      ok: false as const,
      status: 403,
      error: 'This admin role does not have access to this section.',
      session,
    }
  }

  return { ok: true as const, session }
}
