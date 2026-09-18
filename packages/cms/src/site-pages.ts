import { isSupabaseConfigured, supabaseRequest } from './supabase-admin'

export type SitePageSlug = 'home' | 'about' | 'services' | 'projects' | 'contact' | 'renovaite'

export type SitePageRecord = {
  id: string
  slug: SitePageSlug
  title: string
  hero_label: string
  hero_title: string
  hero_copy: string
  hero_image: string
  content: Record<string, unknown>
  published: boolean
  sort_order: number
}

export type PageSeoContent = {
  title?: string
  description?: string
  ogImage?: string
}

export type HomeServiceOption = string

export type HomeAboutPillar = {
  icon?: 'zap' | 'shield' | 'clock' | 'check'
  label: string
  desc: string
}

export type HomeShowcaseSlide = {
  projectSlug?: string
  title: string
  label: string
  image: string
  metric: string
  metricLabel: string
  description: string
}

export type HomeProcessStep = {
  id: string
  title: string
  copy: string
}

export type HomeProjectTile =
  | {
      type: 'stat'
      title: string
      copy: string
      value: string
      note: string
    }
  | {
      type: 'image'
      image: string
      alt?: string
    }

export type HomeServiceCard = {
  slug: string
  icon?: 'home' | 'palette' | 'refresh' | 'ruler' | 'briefcase'
  title: string
  description: string
  color?: string
  border?: string
  iconBg?: string
  iconColor?: string
}

export type HomeFAQItem = {
  q: string
  a: string
}

export type HomeTeamMember = {
  name: string
  role: string
  experience: string
  specialty: string
  image: string
}

export type HomePageContent = {
  sectionVisibility?: Partial<Record<'hero' | 'about' | 'showcase' | 'process' | 'projects' | 'plans' | 'services' | 'faq' | 'team', boolean>>
  sectionSettings?: Record<string, Record<string, unknown>>
  seo?: PageSeoContent
  hero: {
    label?: string
    title: string
    copy: string
    image: string
    imageAlt?: string
    ctaLabel?: string
    ctaHref?: string
    serviceOptions?: HomeServiceOption[]
  }
  about: {
    title: string
    copy: string
    pillars?: HomeAboutPillar[]
    sustainability?: { title: string; copy: string; icon?: string }
  }
  showcase: { title: string; copy: string; slides?: HomeShowcaseSlide[] }
  process: { title: string; copy: string; steps?: HomeProcessStep[] }
  projects: { title: string; copy: string; tiles?: HomeProjectTile[] }
  services: { title: string; copy: string; items?: HomeServiceCard[] }
  faq: {
    title: string
    copy: string
    items?: HomeFAQItem[]
    image?: string
    imageBadge?: string
    highlightTitle?: string
    highlightCopy?: string
  }
  team: {
    kicker: string
    title: string
    accentTitle: string
    copy: string
    items?: HomeTeamMember[]
  }
}

export type AboutPageContent = {
  seo?: PageSeoContent
  sectionSettings?: Record<string, Record<string, unknown>>
  hero: { label?: string; title: string; copy: string; image: string }
  story: { title: string; copy: string }
  principles?: Array<{ icon?: string; title: string; copy: string }>
  stats?: Array<{ value: string; label: string }>
  process: { title: string; copy: string }
  journey?: Array<{ step: string; title: string; copy: string }>
  cta: { title: string; copy: string }
  team?: HomePageContent['team']
}

export type ServicesPageContent = {
  seo?: PageSeoContent
  sectionSettings?: Record<string, Record<string, unknown>>
  hero: { label?: string; title: string; copy: string; image: string }
  intro: { title: string; copy: string }
  stats?: Array<{ value: string; label: string }>
  visual?: { badge?: string; title?: string; copy?: string }
  ctas?: { primaryLabel?: string; primaryHref?: string; secondaryLabel?: string; secondaryHref?: string }
}

export type ProjectsPageContent = {
  seo?: PageSeoContent
  sectionSettings?: Record<string, Record<string, unknown>>
  hero: { label?: string; title: string; copy: string; image: string }
  intro: { title: string; copy: string }
  categories?: string[]
  stats?: Array<{ value: string; label: string }>
  cta?: { title?: string; copy?: string; label?: string; href?: string }
}

