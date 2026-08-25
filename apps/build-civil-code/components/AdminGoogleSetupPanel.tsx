'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { publishRefresh } from '@/lib/admin-publish'
import type { GoogleSetup } from '@/lib/google-setup'
import { readJsonResponse } from '@/lib/safe-json'

type GoogleResponse = {
  connected: boolean
  settings: GoogleSetup
  error?: string
}

const inputClass = 'w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20'
const googleSetupDefaults: GoogleSetup = {
  siteUrl: '',
  siteName: 'BuildCivil Constructions',
  gaMeasurementId: '',
  gtmId: '',
  searchConsoleVerification: '',
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{label}</span>
      {hint ? <span className="mt-1 block text-xs leading-5 text-slate-400">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

export default function AdminGoogleSetupPanel() {
  const [settings, setSettings] = useState<GoogleSetup>(googleSetupDefaults)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadSettings() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/google-setup', { cache: 'no-store' })
      const payload = await readJsonResponse<GoogleResponse>(response, { connected: false, settings: googleSetupDefaults })
      if (!response.ok) throw new Error(payload.error || 'Failed to load Google setup.')
      setSettings(payload.settings)
      setConnected(payload.connected)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Google setup.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSettings()
  }, [])

  async function saveSettings() {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/admin/google-setup', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      const payload = await readJsonResponse<{ error?: string }>(response, {})
      if (!response.ok) throw new Error(payload.error || 'Failed to save Google setup.')
      await publishRefresh(['/', '/sitemap.xml', '/robots.txt'])
      setMessage('Google setup saved and public cache refreshed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save Google setup.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">Loading Google setup...</div>
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Google setup</div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">Analytics and Search Console</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Add Google IDs and verification values here. We generate tags, sitemap, and robots automatically.
            </p>
          </div>
          <Search size={20} className="text-[#E87F24]" />
        </div>

        {error ? <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">{error}</div> : null}
        {message ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-orange-50 px-4 py-3 text-sm text-[#E87F24]">{message}</div> : null}
        {!connected ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-orange-50 px-4 py-3 text-sm text-slate-600">Live settings table is unavailable here. Saving is paused until Supabase is connected.</div> : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Website URL" hint="Use the final production URL, for example https://buildcivil.in">
            <input className={inputClass} value={settings.siteUrl} onChange={(event) => setSettings((prev) => ({ ...prev, siteUrl: event.target.value }))} placeholder="https://buildcivil.in" />
          </Field>
          <Field label="Site name">
            <input className={inputClass} value={settings.siteName} onChange={(event) => setSettings((prev) => ({ ...prev, siteName: event.target.value }))} placeholder="BuildCivil Constructions" />
          </Field>
          <Field label="Google Analytics Measurement ID" hint="Example: G-XXXXXXXXXX">
            <input className={inputClass} value={settings.gaMeasurementId} onChange={(event) => setSettings((prev) => ({ ...prev, gaMeasurementId: event.target.value.trim() }))} placeholder="G-XXXXXXXXXX" />
          </Field>
          <Field label="Google Tag Manager ID" hint="Example: GTM-XXXXXXX">
            <input className={inputClass} value={settings.gtmId} onChange={(event) => setSettings((prev) => ({ ...prev, gtmId: event.target.value.trim() }))} placeholder="GTM-XXXXXXX" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Search Console verification" hint="Paste only the content value, not the full meta tag.">
            <input className={inputClass} value={settings.searchConsoleVerification} onChange={(event) => setSettings((prev) => ({ ...prev, searchConsoleVerification: event.target.value.trim() }))} placeholder="google-site-verification value" />
          </Field>
        </div>

        <button type="button" disabled={!connected || saving} onClick={saveSettings} className="mt-5 inline-flex items-center gap-3 rounded-full bg-[#E87F24] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
          Save Google setup <ArrowRight size={15} />
        </button>
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500 shadow-sm sm:p-6">
        <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">Launch checklist</div>
        <h3 className="mt-2 text-xl font-black text-slate-900">What this controls</h3>
        <div className="mt-5 space-y-4">
          <p>Google Analytics and Tag Manager tags render only when IDs are added.</p>
          <p>Search Console verification appears as a meta tag in the page head.</p>
          <p>Sitemap and robots are generated automatically at /sitemap.xml and /robots.txt.</p>
          <p>Search Console crawl submission is still done manually after Google verifies the domain.</p>
        </div>
      </section>
    </div>
  )
}
