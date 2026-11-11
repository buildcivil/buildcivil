'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react'
import type { StoreProduct } from '@buildcivil/cms/store'
import { useCart } from './CartProvider'
import QuoteButton from './QuoteModal'

export default function ProductActions({ product }: { product: StoreProduct }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(product.minOrderQty)
  const [added, setAdded] = useState(false)
  const soldOut = product.stockStatus === 'out_of_stock'

  function add() {
    addItem(product, qty)
    setAdded(true)
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex items-center rounded-full border border-[#73A5CA]/25 bg-white">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((v) => Math.max(product.minOrderQty, v - 1))} className="p-3 hover:text-[#E87F24]"><Minus size={16} /></button>
          <input
            aria-label="Quantity"
            type="number"
            min={product.minOrderQty}
            value={qty}
            onChange={(e) => setQty(Math.max(product.minOrderQty, Math.floor(Number(e.target.value)) || product.minOrderQty))}
            className="w-16 bg-transparent text-center text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((v) => v + 1)} className="p-3 hover:text-[#E87F24]"><Plus size={16} /></button>
        </div>
        <span className="text-sm text-[#6e6256]">{product.unit}{product.minOrderQty > 1 ? ` · minimum ${product.minOrderQty}` : ''}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={add} disabled={soldOut} className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-50">
          {added ? <Check size={16} /> : <ShoppingCart size={16} />}
          {soldOut ? 'Out of stock' : added ? 'Added — add more' : 'Add to cart'}
        </button>
        <QuoteButton
          source="product"
          items={[{ productId: product.id, name: product.name, quantity: qty, unit: product.unit, price: product.price }]}
        />
      </div>
      {added ? (
        <Link href="/store/cart" className="mt-4 inline-block text-sm font-semibold text-[#E87F24] hover:underline">View cart →</Link>
      ) : null}
    </div>
  )
}
