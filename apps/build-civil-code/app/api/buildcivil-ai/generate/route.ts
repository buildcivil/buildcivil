import { NextResponse } from 'next/server'
import { z } from 'zod'

import { buildIndicativePlan, estimateConstructionCost } from '@/lib/buildcivil-ai/estimate'
import { generateConstructionPlan, isLlmConfigured } from '@/lib/buildcivil-ai/llm'
import type { ProjectType } from '@/lib/buildcivil-ai/types'
import { checkRateLimit, enforceSameOrigin, getClientIp, rateLimitError } from '@/lib/request-security'

const bodySchema = z.object({
  selections: z.record(z.string(), z.string()),
})

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request)
  if (sameOriginError) return sameOriginError

  const ip = getClientIp(request)
  const rateLimit = checkRateLimit({
    namespace: 'buildcivil-ai-generate',
    key: ip,
    limit: 10,
    windowMs: 10 * 60 * 1000,
  })
  if (!rateLimit.ok) {
    return rateLimitError('Too many plan requests. Please try again shortly.', rateLimit.retryAfterSeconds)
  }

  const body = await request.json()
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid plan input.' }, { status: 400 })
  }

  const { selections } = parsed.data
  if (!selections.projectTypeLabel || !selections.location || !selections.area) {
    return NextResponse.json({ error: 'Incomplete selections.' }, { status: 400 })
  }

  const costEstimate = estimateConstructionCost({
    projectType: (selections.projectType || 'residential') as ProjectType,
    projectTypeLabel: selections.projectTypeLabel,
    location: selections.location,
    area: selections.area,
    floors: selections.floors || 'Ground floor only',
    budget: selections.budget || 'Standard',
    materials: selections.materials || 'Standard finishes',
  })

  if (!isLlmConfigured()) {
    return NextResponse.json({ plan: buildIndicativePlan(selections), fallback: true })
  }

  try {
    const plan = await generateConstructionPlan(selections, costEstimate)
    return NextResponse.json({ plan })
  } catch (error) {
    console.error('BuildCivil AI generate error:', error)
    return NextResponse.json({ plan: buildIndicativePlan(selections), fallback: true })
  }
}
