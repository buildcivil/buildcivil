import { NextResponse } from 'next/server'
import {
  checkRateLimit,
  enforceSameOrigin,
  getClientIp,
  isValidEmail,
  rateLimitError,
} from '@buildcivil/cms/request-security'
import { generateRenovaiteDesigns, isRenovaiteAiConfigured } from '@/lib/renovaite/generate-designs'
import { isSupabaseConfigured, supabaseRequest } from '@buildcivil/cms/supabase-admin'

export const runtime = 'nodejs'
export const maxDuration = 120

const MAX_IMAGE_BYTES = 8 * 1024 * 1024

function clean(value: FormDataEntryValue | null) {
  return String(value ?? '').trim()
}

async function fileToBase64(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())
  return buffer.toString('base64')
}

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request)
  if (sameOriginError) return sameOriginError

  if (!isRenovaiteAiConfigured()) {
    return NextResponse.json(
      {
        error:
          'Renovaite AI is not configured. Add GEMINI_API_KEY (Google AI Studio) to enable design generation.',
      },
      { status: 503 },
    )
  }

  const ip = getClientIp(request)
  const rateLimit = checkRateLimit({
    namespace: 'renovaite-requests',
    key: ip,
    limit: 4,
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
  const numDesignsRaw = clean(formData.get('numDesigns'))
  const roomImage = formData.get('roomImage')
  const numDesigns = Number.parseInt(numDesignsRaw, 10)

  if (!name || !email || !phone || !roomType || !designStyle || !numDesignsRaw) {
    return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (!(roomImage instanceof File) || roomImage.size <= 0) {
    return NextResponse.json({ error: 'Please upload a room image.' }, { status: 400 })
  }

  if (roomImage.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'Please upload an image under 8 MB.' }, { status: 400 })
  }

  if (!roomImage.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Please upload a valid image file.' }, { status: 400 })
  }

  if (![1, 2, 3].includes(numDesigns)) {
    return NextResponse.json({ error: 'Please choose 1, 2, or 3 designs.' }, { status: 400 })
  }

  try {
    const imageBase64 = await fileToBase64(roomImage)
    const designs = await generateRenovaiteDesigns({
      roomType,
      designStyle,
      numDesigns,
      imageBase64,
      mimeType: roomImage.type || 'image/jpeg',
    })

    // Best-effort lead capture — never fail generation if CRM write fails.
    if (isSupabaseConfigured()) {
      try {
        const details = [
          `Renovaite AI design request`,
          `Room type: ${roomType}`,
          `Design style: ${designStyle}`,
          `Number of designs: ${numDesigns}`,
          `Generated: ${designs.length}`,
          `Image: ${roomImage.name || 'uploaded'} (${Math.round(roomImage.size / 1024)} KB)`,
        ].join(' | ')

        await supabaseRequest('/rest/v1/service_enquiries', {
          method: 'POST',
          headers: { Prefer: 'return=minimal' },
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
      } catch (leadError) {
        console.error('Renovaite lead save skipped:', leadError)
      }
    }

    return NextResponse.json({
      ok: true,
      designs: designs.map((design) => ({
        id: design.id,
        caption: design.caption,
        mimeType: design.mimeType,
        imageDataUrl: `data:${design.mimeType};base64,${design.imageBase64}`,
      })),
    })
  } catch (error) {
    console.error('Renovaite generate error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to generate Renovaite designs right now. Please try again.',
      },
      { status: 500 },
    )
  }
}
