'use client'

import { type FormEvent, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Send, Instagram, Twitter, Linkedin, Facebook, MapPin, Mail, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { itemReveal, sectionReveal } from './motion'
import type { FooterSettings } from '@/lib/site-settings-defaults'
import { readJsonResponse } from '@/lib/safe-json'

const MotionDiv = motion.div

const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
}

const contactIcons = {
  address: MapPin,
  email: Mail,
  phone: Phone,
}

export default function FooterClient({ settings }: { settings: FooterSettings }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const contactRows = settings.contactRows.filter((row) => row.visible)
  const companyLinks = settings.companyLinks.filter((link) => link.visible)
  const socialLinks = settings.socialLinks.filter((link) => link.visible)
  const legalLinks = settings.legalLinks.filter((link) => link.visible)
  const desktopLogoWidth = scaleDimension(resolveDimension(settings.brand.desktopWidth, 190, 110, 380), 1.5, 570)
  const tabletLogoWidth = scaleDimension(resolveDimension(settings.brand.tabletWidth, 150, 96, 280), 1.5, 420)
  const markSize = resolveDimension(settings.brand.markSize, 64, 44, 104)
  const primaryColor = settings.brand.primaryColor || '#FEFDDF'
  const accentColor = settings.brand.accentColor || '#FFC81E'
  const markBackgroundColor = settings.brand.markBackgroundColor || '#E87F24'

  async function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address.')
      return
    }

    setStatus('submitting')
    try {
      const response = await fetch('/api/newsletter-subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      })
      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Unable to subscribe right now.')
      setStatus('success')
      setMessage('You are subscribed. We will keep it useful, not noisy.')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Unable to subscribe right now.')
    }
  }

  return (
    <MotionDiv
      id="contact"
      className="relative min-h-screen overflow-hidden bg-[#0f0d0b] text-[#FEFDDF]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={sectionReveal}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(115,165,202,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.1),transparent_28%)]" />
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:33.33%_100%,100%_100%]" />

      <div className="relative flex min-h-screen flex-col px-3 py-3 sm:px-5 md:px-6 md:py-6 lg:px-8">
        <div className="relative flex min-h-screen flex-1 overflow-hidden rounded-[24px] border border-white/10 bg-[#11100f] shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:rounded-[30px]">
          <div className="absolute inset-0 hidden lg:flex">
            <div className="w-[34%] border-r border-white/10" />
            <div className="w-[33%] border-r border-white/10" />
            <div className="flex-1" />
          </div>

          <div className="relative z-10 flex w-full flex-col">
            <div className="grid flex-1 gap-0 border-b border-white/10 lg:grid-cols-[1fr_1.1fr_0.9fr]">
              <MotionDiv className="flex flex-col justify-between gap-10 px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:border-r lg:border-white/10" variants={itemReveal}>
                <div>
                  <a href={settings.brand.href} className="flex items-center gap-3 sm:gap-4">
                    {settings.brand.showImageLogo && settings.brand.logoUrl ? (
                      <span className="relative block h-24" style={{ width: desktopLogoWidth || tabletLogoWidth }}>
                        <Image src={settings.brand.logoUrl} alt={settings.brand.logoAlt || 'BuildCivil Constructions'} fill className="object-contain object-left" sizes={`(min-width: 1024px) ${desktopLogoWidth}px, ${tabletLogoWidth}px`} unoptimized />
                      </span>
                    ) : (
                      <>
                        <span
                          className="flex items-center justify-center rounded-xl text-[#1c1712] shadow-[0_0_0_1px_rgba(255,200,30,0.08)_inset]"
                          style={{ width: markSize, height: markSize, backgroundColor: markBackgroundColor }}
                        >
                          <span className="flex flex-col items-start leading-[0.78]">
                            <span className="font-display text-[1.45rem] font-black uppercase tracking-[-0.08em] lg:text-[1.72rem]" style={{ color: primaryColor }}>
                              {settings.brand.markTop}
                            </span>
                            <span className="font-display text-[1.05rem] font-black uppercase tracking-[-0.06em] lg:text-[1.28rem]" style={{ color: accentColor }}>
                              {settings.brand.markBottom}
                            </span>
                          </span>
                        </span>
                        <div className="flex flex-col leading-[0.78]">
                          <div className="font-display text-[1.8rem] font-black uppercase tracking-tight lg:text-[2.3rem]" style={{ color: primaryColor }}>
                            {settings.brand.wordTop}
                          </div>
                          <div className="font-display text-[1.8rem] font-black uppercase tracking-tight lg:text-[2.3rem]" style={{ color: accentColor }}>
                            {settings.brand.wordBottom}
                          </div>
                        </div>
                      </>
                    )}
                  </a>

                  <div className="mt-7 max-w-sm space-y-4 text-sm leading-7 text-[#FEFDDF]/70">
                    <p>{settings.description}</p>
                    <div className="space-y-3">
                      {contactRows.map((row) => {
                        const Icon = contactIcons[row.type]
                        return (
                          <a key={row.id} href={row.href} className="flex items-center gap-3 transition-colors hover:text-[#FFC81E]">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                              <Icon size={14} className="text-[#FFC81E]" />
                            </div>
                            <p className="text-[#FEFDDF]/56">{row.value}</p>
                          </a>
                        )
                      })}
                    </div>
                  </div>
                </div>

              </MotionDiv>

              <MotionDiv className="px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:border-r lg:border-white/10" variants={itemReveal}>
                <h4 className="text-2xl font-semibold text-[#FEFDDF]">{settings.companyTitle}</h4>
                <ul className="mt-6 grid gap-3">
                  {companyLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm text-[#FEFDDF]/72 transition-colors duration-200 hover:text-[#FEFDDF]"
                      >
                        <span>{link.label}</span>
                        <ArrowRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>

              </MotionDiv>

              <MotionDiv className="px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12" variants={itemReveal}>
                {settings.newsletter.visible ? (
                  <>
                    <h4 className="text-2xl font-semibold text-[#FEFDDF]">{settings.newsletter.title}</h4>
                    <form className="mt-6" onSubmit={submitNewsletter}>
                      <div className="flex items-center gap-4 border-b border-white/12 pb-4">
                        <input
                          type="email"
                          aria-label="Email address"
                          placeholder={settings.newsletter.placeholder}
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value)
                            setStatus('idle')
                            setMessage('')
                          }}
                          className="w-full bg-transparent text-sm text-[#FEFDDF] placeholder:text-[#FEFDDF]/42 outline-none"
                        />
                        <button
                          type="submit"
                          disabled={status === 'submitting'}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#FEFDDF] transition-colors hover:text-[#FFC81E]"
                        >
                          {status === 'submitting' ? 'Saving...' : settings.newsletter.buttonLabel}
                          <Send size={14} />
                        </button>
                      </div>
                      <p className="mt-5 text-sm leading-6 text-[#FEFDDF]/60">
                        {settings.newsletter.consent}
                      </p>
                      {message ? (
                        <p className={`mt-3 text-xs leading-5 ${status === 'success' ? 'text-[#D8FF6A]' : 'text-[#FFBC8C]'}`}>
                          {message}
                        </p>
                      ) : null}
                    </form>
                  </>
                ) : null}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {socialLinks.map((link) => {
                    const Icon = socialIcons[link.icon]
                    return (
                      <a
                        key={link.id}
                        href={link.href}
                        aria-label={link.label}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#FEFDDF]/78 transition-all duration-200 hover:border-[#FFC81E]/30 hover:text-[#FFC81E]"
                      >
                        <Icon size={15} />
                      </a>
                    )
                  })}
                </div>
              </MotionDiv>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
              <div className="pointer-events-none absolute inset-x-8 top-1/2 hidden h-px bg-white/10 lg:block" />
              <div className="relative z-10 flex w-full max-w-[1680px] items-center justify-center overflow-hidden">
                <div className="select-none whitespace-nowrap text-[clamp(3rem,16vw,18rem)] font-black leading-[0.84] tracking-[-0.06em] text-transparent bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.92)_24%,rgba(255,255,255,0.62)_54%,rgba(255,255,255,0.12)_80%,rgba(255,255,255,0)_100%)] bg-clip-text">
                  {settings.bigText}
                </div>
              </div>

              <a
                href={settings.backToTopHref}
                className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-white/5 text-[#FEFDDF] transition-all duration-200 hover:border-[#FFC81E]/35 hover:text-[#FFC81E] sm:right-8 sm:h-14 sm:w-14"
                aria-label="Back to top"
              >
                <ArrowRight size={18} className="-rotate-90" />
              </a>
            </div>

            <div className="border-t border-white/10 px-5 py-4 sm:px-8 md:px-10">
              <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                <p className="text-xs text-[#FEFDDF]/58">
                  {settings.copyright}
                </p>
                <div className="flex flex-wrap items-center gap-5 text-xs text-[#FEFDDF]/58">
                  {legalLinks.map((item) => (
                    <a key={item.id} href={item.href} className="transition-colors hover:text-[#FFC81E]">
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionDiv>
  )
}

function resolveDimension(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number.parseFloat(value || '')
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

function scaleDimension(value: number, scale: number, max: number) {
  return Math.min(max, Math.round(value * scale))
}
