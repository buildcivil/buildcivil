'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { itemReveal, sectionReveal } from './motion'
import type { ProjectItem } from '@buildcivil/cms/projects'
import type { HomePageContent } from '@buildcivil/cms/site-pages'

const MotionDiv = motion.div
const MotionArticle = motion.article

type ProjectSlide = {
  projectSlug?: string
  title: string
  label: string
  image: string
  metric: string
  metricLabel: string
  description: string
}

type ShowcaseSectionProps = {
  content?: Partial<HomePageContent['showcase']>
  projects?: ProjectItem[]
}

const defaultProjects: ProjectSlide[] = [
  {
    title: 'Modern Commercial Complex',
    label: 'commercial',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1200&auto=format&fit=crop',
    metric: '120+',
    metricLabel: 'real projects',
    description: 'A clean, high-rise composition for mixed-use construction work.',
  },
  {
    title: 'Luxury Private Residence',
    label: 'residential',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
    metric: '500k+',
    metricLabel: 'square feet built',
    description: 'A warm residential build with premium light, material, and detail.',
  },
  {
    title: 'Urban Tower Development',
    label: 'commercial',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1400&auto=format&fit=crop',
    metric: '50+',
    metricLabel: 'architectural projects',
    description: 'A dramatic vertical profile designed for modern city density.',
  },
]

function projectToSlide(project: ProjectItem, fallback?: Partial<ProjectSlide>): ProjectSlide {
  const stat = project.stats[0]
  return {
    projectSlug: project.slug,
    title: project.title,
    label: project.category.toLowerCase(),
    image: project.image,
    metric: fallback?.metric || stat?.value || project.year || '01',
    metricLabel: fallback?.metricLabel || stat?.label || 'featured project',
    description: project.description,
  }
}

