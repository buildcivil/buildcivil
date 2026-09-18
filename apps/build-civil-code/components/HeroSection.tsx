'use client'

import { type FormEvent, useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2, Send, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { itemReveal, sectionReveal } from './motion'
import type { PublicFormDefinition } from '@buildcivil/cms/form-definitions'
import type { HomePageContent } from '@buildcivil/cms/site-pages'
import { readJsonResponse } from '@buildcivil/cms/safe-json'
import { AI_COST_ESTIMATOR_URL } from '@buildcivil/cms/ai-cost-estimator-url'

const MotionDiv = motion.div
const MotionSection = motion.section

type HeroSectionProps = {
  content?: Partial<HomePageContent['hero']>
  formDefinition?: PublicFormDefinition
}

const defaultServices = [
  'Turnkey Construction',
  'Interior & Exterior Design',
  'Renovation & Remodeling',
  'Architectural Planning',
  'Project Management',
  'Other',
]

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  other_service: '',
}

function dedupeRepeatedCopy(value: string) {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (!normalized) return value

  const midpoint = Math.floor(normalized.length / 2)
  const left = normalized.slice(0, midpoint).trim()
  const right = normalized.slice(midpoint).trim()
  if (left && right && left === right) return left

  const sentences = normalized.split(/(?<=[.!?])\s+/)
  if (sentences.length >= 2) {
    const unique: string[] = []
    for (const sentence of sentences) {
      if (!unique.includes(sentence)) unique.push(sentence)
    }
    if (unique.length < sentences.length) return unique.join(' ')
  }

  return normalized
}

