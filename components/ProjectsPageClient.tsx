'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ArrowRight, Layers3, MapPin, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import NavbarClient from '@/components/NavbarClient'
import FooterClient from '@/components/FooterClient'
import { itemReveal, sectionReveal } from './motion'
import { sectionStyleVars } from '@/lib/section-style'
import { projectCatalog, type ProjectItem } from '@/lib/projects'
import type { ProjectsPageContent } from '@/lib/site-pages'
import type { GlobalLayoutSettings } from '@/lib/site-settings-defaults'

const MotionDiv = motion.div
const MotionSection = motion.section
const MotionArticle = motion.article

const defaultCategories = ['All', 'Residential', 'Commercial', 'Interiors', 'Renovation']

type ProjectsPageClientProps = {
  content?: Partial<ProjectsPageContent>
  projects?: ProjectItem[]
  layoutSettings: GlobalLayoutSettings
}

export default function ProjectsPageClient({ content, projects = projectCatalog, layoutSettings }: ProjectsPageClientProps) {
  const hero = content?.hero
  const intro = content?.intro
  const categories = content?.categories?.length ? content.categories : defaultCategories
  const stats = content?.stats?.length
    ? content.stats
    : [
        { value: '05', label: 'curated case studies' },
        { value: '04', label: 'delivery categories' },
        { value: '12+', label: 'years of experience' },
      ]
  const cta = content?.cta ?? {}
  const sectionSettings = content?.sectionSettings ?? {}
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects
    return projects.filter((project) => project.category === activeCategory)
  }, [activeCategory, projects])

  return (
    <main className="public-site cms-section-surface">
      <NavbarClient settings={layoutSettings.header} />

      <MotionSection
        className="cms-section-surface relative overflow-hidden pt-28 sm:pt-32"
        style={sectionStyleVars(sectionSettings.hero)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={sectionReveal}
      >
        <div className="cms-section-fill absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.12),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(115,165,202,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(232,127,36,0.08)_1px,transparent_1px)] [background-size:240px_240px] [mask-image:linear-gradient(180deg,transparent,black_14%,black_88%,transparent)]" />

        <div className="relative mx-auto w-full max-w-[1800px] px-5 pb-14 sm:px-6 md:px-10 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <MotionDiv
              className="flex flex-col justify-end rounded-[36px] border border-[#73A5CA]/14 bg-[linear-gradient(180deg,rgba(254,253,223,0.94),rgba(255,255,255,0.86))] p-5 shadow-[0_20px_60px_rgba(28,23,18,0.08)] backdrop-blur-sm sm:p-7 lg:p-8"
              variants={itemReveal}
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#4e7c9d] shadow-[0_12px_28px_rgba(28,23,18,0.06)] backdrop-blur-sm">
                <Sparkles size={12} className="text-[#E87F24]" />
                {hero?.label ?? 'Selected Projects'}
              </div>
              <h1
                className="cms-hero-title mt-6 max-w-4xl text-[clamp(3rem,8.6vw,8.8rem)] font-black leading-[0.86] tracking-[-0.065em] text-[#1c1712]"
                style={{ color: '#1c1712', textShadow: '0 10px 30px rgba(254,253,223,0.48)' }}
              >
                {hero?.title ?? 'Five selected projects, shaped with rhythm and construction clarity.'}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#53483d] sm:text-lg" style={{ color: '#53483d' }}>
                {hero?.copy ?? 'A tighter portfolio of BuildCivil work, chosen to show the kind of residential, commercial, interior, and renovation delivery that matters most.'}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/contact"
                  className="btn-primary inline-flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-transform"
                >
                  Start a Conversation
                  <ArrowRight size={16} />
                </a>
                <a
                  href="/services"
                  className="inline-flex items-center gap-3 rounded-full border border-[#73A5CA]/18 px-6 py-3.5 text-sm font-semibold text-[#1c1712] transition-colors hover:border-[#E87F24]/25 hover:text-[#E87F24]"
                >
                  View Services
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-[24px] border border-[#73A5CA]/12 bg-white p-5 shadow-[0_16px_40px_rgba(28,23,18,0.08)] backdrop-blur-sm">
                    <div className="text-2xl font-black tracking-[-0.04em] text-[#E87F24]">{stat.value}</div>
                    <p className="mt-3 text-sm leading-6 text-[#53483d]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </MotionDiv>

            <MotionDiv className="relative flex items-end" variants={itemReveal}>
              <div className="relative min-h-[560px] w-full overflow-hidden rounded-[40px] border border-[#73A5CA]/14 bg-[#FEFDDF] shadow-[0_30px_90px_rgba(28,23,18,0.12)] sm:min-h-[700px]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      `linear-gradient(180deg, rgba(255,253,223,0.08), rgba(28,23,18,0.42)), url('${hero?.image ?? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1800&auto=format&fit=crop'}')`,
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,30,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(115,165,202,0.18),transparent_35%)]" />

                <div className="absolute left-5 top-5 rounded-full border border-[#FEFDDF]/65 bg-[#FEFDDF]/86 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2] shadow-[0_8px_20px_rgba(28,23,18,0.08)] backdrop-blur-md">
                  Project wall
                </div>

                <div className="absolute right-5 top-5 hidden rounded-full border border-[#FEFDDF]/60 bg-[#FEFDDF]/82 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#1c1712] shadow-[0_8px_20px_rgba(28,23,18,0.08)] backdrop-blur-md md:block">
                  Architecture, interiors, delivery
                </div>

              <div className="absolute bottom-5 left-5 right-5 rounded-[28px] border border-[#73A5CA]/14 bg-[#FEFDDF]/90 p-5 shadow-[0_10px_28px_rgba(28,23,18,0.08)] backdrop-blur-xl sm:right-auto sm:max-w-lg">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#5d8fb2]">
                    <Layers3 size={15} className="text-[#E87F24]" />
                    Shortlisted project gallery
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#6e6256]">
                    A visual archive designed to feel editorial, ordered, and easy to explore.
                  </p>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>

      <section className="cms-section-surface relative overflow-hidden py-8 sm:py-12 lg:py-16" style={sectionStyleVars(sectionSettings.intro)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.08),transparent_34%)]" />
        <div className="relative mx-auto w-full max-w-[1800px] px-5 sm:px-6 md:px-10 lg:px-16">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-[#73A5CA]/18 bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2] shadow-[0_10px_24px_rgba(28,23,18,0.05)]">
                {intro?.title ? 'Filter projects' : 'Filter projects'}
              </span>
              <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.6rem)] font-black leading-[0.92] tracking-[-0.05em] text-[#1c1712]">
                {intro?.title ?? 'Browse by project type.'}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[#6e6256]">
              {intro?.copy ?? 'Choose a category to narrow the wall and view only the projects in that segment.'}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => {
              const active = category === activeCategory
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? 'btn-primary shadow-[0_12px_24px_rgba(232,127,36,0.16)]'
                      : 'border border-[#73A5CA]/18 bg-white/82 text-[#1c1712] hover:border-[#E87F24]/25 hover:text-[#E87F24]'
                  }`}
                >
                  {category}
                  {active ? <Sparkles size={14} /> : null}
                </button>
              )
            })}
          </div>

          <div className="mt-4 text-sm text-[#6e6256]">
            Showing <span className="font-semibold text-[#1c1712]">{filteredProjects.length}</span> projects
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
            {filteredProjects.map((project, index) => (
              <li key={project.slug} className="list-none">
                <Link href={`/projects/${project.slug}`} className="group block h-full">
                  <MotionArticle
                    className="flex h-full flex-col overflow-hidden rounded-[30px] border border-[#73A5CA]/12 bg-white/84 shadow-[0_18px_48px_rgba(28,23,18,0.08)] transition-transform duration-300 group-hover:-translate-y-1"
                    variants={itemReveal}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                  >
                    <div className="relative">
                      <div className="relative h-[320px] w-full overflow-hidden sm:h-[360px] xl:h-[420px]">
                        <Image
                          src={project.image}
                          alt={`${project.title} project image`}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                          priority={index === 0}
                          unoptimized
                        />
                      </div>
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(115,165,202,0.12),transparent_32%),linear-gradient(315deg,rgba(232,127,36,0.12),transparent_28%)] opacity-90" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1712]/42 via-transparent to-transparent" />

                      <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3 text-[#FEFDDF]">
                        <div className="max-w-[75%]">
                          <h3 className="max-w-[11rem] text-[1rem] font-semibold uppercase leading-[1.08] tracking-[0.16em] text-[#FEFDDF] drop-shadow-[0_8px_20px_rgba(28,23,18,0.45)] sm:max-w-[12rem] sm:text-[1.1rem]">
                            {project.title}
                          </h3>
                        </div>
                        <div className="rounded-full border border-[#FEFDDF]/50 bg-[#FEFDDF]/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#FEFDDF]/82 backdrop-blur-md">
                          {project.year}
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                        <div className="max-w-[72%] rounded-[22px] border border-[#FEFDDF]/30 bg-[#FEFDDF]/14 px-4 py-3 text-[#FEFDDF] backdrop-blur-md">
                          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-[#FEFDDF]/82">
                            <MapPin size={12} className="text-[#FFC81E]" />
                            {project.category}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[#FEFDDF]/86">{project.description}</p>
                        </div>
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#FFC81E]/35 bg-[#FEFDDF]/16 text-[#FEFDDF] backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-4">
                      <div className="text-sm font-medium text-[#6e6256]">{project.location}</div>
                      <div className="hidden text-[10px] uppercase tracking-[0.28em] text-[#5d8fb2] sm:block">
                        {project.cardLabel}
                      </div>
                    </div>
                  </MotionArticle>
                </Link>
              </li>
            ))}
          </ul>

          <MotionDiv className="mt-10 rounded-[30px] border border-[#73A5CA]/14 bg-white/84 px-6 py-6 shadow-[0_18px_48px_rgba(28,23,18,0.08)] sm:px-8" variants={itemReveal}>
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h3 className="text-xl font-semibold text-[#1c1712]">{cta.title ?? 'Want to see a project similar to yours?'}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e6256]">
                  {cta.copy ?? 'We can shape a project flow around your site, budget, and finish level.'}
                </p>
              </div>
              <a
                href={cta.href ?? '/contact'}
                className="btn-primary inline-flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-transform"
              >
                {cta.label ?? 'Start a Conversation'}
                <ArrowRight size={16} />
              </a>
            </div>
          </MotionDiv>
        </div>
      </section>

      <FooterClient settings={layoutSettings.footer} />
    </main>
  )
}
