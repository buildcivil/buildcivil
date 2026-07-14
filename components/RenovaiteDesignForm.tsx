'use client'

import { type FormEvent, useMemo, useState } from 'react'
import Image from 'next/image'
import { CheckCircle2, Loader2, Sparkles, Upload } from 'lucide-react'
import type { RenovaitePageContent } from '@/lib/site-pages'
import { readJsonResponse } from '@/lib/safe-json'

type RenovaiteDesignFormProps = {
  content: NonNullable<RenovaitePageContent['form']>
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  roomType: '',
  designStyle: '',
  numDesigns: '1',
}

export default function RenovaiteDesignForm({ content }: RenovaiteDesignFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [roomImage, setRoomImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState('')

  const roomTypes = content.roomTypes?.length
    ? content.roomTypes
    : [
        { value: 'bedroom', label: 'Bedroom' },
        { value: 'balcony', label: 'Balcony' },
        { value: 'bathroom', label: 'Bathroom' },
      ]
  const designStyles = content.designStyles?.length
    ? content.designStyles
    : [
        { value: 'eclectic', label: 'Eclectic' },
        { value: 'modern', label: 'Modern' },
        { value: 'scandinavian', label: 'Scandinavian' },
      ]
  const designCounts = content.designCounts?.length
    ? content.designCounts
    : [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
      ]
  const sideImages = useMemo(
    () => (content.sideImages ?? []).filter(Boolean).slice(0, 4),
    [content.sideImages],
  )

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.roomType &&
    form.designStyle &&
    form.numDesigns &&
    Boolean(roomImage) &&
    status !== 'submitting'

  function updateField(key: keyof typeof emptyForm, value: string) {
    setError('')
    setStatus('idle')
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function onPickImage(file: File | null) {
    setError('')
    setStatus('idle')
    setRoomImage(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit || !roomImage) {
      setError('Please fill all required fields and upload a room image.')
      return
    }

    setStatus('submitting')
    setError('')

    try {
      const body = new FormData()
      body.set('name', form.name.trim())
      body.set('email', form.email.trim())
      body.set('phone', form.phone.trim())
      body.set('roomType', form.roomType)
      body.set('designStyle', form.designStyle)
      body.set('numDesigns', form.numDesigns)
      body.set('roomImage', roomImage)
      body.set('roomImageName', roomImage.name)

      const response = await fetch('/api/renovaite-requests', {
        method: 'POST',
        body,
      })
      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Unable to submit Renovaite request.')

      setStatus('success')
      setForm(emptyForm)
      setRoomImage(null)
      setPreviewUrl(null)
    } catch (err) {
      setStatus('idle')
      setError(err instanceof Error ? err.message : 'Unable to submit Renovaite request.')
    }
  }

  return (
    <section id="generate" className="relative overflow-hidden py-14 sm:py-18 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(115,165,202,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(232,127,36,0.08),transparent_34%)]" />
      <div className="relative mx-auto w-full max-w-[1800px] px-5 sm:px-6 md:px-10 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2]">
              <Sparkles size={12} className="text-[#E87F24]" />
              {content.label ?? 'Generate designs'}
            </span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,4rem)] font-black leading-[0.94] tracking-[-0.05em] text-[#1c1712]">
              {content.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#6e6256] sm:text-base">{content.copy}</p>

            {sideImages.length ? (
              <div className="mt-8 grid grid-cols-2 gap-3">
                {sideImages.map((src) => (
                  <div key={src} className="relative h-36 overflow-hidden rounded-[22px] border border-[#73A5CA]/12 sm:h-44">
                    <Image src={src} alt="Renovaite inspiration" fill className="object-cover" sizes="240px" unoptimized />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-[30px] border border-[#73A5CA]/14 bg-white p-5 shadow-[0_18px_48px_rgba(28,23,18,0.08)] sm:p-7">
            {status === 'success' ? (
              <div className="rounded-[24px] border border-[#73A5CA]/18 bg-[#f7fafc] p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-[#73A5CA]" />
                  <div>
                    <h3 className="text-xl font-semibold text-[#1c1712]">Request received</h3>
                    <p className="mt-2 text-sm leading-6 text-[#6e6256]">
                      {content.successMessage ??
                        'Thanks — your Renovaite request is in. Our team will follow up shortly.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="btn-primary mt-5 inline-flex px-5 py-3 text-sm font-semibold"
                >
                  Submit another
                </button>
              </div>
            ) : (
              <form className="grid gap-4" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1c1712]">Name *</span>
                    <input
                      required
                      value={form.name}
                      onChange={(event) => updateField('name', event.target.value)}
                      className="rounded-2xl border border-[#73A5CA]/18 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#E87F24]/45 focus:ring-2 focus:ring-[#E87F24]/10"
                      placeholder="Your full name"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1c1712]">Phone *</span>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(event) => updateField('phone', event.target.value)}
                      className="rounded-2xl border border-[#73A5CA]/18 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#E87F24]/45 focus:ring-2 focus:ring-[#E87F24]/10"
                      placeholder="+91 ..."
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1c1712]">Email *</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className="rounded-2xl border border-[#73A5CA]/18 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#E87F24]/45 focus:ring-2 focus:ring-[#E87F24]/10"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1c1712]">Upload room image *</span>
                  <div className="rounded-2xl border border-dashed border-[#73A5CA]/28 bg-[#faf9f5] px-4 py-5">
                    <input
                      required
                      type="file"
                      accept="image/*"
                      onChange={(event) => onPickImage(event.target.files?.[0] ?? null)}
                      className="block w-full text-sm text-[#6e6256] file:mr-4 file:rounded-full file:border-0 file:bg-[#E87F24] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                    />
                    {previewUrl ? (
                      <div className="relative mt-4 h-40 overflow-hidden rounded-2xl border border-[#73A5CA]/12">
                        <Image src={previewUrl} alt="Room preview" fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <p className="mt-3 inline-flex items-center gap-2 text-xs text-[#6e6256]">
                        <Upload size={14} /> Clear, well-lit room photo works best.
                      </p>
                    )}
                  </div>
                </label>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1c1712]">Room type *</span>
                    <select
                      required
                      value={form.roomType}
                      onChange={(event) => updateField('roomType', event.target.value)}
                      className="rounded-2xl border border-[#73A5CA]/18 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#E87F24]/45"
                    >
                      <option value="">Select</option>
                      {roomTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1c1712]">Design style *</span>
                    <select
                      required
                      value={form.designStyle}
                      onChange={(event) => updateField('designStyle', event.target.value)}
                      className="rounded-2xl border border-[#73A5CA]/18 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#E87F24]/45"
                    >
                      <option value="">Select</option>
                      {designStyles.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1c1712]">No. of designs *</span>
                    <select
                      required
                      value={form.numDesigns}
                      onChange={(event) => updateField('numDesigns', event.target.value)}
                      className="rounded-2xl border border-[#73A5CA]/18 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#E87F24]/45"
                    >
                      {designCounts.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-[#E87F24]/28 bg-[#fff4e8] px-4 py-3 text-sm text-[#8c4f12]">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="btn-primary mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {status === 'submitting' ? <Loader2 size={16} className="animate-spin" /> : null}
                  {content.submitLabel ?? 'Generate Designs'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
