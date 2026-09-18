'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { itemReveal, sectionReveal } from './motion'
import type { HomePageContent } from '@buildcivil/cms/site-pages'

const MotionDiv = motion.div
const MotionA = motion.a

type FAQSectionProps = {
  content?: Partial<HomePageContent['faq']>
}

const defaultFaqs = [
  {
    q: 'Do you handle the entire project from start to finish?',
    a: 'Yes, we handle everything from planning and design to final handover for a hassle-free experience. Our end-to-end service means you have a single point of contact throughout the entire process.',
  },
  {
    q: 'How is the project pricing determined?',
    a: 'Our pricing is transparent and based on project scope, materials, and design requirements. We provide a detailed cost breakdown before any work begins — no surprises, no hidden fees.',
  },
  {
    q: 'Do you use technology in your planning process?',
    a: 'We use practical digital tools for better coordination, cost estimation, and project tracking. The focus stays on clear planning, accurate execution, and reliable delivery.',
  },
  {
    q: 'What types of projects do you take on?',
    a: 'We handle residential homes, commercial spaces, government infrastructure, healthcare facilities, schools, and renovation projects. If it involves construction or design, we can help.',
  },
  {
    q: 'How long does a typical construction project take?',
    a: 'Timeline depends on the project scope and complexity. A standard residential home takes 8–12 months, while smaller renovation projects can be completed in 4–8 weeks. We always commit to a delivery date upfront.',
  },
]

export default function FAQSection({ content }: FAQSectionProps) {
  const [open, setOpen] = useState<number | null>(0)
  const title = content?.title ?? 'Frequently Asked Questions'
  const copy = content?.copy ?? 'Everything you need to know before starting your project with us.'
  const faqs = content?.items?.length ? content.items : defaultFaqs
  const image =
    content?.image ?? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop'
  const imageBadge = content?.imageBadge ?? 'Construction FAQ'
  const highlightTitle = content?.highlightTitle ?? 'Answers that feel straightforward.'
  const highlightCopy =
    content?.highlightCopy ?? 'A calm visual backdrop helps the section feel premium while the FAQs stay easy to read.'

  return (
    <MotionDiv
      id="faq"
      className="cms-section-surface noise-overlay relative overflow-hidden py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={sectionReveal}
    >
      <div className="cms-section-fill absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(115,165,202,0.12),transparent_36%),radial-gradient(circle_at_left_bottom,rgba(232,127,36,0.08),transparent_34%)]" />
      <div className="absolute top-1/2 right-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#73A5CA]/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <MotionDiv className="max-w-2xl" variants={itemReveal}>
            <div className="badge badge-orange mb-5 inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E87F24]" />
              Learn More From
            </div>
            <h2 className="font-display mb-5 text-3xl font-black text-[#1c1712] sm:text-4xl lg:text-6xl">
              {title}
            </h2>
            <p className="text-base text-[#6e6256] sm:text-lg">{copy}</p>

            <div className="mt-10 flex flex-col gap-4">
              {faqs.map((faq, i) => (
                <MotionDiv
                  key={i}
                  className={`glass-card overflow-hidden rounded-2xl border transition-all duration-300 ${
                    open === i ? 'border-[#E87F24]/30' : 'border-[#73A5CA]/10'
                  }`}
                  variants={itemReveal}
                  whileHover={{ y: -3 }}
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-6"
                  >
                    <span
                      className={`text-sm font-semibold leading-snug transition-colors ${
                        open === i ? 'text-[#E87F24]' : 'text-[#1c1712]/86'
                      }`}
                    >
                      {faq.q}
                    </span>
                    <div
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        open === i ? 'bg-[#E87F24]' : 'glass'
                      }`}
                    >
                      {open === i ? (
                        <Minus size={14} className="text-[#FEFDDF]" />
                      ) : (
                        <Plus size={14} className="text-[#6e6256]" />
                      )}
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-48' : 'max-h-0'}`}>
                    <div className="px-6 pb-6">
                      <div className="mb-4 h-px bg-gradient-to-r from-[#73A5CA]/30 via-[#FFC81E]/20 to-transparent" />
                      <p className="text-sm leading-relaxed text-[#6e6256]">{faq.a}</p>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>

            <MotionDiv
              className="mt-10 glass-strong rounded-3xl p-6 sm:p-8"
              variants={itemReveal}
              whileHover={{ y: -3 }}
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display mb-3 text-2xl font-bold text-[#1c1712]">
                    Still have questions?
                  </h3>
                  <p className="text-sm text-[#6e6256]">
                    Our team is happy to walk you through the entire process at no cost.
                  </p>
                </div>
                <MotionA
                  href="/contact"
                  className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Talk to an Expert →
                </MotionA>
              </div>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv
            className="relative min-h-[480px] overflow-hidden rounded-[36px] border border-[#73A5CA]/12 bg-[#1c1712] shadow-[0_32px_80px_rgba(28,23,18,0.18)] sm:min-h-[560px] lg:min-h-[680px]"
            variants={itemReveal}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(16,14,12,0.42),rgba(16,14,12,0.72)),url('${image}')`,
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,30,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(115,165,202,0.22),transparent_34%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(254,253,223,0.06),transparent_28%,transparent_70%,rgba(255,255,255,0.04))]" />

            <MotionDiv
              className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#1c1712]/42 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-[#FEFDDF] backdrop-blur-xl shadow-[0_10px_24px_rgba(0,0,0,0.12)] sm:left-6 sm:top-6 sm:px-4 sm:text-xs sm:tracking-[0.28em]"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {imageBadge}
            </MotionDiv>

            <MotionDiv
              className="absolute right-4 top-16 w-44 rounded-[24px] border border-[#FFC81E]/40 bg-[#1c1712]/72 p-3 text-[#FEFDDF] shadow-[0_18px_50px_rgba(28,23,18,0.32)] backdrop-blur-xl sm:right-6 sm:top-24 sm:w-52 sm:p-4"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-2xl font-black text-[#E87F24] sm:text-3xl">24/7</div>
              <p className="mt-2 text-[11px] leading-relaxed text-[#FEFDDF]/82 sm:text-xs">
                Clear answers, clean coordination, and support when you need it.
              </p>
            </MotionDiv>

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
              <div className="max-w-none rounded-[28px] border border-white/28 bg-[#FEFDDF]/90 p-5 shadow-[0_18px_50px_rgba(28,23,18,0.24)] backdrop-blur-xl sm:max-w-md sm:p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#E87F24] shadow-[0_0_0_6px_rgba(232,127,36,0.14)]" />
                  <span className="text-xs uppercase tracking-[0.28em] text-[#5d8fb2]">Smooth support</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#1c1712] sm:text-2xl">{highlightTitle}</h3>
                <p className="mt-3 text-sm leading-6 text-[#6e6256]">
                  {highlightCopy}
                </p>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </MotionDiv>
  )
}
