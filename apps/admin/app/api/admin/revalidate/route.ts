import { NextResponse } from 'next/server'
import { requireAdminPermission } from '@/lib/admin-access'
import { relayRevalidate } from '@/lib/publish-relay'

const defaultPaths = ['/', '/about', '/services', '/projects', '/contact']

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

  try {
    await relayRevalidate(paths)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to refresh the public site.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true, paths })
}
