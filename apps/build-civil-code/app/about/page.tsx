import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { ArrowRight, Building2, Clock3, Handshake, HardHat, MapPin, Ruler, ShieldCheck, Sparkles, Users } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TeamSection from '@/components/TeamSection'
import { sectionStyleVars } from '@buildcivil/cms/section-style'
import { cleanSeoText } from '@buildcivil/cms/seo'
import { getSitePage, type AboutPageContent } from '@buildcivil/cms/site-pages'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage('about')
  const content = page.content as Partial<AboutPageContent>
  const seo = content.seo
  const title = cleanSeoText(seo?.title, 'About BuildCivil Constructions')
  const description = cleanSeoText(
    seo?.description,
    'Learn about BuildCivil Constructions, our story, values, process, and commitment to premium construction and architecture.',
  )
  return {
    title,
    description,
    alternates: {
      canonical: '/about',
    },
    openGraph: {
      title,
      description,
      images: seo?.ogImage || page.hero_image ? [{ url: seo?.ogImage || page.hero_image }] : undefined,
    },
  }
}

const principles = [
  {
    icon: ShieldCheck,
    title: 'Quality First',
    copy:
      'We choose durable materials, work with disciplined teams, and hold every detail to a higher standard.',
  },
  {
    icon: Ruler,
    title: 'Precise Execution',
    copy:
      'From planning to handover, each phase is managed with clarity, structure, and tight coordination.',
  },
  {
    icon: Handshake,
    title: 'Transparent Delivery',
    copy:
      'We keep communication open so clients always understand the progress, milestones, and next steps.',
  },
  {
    icon: Clock3,
    title: 'On-Time Commitment',
    copy:
      'Reliable timelines and steady site supervision help us deliver without compromising the design intent.',
  },
]

const journey = [
  {
    step: '01',
    title: 'Define',
    copy: 'We begin with your goals, budget, site conditions, and the way you want the space to live.',
  },
  {
    step: '02',
    title: 'Design',
    copy: 'Architectural direction, layout planning, and technical clarity shape the full concept.',
  },
  {
    step: '03',
    title: 'Build',
    copy: 'With plans approved, our site teams move carefully through construction with clear reporting.',
  },
  {
    step: '04',
    title: 'Deliver',
    copy: 'We finish with a detailed handover, final checks, and support for a smooth occupation.',
  },
]

const stats = [
  { value: '12+', label: 'Years of experience' },
  { value: '110+', label: 'Projects completed' },
  { value: '4', label: 'Core delivery stages' },
  { value: '3', label: 'Primary markets served' },
]

const principleIconMap = {
  shield: ShieldCheck,
  ruler: Ruler,
  handshake: Handshake,
  clock: Clock3,
}

