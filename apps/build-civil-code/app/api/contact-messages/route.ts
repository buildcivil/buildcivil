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
    return NextResponse.json({ error: 'Contact message storage is not configured.' }, { status: 503 })
  }

  const body = (await request.json()) as Record<string, unknown>
  if (extractHoneypot(body)) {
    return NextResponse.json({ ok: true })
  }

  const ip = getClientIp(request)
  const rateLimit = checkRateLimit({
    namespace: 'contact-messages',
    key: ip,
    limit: 5,
    windowMs: 10 * 60 * 1000,
  })
  if (!rateLimit.ok) {
    return rateLimitError('Too many contact requests. Please try again shortly.', rateLimit.retryAfterSeconds)
  }

  const name = clean(body.name)
  const email = clean(body.email).toLowerCase()
  const phone = clean(body.phone)
  const projectType = clean(body.project_type)
  const details = clean(body.details)

  if (!name || !email || !phone || !projectType || !details) {
    return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const rows = await supabaseRequest('/rest/v1/contact_messages', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      phone,
      project_type: projectType,
      details,
      status: 'new',
    }),
    headers: {
      Prefer: 'return=representation',
    },
  })

  return NextResponse.json({ ok: true, rows })
}
