import OpenAI, { APIError } from 'openai'
import { z } from 'zod'

import type { CostEstimateResult } from './estimate'
import type { GeneratedPlan } from './types'

function resolveBaseURL() {
  const raw = (
    process.env.LLM_BASE_URL ||
    process.env.OPENAI_BASE_URL ||
    'https://generativelanguage.googleapis.com/v1beta/openai'
  ).trim()
  const normalized = raw.replace(/\/+$/, '')
  if (normalized.endsWith('/openai')) return normalized
  return normalized.endsWith('/v1') ? normalized : `${normalized}/v1`
}

const apiKey = (
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_AI_API_KEY ||
  process.env.OPENAI_API_KEY ||
  process.env.LLM_API_KEY ||
  ''
).trim()

const baseURL = resolveBaseURL()
const isGeminiPrimary = baseURL.includes('generativelanguage.googleapis.com')

const openai = new OpenAI({
  apiKey: apiKey || 'missing-api-key',
  baseURL,
})

if (!apiKey) {
  console.error(
    '[BuildCivil AI][LLM] Missing GEMINI_API_KEY (or GOOGLE_AI_API_KEY). Get one at https://aistudio.google.com/app/apikey',
  )
}

const primaryModel = (
  process.env.GEMINI_MODEL ||
  process.env.OPENAI_MODEL ||
  (isGeminiPrimary ? 'gemini-2.5-flash' : 'gpt-4o-mini')
).trim()

const max429AttemptsPerModel = Math.min(
  5,
  Math.max(1, Number.parseInt(process.env.LLM_429_ATTEMPTS_PER_MODEL || '2', 10) || 2),
)

let lastSuccessfulModel: string | null = null

function geminiDefaultFallbacks() {
  return (
    process.env.GEMINI_MODEL_FALLBACKS ||
    process.env.LLM_MODEL_FALLBACKS ||
    'gemini-2.5-flash,gemini-2.0-flash,gemini-2.5-flash-lite,gemini-2.5-pro,gemini-3-flash-preview'
  )
}

function fallbackModelList() {
  const defaultFallbacks = isGeminiPrimary ? geminiDefaultFallbacks() : 'gpt-4o-mini,gpt-4-turbo'
  const fromEnv = defaultFallbacks
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  const seen = new Set<string>()
  const ordered: string[] = []
  for (const model of [primaryModel, ...fromEnv]) {
    if (!seen.has(model)) {
      seen.add(model)
      ordered.push(model)
    }
  }
  return ordered
}

function prioritizeLastSuccess(candidates: string[]) {
  if (!lastSuccessfulModel || !candidates.includes(lastSuccessfulModel)) return candidates
  return [lastSuccessfulModel, ...candidates.filter((model) => model !== lastSuccessfulModel)]
}

type TryCreateResult =
  | { ok: true; completion: OpenAI.Chat.ChatCompletion }
  | { ok: false; lastError: unknown; exhausted404: boolean }

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function createChatWith429Retries(
  client: OpenAI,
  model: string,
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  temperature: number,
  logLabel: string,
) {
  let lastError: unknown

  for (let attempt = 0; attempt < max429AttemptsPerModel; attempt++) {
    try {
      return await client.chat.completions.create({
        model,
        messages,
        temperature,
      })
    } catch (error) {
      lastError = error
      const is429 = error instanceof APIError && error.status === 429
      if (!is429) throw error
      if (attempt >= max429AttemptsPerModel - 1) throw error

      const header = error instanceof APIError && error.headers ? error.headers.get('retry-after') : null
      const retryAfterSec = header ? Number.parseFloat(header) : Number.NaN
      const waitMs =
        Number.isFinite(retryAfterSec) && retryAfterSec >= 0
          ? Math.min(5000, Math.max(300, retryAfterSec * 1000))
          : Math.min(2000, 800 * (attempt + 1))

      console.warn(
        `${logLabel} Model "${model}" rate limited (429). Waiting ${Math.round(waitMs / 1000)}s (attempt ${attempt + 1}/${max429AttemptsPerModel})…`,
      )
      await sleep(waitMs)
    }
  }

  throw lastError
}

