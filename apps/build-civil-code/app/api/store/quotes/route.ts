import { NextResponse } from 'next/server'
import { checkRateLimit, enforceSameOrigin, extractHoneypot, getClientIp, isValidEmail, rateLimitError } from '@buildcivil/cms/request-security'
import { getStoreProductsByIds } from '@buildcivil/cms/store'
import { isSupabaseConfigured, supabaseRequest } from '@buildcivil/cms/supabase-admin'

const clean = (value: unknown, max = 500) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request)
  if (sameOriginError) return sameOriginError

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Quote requests are not available right now.' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
  if (extractHoneypot(body)) return NextResponse.json({ ok: true })

  const rateLimit = checkRateLimit({ namespace: 'store-quotes', key: getClientIp(request), limit: 6, windowMs: 10 * 60 * 1000 })
  if (!rateLimit.ok) return rateLimitError('Too many quote requests. Please try again shortly.', rateLimit.retryAfterSeconds)

  const name = clean(body.name, 120)
  const email = clean(body.email, 160).toLowerCase()
  const phone = clean(body.phone, 30)
  if (!name || !email || !phone) return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 })
  if (!isValidEmail(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })

  const requested = Array.isArray(body.items) ? body.items.slice(0, 100) : []
  const lines = requested
    .map((line) => ({
      productId: clean((line as Record<string, unknown>)?.productId, 80),
      quantity: Math.floor(Number((line as Record<string, unknown>)?.quantity)),
    }))
    .filter((line) => line.productId && Number.isFinite(line.quantity) && line.quantity > 0 && line.quantity <= 100000)

  let items: { productId: string; name: string; unit: string; price: number; quantity: number }[] = []
  if (lines.length) {
    try {
      const products = await getStoreProductsByIds(lines.map((line) => line.productId))
      items = lines.flatMap((line) => {
        const product = products.find((item) => item.id === line.productId)
        return product ? [{ productId: product.id, name: product.name, unit: product.unit, price: product.price, quantity: line.quantity }] : []
      })
    } catch {
      return NextResponse.json({ error: 'Could not verify the items. Please try again.' }, { status: 502 })
    }
  }

  try {
    await supabaseRequest('/rest/v1/store_quote_requests', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        phone,
        message: clean(body.message, 2000),
        items,
        estimated_total: Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100,
        source: clean(body.source, 40) || 'store',
        status: 'new',
      }),
      headers: { Prefer: 'return=minimal' },
      expectJson: false,
    })
  } catch {
    return NextResponse.json({ error: 'Could not send your request. Please try again or contact us.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
