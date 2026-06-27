'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { readJsonResponse } from '@/lib/safe-json'

type QuoteRow = {
  id: string
  name: string
  email: string
  phone: string
  plan_name: string
  start_timeline: string
  status: string
  notes: string
  source: string
  created_at?: string
}

type QuoteResponse = {
  connected: boolean
  rows: QuoteRow[]
  error?: string
}

function formatStatus(status: string) {
  if (status === 'new') return 'New lead'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function AdminPackageQuotesPanel() {
  const [rows, setRows] = useState<QuoteRow[]>([])
  const [connected, setConnected] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadRows() {
    const response = await fetch('/api/admin/package-quotes', { cache: 'no-store' })
    const payload = await readJsonResponse<QuoteResponse>(response, { connected: false, rows: [] })
    if (!response.ok) throw new Error(payload.error || 'Failed to load package quotes.')
    setRows(payload.rows)
    setConnected(payload.connected)
  }

  useEffect(() => {
    loadRows().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load package quotes.'))
  }, [])

  async function updateStatus(id: string, status: string) {
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/admin/package-quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { status } }),
      })
      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Failed to update quote.')
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quote.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteQuote(id: string) {
    if (!confirm('Delete this package quote request?')) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/admin/package-quotes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Failed to delete quote.')
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quote.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mt-6 rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Package quote requests</div>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Plan popup leads</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-white/55">These leads come from the Get Quote button inside package details.</p>
      </div>
      {error ? <div className="mt-4 rounded-2xl border border-[#E87F24]/30 bg-[#2a1b11] px-4 py-3 text-sm text-[#ffd7b2]">{error}</div> : null}
      {!connected ? <div className="mt-4 rounded-2xl border border-[#D8FF6A]/16 bg-[#D8FF6A]/10 px-4 py-3 text-sm text-white/70">Live database is unavailable in this environment, so package quote updates are paused.</div> : null}

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {rows.map((quote) => (
          <article key={quote.id} className="rounded-[24px] border border-white/8 bg-white/5 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-white">{quote.name}</h3>
                  <span className="rounded-full border border-white/8 bg-[#D8FF6A]/90 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#111]">{formatStatus(quote.status)}</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-white/58 sm:grid-cols-2">
                  <p className="break-all">{quote.email}</p>
                  <p>{quote.phone}</p>
                </div>
                <div className="mt-4 rounded-[18px] border border-white/8 bg-[#0f0f0f] p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-white/36">Selected package</div>
                  <p className="mt-2 text-base font-semibold text-[#D8FF6A]">{quote.plan_name}</p>
                  {quote.start_timeline ? <p className="mt-2 text-sm text-white/55">Timeline: {quote.start_timeline}</p> : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/38">
                  <span>Source: {quote.source}</span>
                  {quote.created_at ? <span>{new Date(quote.created_at).toLocaleString()}</span> : null}
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-[190px]">
                {['new', 'read', 'replied', 'closed'].map((status) => (
                  <button key={status} type="button" disabled={!connected || saving} onClick={() => updateStatus(quote.id, status)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/74 disabled:opacity-50">
                    {formatStatus(status)}
                  </button>
                ))}
                <button type="button" disabled={!connected || saving} onClick={() => deleteQuote(quote.id)} className="inline-flex items-center gap-2 rounded-full border border-[#E87F24]/30 px-3 py-2 text-xs font-semibold text-[#FFBC8C] disabled:opacity-50">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {!rows.length ? <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 px-5 py-10 text-center text-sm text-white/52 xl:col-span-2">No package quote requests yet.</div> : null}
      </div>
    </section>
  )
}
