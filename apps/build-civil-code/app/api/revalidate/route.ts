import { timingSafeEqual } from 'crypto'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const defaultPaths = ['/', '/about', '/services', '/projects', '/contact']

function isAuthorized(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) return false

  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : ''
  if (!token) return false

  const expected = Buffer.from(secret)
  const provided = Buffer.from(token)
  if (expected.length !== provided.length) return false

  return timingSafeEqual(expected, provided)
}

// Called by the admin app (a separate deployment) to refresh this site's
// cached pages after a content edit — see apps/admin/lib/publish-relay.ts.
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

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
