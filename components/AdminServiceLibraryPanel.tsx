'use client'

import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { ArrowRight, Images, Layers3, Plus, Trash2, X } from 'lucide-react'
import AdminImageUploadControl from './AdminImageUploadControl'
import AdminMediaPicker from './AdminMediaPicker'

type ServiceRow = {
  id: string
  slug: string
  icon_name: 'home' | 'palette' | 'refresh' | 'ruler' | 'briefcase'
  title: string
  description: string
  kicker: string
  image: string
}

type ServiceDraft = {
  id?: string
  slug: string
  icon_name: 'home' | 'palette' | 'refresh' | 'ruler' | 'briefcase'
  title: string
  description: string
  kicker: string
  image: string
  accent: string
  hero_title: string
  hero_copy: string
  seo_title: string
  seo_description: string
  seo_image: string
  intro: string
  bullets_text: string
  details_text: string
  stats_json: string
  process_json: string
  gallery_text: string
  published: boolean
  sort_order: number
}

type Props = {
  connected: boolean
  loadError?: string
  saving: boolean
  services: ServiceRow[]
  draft: ServiceDraft
  selectedTitle?: string
  setDraft: Dispatch<SetStateAction<ServiceDraft>>
  emptyDraft: () => ServiceDraft
  toDraft: (row: Partial<ServiceRow>) => ServiceDraft
  onSave: () => void
  onDelete: (id: string) => void
  onImportDefaults: () => void
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full rounded-[16px] border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-[#F5F3EB] outline-none transition focus:border-[#D8FF6A]/70 focus:ring-2 focus:ring-[#D8FF6A]/10" />
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} rows={4} className="w-full resize-y rounded-[16px] border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm leading-6 text-[#F5F3EB] outline-none transition focus:border-[#D8FF6A]/70 focus:ring-2 focus:ring-[#D8FF6A]/10" />
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.24em] text-white/40">{label}</span>
      {hint ? <span className="mt-1 block text-xs leading-5 text-white/38">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  if (!src?.trim()) return <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-white/45">Image preview</div>
  return <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
}