export type ContactPageContent = {
  seo?: PageSeoContent
  sectionSettings?: Record<string, Record<string, unknown>>
  hero: { label?: string; title: string; copy: string }
  form: { title: string; copy: string }
  contactCards?: Array<{ icon?: 'phone' | 'mail' | 'map'; label: string; value: string }>
  officeHighlights?: Array<{ label: string; value: string }>
  location?: {
    label?: string
    title: string
    copy: string
    mapEmbedUrl: string
    detailTitle: string
    detailCopy: string
    email: string
    phone: string
  }
}

export type RenovaiteSliderItem = {
  title: string
  copy: string
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export type RenovaitePageContent = {
  seo?: PageSeoContent
  sectionSettings?: Record<string, Record<string, unknown>>
  hero: { label?: string; title: string; copy: string; image: string }
  slider: {
    label?: string
    title: string
    copy: string
    items: RenovaiteSliderItem[]
  }
  form: {
    label?: string
    title: string
    copy: string
    submitLabel?: string
    successMessage?: string
    sideImages?: string[]
    roomTypes?: Array<{ value: string; label: string }>
    designStyles?: Array<{ value: string; label: string }>
    designCounts?: Array<{ value: string; label: string }>
  }
  cta?: { title?: string; copy?: string; label?: string; href?: string }
}

type PageCatalogItem = Omit<SitePageRecord, 'id'>

type SiteSectionRow = {
  page_slug: string
  section_key: string
  title: string
  subtitle: string
  kicker: string
  copy: string
  image_url: string
  image_alt: string
  cta_label: string
  cta_href: string
  layout_preset: string
  background_color: string
  text_color: string
  visible: boolean
  sort_order: number
  style: Record<string, unknown>
  content: Record<string, unknown>
}

const homeContent = {
  hero: {
    title: 'Architecture that\nSpeaks Volume',
    copy:
      'Modern architecture is a design approach that emphasizes simplicity, functionality, and innovation.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2400&auto=format&fit=crop',
    serviceOptions: [
      'Turnkey Construction',
      'Interior & Exterior Design',
      'Renovation & Remodeling',
      'Architectural Planning',
      'Project Management',
      'Other',
    ],
  },
  about: {
    title: 'Why BuildCivil is Different',
    copy:
      'We combine modern construction practices with technology-driven planning to ensure every project is delivered with precision, transparency, and long-term reliability. Our approach focuses on delivering efficient, high-quality construction through smart processes.',
    pillars: [
      { icon: 'zap', label: 'Smart Planning', desc: 'Clear cost estimation, efficient coordination, and better decisions through careful project planning.' },
      { icon: 'shield', label: 'Quality Guaranteed', desc: 'Only certified materials and skilled professionals on every site.' },
      { icon: 'clock', label: 'On-Time Delivery', desc: 'Every project delivered on schedule — no excuses, no delays.' },
      { icon: 'check', label: 'Full Transparency', desc: 'Real-time updates, clear pricing, and zero hidden costs.' },
    ],
    sustainability: {
      icon: '🌱',
      title: 'Sustainability First',
      copy:
        'We focus on creating efficient, future-ready spaces through smart planning, quality construction, and responsible practices — ensuring long-lasting, sustainable outcomes for every project.',
    },
  },
  showcase: {
    title: 'We built 50+\narchitectural and residential projects',
    copy: 'A selected gallery of homes and commercial work shaped with calm rhythm and practical detailing.',
    slides: [
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
    ],
  },
  process: {
    title: 'How we move your project forward',
    copy: 'Every phase is coordinated to keep the build calm, visible, and premium from the first brief to handover.',
    steps: [
      {
        id: '01',
        title: 'Define',
        copy: 'We start by understanding scope, budget, timeline, and the kind of home or commercial space you want to build.',
      },
      {
        id: '02',
        title: 'Design',
        copy: 'Our team turns the brief into a clear plan with layouts, elevations, and a practical construction strategy.',
      },
      {
        id: '03',
        title: 'Build',
        copy: 'We execute the build with transparent updates, site supervision, and a steady focus on quality.',
      },
      {
        id: '04',
        title: 'Handover',
        copy: 'Once complete, we inspect, polish, and hand over the project ready for occupancy and long-term use.',
      },
    ],
  },
  projects: {
    title: 'Project stories that show the pace of our work',
    copy: 'Five selected projects, shaped with rhythm and construction clarity.',
    tiles: [
      {
        type: 'stat',
        title: 'Before - After',
        copy: 'We rework underused plots into calm, durable, and climate-aware homes.',
        value: '60%',
        note: 'designs better suited for sustainability',
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
      },
      {
        type: 'stat',
        title: 'Before - After',
        copy: 'Every layout is tuned for better circulation, light, and day-to-day comfort.',
        value: '210%',
        note: 'space efficiency uplift',
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1200&auto=format&fit=crop',
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1565321652749-f808b3eba663?q=80&w=1200&auto=format&fit=crop',
      },
      {
        type: 'stat',
        title: 'Before - After',
        copy: 'We bring unfinished spaces into refined homes with crisp detailing.',
        value: '310%',
        note: 'a calmer, warmer finish',
      },
      {
        type: 'image',
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
      },
      {
        type: 'stat',
        title: 'Before - After',
        copy: 'The result is a place that feels more open, more considered, and more personal.',
        value: '510%',
        note: 'long-term livability',
      },
    ],
  },
  services: {
    title: 'Comprehensive construction services with unmatched precision',
    copy: 'Each service is designed to work together, so your project feels organized and easy to follow.',
    items: [
      {
        slug: 'turnkey-construction',
        icon: 'home',
        title: 'Turnkey Construction',
        description: 'Complete end-to-end construction solutions from foundation to finishing, coordinated by one capable team.',
        color: 'from-header-500/16 to-highlight-500/10',
        border: 'border-header-500/18',
        iconBg: 'bg-header-500/12',
        iconColor: 'text-header-600',
      },
      {
        slug: 'interior-exterior-design',
        icon: 'palette',
        title: 'Interior & Exterior Design',
        description: 'Professional design services for both interior and exterior spaces, balanced for comfort, function, and style.',
        color: 'from-border-500/16 to-highlight-500/6',
        border: 'border-border-500/18',
        iconBg: 'bg-border-500/14',
        iconColor: 'text-border-600',
      },
      {
        slug: 'renovation-remodeling',
        icon: 'refresh',
        title: 'Renovation & Remodeling',
        description: 'Transform existing spaces with modern renovation solutions that improve layout, utility, and visual appeal.',
        color: 'from-highlight-600/18 to-header-500/6',
        border: 'border-highlight-600/20',
        iconBg: 'bg-highlight-500/14',
        iconColor: 'text-highlight-500',
      },
      {
        slug: 'architectural-planning',
        icon: 'ruler',
        title: 'Architectural Planning',
        description: 'Expert architectural planning and structural design services that shape a clear, buildable project vision.',
        color: 'from-border-400/14 to-header-500/5',
        border: 'border-border-400/18',
        iconBg: 'bg-border-400/14',
        iconColor: 'text-border-500',
      },
      {
        slug: 'project-management',
        icon: 'briefcase',
        title: 'Project Management',
        description: 'Professional project management and coordination services that keep your build organized, aligned, and on schedule.',
        color: 'from-border-500/16 to-highlight-500/8',
        border: 'border-border-500/18',
        iconBg: 'bg-border-500/14',
        iconColor: 'text-border-600',
      },
    ],
  },
  faq: {
    title: 'Answers that feel straightforward',
    copy: 'A calm visual backdrop helps the section feel premium while the FAQs stay easy to read.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop',
    imageBadge: 'Construction FAQ',
    highlightTitle: 'Answers that feel straightforward.',
    highlightCopy: 'A calm visual backdrop helps the section feel premium while the FAQs stay easy to read.',
    items: [
      {
        q: 'Do you handle the entire project from start to finish?',
        a: 'Yes, we handle everything from planning and design to final handover for a hassle-free experience. Our end-to-end service means you have a single point of contact throughout the entire process.',
      },
      {
        q: 'How is the project pricing determined?',
        a: 'Our pricing is transparent and based on project scope, materials, and design requirements. We provide a detailed cost breakdown before any work begins — no surprises, no hidden fees.',
      },
      {
        q: 'Do you use technology in your planning process?',
        a: 'We use practical digital tools for better coordination, cost estimation, and project tracking. The focus stays on clear planning, accurate execution, and reliable delivery.',
      },
      {
        q: 'What types of projects do you take on?',
        a: 'We handle residential homes, commercial spaces, government infrastructure, healthcare facilities, schools, and renovation projects. If it involves construction or design, we can help.',
      },
      {
        q: 'How long does a typical construction project take?',
        a: 'Timeline depends on the project scope and complexity. A standard residential home takes 8–12 months, while smaller renovation projects can be completed in 4–8 weeks. We always commit to a delivery date upfront.',
      },
    ],
  },
  team: {
    kicker: 'Meet our team',
    title: 'We are a team.',
    accentTitle: 'We love what we do. Simple as that.',
    copy:
      'The people behind BuildCivil bring design thinking, site discipline, and client care together so every project feels calm, coordinated, and premium.',
    items: [
      {
        name: 'Aarav Mehta',
        role: 'Principal Architect',
        experience: '14 years',
        specialty: 'Concept planning, elevations, and premium residential design.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
      },
      {
        name: 'Priya Shah',
        role: 'Design Lead',
        experience: '11 years',
        specialty: 'Interior flow, material palettes, and client-first detailing.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
      },
      {
        name: 'Rohan Kapoor',
        role: 'Project Director',
        experience: '16 years',
        specialty: 'Site coordination, milestones, and quality assurance.',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop',
      },
      {
        name: 'Sara Fernandes',
        role: 'Interior Specialist',
        experience: '9 years',
        specialty: 'Warm finishes, furniture planning, and spatial comfort.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop',
      },
      {
        name: 'Arjun Iyer',
        role: 'Site Engineer',
        experience: '10 years',
        specialty: 'On-site execution, technical checks, and finishing accuracy.',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop&sat=-20',
      },
      {
        name: 'Naina Bansal',
        role: 'Quantity Surveyor',
        experience: '8 years',
        specialty: 'Budget control, estimates, and clear material planning.',
        image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1200&auto=format&fit=crop',
      },
      {
        name: 'Kabir Sethi',
        role: 'Structural Consultant',
        experience: '13 years',
        specialty: 'Structural coordination, stability, and safe detailing.',
        image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=1200&auto=format&fit=crop',
      },
      {
        name: 'Mira Iqbal',
        role: 'Client Relations',
        experience: '7 years',
        specialty: 'Communication, updates, and smooth handover support.',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
      },
    ],
  },
}

const aboutContent = {
  hero: {
    title: 'We build spaces that feel calm, durable, and precise.',
    copy:
      'BuildCivil Constructions creates homes and commercial spaces with a clear design process, disciplined execution, and a premium finish. We believe good construction should feel organized from the first meeting to the final handover.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1800&auto=format&fit=crop',
  },
  story: {
    title: 'Built on clarity, care, and craftsmanship.',
    copy:
      'Our approach is simple: understand the space, plan it well, build it carefully, and hand it over with confidence. That means more than construction alone. It means aligning people, materials, timelines, and details into one steady process.',
  },
  principles: [
    {
      icon: 'shield',
      title: 'Quality First',
      copy: 'We choose durable materials, work with disciplined teams, and hold every detail to a higher standard.',
    },
    {
      icon: 'ruler',
      title: 'Precise Execution',
      copy: 'From planning to handover, each phase is managed with clarity, structure, and tight coordination.',
    },
    {
      icon: 'handshake',
      title: 'Transparent Delivery',
      copy: 'We keep communication open so clients always understand the progress, milestones, and next steps.',
    },
    {
      icon: 'clock',
      title: 'On-Time Commitment',
      copy: 'Reliable timelines and steady site supervision help us deliver without compromising the design intent.',
    },
  ],
  stats: [
    { value: '12+', label: 'Years of experience' },
    { value: '110+', label: 'Projects completed' },
    { value: '4', label: 'Core delivery stages' },
    { value: '3', label: 'Primary markets served' },
  ],
  process: {
    title: 'A steady path from concept to handover.',
    copy:
      'We keep the journey disciplined and visible at every stage, so the build feels organized and the final result feels premium.',
  },
  journey: [
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
  ],
  cta: {
    title: 'Ready to build with a team that keeps things calm and clear?',
    copy: 'Let’s talk about your site, your scope, and the kind of finish you want to see every day.',
  },
  team: homeContent.team,
}

const servicesContent = {
  hero: {
    title: 'Services that feel like a complete build story.',
    copy:
      'We do not treat services as separate silos. Every track is designed to move together so your project feels calm, coordinated, and premium from the first discussion to the final handover.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1800&auto=format&fit=crop',
  },
  intro: {
    title: 'Five core tracks, each with its own visual mood.',
    copy:
      'Each service panel pairs a full-bleed image with focused copy so the page feels more like a premium portfolio than a standard services list.',
  },
}

const projectsContent = {
  hero: {
    title: 'Five selected projects, shaped with rhythm and construction clarity.',
    copy:
      'A tighter portfolio of BuildCivil work, chosen to show the kind of residential, commercial, interior, and renovation delivery that matters most.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1800&auto=format&fit=crop',
  },
  intro: {
    title: 'Browse by project type.',
    copy: 'Choose a category to narrow the wall and view only the projects in that segment.',
  },
}

const contactContent = {
  hero: {
    title: "Let's talk about your next build.",
    copy:
      "Share the kind of project you have in mind and we'll help shape the scope, timeline, and delivery approach with clarity and care.",
    image: '',
  },
  form: {
    title: 'Send us your brief and we’ll help shape the project.',
    copy:
      "Tell us what you're building, where the site is, and the kind of support you need. We'll come back with the right next step.",
  },
  contactCards: [
    { icon: 'phone', label: 'Call us', value: '+91 83030 76294' },
    { icon: 'mail', label: 'Email us', value: 'office@buildcivil.in' },
    { icon: 'map', label: 'Visit us', value: 'Uttar Pradesh, India' },
  ],
  officeHighlights: [
    { label: 'Response time', value: 'Within 1 business day' },
    { label: 'Working hours', value: 'Mon-Sat, 8AM-5:30PM' },
    { label: 'Project types', value: 'Homes, interiors, commercial' },
  ],
  location: {
    label: 'Our location',
    title: "We're based in Uttar Pradesh, India.",
    copy: "Use the map to understand our location, then send the form on the left and we'll follow up with the right next step.",
    mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=77.3000%2C28.5600%2C77.4000%2C28.6700&layer=mapnik',
    detailTitle: 'Uttar Pradesh, India',
    detailCopy: 'We coordinate projects across homes, interiors, renovations, and commercial spaces.',
    email: 'office@buildcivil.in',
    phone: '+91 83030 76294',
  },
}

const renovaiteContent: RenovaitePageContent = {
  seo: {
    title: 'Renovaite by BuildCivil | AI Interior Design Studio',
    description:
      'Upload a room photo, pick a style, and explore before/after renovations with Renovaite — BuildCivil’s AI-assisted interior design experience.',
  },
  hero: {
    label: 'Renovaite',
    title: 'AI-assisted interiors, ready for real renovation.',
    copy: 'Upload your room, choose a design direction, and preview transformations with before/after clarity — built for homeowners planning their next upgrade.',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop',
  },
  slider: {
    label: 'Before & after',
    title: 'See the renovation shift in one sweep.',
    copy: 'Drag the slider to compare the existing room with a Renovaite-styled finish. Each pair is curated for clarity, material tone, and spatial rhythm.',
    items: [
      {
        title: 'Living room refresh',
        copy: 'Warmer lighting, cleaner lines, and a calmer material palette that lifts everyday living without losing comfort.',
        beforeImage:
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop',
        afterImage:
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
        beforeLabel: 'Before',
        afterLabel: 'After',
      },
      {
        title: 'Bedroom calm upgrade',
        copy: 'Soft neutrals, refined joinery cues, and a quieter layout that makes rest feel intentional.',
        beforeImage:
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1600&auto=format&fit=crop',
        afterImage:
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1600&auto=format&fit=crop',
        beforeLabel: 'Before',
        afterLabel: 'After',
      },
    ],
  },
  form: {
    label: 'Generate designs',
    title: 'Start with your room photo.',
    copy: 'Share a clear photo, pick the room type and style, and tell us how many concepts you want. Our team will follow up with tailored Renovaite directions.',
    submitLabel: 'Generate Designs',
    successMessage:
      'Thanks — your Renovaite request is in. Our team will review your room details and get back with next steps shortly.',
    sideImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=900&auto=format&fit=crop',
    ],
    roomTypes: [
      { value: 'bedroom', label: 'Bedroom' },
      { value: 'balcony', label: 'Balcony' },
      { value: 'bathroom', label: 'Bathroom' },
      { value: 'living', label: 'Living room' },
      { value: 'kitchen', label: 'Kitchen' },
    ],
    designStyles: [
      { value: 'eclectic', label: 'Eclectic' },
      { value: 'modern', label: 'Modern' },
      { value: 'scandinavian', label: 'Scandinavian' },
      { value: 'contemporary', label: 'Contemporary' },
    ],
    designCounts: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
    ],
  },
  cta: {
    title: 'Prefer a full renovation walkthrough?',
    copy: 'Talk to BuildCivil for site-ready planning, budgeting, and execution support around your Renovaite concept.',
    label: 'Talk to BuildCivil',
    href: '/contact',
  },
}

