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
    return NextResponse.json({ error: 'Package quote storage is not configured.' }, { status: 503 })
  }

  const body = (await request.json()) as Record<string, unknown>
  if (extractHoneypot(body)) {
    return NextResponse.json({ ok: true })
  }

  const ip = getClientIp(request)
  const rateLimit = checkRateLimit({
    namespace: 'package-quotes',
    key: ip,
    limit: 5,
    windowMs: 10 * 60 * 1000,
  })
  if (!rateLimit.ok) {
    return rateLimitError('Too many quote requests. Please try again shortly.', rateLimit.retryAfterSeconds)
  }

  const name = clean(body.name)
  const email = clean(body.email).toLowerCase()
  const phone = clean(body.phone)
  const planName = clean(body.plan_name)
  const startTimeline = clean(body.start_timeline)
  const packageId = clean(body.package_id)

  if (!name || !email || !phone || !planName) {
    return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const rows = await supabaseRequest('/rest/v1/package_quote_requests', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      phone,
      plan_name: planName,
      package_id: packageId || null,
      start_timeline: startTimeline,
      source: clean(body.source) || 'home_plan_quote',
      status: 'new',
    }),
    headers: {
      Prefer: 'return=representation',
    },
  })

  return NextResponse.json({ ok: true, rows })
}
