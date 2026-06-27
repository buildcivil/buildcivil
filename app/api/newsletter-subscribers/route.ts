import { NextResponse } from 'next/server'
import { checkRateLimit, enforceSameOrigin, extractHoneypot, getClientIp, isValidEmail, rateLimitError } from '@/lib/request-security'
import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-admin'

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request)
  if (sameOriginError) return sameOriginError

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Newsletter storage is not configured.' }, { status: 503 })
  }

  const body = (await request.json()) as Record<string, unknown>
  if (extractHoneypot(body)) {
    return NextResponse.json({ ok: true })
  }

  const ip = getClientIp(request)
  const rateLimit = checkRateLimit({
    namespace: 'newsletter',
    key: ip,
    limit: 4,
    windowMs: 10 * 60 * 1000,
  })
  if (!rateLimit.ok) {
    return rateLimitError('Too many subscription attempts. Please try again shortly.', rateLimit.retryAfterSeconds)
  }

  const email = clean(body.email).toLowerCase()
  const source = clean(body.source) || 'footer'

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const rows = await supabaseRequest('/rest/v1/newsletter_subscribers?on_conflict=email', {
    method: 'POST',
    body: JSON.stringify({
      email,
      source,
      status: 'active',
    }),
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
  })

  return NextResponse.json({ ok: true, rows })
}