async function tryCreateWithClient(
  client: OpenAI,
  models: string[],
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  temperature: number,
  logLabel: string,
): Promise<TryCreateResult> {
  let lastError: unknown

  for (let index = 0; index < models.length; index++) {
    const model = models[index]!
    try {
      const completion = await createChatWith429Retries(
        client,
        model,
        messages,
        temperature,
        logLabel,
      )
      lastSuccessfulModel = model
      if (index > 0) {
        console.warn(`${logLabel} Succeeded with fallback model "${model}".`)
      }
      return { ok: true, completion }
    } catch (error) {
      lastError = error
      const is404 = error instanceof APIError && error.status === 404
      const is429 = error instanceof APIError && error.status === 429

      if (is404 && index < models.length - 1) {
        console.warn(`${logLabel} Model "${model}" unavailable (404). Trying next model…`)
        continue
      }
      if (is404 && index === models.length - 1) {
        return { ok: false, lastError: error, exhausted404: true }
      }

      if (is429 && index < models.length - 1) {
        console.warn(`${logLabel} Model "${model}" rate limited after retries. Trying next model…`)
        continue
      }

      if (error instanceof APIError) {
        console.error(`${logLabel} APIError on "${model}":`, error.status, error.message)
      }
      return { ok: false, lastError: error, exhausted404: false }
    }
  }

  return { ok: false, lastError, exhausted404: false }
}

function buildGeminiClient() {
  const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '').trim()
  if (!geminiKey) return null

  return new OpenAI({
    apiKey: geminiKey,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
  })
}

function geminiModelList() {
  const gemPrimary = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim()
  const gemExtras = geminiDefaultFallbacks()
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  return prioritizeLastSuccess([gemPrimary, ...gemExtras.filter((item) => item !== gemPrimary)])
}

async function chatCompletionCreate(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  temperature: number,
) {
  const primary = await tryCreateWithClient(
    openai,
    prioritizeLastSuccess(fallbackModelList()),
    messages,
    temperature,
    '[BuildCivil AI][LLM]',
  )
  if (primary.ok) return primary.completion

  const geminiClient = buildGeminiClient()
  const shouldTryGemini =
    geminiClient &&
    !isGeminiPrimary &&
    primary.exhausted404 &&
    primary.lastError instanceof APIError &&
    primary.lastError.status === 404

  if (shouldTryGemini) {
    console.warn('[BuildCivil AI][LLM] Primary host returned 404 for every model. Retrying with Google Gemini…')
    const secondary = await tryCreateWithClient(
      geminiClient,
      geminiModelList(),
      messages,
      temperature,
      '[BuildCivil AI][LLM][Gemini]',
    )
    if (secondary.ok) return secondary.completion
    throw secondary.lastError
  }

  if (!primary.ok && geminiClient && isGeminiPrimary && primary.exhausted404) {
    console.warn('[BuildCivil AI][LLM] All primary Gemini models returned 404. Retrying expanded fallback list…')
    const retry = await tryCreateWithClient(
      geminiClient,
      geminiModelList(),
      messages,
      temperature,
      '[BuildCivil AI][LLM][Gemini-retry]',
    )
    if (retry.ok) return retry.completion
    throw retry.lastError
  }

  throw primary.lastError
}

function extractJson(text: string) {
  const trimmed = text.trim()
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed

  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1)
  }

  return trimmed
}

const PlanChatResponseSchema = z.object({
  message: z.string().min(1),
})

const CostBreakdownSchema = z.object({
  structure: z.number().nonnegative(),
  finishing: z.number().nonnegative(),
  electrical: z.number().nonnegative(),
  plumbing: z.number().nonnegative(),
  miscellaneous: z.number().nonnegative(),
  total: z.number().nonnegative(),
})

const ConstructionPhaseSchema = z.object({
  name: z.string().min(1),
  duration: z.string().min(1),
  description: z.string().min(1),
})

export const ConstructionPlanSchema = z.object({
  summary: z.string().min(1),
  builtUpArea: z.string().min(1),
  carpetArea: z.string().min(1),
  cost: CostBreakdownSchema,
  timeline: z.string().min(1),
  phases: z.array(ConstructionPhaseSchema).min(3).max(8),
  recommendations: z.array(z.string().min(1)).min(2).max(6),
  disclaimer: z.string().min(1),
})

export const CONSTRUCTION_CHAT_PHASES = [
  'welcome_intro',
  'after_project_type',
  'after_location',
  'after_area',
  'after_floors',
  'after_budget',
  'after_timeline',
  'after_materials',
  'plan_generation_start',
] as const

