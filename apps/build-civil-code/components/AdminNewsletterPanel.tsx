'use client'

import { useEffect, useMemo, useState } from 'react'
import { Mail, Search, Trash2 } from 'lucide-react'
import { readJsonResponse } from '@buildcivil/cms/safe-json'
import {
  AdminAlert,
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminInput,
  AdminPageHeader,
  AdminStat,
} from '@/components/admin/ui'

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
  const [query, setQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const activeCount = useMemo(() => rows.filter((row) => row.status === 'active').length, [rows])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => [row.email, row.status, row.source, row.notes].join(' ').toLowerCase().includes(q))
  }, [rows, query])

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

  async function confirmDelete() {
    if (!deleteId) return
    setSaving(true)
    setError('')
    try {
      await api({
        method: 'DELETE',
        body: JSON.stringify({ id: deleteId }),
      })
      setDeleteId(null)
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscriber.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Audience"
        title="Newsletter subscribers"
        description="Emails collected from the footer newsletter form."
        actions={<AdminButton onClick={loadRows} loading={loading}>Refresh</AdminButton>}
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminStat label="Total" value={rows.length} />
        <AdminStat label="Active" value={activeCount} />
        <AdminStat label="Sources" value={new Set(rows.map((row) => row.source)).size} />
      </div>

      <AdminCard>
        <div className="relative max-w-md">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <AdminInput className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search subscribers…" />
        </div>

        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">Loading subscribers…</div>
          ) : filtered.length ? (
            filtered.map((row) => (
              <div key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-all text-base font-semibold text-slate-900">{row.email}</h3>
                      <AdminBadge tone={row.status === 'active' ? 'success' : 'neutral'}>{row.status}</AdminBadge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                      <span>Source: {row.source || 'footer'}</span>
                      {row.created_at ? <span>{new Date(row.created_at).toLocaleString()}</span> : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['active', 'unsubscribed', 'archived'].map((status) => (
                      <AdminButton key={status} className="!py-2 text-xs capitalize" disabled={saving} onClick={() => updateStatus(row.id, status)}>
                        {status}
                      </AdminButton>
                    ))}
                    <AdminButton variant="danger" className="!py-2 text-xs" disabled={saving} onClick={() => setDeleteId(row.id)}>
                      <Trash2 size={12} /> Delete
                    </AdminButton>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <AdminEmptyState
              icon={<Mail size={18} />}
              title={rows.length ? 'No subscribers match your search' : 'No newsletter subscribers yet'}
              description="Footer signups will appear here automatically."
            />
          )}
        </div>
      </AdminCard>

      <AdminConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this subscriber?"
        description="This permanently removes the email from the newsletter list."
        confirmLabel="Delete"
        danger
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
