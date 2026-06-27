import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ShowcaseSection from '@/components/ShowcaseSection'
import ProcessSection from '@/components/ProcessSection'
import ProjectsSection from '@/components/ProjectsSection'
import PlansSection from '@/components/PlansSection'
import ServicesSection from '@/components/ServicesSection'
import AboutSection from '@/components/AboutSection'
import FAQSection from '@/components/FAQSection'
import TeamSection from '@/components/TeamSection'
import Footer from '@/components/Footer'
import { getFormDefinition } from '@/lib/form-definitions'
import { getConstructionPackagesFromCMS } from '@/lib/packages'
import { getProjectCatalogFromCMS } from '@/lib/projects'
import { sectionStyleVars } from '@/lib/section-style'
import { cleanSeoText } from '@/lib/seo'
import { getSitePage, type HomePageContent } from '@/lib/site-pages'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage('home')
  const content = page.content as Partial<HomePageContent>
  const seo = content.seo
  const title = cleanSeoText(seo?.title, 'BuildCivil Constructions - Premium Construction & Architecture')
  const description = cleanSeoText(
    seo?.description,
    'BuildCivil delivers premium construction services from architecture to interiors with curated residential and commercial work.',
  )
  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      images: seo?.ogImage || page.hero_image ? [{ url: seo?.ogImage || page.hero_image }] : undefined,
    },
  }
}

export default async function Home() {
  const [page, packages, projects, serviceForm, packageQuoteForm] = await Promise.all([
    getSitePage('home'),
    getConstructionPackagesFromCMS(),
    getProjectCatalogFromCMS(),
    getFormDefinition('service_enquiry'),
    getFormDefinition('package_quote'),
  ])
  const content = page.content as Partial<HomePageContent>
  const visibility = content.sectionVisibility ?? {}
  const isVisible = (section: keyof NonNullable<HomePageContent['sectionVisibility']>, defaultVisible = true) =>
    visibility[section] ?? defaultVisible
  const SectionWrap = ({ name, children }: { name: string; children: ReactNode }) => (
    <div style={sectionStyleVars(content.sectionSettings?.[name])}>
      <div className="section-divider" />
      {children}
    </div>
  )

  return (
    <main className="public-site">
      <Navbar />
      {isVisible('hero') ? <div style={sectionStyleVars(content.sectionSettings?.hero)}><HeroSection content={content.hero} formDefinition={serviceForm} /></div> : null}
      {isVisible('about') ? <SectionWrap name="about"><AboutSection content={content.about} /></SectionWrap> : null}
      {isVisible('showcase') ? <SectionWrap name="showcase"><ShowcaseSection content={content.showcase} projects={projects} /></SectionWrap> : null}
      {isVisible('process') ? <SectionWrap name="process"><ProcessSection content={content.process} /></SectionWrap> : null}
      {isVisible('projects') ? <SectionWrap name="projects"><ProjectsSection content={content.projects} /></SectionWrap> : null}
      {isVisible('plans') ? <SectionWrap name="plans"><PlansSection packages={packages} formDefinition={packageQuoteForm} /></SectionWrap> : null}
      {isVisible('services') ? <SectionWrap name="services"><ServicesSection content={content.services} /></SectionWrap> : null}
      {isVisible('faq') ? <SectionWrap name="faq"><FAQSection content={content.faq} /></SectionWrap> : null}
      {isVisible('team', false) ? <SectionWrap name="team"><TeamSection content={content.team} /></SectionWrap> : null}
      <Footer />
    </main>
  )
}
