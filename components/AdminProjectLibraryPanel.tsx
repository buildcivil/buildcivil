'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, FolderKanban, Images, Plus, Trash2, X } from 'lucide-react'
import AdminImageUploadControl from './AdminImageUploadControl'
import AdminMediaPicker from './AdminMediaPicker'

type ProjectRow = {
  id: string
  slug: string
  title: string
  category: 'Residential' | 'Commercial' | 'Interiors' | 'Renovation'
  card_label: string
  location: string
  image: string
  description: string
  year?: string
}

type ProjectDraft = {
  id?: string
  slug: string
  title: string
  category: 'Residential' | 'Commercial' | 'Interiors' | 'Renovation'
  card_label: string
  location: string
  image: string
  description: string
  year: string
  height_class: string
  overview: string
  hero_title: string
  hero_copy: string
  seo_title: string
  seo_description: string
  seo_image: string
  highlights_text: string
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
  projects: ProjectRow[]
  draft: ProjectDraft
  selectedTitle?: string
  setDraft: React.Dispatch<React.SetStateAction<ProjectDraft>>
  emptyDraft: () => ProjectDraft
  toDraft: (row: Partial<ProjectRow>) => ProjectDraft
  onSave: () => void
  onDelete: (id: string) => void
  onImportDefaults: () => void
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20"
    />
  )
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={4}
      className="w-full resize-y rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20"
    />
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{label}</span>
      {hint ? <span className="mt-1 block text-xs leading-5 text-slate-400">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  if (!src?.trim()) {
    return <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-slate-500">Image preview</div>
  }

  return <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
}

