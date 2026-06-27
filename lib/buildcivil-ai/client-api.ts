import { readJsonResponse } from '@/lib/safe-json'
import type { ConstructionChatPhase } from '@/lib/buildcivil-ai/llm'
import type { GeneratedPlan } from '@/lib/buildcivil-ai/types'

export async function constructionChat(input: {
  phase: ConstructionChatPhase
  context?: Record<string, string>
}) {
  const response = await fetch('/api/buildcivil-ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  return readJsonResponse<{ message: string }>(response, { message: '' })
}

export async function generateConstructionPlanApi(selections: Record<string, string>) {
  const response = await fetch('/api/buildcivil-ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selections }),
  })

  return readJsonResponse<{ plan: GeneratedPlan }>(response, { plan: null as unknown as GeneratedPlan })
}
