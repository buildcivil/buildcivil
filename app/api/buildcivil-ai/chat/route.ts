import { NextResponse } from 'next/server'
import { z } from 'zod'

import {
  CONSTRUCTION_CHAT_PHASES,
  constructionAssistantResponse,
  fallbackChatMessage,
  isLlmConfigured,
} from '@/lib/buildcivil-ai/llm'
import { checkRateLimit, enforceSameOrigin, getClientIp, rateLimitError } from '@/lib/request-security'

const phaseList = CONSTRUCTION_CHAT_PHASES as readonly string[]

const bodySchema = z.object({
  phase: z.string().refine((value): value is (typeof CONSTRUCTION_CHAT_PHASES)[number] => phaseList.includes(value), {
    message: 'Invalid phase',
  }),
  context: z.record(z.string(), z.string()).optional(),
})

export async function POST(request: Request) {
  const sameOriginError = enforceSameOrigin(request)
  if (sameOriginError) return sameOriginError

  const ip = getClientIp(request)
  const rateLimit = checkRateLimit({
    namespace: 'buildcivil-ai-chat',
    key: ip,
    limit: 30,
    windowMs: 10 * 60 * 1000,
  })
  if (!rateLimit.ok) {
    return rateLimitError('Too many AI requests. Please try again shortly.', rateLimit.retryAfterSeconds)
  }

  const body = await request.json()
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid chat input.' }, { status: 400 })
  }

  if (!isLlmConfigured()) {
    return NextResponse.json({
      message: fallbackChatMessage(parsed.data.phase, parsed.data.context),
      fallback: true,
    })
  }

  try {
    const result = await constructionAssistantResponse({
      phase: parsed.data.phase,
      context: parsed.data.context,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error('BuildCivil AI chat error:', error)
    return NextResponse.json({
      message: fallbackChatMessage(parsed.data.phase, parsed.data.context),
      fallback: true,
    })
  }
}
