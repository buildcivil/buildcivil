'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { formatPrice } from '@buildcivil/cms/store'
import { useCart } from './CartProvider'
import QuoteButton from './QuoteModal'

export default function CartPageClient() {
  const { items, ready, subtotal, setQuantity, removeItem, clear } = useCart()

  if (!ready) return <div className="mx-auto max-w-5xl px-6 py-24 text-center text-[#6e6256]">Loading your cart…</div>

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-[#E87F24]" />
        <h1 className="mt-6">Your cart is empty</h1>
        <p className="mt-4 text-[#6e6256]">Browse our catalog, or tell us what you need and we will send a custom quote.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/store" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-sm">Browse products <ArrowRight size={16} /></Link>
          <QuoteButton items={[]} source="cart-empty" />
        </div>
      </div>
    )
  }

  const quoteItems = items.map((item) => ({ productId: item.productId, name: item.name, quantity: item.quantity, unit: item.unit, price: item.price }))

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10 lg:px-16">
      <div className="flex items-end justify-between gap-4">
        <h1>Your cart</h1>
        <button type="button" onClick={clear} className="text-sm font-semibold text-[#8b7e74] hover:text-[#E87F24]">Clear cart</button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 rounded-[24px] border border-[#73A5CA]/14 bg-white p-4 shadow-[0_12px_32px_rgba(28,23,18,0.06)] sm:gap-6 sm:p-5">
              <Link href={`/store/products/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#FEFDDF] sm:h-28 sm:w-28">
                {item.image ? <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" /> : null}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/store/products/${item.slug}`} className="font-semibold leading-snug text-[#1c1712] hover:text-[#E87F24]">{item.name}</Link>
                  <button type="button" onClick={() => removeItem(item.productId)} aria-label={`Remove ${item.name}`} className="shrink-0 text-[#8b7e74] hover:text-[#E87F24]"><Trash2 size={18} /></button>
                </div>
                <div className="mt-1 text-sm text-[#6e6256]">{formatPrice(item.price)} / {item.unit}</div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <div className="inline-flex items-center rounded-full border border-[#73A5CA]/25">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(item.productId, item.quantity - 1)} className="p-2.5 hover:text-[#E87F24]"><Minus size={14} /></button>
                    <input
                      aria-label={`Quantity for ${item.name}`}
                      type="number"
                      min={item.minOrderQty}
                      value={item.quantity}
                      onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                      className="w-14 bg-transparent text-center text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(item.productId, item.quantity + 1)} className="p-2.5 hover:text-[#E87F24]"><Plus size={14} /></button>
                  </div>
                  <div className="text-lg font-black text-[#1c1712]">{formatPrice(item.price * item.quantity)}</div>
                </div>
                {item.minOrderQty > 1 ? <div className="mt-1 text-xs text-[#8b7e74]">Minimum order: {item.minOrderQty} {item.unit}</div> : null}
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-[28px] border border-[#73A5CA]/14 bg-white p-6 shadow-[0_20px_60px_rgba(28,23,18,0.09)] lg:sticky lg:top-40">
          <h2 className="text-xl">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-[#6e6256]">Subtotal</dt><dd className="font-semibold">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-[#6e6256]">Delivery</dt><dd className="text-[#6e6256]">Confirmed by our team</dd></div>
            <div className="flex justify-between border-t border-[#73A5CA]/14 pt-3 text-base"><dt className="font-semibold">Estimated total</dt><dd className="font-black">{formatPrice(subtotal)}</dd></div>
          </dl>
          <p className="mt-3 text-xs leading-5 text-[#8b7e74]">Prices exclude GST and delivery charges. We re-verify pricing and availability when you place the order.</p>
          {/* Checkout + Get a Quote, side by side */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link href="/store/checkout" className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm">
              Checkout <ArrowRight size={16} />
            </Link>
            <QuoteButton
              items={quoteItems}
              source="cart"
              className="btn-secondary inline-flex items-center justify-center gap-2 rounded-full px-4 py-3.5 text-sm font-semibold"
            />
          </div>
          <Link href="/store" className="mt-4 block text-center text-sm font-semibold text-[#5d8fb2] hover:text-[#E87F24]">Continue shopping</Link>
        </aside>
      </div>
    </div>
  )
}
