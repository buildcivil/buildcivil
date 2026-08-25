'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { constructionChat, generateConstructionPlanApi } from '@/lib/buildcivil-ai/client-api'
import {
  AREA_OPTIONS,
  BUDGET_OPTIONS,
  FLOOR_OPTIONS,
  LOCATION_OPTIONS,
  MATERIAL_OPTIONS,
  MSG,
  PROJECT_TYPE_OPTIONS,
  TIMELINE_OPTIONS,
  WELCOME_FALLBACK,
} from '@/lib/buildcivil-ai/constants'
import {
  deletePlanFromHistory,
  getHistoryEntry,
  loadPlanHistory,
  projectTypeLabel,
  savePlanToHistory,
  uid,
} from '@/lib/buildcivil-ai/helpers'
import type {
  BuildCivilAiPageView,
  ChatMessage,
  ConstructionSelections,
  FlowState,
  GeneratedPlan,
  PlanHistoryEntry,
  ProjectType,
} from '@/lib/buildcivil-ai/types'

const initialSelections: ConstructionSelections = {
  projectType: '',
  projectTypeLabel: '',
  location: '',
  area: '',
  floors: '',
  budget: '',
  timeline: '',
  materials: '',
}

const PLAN_READY_MESSAGE =
  'Your construction plan is ready. We have prepared a detailed breakdown with costs, phases, and recommendations for you to review.'

