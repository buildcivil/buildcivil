import { NextResponse } from 'next/server'
import { getFormDefinition } from '@/lib/form-definitions'
import { checkRateLimit, enforceSameOrigin, extractHoneypot, getClientIp, isValidEmail, rateLimitError } from '@/lib/request-security'
import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-admin'

const fallbackValidServices = [
  'Turnkey Construction',
  'Interior & Exterior Design',
  'Renovation & Remodeling',
  'Architectural Planning',
  'Project Management',
  'Basic Package',
  'Classic Package',
  'Royal Package',
  'Other',
]

async function getValidServices() {
  const form = await getFormDefinition('service_enquiry')
  const serviceField = form.fields.find((field) => field.name === 'service' || field.id === 'service')
  const options = serviceField?.options?.length ? serviceField.options : fallbackValidServices
  return new Set(options)
}

function clean(value: unknown) {
  return String(value ?? '').trim()
}

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request)
  if (sameOriginError) return sameOriginError

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: 'Service enquiry storage is not configured.',
      },
      { status: 503 },
    )
  }

  const body = (await request.json()) as Record<string, unknown>
  if (extractHoneypot(body)) {
    return NextResponse.json({ ok: true })
  }

  const ip = getClientIp(request)
  const rateLimit = checkRateLimit({
    namespace: 'service-enquiries',
    key: ip,
    limit: 5,
    windowMs: 10 * 60 * 1000,
  })
  if (!rateLimit.ok) {
    return rateLimitError('Too many enquiry requests. Please try again shortly.', rateLimit.retryAfterSeconds)
  }

  const name = clean(body.name)
  const email = clean(body.email).toLowerCase()
  const phone = clean(body.phone)
  const service = clean(body.service)
  const otherService = clean(body.other_service)
  const source = clean(body.source) || 'home_hero'

  if (!name || !email || !phone || !service) {
    return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const validServices = await getValidServices()

  if (!validServices.has(service)) {
    return NextResponse.json({ error: 'Please select a valid service.' }, { status: 400 })
  }

  if (service === 'Other' && !otherService) {
    return NextResponse.json({ error: 'Please describe the service you need.' }, { status: 400 })
  }

  await supabaseRequest<void>(
    '/rest/v1/service_enquiries',
    {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        phone,
        service,
        other_service: service === 'Other' || otherService ? otherService : '',
        source,
        status: 'new',
      }),
      headers: {
        Prefer: 'return=minimal',
      },
      expectJson: false,
    },
  )

  return NextResponse.json({ ok: true })
}
