export type ProjectType =
  | 'residential'
  | 'villa'
  | 'commercial'
  | 'renovation'
  | 'interior'

export type FlowState =
  | { kind: 'welcome' }
  | { kind: 'planning'; step: 'project_type' | 'location' | 'area' | 'floors' | 'budget' | 'timeline' | 'materials' }
  | { kind: 'generating' }
  | { kind: 'complete' }

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type ConstructionSelections = {
  projectType: ProjectType | ''
  projectTypeLabel: string
  location: string
  area: string
  floors: string
  budget: string
  timeline: string
  materials: string
}

export type CostBreakdown = {
  structure: number
  finishing: number
  electrical: number
  plumbing: number
  miscellaneous: number
  total: number
}

export type ConstructionPhase = {
  name: string
  duration: string
  description: string
}

export type GeneratedPlan = {
  summary: string
  builtUpArea: string
  carpetArea: string
  cost: CostBreakdown
  timeline: string
  phases: ConstructionPhase[]
  recommendations: string[]
  disclaimer: string
}

export type PlanHistoryEntry = {
  id: string
  createdAt: string
  projectType: string
  location: string
  area: string
  floors: string
  budget: string
  timeline: string
  materials: string
  totalCost: number
  builtUpArea: string
  summary: string
  plan: GeneratedPlan
  selections: ConstructionSelections
}

export type BuildCivilAiPageView = 'history' | 'chat' | 'plan-result' | 'plan-detail'
