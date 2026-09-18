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
  AdminSelect,
} from '@/components/admin/ui'

type MessageRow = {
  id: string
  name: string
  email: string
  phone?: string | null
  project_type?: string | null
  details?: string | null
  status?: string | null
}

type AdminLeadMessagesPanelProps = {
  connected: boolean
  saving: boolean
  messages: MessageRow[]
  onUpdateStatus: (id: string, status: string) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
}

const statusOptions = ['new', 'read', 'replied', 'closed']

export default function AdminLeadMessagesPanel({
  connected,
  saving,
  messages,
  onUpdateStatus,
  onDelete,
}: AdminLeadMessagesPanelProps) {
  const [rows, setRows] = useState<MessageRow[]>(messages)
  const [loading, setLoading] = useState(!messages.length)
  const [error, setError] = useState('')
  const [panelConnected, setPanelConnected] = useState(connected)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (statusFilter !== 'all' && (row.status || 'new') !== statusFilter) return false
      if (!q) return true
      return [row.name, row.email, row.phone, row.project_type, row.details].join(' ').toLowerCase().includes(q)
    })
  }, [rows, query, statusFilter])

  async function loadMessages() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/messages', { cache: 'no-store' })
      const payload = await readJsonResponse<{ rows?: MessageRow[]; error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Unable to load contact messages.')
      setRows(payload.rows ?? [])
      setPanelConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load contact messages.')
      setRows(messages)
      setPanelConnected(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setRows(messages)
  }, [messages])

  useEffect(() => {
    void loadMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Inbox"
        title="Contact messages"
        description="Track contact form submissions, update lead status, and remove test messages."
        actions={
          <AdminButton onClick={loadMessages} loading={loading}>
            Refresh
          </AdminButton>
        }
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminCard>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <AdminInput className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, details…" />
          </div>
          <AdminSelect className="sm:w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </AdminSelect>
        </div>

        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">Loading messages…</div>
          ) : filtered.length ? (
            filtered.map((message) => (
              <div key={message.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{message.name}</h3>
                      <AdminBadge tone={(message.status || 'new') === 'new' ? 'warning' : 'neutral'}>{message.status || 'new'}</AdminBadge>
                    </div>
                    <p className="mt-2 break-all text-sm text-slate-500">{message.email}</p>
                    {message.phone ? <p className="mt-1 text-sm text-slate-500">{message.phone}</p> : null}
                    {message.project_type ? <p className="mt-1 text-sm text-slate-500">Project: {message.project_type}</p> : null}
                    {message.details ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{message.details}</p> : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <AdminButton
                        key={status}
                        className="!py-2 text-xs capitalize"
                        disabled={!panelConnected || saving}
                        onClick={async () => {
                          await onUpdateStatus(message.id, status)
                          await loadMessages()
                        }}
                      >
                        {status}
                      </AdminButton>
                    ))}
                    <AdminButton
                      variant="danger"
                      className="!py-2 text-xs"
                      disabled={!panelConnected || saving}
                      onClick={() => setDeleteId(message.id)}
                    >
                      <Trash2 size={12} /> Delete
                    </AdminButton>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <AdminEmptyState
              icon={<Mail size={18} />}
              title={rows.length ? 'No messages match your filters' : 'No contact messages yet'}
              description="New submissions from the Contact page will appear here automatically."
            />
          )}
        </div>
      </AdminCard>

      <AdminConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this message?"
        description="This permanently removes the contact form submission from the inbox."
        confirmLabel="Delete"
        danger
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return
          await onDelete(deleteId)
          setDeleteId(null)
          await loadMessages()
        }}
      />
    </div>
  )
}