export default async function AboutPage() {
  const page = await getSitePage('about')
  const content = page.content as Partial<AboutPageContent>
  const editablePrinciples = content.principles?.length ? content.principles : principles.map((item) => ({ ...item, icon: 'shield' }))
  const editableStats = content.stats?.length ? content.stats : stats
  const editableJourney = content.journey?.length ? content.journey : journey
  const sectionSettings = content.sectionSettings ?? {}

  return (
    <main className="public-site cms-section-surface">
      <Navbar />

      <section className="cms-section-surface relative overflow-hidden pt-28 sm:pt-32" style={sectionStyleVars(sectionSettings.hero)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.12),transparent_30%)]" />
        <div className="cms-section-fill absolute inset-0" />

        <div className="relative mx-auto grid min-h-[82vh] w-full max-w-[1800px] gap-10 px-6 pb-16 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:pb-20">
          <div className="flex flex-col justify-end">
            <span className="inline-flex w-fit rounded-full border border-[#73A5CA]/20 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2]">
              {page.hero_label}
            </span>
            <h1 className="cms-hero-title mt-6 max-w-3xl text-[clamp(3rem,8vw,8.2rem)] font-black leading-[0.88] tracking-[-0.05em]">
              {content.hero?.title ?? page.hero_title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6e6256] sm:text-lg">
              {content.hero?.copy ?? page.hero_copy}
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
                href="/projects"
                className="inline-flex items-center gap-3 rounded-full border border-[#73A5CA]/20 px-6 py-3.5 text-sm font-semibold text-[#1c1712] transition-colors hover:border-[#E87F24]/25 hover:text-[#E87F24]"
              >
                View Projects
              </a>
            </div>
          </div>

          <div className="relative flex items-end">
            <div className="relative min-h-[520px] w-full overflow-hidden rounded-[36px] bg-[#1c1712] shadow-[0_30px_90px_rgba(28,23,18,0.18)] sm:min-h-[620px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    `linear-gradient(180deg, rgba(28,23,18,0.18), rgba(28,23,18,0.62)), url('${content.hero?.image ?? page.hero_image}')`,
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,30,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(115,165,202,0.18),transparent_35%)]" />

              <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#FEFDDF] backdrop-blur-md">
                Premium delivery
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-[28px] border border-white/18 bg-[#FEFDDF]/90 p-5 backdrop-blur-xl sm:right-auto sm:max-w-lg">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#5d8fb2]">
                  <span className="h-2 w-2 rounded-full bg-[#E87F24]" />
                  Architecture, structure, interiors
                </div>
                <p className="mt-3 text-sm leading-6 text-[#6e6256]">
                  Every project is shaped to feel thoughtful, practical, and built to last.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cms-section-surface section-pad relative overflow-hidden" style={sectionStyleVars(sectionSettings.story)}>
        <div className="cms-section-fill absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.08),transparent_34%)]" />
        <div className="relative mx-auto w-full max-w-[1800px] px-6 md:px-10 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
            <span className="inline-flex rounded-full border border-[#73A5CA]/20 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2]">
                {content.story?.title ? 'Our story' : 'Our story'}
              </span>
              <h2 className="mt-5 text-[clamp(2.3rem,4.5vw,5rem)] font-black leading-[0.92] tracking-[-0.04em]">
                {content.story?.title ?? 'Built on clarity, care, and craftsmanship.'}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#6e6256]">
                {content.story?.copy ?? 'Our approach is simple: understand the space, plan it well, build it carefully, and hand it over with confidence. That means more than construction alone. It means aligning people, materials, timelines, and details into one steady process.'}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {editablePrinciples.map((item) => {
                  const Icon = principleIconMap[item.icon as keyof typeof principleIconMap] ?? ShieldCheck
                  return (
                  <div
                    key={item.title}
                    className="glass-card rounded-[28px] border border-[#73A5CA]/12 p-5 shadow-[0_18px_40px_rgba(28,23,18,0.08)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#73A5CA]/14">
                      <Icon className="text-[#E87F24]" size={18} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[#1c1712]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#6e6256]">{item.copy}</p>
                  </div>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {editableStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[30px] border border-[#73A5CA]/12 bg-white/70 p-6 shadow-[0_16px_36px_rgba(28,23,18,0.08)]"
                >
                  <div className="text-4xl font-black text-[#1c1712] sm:text-5xl">{stat.value}</div>
                  <div className="mt-3 text-sm leading-6 text-[#6e6256]">{stat.label}</div>
                </div>
              ))}

              <div className="sm:col-span-2 rounded-[30px] border border-[#FFC81E]/28 bg-[linear-gradient(135deg,rgba(115,165,202,0.14),rgba(255,255,255,0.7))] p-6 shadow-[0_16px_36px_rgba(28,23,18,0.08)]">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.26em] text-[#5d8fb2]">
                  <MapPin size={15} className="text-[#E87F24]" />
                  Operating with care
                </div>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#6e6256]">
                  From residential builds to commercial architecture, we deliver across local and
                  regional project needs with the same attention to detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="cms-section-surface section-pad relative overflow-hidden"
        style={{
          '--section-bg': '#1c1712',
          '--section-text': '#FEFDDF',
          ...sectionStyleVars(sectionSettings.process),
        } as CSSProperties}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(115,165,202,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.12),transparent_30%)]" />
        <div className="relative mx-auto w-full max-w-[1800px] px-6 md:px-10 lg:px-16">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#FEFDDF]/78">
                Our process
              </span>
              <h2 className="mt-5 text-[clamp(2.3rem,4.5vw,4.8rem)] font-black leading-[0.92] tracking-[-0.04em]">
                {content.process?.title ?? 'A steady path from concept to handover.'}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[#FEFDDF]/72">
              {content.process?.copy ?? 'We keep the journey disciplined and visible at every stage, so the build feels organized and the final result feels premium.'}
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            {editableJourney.map((item) => (
              <div
                key={item.step}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.16)]"
              >
                <div className="text-sm font-medium text-[#FFC81E]">{item.step}</div>
                <h3 className="mt-4 text-2xl font-semibold text-[#FEFDDF]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#FEFDDF]/72">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={sectionStyleVars(sectionSettings.team)}>
        <TeamSection content={content.team} />
      </div>

      <section className="cms-section-surface section-pad relative overflow-hidden" style={sectionStyleVars(sectionSettings.cta)}>
        <div className="cms-section-fill absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1800px] px-6 md:px-10 lg:px-16">
                <div className="rounded-[34px] bg-[linear-gradient(135deg,rgba(115,165,202,0.18),rgba(255,255,255,0.9))] p-6 shadow-[0_20px_48px_rgba(28,23,18,0.1)] sm:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-[clamp(2rem,4vw,4.2rem)] font-black leading-[0.92] tracking-[-0.04em] text-[#1c1712]">
                  {content.cta?.title ?? 'Ready to build with a team that keeps things calm and clear?'}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6e6256]">
                  {content.cta?.copy ?? 'Let’s talk about your site, your scope, and the kind of finish you want to see every day.'}
                </p>
              </div>
              <a
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-3 px-6 py-3.5 text-sm font-semibold transition-transform"
              >
                Start the Conversation
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
