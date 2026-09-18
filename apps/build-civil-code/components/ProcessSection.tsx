'use client'

import { motion } from 'framer-motion'
import { itemReveal, sectionReveal } from './motion'
import type { HomePageContent } from '@buildcivil/cms/site-pages'

const MotionDiv = motion.div
const MotionArticle = motion.article

type ProcessSectionProps = {
  content?: Partial<HomePageContent['process']>
}

const defaultSteps = [
  {
    id: '01',
    title: 'Define',
    copy:
      'We start by understanding scope, budget, timeline, and the kind of home or commercial space you want to build.',
  },
  {
    id: '02',
    title: 'Design',
    copy:
      'Our team turns the brief into a clear plan with layouts, elevations, and a practical construction strategy.',
  },
  {
    id: '03',
    title: 'Build',
    copy:
      'We execute the build with transparent updates, site supervision, and a steady focus on quality.',
  },
  {
    id: '04',
    title: 'Handover',
    copy:
      'Once complete, we inspect, polish, and hand over the project ready for occupancy and long-term use.',
  },
]

export default function ProcessSection({ content }: ProcessSectionProps) {
  const title = content?.title ?? 'Let us show you how we drive your project to new heights'
  const copy =
    content?.copy ?? 'From first sketch to final key handover, we keep every step visible, collaborative, and calm.'
  const steps = content?.steps?.length ? content.steps : defaultSteps
  return (
    <MotionDiv
      id="process"
      className="cms-section-surface section-pad"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionReveal}
    >
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <MotionDiv className="max-w-xl lg:sticky lg:top-28" variants={itemReveal}>
            <span className="inline-flex rounded-full border border-[#73A5CA]/20 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#5d8fb2]">
              How we work
            </span>
            <h2 className="mt-4 max-w-lg text-[clamp(2.4rem,4vw,4.5rem)] leading-[0.95] font-medium tracking-tight">
              {title}
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#6e6256]">
              {copy}
            </p>
          </MotionDiv>

          <MotionDiv
            className="relative overflow-hidden rounded-[40px] border border-[#73A5CA]/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(254,253,223,0.96))] p-5 shadow-[0_30px_80px_rgba(28,23,18,0.08)] md:p-8"
            variants={itemReveal}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.45),transparent_30%,transparent_70%,rgba(255,255,255,0.22))]" />

            <svg
              className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
              viewBox="0 0 1000 760"
              aria-hidden="true"
            >
              <path
                d="M170 170 H 490"
                fill="none"
                stroke="#b9cde0"
                strokeDasharray="8 10"
                strokeWidth="2"
              />
              <path
                d="M500 220 V 390"
                fill="none"
                stroke="#b9cde0"
                strokeDasharray="8 10"
                strokeWidth="2"
              />
              <path
                d="M560 390 H 820"
                fill="none"
                stroke="#b9cde0"
                strokeDasharray="8 10"
                strokeWidth="2"
              />
              <path
                d="M820 460 V 585"
                fill="none"
                stroke="#b9cde0"
                strokeDasharray="8 10"
                strokeWidth="2"
              />
              <path
                d="M260 525 C 340 525, 390 595, 515 595 S 705 550, 795 548"
                fill="none"
                stroke="#d4deeb"
                strokeDasharray="8 10"
                strokeWidth="2"
              />
            </svg>

            <div className="relative grid gap-5 lg:grid-cols-2">
              {steps.map((step, index) => (
                <StepCard
                  key={step.id}
                  step={step}
                  className={index === 0 ? 'lg:translate-y-4' : index === 2 ? 'lg:-translate-y-6' : ''}
                />
              ))}
            </div>

            <div className="relative mt-6 flex justify-end text-sm italic text-[#5d8fb2]">
              Ready to be delivered!
            </div>
          </MotionDiv>
        </div>
      </div>
    </MotionDiv>
  )
}

function StepCard({
  step,
  className = '',
}: {
  step: (typeof defaultSteps)[number]
  className?: string
}) {
  return (
    <MotionArticle
      className={`group relative overflow-hidden rounded-[28px] border border-[#73A5CA]/12 bg-white/80 p-6 shadow-[0_18px_40px_rgba(28,23,18,0.08)] transition-transform duration-300 ${className}`}
      variants={itemReveal}
      whileHover={{ y: -6 }}
    >
      <div className="mb-14 flex items-start justify-between">
        <span className="text-sm font-medium text-[#5d8fb2]">{step.id}</span>
        <div className="h-3 w-3 rounded-full bg-[#E87F24] shadow-[0_0_0_7px_rgba(232,127,36,0.12)]" />
      </div>
      <h3 className="text-3xl font-medium tracking-tight text-[#1c1712]">{step.title}</h3>
      <p className="mt-4 max-w-sm text-sm leading-6 text-[#6e6256]">{step.copy}</p>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FFC81E]/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </MotionArticle>
  )
}
