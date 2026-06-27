import type { ProjectType } from './types'

export const WELCOME_FALLBACK =
  'Welcome to BuildCivil AI. Choose a project type below and we will guide you step by step to a tailored construction estimate and plan.'

export const MSG = {
  assistantUnreachable: 'BuildCivil AI is temporarily unavailable. Please try again in a moment.',
  planGenError: 'Something went wrong while generating your plan. Please try again.',
} as const

export const PROJECT_TYPE_OPTIONS: { id: ProjectType; label: string; hint: string }[] = [
  { id: 'residential', label: 'Residential Home', hint: 'Apartments, independent floors, townhouses' },
  { id: 'villa', label: 'Villa / Bungalow', hint: 'Standalone luxury or family homes' },
  { id: 'commercial', label: 'Commercial Space', hint: 'Offices, retail, warehouses' },
  { id: 'renovation', label: 'Renovation & Remodeling', hint: 'Structural upgrades and layout changes' },
  { id: 'interior', label: 'Interior Design', hint: 'Finishes, modular kitchen, wardrobes' },
]

export const LOCATION_OPTIONS = [
  { label: 'Delhi NCR', value: 'Delhi NCR' },
  { label: 'Noida & Greater Noida', value: 'Noida & Greater Noida' },
  { label: 'Lucknow', value: 'Lucknow' },
  { label: 'Dehradun', value: 'Dehradun' },
  { label: 'Ghaziabad / Meerut', value: 'Ghaziabad / Meerut' },
]

export const AREA_OPTIONS = [
  { label: 'Under 1,000 sq ft', value: 'Under 1,000 sq ft' },
  { label: '1,000 – 2,000 sq ft', value: '1,000 – 2,000 sq ft' },
  { label: '2,000 – 3,000 sq ft', value: '2,000 – 3,000 sq ft' },
  { label: '3,000 – 5,000 sq ft', value: '3,000 – 5,000 sq ft' },
  { label: '5,000+ sq ft', value: '5,000+ sq ft' },
]

export const FLOOR_OPTIONS = [
  { label: 'Ground floor only', value: 'Ground floor only' },
  { label: 'G + 1 (2 floors)', value: 'G + 1 (2 floors)' },
  { label: 'G + 2 (3 floors)', value: 'G + 2 (3 floors)' },
  { label: 'G + 3 or more', value: 'G + 3 or more' },
]

export const BUDGET_OPTIONS = [
  { label: 'Economy', value: 'Economy', hint: '₹1,200–1,600 per sq ft' },
  { label: 'Standard', value: 'Standard', hint: '₹1,600–2,200 per sq ft' },
  { label: 'Premium', value: 'Premium', hint: '₹2,200–3,000 per sq ft' },
  { label: 'Luxury', value: 'Luxury', hint: '₹3,000+ per sq ft' },
]

export const TIMELINE_OPTIONS = [
  { label: '6 – 9 months', value: '6 – 9 months' },
  { label: '9 – 12 months', value: '9 – 12 months' },
  { label: '12 – 18 months', value: '12 – 18 months' },
  { label: '18+ months (flexible)', value: '18+ months (flexible)' },
]

export const MATERIAL_OPTIONS = [
  { label: 'Standard finishes', value: 'Standard finishes' },
  { label: 'Premium finishes', value: 'Premium finishes' },
  { label: 'Eco-friendly / sustainable', value: 'Eco-friendly / sustainable' },
]

export const LEFT_COLUMN_FEATURES = [
  {
    title: 'Guided step-by-step flow',
    description: 'Pick from curated options for project type, location, area, floors, budget, and timeline—no guesswork.',
  },
  {
    title: 'India-market cost estimates',
    description: 'Get a structured breakdown of structure, finishing, MEP, and total project cost in Indian Rupees.',
  },
  {
    title: 'Construction phase roadmap',
    description: 'See a realistic phase-wise schedule from foundation to handover tailored to your selections.',
  },
]

export const HISTORY_STORAGE_KEY = 'buildcivil-ai-plans'
