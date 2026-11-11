import type { Metadata } from 'next'
import CartPageClient from '@/components/store/CartPageClient'

export const metadata: Metadata = { title: 'Cart | BuildCivil Store', robots: { index: false } }

export default function CartPage() {
  return <CartPageClient />
}