export default function AdminProjectLibraryPanel({
  connected,
  loadError,
  saving,
  projects,
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

  function appendGalleryImage(url: string) {
    appendGalleryImages([url])
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
      return {
        ...prev,
        gallery_text: merged.join('\n'),
      }
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
      <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Projects editor</div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">
              {draft.id ? 'Edit project' : 'Add a new project'}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Add, edit, delete, and preview website project cards plus their detail pages.
            </p>
          </div>
          <button type="button" onClick={() => setDraft(emptyDraft())} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            <Plus size={14} />
            New
          </button>
        </div>

        {loadError ? (
          <div className="mt-5 rounded-[22px] border border-orange-200 bg-orange-50 px-4 py-3 text-sm leading-6 text-orange-700">
            Unable to load projects: {loadError}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50 p-3">
          <div className="grid w-full gap-3 sm:grid-cols-[minmax(220px,1fr)_auto] sm:items-center">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Select project</span>
              <select
                aria-label="Select project record"
                value={draft.id ?? ''}
                onChange={(event) => {
                  const project = projects.find((item) => item.id === event.target.value)
                  setDraft(project ? toDraft(project) : emptyDraft())
                }}
                className="mt-2 w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20"
              >
                <option value="">New project draft</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={draft.published} onChange={(event) => setDraft((prev) => ({ ...prev, published: event.target.checked }))} />
              Published status
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" disabled={!connected || saving} onClick={onSave} className="inline-flex items-center gap-3 rounded-full bg-[#E87F24] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              Save project now
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
                className="inline-flex items-center gap-2 rounded-full border border-orange-200 px-4 py-3 text-sm font-semibold text-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={14} />
                {confirmDelete ? 'Confirm delete project' : 'Delete project'}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Slug"><TextInput value={draft.slug} onChange={(event) => setDraft((prev) => ({ ...prev, slug: event.target.value }))} /></Field>
          <Field label="Title"><TextInput value={draft.title} onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))} /></Field>
          <Field label="Category">
            <select value={draft.category} onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value as ProjectDraft['category'] }))} className="w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20">
              <option>Residential</option>
              <option>Commercial</option>
              <option>Interiors</option>
              <option>Renovation</option>
            </select>
          </Field>
          <Field label="Card label"><TextInput value={draft.card_label} onChange={(event) => setDraft((prev) => ({ ...prev, card_label: event.target.value }))} /></Field>
          <Field label="Location"><TextInput value={draft.location} onChange={(event) => setDraft((prev) => ({ ...prev, location: event.target.value }))} /></Field>
          <Field label="Year"><TextInput value={draft.year} onChange={(event) => setDraft((prev) => ({ ...prev, year: event.target.value }))} /></Field>
          <Field label="Project detail image" hint="Used on the project card, project detail hero, and fallback gallery image.">
            <TextInput value={draft.image} onChange={(event) => setDraft((prev) => ({ ...prev, image: event.target.value }))} />
            <AdminImageUploadControl
              value={draft.image}
              altSeed={draft.title || 'BuildCivil project image'}
              folder="projects"
              uploadLabel="Upload project image"
              pickerLabel="Select project image"
              onChange={(url) => setDraft((prev) => ({ ...prev, image: url }))}
            />
          </Field>
          <Field label="Sort order"><TextInput type="number" value={draft.sort_order} onChange={(event) => setDraft((prev) => ({ ...prev, sort_order: Number(event.target.value) }))} /></Field>
        </div>

        <div className="mt-4 grid gap-4">
          <Field label="Description"><TextArea value={draft.description} onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))} /></Field>
          <Field label="Overview"><TextArea value={draft.overview} onChange={(event) => setDraft((prev) => ({ ...prev, overview: event.target.value }))} /></Field>
          <Field label="Hero title"><TextArea value={draft.hero_title} onChange={(event) => setDraft((prev) => ({ ...prev, hero_title: event.target.value }))} /></Field>
          <Field label="Hero copy"><TextArea value={draft.hero_copy} onChange={(event) => setDraft((prev) => ({ ...prev, hero_copy: event.target.value }))} /></Field>
          <Field label="SEO title"><TextInput value={draft.seo_title} onChange={(event) => setDraft((prev) => ({ ...prev, seo_title: event.target.value }))} /></Field>
          <Field label="SEO description"><TextArea value={draft.seo_description} onChange={(event) => setDraft((prev) => ({ ...prev, seo_description: event.target.value }))} /></Field>
          <Field label="SEO / social image" hint="Optional image used when this project detail page is shared. Leave blank to reuse the main project image.">
            <TextInput value={draft.seo_image} onChange={(event) => setDraft((prev) => ({ ...prev, seo_image: event.target.value }))} />
            <AdminImageUploadControl
              value={draft.seo_image}
              altSeed={`${draft.title || 'BuildCivil project'} social image`}
              folder="projects/seo"
              uploadLabel="Upload SEO image"
              pickerLabel="Select SEO image"
              onChange={(url) => setDraft((prev) => ({ ...prev, seo_image: url }))}
            />
          </Field>
          <Field label="Highlights" hint="One line per highlight."><TextArea value={draft.highlights_text} onChange={(event) => setDraft((prev) => ({ ...prev, highlights_text: event.target.value }))} /></Field>
          <Field label="Stats" hint="One per line: value | label"><TextArea value={draft.stats_json} onChange={(event) => setDraft((prev) => ({ ...prev, stats_json: event.target.value }))} /></Field>
          <Field label="Process steps" hint="One per line: step | title | description"><TextArea value={draft.process_json} onChange={(event) => setDraft((prev) => ({ ...prev, process_json: event.target.value }))} /></Field>
          <Field label="Project gallery" hint="Select multiple images from Media Library, upload a new one, or paste URLs manually. These images appear on the project detail page.">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E87F24]/25 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#E87F24]">
                  <Images size={14} />
                  {galleryUrls.length} gallery image{galleryUrls.length === 1 ? '' : 's'}
                </div>
                <AdminMediaPicker
                  mode="multiple"
                  selectedValues={galleryUrls}
                  buttonLabel="Select multiple images"
                  title="Build project gallery"
                  helper="Choose all the project detail images you want, then add them in one step."
                  onSelectMany={appendGalleryImages}
                />
              </div>

              {galleryUrls.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="group overflow-hidden rounded-[18px] border border-slate-200 bg-slate-50">
                      <div className="relative aspect-[16/10] bg-slate-50">
                        <PreviewImage src={url} alt={`${draft.title || 'Project'} gallery ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(url)}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-100 backdrop-blur-md transition hover:bg-[#E87F24] hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
                          aria-label="Remove gallery image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="truncate px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        Image {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-[18px] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No gallery images yet. Select multiple images to build the project detail gallery quickly.
                </div>
              )}

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Manual URL list</div>
                <div className="mt-2">
                  <TextArea value={draft.gallery_text} onChange={(event) => setDraft((prev) => ({ ...prev, gallery_text: event.target.value }))} />
                </div>
              </div>

              <AdminImageUploadControl
                value=""
                altSeed={`${draft.title || 'BuildCivil project'} gallery image`}
                folder="projects/gallery"
                uploadLabel="Upload and add"
                pickerLabel="Select one image"
                helper={'Upload adds one image. Use "Select multiple images" above for batch selection.'}
                onChange={appendGalleryImage}
              />
            </div>
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={draft.published} onChange={(event) => setDraft((prev) => ({ ...prev, published: event.target.checked }))} />
            Published
          </label>
          <button type="button" disabled={!connected || saving} onClick={onSave} className="inline-flex items-center gap-3 rounded-full bg-[#E87F24] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
            Save project
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
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 px-4 py-3 text-sm font-semibold text-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={14} />
              {confirmDelete ? 'Confirm delete' : 'Delete'}
            </button>
          ) : null}
        </div>

        {selectedTitle ? <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Editing <span className="font-semibold text-slate-900">{selectedTitle}</span></div> : null}
        {!connected && !loadError ? (
          <div className="mt-5 rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            Project editing is unavailable until the projects table connects. Other dashboard warnings will not block this section.
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Project preview</div>
          <h3 className="mt-2 text-xl font-black text-slate-900">{draft.title || 'Project title'}</h3>
          <div className="relative mt-5 h-[360px] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
            <PreviewImage src={draft.image} alt={draft.title || 'Project preview'} />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">{draft.description || 'Project description will appear here.'}</p>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Project library</div>
              <h3 className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-900">Select a project</h3>
            </div>
            <FolderKanban size={18} className="text-[#E87F24]" />
          </div>
          <div className="mt-5 space-y-3">
            {projects.length ? projects.map((project) => (
              <button key={project.id} type="button" onClick={() => setDraft(toDraft(project))} className="group flex w-full flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-3 text-left transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white/7 sm:flex-row sm:items-start">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] border border-slate-200 sm:h-20 sm:w-28 sm:shrink-0 sm:aspect-auto">
                  <PreviewImage src={project.image} alt={project.title} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="truncate text-sm font-semibold text-slate-900">{project.title}</h4>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">{project.year}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{project.description}</p>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.24em] text-slate-400">{project.category} • {project.card_label}</div>
                </div>
              </button>
            )) : (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-500">
                <div className="font-semibold text-slate-900">No projects in Supabase yet.</div>
                <p className="mt-2">Create a new project manually or import the default BuildCivil starter portfolio.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setDraft(emptyDraft())} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">Create new</button>
                  <button type="button" disabled={saving} onClick={onImportDefaults} className="rounded-full bg-[#E87F24] px-4 py-2 text-xs font-black text-white disabled:opacity-60">Import default content</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