const pageCatalog: PageCatalogItem[] = [
  {
    slug: 'home',
    title: 'Home',
    hero_label: 'Premium construction delivery',
    hero_title: homeContent.hero.title,
    hero_copy: homeContent.hero.copy,
    hero_image: homeContent.hero.image,
    content: homeContent,
    published: true,
    sort_order: 0,
  },
  {
    slug: 'about',
    title: 'About',
    hero_label: 'About BuildCivil',
    hero_title: aboutContent.hero.title,
    hero_copy: aboutContent.hero.copy,
    hero_image: aboutContent.hero.image,
    content: aboutContent,
    published: true,
    sort_order: 1,
  },
  {
    slug: 'services',
    title: 'Services',
    hero_label: 'BuildCivil Services',
    hero_title: servicesContent.hero.title,
    hero_copy: servicesContent.hero.copy,
    hero_image: servicesContent.hero.image,
    content: servicesContent,
    published: true,
    sort_order: 2,
  },
  {
    slug: 'projects',
    title: 'Projects',
    hero_label: 'Selected Projects',
    hero_title: projectsContent.hero.title,
    hero_copy: projectsContent.hero.copy,
    hero_image: projectsContent.hero.image,
    content: projectsContent,
    published: true,
    sort_order: 3,
  },
  {
    slug: 'contact',
    title: 'Contact',
    hero_label: 'Contact BuildCivil',
    hero_title: contactContent.hero.title,
    hero_copy: contactContent.hero.copy,
    hero_image: contactContent.hero.image,
    content: contactContent,
    published: true,
    sort_order: 4,
  },
  {
    slug: 'renovaite',
    title: 'Renovaite',
    hero_label: renovaiteContent.hero.label ?? 'Renovaite',
    hero_title: renovaiteContent.hero.title,
    hero_copy: renovaiteContent.hero.copy,
    hero_image: renovaiteContent.hero.image,
    content: renovaiteContent,
    published: true,
    sort_order: 5,
  },
]

