'use client'

import { type FormEvent, useState } from 'react'
import { CheckCircle2, Clock3, Loader2, Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import NavbarClient from '@/components/NavbarClient'
import FooterClient from '@/components/FooterClient'
import { itemReveal, sectionReveal } from './motion'
import type { PublicFormDefinition } from '@/lib/form-definitions'
import type { ContactPageContent } from '@/lib/site-pages'
import { readJsonResponse } from '@/lib/safe-json'
import { sectionStyleVars } from '@/lib/section-style'
import type { GlobalLayoutSettings } from '@/lib/site-settings-defaults'

const MotionDiv = motion.div
const MotionSection = motion.section

const fallbackContactPills: NonNullable<ContactPageContent['contactCards']> = [
  { icon: 'phone', label: 'Call us', value: '+91 83030 76294' },
  { icon: 'mail', label: 'Email us', value: 'office@buildcivil.in' },
  { icon: 'map', label: 'Visit us', value: 'Uttar Pradesh, India' },
]

const fallbackOfficeHighlights = [
  { label: 'Response time', value: 'Within 1 business day' },
  { label: 'Working hours', value: 'Mon-Sat, 8AM-5:30PM' },
  { label: 'Project types', value: 'Homes, interiors, commercial' },
]

const fallbackLocation = {
  label: 'Our location',
  title: "We're based in Uttar Pradesh, India.",
  copy: "Use the map to understand our location, then send the form on the left and we'll follow up with the right next step.",
  mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=77.3000%2C28.5600%2C77.4000%2C28.6700&layer=mapnik',
  detailTitle: 'Uttar Pradesh, India',
  detailCopy: 'We coordinate projects across homes, interiors, renovations, and commercial spaces.',
  email: 'office@buildcivil.in',
  phone: '+91 83030 76294',
}

const contactIconMap = {
  phone: Phone,
  mail: Mail,
  map: MapPin,
}

const emptyContactForm = {
  name: '',
  phone: '',
  email: '',
  project_type: '',
  details: '',
}

type ContactPageClientProps = {
  content?: Partial<ContactPageContent>
  formDefinition?: PublicFormDefinition
  layoutSettings: GlobalLayoutSettings
}

export default function ContactPageClient({ content, formDefinition, layoutSettings }: ContactPageClientProps) {
  const hero = content?.hero
  const formCopy = content?.form
  const sectionSettings = content?.sectionSettings ?? {}
  const contactPills = content?.contactCards?.length ? content.contactCards : fallbackContactPills
  const officeHighlights = content?.officeHighlights?.length ? content.officeHighlights : fallbackOfficeHighlights
  const location = { ...fallbackLocation, ...(content?.location ?? {}) }
  const getField = (name: string) => formDefinition?.fields.find((field) => field.name === name || field.id === name)
  const [form, setForm] = useState(emptyContactForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState('')

  const canSubmit =
    Boolean(form.name.trim()) &&
    Boolean(form.phone.trim()) &&
    Boolean(form.email.trim()) &&
    Boolean(form.project_type.trim()) &&
    Boolean(form.details.trim()) &&
    status !== 'submitting'

  function updateForm(key: keyof typeof form, value: string) {
    setError('')
    setStatus('idle')
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!canSubmit) {
      setError(formDefinition?.error_message ?? 'Please fill all fields before submitting.')
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Unable to submit your message.')

      setStatus('success')
      setForm(emptyContactForm)
    } catch (err) {
      setStatus('idle')
      setError(err instanceof Error ? err.message : 'Unable to submit your message.')
    }
  }

  return (
    <main className="public-site cms-section-surface">
      <NavbarClient settings={layoutSettings.header} />

      <MotionSection
        className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36"
        style={sectionStyleVars(sectionSettings.hero)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={sectionReveal}
      >
        <div className="cms-section-fill absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(115,165,202,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.16),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(115,165,202,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(232,127,36,0.08)_1px,transparent_1px)] [background-size:240px_240px] [mask-image:linear-gradient(180deg,transparent,black_14%,black_88%,transparent)]" />

        <div className="relative mx-auto w-full max-w-[1800px] px-5 pb-14 sm:px-6 md:px-10 lg:px-16">
          <MotionDiv className="mx-auto flex max-w-4xl flex-col items-center text-center" variants={itemReveal}>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2] shadow-[0_12px_28px_rgba(28,23,18,0.06)] backdrop-blur-sm">
              <Sparkles size={12} className="text-[#E87F24]" />
              {hero?.label ?? 'Contact BuildCivil'}
            </div>

            <h1 className="cms-hero-title mt-6 max-w-4xl text-[clamp(2.6rem,7vw,6.6rem)] font-black leading-[0.88] tracking-[-0.065em] text-[#1c1712]">
              {hero?.title ?? "Let's talk about your next build."}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6e6256] sm:text-lg">
              {hero?.copy ?? "Share the kind of project you have in mind and we'll help shape the scope, timeline, and delivery approach with clarity and care."}
            </p>
          </MotionDiv>

          <MotionDiv className="mt-10 grid gap-4 md:grid-cols-3" variants={sectionReveal}>
            {contactPills.map((item) => {
              const Icon = contactIconMap[(item.icon ?? 'phone') as keyof typeof contactIconMap] ?? Phone
              return (
                <MotionDiv
                  key={item.label}
                  className="rounded-[28px] border border-[#73A5CA]/12 bg-white/82 p-5 text-left shadow-[0_16px_40px_rgba(28,23,18,0.08)] backdrop-blur-sm"
                  variants={itemReveal}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#73A5CA]/12">
                    <Icon size={18} className="text-[#E87F24]" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-[#1c1712]">{item.label}</h2>
                  <p className="mt-2 text-sm font-medium text-[#5d8fb2]">{item.value}</p>
                </MotionDiv>
              )
            })}
          </MotionDiv>
        </div>
      </MotionSection>

      <section className="cms-section-surface relative overflow-hidden py-10 sm:py-16 lg:py-20" style={sectionStyleVars(sectionSettings.form)}>
        <div className="cms-section-fill absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.08),transparent_30%)]" />

        <div className="relative mx-auto w-full max-w-[1800px] px-5 sm:px-6 md:px-10 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
            <MotionDiv
              className="rounded-[40px] border border-[#73A5CA]/14 bg-white/88 p-6 shadow-[0_24px_70px_rgba(28,23,18,0.1)] sm:p-8 lg:p-10"
              variants={itemReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.26em] text-[#5d8fb2]">
                <Send size={16} className="text-[#E87F24]" />
                Quick inquiry
              </div>

              <h2 className="mt-5 max-w-2xl text-[clamp(2rem,4vw,4.2rem)] font-black leading-[0.92] tracking-[-0.05em] text-[#1c1712]">
                {formCopy?.title ?? "Send us your brief and we'll help shape the project."}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6e6256] sm:text-base">
                {formCopy?.copy ?? "Tell us what you're building, where the site is, and the kind of support you need. We'll come back with the right next step."}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {officeHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-[#73A5CA]/12 bg-white/92 p-4 shadow-[0_10px_28px_rgba(28,23,18,0.05)]"
                  >
                    <div className="text-[11px] uppercase tracking-[0.24em] text-[#5d8fb2]">
                      {item.label}
                    </div>
                    <div className="mt-2 text-sm font-semibold text-[#1c1712]">{item.value}</div>
                  </div>
                ))}
              </div>

              <form className="mt-8 grid gap-4" onSubmit={submitContact}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-[#1c1712]">{getField('name')?.label ?? 'Your name'}</span>
                    <input
                      required
                      value={form.name}
                      onChange={(event) => updateForm('name', event.target.value)}
                      type="text"
                      placeholder={getField('name')?.placeholder ?? 'Enter your name'}
                      className="rounded-2xl border border-[#73A5CA]/14 bg-white/96 px-4 py-3.5 text-sm text-[#1c1712] outline-none transition-colors placeholder:text-[#6e6256]/55 focus:border-[#E87F24]/40 focus:ring-2 focus:ring-[#E87F24]/10"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-[#1c1712]">{getField('phone')?.label ?? 'Phone number'}</span>
                    <input
                      required
                      value={form.phone}
                      onChange={(event) => updateForm('phone', event.target.value)}
                      type="tel"
                      placeholder={getField('phone')?.placeholder ?? '+91 ...'}
                      className="rounded-2xl border border-[#73A5CA]/14 bg-white/96 px-4 py-3.5 text-sm text-[#1c1712] outline-none transition-colors placeholder:text-[#6e6256]/55 focus:border-[#E87F24]/40 focus:ring-2 focus:ring-[#E87F24]/10"
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[#1c1712]">{getField('email')?.label ?? 'Email address'}</span>
                  <input
                    required
                    value={form.email}
                    onChange={(event) => updateForm('email', event.target.value)}
                    type="email"
                    placeholder={getField('email')?.placeholder ?? 'you@example.com'}
                    className="rounded-2xl border border-[#73A5CA]/14 bg-white/96 px-4 py-3.5 text-sm text-[#1c1712] outline-none transition-colors placeholder:text-[#6e6256]/55 focus:border-[#E87F24]/40 focus:ring-2 focus:ring-[#E87F24]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[#1c1712]">{getField('project_type')?.label ?? 'Project type'}</span>
                  <input
                    required
                    value={form.project_type}
                    onChange={(event) => updateForm('project_type', event.target.value)}
                    type="text"
                    placeholder={getField('project_type')?.placeholder ?? 'Turnkey home, renovation, interiors, etc.'}
                    className="rounded-2xl border border-[#73A5CA]/14 bg-white/96 px-4 py-3.5 text-sm text-[#1c1712] outline-none transition-colors placeholder:text-[#6e6256]/55 focus:border-[#E87F24]/40 focus:ring-2 focus:ring-[#E87F24]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[#1c1712]">{getField('details')?.label ?? 'Project details'}</span>
                  <textarea
                    required
                    value={form.details}
                    onChange={(event) => updateForm('details', event.target.value)}
                    rows={7}
                    placeholder={getField('details')?.placeholder ?? 'Tell us about the site, your timeline, budget range, and what kind of finish you want.'}
                    className="rounded-3xl border border-[#73A5CA]/14 bg-white/96 px-4 py-4 text-sm text-[#1c1712] outline-none transition-colors placeholder:text-[#6e6256]/55 focus:border-[#E87F24]/40 focus:ring-2 focus:ring-[#E87F24]/10"
                  />
                </label>

                {error ? (
                  <div className="rounded-2xl border border-[#E87F24]/24 bg-[#fff4e9] px-4 py-3 text-sm font-semibold text-[#8a4d12]">
                    {error}
                  </div>
                ) : null}

                {status === 'success' ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-[#73A5CA]/16 bg-[#f8fff1] px-4 py-3 text-sm font-semibold text-[#426b35]">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#E87F24]" />
                    {formDefinition?.success_message ?? 'Your inquiry has been submitted. Our team will contact you soon.'}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="btn-primary inline-flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-transform disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'submitting' ? <Loader2 className="animate-spin" size={16} /> : null}
                    {formDefinition?.submit_label ?? 'Send Inquiry'}
                    {status === 'submitting' ? null : <Send size={16} />}
                  </button>
                  <div className="flex items-center gap-2 text-sm text-[#6e6256]">
                    <Clock3 size={14} className="text-[#E87F24]" />
                    We usually reply within one business day
                  </div>
                </div>
              </form>
            </MotionDiv>

            <MotionDiv
              className="overflow-hidden rounded-[40px] border border-[#73A5CA]/14 bg-white/88 shadow-[0_24px_70px_rgba(28,23,18,0.1)]"
              variants={itemReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="border-b border-[#73A5CA]/12 px-6 py-6 sm:px-8 sm:py-8">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.26em] text-[#5d8fb2]">
                  <MapPin size={15} className="text-[#E87F24]" />
                  {location.label}
                </div>
                <h2 className="mt-4 text-[clamp(2rem,4vw,3.7rem)] font-black leading-[0.92] tracking-[-0.04em] text-[#1c1712]">
                  {location.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e6256]">
                  {location.copy}
                </p>
              </div>

              <div className="relative min-h-[420px] lg:min-h-[820px]">
                <iframe
                  title="BuildCivil location"
                  src={location.mapEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                />

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(254,253,223,0.18),rgba(254,253,223,0.02)),radial-gradient(circle_at_top_left,rgba(115,165,202,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.08),transparent_30%)]" />

                <div className="absolute left-4 right-4 top-4 rounded-[28px] border border-white/50 bg-white/82 p-4 shadow-[0_16px_40px_rgba(28,23,18,0.12)] backdrop-blur-md sm:left-6 sm:right-6 sm:top-6 sm:p-5">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#5d8fb2]">
                    Location details
                  </div>
                  <div className="mt-2 text-base font-semibold text-[#1c1712]">{location.detailTitle}</div>
                  <div className="mt-1 text-sm leading-6 text-[#6e6256]">
                    {location.detailCopy}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:bottom-6 sm:left-6 sm:right-6 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-white/50 bg-white/88 p-4 shadow-[0_12px_32px_rgba(28,23,18,0.1)] backdrop-blur-md">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-[#5d8fb2]">Email</div>
                    <div className="mt-2 text-sm font-semibold text-[#1c1712]">{location.email}</div>
                  </div>
                  <div className="rounded-[24px] border border-white/50 bg-white/88 p-4 shadow-[0_12px_32px_rgba(28,23,18,0.1)] backdrop-blur-md">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-[#5d8fb2]">Phone</div>
                    <div className="mt-2 text-sm font-semibold text-[#1c1712]">{location.phone}</div>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      <FooterClient settings={layoutSettings.footer} />
    </main>
  )
}