export type ConstructionChatPhase = (typeof CONSTRUCTION_CHAT_PHASES)[number]

const PHASE_INSTRUCTIONS: Record<ConstructionChatPhase, string> = {
  welcome_intro:
    'Greet the user warmly in 2–3 short sentences. Explain that BuildCivil AI will guide them through curated options to produce a construction estimate and phase plan. Mention they should pick a project type below.',
  after_project_type:
    'Acknowledge their project type from context. Ask them to choose a project location from the options shown.',
  after_location:
    'Acknowledge their location from context. Ask them to select the approximate built-up or plot area range.',
  after_area:
    'Acknowledge their area selection from context. Ask how many floors they are planning.',
  after_floors:
    'Acknowledge their floor count from context. Ask them to pick a budget tier that matches their expectations.',
  after_budget:
    'Acknowledge their budget tier from context. Ask them to choose a preferred project timeline.',
  after_timeline:
    'Acknowledge their timeline from context. Ask them to pick a material / finish preference.',
  after_materials:
    'Acknowledge all their selections from context. Tell them you are ready to generate a detailed construction plan with cost breakdown and phases. Keep it brief and encouraging.',
  plan_generation_start:
    'Tell the user their personalized construction plan is being prepared. One or two short encouraging sentences using their selections from context.',
}

async function callWithRetry<T>({
  schema,
  systemPrompt,
  userPrompt,
  retries,
}: {
  schema: z.ZodType<T>
  systemPrompt: string
  userPrompt: string
  retries: number
}) {
  let lastError: unknown
  let currentUserPrompt = userPrompt

  for (let attempt = 0; attempt <= retries; attempt++) {
    let content = ''
    try {
      const completion = await chatCompletionCreate(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: currentUserPrompt },
        ],
        0.35,
      )
      content = completion.choices[0]?.message?.content || ''
    } catch (error) {
      throw error
    }

    try {
      const json = JSON.parse(extractJson(content)) as unknown
      return schema.parse(json)
    } catch (error) {
      lastError = error
    }

    if (attempt < retries) {
      currentUserPrompt = `${currentUserPrompt}\n\nYour previous output was invalid. Return ONLY valid JSON matching the schema exactly. No markdown or code fences.`
    }
  }

  throw lastError
}

export function isLlmConfigured() {
  return Boolean(apiKey)
}

export async function constructionAssistantResponse(input: {
  phase: ConstructionChatPhase
  context?: Record<string, string>
}) {
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY or GOOGLE_AI_API_KEY')
  }

  const instruction = PHASE_INSTRUCTIONS[input.phase]
  const systemPrompt = [
    'You are BuildCivil AI, a warm and practical construction planning assistant for Indian residential and commercial projects.',
    'Always return valid JSON only with a single key "message" containing plain text (no markdown).',
    'Keep responses concise: 2–4 sentences max.',
    'Use Indian construction context (sq ft, INR, local cities).',
  ].join(' ')

  const userPrompt = [
    `Phase: ${input.phase}`,
    `Instruction: ${instruction}`,
    `Context JSON: ${JSON.stringify(input.context ?? {})}`,
    'Return ONLY JSON: {"message":"..."}',
  ].join('\n\n')

  let lastError: unknown
  let correction = ''

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const completion = await chatCompletionCreate(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt + correction },
        ],
        0.55,
      )
      const raw = completion.choices[0]?.message?.content || ''
      const json = JSON.parse(extractJson(raw)) as unknown
      return PlanChatResponseSchema.parse(json)
    } catch (error) {
      lastError = error
      correction = '\n\nYour previous output was invalid. Return ONLY valid JSON with a "message" string.'
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Construction chat failed')
}

function projectTypePlanGuidance(projectType: string) {
  if (projectType === 'interior') {
    return [
      'This is an INTERIOR DESIGN / fit-out project — NOT full building construction.',
      'Phases must cover design, site prep, carpentry/finishes, and handover only.',
      'Do NOT invent foundation, RCC frame, full civil structure, or full MEP package phases.',
      'cost.structure, cost.electrical, and cost.plumbing MUST be 0. Narrative should focus on interiors and finishes only.',
    ].join(' ')
  }

  if (projectType === 'renovation') {
    return [
      'This is a RENOVATION project — emphasize selective civil works, MEP upgrades, and refinishing.',
      'Do NOT describe a full new-build from foundation unless structural strengthening is relevant.',
    ].join(' ')
  }

  return 'This is a full construction project. Include design/approvals, structure, MEP, finishing, and handover phases.'
}

