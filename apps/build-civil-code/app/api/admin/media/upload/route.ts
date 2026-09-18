import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { requireAdminPermission } from '@/lib/admin-access'
import { getSupabaseBaseUrl, isSupabaseConfigured, supabaseRequest } from '@buildcivil/cms/supabase-admin'

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''
const hasVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())
const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/quicktime',
])
const maxImageBytes = 10 * 1024 * 1024
const maxVideoBytes = 50 * 1024 * 1024

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-')
}

function safeFolder(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9/_-]+/g, '-').replace(/\/+/g, '/').replace(/^-+|-+$/g, '')
  return normalized || 'general'
}

export async function POST(request: Request) {
  const access = await requireAdminPermission(request, 'media')
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const altText = String(formData.get('alt_text') ?? '').trim()
  const folder = safeFolder(String(formData.get('folder') ?? 'general').trim() || 'general')
  const providerPreference = String(formData.get('provider_preference') ?? '').trim().toLowerCase()
  const useVercelBlob = hasVercelBlob && providerPreference !== 'supabase'

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Please choose a file to upload.' }, { status: 400 })
  }

  const mimeType = file.type || ''
  if (!allowedMimeTypes.has(mimeType)) {
    return NextResponse.json({ error: 'Unsupported file type. Please upload JPG, PNG, WebP, GIF, SVG, MP4, WebM, or MOV.' }, { status: 400 })
  }

  const isImage = mimeType.startsWith('image/')
  const maxBytes = isImage ? maxImageBytes : maxVideoBytes
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: isImage
          ? 'Image is too large. Please upload an image up to 10MB.'
          : 'Video is too large. Please upload a video up to 50MB.',
      },
      { status: 400 },
    )
  }

  if (isImage && !altText) {
    return NextResponse.json({ error: 'Alt text is required for image uploads.' }, { status: 400 })
  }

  const fileName = `${folder}/${Date.now()}-${safeName(file.name)}`
  let fileUrl = ''
  let provider = 'supabase'
  let storageKey = fileName

  if (useVercelBlob) {
    const blob = await put(`site-media/${fileName}`, file, {
      access: 'public',
      addRandomSuffix: false,
    })
    fileUrl = blob.url
    provider = 'vercel_blob'
    storageKey = blob.pathname
  } else {
    const uploadResponse = await fetch(`${getSupabaseBaseUrl()}/storage/v1/object/site-media/${fileName}`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': mimeType || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: await file.arrayBuffer(),
    })

    if (!uploadResponse.ok) {
      const text = await uploadResponse.text()
      return NextResponse.json({ error: text || 'Upload failed.' }, { status: uploadResponse.status })
    }

    fileUrl = `${getSupabaseBaseUrl()}/storage/v1/object/public/site-media/${fileName}`
  }

  const rows = await supabaseRequest('/rest/v1/media_assets', {
    method: 'POST',
    body: JSON.stringify({
      file_name: file.name,
      file_url: fileUrl,
      file_type: mimeType || '',
      mime_type: mimeType || '',
      file_size: file.size,
      provider,
      storage_key: storageKey,
      alt_text: altText,
      folder,
      uploaded_by: access.session.email,
    }),
    headers: { Prefer: 'return=representation' },
  })

  return NextResponse.json({ ok: true, provider, rows })
}
