import { isSupabaseConfigured, supabaseRequest } from './supabase-admin'

export type PackageMaterial = {
  id?: string
  label: string
  value: string
  iconName: string
  sortOrder: number
}

export type ConstructionPackage = {
  id?: string
  slug: string
  badge: string
  name: string
  price: string
  priceUnit: string
  tagline: string
  packageName: string
  iconName: string
  features: string[]
  projects: string
  satisfaction: string
  featured: boolean
  published: boolean
  sortOrder: number
  materials: PackageMaterial[]
}

type PackageRow = {
  id: string
  slug: string
  badge: string
  name: string
  price: string
  price_unit: string
  tagline: string
  package_name: string
  icon_name: string
  features: unknown
  projects: string
  satisfaction: string
  featured: boolean
  published: boolean
  sort_order: number
}

type MaterialRow = {
  id: string
  package_id: string
  label: string
  value: string
  icon_name: string
  sort_order: number
}

export const constructionPackageDefaults: ConstructionPackage[] = [
  {
    slug: 'basic',
    badge: 'Budget',
    name: 'Basic',
    price: '₹1,700',
    priceUnit: '/sqft',
    tagline: 'Best for budget-friendly homes',
    packageName: 'Silver Package',
    iconName: 'home',
    features: ['Standard design & planning', 'Basic interior finishes', 'Essential electrical & plumbing', 'Standard quality materials'],
    projects: '100+',
    satisfaction: '95%',
    featured: false,
    published: true,
    sortOrder: 0,
    materials: [
      { label: 'Cement', value: 'Ambuja/ MP Birla', iconName: 'package', sortOrder: 0 },
      { label: 'Steel', value: 'Balaji/ Kamdhenu', iconName: 'layers', sortOrder: 1 },
      { label: 'Tiles', value: 'Somany/ Kajaria (basic)', iconName: 'grid', sortOrder: 2 },
      { label: 'Electrical', value: 'Anchor', iconName: 'zap', sortOrder: 3 },
      { label: 'Plumbing', value: 'Finolex', iconName: 'droplet', sortOrder: 4 },
      { label: 'Paint', value: 'Standard emulsion', iconName: 'paintbrush', sortOrder: 5 },
    ],
  },
  {
    slug: 'classic',
    badge: 'Popular',
    name: 'Classic',
    price: '₹2,200',
    priceUnit: '/sqft',
    tagline: 'Balanced quality & aesthetics',
    packageName: 'Gold Package',
    iconName: 'shield',
    features: [
      'Premium design with architectural oversight',
      'Modular kitchen with high-gloss finish',
      'Enhanced interiors including false ceilings',
      'Quality materials from trusted national brands',
    ],
    projects: '75+',
    satisfaction: '96%',
    featured: true,
    published: true,
    sortOrder: 1,
    materials: [
      { label: 'Cement', value: 'UltraTech / ACC', iconName: 'package', sortOrder: 0 },
      { label: 'Steel', value: 'Tata Tiscon / JSW', iconName: 'layers', sortOrder: 1 },
      { label: 'Tiles', value: 'Kajaria / Somany', iconName: 'grid', sortOrder: 2 },
      { label: 'Electrical', value: 'Anchor / Havells', iconName: 'zap', sortOrder: 3 },
      { label: 'Plumbing', value: 'Astra / Ashirvad', iconName: 'droplet', sortOrder: 4 },
      { label: 'Paint', value: 'Asian Paints', iconName: 'paintbrush', sortOrder: 5 },
      { label: 'Doors', value: 'Teak Wood Frames', iconName: 'door', sortOrder: 6 },
      { label: 'Windows', value: 'UPVC 3-Track', iconName: 'layers', sortOrder: 7 },
    ],
  },
  {
    slug: 'royal',
    badge: 'Luxury',
    name: 'Royal',
    price: '₹2,500',
    priceUnit: '/sqft',
    tagline: 'Luxury living experience',
    packageName: 'Diamond Package',
    iconName: 'sparkles',
    features: ['High-end architecture', 'Full interior & exterior', 'Smart home ready', 'Premium quality materials'],
    projects: '50+',
    satisfaction: '94%',
    featured: false,
    published: true,
    sortOrder: 2,
    materials: [
      { label: 'Cement', value: 'UltraTech/ACC Gold', iconName: 'package', sortOrder: 0 },
      { label: 'Steel', value: 'Tata/JSW', iconName: 'layers', sortOrder: 1 },
      { label: 'Tiles', value: 'Johnson & Johnson/ Kajaria', iconName: 'grid', sortOrder: 2 },
      { label: 'Electrical', value: 'Havells/Legrand', iconName: 'zap', sortOrder: 3 },
      { label: 'Plumbing', value: 'Astral', iconName: 'droplet', sortOrder: 4 },
      { label: 'Paint', value: 'Asian Paints Royale', iconName: 'paintbrush', sortOrder: 5 },
      { label: 'Doors', value: 'Premium engineered', iconName: 'door', sortOrder: 6 },
      { label: 'Smart Home', value: 'Ready', iconName: 'home', sortOrder: 7 },
    ],
  },
]

function list(value: unknown) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : []
}

function normalizePackage(row: PackageRow, materials: MaterialRow[]): ConstructionPackage {
  return {
    id: row.id,
    slug: row.slug,
    badge: row.badge,
    name: row.name,
    price: row.price,
    priceUnit: row.price_unit,
    tagline: row.tagline,
    packageName: row.package_name,
    iconName: row.icon_name,
    features: list(row.features),
    projects: row.projects,
    satisfaction: row.satisfaction,
    featured: row.featured,
    published: row.published,
    sortOrder: row.sort_order,
    materials: materials
      .filter((material) => material.package_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((material) => ({
        id: material.id,
        label: material.label,
        value: material.value,
        iconName: material.icon_name,
        sortOrder: material.sort_order,
      })),
  }
}

export async function getConstructionPackagesFromCMS(includeDrafts = false): Promise<ConstructionPackage[]> {
  if (!isSupabaseConfigured()) return constructionPackageDefaults

  try {
    const query = includeDrafts
      ? '/rest/v1/construction_packages?select=*&order=sort_order.asc'
      : '/rest/v1/construction_packages?select=*&published=eq.true&order=sort_order.asc'
    // Packages are edited frequently during launch. Keep this uncached so
    // direct DB/admin changes appear on the homepage without waiting for ISR.
    const [packages, materials] = await Promise.all([
      supabaseRequest<PackageRow[]>(query, { method: 'GET' }),
      supabaseRequest<MaterialRow[]>('/rest/v1/package_materials?select=*&order=sort_order.asc', { method: 'GET' }),
    ])

    return packages.map((row) => normalizePackage(row, materials))
  } catch {
    return []
  }
}
