'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { formatPrice, STOCK_STATUS_LABELS, type StoreProduct } from '@buildcivil/cms/store'
import { useCart } from './CartProvider'

export default function ProductCard({ product }: { product: StoreProduct }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const soldOut = product.stockStatus === 'out_of_stock'
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0

  function add() {
    addItem(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-[28px] border border-[#73A5CA]/14 bg-white shadow-[0_16px_40px_rgba(28,23,18,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(28,23,18,0.12)]">
      <Link href={`/store/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#FEFDDF]">
        {product.image ? (
          <Image src={product.image} alt={product.name} fill sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : null}
        {discount ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#E87F24] px-3 py-1 text-xs font-bold text-white">{discount}% OFF</span>
        ) : null}
        {soldOut ? (
          <span className="absolute inset-0 flex items-center justify-center bg-[#1c1712]/55 text-sm font-semibold uppercase tracking-[0.2em] text-white">Out of stock</span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {product.categoryName ? <div className="text-[11px] uppercase tracking-[0.26em] text-[#5d8fb2]">{product.categoryName}</div> : null}
        <Link href={`/store/products/${product.slug}`} className="mt-2 text-lg font-semibold leading-snug text-[#1c1712] hover:text-[#E87F24]">
          {product.name}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6e6256]">{product.shortDescription}</p>
        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-[#1c1712]">{formatPrice(product.price)}</span>
            <span className="text-xs text-[#8b7e74]">/ {product.unit}</span>
            {discount ? <span className="text-sm text-[#8b7e74] line-through">{formatPrice(product.compareAtPrice!)}</span> : null}
          </div>
          <div className="mt-1 text-xs text-[#8b7e74]">{STOCK_STATUS_LABELS[product.stockStatus]}{product.minOrderQty > 1 ? ` · Min. ${product.minOrderQty} ${product.unit}` : ''}</div>
          <button
            type="button"
            onClick={add}
            disabled={soldOut}
            className="btn-primary mt-4 flex w-full items-center justify-center gap-2 px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
            {added ? 'Added to cart' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
