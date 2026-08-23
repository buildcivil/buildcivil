export type GlobalLink = {
  id: string
  label: string
  href: string
  visible: boolean
}

export type HeaderSettings = {
  brand: {
    href: string
    markTop: string
    markBottom: string
    wordTop: string
    wordBottom: string
    mobileTop: string
    mobileBottom: string
    logoUrl?: string
    logoAlt?: string
    showImageLogo?: boolean
    desktopWidth?: string
    tabletWidth?: string
    mobileWidth?: string
    footerDesktopWidth?: string
    footerTabletWidth?: string
    markSize?: string
    faviconUrl?: string
    socialImageUrl?: string
    primaryColor?: string
    accentColor?: string
    markBackgroundColor?: string
  }
  mobileTopBar: {
    visible: boolean
    locationText: string
    phoneLabel: string
    phoneHref: string
    backgroundColor: string
    textColor: string
    accentColor: string
  }
  navLinks: GlobalLink[]
  cta: GlobalLink
}

export type FooterContactRow = GlobalLink & {
  type: 'address' | 'email' | 'phone'
  value: string
}

export type FooterSocialLink = GlobalLink & {
  icon: 'instagram' | 'twitter' | 'linkedin' | 'facebook'
}

export type FooterSettings = {
  brand: HeaderSettings['brand']
  description: string
  contactRows: FooterContactRow[]
  companyTitle: string
  companyLinks: GlobalLink[]
  informationTitle: string
  informationLinks: GlobalLink[]
  resourcesTitle: string
  resourcesLinks: GlobalLink[]
  newsletter: {
    visible: boolean
    title: string
    placeholder: string
    buttonLabel: string
    consent: string
  }
  socialLinks: FooterSocialLink[]
  legalLinks: GlobalLink[]
  copyright: string
  bigText: string
  backToTopHref: string
}

export type GlobalLayoutSettings = {
  header: HeaderSettings
  footer: FooterSettings
}

