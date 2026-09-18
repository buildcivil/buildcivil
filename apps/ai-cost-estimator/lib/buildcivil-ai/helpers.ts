import { HISTORY_STORAGE_KEY, PROJECT_TYPE_OPTIONS } from './constants'
import type { ConstructionSelections, GeneratedPlan, PlanHistoryEntry } from './types'

export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function projectTypeLabel(id: string) {
  return PROJECT_TYPE_OPTIONS.find((option) => option.id === id)?.label ?? id
}

export function formatInr(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}

export function loadPlanHistory(): PlanHistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PlanHistoryEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function savePlanToHistory(
  selections: ConstructionSelections,
  plan: GeneratedPlan,
): PlanHistoryEntry[] {
  const entry: PlanHistoryEntry = {
    id: uid(),
    createdAt: new Date().toISOString(),
    projectType: selections.projectTypeLabel,
    location: selections.location,
    area: selections.area,
    floors: selections.floors,
    budget: selections.budget,
    timeline: selections.timeline,
    materials: selections.materials,
    totalCost: plan.cost.total,
    builtUpArea: plan.builtUpArea,
    summary: plan.summary,
    plan,
    selections,
  }

  const next = [entry, ...loadPlanHistory()].slice(0, 20)
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function getHistoryEntry(id: string): PlanHistoryEntry | null {
  return loadPlanHistory().find((entry) => entry.id === id) ?? null
}

export function deletePlanFromHistory(id: string): PlanHistoryEntry[] {
  const next = loadPlanHistory().filter((entry) => entry.id !== id)
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next))
  return next
}

const COST_LINE_LABELS: { key: keyof GeneratedPlan['cost']; label: string }[] = [
  { key: 'structure', label: 'Structure' },
  { key: 'finishing', label: 'Finishing' },
  { key: 'electrical', label: 'Electrical' },
  { key: 'plumbing', label: 'Plumbing' },
  { key: 'miscellaneous', label: 'Miscellaneous' },
]

export function formatPlanAsMessage(plan: GeneratedPlan) {
  const costLines = COST_LINE_LABELS.filter((item) => plan.cost[item.key] > 0).map(
    (item) => `• ${item.label}: ${formatInr(plan.cost[item.key])}`,
  )

  const lines = [
    plan.summary,
    '',
    `Built-up area: ${plan.builtUpArea}`,
    `Carpet area (est.): ${plan.carpetArea}`,
    `Timeline: ${plan.timeline}`,
    '',
    'Cost breakdown (INR):',
    ...costLines,
    `• Total estimate: ${formatInr(plan.cost.total)}`,
    '',
    'Construction phases:',
    ...plan.phases.map((phase, index) => `${index + 1}. ${phase.name} (${phase.duration}) — ${phase.description}`),
    '',
    'Recommendations:',
    ...plan.recommendations.map((item) => `• ${item}`),
    '',
    plan.disclaimer,
  ]

  return lines.join('\n')
}
