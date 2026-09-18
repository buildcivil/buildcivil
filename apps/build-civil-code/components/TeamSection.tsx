'use client'

import { motion } from 'framer-motion'
import { itemReveal, sectionReveal } from './motion'
import type { HomePageContent } from '@buildcivil/cms/site-pages'

const MotionDiv = motion.div
const MotionArticle = motion.article

type TeamSectionProps = {
  content?: Partial<HomePageContent['team']>
}

const defaultTeam = [
  {
    name: 'Aarav Mehta',
    role: 'Principal Architect',
    experience: '14 years',
    specialty: 'Concept planning, elevations, and premium residential design.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Priya Shah',
    role: 'Design Lead',
    experience: '11 years',
    specialty: 'Interior flow, material palettes, and client-first detailing.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Rohan Kapoor',
    role: 'Project Director',
    experience: '16 years',
    specialty: 'Site coordination, milestones, and quality assurance.',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Sara Fernandes',
    role: 'Interior Specialist',
    experience: '9 years',
    specialty: 'Warm finishes, furniture planning, and spatial comfort.',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Arjun Iyer',
    role: 'Site Engineer',
    experience: '10 years',
    specialty: 'On-site execution, technical checks, and finishing accuracy.',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop&sat=-20',
  },
  {
    name: 'Naina Bansal',
    role: 'Quantity Surveyor',
    experience: '8 years',
    specialty: 'Budget control, estimates, and clear material planning.',
    image:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Kabir Sethi',
    role: 'Structural Consultant',
    experience: '13 years',
    specialty: 'Structural coordination, stability, and safe detailing.',
    image:
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Mira Iqbal',
    role: 'Client Relations',
    experience: '7 years',
    specialty: 'Communication, updates, and smooth handover support.',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
  },
]

export default function TeamSection({ content }: TeamSectionProps) {
  const team = content?.items?.length ? content.items : defaultTeam
  const kicker = content?.kicker ?? 'Meet our team'
  const title = content?.title ?? 'We are a team.'
  const accentTitle = content?.accentTitle ?? 'We love what we do. Simple as that.'
  const copy =
    content?.copy ??
    'The people behind BuildCivil bring design thinking, site discipline, and client care together so every project feels calm, coordinated, and premium.'

  return (
    <MotionDiv
      className="cms-section-surface section-pad relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={sectionReveal}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.08),transparent_34%)]" />
      <div className="relative mx-auto w-full max-w-[1800px] px-6 md:px-10 lg:px-16">
        <MotionDiv className="max-w-3xl" variants={itemReveal}>
          <span className="inline-flex rounded-full border border-[#73A5CA]/20 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#5d8fb2]">
            {kicker}
          </span>
          <h2 className="mt-5 text-[clamp(2.3rem,4.5vw,5rem)] font-black leading-[0.92] tracking-[-0.04em]">
            {title}
            <span className="block text-[#E87F24]">{accentTitle}</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#6e6256]">
            {copy}
          </p>
        </MotionDiv>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {team.map((member) => (
            <MotionArticle
              key={member.name}
              className="group h-[340px] sm:h-[360px] [perspective:1200px]"
              variants={itemReveal}
            >
              <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
                <div className="absolute inset-0 overflow-hidden rounded-[30px] border border-[#73A5CA]/12 bg-[#1c1712] shadow-[0_18px_36px_rgba(28,23,18,0.08)] [backface-visibility:hidden]">
                  <div
                    className="absolute inset-0 bg-cover bg-center grayscale transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(28,23,18,0.12), rgba(28,23,18,0.38)), url('${member.image}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,23,18,0.05),rgba(28,23,18,0.42))]" />
                  <div className="absolute inset-0 flex items-end p-5">
                    <div className="rounded-2xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-md">
                      <div className="mt-2 text-lg font-semibold text-[#FEFDDF]">{member.name}</div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center rounded-[30px] border border-[#73A5CA]/12 bg-[linear-gradient(135deg,rgba(254,253,223,0.98),rgba(255,255,255,0.92))] p-6 shadow-[0_18px_36px_rgba(28,23,18,0.08)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] uppercase tracking-[0.28em] text-[#5d8fb2]">BuildCivil team</span>
                      <span className="rounded-full border border-[#E87F24]/20 bg-[#E87F24]/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#E87F24]">
                        {member.experience}
                      </span>
                    </div>
                    <h3 className="mt-6 text-2xl font-black leading-tight text-[#1c1712]">{member.name}</h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#E87F24]">
                      {member.role}
                    </p>
                    <p className="mt-5 text-sm leading-6 text-[#6e6256]">{member.specialty}</p>
                    <div className="mt-6 h-px w-full bg-gradient-to-r from-[#73A5CA]/30 via-[#FFC81E]/25 to-transparent" />
                    <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[#5d8fb2]">
                      Crafting every project with care
                    </p>
                  </div>
                </div>
              </div>
            </MotionArticle>
          ))}
        </div>
      </div>
    </MotionDiv>
  )
}
