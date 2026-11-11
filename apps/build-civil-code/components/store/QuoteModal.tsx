'use client'

import { type FormEvent, useEffect, useState } from 'react'
import { CheckCircle2, FileText, Loader2, X } from 'lucide-react'
import { readJsonResponse } from '@buildcivil/cms/safe-json'
import { formatPrice } from '@buildcivil/cms/store'

export type QuoteLine = { productId: string; name: string; quantity: number; unit: string; price: number }

type QuoteButtonProps = {
  items: QuoteLine[]
  label?: string
  className?: string
  source?: string
}

const inputClass =
  'w-full rounded-2xl border border-[#73A5CA]/25 bg-white px-4 py-3 text-sm text-[#1c1712] outline-none transition placeholder:text-[#8b7e74] focus:border-[#E87F24] focus:ring-2 focus:ring-[#E87F24]/20'

/** "Get a Quote" button + modal. Sends the given line items (cart or single product) to the sales team. */
export default function QuoteButton({ items, label = 'Get a Quote', className, source = 'store' }: QuoteButtonProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', website: '' })

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const estimate = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const response = await fetch('/api/store/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      })
      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Could not send your quote request.')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Could not send your quote request.')
    }
  }

  function close() {
    setOpen(false)
    if (status === 'success') {
      setStatus('idle')
      setForm({ name: '', email: '', phone: '', message: '', website: '' })
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          'btn-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold'
        }
      >
        <FileText size={16} />
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-[#1c1712]/55 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Request a quote">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] border border-[#73A5CA]/15 bg-white p-6 shadow-[0_30px_90px_rgba(28,23,18,0.3)] sm:rounded-[28px] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2]">BuildCivil Store</div>
                <h2 className="mt-2 text-2xl">Request a quote</h2>
              </div>
              <button type="button" onClick={close} className="rounded-full p-2 text-[#1c1712]/60 hover:bg-[#1c1712]/5" aria-label="Close">
                <X size={22} />
              </button>
            </div>

            {status === 'success' ? (
              <div className="py-10 text-center">
                <CheckCircle2 size={44} className="mx-auto text-[#E87F24]" />
                <h3 className="mt-4">Quote request received</h3>
                <p className="mt-3 text-sm leading-6 text-[#6e6256]">Our team will review your requirements and get back to you with a tailored quote shortly.</p>
                <button type="button" onClick={close} className="btn-primary mt-6 inline-flex px-6 py-3 text-sm">Done</button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 space-y-4">
                {items.length ? (
                  <div className="rounded-2xl border border-[#73A5CA]/15 bg-[#FEFDDF]/60 p-4 text-sm">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-[#5d8fb2]">Items in this quote</div>
                    <ul className="mt-2 space-y-1 text-[#1c1712]">
                      {items.slice(0, 6).map((item) => (
                        <li key={item.productId} className="flex justify-between gap-3">
                          <span className="truncate">{item.name}</span>
                          <span className="shrink-0 text-[#6e6256]">× {item.quantity} {item.unit}</span>
                        </li>
                      ))}
                      {items.length > 6 ? <li className="text-[#6e6256]">+ {items.length - 6} more</li> : null}
                    </ul>
                    <div className="mt-2 border-t border-[#73A5CA]/15 pt-2 text-[#6e6256]">Indicative total: <strong className="text-[#1c1712]">{formatPrice(estimate)}</strong></div>
                  </div>
                ) : (
                  <p className="text-sm text-[#6e6256]">Tell us what you need and we will send a custom quote.</p>
                )}
                <input className={inputClass} placeholder="Full name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={inputClass} type="email" placeholder="Email *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
                  <input className={inputClass} type="tel" placeholder="Phone *" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
                </div>
                <textarea className={`${inputClass} min-h-[96px]`} placeholder="Project details, delivery location, bulk quantities…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                {/* Honeypot: hidden from people, filled by bots. */}
                <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                {error ? <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-orange-800">{error}</p> : null}
                <button type="submit" disabled={status === 'submitting'} className="btn-primary flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm disabled:opacity-60">
                  {status === 'submitting' ? <Loader2 size={16} className="animate-spin" /> : null}
                  Send quote request
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
