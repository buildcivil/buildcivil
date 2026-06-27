'use client'

import { useEffect, useState } from 'react'
import { Loader2, Upload } from 'lucide-react'
import AdminMediaPicker from './AdminMediaPicker'
import { readJsonResponse } from '@/lib/safe-json'

type MediaUploadRow = {
  file_url: string
}

type UploadResponse = {
  ok?: boolean
  error?: string
  rows?: MediaUploadRow[]
}

type AdminImageUploadControlProps = {
  value?: string
  onChange: (url: string) => void
  altSeed?: string
  folder?: string
  uploadLabel?: string
  pickerLabel?: string
  helper?: string
}

function resolveUploadError(response: Response, fallback: string, payloadError?: string) {
  if (response.status === 401) {
    return 'Your admin session expired. Please sign in again and retry the upload.'
  }
  return payloadError || fallback
}

export default function AdminImageUploadControl({
  value,
  onChange,
  altSeed = 'BuildCivil project image',
  folder = 'projects',
  uploadLabel = 'Upload image',
  pickerLabel = 'Choose existing image',
  helper = 'Uploads keep the original image file and store it in Supabase Storage.',
}: AdminImageUploadControlProps) {
  const [file, setFile] = useState<File | null>(null)
  const [altText, setAltText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileSizeMb = file ? file.size / 1024 / 1024 : 0

  useEffect(() => {
    if (!file || altText.trim()) return
    setAltText(altSeed.trim() || file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '))
  }, [altSeed, altText, file])

  async function uploadImage() {
    if (!file) {
      setError('Please choose an image first.')
      return
    }
    if (!altText.trim()) {
      setError('Please add alt text before uploading the image.')
      return
    }

    setUploading(true)
    setError('')
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('alt_text', altText.trim())
      data.append('folder', folder)
      data.append('provider_preference', 'supabase')

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: data,
        credentials: 'same-origin',
      })
      const payload = await readJsonResponse<UploadResponse>(response, {})
      if (!response.ok) throw new Error(resolveUploadError(response, 'Upload failed.', payload.error))

      const url = payload.rows?.[0]?.file_url
      if (!url) throw new Error('Upload completed, but no image URL was returned.')

      onChange(url)
      setFile(null)
      setAltText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mt-3 rounded-[18px] border border-white/8 bg-white/[0.03] p-3">
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <label className="grid gap-2 text-xs text-white/55">
          Image file
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="rounded-[14px] border border-white/10 bg-[#0f0f0f] px-3 py-2 text-xs text-[#F5F3EB]"
          />
        </label>
        <label className="grid gap-2 text-xs text-white/55">
          Alt text
          <input
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder={altSeed}
            className="rounded-[14px] border border-white/10 bg-[#0f0f0f] px-3 py-2 text-xs text-[#F5F3EB] outline-none"
          />
        </label>
        <button
          type="button"
          disabled={uploading || !file}
          onClick={uploadImage}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8FF6A] px-4 py-2.5 text-xs font-black text-[#111] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploadLabel}
        </button>
      </div>
      {file && fileSizeMb > 2 ? (
        <div className="mt-3 rounded-2xl border border-[#FFC81E]/25 bg-[#FFC81E]/10 px-3 py-2 text-xs leading-5 text-[#F6DA8A]">
          This image is {fileSizeMb.toFixed(1)}MB. It will upload at its original size and quality.
        </div>
      ) : null}
      {error ? (
        <div className="mt-3 rounded-2xl border border-[#E87F24]/30 bg-[#2a1b11] px-3 py-2 text-xs leading-5 text-[#ffd7b2]">
          {error}
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <AdminMediaPicker value={value} onSelect={onChange} buttonLabel={pickerLabel} />
        <span className="text-xs leading-5 text-white/36">{helper}</span>
      </div>
    </div>
  )
}
