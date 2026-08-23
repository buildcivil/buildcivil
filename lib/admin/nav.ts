import type { ComponentType } from 'react'
import {
  BookOpen,
  Brush,
  FileText,
  FolderKanban,
  Handshake,
  Home,
  ImageIcon,
  LayoutGrid,
  Layers3,
  Mail,
  MessageSquareText,
  Package,
  Palette,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Type,
  Users,
} from 'lucide-react'

export type AdminViewKey =
  | 'overview'
  | 'page-home'
  | 'page-about'
  | 'page-services'
  | 'page-projects'
  | 'page-contact'
  | 'page-renovaite'
  | 'projects'
  | 'services'
  | 'messages'
  | 'pages'
  | 'enquiries'
  | 'package-quotes'
  | 'newsletter'
  | 'media'
  | 'packages'
  | 'policy-pages'
  | 'settings'
  | 'sections-builder'
  | 'theme-studio'
  | 'logos-brand'
  | 'fonts'
  | 'forms-fields'
  | 'seo-center'
  | 'google-setup'
  | 'site-navigation'
  | 'admin-users'
  | 'help-guide'

export type AdminNavItem = {
  key: AdminViewKey
  label: string
  description?: string
  icon: ComponentType<{ size?: number; className?: string }>
  keywords?: string[]
}

export type AdminNavGroup = {
  label: string
  items: AdminNavItem[]
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { key: 'overview', label: 'Overview', icon: LayoutGrid, description: 'Dashboard health and shortcuts', keywords: ['home', 'dashboard', 'stats'] },
      { key: 'media', label: 'Media Library', icon: ImageIcon, description: 'Upload and manage images & video', keywords: ['upload', 'images', 'photos', 'files'] },
      { key: 'help-guide', label: 'Help & Guide', icon: BookOpen, description: 'How to use the admin panel', keywords: ['docs', 'tutorial'] },
    ],
  },
  {
    label: 'Pages',
    items: [
      { key: 'page-home', label: 'Home', icon: Home, description: 'Edit homepage sections', keywords: ['landing', 'hero'] },
      { key: 'page-about', label: 'About', icon: FileText, description: 'Edit about page content' },
      { key: 'page-services', label: 'Services', icon: Layers3, description: 'Edit services listing page' },
      { key: 'page-projects', label: 'Projects', icon: FolderKanban, description: 'Edit projects listing page' },
      { key: 'page-contact', label: 'Contact', icon: MessageSquareText, description: 'Edit contact page content' },
      { key: 'page-renovaite', label: 'Renovaite', icon: Sparkles, description: 'Edit Renovaite page content' },
    ],
  },
  {
    label: 'Content',
    items: [
      { key: 'projects', label: 'Project Library', icon: FolderKanban, description: 'Create and publish projects', keywords: ['portfolio', 'case study'] },
      { key: 'services', label: 'Service Library', icon: Layers3, description: 'Create and publish services' },
      { key: 'packages', label: 'Package Library', icon: Package, description: 'Construction packages & pricing', keywords: ['plans', 'pricing'] },
      { key: 'policy-pages', label: 'Policy Pages', icon: FileText, description: 'Privacy, terms, and policies', keywords: ['legal', 'privacy', 'terms'] },
    ],
  },
  {
    label: 'Leads',
    items: [
      { key: 'enquiries', label: 'Service Enquiries', icon: Handshake, description: 'Service form submissions', keywords: ['inbox', 'leads'] },
      { key: 'package-quotes', label: 'Plan Quotes', icon: Package, description: 'Package quote requests', keywords: ['quotes', 'inbox'] },
      { key: 'messages', label: 'Contact Messages', icon: MessageSquareText, description: 'Contact form inbox', keywords: ['inbox', 'contact'] },
      { key: 'newsletter', label: 'Newsletter', icon: Mail, description: 'Subscriber list', keywords: ['email', 'subscribers'] },
    ],
  },
  {
    label: 'Appearance',
    items: [
      { key: 'settings', label: 'Header & Footer', icon: Settings, description: 'Global layout settings' },
      { key: 'theme-studio', label: 'Theme Studio', icon: Palette, description: 'Colors and visual tokens' },
      { key: 'logos-brand', label: 'Logos & Brand', icon: ShieldCheck, description: 'Brand assets and logos' },
      { key: 'fonts', label: 'Fonts', icon: Type, description: 'Typography settings' },
      { key: 'site-navigation', label: 'Navigation', icon: Settings, description: 'Header and footer links', keywords: ['menu', 'links'] },
    ],
  },
  {
    label: 'SEO & Tools',
    items: [
      { key: 'seo-center', label: 'SEO Center', icon: Search, description: 'Metadata and SEO drafts' },
      { key: 'google-setup', label: 'Google Setup', icon: Search, description: 'Verification and analytics' },
      { key: 'forms-fields', label: 'Forms & Fields', icon: FileText, description: 'Public form labels and fields' },
      { key: 'admin-users', label: 'Admin Users', icon: Users, description: 'Team access and roles', keywords: ['team', 'roles', 'permissions'] },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { key: 'pages', label: 'Legacy Pages', icon: FileText, description: 'Raw site pages records' },
      { key: 'sections-builder', label: 'Sections Builder', icon: Brush, description: 'Low-level section rows' },
    ],
  },
]

export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap((group) => group.items)

export const ADMIN_VIEW_ACCESS: Record<string, AdminViewKey[]> = {
  super_admin: ADMIN_NAV_ITEMS.map((item) => item.key),
  admin: ADMIN_NAV_ITEMS.filter((item) => item.key !== 'admin-users').map((item) => item.key),
  content_manager: [
    'overview',
    'page-home',
    'page-about',
    'page-services',
    'page-projects',
    'page-contact',
    'page-renovaite',
    'projects',
    'services',
    'packages',
    'policy-pages',
    'media',
    'settings',
    'theme-studio',
    'logos-brand',
    'fonts',
    'forms-fields',
    'seo-center',
    'google-setup',
    'site-navigation',
    'help-guide',
  ],
  project_manager: ['overview', 'projects', 'services', 'media', 'seo-center', 'help-guide'],
  media_manager: ['overview', 'media', 'help-guide'],
  leads_manager: ['overview', 'enquiries', 'package-quotes', 'newsletter', 'messages', 'help-guide'],
  editor: [
    'overview',
    'page-home',
    'page-about',
    'page-services',
    'page-projects',
    'page-contact',
    'page-renovaite',
    'projects',
    'services',
    'media',
    'seo-center',
    'policy-pages',
    'help-guide',
  ],
}

export function canViewAdmin(role: string | undefined, key: AdminViewKey) {
  return (ADMIN_VIEW_ACCESS[role ?? 'editor'] ?? ADMIN_VIEW_ACCESS.editor).includes(key)
}

export function getAdminViewLabel(key: AdminViewKey) {
  return ADMIN_NAV_ITEMS.find((item) => item.key === key)?.label ?? 'Overview'
}

export function searchAdminNav(query: string, role: string | undefined) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return ADMIN_NAV_ITEMS.filter((item) => {
    if (!canViewAdmin(role, item.key)) return false
    const haystack = [item.label, item.description, ...(item.keywords ?? [])].join(' ').toLowerCase()
    return haystack.includes(q)
  }).slice(0, 8)
}
