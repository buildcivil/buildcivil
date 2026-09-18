'use client'

import {
  ArrowLeft,
  Building2,
  Calculator,
  ClipboardList,
  HardHat,
  Loader2,
  Sparkles,
} from 'lucide-react'

import AppHeader from '@/components/AppHeader'
import BuildCivilAiHistoryTable from '@/components/BuildCivilAiHistoryTable'
import BuildCivilAiPlanResult from '@/components/BuildCivilAiPlanResult'
import { useBuildCivilAiChat } from '@/features/buildcivil-ai/use-buildcivil-ai-chat'
import { LEFT_COLUMN_FEATURES } from '@/lib/buildcivil-ai/constants'

function SelectableOption({
  label,
  hint,
  disabled,
  onClick,
}: {
  label: string
  hint?: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="group w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-left transition hover:border-header/40 hover:bg-header/5 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="block text-sm font-semibold text-brand-dark transition group-hover:text-header">{label}</span>
      {hint ? <span className="mt-1 block text-xs leading-relaxed text-black/60">{hint}</span> : null}
    </button>
  )
}

function ChatIntroColumn() {
  return (
    <div className="max-w-xl space-y-6 sm:space-y-8">
      <div>
        <span className="badge badge-orange mb-4 inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5" />
          BuildCivil AI
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl lg:text-4xl">
          Plan your construction by chat
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-black/70 sm:mt-4 sm:text-base">
          Answer a short series of guided choices and get a tailored construction estimate with area,
          cost breakdown, and phase-wise roadmap — built for Indian projects.
        </p>
      </div>

      <ul className="space-y-4 sm:space-y-5">
        {LEFT_COLUMN_FEATURES.map((feature, index) => {
          const icons = [HardHat, Calculator, ClipboardList]
          const Icon = icons[index] ?? Building2
          return (
            <li key={feature.title} className="flex gap-3 sm:gap-4">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-header/15 text-header">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-brand-dark">{feature.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-black/65">{feature.description}</p>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
        <p className="text-sm font-semibold text-brand-dark">How it works</p>
        <ul className="mt-3 space-y-2 text-sm text-black/70">
          <li>• Choose project type, city, area, and floors</li>
          <li>• Set budget tier, timeline, and finish preference</li>
          <li>• Review a full stacked plan with INR cost breakdown</li>
        </ul>
      </div>
    </div>
  )
}

export default function AiCostEstimatorPageClient() {
  const {
    viewportRef,
    pageView,
    messages,
    history,
    generatedPlan,
    viewingEntry,
    selections,
    error,
    chatLoading,
    generating,
    busy,
    historyReady,
    getOptions,
    openNewPlan,
    goToHistory,
    viewHistoryEntry,
    removeHistoryEntry,
  } = useBuildCivilAiChat()

  const optionSet = getOptions()

  return (
    <main className="min-h-screen bg-white">
      <AppHeader />

      <section className="relative overflow-hidden pt-6 sm:pt-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-header/10 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          {!historyReady ? (
            <div className="flex min-h-[50vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-header" />
            </div>
          ) : null}

          {historyReady && pageView === 'history' ? (
            <BuildCivilAiHistoryTable
              history={history}
              onView={viewHistoryEntry}
              onDelete={removeHistoryEntry}
              onNewPlan={openNewPlan}
            />
          ) : null}

          {historyReady && pageView === 'chat' ? (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-12">
              <ChatIntroColumn />

              <div className="flex min-h-[min(72vh,760px)] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_50px_rgba(28,23,18,0.08)]">
                <div className="border-b border-black/10 bg-base/40 px-4 py-4 sm:px-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-brand-dark">Construction planner</h2>
                      <p className="mt-1 text-sm text-black/60">
                        Pick from the options below at each step — no typing needed.
                      </p>
                    </div>
                    {history.length > 0 ? (
                      <button
                        type="button"
                        onClick={goToHistory}
                        className="btn-secondary shrink-0 px-3 py-2 text-xs sm:text-sm"
                      >
                        Saved plans
                      </button>
                    ) : null}
                  </div>
                </div>

                <div
                  ref={viewportRef}
                  className="min-h-[280px] flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:min-h-[320px] sm:px-6 sm:py-5"
                >
                  {messages.length === 0 && chatLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-header" />
                    </div>
                  ) : null}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[88%] ${
                          message.role === 'user'
                            ? 'bg-header text-white shadow-sm'
                            : 'bg-base text-brand-dark'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}

                  {(chatLoading || generating) && messages.length > 0 ? (
                    <div className="flex items-center gap-2 rounded-xl bg-base/80 px-3 py-2 text-sm text-black/55">
                      <Loader2 className="h-4 w-4 animate-spin text-header" />
                      {generating ? 'Generating your construction plan…' : 'BuildCivil AI is thinking…'}
                    </div>
                  ) : null}
                </div>

                <div className="border-t border-black/10 bg-white px-4 py-4 sm:px-6">
                  {optionSet ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-brand-dark">{optionSet.title}</p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {optionSet.options.map((option) => (
                          <SelectableOption
                            key={option.key}
                            label={option.label}
                            hint={'hint' in option && typeof option.hint === 'string' ? option.hint : undefined}
                            disabled={busy}
                            onClick={option.onClick}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {error ? (
                    <p className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {historyReady && pageView === 'plan-result' && generatedPlan ? (
            <BuildCivilAiPlanResult
              plan={generatedPlan}
              selections={selections}
              createdAt={new Date().toISOString()}
              onBack={history.length > 0 ? goToHistory : undefined}
              onNewPlan={openNewPlan}
            />
          ) : null}

          {historyReady && pageView === 'plan-detail' && viewingEntry?.plan ? (
            <BuildCivilAiPlanResult
              plan={viewingEntry.plan}
              selections={viewingEntry.selections}
              createdAt={viewingEntry.createdAt}
              onBack={goToHistory}
              onNewPlan={openNewPlan}
            />
          ) : null}

          {historyReady && pageView === 'plan-detail' && viewingEntry && !viewingEntry.plan ? (
            <div className="rounded-2xl border border-black/10 bg-white p-8 text-center">
              <p className="text-sm text-black/60">
                This saved plan cannot be opened because it was created before detailed storage was enabled.
              </p>
              <button type="button" onClick={goToHistory} className="btn-secondary mt-4 inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to saved plans
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <footer className="border-t border-black/10 py-8 text-center text-xs text-black/45">
        BuildCivil AI Cost Estimator
      </footer>
    </main>
  )
}
