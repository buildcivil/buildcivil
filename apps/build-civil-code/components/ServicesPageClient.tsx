'use client'

import { ArrowRight, Briefcase, CheckCircle2, Home, Palette, RefreshCw, Ruler, Sparkles, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'
import NavbarClient from '@/components/NavbarClient'
import FooterClient from '@/components/FooterClient'
import { itemReveal, sectionReveal } from './motion'
import { sectionStyleVars } from '@buildcivil/cms/section-style'
import { serviceCatalog, type ServiceItem } from '@buildcivil/cms/services'
import type { ServicesPageContent } from '@buildcivil/cms/site-pages'
import type { GlobalLayoutSettings } from '@buildcivil/cms/site-settings-defaults'

const MotionDiv = motion.div
const MotionSection = motion.section
const MotionA = motion.a

type ServicesPageClientProps = {
  content?: Partial<ServicesPageContent>
  services?: ServiceItem[]
  layoutSettings: GlobalLayoutSettings
}

const heroStats = [
  { value: '01', label: 'Single team from planning to handover' },
  { value: '05', label: 'Service tracks designed to work together' },
  { value: '100%', label: 'Clear coordination and transparent delivery' },
]

const services = [
  {
    slug: 'turnkey-construction',
    icon: Home,
    title: 'Turnkey Construction',
    summary:
      'Complete end-to-end construction solutions from first briefing to final handover, handled by one coordinated team.',
    kicker: 'Full build delivery',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop',
    accent: 'from-[#E87F24]/30 via-[#FFC81E]/14 to-transparent',
    bullets: ['Scope and scheduling', 'Site execution', 'Final handover'],
    details: [
      'One-point accountability from start to finish',
      'Built around clarity, quality, and steady site coordination',
      'Ideal for homeowners and developers who want less friction',
    ],
  },
  {
    slug: 'interior-exterior-design',
    icon: Palette,
    title: 'Interior & Exterior Design',
    summary:
      'Professional design services for both interior and exterior spaces, shaped for comfort, function, and visual balance.',
    kicker: 'Design language',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
    accent: 'from-[#73A5CA]/28 via-[#E87F24]/12 to-transparent',
    bullets: ['Space planning', 'Material direction', 'Finish selection'],
    details: [
      'Cohesive interior and exterior treatment',
      'Practical choices that still feel premium',
      'Balanced light, texture, and spatial flow',
    ],
  },
  {
    slug: 'renovation-remodeling',
    icon: RefreshCw,
    title: 'Renovation & Remodeling',
    summary:
      'Transform existing spaces with modern renovation solutions that improve layout, utility, and long-term value.',
    kicker: 'Fresh direction',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    accent: 'from-[#FFC81E]/24 via-[#73A5CA]/10 to-transparent',
    bullets: ['Selective upgrades', 'Smarter layouts', 'Reduced disruption'],
    details: [
      'Refreshes spaces without losing structural intent',
      'Useful for homes that need a new rhythm',
      'Helps the project feel new without starting from zero',
    ],
  },
  {
    slug: 'architectural-planning',
    icon: Ruler,
    title: 'Architectural Planning',
    summary:
      'Expert planning and structural direction that turns ideas into a clear, buildable project vision.',
    kicker: 'Build-ready clarity',
    image:
      'https://images.unsplash.com/photo-1531834685032-c34bf0d84e48?q=80&w=1600&auto=format&fit=crop',
    accent: 'from-[#73A5CA]/26 via-[#FFC81E]/10 to-transparent',
    bullets: ['Concept diagrams', 'Technical drawings', 'Approval-ready flow'],
    details: [
      'Gives every project a stronger early foundation',
      'Connects ambition with real-world build logic',
      'Helps reduce confusion before site work begins',
    ],
  },
  {
    slug: 'project-management',
    icon: Briefcase,
    title: 'Project Management',
    summary:
      'Professional project coordination services that keep your build organized, aligned, and on schedule.',
    kicker: 'Control and cadence',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop',
    accent: 'from-[#E87F24]/24 via-[#73A5CA]/10 to-transparent',
    bullets: ['Scheduling', 'Procurement oversight', 'Progress reporting'],
    details: [
      'Keeps work moving with fewer surprises',
      'Supports the client with steady communication',
      'Useful for projects that need disciplined coordination',
    ],
  },
]

const serviceIconMap = {
  home: Home,
  palette: Palette,
  refresh: RefreshCw,
  ruler: Ruler,
  briefcase: Briefcase,
}

function toServiceCard(service: ServiceItem) {
  return {
    slug: service.slug,
    icon: serviceIconMap[service.iconName] ?? Home,
    title: service.title,
    summary: service.description,
    kicker: service.kicker,
    image: service.image,
    accent: service.accent,
    bullets: service.bullets,
    details: service.details,
  }
}

export default function ServicesPageClient({ content, services: cmsServices = serviceCatalog, layoutSettings }: ServicesPageClientProps) {
  const hero = content?.hero
  const intro = content?.intro
  const stats = content?.stats?.length ? content.stats : heroStats
  const visual = content?.visual
  const ctas = content?.ctas ?? {}
  const serviceList = cmsServices.length ? cmsServices.map(toServiceCard) : services
  const sectionSettings = content?.sectionSettings ?? {}
  return (
    <main className="public-site cms-section-surface">
      <NavbarClient settings={layoutSettings.header} />

      <MotionSection
        className="cms-section-surface relative overflow-hidden pt-28 sm:pt-32"
        style={sectionStyleVars(sectionSettings.hero)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.22 }}
        variants={sectionReveal}
      >
        <div className="cms-section-fill absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.12),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(115,165,202,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(232,127,36,0.09)_1px,transparent_1px)] [background-size:240px_240px] [mask-image:linear-gradient(180deg,transparent,black_16%,black_84%,transparent)]" />

        <div className="relative mx-auto grid w-full max-w-[1800px] gap-10 px-6 pb-18 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:pb-24">
          <div className="flex flex-col justify-end">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white/75 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-[#5d8fb2] shadow-[0_12px_28px_rgba(28,23,18,0.06)] backdrop-blur-sm">
              <Sparkles size={12} className="text-[#FFC81E]" />
              {hero?.label ?? 'BuildCivil Services'}
            </div>
            <h1 className="cms-hero-title mt-6 max-w-4xl text-[clamp(3rem,9vw,8.8rem)] font-black leading-[0.86] tracking-[-0.06em] text-[#1c1712]">
              {hero?.title ?? 'Services that feel like a complete build story.'}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6e6256] sm:text-lg">
              {hero?.copy ?? 'We do not treat services as separate silos. Every track is designed to move together so your project feels calm, coordinated, and premium from the first discussion to the final handover.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={ctas.primaryHref ?? '/contact'}
                className="btn-primary inline-flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-transform"
              >
                {ctas.primaryLabel ?? 'Request a Quote'}
                <ArrowRight size={16} />
              </a>
              <a
                href={ctas.secondaryHref ?? '/about'}
                className="inline-flex items-center gap-3 rounded-full border border-[#73A5CA]/18 px-6 py-3.5 text-sm font-semibold text-[#1c1712] transition-colors hover:border-[#E87F24]/25 hover:text-[#E87F24]"
              >
                {ctas.secondaryLabel ?? 'Meet the Team'}
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-[24px] border border-[#73A5CA]/12 bg-white/80 p-5 shadow-[0_16px_40px_rgba(28,23,18,0.08)] backdrop-blur-sm"
                >
                  <div className="text-2xl font-black tracking-[-0.04em] text-[#FFC81E]">{stat.value}</div>
                  <p className="mt-3 text-sm leading-6 text-[#6e6256]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-end">
            <MotionDiv
              className="relative min-h-[620px] w-full overflow-hidden rounded-[40px] border border-[#73A5CA]/14 bg-[#FEFDDF] shadow-[0_30px_90px_rgba(28,23,18,0.12)]"
              variants={itemReveal}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    `linear-gradient(180deg, rgba(255,253,223,0.12), rgba(28,23,18,0.42)), url('${hero?.image ?? 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1800&auto=format&fit=crop'}')`,
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,30,0.20),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(115,165,202,0.18),transparent_35%)]" />

              <MotionDiv
                className="absolute left-5 top-5 rounded-full border border-[#73A5CA]/18 bg-[rgba(255,253,223,0.95)] px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2] shadow-[0_8px_20px_rgba(28,23,18,0.08)] backdrop-blur-md"
                variants={itemReveal}
              >
                Premium delivery
              </MotionDiv>

              <MotionDiv
                className="absolute bottom-5 left-5 right-5 rounded-[28px] border border-[#73A5CA]/14 bg-[rgba(255,253,223,0.95)] p-5 shadow-[0_10px_28px_rgba(28,23,18,0.08)] backdrop-blur-xl sm:right-auto sm:max-w-lg"
                variants={itemReveal}
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#5d8fb2]">
                  <Wrench size={15} className="text-[#E87F24]" />
                  {visual?.badge ?? 'Turnkey, design, planning, management'}
                </div>
                <p className="mt-3 text-sm leading-6 text-[#6e6256]">
                  {visual?.copy ?? 'A service page built like a studio presentation, with images, rhythm, and a clearer sense of how the pieces come together.'}
                </p>
              </MotionDiv>

              <MotionDiv
                className="absolute right-5 top-1/2 hidden w-[220px] -translate-y-1/2 rounded-[26px] border border-[#73A5CA]/14 bg-[rgba(255,253,223,0.95)] p-4 shadow-[0_10px_28px_rgba(28,23,18,0.08)] backdrop-blur-xl lg:block"
                variants={itemReveal}
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="text-[11px] uppercase tracking-[0.28em] text-[#5d8fb2]">{visual?.title ?? 'Design rhythm'}</div>
                <p className="mt-3 text-sm leading-6 text-[#6e6256]">
                  Warm materials, clear sequencing, and a stronger visual hierarchy.
                </p>
              </MotionDiv>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>

      <section className="cms-section-surface relative overflow-hidden py-10 sm:py-16" style={sectionStyleVars(sectionSettings.intro)}>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(115,165,202,0.05),transparent_18%,transparent_82%,rgba(232,127,36,0.05))]" />
        <div className="relative mx-auto w-full max-w-[1800px] px-6 md:px-10 lg:px-16">
          <MotionDiv className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between" variants={itemReveal}>
            <div>
              <span className="inline-flex rounded-full border border-[#73A5CA]/18 bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2]">
                Service catalogue
              </span>
              <h2 className="mt-5 text-[clamp(2.2rem,4vw,4.8rem)] font-black leading-[0.9] tracking-[-0.05em] text-[#1c1712]">
                {intro?.title ?? 'Five core tracks, each with its own visual mood.'}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[#6e6256]">
              {intro?.copy ?? 'Each service panel pairs a full-bleed image with focused copy so the page feels more like a premium portfolio than a standard services list.'}
            </p>
          </MotionDiv>

          <div className="space-y-8">
            {serviceList.map((service, index) => {
              const reversed = index % 2 === 1
              return (
                <MotionDiv
                  key={service.title}
                  className="group grid overflow-hidden rounded-[36px] border border-[#73A5CA]/14 bg-white/84 shadow-[0_20px_70px_rgba(28,23,18,0.08)] lg:grid-cols-2"
                  variants={itemReveal}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  <MotionDiv
                    className={`relative min-h-[340px] overflow-hidden ${reversed ? 'lg:order-2' : ''}`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(255,253,223,0.12), rgba(28,23,18,0.22)), url('${service.image}')`,
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.accent}`} />

                    <div className="absolute left-5 top-5 rounded-full border border-[#73A5CA]/18 bg-[rgba(255,253,223,0.95)] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#5d8fb2] shadow-[0_8px_20px_rgba(28,23,18,0.08)] backdrop-blur-md">
                      {service.kicker}
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                      {service.bullets.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#73A5CA]/14 bg-[rgba(255,253,223,0.96)] px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-[#1c1712] shadow-[0_8px_18px_rgba(28,23,18,0.08)] backdrop-blur-md"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </MotionDiv>

                  <div className="flex flex-col justify-between p-7 sm:p-8 md:p-10 lg:p-12">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E87F24]/14 text-[#E87F24]">
                          <service.icon size={22} />
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2]">
                          Service {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="mt-5 max-w-2xl text-[clamp(2rem,3vw,3.6rem)] font-black leading-[0.92] tracking-[-0.04em] text-[#1c1712]">
                        {service.title}
                      </h3>
                      <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6e6256] sm:text-base">
                        {service.summary}
                      </p>

                      <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {service.details.map((detail) => (
                          <div
                            key={detail}
                            className="flex items-start gap-3 rounded-[22px] border border-[#73A5CA]/10 bg-[#FEFDDF] p-4"
                          >
                            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#FFC81E]" />
                            <p className="text-sm leading-6 text-[#6e6256]">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <MotionA
                      href={`/services/${service.slug}`}
                      className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-[#73A5CA]/14 bg-white/78 px-5 py-3 text-sm font-semibold text-[#1c1712] transition-colors hover:border-[#E87F24]/25 hover:text-[#E87F24]"
                      whileHover={{ x: 4 }}
                    >
                      View details
                      <ArrowRight size={15} />
                    </MotionA>
                  </div>
                </MotionDiv>
              )
            })}
          </div>
        </div>
      </section>

      <FooterClient settings={layoutSettings.footer} />
    </main>
  )
}
