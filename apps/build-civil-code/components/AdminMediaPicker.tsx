'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Check, ImageIcon, Images, Search, X } from 'lucide-react'
import { readJsonResponse } from '@/lib/safe-json'

type MediaAsset = {
  id: string
  file_name: string
  file_url: string
  file_type: string
  mime_type?: string
  alt_text: string
  folder: string
}

type AdminResponse<T> = {
  rows: T[]
}

type AdminMediaPickerProps = {
  value?: string
  selectedValues?: string[]
  onSelect?: (url: string) => void
  onSelectMany?: (urls: string[]) => void
  buttonLabel?: string
  mode?: 'single' | 'multiple'
  title?: string
  helper?: string
}

export default function AdminMediaPicker({
  value,
  selectedValues = [],
  onSelect,
  onSelectMany,
  buttonLabel = 'Choose from Media Library',
  mode = 'single',
  title,
  helper,
}: AdminMediaPickerProps) {
  const [open, setOpen] = useState(false)
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [selectedUrls, setSelectedUrls] = useState<string[]>([])
  const isMultiple = mode === 'multiple'

  const filteredAssets = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const imageAssets = assets.filter((asset) => {
      const type = asset.mime_type || asset.file_type || ''
      return type.startsWith('image/')
    })
    if (!needle) return imageAssets
    return imageAssets.filter((asset) =>
      [asset.file_name, asset.alt_text, asset.folder, asset.file_url].some((item) => (item || '').toLowerCase().includes(needle)),
    )
  }, [assets, query])

  useEffect(() => {
    if (!open) return
    setSelectedUrls(selectedValues.filter(Boolean))
  }, [open, selectedValues])

  useEffect(() => {
    if (!open || assets.length) return

    async function loadAssets() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch('/api/admin/media', { cache: 'no-store', credentials: 'same-origin' })
        const payload = await readJsonResponse<AdminResponse<MediaAsset> & { error?: string }>(response, { rows: [] })
        if (!response.ok) {
          throw new Error(response.status === 401 ? 'Your admin session expired. Please sign in again and reopen the media library.' : payload.error || 'Failed to load media assets.')
        }
        setAssets(payload.rows)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load media assets.')
      } finally {
        setLoading(false)
      }
    }

    void loadAssets()
  }, [assets.length, open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-orange-200 hover:text-slate-900"
      >
        {isMultiple ? <Images size={14} className="text-[#E87F24]" /> : <ImageIcon size={14} className="text-[#E87F24]" />}
        {buttonLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Close media picker"
            className="absolute inset-0 bg-black/72 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          <div className="relative max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-[30px] border border-slate-200 bg-[#151517] shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Media Library</div>
                <h3 className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-900">
                  {title || (isMultiple ? 'Select gallery images' : 'Select image')}
                </h3>
                {helper ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{helper}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="border-b border-slate-200 p-4 sm:p-5">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                  <Search size={15} className="text-[#E87F24]" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search file name, alt text, folder, or URL"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
                {isMultiple ? (
                  <div className="rounded-full border border-emerald-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-[#E87F24]">
                    {selectedUrls.length} selected
                  </div>
                ) : null}
              </div>
            </div>

            <div className="max-h-[56vh] overflow-y-auto p-4 sm:p-5">
              {error ? (
                <div className="rounded-[20px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                  {error}
                </div>
              ) : null}

              {loading ? (
                <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  Loading media...
                </div>
              ) : filteredAssets.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredAssets.map((asset) => {
                    const selected = isMultiple ? selectedUrls.includes(asset.file_url) : value === asset.file_url
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => {
                          if (isMultiple) {
                            setSelectedUrls((prev) =>
                              prev.includes(asset.file_url)
                                ? prev.filter((url) => url !== asset.file_url)
                                : [...prev, asset.file_url],
                            )
                            return
                          }
                          onSelect?.(asset.file_url)
                          setOpen(false)
                        }}
                        className={`group overflow-hidden rounded-[24px] border bg-slate-50 text-left transition hover:-translate-y-0.5 ${
                          selected ? 'border-[#E87F24]' : 'border-slate-200 hover:border-sky-200'
                        }`}
                      >
                        <div className="relative aspect-[16/10] bg-slate-50">
                          {selected ? (
                            <span className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#E87F24] text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
                              <Check size={15} />
                            </span>
                          ) : null}
                          <Image
                            src={asset.file_url}
                            alt={asset.alt_text || asset.file_name}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 320px, 100vw"
                          />
                        </div>
                        <div className="p-4">
                          <div className="truncate text-sm font-semibold text-slate-900">{asset.alt_text || asset.file_name}</div>
                          <div className="mt-1 truncate text-xs text-slate-400">{asset.folder || 'general'}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  No media assets found. Upload images in the Media tab first.
                </div>
              )}
            </div>
            {isMultiple ? (
              <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="text-xs leading-5 text-slate-400">
                  Select multiple images, then add them to the gallery in one step.
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUrls([])}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    disabled={!selectedUrls.length}
                    onClick={() => {
                      onSelectMany?.(selectedUrls)
                      setOpen(false)
                    }}
                    className="rounded-full bg-[#E87F24] px-5 py-2 text-xs font-black text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {selectedUrls.length ? `Add ${selectedUrls.length} image${selectedUrls.length === 1 ? '' : 's'}` : 'Add images'}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
