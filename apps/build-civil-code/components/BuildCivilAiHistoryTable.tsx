'use client'

import { Eye, Plus, Trash2 } from 'lucide-react'

import { formatDate, formatInr } from '@/lib/buildcivil-ai/helpers'
import type { PlanHistoryEntry } from '@/lib/buildcivil-ai/types'

type BuildCivilAiHistoryTableProps = {
  history: PlanHistoryEntry[]
  onView: (id: string) => void
  onDelete: (id: string) => void
  onNewPlan: () => void
}

export default function BuildCivilAiHistoryTable({
  history,
  onView,
  onDelete,
  onNewPlan,
}: BuildCivilAiHistoryTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark sm:text-3xl">Your saved plans</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60 sm:text-base">
            Welcome back. Review past estimates or start a fresh guided session for a new project.
          </p>
        </div>
        <button type="button" onClick={onNewPlan} className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm">
          <Plus className="h-4 w-4" />
          Create new plan
        </button>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white px-6 py-12 text-center">
          <p className="text-sm text-black/60">No saved plans yet. Start your first guided construction estimate.</p>
          <button type="button" onClick={onNewPlan} className="btn-primary mt-5 inline-flex items-center gap-2 px-5 py-3 text-sm">
            <Plus className="h-4 w-4" />
            Start planning
          </button>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-[960px] w-full text-left text-sm">
                <thead className="border-b border-black/10 bg-base/70 text-xs uppercase tracking-wide text-black/55">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Date</th>
                    <th className="px-5 py-3.5 font-semibold">Project</th>
                    <th className="px-5 py-3.5 font-semibold">Location</th>
                    <th className="px-5 py-3.5 font-semibold">Area</th>
                    <th className="px-5 py-3.5 font-semibold">Budget</th>
                    <th className="px-5 py-3.5 font-semibold">Estimate</th>
                    <th className="px-5 py-3.5 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr key={entry.id} className="border-b border-black/5 transition-colors last:border-0 hover:bg-base/30">
                      <td className="px-5 py-4 text-black/70">{formatDate(entry.createdAt)}</td>
                      <td className="px-5 py-4 font-medium text-brand-dark">{entry.projectType}</td>
                      <td className="px-5 py-4">{entry.location}</td>
                      <td className="px-5 py-4">{entry.area}</td>
                      <td className="px-5 py-4">{entry.budget}</td>
                      <td className="px-5 py-4 font-semibold text-brand-dark">{formatInr(entry.totalCost)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => onView(entry.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-header transition hover:border-header/30 hover:bg-header/10"
                            aria-label={`View plan for ${entry.projectType}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(entry.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-red-600 transition hover:border-red-200 hover:bg-red-50"
                            aria-label={`Delete plan for ${entry.projectType}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 lg:hidden">
            {history.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-dark">{entry.projectType}</p>
                    <p className="mt-1 text-xs text-black/55">{formatDate(entry.createdAt)}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-brand-dark">{formatInr(entry.totalCost)}</p>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-black/70">
                  <div>
                    <dt className="text-black/45">Location</dt>
                    <dd>{entry.location}</dd>
                  </div>
                  <div>
                    <dt className="text-black/45">Area</dt>
                    <dd>{entry.area}</dd>
                  </div>
                  <div>
                    <dt className="text-black/45">Budget</dt>
                    <dd>{entry.budget}</dd>
                  </div>
                  <div>
                    <dt className="text-black/45">Built-up</dt>
                    <dd>{entry.builtUpArea}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onView(entry.id)}
                    className="btn-secondary inline-flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