export const globalLayoutDefaults: GlobalLayoutSettings = {
  header: {
    brand: {
      href: '/#home',
      markTop: 'BU',
      markBottom: 'CI',
      wordTop: 'ILD',
      wordBottom: 'VIL',
      mobileTop: 'Build',
      mobileBottom: 'Civil',
      desktopWidth: '180',
      tabletWidth: '150',
      mobileWidth: '126',
      footerDesktopWidth: '190',
      footerTabletWidth: '150',
      markSize: '56',
      primaryColor: '#1c1712',
      accentColor: '#E87F24',
      markBackgroundColor: '#FFC81E',
    },
    mobileTopBar: {
      visible: true,
      locationText: 'Dehradun | Lucknow | Noida',
      phoneLabel: '+91 83030 76294',
      phoneHref: 'https://wa.me/918303076294',
      backgroundColor: '#ffffff',
      textColor: '#1c1712',
      accentColor: '#25D366',
    },
    navLinks: [
      { id: 'home', label: 'HOME', href: '/#home', visible: true },
      { id: 'about', label: 'ABOUT', href: '/about', visible: true },
      { id: 'services', label: 'SERVICES', href: '/services', visible: true },
      { id: 'projects', label: 'PROJECT', href: '/projects', visible: true },
      { id: 'buildcivil-ai', label: 'AI APP', href: '/ai-cost-estimator', visible: true },
      { id: 'renovaite', label: 'RENOVAITE', href: '/renovaite', visible: true },
      { id: 'blog', label: 'BLOG', href: '/blog', visible: true },
      { id: 'careers', label: 'CAREERS', href: '/careers', visible: true },
      { id: 'contact', label: 'CONTACT', href: '/contact', visible: true },
    ],
    cta: { id: 'header-cta', label: 'CONTACT', href: '/contact', visible: true },
  },
  footer: {
    brand: {
      href: '/#home',
      markTop: 'BU',
      markBottom: 'CI',
      wordTop: 'ILD',
      wordBottom: 'VIL',
      mobileTop: 'Build',
      mobileBottom: 'Civil',
      desktopWidth: '180',
      tabletWidth: '150',
      mobileWidth: '126',
      footerDesktopWidth: '190',
      footerTabletWidth: '150',
      markSize: '56',
      primaryColor: '#FEFDDF',
      accentColor: '#FFC81E',
      markBackgroundColor: '#E87F24',
    },
    description:
      'Building smarter homes and spaces with precision execution, calm coordination, and unmatched transparency.',
    contactRows: [
      { id: 'address', type: 'address', label: 'Address', value: 'Uttar Pradesh, India', href: '/contact', visible: true },
      { id: 'email', type: 'email', label: 'Email', value: 'office@buildcivil.in', href: 'mailto:office@buildcivil.in', visible: true },
      { id: 'phone', type: 'phone', label: 'Phone', value: '+91 83030 76294', href: 'tel:+918303076294', visible: true },
    ],
    companyTitle: 'Company',
    companyLinks: [
      { id: 'home', label: 'Home', href: '/#home', visible: true },
      { id: 'about', label: 'About Us', href: '/about', visible: true },
      { id: 'projects', label: 'Projects', href: '/projects', visible: true },
      { id: 'process', label: 'Process', href: '/#process', visible: true },
      { id: 'services', label: 'Services', href: '/services', visible: true },
      { id: 'faq', label: 'FAQ', href: '/#faq', visible: true },
      { id: 'contact', label: 'Contact', href: '/contact', visible: true },
    ],
    informationTitle: 'Information',
    informationLinks: [
      { id: 'terms', label: 'Terms & Condition', href: '/terms-of-service', visible: true },
      { id: 'privacy', label: 'Privacy Policy', href: '/privacy-policy', visible: true },
      { id: 'cancellation', label: 'Cancellation Policy', href: '/cancellation-policy', visible: true },
      { id: 'referral', label: 'Referral Policy', href: '/referral-policy', visible: true },
      { id: 'faqs', label: 'FAQs', href: '/#faq', visible: true },
    ],
    resourcesTitle: 'Resources',
    resourcesLinks: [
      { id: 'blogs', label: 'Blogs & News', href: '/blog', visible: true },
      { id: 'careers', label: 'Careers', href: '/careers', visible: true },
    ],
    newsletter: {
      visible: true,
      title: 'Join Our Newsletter',
      placeholder: 'Enter your e-mail',
      buttonLabel: 'Subscribe',
      consent: 'You agree to the Terms of Service and Privacy Policy.',
    },
    socialLinks: [
      { id: 'instagram', label: 'Instagram', href: '/contact', icon: 'instagram', visible: true },
      { id: 'twitter', label: 'Twitter', href: '/contact', icon: 'twitter', visible: true },
      { id: 'linkedin', label: 'LinkedIn', href: '/contact', icon: 'linkedin', visible: true },
      { id: 'facebook', label: 'Facebook', href: '/contact', icon: 'facebook', visible: true },
    ],
    legalLinks: [
      { id: 'privacy', label: 'Privacy Policy', href: '/privacy-policy', visible: true },
      { id: 'terms', label: 'Terms of Service', href: '/terms-of-service', visible: true },
      { id: 'cookies', label: 'Cookie Policy', href: '/cookie-policy', visible: true },
    ],
    copyright: '© 2026 BuildCivil Constructions. All rights reserved.',
    bigText: 'BuildCivil',
    backToTopHref: '/#home',
  },
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

export function mergeGlobalLayoutSettings(value: unknown): GlobalLayoutSettings {
  const merge = (fallback: unknown, override: unknown): unknown => {
    if (Array.isArray(fallback)) return Array.isArray(override) ? override : clone(fallback)
    if (!isPlainObject(fallback)) return override ?? fallback
    if (!isPlainObject(override)) return clone(fallback)

    const output: Record<string, unknown> = { ...fallback }
    for (const [key, fallbackValue] of Object.entries(fallback)) {
      output[key] = merge(fallbackValue, override[key])
    }
    return output
  }

  return merge(globalLayoutDefaults, value) as GlobalLayoutSettings
}
