import { NextResponse } from 'next/server'
import { checkRateLimit, enforceSameOrigin, extractHoneypot, getClientIp, isValidEmail, rateLimitError } from '@buildcivil/cms/request-security'
import { generateOrderNumber, getStoreProductsByIds, type OrderItem } from '@buildcivil/cms/store'
import { isSupabaseConfigured, supabaseRequest } from '@buildcivil/cms/supabase-admin'

const clean = (value: unknown, max = 500) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request)
  if (sameOriginError) return sameOriginError

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Ordering is not available right now.' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
  if (extractHoneypot(body)) return NextResponse.json({ ok: true, orderNumber: 'BC-RECEIVED' })

  const rateLimit = checkRateLimit({ namespace: 'store-orders', key: getClientIp(request), limit: 8, windowMs: 10 * 60 * 1000 })
  if (!rateLimit.ok) return rateLimitError('Too many orders. Please try again shortly.', rateLimit.retryAfterSeconds)

  const customer = {
    name: clean(body.name, 120),
    email: clean(body.email, 160).toLowerCase(),
    phone: clean(body.phone, 30),
    address: clean(body.address, 600),
    city: clean(body.city, 100),
    state: clean(body.state, 100),
    pincode: clean(body.pincode, 10),
    notes: clean(body.notes, 1000),
  }
  if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.city || !customer.pincode) {
    return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 })
  }
  if (!isValidEmail(customer.email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  if (!/^\d{6}$/.test(customer.pincode)) return NextResponse.json({ error: 'Please enter a valid 6-digit PIN code.' }, { status: 400 })

  const paymentMethod = body.paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'cod'

  const requested = Array.isArray(body.items) ? body.items.slice(0, 100) : []
  const lines = requested
    .map((line) => ({
      productId: clean((line as Record<string, unknown>)?.productId, 80),
      quantity: Math.floor(Number((line as Record<string, unknown>)?.quantity)),
    }))
    .filter((line) => line.productId && Number.isFinite(line.quantity) && line.quantity > 0 && line.quantity <= 100000)
  if (!lines.length) return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })

  // Never trust client prices: re-price every line from the database.
  let products
  try {
    products = await getStoreProductsByIds(lines.map((line) => line.productId))
  } catch {
    return NextResponse.json({ error: 'Could not verify your cart. Please try again.' }, { status: 502 })
  }

  const items: OrderItem[] = []
  for (const line of lines) {
    const product = products.find((item) => item.id === line.productId)
    if (!product) return NextResponse.json({ error: 'An item in your cart is no longer available. Please review your cart.' }, { status: 409 })
    if (product.stockStatus === 'out_of_stock') return NextResponse.json({ error: `${product.name} is out of stock.` }, { status: 409 })
    if (line.quantity < product.minOrderQty) return NextResponse.json({ error: `Minimum order for ${product.name} is ${product.minOrderQty} ${product.unit}.` }, { status: 400 })
    items.push({ productId: product.id, slug: product.slug, name: product.name, unit: product.unit, price: product.price, quantity: line.quantity })
  }

  const subtotal = Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100
  const orderNumber = generateOrderNumber()

  try {
    await supabaseRequest('/rest/v1/store_orders', {
      method: 'POST',
      body: JSON.stringify({
        order_number: orderNumber,
        ...customer,
        items,
        subtotal,
        shipping: 0,
        total: subtotal,
        payment_method: paymentMethod,
        status: 'new',
      }),
      headers: { Prefer: 'return=minimal' },
      expectJson: false,
    })
  } catch {
    return NextResponse.json({ error: 'Could not save your order. Please try again or contact us.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, orderNumber })
}
