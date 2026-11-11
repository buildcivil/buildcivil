'use client'

import { type FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, ShoppingBag } from 'lucide-react'
import { readJsonResponse } from '@buildcivil/cms/safe-json'
import { formatPrice, PAYMENT_LABELS, type PaymentMethod } from '@buildcivil/cms/store'
import { useCart } from './CartProvider'
import QuoteButton from './QuoteModal'

const inputClass =
  'w-full rounded-2xl border border-[#73A5CA]/25 bg-white px-4 py-3 text-sm text-[#1c1712] outline-none transition placeholder:text-[#8b7e74] focus:border-[#E87F24] focus:ring-2 focus:ring-[#E87F24]/20'

export default function CheckoutPageClient() {
  const { items, ready, subtotal, clear } = useCart()
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', notes: '', website: '',
  })
  const [payment, setPayment] = useState<PaymentMethod>('cod')
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((current) => ({ ...current, [key]: e.target.value }))

  if (!ready) return <div className="mx-auto max-w-5xl px-6 py-24 text-center text-[#6e6256]">Loading…</div>

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-[#E87F24]" />
        <h1 className="mt-6">Nothing to check out yet</h1>
        <Link href="/store" className="btn-primary mt-8 inline-flex items-center gap-2 px-6 py-3.5 text-sm">Browse products <ArrowRight size={16} /></Link>
      </div>
    )
  }

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const response = await fetch('/api/store/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          paymentMethod: payment,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      })
      const payload = await readJsonResponse<{ error?: string; orderNumber?: string }>(response, {})
      if (!response.ok || !payload.orderNumber) throw new Error(payload.error || 'Could not place your order.')
      clear()
      router.push(`/store/order-confirmation?order=${encodeURIComponent(payload.orderNumber)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place your order.')
      setStatus('idle')
    }
  }

  const quoteItems = items.map((item) => ({ productId: item.productId, name: item.name, quantity: item.quantity, unit: item.unit, price: item.price }))

  return (
    <form onSubmit={placeOrder} className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10 lg:px-16">
      <h1>Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#73A5CA]/14 bg-white p-6 shadow-[0_12px_32px_rgba(28,23,18,0.06)]">
            <h2 className="text-xl">Contact details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input className={`${inputClass} sm:col-span-2`} placeholder="Full name *" required value={form.name} onChange={set('name')} autoComplete="name" />
              <input className={inputClass} type="email" placeholder="Email *" required value={form.email} onChange={set('email')} autoComplete="email" />
              <input className={inputClass} type="tel" placeholder="Phone *" required value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </div>
          </section>

          <section className="rounded-[28px] border border-[#73A5CA]/14 bg-white p-6 shadow-[0_12px_32px_rgba(28,23,18,0.06)]">
            <h2 className="text-xl">Delivery address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <textarea className={`${inputClass} min-h-[88px] sm:col-span-2`} placeholder="Site / delivery address *" required value={form.address} onChange={set('address')} autoComplete="street-address" />
              <input className={inputClass} placeholder="City *" required value={form.city} onChange={set('city')} autoComplete="address-level2" />
              <input className={inputClass} placeholder="State" value={form.state} onChange={set('state')} autoComplete="address-level1" />
              <input className={inputClass} placeholder="PIN code *" required inputMode="numeric" pattern="[0-9]{6}" title="6-digit PIN code" value={form.pincode} onChange={set('pincode')} autoComplete="postal-code" />
              <textarea className={`${inputClass} min-h-[88px] sm:col-span-2`} placeholder="Order notes (optional) — unloading access, preferred delivery date…" value={form.notes} onChange={set('notes')} />
            </div>
          </section>

          <section className="rounded-[28px] border border-[#73A5CA]/14 bg-white p-6 shadow-[0_12px_32px_rgba(28,23,18,0.06)]">
            <h2 className="text-xl">Payment</h2>
            <div className="mt-5 space-y-3">
              {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((method) => (
                <label key={method} className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition ${payment === method ? 'border-[#E87F24] bg-[#FFF3E5]/60' : 'border-[#73A5CA]/22'}`}>
                  <input type="radio" name="payment" className="mt-1 accent-[#E87F24]" checked={payment === method} onChange={() => setPayment(method)} />
                  <span>{PAYMENT_LABELS[method]}</span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-[#8b7e74]">No payment is taken online. Our team confirms availability, delivery charges and GST, then contacts you to complete payment.</p>
          </section>
        </div>

        <aside className="h-fit rounded-[28px] border border-[#73A5CA]/14 bg-white p-6 shadow-[0_20px_60px_rgba(28,23,18,0.09)] lg:sticky lg:top-40">
          <h2 className="text-xl">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3">
                <span className="text-[#1c1712]">{item.name} <span className="text-[#8b7e74]">× {item.quantity}</span></span>
                <span className="shrink-0 font-semibold">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-[#73A5CA]/14 pt-4 text-base">
            <span className="font-semibold">Estimated total</span>
            <span className="font-black">{formatPrice(subtotal)}</span>
          </div>
          <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={form.website} onChange={set('website')} />
          {error ? <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm text-orange-800">{error}</p> : null}
          {/* Place order + Get a Quote, side by side */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="submit" disabled={status === 'submitting'} className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm disabled:opacity-60">
              {status === 'submitting' ? <Loader2 size={16} className="animate-spin" /> : null}
              Place order
            </button>
            <QuoteButton
              items={quoteItems}
              source="checkout"
              className="btn-secondary inline-flex items-center justify-center gap-2 rounded-full px-4 py-3.5 text-sm font-semibold"
            />
          </div>
          <Link href="/store/cart" className="mt-4 block text-center text-sm font-semibold text-[#5d8fb2] hover:text-[#E87F24]">← Back to cart</Link>
        </aside>
      </div>
    </form>
  )
}
