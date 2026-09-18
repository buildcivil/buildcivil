'use client'

import { useEffect, useMemo, useState } from 'react'
import { ShieldCheck, Trash2, UserPlus } from 'lucide-react'
import { readJsonResponse } from '@buildcivil/cms/safe-json'
import {
  AdminAlert,
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminField,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
} from '@/components/admin/ui'
import { cn } from '@buildcivil/cms/cn'

type AdminUserRow = {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'editor' | 'content_manager' | 'leads_manager' | 'media_manager' | 'project_manager'
  status: 'active' | 'disabled'
  created_at?: string
  last_login_at?: string
}

type AdminResponse = {
  connected: boolean
  rows: AdminUserRow[]
  error?: string
}

type Draft = Partial<AdminUserRow> & { password?: string }

const emptyDraft = (): Draft => ({
  email: '',
  name: '',
  role: 'editor',
  status: 'active',
  password: '',
})

async function adminUsers(init?: RequestInit): Promise<AdminResponse> {
  const response = await fetch('/api/admin/admin-users', {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const payload = await readJsonResponse<AdminResponse>(response, { connected: false, rows: [] })
  if (!response.ok) throw new Error(payload.error || 'Admin users request failed.')
  return payload
}

function formatDate(value?: string) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

export default function AdminUsersPanel() {
  const [rows, setRows] = useState<AdminUserRow[]>([])
  const [draft, setDraft] = useState<Draft>(emptyDraft())
  const [connected, setConnected] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => [row.email, row.name, row.role, row.status].join(' ').toLowerCase().includes(q))
  }, [rows, query])

  async function loadRows() {
    setError('')
    const payload = await adminUsers()
    setRows(payload.rows)
    setConnected(payload.connected)
  }

  useEffect(() => {
    loadRows().catch((err) => setError(err instanceof Error ? err.message : 'Unable to load admin users.'))
  }, [])

  async function saveUser() {
    if (!draft.email?.trim()) {
      setError('Email is required.')
      return
    }
    if (!draft.id && (!draft.password || draft.password.trim().length < 8)) {
      setError('New users need a password of at least 8 characters.')
      return
    }
    if (draft.id && draft.password && draft.password.trim().length > 0 && draft.password.trim().length < 8) {
      setError('Password must be at least 8 characters, or leave blank to keep the current one.')
      return
    }

    setSaving(true)
    setError('')
    setMessage('')
    try {
      const payload: Record<string, unknown> = {
        email: draft.email.trim(),
        name: draft.name ?? '',
        role: draft.role ?? 'editor',
        status: draft.status ?? 'active',
      }
      if (draft.password?.trim()) payload.password = draft.password.trim()

      await adminUsers({
        method: draft.id ? 'PATCH' : 'POST',
        body: JSON.stringify(draft.id ? { id: draft.id, updates: payload } : payload),
      })
      setMessage(draft.id ? 'Admin user updated.' : 'Admin user created.')
      setDraft(emptyDraft())
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save admin user.')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await adminUsers({
        method: 'DELETE',
        body: JSON.stringify({ id: deleteId }),
      })
      setDeleteId(null)
      setDraft(emptyDraft())
      setMessage('Admin user deleted.')
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete admin user.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Access"
        title="Admin Users"
        description="Invite teammates, assign roles, set passwords, and disable accounts when needed."
        actions={
          <AdminButton
            onClick={() => {
              setDraft(emptyDraft())
              setError('')
              setMessage('')
            }}
          >
            <UserPlus size={14} /> New user
          </AdminButton>
        }
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}
      {!connected ? (
        <AdminAlert tone="warning">Live database is unavailable, so user saves are paused in this environment.</AdminAlert>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminCard>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">{draft.id ? 'Edit user' : 'Add user'}</h3>
            <AdminBadge tone={draft.id ? 'neutral' : 'accent'}>{draft.id ? 'Editing' : 'Creating'}</AdminBadge>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <AdminField label="Email">
              <AdminInput
                value={draft.email ?? ''}
                onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="admin@buildcivil.com"
                autoComplete="off"
              />
            </AdminField>
            <AdminField label="Display name">
              <AdminInput
                value={draft.name ?? ''}
                onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Name shown in the dashboard"
              />
            </AdminField>
            <AdminField label="Role">
              <AdminSelect
                value={draft.role ?? 'editor'}
                onChange={(e) => setDraft((prev) => ({ ...prev, role: e.target.value as AdminUserRow['role'] }))}
              >
                <option value="super_admin">Super admin</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="content_manager">Content manager</option>
                <option value="project_manager">Project manager</option>
                <option value="media_manager">Media manager</option>
                <option value="leads_manager">Leads manager</option>
              </AdminSelect>
            </AdminField>
            <AdminField label="Status">
              <AdminSelect
                value={draft.status ?? 'active'}
                onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as AdminUserRow['status'] }))}
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </AdminSelect>
            </AdminField>
            <AdminField
              className="md:col-span-2"
              label={draft.id ? 'New password (optional)' : 'Password'}
              hint={draft.id ? 'Leave blank to keep the current password.' : 'Minimum 8 characters. Required for new users.'}
            >
              <AdminInput
                type="password"
                value={draft.password ?? ''}
                onChange={(e) => setDraft((prev) => ({ ...prev, password: e.target.value }))}
                placeholder={draft.id ? '••••••••' : 'Set a strong password'}
                autoComplete="new-password"
              />
            </AdminField>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <AdminButton variant="primary" disabled={!connected || saving} loading={saving} onClick={saveUser}>
              {draft.id ? 'Save changes' : 'Create user'}
            </AdminButton>
            {draft.id ? (
              <AdminButton variant="danger" disabled={!connected || saving} onClick={() => setDeleteId(draft.id!)}>
                <Trash2 size={14} /> Delete
              </AdminButton>
            ) : null}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Team access</h3>
              <p className="mt-1 text-sm text-slate-500">{rows.length} users</p>
            </div>
            <AdminInput className="sm:max-w-[220px]" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter users…" />
          </div>

          <div className="mt-4 space-y-2">
            {filtered.map((row) => {
              const selected = draft.id === row.id
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => {
                    setDraft({ ...row, password: '' })
                    setError('')
                    setMessage('')
                  }}
                  className={cn(
                    'w-full rounded-2xl border p-4 text-left transition',
                    selected ? 'border-[#E87F24]/35 bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300',
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-slate-900">{row.name || row.email}</h4>
                      <p className="mt-1 truncate text-sm text-slate-500">{row.email}</p>
                      <p className="mt-2 text-xs text-slate-400">Last login: {formatDate(row.last_login_at)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <AdminBadge tone="accent">{row.role.replaceAll('_', ' ')}</AdminBadge>
                      <AdminBadge tone={row.status === 'active' ? 'success' : 'warning'}>{row.status}</AdminBadge>
                    </div>
                  </div>
                </button>
              )
            })}

            {!filtered.length ? (
              <AdminEmptyState
                icon={<ShieldCheck size={18} />}
                title={rows.length ? 'No users match your filter' : 'No admin users found'}
                description="Create a user with email, role, and password to grant dashboard access."
              />
            ) : null}
          </div>
        </AdminCard>
      </div>

      <AdminConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this admin user?"
        description="They will lose dashboard access immediately. This cannot be undone from the UI."
        confirmLabel="Delete user"
        danger
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
