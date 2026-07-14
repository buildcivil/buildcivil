import { NextResponse } from 'next/server'
import {
  checkRateLimit,
  enforceSameOrigin,
  getClientIp,
  isValidEmail,
  rateLimitError,
} from '@/lib/request-security'
import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-admin'

function clean(value: FormDataEntryValue | null) {
  return String(value ?? '').trim()
}

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request)
  if (sameOriginError) return sameOriginError

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Renovaite request storage is not configured.' }, { status: 503 })
  }

  const ip = getClientIp(request)
  const rateLimit = checkRateLimit({
    namespace: 'renovaite-requests',
    key: ip,
    limit: 5,
    windowMs: 10 * 60 * 1000,
  })
  if (!rateLimit.ok) {
    return rateLimitError('Too many Renovaite requests. Please try again shortly.', rateLimit.retryAfterSeconds)
  }

  const formData = await request.formData()
  const name = clean(formData.get('name'))
  const email = clean(formData.get('email')).toLowerCase()
  const phone = clean(formData.get('phone'))
  const roomType = clean(formData.get('roomType'))
  const designStyle = clean(formData.get('designStyle'))
  const numDesigns = clean(formData.get('numDesigns'))
  const roomImageName = clean(formData.get('roomImageName'))
  const roomImage = formData.get('roomImage')

  if (!name || !email || !phone || !roomType || !designStyle || !numDesigns) {
    return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (!(roomImage instanceof File) || roomImage.size <= 0) {
    return NextResponse.json({ error: 'Please upload a room image.' }, { status: 400 })
  }

  const details = [
    `Renovaite AI design request`,
    `Room type: ${roomType}`,
    `Design style: ${designStyle}`,
    `Number of designs: ${numDesigns}`,
    `Image file: ${roomImageName || roomImage.name || 'uploaded'} (${Math.round(roomImage.size / 1024)} KB)`,
  ].join(' | ')

  try {
    await supabaseRequest('/rest/v1/service_enquiries', {
      method: 'POST',
      headers: {
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        service: 'Other',
        other_service: details.slice(0, 900),
        source: 'renovaite',
        status: 'new',
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Renovaite request error:', error)
    return NextResponse.json({ error: 'Unable to save your Renovaite request right now.' }, { status: 500 })
  }
}
