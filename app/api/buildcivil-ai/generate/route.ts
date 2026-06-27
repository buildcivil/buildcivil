import { NextResponse } from 'next/server'
import { z } from 'zod'

import { generateConstructionPlan, isLlmConfigured } from '@/lib/buildcivil-ai/llm'
import { checkRateLimit, enforceSameOrigin, getClientIp, rateLimitError } from '@/lib/request-security'

const bodySchema = z.object({
  selections: z.record(z.string(), z.string()),
})

function fallbackPlan(selections: Record<string, string>) {
  const areaMid = selections.area?.includes('5,000+')
    ? 6000
    : selections.area?.includes('3,000')
      ? 4000
      : selections.area?.includes('2,000')
        ? 2500
        : selections.area?.includes('1,000 – 2,000')
          ? 1500
          : 800

  const rate =
    selections.budget === 'Luxury'
      ? 3200
      : selections.budget === 'Premium'
        ? 2600
        : selections.budget === 'Standard'
          ? 1900
          : 1400

  const structure = Math.round(areaMid * rate * 0.45)
  const finishing = Math.round(areaMid * rate * 0.28)
  const electrical = Math.round(areaMid * rate * 0.1)
  const plumbing = Math.round(areaMid * rate * 0.08)
  const miscellaneous = Math.round(areaMid * rate * 0.09)
  const total = structure + finishing + electrical + plumbing + miscellaneous

  return {
    summary: `Based on your ${selections.projectTypeLabel ?? 'project'} in ${selections.location ?? 'your city'}, this is an indicative plan for roughly ${areaMid.toLocaleString('en-IN')} sq ft with ${selections.floors ?? 'your chosen floors'}.`,
    builtUpArea: `${areaMid.toLocaleString('en-IN')} sq ft (indicative)`,
    carpetArea: `${Math.round(areaMid * 0.75).toLocaleString('en-IN')} sq ft (est. 75% of built-up)`,
    cost: { structure, finishing, electrical, plumbing, miscellaneous, total },
    timeline: selections.timeline ?? '12 – 18 months',
    phases: [
      { name: 'Design & approvals', duration: '4–8 weeks', description: 'Architectural drawings, structural design, and local approvals.' },
      { name: 'Foundation & structure', duration: '3–5 months', description: 'Excavation, RCC frame, block work, and slab cycles per floor.' },
      { name: 'MEP & roofing', duration: '2–3 months', description: 'Electrical conduits, plumbing, waterproofing, and roof completion.' },
      { name: 'Finishing & handover', duration: '3–4 months', description: 'Flooring, paint, kitchens, bathrooms, fixtures, and snag list.' },
    ],
    recommendations: [
      'Book a site visit before finalizing structural and finish specifications.',
      'Keep 8–12% contingency for material price changes and design revisions.',
      'Align electrical and plumbing layouts before plaster work begins.',
    ],
    disclaimer:
      'This is an AI-generated indicative estimate for planning purposes only. Final cost and timeline require a site survey and detailed BOQ from BuildCivil.',
  }
}

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

  if (!isLlmConfigured()) {
    return NextResponse.json({ plan: fallbackPlan(selections), fallback: true })
  }

  try {
    const plan = await generateConstructionPlan(selections)
    return NextResponse.json({ plan })
  } catch (error) {
    console.error('BuildCivil AI generate error:', error)
    return NextResponse.json({ plan: fallbackPlan(selections), fallback: true })
  }
}
