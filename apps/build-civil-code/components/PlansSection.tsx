'use client'

import { type FormEvent, useEffect, useState } from 'react'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Compass,
  DoorOpen,
  Droplet,
  Grid2X2,
  Heart,
  Home,
  Layers3,
  Paintbrush,
  Package,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { itemReveal, sectionReveal } from './motion'
import type { PublicFormDefinition } from '@buildcivil/cms/form-definitions'
import { constructionPackageDefaults, type ConstructionPackage } from '@buildcivil/cms/packages'
import { readJsonResponse } from '@buildcivil/cms/safe-json'

const MotionSection = motion.section
const MotionArticle = motion.article
const MotionDiv = motion.div
const MotionAside = motion.aside

type Plan = {
  id?: string
  slug: string
  badge: string
  name: string
  price: string
  priceUnit: string
  tagline: string
  packageName: string
  icon: typeof Compass
  iconName: string
  featured?: boolean
  features: string[]
  projects: string
  satisfaction: string
  materials: {
    label: string
    value: string
    icon: typeof Compass
  }[]
}

const iconMap = {
  home: Home,
  shield: ShieldCheck,
  sparkles: Sparkles,
  package: Package,
  layers: Layers3,
  grid: Grid2X2,
  zap: Zap,
  droplet: Droplet,
  paintbrush: Paintbrush,
  door: DoorOpen,
  compass: Compass,
}

function getIcon(name: string) {
  return iconMap[name as keyof typeof iconMap] ?? Compass
}

function toPlan(plan: ConstructionPackage): Plan {
  return {
    ...plan,
    icon: getIcon(plan.iconName),
    featured: plan.featured,
    materials: plan.materials.map((material) => ({
      label: material.label,
      value: material.value,
      icon: getIcon(material.iconName),
    })),
  }
}

const planStats = [
  {
    label: 'Projects Completed',
    value: '100+ Successful Builds',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Client Satisfaction',
    value: '95% Happy Customers',
    icon: Heart,
  },
  {
    label: 'On-Time Delivery',
    value: '95% On Schedule',
    icon: CalendarDays,
  },
]

const emptyQuoteForm = {
  name: '',
  phone: '',
  email: '',
  startTimeline: '',
}