export default function ShowcaseSection({ content, projects: projectLibrary = [] }: ShowcaseSectionProps) {
  const title = content?.title ?? 'We built 50+\narchitectural and residential projects'
  const copy =
    content?.copy ?? 'A selected gallery of homes and commercial work shaped with calm rhythm and practical detailing.'
  const projectMap = new Map(projectLibrary.map((project) => [project.slug, project]))
  const projects = content?.slides?.length
    ? content.slides.map((slide, index) => {
      const titleProject = projectLibrary.find((project) => project.title.toLowerCase() === slide.title.toLowerCase())
      const linkedProject = slide.projectSlug ? projectMap.get(slide.projectSlug) : titleProject ?? projectLibrary[index]
      return linkedProject ? projectToSlide(linkedProject, slide) : slide
    })
    : projectLibrary.length
      ? projectLibrary.slice(0, 3).map((project) => projectToSlide(project))
      : defaultProjects
  const [activeIndex, setActiveIndex] = useState(1)
  const total = projects.length

  useEffect(() => {
    if (activeIndex >= total) setActiveIndex(Math.max(total - 1, 0))
  }, [activeIndex, total])

  useEffect(() => {
    if (total < 2) return
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [total])

  const goTo = (index: number) => {
    setActiveIndex((index + total) % total)
  }

  const visibleSlides = [-1, 0, 1].map((offset) => {
    const project = projects[(activeIndex + offset + total) % total]
    return { project, offset }
  })

  return (
    <MotionDiv
      id="projects"
      className="cms-section-surface section-pad"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionReveal}
    >
      <div className="w-full px-6 md:px-10 lg:px-16">
        <MotionDiv className="text-center" variants={itemReveal}>
          <h2 className="title-display text-[clamp(2.2rem,7.5vw,5.2rem)] leading-[0.9]">
            {title.split('\n').map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {index === 0 ? (
                  <>
                    {line.includes('50+') ? (
                      <>
                        {line.replace('50+', '')}
                        <span className="text-[#73A5CA]">50+</span>
                      </>
                    ) : (
                      line
                    )}
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#6e6256] md:text-base">{copy}</p>
        </MotionDiv>

        <div className="relative mt-10">
          <div className="absolute inset-x-4 top-6 h-[70%] rounded-[48px] bg-[radial-gradient(circle_at_center,rgba(115,165,202,0.12),transparent_54%),radial-gradient(circle_at_top_left,rgba(232,127,36,0.08),transparent_36%)] blur-2xl sm:inset-x-10" />

          <div className="relative grid gap-5 lg:grid-cols-[0.95fr_1.35fr_0.95fr] lg:items-center">
            {visibleSlides.map(({ project, offset }) => {
              const isCenter = offset === 0
              return (
                <MotionArticle
                  key={`slot-${offset}`}
                  className={`group relative mx-auto w-full overflow-hidden rounded-[30px] will-change-transform ${isCenter ? 'max-w-[520px] lg:max-w-none lg:min-h-[560px]' : 'max-w-[460px] lg:max-w-none lg:min-h-[360px]'}`}
                  animate={{
                    scale: isCenter ? 1 : 0.92,
                    y: isCenter ? 0 : 18,
                    opacity: isCenter ? 1 : 0.78,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 85,
                    damping: 18,
                    mass: 1,
                  }}
                  whileHover={isCenter ? { y: -8 } : { y: -2, scale: 0.9 }}
                  style={{ zIndex: isCenter ? 3 : 2 }}
                >
                  <div
                    className={`relative overflow-hidden rounded-[30px] bg-cover bg-center shadow-2xl shadow-[#1c1712]/12 ${
                      isCenter ? 'h-[360px] sm:h-[460px] lg:h-[560px]' : 'h-[220px] sm:h-[290px] lg:h-[340px]'
                    }`}
                    style={{ backgroundImage: `url('${project.image}')` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1c1712]/24 via-transparent to-[#FEFDDF]/14" />
                    <div className={`absolute inset-0 ${isCenter ? 'bg-gradient-to-t from-[#1c1712]/32 via-transparent to-transparent' : 'bg-gradient-to-t from-[#1c1712]/18 via-transparent to-transparent'}`} />

                    {isCenter ? (
                      <>
                        <div className="absolute left-4 top-4 rounded-full border border-[#FEFDDF]/72 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#FEFDDF] backdrop-blur-sm sm:left-6 sm:top-6 sm:px-4 sm:text-[11px] sm:tracking-[0.35em]">
                          {project.label}
                        </div>
                        <div className="absolute left-4 top-14 max-w-[230px] space-y-2 text-[#FEFDDF] sm:left-6 sm:top-16 sm:max-w-[320px] sm:space-y-3 md:max-w-[420px]">
                          <p className="text-[clamp(2rem,8vw,4rem)] leading-[0.92] font-semibold tracking-tight drop-shadow-[0_8px_20px_rgba(28,23,18,0.45)] sm:text-[clamp(2.4rem,4.6vw,4rem)]">
                            {project.metric}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.28em] text-[#FEFDDF]/82 sm:text-[11px] sm:tracking-[0.38em]">
                            {project.metricLabel}
                          </p>
                        </div>

                        <div className="absolute bottom-4 left-4 rounded-[28px] border border-[#FFC81E]/38 bg-[#FEFDDF]/72 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-[#1c1712] backdrop-blur-md sm:bottom-6 sm:left-6 sm:px-5 sm:py-3 sm:text-xs sm:tracking-[0.35em]">
                          real projects
                        </div>
                      </>
                    ) : null}
                  </div>

                  <div className={`mt-4 space-y-2 px-1 sm:mt-5 sm:px-0 ${offset > 0 ? 'lg:text-right' : ''}`}>
                    <span className="inline-flex rounded-full border border-[#73A5CA]/20 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-[#73A5CA]">
                      {project.label}
                    </span>
                    <h3 className={`w-full max-w-none break-words text-base font-semibold leading-snug text-[#1c1712] sm:max-w-[230px] ${offset > 0 ? 'sm:ml-auto' : ''}`}>
                      {project.title}
                    </h3>
                    <p className={`w-full max-w-none break-words text-sm leading-6 text-[#6e6256] sm:max-w-[230px] ${offset > 0 ? 'sm:ml-auto' : ''}`}>
                      {project.description}
                    </p>
                  </div>
                </MotionArticle>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {projects.map((project, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={project.title}
                type="button"
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive ? 'w-10 bg-[#E87F24]' : 'w-2.5 bg-[#73A5CA]/35 hover:bg-[#73A5CA]/55'
                }`}
                aria-label={`Go to ${project.title}`}
              />
            )
          })}
        </div>
      </div>
    </MotionDiv>
  )
}
