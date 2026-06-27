'use client'

import { useEffect, useMemo, useState } from 'react'
import { Mail, RefreshCw, Trash2 } from 'lucide-react'
import { readJsonResponse } from '@/lib/safe-json'

type NewsletterRow = {
  id: string
  email: string
  status: string
  source: string
  notes: string
  created_at?: string
}

type AdminResponse<T> = {
  connected: boolean
  table: 'newsletter'
  rows: T[]
}

async function api<T>(init?: RequestInit): Promise<T> {
  const response = await fetch('/api/admin/newsletter', {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const payload = await readJsonResponse<T & { error?: string }>(response, {} as T & { error?: string })
  if (!response.ok) throw new Error(payload.error || 'Request failed.')
  return payload
}

export default function AdminNewsletterPanel() {
  const [rows, setRows] = useState<NewsletterRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const activeCount = useMemo(() => rows.filter((row) => row.status === 'active').length, [rows])

  async function loadRows() {
    setLoading(true)
    setError('')
    try {
      const response = await api<AdminResponse<NewsletterRow>>()
      setRows(response.rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load newsletter subscribers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadRows()
  }, [])

  async function updateStatus(id: string, status: string) {
    setSaving(true)
    setError('')
    try {
      await api({
        method: 'PATCH',
        body: JSON.stringify({ id, updates: { status } }),
      })
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscriber.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteSubscriber(id: string) {
    if (!confirm('Delete this newsletter subscriber?')) return
    setSaving(true)
    setError('')
    try {
      await api({
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscriber.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-6 rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-white/40">
            <Mail size={13} className="text-[#D8FF6A]" />
            Newsletter
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Footer subscribers</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Manage emails collected from the footer newsletter form. Email sending automation can be added later.
          </p>
        </div>
        <button
          type="button"
          onClick={loadRows}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/74"
        >
          <RefreshCw size={14} className="text-[#D8FF6A]" />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mt-5 rounded-[20px] border border-[#E87F24]/30 bg-[#2a1a14] px-4 py-3 text-sm text-[#FFBC8C]">
          {error}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[22px] border border-white/8 bg-white/5 p-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">Total subscribers</div>
          <div className="mt-2 text-3xl font-black text-white">{rows.length}</div>
        </div>
        <div className="rounded-[22px] border border-white/8 bg-white/5 p-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">Active</div>
          <div className="mt-2 text-3xl font-black text-[#D8FF6A]">{activeCount}</div>
        </div>
        <div className="rounded-[22px] border border-white/8 bg-white/5 p-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/38">Sources</div>
          <div className="mt-2 text-3xl font-black text-white">{new Set(rows.map((row) => row.source)).size}</div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 px-5 py-10 text-center text-sm text-white/52">
            Loading subscribers...
          </div>
        ) : rows.length ? (
          rows.map((row) => (
            <div key={row.id} className="rounded-[24px] border border-white/8 bg-white/5 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="break-all text-lg font-semibold text-white">{row.email}</h3>
                    <span className="rounded-full border border-white/8 bg-[#D8FF6A]/90 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#111]">
                      {row.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/42">
                    <span>Source: {row.source || 'footer'}</span>
                    {row.created_at ? <span>{new Date(row.created_at).toLocaleString()}</span> : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['active', 'unsubscribed', 'archived'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={saving}
                      onClick={() => updateStatus(row.id, status)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/74 disabled:opacity-50"
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => deleteSubscriber(row.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E87F24]/30 px-3 py-2 text-xs font-semibold text-[#FFBC8C] disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 px-5 py-10 text-center text-sm text-white/52">
            No newsletter subscribers yet.
          </div>
        )}
      </div>
    </div>
  )
}