export default function PlansSection({
  packages = constructionPackageDefaults,
  formDefinition,
}: {
  packages?: ConstructionPackage[]
  formDefinition?: PublicFormDefinition
}) {
  const plans = packages.map(toPlan)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteForm, setQuoteForm] = useState(emptyQuoteForm)
  const [quoteStatus, setQuoteStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [quoteError, setQuoteError] = useState('')

  const quotePlanName = selectedPlan ? `${selectedPlan.name} Package` : ''
  const getField = (name: string) => formDefinition?.fields.find((field) => field.name === name || field.id === name)
  const canSubmitQuote =
    Boolean(quoteForm.name.trim()) &&
    Boolean(quoteForm.phone.trim()) &&
    Boolean(quoteForm.email.trim()) &&
    Boolean(quotePlanName) &&
    quoteStatus !== 'submitting'

  if (!plans.length) {
    return null
  }

  const plansGridColumns = plans.length >= 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
  const plansGridWidth = plans.length >= 4 ? 'max-w-none' : 'mx-auto max-w-[1420px]'

  function closePlanModal() {
    setSelectedPlan(null)
    setQuoteOpen(false)
    setQuoteForm(emptyQuoteForm)
    setQuoteStatus('idle')
    setQuoteError('')
  }

  function openPlanModal(plan: Plan) {
    setSelectedPlan(plan)
    setQuoteOpen(false)
    setQuoteForm(emptyQuoteForm)
    setQuoteStatus('idle')
    setQuoteError('')
  }

  function updateQuoteForm(key: keyof typeof quoteForm, value: string) {
    setQuoteError('')
    setQuoteStatus('idle')
    setQuoteForm((prev) => ({ ...prev, [key]: value }))
  }

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setQuoteError('')

    if (!canSubmitQuote) {
      setQuoteError(formDefinition?.error_message ?? 'Please fill name, phone number, email, and plan name before submitting.')
      return
    }

    setQuoteStatus('submitting')

    try {
      const response = await fetch('/api/package-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: quoteForm.name,
          email: quoteForm.email,
          phone: quoteForm.phone,
          service: quotePlanName,
          plan_name: quotePlanName,
          package_id: selectedPlan?.id,
          start_timeline: quoteForm.startTimeline,
          other_service: quoteForm.startTimeline ? `How soon to start: ${quoteForm.startTimeline}` : '',
          source: 'home_plan_quote',
        }),
      })

      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Unable to submit quote request.')

      setQuoteStatus('success')
      setQuoteForm(emptyQuoteForm)
    } catch (error) {
      setQuoteStatus('idle')
      setQuoteError(error instanceof Error ? error.message : 'Unable to submit quote request.')
    }
  }

  useEffect(() => {
    if (!selectedPlan) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePlanModal()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedPlan])

  return (
    <>
      <MotionSection
        id="plans"
        className="cms-section-surface relative min-h-screen scroll-mt-32 overflow-hidden px-5 py-28 sm:px-6 lg:px-16 lg:py-36"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14 }}
        variants={sectionReveal}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(115,165,202,0.28),transparent_28%),radial-gradient(circle_at_82%_15%,rgba(255,200,30,0.28),transparent_30%),radial-gradient(circle_at_50%_96%,rgba(232,127,36,0.16),transparent_34%)]" />
        <div className="absolute inset-0 opacity-[0.4] [background-image:linear-gradient(rgba(115,165,202,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(115,165,202,0.1)_1px,transparent_1px)] [background-size:84px_84px]" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#73A5CA]/24 to-transparent" />
        <div className="absolute -left-20 top-28 h-64 w-64 rounded-full bg-[#73A5CA]/20 blur-[90px]" />
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-[#E87F24]/18 blur-[100px]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-[1680px] flex-col justify-center">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <MotionDiv variants={itemReveal}>
            <div className="inline-flex items-center gap-3 rounded-full border border-[#73A5CA]/26 bg-white/45 px-5 py-3 text-xs font-black uppercase tracking-[0.28em] text-[#5f92ba] shadow-[0_18px_60px_rgba(115,165,202,0.14)] backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E87F24]" />
              BuildCivil Plans
            </div>
            <h2 className="mt-7 max-w-4xl font-display text-[clamp(2.8rem,7vw,7.2rem)] font-black leading-[0.84] tracking-[-0.08em]">
              Construction packages for every home.
            </h2>
          </MotionDiv>

          <MotionDiv className="max-w-2xl lg:ml-auto" variants={itemReveal}>
            <p className="text-base leading-8 text-[#6d6254] sm:text-lg">
              Choose a package that matches your budget, finish quality, and lifestyle needs. Final scope is confirmed
              after site review, drawing checks, material selection, and your exact construction requirements.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {['Per sqft packages', 'Site-first planning', 'Final quote after review'].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[#FFC81E]/40 bg-[#fffdf1]/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#6f93ad] shadow-[0_12px_30px_rgba(115,165,202,0.1)]"
                >
                  {label}
                </span>
              ))}
            </div>
          </MotionDiv>
        </div>

        <div className={`mt-12 grid w-full gap-4 md:grid-cols-2 ${plansGridColumns} ${plansGridWidth} xl:items-stretch`}>
          {plans.map((plan) => {
            const Icon = plan.icon

            return (
              <MotionArticle
                key={plan.name}
                className={`group relative flex min-h-[470px] overflow-hidden rounded-[26px] border p-5 shadow-[0_22px_70px_rgba(115,165,202,0.14)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 sm:p-6 ${
                  plan.featured
                    ? 'border-[#FFC81E]/70 bg-white'
                    : 'border-[#73A5CA]/18 bg-white'
                }`}
                variants={itemReveal}
              >
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/50" />

                <div className="relative z-10 flex w-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] ${
                        plan.featured ? 'border-white/48 bg-[#FEFDDF]/72 text-[#E87F24]' : 'border-[#73A5CA]/24 bg-white/64 text-[#73A5CA]'
                      }`}
                    >
                      <Icon size={21} strokeWidth={1.8} />
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${
                        plan.featured
                          ? 'border-[#FEFDDF]/56 bg-[#FEFDDF]/36 text-[#1c1712]'
                          : 'border-[#73A5CA]/18 bg-white/54 text-[#5f92ba]'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-display text-[clamp(1.8rem,2.4vw,2.8rem)] font-black leading-[0.95] tracking-[-0.04em] text-[#1c1712]">
                      {plan.name}
                    </h3>
                    <div className="mt-6 flex flex-wrap items-end gap-x-2 gap-y-2">
                      <span className="font-sans text-[clamp(2.6rem,3.5vw,4.1rem)] font-black leading-none tracking-[-0.05em] text-[#1c1712]">
                        {plan.price}
                      </span>
                      <span className="pb-1.5 text-base font-black text-[#6d6254]">/sqft</span>
                    </div>
                    <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-[#615749]">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#73A5CA]/28 to-transparent" />

                  <div className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-sm font-semibold leading-6 text-[#4f463d]">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFC81E]/28 text-[#725b07]">
                          <CheckCircle2 size={15} strokeWidth={2.4} />
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="mb-5 h-px bg-gradient-to-r from-transparent via-[#73A5CA]/24 to-transparent" />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs font-black text-[#6d6254]">{plan.packageName}</p>
                      <button
                        type="button"
                        onClick={() => openPlanModal(plan)}
                        className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-black transition hover:-translate-y-0.5 ${
                          plan.featured
                            ? 'btn-primary shadow-[0_18px_38px_rgba(232,127,36,0.24)]'
                            : 'border border-[#73A5CA]/24 bg-[#FEFDDF]/70 text-[#1c1712] hover:border-[#E87F24]/34'
                        }`}
                      >
                        Get Details
                        <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </MotionArticle>
            )
          })}
        </div>

        <MotionDiv className="mt-10 grid gap-5 md:grid-cols-3" variants={itemReveal}>
          {planStats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="flex items-center gap-5 rounded-[26px] border border-[#73A5CA]/16 bg-[#fffef0]/72 p-5 shadow-[0_20px_60px_rgba(115,165,202,0.12)] backdrop-blur"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FFC81E]/28 text-[#E87F24]">
                  <Icon size={26} strokeWidth={1.9} />
                </span>
                <span>
                  <span className="block text-xs font-black uppercase tracking-[0.2em] text-[#6d6254]/72">{stat.label}</span>
                  <span className="mt-1 block text-xl font-black tracking-[-0.03em] text-[#1c1712]">{stat.value}</span>
                </span>
              </div>
            )
          })}
        </MotionDiv>
      </div>
      </MotionSection>

      <AnimatePresence>
        {selectedPlan ? (
          <MotionAside
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1c1712]/58 px-3 py-4 backdrop-blur-xl sm:px-6 sm:py-6"
            aria-modal="true"
            role="dialog"
            aria-labelledby="plan-detail-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closePlanModal()
              }
            }}
          >
            <motion.div
              className="relative grid max-h-[92dvh] w-full max-w-6xl overflow-y-auto rounded-[28px] border border-[#FEFDDF]/44 bg-[#FEFDDF] shadow-[0_34px_120px_rgba(28,23,18,0.42)] sm:rounded-[34px] lg:grid-cols-[0.9fr_1.1fr] lg:overflow-hidden"
              initial={{ y: 28, scale: 0.97, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 210, damping: 24 }}
            >
              <button
                type="button"
                onClick={closePlanModal}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#FEFDDF]/60 bg-[#FEFDDF]/90 text-[#1c1712] shadow-[0_12px_30px_rgba(28,23,18,0.16)] transition hover:scale-105 sm:right-5 sm:top-5 sm:h-11 sm:w-11"
                aria-label="Close plan details"
              >
                <X size={20} />
              </button>

              <div className="relative min-h-[260px] overflow-hidden bg-[#73A5CA] p-5 text-[#FEFDDF] sm:min-h-[360px] sm:p-8 lg:min-h-[620px] lg:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_24%,rgba(255,200,30,0.55),transparent_24%),radial-gradient(circle_at_82%_88%,rgba(232,127,36,0.48),transparent_30%),linear-gradient(135deg,rgba(28,23,18,0.18),rgba(28,23,18,0.58))]" />
                <div className="absolute inset-0 opacity-[0.28] [background-image:linear-gradient(rgba(254,253,223,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(254,253,223,0.22)_1px,transparent_1px)] [background-size:58px_58px]" />
                <div className="absolute -left-12 bottom-12 h-52 w-52 rounded-full border-[28px] border-[#FFC81E]/30" />
                <div className="absolute right-8 top-20 h-40 w-40 rounded-full bg-[#FEFDDF]/24 blur-[35px]" />
                <div className="absolute bottom-0 right-0 h-1/2 w-2/3 rounded-tl-[80px] bg-[#1c1712]/22 backdrop-blur-sm" />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-3 rounded-full border border-[#FEFDDF]/42 bg-[#FEFDDF]/18 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] backdrop-blur">
                      <selectedPlan.icon size={17} />
                      {selectedPlan.packageName}
                    </div>
                    <h3 className="mt-7 max-w-sm font-display text-[clamp(2.8rem,8vw,6.6rem)] font-black leading-[0.82] tracking-[-0.08em]">
                      {selectedPlan.name}
                    </h3>
                  </div>

                  <div className="mt-10 rounded-[24px] border border-[#FEFDDF]/32 bg-[#1c1712]/28 p-5 backdrop-blur-xl sm:rounded-[28px] sm:p-6">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#FEFDDF]/76">Package price</p>
                    <div className="mt-3 flex items-end gap-3">
                      <span className="font-sans text-5xl font-black leading-none tracking-[-0.08em] sm:text-6xl">{selectedPlan.price}</span>
                      <span className="pb-2 text-xl font-black text-[#FEFDDF]/76">/sqft</span>
                    </div>
                    <p className="mt-4 max-w-sm text-sm font-semibold leading-6 text-[#FEFDDF]/78">{selectedPlan.tagline}</p>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-[#FEFDDF]/22 bg-[#FEFDDF]/12 p-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#FEFDDF]/62">Projects</p>
                        <p className="mt-1 text-2xl font-black text-[#FEFDDF]">{selectedPlan.projects}</p>
                      </div>
                      <div className="rounded-2xl border border-[#FEFDDF]/22 bg-[#FEFDDF]/12 p-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#FEFDDF]/62">Satisfaction</p>
                        <p className="mt-1 text-2xl font-black text-[#FEFDDF]">{selectedPlan.satisfaction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[radial-gradient(circle_at_top_right,rgba(115,165,202,0.18),transparent_28%),linear-gradient(180deg,#FEFDDF,#fffdf1)] p-5 sm:p-8 lg:max-h-[92dvh] lg:overflow-y-auto lg:p-12">
                {quoteOpen ? (
                  <div>
                    <div className="pr-10">
                      <p className="text-xs font-black uppercase tracking-[0.26em] text-[#E87F24]">{formDefinition?.title ?? 'Get quote'}</p>
                      <h2 id="plan-detail-title" className="mt-4 font-display text-[clamp(2.1rem,5vw,4.8rem)] font-black leading-[0.88] tracking-[-0.07em] text-[#1c1712]">
                        Request a quote for {quotePlanName}
                      </h2>
                      <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-[#665d50]">
                        {formDefinition?.description ?? 'Fill the details below and our team will connect with you about pricing, scope, and next steps.'}
                      </p>
                    </div>

                    {quoteStatus === 'success' ? (
                      <div className="mt-8 rounded-[28px] border border-[#73A5CA]/18 bg-white/72 p-6 shadow-[0_20px_50px_rgba(115,165,202,0.12)] backdrop-blur">
                        <div className="flex items-start gap-4">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFC81E]/24 text-[#E87F24]">
                            <CheckCircle2 size={24} />
                          </span>
                          <div>
                            <h3 className="text-2xl font-black tracking-[-0.04em] text-[#1c1712]">Quote request submitted</h3>
                            <p className="mt-2 text-sm leading-7 text-[#665d50]">
                              {formDefinition?.success_message ?? 'Thank you. Your package quote request has been saved and our team will contact you soon.'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={closePlanModal}
                          className="btn-primary mt-6 inline-flex px-6 py-4 text-sm font-black"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <form className="mt-8 grid gap-4" onSubmit={submitQuote}>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="grid gap-2">
                            <span className="text-sm font-black text-[#1c1712]">{getField('name')?.label ?? 'Full name'} *</span>
                            <input
                              required
                              value={quoteForm.name}
                              onChange={(event) => updateQuoteForm('name', event.target.value)}
                              type="text"
                              placeholder={getField('name')?.placeholder ?? 'Enter your full name'}
                              className="rounded-2xl border border-[#73A5CA]/18 bg-white/86 px-4 py-3.5 text-sm text-[#1c1712] outline-none transition placeholder:text-[#6d6254]/50 focus:border-[#E87F24]/45 focus:ring-2 focus:ring-[#E87F24]/10"
                            />
                          </label>

                          <label className="grid gap-2">
                            <span className="text-sm font-black text-[#1c1712]">{getField('phone')?.label ?? 'Phone no.'} *</span>
                            <input
                              required
                              value={quoteForm.phone}
                              onChange={(event) => updateQuoteForm('phone', event.target.value)}
                              type="tel"
                              placeholder={getField('phone')?.placeholder ?? '+91 ...'}
                              className="rounded-2xl border border-[#73A5CA]/18 bg-white/86 px-4 py-3.5 text-sm text-[#1c1712] outline-none transition placeholder:text-[#6d6254]/50 focus:border-[#E87F24]/45 focus:ring-2 focus:ring-[#E87F24]/10"
                            />
                          </label>
                        </div>

                        <label className="grid gap-2">
                          <span className="text-sm font-black text-[#1c1712]">{getField('email')?.label ?? 'Email'} *</span>
                          <input
                            required
                            value={quoteForm.email}
                            onChange={(event) => updateQuoteForm('email', event.target.value)}
                            type="email"
                            placeholder={getField('email')?.placeholder ?? 'you@example.com'}
                            className="rounded-2xl border border-[#73A5CA]/18 bg-white/86 px-4 py-3.5 text-sm text-[#1c1712] outline-none transition placeholder:text-[#6d6254]/50 focus:border-[#E87F24]/45 focus:ring-2 focus:ring-[#E87F24]/10"
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-black text-[#1c1712]">{getField('plan_name')?.label ?? 'Selected plan'} *</span>
                          <input
                            required
                            readOnly
                            value={quotePlanName}
                            className="cursor-not-allowed rounded-2xl border border-[#73A5CA]/18 bg-[#FEFDDF]/86 px-4 py-3.5 text-sm font-black text-[#1c1712] outline-none"
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-sm font-black text-[#1c1712]">{getField('start_timeline')?.label ?? 'How soon you want to start'}</span>
                          <input
                            value={quoteForm.startTimeline}
                            onChange={(event) => updateQuoteForm('startTimeline', event.target.value)}
                            type="text"
                            placeholder={getField('start_timeline')?.placeholder ?? 'Example: next month, after 3 months, immediately'}
                            className="rounded-2xl border border-[#73A5CA]/18 bg-white/86 px-4 py-3.5 text-sm text-[#1c1712] outline-none transition placeholder:text-[#6d6254]/50 focus:border-[#E87F24]/45 focus:ring-2 focus:ring-[#E87F24]/10"
                          />
                        </label>

                        {quoteError ? (
                          <div className="rounded-2xl border border-[#E87F24]/26 bg-[#fff4e9] px-4 py-3 text-sm font-semibold text-[#8a4d12]">
                            {quoteError}
                          </div>
                        ) : null}

                        <div className="mt-3 flex flex-col gap-4 sm:flex-row">
                          <button
                            type="submit"
                            disabled={!canSubmitQuote}
                            className="btn-primary inline-flex flex-1 items-center justify-center gap-3 px-6 py-4 text-sm font-black shadow-[0_18px_38px_rgba(232,127,36,0.24)] transition disabled:cursor-not-allowed disabled:opacity-55"
                          >
                            {quoteStatus === 'submitting' ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            {formDefinition?.submit_label ?? 'Submit Quote Request'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setQuoteOpen(false)
                              setQuoteError('')
                              setQuoteStatus('idle')
                            }}
                            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#73A5CA]/24 bg-white/64 px-6 py-4 text-sm font-black text-[#1c1712] transition hover:-translate-y-0.5"
                          >
                            Back to details
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <>
                <div className="pr-10">
                  <p className="text-xs font-black uppercase tracking-[0.26em] text-[#E87F24]">Package details</p>
                  <h2 id="plan-detail-title" className="mt-4 font-display text-[clamp(2.1rem,5vw,4.8rem)] font-black leading-[0.88] tracking-[-0.07em] text-[#1c1712]">
                    {selectedPlan.name} Package - {selectedPlan.price}/sqft
                  </h2>
                  <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-[#665d50]">{selectedPlan.tagline}</p>
                </div>

                <div className="mt-8 rounded-[28px] border border-[#73A5CA]/18 bg-white/64 p-5 shadow-[0_20px_50px_rgba(115,165,202,0.12)] backdrop-blur">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-3xl font-black tracking-[-0.05em] text-[#1c1712]">Package Details</h3>
                    <span className="rounded-full border border-[#FFC81E]/44 bg-[#FFC81E]/16 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#866809]">
                      {selectedPlan.badge}
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {selectedPlan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 rounded-2xl bg-[#FEFDDF]/72 p-4 text-sm font-bold leading-6 text-[#4f463d]">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#E87F24]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 rounded-[28px] border border-[#73A5CA]/18 bg-white/64 p-5 shadow-[0_20px_50px_rgba(115,165,202,0.12)] backdrop-blur">
                  <h3 className="font-display text-3xl font-black tracking-[-0.05em] text-[#1c1712]">Materials & Brands</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {selectedPlan.materials.map((material) => {
                      const MaterialIcon = material.icon

                      return (
                        <div
                          key={`${material.label}-${material.value}`}
                          className="flex items-center gap-4 rounded-2xl border border-[#73A5CA]/14 bg-[#FEFDDF]/72 p-4"
                        >
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFC81E]/22 text-[#E87F24]">
                            <MaterialIcon size={22} strokeWidth={2} />
                          </span>
                          <span>
                            <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#6d6254]/68">
                              {material.label}
                            </span>
                            <span className="mt-1 block text-base font-black leading-5 text-[#1c1712]">{material.value}</span>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-[#FFC81E]/34 bg-[#fffdf1]/74 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6d9ec2]">Projects Completed</p>
                    <p className="mt-3 text-3xl font-black text-[#1c1712]">{selectedPlan.projects}</p>
                  </div>
                  <div className="rounded-3xl border border-[#FFC81E]/34 bg-[#fffdf1]/74 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6d9ec2]">Client Satisfaction</p>
                    <p className="mt-3 text-3xl font-black text-[#1c1712]">{selectedPlan.satisfaction}</p>
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setQuoteOpen(true)}
                    className="btn-primary inline-flex flex-1 items-center justify-center gap-3 px-6 py-4 text-sm font-black shadow-[0_18px_38px_rgba(232,127,36,0.24)] transition"
                  >
                    Get Quote
                    <ArrowUpRight size={18} />
                  </button>
                  <a
                    href="/contact"
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#73A5CA]/24 bg-white/64 px-6 py-4 text-sm font-black text-[#1c1712] transition hover:-translate-y-0.5"
                  >
                    Connect now
                  </a>
                </div>
                  </>
                )}
              </div>
            </motion.div>
          </MotionAside>
        ) : null}
      </AnimatePresence>
    </>
  )
}
