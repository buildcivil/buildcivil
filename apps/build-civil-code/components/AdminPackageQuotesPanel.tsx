'use client'

import { useEffect, useMemo, useState } from 'react'
import { Package, Search, Trash2 } from 'lucide-react'
import { readJsonResponse } from '@/lib/safe-json'
import {
  AdminAlert,
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
} from '@/components/admin/ui'

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

const statusOptions = ['new', 'read', 'replied', 'closed']

export default function AdminPackageQuotesPanel() {
  const [rows, setRows] = useState<QuoteRow[]>([])
  const [connected, setConnected] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (statusFilter !== 'all' && (row.status || 'new') !== statusFilter) return false
      if (!q) return true
      return [row.name, row.email, row.phone, row.plan_name, row.notes, row.source].join(' ').toLowerCase().includes(q)
    })
  }, [rows, query, statusFilter])

  async function loadRows() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/package-quotes', { cache: 'no-store' })
      const payload = await readJsonResponse<QuoteResponse>(response, { connected: false, rows: [] })
      if (!response.ok) throw new Error(payload.error || 'Failed to load package quotes.')
      setRows(payload.rows)
      setConnected(payload.connected)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load package quotes.')
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

  async function confirmDelete() {
    if (!deleteId) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/admin/package-quotes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteId }),
      })
      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Failed to delete quote.')
      setDeleteId(null)
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quote.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Inbox"
        title="Plan quotes"
        description="Quote requests from construction package forms."
        actions={<AdminButton onClick={loadRows} loading={loading}>Refresh</AdminButton>}
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
      {!connected && !loading ? <AdminAlert tone="warning">Live database is unavailable for package quotes in this environment.</AdminAlert> : null}

      <AdminCard>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <AdminInput className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, plan, notes…" />
          </div>
          <AdminSelect className="sm:w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </AdminSelect>
        </div>

        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">Loading quotes…</div>
          ) : filtered.length ? (
            filtered.map((quote) => (
              <div key={quote.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{quote.name}</h3>
                      <AdminBadge tone={quote.status === 'new' ? 'warning' : 'neutral'}>{quote.status || 'new'}</AdminBadge>
                    </div>
                    <p className="mt-2 break-all text-sm text-slate-500">{quote.email} · {quote.phone}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Plan: <span className="font-semibold text-slate-900">{quote.plan_name}</span>
                      {quote.start_timeline ? ` · Timeline: ${quote.start_timeline}` : ''}
                    </p>
                    {quote.notes ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{quote.notes}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <AdminButton
                        key={status}
                        className="!py-2 text-xs capitalize"
                        disabled={!connected || saving}
                        onClick={() => updateStatus(quote.id, status)}
                      >
                        {status}
                      </AdminButton>
                    ))}
                    <AdminButton variant="danger" className="!py-2 text-xs" disabled={!connected || saving} onClick={() => setDeleteId(quote.id)}>
                      <Trash2 size={12} /> Delete
                    </AdminButton>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <AdminEmptyState
              icon={<Package size={18} />}
              title={rows.length ? 'No quotes match your filters' : 'No plan quotes yet'}
              description="Package quote requests will appear here when customers submit the form."
            />
          )}
        </div>
      </AdminCard>

      <AdminConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this quote request?"
        description="This permanently removes the package quote from the inbox."
        confirmLabel="Delete"
        danger
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
