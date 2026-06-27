import { isSupabaseConfigured, supabaseRequest } from './supabase-admin'

export type PolicyPage = {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  seo_title: string
  seo_description: string
  published: boolean
  show_in_header: boolean
  show_in_footer: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export const policyPageDefaults: PolicyPage[] = [
  {
    id: 'privacy-policy',
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    summary: 'How BuildCivil collects, uses, and protects inquiry and website information.',
    content:
      'BuildCivil Constructions respects your privacy. This policy explains how we collect and use information shared through our website forms, newsletter signup, and project inquiry tools.\n\nInformation we collect\nWe may collect your name, email address, phone number, project type, selected service or package, preferred timeline, and any details you choose to submit.\n\nHow we use information\nWe use this information to respond to inquiries, prepare project discussions, manage construction service requests, improve our website, and maintain internal records.\n\nData protection\nWe use reasonable administrative and technical safeguards to protect submitted information. Access is limited to authorized BuildCivil team members and approved service providers.\n\nContact\nFor privacy questions, contact office@buildcivil.in.',
    seo_title: 'Privacy Policy | BuildCivil Constructions',
    seo_description: 'Read how BuildCivil Constructions handles inquiry data, newsletter submissions, and website information.',
    published: true,
    show_in_header: false,
    show_in_footer: true,
    sort_order: 10,
  },
  {
    id: 'terms-of-service',
    slug: 'terms-of-service',
    title: 'Terms of Service',
    summary: 'General terms for using the BuildCivil website and contacting our team.',
    content:
      'These Terms of Service apply to your use of the BuildCivil Constructions website.\n\nWebsite information\nThe website content is provided for general information about our construction, design, renovation, and project management services. Final project scope, pricing, timelines, and deliverables are confirmed through direct consultation and written agreement.\n\nUser submissions\nWhen you submit an inquiry, you confirm that the information provided is accurate to the best of your knowledge and may be used by BuildCivil to contact you about your request.\n\nNo automatic contract\nSubmitting a form or viewing package details does not create a construction contract. Any engagement begins only after mutual confirmation and formal documentation.\n\nContact\nFor questions, contact office@buildcivil.in.',
    seo_title: 'Terms of Service | BuildCivil Constructions',
    seo_description: 'Review the general terms for using the BuildCivil Constructions website and inquiry forms.',
    published: true,
    show_in_header: false,
    show_in_footer: true,
    sort_order: 20,
  },
  {
    id: 'cookie-policy',
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    summary: 'How BuildCivil may use cookies, analytics, and similar technologies.',
    content:
      'BuildCivil Constructions may use cookies and similar technologies to support website functionality, understand usage, and improve visitor experience.\n\nAnalytics\nIf analytics tools are enabled, they may collect aggregated usage information such as page views, device type, and traffic source. This helps us improve website performance and content.\n\nManaging cookies\nMost browsers let you control or disable cookies through browser settings. Some website features may not work as expected if cookies are disabled.\n\nContact\nFor cookie-related questions, contact office@buildcivil.in.',
    seo_title: 'Cookie Policy | BuildCivil Constructions',
    seo_description: 'Learn how BuildCivil Constructions uses cookies and analytics technologies on the website.',
    published: true,
    show_in_header: false,
    show_in_footer: true,
    sort_order: 30,
  },
]

export async function getPolicyPages(options: { publishedOnly?: boolean } = {}) {
  if (!isSupabaseConfigured()) {
    return options.publishedOnly ? policyPageDefaults.filter((page) => page.published) : policyPageDefaults
  }

  try {
    const published = options.publishedOnly ? '&published=eq.true' : ''
    const rows = await supabaseRequest<PolicyPage[]>(
      `/rest/v1/policy_pages?select=*&order=sort_order.asc,created_at.asc${published}`,
      { method: 'GET', revalidate: 300 },
    )
    return rows.length ? rows : options.publishedOnly ? policyPageDefaults.filter((page) => page.published) : policyPageDefaults
  } catch {
    return options.publishedOnly ? policyPageDefaults.filter((page) => page.published) : policyPageDefaults
  }
}

export async function getPolicyPageBySlug(slug: string) {
  const normalizedSlug = slug.toLowerCase()
  if (!isSupabaseConfigured()) {
    return policyPageDefaults.find((page) => page.slug === normalizedSlug && page.published) ?? null
  }

  try {
    const rows = await supabaseRequest<PolicyPage[]>(
      `/rest/v1/policy_pages?select=*&slug=eq.${encodeURIComponent(normalizedSlug)}&published=eq.true&limit=1`,
      { method: 'GET', revalidate: 300 },
    )
    return rows[0] ?? null
  } catch {
    return policyPageDefaults.find((page) => page.slug === normalizedSlug && page.published) ?? null
  }
}
