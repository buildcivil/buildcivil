'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowRight, GripVertical, Plus, Save, Settings, Trash2 } from 'lucide-react'
import {
  globalLayoutDefaults,
  mergeGlobalLayoutSettings,
  type FooterContactRow,
  type FooterSocialLink,
  type GlobalLayoutSettings,
  type GlobalLink,
} from '@buildcivil/cms/site-settings-defaults'
import { publishRefresh } from '@/lib/admin-publish'
import { readJsonResponse } from '@buildcivil/cms/safe-json'

const inputClass = 'w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20'

type SettingsResponse = {
  connected: boolean
  settings: GlobalLayoutSettings
  error?: string
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function colorInputValue(value: unknown, fallback = '#000000') {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-500">{label}</div>
      {children}
      {hint ? <p className="mt-2 text-xs leading-5 text-slate-400">{hint}</p> : null}
    </label>
  )
}

function SortableNavItem({
  link,
  onChange,
  onDelete,
}: {
  link: GlobalLink
  onChange: (updates: Partial<GlobalLink>) => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-[auto_1fr_1fr_auto] md:items-center">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500"
          aria-label={`Drag ${link.label}`}
        >
          <GripVertical size={16} />
        </button>
        <input className={inputClass} value={link.label} onChange={(event) => onChange({ label: event.target.value })} placeholder="Label" />
        <input className={inputClass} value={link.href} onChange={(event) => onChange({ href: event.target.value })} placeholder="/href" />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={link.visible} onChange={(event) => onChange({ visible: event.target.checked })} />
            Visible
          </label>
          <button type="button" onClick={onDelete} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E87F24]/25 text-orange-700">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function TextLinkEditor({
  title,
  links,
  onChange,
  onAdd,
}: {
  title: string
  links: GlobalLink[]
  onChange: (links: GlobalLink[]) => void
  onAdd: () => GlobalLink
}) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
        <button type="button" onClick={() => onChange([...links, onAdd()])} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
          <Plus size={13} /> Add
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        {links.map((link, index) => (
          <div key={link.id} className="grid gap-3 rounded-[18px] border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_1fr_auto] md:items-center">
            <input className={inputClass} value={link.label} onChange={(event) => onChange(links.map((item, i) => i === index ? { ...item, label: event.target.value } : item))} placeholder="Label" />
            <input className={inputClass} value={link.href} onChange={(event) => onChange(links.map((item, i) => i === index ? { ...item, href: event.target.value } : item))} placeholder="/href" />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={link.visible} onChange={(event) => onChange(links.map((item, i) => i === index ? { ...item, visible: event.target.checked } : item))} />
                Visible
              </label>
              <button type="button" onClick={() => onChange(links.filter((_, i) => i !== index))} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E87F24]/25 text-orange-700">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SettingsPreview({ settings }: { settings: GlobalLayoutSettings }) {
  const headerLinks = settings.header.navLinks.filter((link) => link.visible)
  const footerLinks = settings.footer.companyLinks.filter((link) => link.visible)
  const informationLinks = settings.footer.informationLinks.filter((link) => link.visible)
  const resourcesLinks = settings.footer.resourcesLinks.filter((link) => link.visible)

  return (
    <div className="space-y-4">
      <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Header preview</div>
        {settings.header.mobileTopBar.visible ? (
          <div
            className="mt-4 rounded-t-[1.2rem] border border-[#73A5CA]/18 px-4 py-2 text-center text-xs font-medium"
            style={{
              backgroundColor: settings.header.mobileTopBar.backgroundColor,
              color: settings.header.mobileTopBar.textColor,
            }}
          >
            <span>{settings.header.mobileTopBar.locationText}</span>
            <span className="mx-2" style={{ color: settings.header.mobileTopBar.accentColor }}>●</span>
            <span className="font-black">{settings.header.mobileTopBar.phoneLabel}</span>
          </div>
        ) : null}
        <div className={`${settings.header.mobileTopBar.visible ? 'mt-0 rounded-b-[2rem]' : 'mt-4 rounded-b-[2rem]'} border border-[#73A5CA]/18 bg-[#FEFDDF] p-4 text-[#1c1712]`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#FFC81E]/35">
                <div className="flex flex-col items-start font-black leading-[0.78]">
                  <span>{settings.header.brand.markTop}</span>
                  <span className="text-[#E87F24]">{settings.header.brand.markBottom}</span>
                </div>
              </div>
              <div className="flex flex-col font-black uppercase leading-[0.78]">
                <span>{settings.header.brand.wordTop}</span>
                <span className="text-[#E87F24]">{settings.header.brand.wordBottom}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
              {headerLinks.map((link) => <span key={link.id}>{link.label}</span>)}
            </div>
            {settings.header.cta.visible ? (
              <span className="rounded-full bg-gradient-to-r from-[#E87F24] via-[#FFC81E] to-[#f2dc73] px-4 py-2 text-xs font-semibold">
                {settings.header.cta.label}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Footer preview</div>
        <div className="mt-4 rounded-[24px] border border-slate-200 bg-[#11100f] p-5 text-[#FEFDDF]">
          <div className="grid gap-5 md:grid-cols-5">
            <div>
              <div className="text-2xl font-black">{settings.footer.bigText}</div>
              <p className="mt-3 text-sm leading-6 text-[#FEFDDF]/60">{settings.footer.description}</p>
            </div>
            <div>
              <div className="font-semibold">{settings.footer.companyTitle}</div>
              <div className="mt-3 grid gap-2 text-sm text-[#FEFDDF]/60">
                {footerLinks.slice(0, 5).map((link) => <span key={link.id}>{link.label}</span>)}
              </div>
            </div>
            <div>
              <div className="font-semibold">{settings.footer.informationTitle}</div>
              <div className="mt-3 grid gap-2 text-sm text-[#FEFDDF]/60">
                {informationLinks.slice(0, 5).map((link) => <span key={link.id}>{link.label}</span>)}
              </div>
            </div>
            <div>
              <div className="font-semibold">{settings.footer.resourcesTitle}</div>
              <div className="mt-3 grid gap-2 text-sm text-[#FEFDDF]/60">
                {resourcesLinks.slice(0, 5).map((link) => <span key={link.id}>{link.label}</span>)}
              </div>
            </div>
            <div>
              <div className="font-semibold">{settings.footer.newsletter.title}</div>
              <p className="mt-3 text-sm text-[#FEFDDF]/60">{settings.footer.newsletter.consent}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function AdminSettingsPanel() {
  const [settings, setSettings] = useState<GlobalLayoutSettings>(globalLayoutDefaults)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const headerLinkIds = useMemo(() => settings.header.navLinks.map((link) => link.id), [settings.header.navLinks])

  async function loadSettings() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/settings', { cache: 'no-store' })
      const payload = await readJsonResponse<SettingsResponse>(response, {
        connected: false,
        settings: globalLayoutDefaults,
      })
      if (!response.ok) throw new Error(payload.error || 'Failed to load settings.')
      setSettings(mergeGlobalLayoutSettings(payload.settings))
      setConnected(payload.connected)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSettings()
  }, [])

  function updateSettings(updater: (current: GlobalLayoutSettings) => GlobalLayoutSettings) {
    setSettings((current) => mergeGlobalLayoutSettings(updater(current)))
  }

  function onHeaderDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = settings.header.navLinks.findIndex((link) => link.id === active.id)
    const newIndex = settings.header.navLinks.findIndex((link) => link.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return
    updateSettings((current) => ({
      ...current,
      header: {
        ...current.header,
        navLinks: arrayMove(current.header.navLinks, oldIndex, newIndex),
      },
    }))
  }

  function validate() {
    const allLinks = [
      ...settings.header.navLinks,
      settings.header.cta,
      ...settings.footer.companyLinks,
      ...settings.footer.informationLinks,
      ...settings.footer.resourcesLinks,
      ...settings.footer.socialLinks,
      ...settings.footer.legalLinks,
      ...settings.footer.contactRows,
    ]
    const invalid = allLinks.find((link) => link.visible && (!link.label.trim() || !link.href.trim()))
    if (invalid) return 'Visible links must have both label and href.'
    if (!settings.footer.bigText.trim()) return 'Footer big text is required.'
    return ''
  }

  async function saveSettings() {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)
    setMessage('')
    setError('')
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      const payload = await readJsonResponse<SettingsResponse>(response, {
        connected: false,
        settings,
      })
      if (!response.ok) throw new Error(payload.error || 'Failed to save settings.')
      setSettings(mergeGlobalLayoutSettings(payload.settings))
      await publishRefresh()
      setMessage('Header and footer settings saved and public cache refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
        Loading global settings...
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-slate-400">
              <Settings size={13} className="text-[#E87F24]" />
              Global layout CMS
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">Header & footer settings</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Edit the shared header and footer once. Changes apply across every public page.
            </p>
          </div>
          <button
            type="button"
            disabled={!connected || saving}
            onClick={saveSettings}
            className="inline-flex items-center gap-3 rounded-full bg-[#E87F24] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Save size={15} />
            Save settings
          </button>
        </div>

        {!connected ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-orange-50 px-4 py-3 text-sm text-slate-600">Live database is unavailable in this environment, so global setting saves are paused.</div> : null}
        {message ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
        {error ? <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">{error}</div> : null}

        <div className="mt-6 grid gap-5">
          <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-lg font-black text-slate-900">Brand</h3>
            <div className="mt-4 grid gap-4">
              <Field label="Logo click URL" hint="Logo image, favicon, and logo sizing are managed in Advanced / Logos & Brand.">
                <input
                  className={inputClass}
                  value={settings.header.brand.href}
                  onChange={(event) => updateSettings((current) => ({
                    ...current,
                    header: { ...current.header, brand: { ...current.header.brand, href: event.target.value } },
                    footer: { ...current.footer, brand: { ...current.footer.brand, href: event.target.value } },
                  }))}
                />
              </Field>
              <div className="rounded-[20px] border border-[#E87F24]/20 bg-[#E87F24]/8 px-4 py-3 text-sm leading-6 text-slate-500">
                Text logo fields were removed from this page to avoid confusion. Use the image logo controls in Logos & Brand.
              </div>
            </div>
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Mobile top contact bar</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  This appears above the mobile/tablet header, like a compact location and WhatsApp strip.
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={settings.header.mobileTopBar.visible}
                  onChange={(event) => updateSettings((current) => ({
                    ...current,
                    header: {
                      ...current.header,
                      mobileTopBar: { ...current.header.mobileTopBar, visible: event.target.checked },
                    },
                  }))}
                />
                Visible on mobile
              </label>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Location text">
                <input
                  className={inputClass}
                  value={settings.header.mobileTopBar.locationText}
                  onChange={(event) => updateSettings((current) => ({
                    ...current,
                    header: {
                      ...current.header,
                      mobileTopBar: { ...current.header.mobileTopBar, locationText: event.target.value },
                    },
                  }))}
                  placeholder="Dehradun | Lucknow | Noida"
                />
              </Field>
              <Field label="Phone / WhatsApp label">
                <input
                  className={inputClass}
                  value={settings.header.mobileTopBar.phoneLabel}
                  onChange={(event) => updateSettings((current) => ({
                    ...current,
                    header: {
                      ...current.header,
                      mobileTopBar: { ...current.header.mobileTopBar, phoneLabel: event.target.value },
                    },
                  }))}
                  placeholder="+91 83030 76294"
                />
              </Field>
              <Field label="Phone / WhatsApp link" hint="Use a WhatsApp link like https://wa.me/918303076294 or a tel: link.">
                <input
                  className={inputClass}
                  value={settings.header.mobileTopBar.phoneHref}
                  onChange={(event) => updateSettings((current) => ({
                    ...current,
                    header: {
                      ...current.header,
                      mobileTopBar: { ...current.header.mobileTopBar, phoneHref: event.target.value },
                    },
                  }))}
                  placeholder="https://wa.me/918303076294"
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['backgroundColor', 'Background'],
                  ['textColor', 'Text'],
                  ['accentColor', 'WhatsApp icon'],
                ].map(([key, label]) => (
                  <Field key={key} label={label}>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={colorInputValue(settings.header.mobileTopBar[key as keyof typeof settings.header.mobileTopBar])}
                        onChange={(event) => updateSettings((current) => ({
                          ...current,
                          header: {
                            ...current.header,
                            mobileTopBar: { ...current.header.mobileTopBar, [key]: event.target.value },
                          },
                        }))}
                        className="h-11 w-12 shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-1"
                      />
                      <input
                        className={`${inputClass} px-3`}
                        value={String(settings.header.mobileTopBar[key as keyof typeof settings.header.mobileTopBar] || '')}
                        onChange={(event) => updateSettings((current) => ({
                          ...current,
                          header: {
                            ...current.header,
                            mobileTopBar: { ...current.header.mobileTopBar, [key]: event.target.value },
                          },
                        }))}
                      />
                    </div>
                  </Field>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Header menu</h3>
                <p className="mt-1 text-xs text-slate-400">Drag items to change the sequence.</p>
              </div>
              <button
                type="button"
                onClick={() => updateSettings((current) => ({
                  ...current,
                  header: {
                    ...current.header,
                    navLinks: [...current.header.navLinks, { id: uid('nav'), label: 'NEW LINK', href: '/', visible: true }],
                  },
                }))}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600"
              >
                <Plus size={13} /> Add
              </button>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onHeaderDragEnd}>
              <SortableContext items={headerLinkIds} strategy={verticalListSortingStrategy}>
                <div className="mt-4 grid gap-3">
                  {settings.header.navLinks.map((link, index) => (
                    <SortableNavItem
                      key={link.id}
                      link={link}
                      onChange={(updates) => updateSettings((current) => ({
                        ...current,
                        header: {
                          ...current.header,
                          navLinks: current.header.navLinks.map((item, i) => i === index ? { ...item, ...updates } : item),
                        },
                      }))}
                      onDelete={() => updateSettings((current) => ({
                        ...current,
                        header: {
                          ...current.header,
                          navLinks: current.header.navLinks.filter((_, i) => i !== index),
                        },
                      }))}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-lg font-black text-slate-900">Header CTA</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-center">
              <input className={inputClass} value={settings.header.cta.label} onChange={(event) => updateSettings((current) => ({ ...current, header: { ...current.header, cta: { ...current.header.cta, label: event.target.value } } }))} />
              <input className={inputClass} value={settings.header.cta.href} onChange={(event) => updateSettings((current) => ({ ...current, header: { ...current.header, cta: { ...current.header.cta, href: event.target.value } } }))} />
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={settings.header.cta.visible} onChange={(event) => updateSettings((current) => ({ ...current, header: { ...current.header, cta: { ...current.header.cta, visible: event.target.checked } } }))} />
                Visible
              </label>
            </div>
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-lg font-black text-slate-900">Footer copy</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Description">
                <textarea className={`${inputClass} min-h-[110px]`} value={settings.footer.description} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, description: event.target.value } }))} />
              </Field>
              <Field label="Big brand text">
                <input className={inputClass} value={settings.footer.bigText} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, bigText: event.target.value } }))} />
              </Field>
              <Field label="Company title">
                <input className={inputClass} value={settings.footer.companyTitle} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, companyTitle: event.target.value } }))} />
              </Field>
              <Field label="Back to top href">
                <input className={inputClass} value={settings.footer.backToTopHref} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, backToTopHref: event.target.value } }))} />
              </Field>
              <Field label="Copyright">
                <input className={inputClass} value={settings.footer.copyright} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, copyright: event.target.value } }))} />
              </Field>
            </div>
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-lg font-black text-slate-900">Footer contact rows</h3>
            <div className="mt-4 grid gap-3">
              {settings.footer.contactRows.map((row, index) => (
                <div key={row.id} className="grid gap-3 rounded-[18px] border border-slate-200 bg-slate-50 p-3 md:grid-cols-[0.8fr_1fr_1fr_1fr_auto] md:items-center">
                  <select
                    className={inputClass}
                    value={row.type}
                    onChange={(event) => updateSettings((current) => ({
                      ...current,
                      footer: {
                        ...current.footer,
                        contactRows: current.footer.contactRows.map((item, i) => i === index ? { ...item, type: event.target.value as FooterContactRow['type'] } : item),
                      },
                    }))}
                  >
                    <option value="address">address</option>
                    <option value="email">email</option>
                    <option value="phone">phone</option>
                  </select>
                  <input className={inputClass} value={row.label} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, contactRows: current.footer.contactRows.map((item, i) => i === index ? { ...item, label: event.target.value } : item) } }))} />
                  <input className={inputClass} value={row.value} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, contactRows: current.footer.contactRows.map((item, i) => i === index ? { ...item, value: event.target.value } : item) } }))} />
                  <input className={inputClass} value={row.href} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, contactRows: current.footer.contactRows.map((item, i) => i === index ? { ...item, href: event.target.value } : item) } }))} />
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={row.visible} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, contactRows: current.footer.contactRows.map((item, i) => i === index ? { ...item, visible: event.target.checked } : item) } }))} />
                    Visible
                  </label>
                </div>
              ))}
            </div>
          </section>

          <TextLinkEditor
            title="Footer company links"
            links={settings.footer.companyLinks}
            onChange={(links) => updateSettings((current) => ({ ...current, footer: { ...current.footer, companyLinks: links } }))}
            onAdd={() => ({ id: uid('footer-link'), label: 'New Link', href: '/', visible: true })}
          />

          <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
            <Field label="Information column title">
              <input className={inputClass} value={settings.footer.informationTitle} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, informationTitle: event.target.value } }))} />
            </Field>
          </section>

          <TextLinkEditor
            title="Footer information links"
            links={settings.footer.informationLinks}
            onChange={(links) => updateSettings((current) => ({ ...current, footer: { ...current.footer, informationLinks: links } }))}
            onAdd={() => ({ id: uid('info-link'), label: 'New Link', href: '/', visible: true })}
          />

          <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
            <Field label="Resources column title">
              <input className={inputClass} value={settings.footer.resourcesTitle} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, resourcesTitle: event.target.value } }))} />
            </Field>
          </section>

          <TextLinkEditor
            title="Footer resources links"
            links={settings.footer.resourcesLinks}
            onChange={(links) => updateSettings((current) => ({ ...current, footer: { ...current.footer, resourcesLinks: links } }))}
            onAdd={() => ({ id: uid('resource-link'), label: 'New Link', href: '/', visible: true })}
          />

          <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-lg font-black text-slate-900">Newsletter</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <input className={inputClass} value={settings.footer.newsletter.title} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, newsletter: { ...current.footer.newsletter, title: event.target.value } } }))} />
              </Field>
              <Field label="Placeholder">
                <input className={inputClass} value={settings.footer.newsletter.placeholder} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, newsletter: { ...current.footer.newsletter, placeholder: event.target.value } } }))} />
              </Field>
              <Field label="Button label">
                <input className={inputClass} value={settings.footer.newsletter.buttonLabel} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, newsletter: { ...current.footer.newsletter, buttonLabel: event.target.value } } }))} />
              </Field>
              <Field label="Visible">
                <label className="flex items-center gap-2 pt-3 text-sm text-slate-600">
                  <input type="checkbox" checked={settings.footer.newsletter.visible} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, newsletter: { ...current.footer.newsletter, visible: event.target.checked } } }))} />
                  Show newsletter block
                </label>
              </Field>
              <Field label="Consent">
                <textarea className={`${inputClass} min-h-[100px]`} value={settings.footer.newsletter.consent} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, newsletter: { ...current.footer.newsletter, consent: event.target.value } } }))} />
              </Field>
            </div>
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-900">Social links</h3>
              <button
                type="button"
                onClick={() => updateSettings((current) => ({
                  ...current,
                  footer: {
                    ...current.footer,
                    socialLinks: [...current.footer.socialLinks, { id: uid('social'), label: 'Social', href: '/contact', icon: 'instagram', visible: true }],
                  },
                }))}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600"
              >
                <Plus size={13} /> Add
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {settings.footer.socialLinks.map((link, index) => (
                <div key={link.id} className="grid gap-3 rounded-[18px] border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_1fr_0.8fr_auto] md:items-center">
                  <input className={inputClass} value={link.label} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, socialLinks: current.footer.socialLinks.map((item, i) => i === index ? { ...item, label: event.target.value } : item) } }))} />
                  <input className={inputClass} value={link.href} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, socialLinks: current.footer.socialLinks.map((item, i) => i === index ? { ...item, href: event.target.value } : item) } }))} />
                  <select className={inputClass} value={link.icon} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, socialLinks: current.footer.socialLinks.map((item, i) => i === index ? { ...item, icon: event.target.value as FooterSocialLink['icon'] } : item) } }))}>
                    <option value="instagram">instagram</option>
                    <option value="twitter">twitter</option>
                    <option value="linkedin">linkedin</option>
                    <option value="facebook">facebook</option>
                  </select>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input type="checkbox" checked={link.visible} onChange={(event) => updateSettings((current) => ({ ...current, footer: { ...current.footer, socialLinks: current.footer.socialLinks.map((item, i) => i === index ? { ...item, visible: event.target.checked } : item) } }))} />
                      Visible
                    </label>
                    <button type="button" onClick={() => updateSettings((current) => ({ ...current, footer: { ...current.footer, socialLinks: current.footer.socialLinks.filter((_, i) => i !== index) } }))} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E87F24]/25 text-orange-700">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <TextLinkEditor
            title="Legal links"
            links={settings.footer.legalLinks}
            onChange={(links) => updateSettings((current) => ({ ...current, footer: { ...current.footer, legalLinks: links } }))}
            onAdd={() => ({ id: uid('legal'), label: 'Legal Link', href: '/contact', visible: true })}
          />
        </div>
      </section>

      <SettingsPreview settings={settings} />
    </div>
  )
}
