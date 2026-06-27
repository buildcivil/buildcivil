'use client'

import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react'

type GuideSection = {
  title: string
  affects: string
  steps: string[]
  note?: string
}

const guideSections: GuideSection[] = [
  {
    title: 'Overview',
    affects: 'Your dashboard starting point.',
    steps: [
      'Use the cards to jump into projects, services, packages, leads, and page editors.',
      'Check Data Status when something looks empty; it helps separate missing data from connection issues.',
      'Use Refresh dashboard after a save if counts or recent leads do not update immediately.',
    ],
  },
  {
    title: 'Home, About, Services, Projects, and Contact Editors',
    affects: 'Main public website pages.',
    steps: [
      'Open the page editor from the Pages group.',
      'Edit hero heading, hero text, images, cards, FAQ, process, or page-specific blocks.',
      'Use section visibility and style controls carefully; hidden sections disappear from the public page.',
      'Save the page, then use Publish refresh if the public page still shows old content.',
    ],
    note: 'Page editors control page-level sections. Project and service detail pages are controlled from their libraries.',
  },
  {
    title: 'Project Library',
    affects: 'Project cards, project listing, and project detail pages.',
    steps: [
      'Create a new project with slug, title, category, image, description, and published status.',
      'Use Upload project image or Choose existing image to attach images from Supabase Storage.',
      'Edit hero title, overview, stats, process, gallery, and SEO fields for detail pages.',
      'Use Select multiple images in the gallery area to add several project detail images at once.',
      'Delete only test or unwanted projects; deleted projects are removed from the public listing after refresh.',
    ],
  },
  {
    title: 'Service Library',
    affects: 'Service cards, service listing, and service detail pages.',
    steps: [
      'Create or edit service title, slug, icon, image, intro, bullets, details, stats, process, and gallery.',
      'Use Select multiple images in the gallery area to add several service detail images at once.',
      'Keep published off while drafting if the service should not be visible yet.',
      'Save the service and verify the public services page plus the service detail URL.',
    ],
  },
  {
    title: 'Package Library',
    affects: 'Construction package cards on the homepage.',
    steps: [
      'Add or edit package name, pricing, label, description, features, materials, and published status.',
      'Use sort order to control display order.',
      'After deleting a package, run Publish refresh if the homepage appears cached.',
    ],
  },
  {
    title: 'Media Library',
    affects: 'Images and videos used across the CMS.',
    steps: [
      'Upload images or videos with clear folder names such as home, projects, services, logos, or team.',
      'Always add alt text for images so SEO and accessibility stay strong.',
      'Copy URLs or use single-image and multi-image pickers inside page, project, service, and brand editors.',
    ],
    note: 'Uploads keep the original file quality. Large original images can make pages heavier, so choose files responsibly.',
  },
  {
    title: 'Lead Inboxes',
    affects: 'Customer inquiries submitted through public forms.',
    steps: [
      'Contact Messages come from the Contact page form.',
      'Service Enquiries come from the homepage/hero service enquiry form.',
      'Plan Quotes come from construction package quote forms.',
      'Newsletter stores footer newsletter signups.',
      'Use status updates to track follow-up progress and delete only spam or test submissions.',
    ],
  },
  {
    title: 'Policy Pages',
    affects: 'Root URLs like /privacy-policy and optional header/footer policy links.',
    steps: [
      'Create a title, slug, summary, content, SEO title, and SEO description.',
      'Publish the policy to make it visible on the website.',
      'Toggle header/footer visibility if the policy should appear in navigation.',
    ],
  },
  {
    title: 'SEO Center and Google Setup',
    affects: 'Search appearance, social previews, analytics, and verification tags.',
    steps: [
      'Use SEO Center to generate or apply page metadata suggestions.',
      'Use Google Setup for Analytics Measurement ID, Tag Manager ID, Search Console verification, and domain details.',
      'After saving SEO or Google settings, verify page source and Search Console manually.',
    ],
  },
  {
    title: 'Logos, Brand, Theme, Navigation, and Forms',
    affects: 'Global design, header/footer links, logos, favicon, and public form labels.',
    steps: [
      'Use Logos & Brand for header logo, footer logo, favicon, social image, and logo sizing.',
      'Use Theme Studio for public button colors, hover colors, fonts, and site-wide style controls.',
      'Use Navigation to add, hide, reorder, or delete header/footer links.',
      'Use Forms & Fields to edit public form labels, placeholders, options, and success/error text.',
    ],
  },
  {
    title: 'Publish Refresh',
    affects: 'Public cache updates after admin changes.',
    steps: [
      'Use Publish refresh after important content changes, deletes, SEO updates, or navigation changes.',
      'If a public page still looks old, refresh the browser and confirm you are viewing the latest deployment/domain.',
    ],
  },
]

const quickRules = [
  'Keep slugs lowercase with hyphens, for example courtyard-residence.',
  'Use published=false while drafting new projects, services, packages, or policies.',
  'Do not delete real leads unless they are spam or test entries.',
  'Use real images and meaningful alt text before launch.',
  'Run Publish refresh after public-facing saves if the frontend appears stale.',
]

export default function AdminHelpGuidePanel() {
  return (
    <div className="mt-6 space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-white/8 bg-[#171719] shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.75fr_1.25fr] lg:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D8FF6A]/20 bg-[#D8FF6A]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#D8FF6A]">
              <BookOpen size={14} />
              Admin guide
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
              How to manage the BuildCivil website.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/55">
              Use this guide when adding content, handling customer inquiries, updating brand settings, or refreshing the public website after edits.
            </p>
          </div>
          <div className="rounded-[24px] border border-[#FFC81E]/20 bg-[#FFC81E]/8 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-[#FFC81E]" />
              <div>
                <h3 className="text-lg font-black text-white">Safe editing rules</h3>
                <div className="mt-4 grid gap-3">
                  {quickRules.map((rule) => (
                    <div key={rule} className="flex items-start gap-3 text-sm leading-6 text-white/68">
                      <CheckCircle2 size={16} className="mt-1 shrink-0 text-[#D8FF6A]" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {guideSections.map((section, index) => (
          <article key={section.title} className="rounded-[26px] border border-white/8 bg-[#171719] p-5 shadow-[0_14px_40px_rgba(0,0,0,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/34">
                  Step {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-2 text-xl font-black tracking-[-0.03em] text-white">{section.title}</h3>
              </div>
              <ArrowRight size={18} className="mt-1 shrink-0 text-[#D8FF6A]" />
            </div>
            <p className="mt-3 rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3 text-sm text-white/58">
              <span className="font-semibold text-white/78">Affects:</span> {section.affects}
            </p>
            <ol className="mt-4 space-y-3">
              {section.steps.map((step) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-white/62">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E87F24]" />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            {section.note ? (
              <p className="mt-4 rounded-2xl border border-[#73A5CA]/14 bg-[#73A5CA]/8 px-4 py-3 text-xs leading-5 text-white/52">
                {section.note}
              </p>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  )
}