export function useBuildCivilAiChat() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const chatInitializedRef = useRef(false)

  const [pageView, setPageView] = useState<BuildCivilAiPageView>('chat')
  const [flow, setFlow] = useState<FlowState>({ kind: 'welcome' })
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selections, setSelections] = useState<ConstructionSelections>(initialSelections)
  const [history, setHistory] = useState<PlanHistoryEntry[]>([])
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null)
  const [viewingEntryId, setViewingEntryId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [chatLoading, setChatLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [historyReady, setHistoryReady] = useState(false)

  const busy = chatLoading || generating
  const viewingEntry = viewingEntryId ? getHistoryEntry(viewingEntryId) : null

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      viewportRef.current?.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      })
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    const stored = loadPlanHistory()
    setHistory(stored)
    setPageView(stored.length > 0 ? 'history' : 'chat')
    setHistoryReady(true)
  }, [])

  const initChat = useCallback(async () => {
    if (chatInitializedRef.current && messages.length > 0) return

    setChatLoading(true)
    try {
      const res = await constructionChat({ phase: 'welcome_intro' })
      setMessages([
        {
          id: uid(),
          role: 'assistant',
          content: res.message || WELCOME_FALLBACK,
        },
      ])
      chatInitializedRef.current = true
    } catch {
      setMessages([{ id: uid(), role: 'assistant', content: WELCOME_FALLBACK }])
      chatInitializedRef.current = true
    } finally {
      setChatLoading(false)
    }
  }, [messages.length])

  useEffect(() => {
    if (pageView === 'chat' && historyReady) {
      void initChat()
    }
  }, [pageView, historyReady, initChat])

  const pushUser = (content: string) => {
    setMessages((current) => [...current, { id: uid(), role: 'user', content }])
  }

  const pushAssistant = (content: string) => {
    setMessages((current) => [...current, { id: uid(), role: 'assistant', content }])
  }

  const assistantPhase = async (
    phase:
      | 'after_project_type'
      | 'after_location'
      | 'after_area'
      | 'after_floors'
      | 'after_budget'
      | 'after_timeline'
      | 'after_materials'
      | 'plan_generation_start',
    context: Record<string, string>,
  ) => {
    setChatLoading(true)
    setError(null)
    try {
      const res = await constructionChat({ phase, context })
      pushAssistant(res.message || WELCOME_FALLBACK)
    } catch {
      pushAssistant(MSG.assistantUnreachable)
    } finally {
      setChatLoading(false)
    }
  }

  const runGeneration = async (nextSelections: ConstructionSelections) => {
    setFlow({ kind: 'generating' })
    setGenerating(true)
    setError(null)

    try {
      await assistantPhase('plan_generation_start', nextSelections as unknown as Record<string, string>)

      const res = await generateConstructionPlanApi(nextSelections as unknown as Record<string, string>)
      if (res.error || !res.plan) {
        throw new Error(res.error || MSG.planGenError)
      }

      pushAssistant(PLAN_READY_MESSAGE)
      setGeneratedPlan(res.plan)
      setSelections(nextSelections)
      setFlow({ kind: 'complete' })
      setHistory(savePlanToHistory(nextSelections, res.plan))
      setPageView('plan-result')
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : MSG.planGenError)
      setFlow({ kind: 'planning', step: 'materials' })
    } finally {
      setGenerating(false)
    }
  }

  const selectProjectType = async (type: ProjectType) => {
    const label = projectTypeLabel(type)
    pushUser(label)
    const nextSelections = { ...selections, projectType: type, projectTypeLabel: label }
    setSelections(nextSelections)
    setFlow({ kind: 'planning', step: 'location' })
    await assistantPhase('after_project_type', nextSelections as unknown as Record<string, string>)
  }

  const selectLocation = async (location: string) => {
    pushUser(location)
    const nextSelections = { ...selections, location }
    setSelections(nextSelections)
    setFlow({ kind: 'planning', step: 'area' })
    await assistantPhase('after_location', nextSelections as unknown as Record<string, string>)
  }

  const selectArea = async (area: string) => {
    pushUser(area)
    const nextSelections = { ...selections, area }
    setSelections(nextSelections)
    setFlow({ kind: 'planning', step: 'floors' })
    await assistantPhase('after_area', nextSelections as unknown as Record<string, string>)
  }

  const selectFloors = async (floors: string) => {
    pushUser(floors)
    const nextSelections = { ...selections, floors }
    setSelections(nextSelections)
    setFlow({ kind: 'planning', step: 'budget' })
    await assistantPhase('after_floors', nextSelections as unknown as Record<string, string>)
  }

  const selectBudget = async (budget: string) => {
    pushUser(budget)
    const nextSelections = { ...selections, budget }
    setSelections(nextSelections)
    setFlow({ kind: 'planning', step: 'timeline' })
    await assistantPhase('after_budget', nextSelections as unknown as Record<string, string>)
  }

  const selectTimeline = async (timeline: string) => {
    pushUser(timeline)
    const nextSelections = { ...selections, timeline }
    setSelections(nextSelections)
    setFlow({ kind: 'planning', step: 'materials' })
    await assistantPhase('after_timeline', nextSelections as unknown as Record<string, string>)
  }

  const selectMaterials = async (materials: string) => {
    pushUser(materials)
    const nextSelections = { ...selections, materials }
    setSelections(nextSelections)
    await assistantPhase('after_materials', nextSelections as unknown as Record<string, string>)
    await runGeneration(nextSelections)
  }

  const resetChatState = () => {
    setFlow({ kind: 'welcome' })
    setSelections(initialSelections)
    setGeneratedPlan(null)
    setViewingEntryId(null)
    setError(null)
    setMessages([])
    chatInitializedRef.current = false
  }

  const openNewPlan = () => {
    resetChatState()
    setPageView('chat')
  }

  const goToHistory = () => {
    setViewingEntryId(null)
    setGeneratedPlan(null)
    setPageView('history')
  }

  const viewHistoryEntry = (id: string) => {
    const entry = getHistoryEntry(id)
    if (!entry?.plan) return
    setViewingEntryId(id)
    setPageView('plan-detail')
  }

  const removeHistoryEntry = (id: string) => {
    const next = deletePlanFromHistory(id)
    setHistory(next)
    if (viewingEntryId === id) {
      setViewingEntryId(null)
      setPageView(next.length > 0 ? 'history' : 'chat')
    }
    if (next.length === 0 && pageView === 'history') {
      resetChatState()
      setPageView('chat')
    }
  }

  const getOptions = () => {
    if (pageView !== 'chat') return null
    if (busy && flow.kind !== 'welcome' && flow.kind !== 'complete') return null

    if (flow.kind === 'welcome') {
      return {
        title: 'What would you like to plan?',
        options: PROJECT_TYPE_OPTIONS.map((option) => ({
          key: option.id,
          label: option.label,
          hint: option.hint,
          onClick: () => void selectProjectType(option.id),
        })),
      }
    }

    if (flow.kind !== 'planning') return null

    switch (flow.step) {
      case 'location':
        return {
          title: 'Project location',
          options: LOCATION_OPTIONS.map((option) => ({
            key: option.value,
            label: option.label,
            onClick: () => void selectLocation(option.value),
          })),
        }
      case 'area':
        return {
          title: 'Built-up / plot area',
          options: AREA_OPTIONS.map((option) => ({
            key: option.value,
            label: option.label,
            onClick: () => void selectArea(option.value),
          })),
        }
      case 'floors':
        return {
          title: 'Number of floors',
          options: FLOOR_OPTIONS.map((option) => ({
            key: option.value,
            label: option.label,
            onClick: () => void selectFloors(option.value),
          })),
        }
      case 'budget':
        return {
          title: 'Budget tier',
          options: BUDGET_OPTIONS.map((option) => ({
            key: option.value,
            label: option.label,
            hint: option.hint,
            onClick: () => void selectBudget(option.value),
          })),
        }
      case 'timeline':
        return {
          title: 'Preferred timeline',
          options: TIMELINE_OPTIONS.map((option) => ({
            key: option.value,
            label: option.label,
            onClick: () => void selectTimeline(option.value),
          })),
        }
      case 'materials':
        return {
          title: 'Material & finish preference',
          options: MATERIAL_OPTIONS.map((option) => ({
            key: option.value,
            label: option.label,
            onClick: () => void selectMaterials(option.value),
          })),
        }
      default:
        return null
    }
  }

  return {
    viewportRef,
    pageView,
    messages,
    flow,
    selections,
    history,
    generatedPlan,
    viewingEntry,
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
  }
}
