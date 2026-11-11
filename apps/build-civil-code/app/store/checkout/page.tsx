import type { Metadata } from 'next'
import CheckoutPageClient from '@/components/store/CheckoutPageClient'

export const metadata: Metadata = { title: 'Checkout | BuildCivil Store', robots: { index: false } }

export default function CheckoutPage() {
  return <CheckoutPageClient />
}