function cloneContent<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function mergeContent<T extends Record<string, any>>(fallback: T, override?: unknown): T {
  if (!override || typeof override !== 'object') return cloneContent(fallback)

  const output: Record<string, any> = Array.isArray(fallback) ? [...fallback] : { ...fallback }
  for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
    const base = output[key]
    if (value && typeof value === 'object' && !Array.isArray(value) && base && typeof base === 'object' && !Array.isArray(base)) {
      output[key] = mergeContent(base as Record<string, any>, value)
    } else {
      output[key] = value
    }
  }

  return output as T
}

function normalizeContent(value: unknown) {
  if (!value) return {}
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return {}
    }
  }
  if (typeof value === 'object') return value
  return {}
}

function dedupeRepeatedCopy(value: string) {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (!normalized) return value

  const midpoint = Math.floor(normalized.length / 2)
  const left = normalized.slice(0, midpoint).trim()
  const right = normalized.slice(midpoint).trim()
  if (left && right && left === right) return left

  const sentences = normalized.split(/(?<=[.!?])\s+/)
  if (sentences.length >= 2) {
    const unique: string[] = []
    for (const sentence of sentences) {
      if (!unique.includes(sentence)) unique.push(sentence)
    }
    if (unique.length < sentences.length) return unique.join(' ')
  }

  return normalized
}

