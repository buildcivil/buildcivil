import { NextResponse } from 'next/server'
import { requireAdminPermission } from '@/lib/admin-access'
import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-admin'
import { globalLayoutDefaults, mergeGlobalLayoutSettings } from '@/lib/site-settings-defaults'
import type { SiteSettingRow } from '@/lib/site-settings'

export async function GET(request: Request) {
  try {
    const access = await requireAdminPermission(request, 'settings')
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ connected: false, key: 'global_layout', settings: globalLayoutDefaults })
    }

    const rows = await supabaseRequest<SiteSettingRow[]>(
      '/rest/v1/site_settings?select=*&key=eq.global_layout&limit=1',
      { method: 'GET' },
    )

    return NextResponse.json({
      connected: true,
      key: 'global_layout',
      settings: mergeGlobalLayoutSettings(rows[0]?.value),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load settings.' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const access = await requireAdminPermission(request, 'settings')
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
    }

    const body = (await request.json()) as { settings?: unknown }
    const settings = mergeGlobalLayoutSettings(body.settings)

    const rows = await supabaseRequest<SiteSettingRow[]>(
      '/rest/v1/site_settings?key=eq.global_layout',
      {
        method: 'PATCH',
        body: JSON.stringify({ value: settings }),
        headers: { Prefer: 'return=representation' },
      },
    )

    if (!rows.length) {
      await supabaseRequest('/rest/v1/site_settings', {
        method: 'POST',
        body: JSON.stringify({ key: 'global_layout', value: settings }),
        headers: { Prefer: 'return=minimal' },
        expectJson: false,
      })
    }

    return NextResponse.json({ ok: true, settings })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to save settings.' },
      { status: 500 },
    )
  }
}
