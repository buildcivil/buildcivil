'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Layers3, Sparkles, Ruler } from 'lucide-react'
import { motion } from 'framer-motion'
import NavbarClient from '@/components/NavbarClient'
import FooterClient from '@/components/FooterClient'
import { itemReveal, sectionReveal } from './motion'
import { getRelatedProjects, type ProjectItem } from '@/lib/projects'
import type { GlobalLayoutSettings } from '@/lib/site-settings-defaults'

const MotionDiv = motion.div
const MotionSection = motion.section

type Props = {
  project: ProjectItem
  layoutSettings: GlobalLayoutSettings
}

export default function ProjectDetailPageClient({ project, layoutSettings }: Props) {
  const relatedProjects = getRelatedProjects(project.slug, project.category)

  return (
    <main className="public-site bg-white text-[#1c1712]">
      <NavbarClient settings={layoutSettings.header} />

      <MotionSection
        className="relative overflow-hidden pt-28 sm:pt-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={sectionReveal}
      >
        <div className="absolute inset-0 bg-[#FEFDDF]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.12),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(115,165,202,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(232,127,36,0.08)_1px,transparent_1px)] [background-size:240px_240px] [mask-image:linear-gradient(180deg,transparent,black_14%,black_88%,transparent)]" />

        <div className="relative mx-auto w-full max-w-[1800px] px-5 pb-14 sm:px-6 md:px-10 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <MotionDiv className="flex flex-col justify-end" variants={itemReveal}>
              <Link
                href="/projects"
                className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white px-4 py-2 text-xs font-medium text-[#1c1712] shadow-[0_10px_24px_rgba(28,23,18,0.05)] transition-colors hover:border-[#E87F24]/30 hover:text-[#E87F24]"
              >
                <ArrowLeft size={14} />
                Back to projects
              </Link>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2] shadow-[0_12px_28px_rgba(28,23,18,0.06)] backdrop-blur-sm">
                <Sparkles size={12} className="text-[#E87F24]" />
                Project detail
              </div>
              <h1 className="mt-6 max-w-4xl text-[clamp(3rem,8.4vw,8.8rem)] font-black leading-[0.86] tracking-[-0.065em] text-[#1c1712]">
                {project.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#6e6256] sm:text-lg">
                {project.heroTitle}
              </p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6e6256] sm:text-base">
                {project.heroCopy}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="btn-primary inline-flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-transform"
                >
                  Start a Conversation
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-3 rounded-full border border-[#73A5CA]/18 px-6 py-3.5 text-sm font-semibold text-[#1c1712] transition-colors hover:border-[#E87F24]/25 hover:text-[#E87F24]"
                >
                  Back to Projects
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {project.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[24px] border border-[#73A5CA]/12 bg-white/82 p-5 shadow-[0_16px_40px_rgba(28,23,18,0.08)] backdrop-blur-sm"
                  >
                    <div className="text-2xl font-black tracking-[-0.04em] text-[#E87F24]">{stat.value}</div>
                    <p className="mt-3 text-sm leading-6 text-[#6e6256]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </MotionDiv>

            <MotionDiv className="relative flex items-end" variants={itemReveal}>
              <div className="relative min-h-[480px] w-full overflow-hidden rounded-[40px] border border-[#73A5CA]/14 bg-[#FEFDDF] shadow-[0_30px_90px_rgba(28,23,18,0.12)] sm:min-h-[620px]">
                <Image
                  src={project.image}
                  alt={`${project.title} featured project image`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,30,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(115,165,202,0.18),transparent_35%)]" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#73A5CA]/10 via-transparent to-[#E87F24]/10" />

                <div className="absolute left-5 top-5 rounded-full border border-[#FEFDDF]/65 bg-[#FEFDDF]/86 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2] shadow-[0_8px_20px_rgba(28,23,18,0.08)] backdrop-blur-md">
                  {project.category}
                </div>

                <div className="absolute bottom-5 left-5 right-5 rounded-[28px] border border-[#73A5CA]/14 bg-[#FEFDDF]/90 p-5 shadow-[0_10px_28px_rgba(28,23,18,0.08)] backdrop-blur-xl sm:right-auto sm:max-w-lg">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#5d8fb2]">
                    <Layers3 size={15} className="text-[#E87F24]" />
                    {project.highlights.join(', ')}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#6e6256]">{project.overview}</p>
                </div>

                <MotionDiv
                  className="absolute right-5 top-1/2 hidden w-[220px] -translate-y-1/2 rounded-[26px] border border-[#73A5CA]/14 bg-[rgba(255,253,223,0.95)] p-4 shadow-[0_10px_28px_rgba(28,23,18,0.08)] backdrop-blur-xl lg:block"
                  variants={itemReveal}
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="text-[11px] uppercase tracking-[0.28em] text-[#5d8fb2]">Location</div>
                  <p className="mt-3 text-sm leading-6 text-[#6e6256]">{project.location}</p>
                </MotionDiv>
              </div>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>

      <section className="relative overflow-hidden bg-[#FEFDDF] py-10 sm:py-14 lg:py-18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.08),transparent_34%)]" />
        <div className="relative mx-auto w-full max-w-[1800px] px-5 sm:px-6 md:px-10 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.72fr] lg:items-start">
            <MotionDiv
              className="rounded-[36px] border border-[#73A5CA]/14 bg-white/88 p-6 shadow-[0_22px_70px_rgba(28,23,18,0.1)] sm:p-8 lg:p-10"
              variants={itemReveal}
            >
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.26em] text-[#5d8fb2]">
                <Ruler size={16} className="text-[#E87F24]" />
                Project overview
              </div>
              <h2 className="mt-5 max-w-2xl text-[clamp(2rem,4vw,4.2rem)] font-black leading-[0.92] tracking-[-0.05em] text-[#1c1712]">
                {project.overview}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6e6256] sm:text-base">
                A project built to feel clear in both presentation and delivery, with the warm
                palette carrying through the full sequence.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {project.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-[24px] border border-[#73A5CA]/12 bg-[#FEFDDF] p-4 shadow-[0_12px_32px_rgba(28,23,18,0.05)]"
                  >
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#5d8fb2]">
                      <CheckCircle2 size={14} className="text-[#E87F24]" />
                      Highlight
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#6e6256]">{highlight}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {project.gallery.map((image, index) => (
                  <div
                    key={image}
                    className="relative min-h-[220px] overflow-hidden rounded-[28px] border border-[#73A5CA]/12 bg-cover bg-center shadow-[0_16px_40px_rgba(28,23,18,0.08)]"
                  >
                    <Image
                      src={image}
                      alt={`${project.title} gallery image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 20vw, 100vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#FEFDDF]/5 via-transparent to-[#1c1712]/18" />
                    <div className="absolute left-4 top-4 rounded-full border border-[#FEFDDF]/55 bg-[#FEFDDF]/12 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#FEFDDF] backdrop-blur-md">
                      Gallery 0{index + 1}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-[#73A5CA]/12 bg-[linear-gradient(135deg,rgba(115,165,202,0.12),rgba(255,255,255,0.9))] p-5">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-[#5d8fb2]">
                  <Clock3 size={14} className="text-[#E87F24]" />
                  Delivery flow
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {project.process.map((step) => (
                    <div key={step.step} className="rounded-[24px] bg-white/80 p-4 shadow-[0_10px_28px_rgba(28,23,18,0.06)]">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-[#5d8fb2]">{step.step}</div>
                      <h3 className="mt-2 text-base font-semibold text-[#1c1712]">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#6e6256]">{step.copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </MotionDiv>

            <div className="space-y-5 lg:sticky lg:top-32">
              <MotionDiv
                className="rounded-[32px] border border-[#73A5CA]/14 bg-white/88 p-6 shadow-[0_22px_70px_rgba(28,23,18,0.1)]"
                variants={itemReveal}
              >
                <div className="text-[11px] uppercase tracking-[0.26em] text-[#5d8fb2]">Best for</div>
                <p className="mt-3 text-sm leading-7 text-[#6e6256]">
                  {project.category} projects that need a clear design language, dependable
                  coordination, and a premium presentation.
                </p>
              </MotionDiv>

              <MotionDiv
                className="rounded-[32px] border border-[#73A5CA]/14 bg-white/88 p-6 shadow-[0_22px_70px_rgba(28,23,18,0.1)]"
                variants={itemReveal}
              >
                <div className="text-[11px] uppercase tracking-[0.26em] text-[#5d8fb2]">Project focus</div>
                <div className="mt-4 space-y-3">
                  {project.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-start gap-3 rounded-[22px] bg-[#FEFDDF] p-4">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#FFC81E]" />
                      <p className="text-sm leading-6 text-[#6e6256]">{highlight}</p>
                    </div>
                  ))}
                </div>
              </MotionDiv>

              <MotionDiv
                className="overflow-hidden rounded-[32px] border border-[#73A5CA]/14 bg-[#FEFDDF] shadow-[0_22px_70px_rgba(28,23,18,0.1)]"
                variants={itemReveal}
              >
                <div className="relative min-h-[260px]">
                  <Image
                    src={project.image}
                    alt={`${project.title} preview image`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 22vw, 100vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FEFDDF]/5 via-transparent to-[#1c1712]/24" />
                </div>
                <div className="p-5">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#5d8fb2]">Start here</div>
                  <p className="mt-3 text-sm leading-7 text-[#6e6256]">
                    Tell us about a similar project and we&apos;ll map the next steps with clarity.
                  </p>
                  <Link
                    href="/contact"
                    className="btn-primary mt-5 inline-flex items-center gap-3 px-5 py-3 text-sm font-semibold"
                  >
                    Start a Conversation
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </MotionDiv>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#FEFDDF] py-10 sm:py-14 lg:py-18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.08),transparent_34%)]" />
        <div className="relative mx-auto w-full max-w-[1800px] px-5 sm:px-6 md:px-10 lg:px-16">
          <MotionDiv className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" variants={itemReveal}>
            <div>
              <span className="inline-flex rounded-full border border-[#73A5CA]/18 bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2]">
                Related projects
              </span>
              <h2 className="mt-5 text-[clamp(2rem,4vw,4.8rem)] font-black leading-[0.92] tracking-[-0.05em] text-[#1c1712]">
                Continue exploring the portfolio.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[#6e6256]">
              Similar builds from the same wall of work, curated to help you compare scope and mood.
            </p>
          </MotionDiv>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {relatedProjects.map((item) => (
              <Link
                key={item.slug}
                href={`/projects/${item.slug}`}
                className="group overflow-hidden rounded-[30px] border border-[#73A5CA]/14 bg-white/86 shadow-[0_18px_48px_rgba(28,23,18,0.08)] transition-transform hover:-translate-y-1"
              >
                <div className="relative min-h-[260px]">
                  <Image
                    src={item.image}
                    alt={`${item.title} related project image`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#73A5CA]/12 via-transparent to-[#E87F24]/12" />
                  <div className="absolute left-4 top-4 rounded-full border border-[#FEFDDF]/55 bg-[#FEFDDF]/12 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#FEFDDF] backdrop-blur-md">
                    {item.category}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 rounded-[22px] border border-[#FEFDDF]/30 bg-[#FEFDDF]/14 p-4 text-[#FEFDDF] backdrop-blur-md">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-[#FEFDDF]/80">
                      Project detail
                    </div>
                    <h3 className="mt-2 text-xl font-semibold leading-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#FEFDDF]/84">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FooterClient settings={layoutSettings.footer} />
    </main>
  )
}
