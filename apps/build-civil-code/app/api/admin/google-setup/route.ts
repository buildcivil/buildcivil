import { NextResponse } from 'next/server'
import { requireAdminPermission } from '@/lib/admin-access'
import { getGoogleSetup, googleSetupDefaults, mergeGoogleSetup } from '@/lib/google-setup'
import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-admin'
import type { SiteSettingRow } from '@/lib/site-settings'

export async function GET(request: Request) {
  const access = await requireAdminPermission(request, 'seo')
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ connected: false, settings: googleSetupDefaults })
  }

  const settings = await getGoogleSetup()
  return NextResponse.json({ connected: true, settings })
}

export async function PATCH(request: Request) {
  const access = await requireAdminPermission(request, 'seo')
  if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }

  const body = (await request.json()) as { settings?: unknown }
  const settings = mergeGoogleSetup(body.settings)
  const rows = await supabaseRequest<SiteSettingRow[]>(
    '/rest/v1/site_settings?key=eq.google_setup',
    {
      method: 'PATCH',
      body: JSON.stringify({ value: settings }),
      headers: { Prefer: 'return=representation' },
    },
  )

  if (!rows.length) {
    await supabaseRequest('/rest/v1/site_settings', {
      method: 'POST',
      body: JSON.stringify({ key: 'google_setup', value: settings }),
      headers: { Prefer: 'return=minimal' },
      expectJson: false,
    })
  }

  return NextResponse.json({ ok: true, settings })
}
