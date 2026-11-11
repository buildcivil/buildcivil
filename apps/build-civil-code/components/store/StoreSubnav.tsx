'use client'

import Link from 'next/link'
import { ShoppingCart, Store } from 'lucide-react'
import { useCart } from './CartProvider'

/** Slim bar under the fixed global navbar (margin clears it): store home + live cart count. */
export default function StoreSubnav() {
  const { count, ready } = useCart()
  return (
    <div className="mt-24 border-b border-[#73A5CA]/12 bg-white xl:mt-20">
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4 px-6 py-2.5 md:px-10 lg:px-16">
        <Link href="/store" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#1c1712] hover:text-[#E87F24]">
          <Store size={16} className="text-[#E87F24]" />
          BuildCivil Store
        </Link>
        <Link href="/store/cart" className="relative inline-flex items-center gap-2 rounded-full border border-[#73A5CA]/20 px-4 py-2 text-sm font-semibold text-[#1c1712] transition hover:border-[#E87F24]/50 hover:text-[#E87F24]">
          <ShoppingCart size={16} />
          Cart
          {ready && count > 0 ? (
            <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-[#E87F24] px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">{count}</span>
          ) : null}
        </Link>
      </div>
    </div>
  )
}