export default function AdminServiceLibraryPanel({
  connected,
  loadError,
  saving,
  services,
  draft,
  selectedTitle,
  setDraft,
  emptyDraft,
  toDraft,
  onSave,
  onDelete,
  onImportDefaults,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const galleryUrls = draft.gallery_text
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  function setGalleryImages(urls: string[]) {
    setDraft((prev) => ({
      ...prev,
      gallery_text: urls
        .map((url) => url.trim())
        .filter(Boolean)
        .join('\n'),
    }))
  }

  function appendGalleryImages(urls: string[]) {
    setDraft((prev) => {
      const existing = prev.gallery_text
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
      const merged = [...existing]
      urls.forEach((url) => {
        const cleanUrl = url.trim()
        if (cleanUrl && !merged.includes(cleanUrl)) merged.push(cleanUrl)
      })
      return { ...prev, gallery_text: merged.join('\n') }
    })
  }

  function removeGalleryImage(url: string) {
    setGalleryImages(galleryUrls.filter((item) => item !== url))
  }

  useEffect(() => {
    setConfirmDelete(false)
  }, [draft.id])

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Services editor</div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">{draft.id ? 'Edit service' : 'Add a new service'}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">Add, edit, delete, and preview website service cards plus their detail pages.</p>
          </div>
          <button type="button" onClick={() => setDraft(emptyDraft())} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/76">
            <Plus size={14} />
            New
          </button>
        </div>

        {loadError ? (
          <div className="mt-5 rounded-[22px] border border-[#E87F24]/30 bg-[#E87F24]/10 px-4 py-3 text-sm leading-6 text-[#FFBC8C]">
            Unable to load services: {loadError}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] p-3">
          <div className="grid w-full gap-3 sm:grid-cols-[minmax(220px,1fr)_auto] sm:items-center">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.24em] text-white/36">Select service</span>
              <select
                aria-label="Select service record"
                value={draft.id ?? ''}
                onChange={(event) => {
                  const service = services.find((item) => item.id === event.target.value)
                  setDraft(service ? toDraft(service) : emptyDraft())
                }}
                className="mt-2 w-full rounded-[14px] border border-white/10 bg-[#0f0f0f] px-3 py-2.5 text-sm text-[#F5F3EB] outline-none transition focus:border-[#D8FF6A]/70 focus:ring-2 focus:ring-[#D8FF6A]/10"
              >
                <option value="">New service draft</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.title}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-white/65">
              <input type="checkbox" checked={draft.published} onChange={(event) => setDraft((prev) => ({ ...prev, published: event.target.checked }))} />
              Published status
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" disabled={!connected || saving} onClick={onSave} className="inline-flex items-center gap-3 rounded-full bg-[#D8FF6A] px-5 py-3 text-sm font-semibold text-[#111111] disabled:cursor-not-allowed disabled:opacity-60">
              Save service now
              <ArrowRight size={15} />
            </button>
            {draft.id ? (
              <button
                type="button"
                disabled={!connected || saving}
                onClick={() => {
                  if (!confirmDelete) {
                    setConfirmDelete(true)
                    return
                  }
                  onDelete(draft.id!)
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[#E87F24]/30 px-4 py-3 text-sm font-semibold text-[#FFBC8C] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={14} />
                {confirmDelete ? 'Confirm delete service' : 'Delete service'}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Slug"><TextInput value={draft.slug} onChange={(event) => setDraft((prev) => ({ ...prev, slug: event.target.value }))} /></Field>
          <Field label="Icon name">
            <select value={draft.icon_name} onChange={(event) => setDraft((prev) => ({ ...prev, icon_name: event.target.value as ServiceDraft['icon_name'] }))} className="w-full rounded-[16px] border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-[#F5F3EB] outline-none transition focus:border-[#D8FF6A]/70 focus:ring-2 focus:ring-[#D8FF6A]/10">
              <option value="home">home</option>
              <option value="palette">palette</option>
              <option value="refresh">refresh</option>
              <option value="ruler">ruler</option>
              <option value="briefcase">briefcase</option>
            </select>
          </Field>
          <Field label="Title"><TextInput value={draft.title} onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))} /></Field>
          <Field label="Kicker"><TextInput value={draft.kicker} onChange={(event) => setDraft((prev) => ({ ...prev, kicker: event.target.value }))} /></Field>
          <Field label="Image URL">
            <TextInput value={draft.image} onChange={(event) => setDraft((prev) => ({ ...prev, image: event.target.value }))} />
            <AdminImageUploadControl
              value={draft.image}
              altSeed={draft.title || 'BuildCivil service image'}
              folder="services"
              uploadLabel="Upload service image"
              pickerLabel="Select service image"
              onChange={(url) => setDraft((prev) => ({ ...prev, image: url }))}
            />
          </Field>
          <Field label="Sort order"><TextInput type="number" value={draft.sort_order} onChange={(event) => setDraft((prev) => ({ ...prev, sort_order: Number(event.target.value) }))} /></Field>
        </div>

        <div className="mt-4 grid gap-4">
          <Field label="Description"><TextArea value={draft.description} onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))} /></Field>
          <Field label="Hero title"><TextArea value={draft.hero_title} onChange={(event) => setDraft((prev) => ({ ...prev, hero_title: event.target.value }))} /></Field>
          <Field label="Hero copy"><TextArea value={draft.hero_copy} onChange={(event) => setDraft((prev) => ({ ...prev, hero_copy: event.target.value }))} /></Field>
          <Field label="Intro"><TextArea value={draft.intro} onChange={(event) => setDraft((prev) => ({ ...prev, intro: event.target.value }))} /></Field>
          <Field label="SEO title"><TextInput value={draft.seo_title} onChange={(event) => setDraft((prev) => ({ ...prev, seo_title: event.target.value }))} /></Field>
          <Field label="SEO description"><TextArea value={draft.seo_description} onChange={(event) => setDraft((prev) => ({ ...prev, seo_description: event.target.value }))} /></Field>
          <Field label="Bullets" hint="One line per bullet."><TextArea value={draft.bullets_text} onChange={(event) => setDraft((prev) => ({ ...prev, bullets_text: event.target.value }))} /></Field>
          <Field label="Details" hint="One line per detail."><TextArea value={draft.details_text} onChange={(event) => setDraft((prev) => ({ ...prev, details_text: event.target.value }))} /></Field>
          <Field label="Stats" hint="One per line: value | label"><TextArea value={draft.stats_json} onChange={(event) => setDraft((prev) => ({ ...prev, stats_json: event.target.value }))} /></Field>
          <Field label="Process steps" hint="One per line: step | title | description"><TextArea value={draft.process_json} onChange={(event) => setDraft((prev) => ({ ...prev, process_json: event.target.value }))} /></Field>
          <Field label="Service gallery" hint="Select multiple images from Media Library, upload a new one, or paste URLs manually.">
            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D8FF6A]/18 bg-[#D8FF6A]/10 px-3 py-1.5 text-xs font-semibold text-[#D8FF6A]">
                  <Images size={14} />
                  {galleryUrls.length} gallery image{galleryUrls.length === 1 ? '' : 's'}
                </div>
                <AdminMediaPicker
                  mode="multiple"
                  selectedValues={galleryUrls}
                  buttonLabel="Select multiple images"
                  title="Build service gallery"
                  helper="Choose all the service detail images you want, then add them in one step."
                  onSelectMany={appendGalleryImages}
                />
              </div>

              {galleryUrls.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="group overflow-hidden rounded-[18px] border border-white/8 bg-[#0f0f0f]">
                      <div className="relative aspect-[16/10] bg-white/5">
                        <PreviewImage src={url} alt={`${draft.title || 'Service'} gallery ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(url)}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/62 text-white/82 opacity-100 backdrop-blur-md transition hover:bg-[#E87F24] hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
                          aria-label="Remove gallery image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="truncate px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/36">
                        Image {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-[18px] border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-white/46">
                  No gallery images yet. Select multiple images to build the service detail gallery quickly.
                </div>
              )}

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/34">Manual URL list</div>
                <div className="mt-2">
                  <TextArea value={draft.gallery_text} onChange={(event) => setDraft((prev) => ({ ...prev, gallery_text: event.target.value }))} />
                </div>
              </div>

              <AdminImageUploadControl
                value=""
                altSeed={`${draft.title || 'BuildCivil service'} gallery image`}
                folder="services/gallery"
                uploadLabel="Upload and add"
                pickerLabel="Select one image"
                helper={'Upload adds one image. Use "Select multiple images" above for batch selection.'}
                onChange={(url) => appendGalleryImages([url])}
              />
            </div>
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-white/65">
            <input type="checkbox" checked={draft.published} onChange={(event) => setDraft((prev) => ({ ...prev, published: event.target.checked }))} />
            Published
          </label>
          <button type="button" disabled={!connected || saving} onClick={onSave} className="inline-flex items-center gap-3 rounded-full bg-[#D8FF6A] px-5 py-3 text-sm font-semibold text-[#111111] disabled:cursor-not-allowed disabled:opacity-60">
            Save service
            <ArrowRight size={15} />
          </button>
          {draft.id ? (
            <button
              type="button"
              disabled={!connected || saving}
              onClick={() => {
                if (!confirmDelete) {
                  setConfirmDelete(true)
                  return
                }
                onDelete(draft.id!)
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[#E87F24]/30 px-4 py-3 text-sm font-semibold text-[#FFBC8C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={14} />
              {confirmDelete ? 'Confirm delete' : 'Delete'}
            </button>
          ) : null}
        </div>
        {selectedTitle ? <div className="mt-5 rounded-[22px] border border-white/8 bg-white/5 p-4 text-sm text-white/62">Editing <span className="font-semibold text-white">{selectedTitle}</span></div> : null}
        {!connected && !loadError ? (
          <div className="mt-5 rounded-[22px] border border-[#FFC81E]/25 bg-[#FFC81E]/10 p-4 text-sm leading-6 text-[#fff1c4]">
            Service editing is unavailable until the services table connects. Other dashboard warnings will not block this section.
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
          <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Service preview</div>
          <h3 className="mt-2 text-xl font-black text-white">{draft.title || 'Service title'}</h3>
          <div className="relative mt-5 h-[360px] overflow-hidden rounded-[28px] border border-white/8 bg-white/5"><PreviewImage src={draft.image} alt={draft.title || 'Service preview'} /></div>
          <p className="mt-4 text-sm leading-6 text-white/58">{draft.description || 'Service description will appear here.'}</p>
        </div>

        <div className="rounded-[30px] border border-white/8 bg-[#171719] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.26em] text-white/40">Service library</div>
              <h3 className="mt-2 text-xl font-black tracking-[-0.04em] text-white">Select a service</h3>
            </div>
            <Layers3 size={18} className="text-[#D8FF6A]" />
          </div>
          <div className="mt-5 space-y-3">
            {services.length ? services.map((service) => (
              <button key={service.id} type="button" onClick={() => setDraft(toDraft(service))} className="group flex w-full flex-col gap-4 rounded-[24px] border border-white/8 bg-white/5 p-3 text-left transition hover:-translate-y-0.5 hover:border-[#D8FF6A]/20 hover:bg-white/7 sm:flex-row sm:items-start">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] border border-white/8 sm:h-20 sm:w-28 sm:shrink-0 sm:aspect-auto"><PreviewImage src={service.image} alt={service.title} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="truncate text-sm font-semibold text-white">{service.title}</h4>
                    <span className="rounded-full border border-white/8 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-white/50">{service.kicker}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/55">{service.description}</p>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.24em] text-white/36">{service.slug}</div>
                </div>
              </button>
            )) : (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/55">
                <div className="font-semibold text-white">No services in Supabase yet.</div>
                <p className="mt-2">Create a service manually or import the default BuildCivil starter service list.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setDraft(emptyDraft())} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/74">Create new</button>
                  <button type="button" disabled={saving} onClick={onImportDefaults} className="rounded-full bg-[#D8FF6A] px-4 py-2 text-xs font-black text-[#111] disabled:opacity-60">Import default content</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