export async function generateConstructionPlan(
  input: Record<string, string>,
  costEstimate: CostEstimateResult,
): Promise<GeneratedPlan> {
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY or GOOGLE_AI_API_KEY')
  }

  const projectType = input.projectType || 'residential'
  const requiredCost = costEstimate.cost

  const systemPrompt = [
    'You are a senior Indian construction estimator and project planner.',
    'Return valid JSON only (no markdown, no code fences).',
    'All cost numbers must be in INR (Indian Rupees) as plain numbers without commas.',
    'CRITICAL: Use the EXACT cost breakdown provided in the user prompt. Do not invent, round differently, or recalculate costs.',
    'CRITICAL: Tailor summary, phases, and recommendations to the specific project type, city, floors, and budget — never reuse a generic full-build template for interior or renovation.',
    'Total cost must equal structure + finishing + electrical + plumbing + miscellaneous.',
  ].join(' ')

  const userPrompt = [
    'Generate a construction plan from these selections:',
    JSON.stringify(input, null, 2),
    '',
    'Deterministic cost inputs (MUST use these exact cost numbers):',
    JSON.stringify(
      {
        areaPerFloorSqFt: costEstimate.areaPerFloor,
        floorCount: costEstimate.floorCount,
        totalBuiltUpSqFt: costEstimate.totalBuiltUpSqFt,
        ratePerSqFtInr: costEstimate.ratePerSqFt,
        cityMultiplier: costEstimate.cityMultiplier,
        cost: requiredCost,
      },
      null,
      2,
    ),
    '',
    projectTypePlanGuidance(projectType),
    '',
    'Return a JSON object with keys:',
    'summary (2-3 sentence overview that mentions city, floors, project type, and approx total built-up),',
    `builtUpArea (string; use about ${costEstimate.totalBuiltUpSqFt} sq ft total),`,
    `carpetArea (about ${Math.round(costEstimate.totalBuiltUpSqFt * 0.75)} sq ft),`,
    'cost (object — COPY these exact numbers:',
    JSON.stringify(requiredCost),
    '),',
    'timeline (human-readable duration string aligned with the preferred timeline),',
    'phases (array of 4-6 objects with name, duration, description — scoped to the project type),',
    'recommendations (array of 3-5 practical tips specific to this selection),',
    'disclaimer (short note that this is an AI estimate and site visit is needed for final quote).',
  ].join('\n')

  const parsed = await callWithRetry({
    schema: ConstructionPlanSchema,
    systemPrompt,
    userPrompt,
    retries: 2,
  })

  // Always trust the deterministic estimator for money figures so city / floors / type stay consistent.
  return {
    ...parsed,
    cost: requiredCost,
  }
}

export function fallbackChatMessage(phase: ConstructionChatPhase, context?: Record<string, string>) {
  switch (phase) {
    case 'welcome_intro':
      return 'Welcome to BuildCivil AI. Choose a project type below and we will walk you through location, area, floors, budget, timeline, and finishes to produce your construction plan.'
    case 'after_project_type':
      return `Great choice — ${context?.projectTypeLabel ?? 'your project'}. Which city or region is your project in?`
    case 'after_location':
      return `Noted — ${context?.location ?? 'your location'}. What is the approximate built-up or plot area?`
    case 'after_area':
      return `Got it — ${context?.area ?? 'your area range'}. How many floors are you planning?`
    case 'after_floors':
      return `Understood — ${context?.floors ?? 'your floor plan'}. Pick a budget tier that fits your expectations.`
    case 'after_budget':
      return `Budget tier set to ${context?.budget ?? 'your selection'}. What timeline works for you?`
    case 'after_timeline':
      return `Timeline noted — ${context?.timeline ?? 'your timeline'}. Choose your preferred material and finish level.`
    case 'after_materials':
      return 'Perfect. All details collected — generating your personalized construction plan now.'
    case 'plan_generation_start':
      return 'Building your construction estimate and phase-wise roadmap…'
    default:
      return 'Welcome to BuildCivil AI. Choose a project type below to begin your guided construction plan.'
  }
}
