'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, ShieldCheck, Trash2, UserPlus } from 'lucide-react'
import { readJsonResponse } from '@/lib/safe-json'

type AdminUserRow = {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'editor' | 'content_manager' | 'leads_manager' | 'media_manager' | 'project_manager'
  status: 'active' | 'disabled'
  created_at?: string
}

type AdminResponse = {
  connected: boolean
  rows: AdminUserRow[]
  error?: string
}

const inputClass =
  'w-full rounded-[16px] border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-[#F5F3EB] outline-none transition placeholder:text-white/28 focus:border-[#D8FF6A]/70 focus:ring-2 focus:ring-[#D8FF6A]/10'

const emptyDraft = (): Partial<AdminUserRow> => ({
  email: '',
  name: '',
  role: 'editor',
  status: 'active',
})

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.24em] text-white/56">{label}</div>
      {children}
    </label>
  )
}

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

export default function AdminUsersPanel() {
  const [rows, setRows] = useState<AdminUserRow[]>([])
  const [draft, setDraft] = useState<Partial<AdminUserRow>>(emptyDraft())
  const [connected, setConnected] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadRows() {
    setError('')
    const payload = await adminUsers()
    setRows(payload.rows)
    setConnected(payload.connected)
    if (!draft.id && payload.rows[0]) setDraft(payload.rows[0])
  }

  useEffect(() => {
    loadRows().catch((err) => setError(err instanceof Error ? err.message : 'Unable to load admin users.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function saveUser() {
    if (!draft.email?.trim()) {
      setError('Email is required.')
      return
    }
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const payload = {
        email: draft.email,
        name: draft.name ?? '',
        role: draft.role ?? 'editor',
        status: draft.status ?? 'active',
      }
      await adminUsers({
        method: draft.id ? 'PATCH' : 'POST',
        body: JSON.stringify(draft.id ? { id: draft.id, updates: payload } : payload),
      })
      setMessage('Admin user saved.')
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save admin user.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteUser(id: string) {
    if (!confirm('Delete this admin user record?')) return
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await adminUsers({
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })
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
    <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Admin roles</div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">{draft.id ? 'Edit admin user' : 'Add admin user'}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
              Manage who can access the dashboard. Department permissions can be layered on top of these roles later.
            </p>
          </div>
          <button type="button" onClick={() => setDraft(emptyDraft())} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/76">
            <UserPlus size={14} /> New
          </button>
        </div>

        {error ? <div className="mt-4 rounded-2xl border border-[#E87F24]/30 bg-[#2a1b11] px-4 py-3 text-sm text-[#ffd7b2]">{error}</div> : null}
        {message ? <div className="mt-4 rounded-2xl border border-[#D8FF6A]/20 bg-[#D8FF6A]/10 px-4 py-3 text-sm text-[#D8FF6A]">{message}</div> : null}
        {!connected ? <div className="mt-4 rounded-2xl border border-[#D8FF6A]/16 bg-[#D8FF6A]/10 px-4 py-3 text-sm text-white/70">Live database is unavailable in this environment, so admin user saves are paused.</div> : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Email">
            <input className={inputClass} value={draft.email ?? ''} onChange={(event) => setDraft((prev) => ({ ...prev, email: event.target.value }))} placeholder="admin@buildcivil.com" />
          </Field>
          <Field label="Name">
            <input className={inputClass} value={draft.name ?? ''} onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))} placeholder="Display name" />
          </Field>
          <Field label="Role">
            <select className={inputClass} value={draft.role ?? 'editor'} onChange={(event) => setDraft((prev) => ({ ...prev, role: event.target.value as AdminUserRow['role'] }))}>
              <option value="super_admin">Super admin</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="content_manager">Content manager</option>
              <option value="project_manager">Project manager</option>
              <option value="media_manager">Media manager</option>
              <option value="leads_manager">Leads manager</option>
            </select>
          </Field>
          <Field label="Status">
            <select className={inputClass} value={draft.status ?? 'active'} onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value as AdminUserRow['status'] }))}>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" disabled={!connected || saving} onClick={saveUser} className="inline-flex items-center gap-3 rounded-full bg-[#D8FF6A] px-5 py-3 text-sm font-semibold text-[#111] disabled:opacity-60">
            Save user <ArrowRight size={15} />
          </button>
          {draft.id ? (
            <button type="button" disabled={!connected || saving} onClick={() => deleteUser(draft.id!)} className="inline-flex items-center gap-2 rounded-full border border-[#E87F24]/30 px-4 py-3 text-sm font-semibold text-[#FFBC8C] disabled:opacity-60">
              <Trash2 size={14} /> Delete
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">User list</div>
            <h3 className="mt-2 text-xl font-black text-white">Dashboard access</h3>
          </div>
          <ShieldCheck size={18} className="text-[#D8FF6A]" />
        </div>
        <div className="mt-5 space-y-3">
          {rows.map((row) => (
            <button key={row.id} type="button" onClick={() => setDraft(row)} className="w-full rounded-[22px] border border-white/8 bg-white/5 p-4 text-left transition hover:border-[#D8FF6A]/25 hover:bg-white/8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-black text-white">{row.name || row.email}</h4>
                  <p className="mt-1 text-sm text-white/50">{row.email}</p>
                </div>
                <span className="rounded-full bg-[#D8FF6A] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#111]">{row.role}</span>
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.2em] text-white/35">{row.status}</div>
            </button>
          ))}
          {!rows.length ? <div className="rounded-[22px] border border-dashed border-white/10 bg-white/5 px-5 py-10 text-center text-sm text-white/52">No admin users found.</div> : null}
        </div>
      </div>
    </section>
  )
}
