type GenerateDesignInput = {
  roomType: string
  designStyle: string
  numDesigns: number
  imageBase64: string
  mimeType: string
}

export type GeneratedDesign = {
  id: string
  mimeType: string
  imageBase64: string
  caption: string
}

function getApiKey() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.LLM_API_KEY ||
    ''
  ).trim()
}

function imageModelCandidates() {
  const fromEnv = (
    process.env.RENOVAITE_IMAGE_MODEL ||
    process.env.GEMINI_IMAGE_MODEL ||
    'gemini-2.5-flash-image'
  )
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const defaults = [
    'gemini-2.5-flash-image',
    'gemini-2.5-flash-image-preview',
    'gemini-3.1-flash-image',
    'gemini-2.0-flash-preview-image-generation',
  ]

  return [...new Set([...fromEnv, ...defaults])]
}

function stylePrompt(designStyle: string) {
  const style = designStyle.toLowerCase()
  if (style.includes('scandinavian')) {
    return 'Scandinavian interior style with light woods, soft neutrals, clean lines, cozy textiles, and uncluttered calm'
  }
  if (style.includes('eclectic')) {
    return 'Eclectic interior style with layered textures, mixed furniture eras, warm accents, and curated personality'
  }
  if (style.includes('contemporary')) {
    return 'Contemporary interior style with refined materials, balanced proportions, soft modern lighting, and understated luxury'
  }
  if (style.includes('modern')) {
    return 'Modern interior style with sleek furniture, minimal clutter, geometric clarity, matte finishes, and crisp lighting'
  }
  return `${designStyle} interior design style with high-end residential finish quality`
}

function roomLabel(roomType: string) {
  return roomType.replace(/[_-]/g, ' ').trim() || 'room'
}

function buildPrompt(input: GenerateDesignInput, variation: number) {
  const variationHints = [
    'Focus on a balanced everyday layout with practical furniture placement.',
    'Offer a more premium material and lighting treatment while keeping the same room footprint.',
    'Try a slightly fresher color story and decor layering while preserving architecture.',
  ]
  const hint = variationHints[variation % variationHints.length]

  return [
    `You are Renovaite, an AI interior redesign studio for BuildCivil.`,
    `Redesign the uploaded ${roomLabel(input.roomType)} photograph into a photorealistic renovated interior.`,
    `Design direction: ${stylePrompt(input.designStyle)}.`,
    hint,
    `Strict requirements:`,
    `- Preserve the room's camera angle, architecture, window locations, and overall spatial proportions.`,
    `- Do not invent a different room; transform THIS room.`,
    `- Keep people or faces out of the image.`,
    `- Output a single high-quality photorealistic interior photograph.`,
    `- No text overlays, watermarks, logos, or UI chrome.`,
  ].join('\n')
}

async function callGeminiImageModel(model: string, apiKey: string, input: GenerateDesignInput, variation: number) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: buildPrompt(input, variation) },
            {
              inline_data: {
                mime_type: input.mimeType,
                data: input.imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        temperature: 0.85,
      },
    }),
  })

  const raw = await response.text()
  let json: any = null
  try {
    json = raw ? JSON.parse(raw) : null
  } catch {
    json = null
  }

  if (!response.ok) {
    const message =
      json?.error?.message ||
      json?.message ||
      `Gemini image model "${model}" failed with status ${response.status}`
    const error = new Error(message) as Error & { status?: number }
    error.status = response.status
    throw error
  }

  const parts = json?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) {
    throw new Error('Gemini returned no image parts.')
  }

  let caption = ''
  let imageBase64 = ''
  let mimeType = 'image/png'

  for (const part of parts) {
    if (typeof part?.text === 'string' && part.text.trim()) {
      caption = part.text.trim()
    }
    const inline = part?.inlineData || part?.inline_data
    if (inline?.data) {
      imageBase64 = inline.data
      mimeType = inline.mimeType || inline.mime_type || 'image/png'
    }
  }

  if (!imageBase64) {
    throw new Error('Gemini response did not include a generated image.')
  }

  return {
    id: `${Date.now()}-${variation}`,
    mimeType,
    imageBase64,
    caption:
      caption ||
      `${roomLabel(input.roomType)} redesigned in ${input.designStyle} style — concept ${variation + 1}`,
  } satisfies GeneratedDesign
}

export function isRenovaiteAiConfigured() {
  return Boolean(getApiKey())
}

export async function generateRenovaiteDesigns(input: GenerateDesignInput): Promise<GeneratedDesign[]> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY (or GOOGLE_AI_API_KEY) for Renovaite image generation.')
  }

  const count = Math.min(3, Math.max(1, Math.round(input.numDesigns) || 1))
  const models = imageModelCandidates()
  const designs: GeneratedDesign[] = []
  let lastError: unknown

  for (let i = 0; i < count; i++) {
    let generated: GeneratedDesign | null = null

    for (const model of models) {
      try {
        generated = await callGeminiImageModel(model, apiKey, input, i)
        break
      } catch (error) {
        lastError = error
        const status = typeof error === 'object' && error && 'status' in error ? Number((error as any).status) : 0
        // Try next model on unsupported / not-found / rate-limit.
        if (status === 404 || status === 400 || status === 429) continue
        throw error
      }
    }

    if (!generated) {
      throw lastError instanceof Error ? lastError : new Error('Unable to generate Renovaite designs.')
    }

    designs.push(generated)
  }

  return designs
}
