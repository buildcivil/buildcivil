'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { getPublicSiteUrl } from '@/lib/public-site-url'

export default function AdminLoginClient() {
  const searchParams = useSearchParams()
  const hasError = searchParams.get('error') === '1'
  const hasConfigError = searchParams.get('config') === '1'
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F3F5F8] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(115,165,202,0.18),transparent_42%),radial-gradient(ellipse_at_85%_85%,rgba(232,127,36,0.12),transparent_40%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10 sm:px-8">
        <div className="animate-in fade-in zoom-in-95 grid w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] duration-500 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1c2230] via-[#232a3a] to-[#2c2418] p-10 text-white lg:flex">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#E87F24]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[#73A5CA]/20 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur">
                <ShieldCheck size={13} className="text-[#F0954A]" />
                Secure admin
              </div>
              <h1 className="mt-8 max-w-md text-5xl font-black leading-[0.95] tracking-[-0.06em]">
                BuildCivil content studio
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
                Manage pages, projects, media, and leads from one clean, organized workspace.
              </p>
            </div>

            <div className="relative grid gap-3">
              {[
                'Edit homepage and section content',
                'Upload media and update project libraries',
                'Track enquiries, quotes, and subscribers',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/85 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E87F24]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-800">
                <ShieldCheck size={12} />
                Admin access
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-[-0.05em] text-slate-900">BuildCivil login</h1>
            </div>

            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Welcome back</div>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Use your admin email and password to open the dashboard.</p>

            {hasError ? (
              <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
                The email or password was not recognized. Please try again.
              </div>
            ) : null}

            {hasConfigError ? (
              <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
                Database authentication is not configured. Add the Supabase URL, service role key, and session secret in your environment.
              </div>
            ) : null}

            <form action="/api/admin/auth" method="post" className="mt-7 grid gap-4">
              <label className="block">
                <div className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Email</div>
                <input
                  name="username"
                  type="email"
                  autoComplete="email"
                  placeholder="you@buildcivil.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20"
                  required
                />
              </label>

              <label className="block">
                <div className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Password</div>
                <div className="relative">
                  <Lock size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#73A5CA] focus:ring-2 focus:ring-[#73A5CA]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#F0954A] to-[#E0711C] px-6 py-3.5 text-sm font-bold text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_24px_-6px_rgba(224,113,28,0.55)] transition-all duration-150 hover:from-[#f4a35f] hover:to-[#d6671a] active:scale-[0.99]"
              >
                Sign in to dashboard
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-500">
              <Link href={getPublicSiteUrl()} className="transition hover:text-slate-900">
                ← Return to site
              </Link>
              <span>Protected area</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
