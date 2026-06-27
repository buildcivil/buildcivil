'use client'

import { CheckCircle, Zap, Shield, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { itemReveal, sectionReveal } from './motion'
import type { HomePageContent } from '@/lib/site-pages'

const MotionDiv = motion.div

const iconMap = {
  zap: Zap,
  shield: Shield,
  clock: Clock,
  check: CheckCircle,
}

const defaultPillars = [
  { icon: 'zap' as const, label: 'Smart Planning', desc: 'Clear cost estimation, efficient coordination, and better decisions through careful project planning.' },
  { icon: 'shield' as const, label: 'Quality Guaranteed', desc: 'Only certified materials and skilled professionals on every site.' },
  { icon: 'clock' as const, label: 'On-Time Delivery', desc: 'Every project delivered on schedule — no excuses, no delays.' },
  { icon: 'check' as const, label: 'Full Transparency', desc: 'Real-time updates, clear pricing, and zero hidden costs.' },
]

type AboutSectionProps = {
  content?: Partial<HomePageContent['about']>
}

export default function AboutSection({ content }: AboutSectionProps) {
  const title = content?.title ?? 'Why BuildCivil is Different'
  const copy =
    content?.copy ??
    'We combine modern construction practices with technology-driven planning to ensure every project is delivered with precision, transparency, and long-term reliability. Our approach focuses on delivering efficient, high-quality construction through smart processes.'
  const pillars = content?.pillars?.length ? content.pillars : defaultPillars
  const sustainability = content?.sustainability ?? {
    icon: '🌱',
    title: 'Sustainability First',
    copy:
      'We focus on creating efficient, future-ready spaces through smart planning, quality construction, and responsible practices — ensuring long-lasting, sustainable outcomes for every project.',
  }

  return (
    <MotionDiv
      id="about"
      className="cms-section-surface noise-overlay relative overflow-hidden py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={sectionReveal}
    >
      <div className="cms-section-fill absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.11),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.35),rgba(254,253,223,0.72))]" />
      <div className="absolute inset-0 grid-bg opacity-[0.05]" />
      <div className="absolute top-1/2 left-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#73A5CA]/10 blur-[120px] pointer-events-none" />
      <div className="absolute right-[-80px] top-[-80px] h-[280px] w-[280px] rounded-full bg-[#E87F24]/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Left visual */}
          <MotionDiv className="relative" variants={itemReveal}>
            <div className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#E87F24]/14 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#73A5CA]/12 rounded-full blur-2xl" />

              {/* Big number */}
              <div className="relative z-10">
                <div className="stat-number select-none text-[clamp(4.5rem,18vw,7.5rem)] font-display font-black leading-none opacity-20 sm:text-[120px]">12</div>
                <div className="relative z-10 mt-[-24px] md:mt-[-40px]">
                  <h3 className="font-display mb-2 text-2xl font-black text-[#1c1712] sm:text-3xl">Years Of</h3>
                  <h3 className="font-display mb-6 text-2xl font-black gradient-text sm:text-3xl">Undefeated Success</h3>
                  <p className="mb-8 text-sm leading-relaxed text-[#6e6256]">
                    We combine years of construction experience with AI-enabled planning and
                    tech-driven execution to deliver smarter, faster, and more reliable home construction.
                    From structural work to complete interiors, BuildCivil ensures quality, transparency,
                    and on-time delivery — so you can build without stress.
                  </p>
                  <a href="/contact" className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                    Start Your Project →
                  </a>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <MotionDiv className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-[#E87F24]/10 p-5 sm:block" whileHover={{ y: -4, scale: 1.02 }}>
              <div className="stat-number text-4xl font-display font-black">110+</div>
              <div className="text-[#4c4337] text-xs mt-1">Projects Completed</div>
            </MotionDiv>
          </MotionDiv>

          {/* Right content */}
          <MotionDiv variants={itemReveal}>
            <div className="badge badge-orange mb-6">
              <span className="w-1.5 h-1.5 bg-[#E87F24] rounded-full" />
              Building Smarter. Delivering Better.
            </div>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-[#1c1712] mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-[#6e6256] leading-relaxed mb-10">
              {copy}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {pillars.map((pillar) => {
                const Icon = iconMap[pillar.icon ?? 'check'] ?? CheckCircle
                return (
                <MotionDiv
                  key={pillar.label}
                  className="glass-card rounded-2xl p-5 border border-[#73A5CA]/12 group hover:border-[#E87F24]/20 transition-all duration-300"
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <div className="w-10 h-10 bg-[#73A5CA]/14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#E87F24]/16 transition-colors">
                    <Icon className="text-[#73A5CA]" size={18} />
                  </div>
                  <h4 className="font-semibold text-[#1c1712] text-sm mb-2">{pillar.label}</h4>
                  <p className="text-[#6e6256] text-xs leading-relaxed">{pillar.desc}</p>
                </MotionDiv>
              )})}
            </div>

            {/* Sustainability highlight */}
            <MotionDiv className="mt-6 glass-orange rounded-2xl p-5" whileHover={{ y: -3 }}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{sustainability.icon ?? '🌱'}</div>
                <div>
                  <h4 className="text-header-700 font-semibold text-sm mb-1">{sustainability.title}</h4>
                  <p className="text-[#6e6256] text-xs leading-relaxed">
                    {sustainability.copy}
                  </p>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>
    </MotionDiv>
  )
}
