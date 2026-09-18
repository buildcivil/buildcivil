'use client'

import Link from 'next/link'
import { ArrowRight, Briefcase, HardHat, HeartHandshake, Mail, Sparkles, TrendingUp, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import NavbarClient from '@/components/NavbarClient'
import FooterClient from '@/components/FooterClient'
import { itemReveal, sectionReveal } from './motion'
import type { GlobalLayoutSettings } from '@buildcivil/cms/site-settings-defaults'

const MotionDiv = motion.div
const MotionSection = motion.section

const values = [
  {
    icon: HardHat,
    title: 'Hands-on craft',
    copy: 'We value people who take pride in getting the details right, on-site and in the office.',
  },
  {
    icon: TrendingUp,
    title: 'Real growth',
    copy: 'Every project is a chance to learn something new, take on more ownership, and grow your career.',
  },
  {
    icon: HeartHandshake,
    title: 'Team first',
    copy: 'We support each other across design, site execution, and client conversations, every single day.',
  },
  {
    icon: Users,
    title: 'Honest culture',
    copy: 'We keep communication direct and transparent, from planning meetings to the final handover.',
  },
]

const openRolesNote = {
  title: 'No open positions right now',
  copy: 'We are always happy to hear from talented people. Send us your profile and we will reach out when a role opens up that fits.',
}

type Props = {
  layoutSettings: GlobalLayoutSettings
}

export default function CareersPageClient({ layoutSettings }: Props) {
  return (
    <main className="public-site cms-section-surface">
      <NavbarClient settings={layoutSettings.header} />

      <MotionSection
        className="cms-section-surface relative overflow-hidden pt-28 sm:pt-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={sectionReveal}
      >
        <div className="absolute inset-0 bg-[#FEFDDF]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.12),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(115,165,202,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(232,127,36,0.08)_1px,transparent_1px)] [background-size:240px_240px] [mask-image:linear-gradient(180deg,transparent,black_14%,black_88%,transparent)]" />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-14 sm:px-6 md:px-10 lg:px-16">
          <MotionDiv className="inline-flex w-fit items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#4e7c9d] shadow-[0_12px_28px_rgba(28,23,18,0.06)]" variants={itemReveal}>
            <Briefcase size={12} className="text-[#E87F24]" />
            Careers
          </MotionDiv>
          <MotionDiv variants={itemReveal}>
            <h1 className="cms-hero-title mt-6 max-w-4xl text-[clamp(2.6rem,7.4vw,7.4rem)] font-black leading-[0.9] tracking-[-0.06em] text-[#1c1712]">
              Build your career with BuildCivil.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#53483d] sm:text-lg">
              We are a construction team that values craftsmanship, honesty, and steady growth. If that sounds like you, we would love to hear from you.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="mailto:careers@buildcivil.in"
                className="btn-primary inline-flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-transform"
              >
                <Mail size={16} />
                Email your profile
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full border border-[#73A5CA]/18 px-6 py-3.5 text-sm font-semibold text-[#1c1712] transition-colors hover:border-[#E87F24]/25 hover:text-[#E87F24]"
              >
                Contact us
              </Link>
            </div>
          </MotionDiv>
        </div>
      </MotionSection>

      <section className="cms-section-surface relative overflow-hidden py-10 sm:py-14 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.1),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.08),transparent_34%)]" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-6 md:px-10 lg:px-16">
          <span className="inline-flex rounded-full border border-[#73A5CA]/18 bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2] shadow-[0_10px_24px_rgba(28,23,18,0.05)]">
            Why BuildCivil
          </span>
          <h2 className="mt-5 max-w-2xl text-[clamp(1.9rem,3.6vw,3.6rem)] font-black leading-[0.96] tracking-[-0.04em] text-[#1c1712]">
            A team culture built around real construction values.
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <MotionDiv
                key={value.title}
                className="rounded-[26px] border border-[#73A5CA]/14 bg-white/90 p-6 shadow-[0_14px_38px_rgba(28,23,18,0.06)]"
                variants={itemReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEFDDF] text-[#E87F24]">
                  <value.icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-black tracking-[-0.02em] text-[#1c1712]">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#6e6256]">{value.copy}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      <section className="cms-section-surface relative overflow-hidden py-10 sm:py-14 lg:py-16">
        <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-6 md:px-10 lg:px-16">
          <MotionDiv
            className="overflow-hidden rounded-[36px] border border-[#73A5CA]/14 bg-white shadow-[0_24px_70px_rgba(28,23,18,0.1)]"
            variants={itemReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
              <div className="p-8 sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#73A5CA]/18 bg-[#FEFDDF] px-3 py-1.5 text-[11px] uppercase tracking-[0.26em] text-[#5d8fb2]">
                  <Sparkles size={12} className="text-[#E87F24]" />
                  Open roles
                </div>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.03em] text-[#1c1712]">{openRolesNote.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#6e6256] sm:text-base">{openRolesNote.copy}</p>
                <a
                  href="mailto:careers@buildcivil.in"
                  className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[#E87F24]"
                >
                  careers@buildcivil.in
                  <ArrowRight size={15} />
                </a>
              </div>
              <div className="relative flex flex-col justify-center gap-4 border-t border-[#73A5CA]/12 bg-[#FEFDDF] p-8 sm:p-10 lg:border-l lg:border-t-0">
                <div className="text-[11px] uppercase tracking-[0.26em] text-[#5d8fb2]">Where we hire for</div>
                {['Site engineering & supervision', 'Project management', 'Architecture & interior design', 'Business development & client relations'].map((role) => (
                  <div key={role} className="flex items-center gap-3 rounded-[18px] border border-[#73A5CA]/14 bg-white px-4 py-3 text-sm font-medium text-[#1c1712]">
                    <Briefcase size={16} className="text-[#E87F24]" />
                    {role}
                  </div>
                ))}
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      <FooterClient settings={layoutSettings.footer} />
    </main>
  )
}