export default function HeroSection({ content, formDefinition }: HeroSectionProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState('')

  const heroLabel = content?.label ?? 'Premium construction delivery'
  const heroTitle = content?.title ?? 'Architecture that Speaks Volume'
  const heroCopy = dedupeRepeatedCopy(
    content?.copy ??
      'Precision-built homes and spaces across Delhi-NCR, delivered with clear planning, careful finishes, and transparent coordination.',
  )
  const heroImage =
    content?.image ??
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2400&auto=format&fit=crop'
  const heroImageAlt = content?.imageAlt ?? 'BuildCivil construction project'
  const heroCtaLabel = content?.ctaLabel ?? 'Get Consultation'

  const serviceField = formDefinition?.fields.find((field) => field.name === 'service' || field.id === 'service')
  const services = serviceField?.options?.length
    ? serviceField.options
    : content?.serviceOptions?.length
      ? content.serviceOptions
      : defaultServices
  const getField = (name: string) => formDefinition?.fields.find((field) => field.name === name || field.id === name)

  const needsOther = form.service === 'Other'
  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.service.trim() &&
    (!needsOther || form.other_service.trim()) &&
    status !== 'submitting'

  function updateForm(key: keyof typeof form, value: string) {
    setError('')
    setStatus('idle')
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'service' && value !== 'Other' ? { other_service: '' } : {}),
    }))
  }

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!canSubmit) {
      setError(formDefinition?.error_message ?? 'Please fill all required fields before submitting.')
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/service-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Unable to submit enquiry.')

      setStatus('success')
      setForm(emptyForm)
    } catch (err) {
      setStatus('idle')
      setError(err instanceof Error ? err.message : 'Unable to submit enquiry.')
    }
  }

  return (
    <MotionSection
      id="home"
      className="cms-section-surface relative min-h-[100svh] overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={sectionReveal}
    >
      {/* Full-bleed photography + atmosphere (inline styles survive public-site CSS overrides) */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: [
            'linear-gradient(105deg, rgba(28,23,18,0.88) 0%, rgba(28,23,18,0.62) 42%, rgba(28,23,18,0.28) 68%, rgba(28,23,18,0.18) 100%)',
            'linear-gradient(180deg, rgba(28,23,18,0.35) 0%, transparent 28%, transparent 62%, rgba(28,23,18,0.72) 100%)',
            'radial-gradient(ellipse at 80% 20%, rgba(232,127,36,0.16), transparent 42%)',
            `url('${heroImage}')`,
          ].join(', '),
        }}
        role="img"
        aria-label={heroImageAlt}
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1800px] flex-col justify-end px-5 pb-14 pt-32 sm:px-6 sm:pb-16 md:px-10 lg:px-16 lg:pb-20">
        <MotionDiv className="on-image-overlay max-w-3xl" variants={itemReveal}>
          <p className="font-display text-[11px] font-medium uppercase tracking-[0.34em] text-white/70 sm:text-xs">
            BuildCivil
            <span className="mx-3 inline-block h-px w-8 translate-y-[-3px] bg-[#E87F24] align-middle sm:w-10" />
            {heroLabel}
          </p>

          <h1
            className="cms-hero-title title-display mt-5 text-white sm:mt-6"
            style={{
              fontSize: 'var(--hero-title-size, clamp(2.75rem, 7.5vw, 6.5rem))',
              lineHeight: 0.94,
              letterSpacing: '-0.03em',
            }}
          >
            {heroTitle.split('\n').map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <motion.div
            className="mt-6 h-[3px] w-16 origin-left rounded-full bg-[#E87F24] sm:mt-7 sm:w-20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/82 sm:mt-7 sm:text-lg sm:leading-8">
            {heroCopy}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-primary inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold"
            >
              {heroCtaLabel}
              <ArrowRight size={16} />
            </button>

            <a
              href={AI_COST_ESTIMATOR_URL}
              className="inline-flex items-center justify-center gap-2.5 border border-white/35 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/55 hover:bg-white/10"
              style={{ borderRadius: 'var(--button-radius, 999px)' }}
            >
              AI Cost Estimator
              <ArrowRight size={16} className="opacity-80" />
            </a>
          </div>
        </MotionDiv>

        <MotionDiv
          className="on-image-overlay mt-12 flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-white/45 sm:mt-14"
          variants={itemReveal}
        >
          <span className="h-px w-8 bg-white/35" />
          Scroll to explore
        </MotionDiv>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Close enquiry form"
            className="absolute inset-0 bg-[#1c1712]/70 backdrop-blur-md"
            onClick={() => setModalOpen(false)}
          />

          <MotionDiv
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[34px] border border-[#FFC81E]/28 bg-[#FEFDDF] p-5 text-[#1c1712] shadow-[0_30px_100px_rgba(28,23,18,0.38)] sm:p-6 lg:p-8"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white/78 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#5d8fb2]">
                  <Send size={13} className="text-[#E87F24]" />
                  {formDefinition?.title ?? 'Service enquiry'}
                </div>
                <h2 className="mt-4 text-3xl font-black leading-none text-[#1c1712] sm:text-4xl">
                  {formDefinition?.description ?? 'Tell us what you need built.'}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e6256]">
                  Fill the details below and our team will contact you with the right next step.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#73A5CA]/16 bg-white/86 text-[#1c1712] transition hover:border-[#E87F24]/35"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {status === 'success' ? (
              <div className="mt-6 rounded-[26px] border border-[#73A5CA]/18 bg-white/86 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={24} className="mt-0.5 shrink-0 text-[#73A5CA]" />
                  <div>
                    <h3 className="text-xl font-black text-[#1c1712]">Enquiry submitted</h3>
                    <p className="mt-2 text-sm leading-6 text-[#6e6256]">
                      {formDefinition?.success_message ??
                        'Thank you. Your service enquiry has been saved and our team will get back to you soon.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle')
                    setModalOpen(false)
                  }}
                  className="btn-primary mt-5 inline-flex px-5 py-3 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form className="mt-6 grid gap-4" onSubmit={submitEnquiry}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1c1712]">{getField('name')?.label ?? 'Name'} *</span>
                    <input
                      required
                      value={form.name}
                      onChange={(event) => updateForm('name', event.target.value)}
                      type="text"
                      placeholder={getField('name')?.placeholder ?? 'Enter your full name'}
                      className="rounded-2xl border border-[#73A5CA]/18 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#6e6256]/50 focus:border-[#E87F24]/45 focus:ring-2 focus:ring-[#E87F24]/10"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1c1712]">
                      {getField('phone')?.label ?? 'Phone number'} *
                    </span>
                    <input
                      required
                      value={form.phone}
                      onChange={(event) => updateForm('phone', event.target.value)}
                      type="tel"
                      placeholder={getField('phone')?.placeholder ?? '+91 ...'}
                      className="rounded-2xl border border-[#73A5CA]/18 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#6e6256]/50 focus:border-[#E87F24]/45 focus:ring-2 focus:ring-[#E87F24]/10"
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1c1712]">{getField('email')?.label ?? 'Email'} *</span>
                  <input
                    required
                    value={form.email}
                    onChange={(event) => updateForm('email', event.target.value)}
                    type="email"
                    placeholder={getField('email')?.placeholder ?? 'you@example.com'}
                    className="rounded-2xl border border-[#73A5CA]/18 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#6e6256]/50 focus:border-[#E87F24]/45 focus:ring-2 focus:ring-[#E87F24]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-[#1c1712]">{getField('service')?.label ?? 'Service'} *</span>
                  <select
                    required
                    value={form.service}
                    onChange={(event) => updateForm('service', event.target.value)}
                    className="rounded-2xl border border-[#73A5CA]/18 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#E87F24]/45 focus:ring-2 focus:ring-[#E87F24]/10"
                  >
                    <option value="">{getField('service')?.placeholder ?? 'Select a service'}</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </label>

                {needsOther ? (
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#1c1712]">
                      {getField('other_service')?.label ?? 'Other service details'} *
                    </span>
                    <textarea
                      required
                      value={form.other_service}
                      onChange={(event) => updateForm('other_service', event.target.value)}
                      rows={4}
                      placeholder={getField('other_service')?.placeholder ?? 'Tell us which service you need.'}
                      className="rounded-3xl border border-[#73A5CA]/18 bg-white px-4 py-4 text-sm outline-none transition placeholder:text-[#6e6256]/50 focus:border-[#E87F24]/45 focus:ring-2 focus:ring-[#E87F24]/10"
                    />
                  </label>
                ) : null}

                {error ? (
                  <div className="rounded-2xl border border-[#E87F24]/28 bg-[#fff4e8] px-4 py-3 text-sm text-[#8c4f12]">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-[#6e6256]">
                    All fields are mandatory. We usually respond within one business day.
                  </p>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="btn-primary inline-flex items-center justify-center gap-3 px-6 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {status === 'submitting' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {formDefinition?.submit_label ?? 'Submit enquiry'}
                  </button>
                </div>
              </form>
            )}
          </MotionDiv>
        </div>
      ) : null}
    </MotionSection>
  )
}
