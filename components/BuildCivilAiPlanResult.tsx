'use client'

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  IndianRupee,
  Layers3,
  Lightbulb,
  MapPin,
  Ruler,
  Sparkles,
} from 'lucide-react'

import { formatDate, formatInr } from '@/lib/buildcivil-ai/helpers'
import type { ConstructionSelections, GeneratedPlan } from '@/lib/buildcivil-ai/types'

type BuildCivilAiPlanResultProps = {
  plan: GeneratedPlan
  selections: ConstructionSelections
  createdAt?: string
  onBack?: () => void
  onNewPlan?: () => void
}

const costLabels: { key: keyof GeneratedPlan['cost']; label: string }[] = [
  { key: 'structure', label: 'Structure & civil work' },
  { key: 'finishing', label: 'Finishing & interiors' },
  { key: 'electrical', label: 'Electrical & lighting' },
  { key: 'plumbing', label: 'Plumbing & sanitary' },
  { key: 'miscellaneous', label: 'Miscellaneous & contingency' },
]

export default function BuildCivilAiPlanResult({
  plan,
  selections,
  createdAt,
  onBack,
  onNewPlan,
}: BuildCivilAiPlanResultProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="badge badge-orange mb-3 inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Your construction plan
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
            {selections.projectTypeLabel || 'Project estimate'}
          </h2>
          {createdAt ? <p className="mt-2 text-sm text-black/55">Generated {formatDate(createdAt)}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {onBack ? (
            <button type="button" onClick={onBack} className="btn-secondary inline-flex items-center gap-2 px-4 py-2.5 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : null}
          {onNewPlan ? (
            <button type="button" onClick={onNewPlan} className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm">
              Start new plan
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-header/20 bg-gradient-to-br from-header/10 via-white to-highlight/10 p-5 sm:p-6">
        <p className="text-base leading-relaxed text-brand-dark sm:text-lg">{plan.summary}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: MapPin, label: 'Location', value: selections.location },
          { icon: Ruler, label: 'Built-up area', value: plan.builtUpArea },
          { icon: Layers3, label: 'Floors', value: selections.floors },
          { icon: CalendarDays, label: 'Timeline', value: plan.timeline },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/45">
              <item.icon className="h-4 w-4 text-header" />
              {item.label}
            </div>
            <p className="mt-2 text-sm font-semibold text-brand-dark sm:text-base">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-highlight" />
            <h3 className="text-lg font-bold text-brand-dark">Cost breakdown</h3>
          </div>
          <ul className="mt-5 space-y-3">
            {costLabels.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-3 border-b border-black/5 pb-3 last:border-0 last:pb-0">
                <span className="text-sm text-black/65">{item.label}</span>
                <span className="text-sm font-semibold text-brand-dark">{formatInr(plan.cost[item.key])}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl bg-brand-dark px-4 py-3 text-white">
            <p className="text-xs uppercase tracking-wide text-white/70">Total estimated cost</p>
            <p className="mt-1 text-2xl font-bold">{formatInr(plan.cost.total)}</p>
          </div>
          <p className="mt-3 text-xs text-black/50">Carpet area (est.): {plan.carpetArea}</p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 lg:col-span-3">
          <h3 className="text-lg font-bold text-brand-dark">Construction phases</h3>
          <ol className="mt-5 space-y-4">
            {plan.phases.map((phase, index) => (
              <li key={`${phase.name}-${index}`} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-header/15 text-sm font-bold text-header">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-brand-dark">{phase.name}</p>
                    <span className="rounded-full bg-base px-2.5 py-0.5 text-xs font-medium text-black/60">{phase.duration}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-black/65">{phase.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-highlight" />
            <h3 className="text-lg font-bold text-brand-dark">Recommendations</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {plan.recommendations.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-black/70">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-header" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-black/10 bg-base/50 p-5 sm:p-6">
          <h3 className="text-lg font-bold text-brand-dark">Project selections</h3>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ['Budget tier', selections.budget],
              ['Materials', selections.materials],
              ['Plot / area', selections.area],
              ['Preferred timeline', selections.timeline],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white px-3 py-2.5">
                <dt className="text-xs uppercase tracking-wide text-black/45">{label}</dt>
                <dd className="mt-1 text-sm font-medium text-brand-dark">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-black/55">{plan.disclaimer}</p>
        </div>
      </div>
    </div>
  )
}
