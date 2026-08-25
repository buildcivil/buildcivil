'use client'

import { type DragEvent, type FormEvent, useEffect, useMemo, useState } from 'react'
import { Check, Copy, ImageIcon, Pencil, Search, Trash2, Upload, X } from 'lucide-react'
import { readJsonResponse } from '@/lib/safe-json'
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
import { cn } from '@/lib/cn'

type MediaRow = {
  id: string
  file_name: string
  file_url: string
  file_type: string
  mime_type?: string
  file_size?: number
  provider?: string
  alt_text: string
  folder: string
  created_at?: string
}

type MediaResponse = {
  connected: boolean
  rows: MediaRow[]
  error?: string
}

const FOLDER_PRESETS = ['general', 'home', 'projects', 'services', 'team', 'logos', 'brand']

function resolveAdminMediaError(response: Response, fallback: string, payloadError?: string) {
  if (response.status === 401) {
    return 'Your admin session expired. Please sign in again and retry the upload.'
  }
  return payloadError || fallback
}

function isVideo(row: MediaRow) {
  return row.file_type?.startsWith('video/') || row.mime_type?.startsWith('video/')
}

function formatBytes(size?: number) {
  if (!size) return ''
  return `${(size / 1024 / 1024).toFixed(1)}MB`
}

export default function AdminMediaPanel() {
  const [rows, setRows] = useState<MediaRow[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [altText, setAltText] = useState('')
  const [folder, setFolder] = useState('general')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [folderFilter, setFolderFilter] = useState('all')
  const [dragOver, setDragOver] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAlt, setEditAlt] = useState('')
  const [editFolder, setEditFolder] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fileSizeMb = file ? file.size / 1024 / 1024 : 0
  const folders = useMemo(() => {
    const set = new Set([...FOLDER_PRESETS, ...rows.map((r) => r.folder).filter(Boolean)])
    return Array.from(set).sort()
  }, [rows])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (folderFilter !== 'all' && row.folder !== folderFilter) return false
      if (!q) return true
      return [row.file_name, row.alt_text, row.folder].join(' ').toLowerCase().includes(q)
    })
  }, [rows, query, folderFilter])

  const missingAltCount = rows.filter((row) => !isVideo(row) && !row.alt_text?.trim()).length

  async function loadRows() {
    const response = await fetch('/api/admin/media', { cache: 'no-store', credentials: 'same-origin' })
    const payload = await readJsonResponse<MediaResponse>(response, { connected: false, rows: [] })
    if (!response.ok) throw new Error(resolveAdminMediaError(response, 'Failed to load media.', payload.error))
    setRows(payload.rows)
  }

  useEffect(() => {
    loadRows().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load media.'))
  }, [])

  function acceptFile(next: File | null) {
    setFile(next)
    setError('')
    setMessage('')
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setDragOver(false)
    const dropped = event.dataTransfer.files?.[0]
    if (dropped) acceptFile(dropped)
  }

  async function uploadMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!file) {
      setError('Please choose an image or video first.')
      return
    }
    if (file.type.startsWith('image/') && !altText.trim()) {
      setError('Please add alt text before uploading images. It helps SEO and accessibility.')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('alt_text', altText)
      data.append('folder', folder)

      const response = await fetch('/api/admin/media/upload', { method: 'POST', body: data, credentials: 'same-origin' })
      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(resolveAdminMediaError(response, 'Upload failed.', payload.error))

      setFile(null)
      setAltText('')
      setMessage('Media uploaded successfully.')
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  async function saveEdit(id: string) {
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/admin/media', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { alt_text: editAlt, folder: editFolder } }),
      })
      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Failed to update media.')
      setEditingId(null)
      setMessage('Media details updated.')
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update media.')
    } finally {
      setLoading(false)
    }
  }

  async function confirmDelete() {
    if (!deleteId) return
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/admin/media', {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteId }),
      })
      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Failed to delete media.')
      setDeleteId(null)
      setMessage('Media deleted.')
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete media.')
    } finally {
      setLoading(false)
    }
  }

  async function copyUrl(row: MediaRow) {
    await navigator.clipboard.writeText(row.file_url)
    setCopiedId(row.id)
    setTimeout(() => setCopiedId((current) => (current === row.id ? null : current)), 1500)
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Assets"
        title="Media Library"
        description="Upload images and videos, organize by folder, edit alt text, and copy URLs into page editors."
        actions={
          <div className="flex items-center gap-2">
            <AdminBadge tone={missingAltCount ? 'warning' : 'success'}>
              {missingAltCount ? `${missingAltCount} missing alt` : 'Alt text ok'}
            </AdminBadge>
            <AdminBadge tone="neutral">{rows.length} assets</AdminBadge>
          </div>
        }
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <AdminCard>
          <h3 className="text-lg font-bold text-slate-900">Upload</h3>
          <p className="mt-1 text-sm text-slate-500">Prefer images under 2MB and videos under 20MB when possible.</p>

          <form className="mt-5 grid gap-4" onSubmit={uploadMedia}>
            <label
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-10 text-center transition',
                dragOver ? 'border-[#E87F24]/50 bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-slate-200',
              )}
            >
              <Upload size={22} className="text-[#E87F24]" />
              <div className="mt-3 text-sm font-semibold text-slate-900">{file ? file.name : 'Drop a file here or browse'}</div>
              <div className="mt-1 text-xs text-slate-400">{file ? formatBytes(file.size) : 'Images and videos accepted'}</div>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(event) => acceptFile(event.target.files?.[0] ?? null)}
              />
            </label>

            {file && fileSizeMb > 2 ? (
              <AdminAlert tone="warning">This file is {fileSizeMb.toFixed(1)}MB. It will upload at original size.</AdminAlert>
            ) : null}

            <AdminField label="Alt text" hint="Describe the image for SEO and accessibility.">
              <AdminInput value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="e.g. Team inspecting residential slab work" />
            </AdminField>

            <AdminField label="Folder">
              <AdminSelect value={folder} onChange={(e) => setFolder(e.target.value)}>
                {FOLDER_PRESETS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>

            <AdminButton type="submit" variant="primary" loading={loading} disabled={!file}>
              <Upload size={15} />
              Upload media
            </AdminButton>
          </form>
        </AdminCard>

        <AdminCard>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Library</h3>
              <p className="mt-1 text-sm text-slate-500">{filtered.length} of {rows.length} shown</p>
            </div>
            <div className="flex flex-1 flex-col gap-2 sm:max-w-md sm:flex-row">
              <div className="relative flex-1">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <AdminInput className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search filename, alt, folder…" />
              </div>
              <AdminSelect className="sm:w-36" value={folderFilter} onChange={(e) => setFolderFilter(e.target.value)}>
                <option value="all">All folders</option>
                {folders.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </AdminSelect>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((row) => {
              const editing = editingId === row.id
              return (
                <article key={row.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {isVideo(row) ? (
                    <video className="aspect-[16/10] w-full bg-black object-cover" src={row.file_url} muted playsInline controls />
                  ) : (
                    <div className="aspect-[16/10] bg-cover bg-center" style={{ backgroundImage: `url('${row.file_url}')` }} />
                  )}
                  <div className="space-y-3 p-3.5">
                    <div>
                      <h4 className="truncate text-sm font-semibold text-slate-900">{row.file_name}</h4>
                      <p className="mt-1 text-xs text-slate-400">
                        {row.folder}
                        {row.file_size ? ` · ${formatBytes(row.file_size)}` : ''}
                        {` · ${row.provider === 'vercel_blob' ? 'Blob' : 'Storage'}`}
                      </p>
                    </div>

                    {editing ? (
                      <div className="space-y-2">
                        <AdminInput value={editAlt} onChange={(e) => setEditAlt(e.target.value)} placeholder="Alt text" />
                        <AdminSelect value={editFolder} onChange={(e) => setEditFolder(e.target.value)}>
                          {folders.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </AdminSelect>
                        <div className="flex gap-2">
                          <AdminButton variant="primary" className="flex-1 !py-2" loading={loading} onClick={() => saveEdit(row.id)}>
                            Save
                          </AdminButton>
                          <AdminButton className="!px-3 !py-2" onClick={() => setEditingId(null)}>
                            <X size={14} />
                          </AdminButton>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className={cn('line-clamp-2 text-xs leading-5', row.alt_text ? 'text-slate-500' : 'text-amber-700')}>
                          {row.alt_text || 'Alt text missing'}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <AdminButton className="!px-3 !py-1.5 text-xs" onClick={() => copyUrl(row)}>
                            {copiedId === row.id ? <Check size={12} /> : <Copy size={12} />}
                            {copiedId === row.id ? 'Copied' : 'Copy URL'}
                          </AdminButton>
                          <AdminButton
                            className="!px-3 !py-1.5 text-xs"
                            onClick={() => {
                              setEditingId(row.id)
                              setEditAlt(row.alt_text || '')
                              setEditFolder(row.folder || 'general')
                            }}
                          >
                            <Pencil size={12} /> Edit
                          </AdminButton>
                          <AdminButton variant="danger" className="!px-3 !py-1.5 text-xs" onClick={() => setDeleteId(row.id)}>
                            <Trash2 size={12} />
                          </AdminButton>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          {!filtered.length ? (
            <div className="mt-5">
              <AdminEmptyState
                icon={<ImageIcon size={20} />}
                title={rows.length ? 'No media matches your filters' : 'No media uploaded yet'}
                description={rows.length ? 'Try a different search or folder.' : 'Upload your first image or video to get started.'}
              />
            </div>
          ) : null}
        </AdminCard>
      </div>

      <AdminConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this media asset?"
        description="This removes the library record. Files already used on live pages may still load until those URLs are replaced."
        confirmLabel="Delete"
        danger
        loading={loading}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
