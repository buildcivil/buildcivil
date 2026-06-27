import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { requireAdminPermission } from '@/lib/admin-access'

const defaultPaths = ['/', '/about', '/services', '/projects', '/contact', '/admin']

export async function POST(request: Request) {
  const access = await requireAdminPermission(request, 'revalidate')
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

  let paths = defaultPaths

  try {
    const body = (await request.json()) as { paths?: unknown }
    if (Array.isArray(body.paths)) {
      const safePaths = body.paths.filter((path): path is string => typeof path === 'string' && path.startsWith('/'))
      if (safePaths.length) paths = safePaths
    }
  } catch {
    paths = defaultPaths
  }

  for (const path of paths) {
    revalidatePath(path)
  }

  return NextResponse.json({ ok: true, paths })
}
