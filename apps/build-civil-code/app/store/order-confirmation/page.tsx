import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = { title: 'Order received | BuildCivil Store', robots: { index: false } }

export default async function OrderConfirmationPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <CheckCircle2 size={56} className="mx-auto text-[#E87F24]" />
      <h1 className="mt-6">Thank you — your order is in</h1>
      {order ? <p className="mt-4 text-lg">Order number <strong className="font-black">{order.slice(0, 40)}</strong></p> : null}
      <p className="mt-4 leading-7 text-[#6e6256]">We have received your order. Our team will confirm availability, delivery and payment details by phone or email shortly.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/store" className="btn-primary inline-flex px-6 py-3.5 text-sm">Continue shopping</Link>
        <Link href="/contact" className="btn-secondary inline-flex rounded-full px-6 py-3.5 text-sm font-semibold">Contact us</Link>
      </div>
    </div>
  )
}