function sanitizePageContent<T extends Record<string, any>>(content: T): T {
  const next = cloneContent(content)

  if (next.hero?.copy && typeof next.hero.copy === 'string') {
    next.hero.copy = dedupeRepeatedCopy(next.hero.copy)
  }

  if (next.seo?.description && typeof next.seo.description === 'string') {
    next.seo.description = dedupeRepeatedCopy(next.seo.description)
  }

  return next
}

async function getSectionOverrides(slug: SitePageSlug) {
  if (!isSupabaseConfigured()) return {}

  try {
    const rows = await supabaseRequest<SiteSectionRow[]>(
      `/rest/v1/site_sections?select=*&page_slug=eq.${encodeURIComponent(slug)}&visible=eq.true&order=sort_order.asc`,
      { method: 'GET' },
    )

    return rows.reduce<Record<string, Record<string, unknown>>>((output, section) => {
      output[section.section_key] = {
        ...section.content,
        title: section.title || section.content?.title,
        subtitle: section.subtitle || section.content?.subtitle,
        kicker: section.kicker || section.content?.kicker,
        copy: section.copy || section.content?.copy,
        image: section.image_url || section.content?.image,
        imageAlt: section.image_alt || section.content?.imageAlt,
        ctaLabel: section.cta_label || section.content?.ctaLabel,
        ctaHref: section.cta_href || section.content?.ctaHref,
        layoutPreset: section.layout_preset,
        backgroundColor: section.background_color,
        textColor: section.text_color,
        style: section.style,
      }
      return output
    }, {})
  } catch {
    return {}
  }
}

