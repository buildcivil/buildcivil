'use client'

import { useEffect, useMemo, useState } from 'react'
import { Handshake, Search, Trash2 } from 'lucide-react'
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

type EnquiryRow = {
  id: string
  name: string
  email: string
  phone: string
  service: string
  other_service?: string | null
  source?: string | null
  status?: string | null
  created_at?: string | null
}

type AdminServiceEnquiriesPanelProps = {
  connected: boolean
  saving: boolean
  enquiries: EnquiryRow[]
  onUpdateStatus: (id: string, status: string) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
}

const statusOptions = ['new', 'read', 'replied', 'closed']

export default function AdminServiceEnquiriesPanel({
  connected,
  saving,
  enquiries,
  onUpdateStatus,
  onDelete,
}: AdminServiceEnquiriesPanelProps) {
  const [rows, setRows] = useState<EnquiryRow[]>(enquiries)
  const [loading, setLoading] = useState(!enquiries.length)
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
      return [row.name, row.email, row.phone, row.service, row.other_service, row.source].join(' ').toLowerCase().includes(q)
    })
  }, [rows, query, statusFilter])

  async function loadEnquiries() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/enquiries', { cache: 'no-store' })
      const payload = await readJsonResponse<{ rows?: EnquiryRow[]; error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Unable to load service enquiries.')
      setRows(payload.rows ?? [])
      setPanelConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load service enquiries.')
      setRows(enquiries)
      setPanelConnected(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setRows(enquiries)
  }, [enquiries])

  useEffect(() => {
    void loadEnquiries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Inbox"
        title="Service enquiries"
        description="Leads from the service enquiry forms across the site."
        actions={<AdminButton onClick={loadEnquiries} loading={loading}>Refresh</AdminButton>}
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminCard>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <AdminInput className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, service…" />
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
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">Loading enquiries…</div>
          ) : filtered.length ? (
            filtered.map((enquiry) => (
              <div key={enquiry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{enquiry.name}</h3>
                      <AdminBadge tone={(enquiry.status || 'new') === 'new' ? 'warning' : 'neutral'}>{enquiry.status || 'new'}</AdminBadge>
                    </div>
                    <p className="mt-2 break-all text-sm text-slate-500">{enquiry.email}</p>
                    <p className="mt-1 text-sm text-slate-500">{enquiry.phone}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Service: <span className="font-semibold text-slate-900">{enquiry.service}</span>
                      {enquiry.other_service ? ` · ${enquiry.other_service}` : ''}
                    </p>
                    {enquiry.source ? <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{enquiry.source}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <AdminButton
                        key={status}
                        className="!py-2 text-xs capitalize"
                        disabled={!panelConnected || saving}
                        onClick={async () => {
                          await onUpdateStatus(enquiry.id, status)
                          await loadEnquiries()
                        }}
                      >
                        {status}
                      </AdminButton>
                    ))}
                    <AdminButton variant="danger" className="!py-2 text-xs" disabled={!panelConnected || saving} onClick={() => setDeleteId(enquiry.id)}>
                      <Trash2 size={12} /> Delete
                    </AdminButton>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <AdminEmptyState
              icon={<Handshake size={18} />}
              title={rows.length ? 'No enquiries match your filters' : 'No service enquiries yet'}
              description="New service form submissions will show up here."
            />
          )}
        </div>
      </AdminCard>

      <AdminConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this enquiry?"
        description="This permanently removes the service enquiry from the inbox."
        confirmLabel="Delete"
        danger
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return
          await onDelete(deleteId)
          setDeleteId(null)
          await loadEnquiries()
        }}
      />
    </div>
  )
}
