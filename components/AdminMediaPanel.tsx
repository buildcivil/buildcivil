'use client'

import { type FormEvent, useEffect, useState } from 'react'
import { Copy, ImageIcon, Loader2, Upload } from 'lucide-react'
import { readJsonResponse } from '@/lib/safe-json'

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

function resolveAdminMediaError(response: Response, fallback: string, payloadError?: string) {
  if (response.status === 401) {
    return 'Your admin session expired. Please sign in again and retry the upload.'
  }
  return payloadError || fallback
}

export default function AdminMediaPanel() {
  const [rows, setRows] = useState<MediaRow[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [altText, setAltText] = useState('')
  const [folder, setFolder] = useState('general')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileSizeMb = file ? file.size / 1024 / 1024 : 0
  const missingAltCount = rows.filter((row) => !row.alt_text?.trim()).length

  async function loadRows() {
    const response = await fetch('/api/admin/media', { cache: 'no-store', credentials: 'same-origin' })
    const payload = await readJsonResponse<MediaResponse>(response, { connected: false, rows: [] })
    if (!response.ok) throw new Error(resolveAdminMediaError(response, 'Failed to load media.', payload.error))
    setRows(payload.rows)
  }

  useEffect(() => {
    loadRows().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load media.'))
  }, [])

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
      await loadRows()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Media Library</div>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Upload site media</h2>
        <p className="mt-3 text-sm leading-6 text-white/50">
          Recommended: use clear construction photos under 2MB when possible, short videos under 20MB, always add alt text, and keep folder names simple like home, projects, services, or team.
        </p>
        {error ? <div className="mt-4 rounded-2xl border border-[#E87F24]/30 bg-[#2a1b11] px-4 py-3 text-sm text-[#ffd7b2]">{error}</div> : null}
        {file && fileSizeMb > 2 ? (
          <div className="mt-4 rounded-2xl border border-[#FFC81E]/25 bg-[#FFC81E]/10 px-4 py-3 text-sm leading-6 text-[#F6DA8A]">
            This file is {fileSizeMb.toFixed(1)}MB. It will upload at its original size and quality.
          </div>
        ) : null}
        <form className="mt-6 grid gap-4" onSubmit={uploadMedia}>
          <label className="grid gap-2 text-sm text-white/70">
            Media file
            <input type="file" accept="image/*,video/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="rounded-[16px] border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-[#F5F3EB]" />
          </label>
          <label className="grid gap-2 text-sm text-white/70">
            Alt text
            <input value={altText} onChange={(event) => setAltText(event.target.value)} className="rounded-[16px] border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-[#F5F3EB] outline-none" />
            <span className="text-xs leading-5 text-white/36">Describe the image for SEO and accessibility, for example: Residential construction team inspecting slab work.</span>
          </label>
          <label className="grid gap-2 text-sm text-white/70">
            Folder
            <input value={folder} onChange={(event) => setFolder(event.target.value)} className="rounded-[16px] border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-[#F5F3EB] outline-none" />
          </label>
          <button disabled={loading} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#D8FF6A] px-5 py-3 text-sm font-semibold text-[#111] disabled:opacity-60">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            Upload media
          </button>
        </form>
      </section>

      <section className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Uploaded assets</div>
            <h3 className="mt-2 text-xl font-black text-white">Copy URLs into CMS fields</h3>
            {missingAltCount ? (
              <p className="mt-2 text-sm leading-6 text-[#F6DA8A]">{missingAltCount} image{missingAltCount > 1 ? 's are' : ' is'} missing alt text.</p>
            ) : null}
          </div>
          <ImageIcon size={18} className="text-[#D8FF6A]" />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {rows.map((row) => (
            <article key={row.id} className="overflow-hidden rounded-[24px] border border-white/8 bg-white/5">
              {row.file_type?.startsWith('video/') || row.mime_type?.startsWith('video/') ? (
                <video className="aspect-[16/10] w-full bg-black object-cover" src={row.file_url} muted playsInline controls />
              ) : (
                <div className="aspect-[16/10] bg-cover bg-center" style={{ backgroundImage: `url('${row.file_url}')` }} />
              )}
              <div className="p-4">
                <h4 className="truncate text-sm font-semibold text-white">{row.file_name}</h4>
                <p className="mt-1 text-xs text-white/42">
                  {row.folder} · {row.provider === 'vercel_blob' ? 'Vercel Blob' : 'Supabase Storage'}
                  {row.file_size ? ` · ${(row.file_size / 1024 / 1024).toFixed(1)}MB` : ''}
                </p>
                <p className={`mt-2 text-xs leading-5 ${row.alt_text ? 'text-white/42' : 'text-[#F6DA8A]'}`}>
                  {row.alt_text || 'Alt text missing'}
                </p>
                <button type="button" onClick={() => navigator.clipboard.writeText(row.file_url)} className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/74">
                  <Copy size={13} /> Copy URL
                </button>
              </div>
            </article>
          ))}
          {!rows.length ? <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 px-5 py-10 text-center text-sm text-white/52 md:col-span-2">No media uploaded yet.</div> : null}
        </div>
      </section>
    </div>
  )
}
