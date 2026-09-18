import { NextResponse } from 'next/server'

type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterSeconds: number
}

const globalStore = globalThis as typeof globalThis & {
  __buildcivilRateLimits?: Map<string, RateLimitEntry>
}

const rateLimitStore = globalStore.__buildcivilRateLimits ?? new Map<string, RateLimitEntry>()
globalStore.__buildcivilRateLimits = rateLimitStore

export function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip')?.trim()
  const ip = forwarded || realIp || 'unknown'
  return ip.slice(0, 120)
}

export function enforceSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return null

  try {
    const requestUrl = new URL(request.url)
    const originUrl = new URL(origin)
    if (originUrl.origin !== requestUrl.origin) {
      return NextResponse.json({ error: 'Cross-site requests are not allowed.' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  return null
}

export function checkRateLimit({
  namespace,
  key,
  limit,
  windowMs,
}: {
  namespace: string
  key: string
  limit: number
  windowMs: number
}): RateLimitResult {
  const now = Date.now()
  const storeKey = `${namespace}:${key}`
  const existing = rateLimitStore.get(storeKey)

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(storeKey, {
      count: 1,
      resetAt: now + windowMs,
    })
    cleanupRateLimits(now)
    return {
      ok: true,
      remaining: Math.max(0, limit - 1),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    }
  }

  if (existing.count >= limit) {
    cleanupRateLimits(now)
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  existing.count += 1
  rateLimitStore.set(storeKey, existing)
  cleanupRateLimits(now)
  return {
    ok: true,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  }
}

function cleanupRateLimits(now: number) {
  if (rateLimitStore.size < 500) return
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) rateLimitStore.delete(key)
  }
}

export function rateLimitError(message: string, retryAfterSeconds: number) {
  return NextResponse.json(
    { error: message, retryAfterSeconds },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
      },
    },
  )
}

export function extractHoneypot(body: Record<string, unknown>) {
  return String(body.website ?? body.company ?? body.bot_field ?? '').trim()
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