export function getDefaultPageRecord(slug: SitePageSlug) {
  return pageCatalog.find((page) => page.slug === slug) ?? pageCatalog[0]
}

export function getAllPageDefaults() {
  return pageCatalog.map((page) => cloneContent(page))
}

export async function getSitePage(slug: SitePageSlug): Promise<SitePageRecord> {
  const fallback = getDefaultPageRecord(slug)
  if (!isSupabaseConfigured()) return { id: fallback.slug, ...cloneContent(fallback) }

  try {
    // Page content edits should be visible immediately after admin save/publish.
    const [rows, sectionOverrides] = await Promise.all([
      supabaseRequest<SitePageRecord[]>(
        `/rest/v1/site_pages?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
        { method: 'GET' },
      ),
      getSectionOverrides(slug),
    ])
    const row = rows[0]
    if (!row) {
      return {
        id: fallback.slug,
        ...cloneContent(fallback),
        content: sanitizePageContent(mergeContent(fallback.content, sectionOverrides)),
      }
    }

    const mergedContent = sanitizePageContent(
      mergeContent(mergeContent(fallback.content, normalizeContent(row.content)), sectionOverrides),
    )

    return {
      ...fallback,
      ...row,
      hero_copy: dedupeRepeatedCopy(row.hero_copy || fallback.hero_copy),
      content: mergedContent,
    }
  } catch {
    return { id: fallback.slug, ...cloneContent(fallback), content: sanitizePageContent(cloneContent(fallback.content)) }
  }
}

export function getPageDefaultsForAdmin() {
  return pageCatalog.map((page) => ({
    ...page,
    content: cloneContent(page.content),
  }))
}
