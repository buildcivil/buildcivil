'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export default function AdminLoginClient() {
  const searchParams = useSearchParams()
  const hasError = searchParams.get('error') === '1'
  const hasConfigError = searchParams.get('config') === '1'

  return (
    <main className="min-h-screen bg-[#FEFDDF] text-[#1c1712]">
      <section className="relative overflow-hidden px-5 py-10 sm:px-6 sm:py-14">
        <div className="absolute inset-0 bg-[#FEFDDF]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(115,165,202,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(232,127,36,0.12),transparent_30%)]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[980px] items-center justify-center">
          <div className="grid w-full gap-6 rounded-[34px] border border-[#73A5CA]/14 bg-white/86 p-6 shadow-[0_24px_80px_rgba(28,23,18,0.08)] backdrop-blur-sm md:grid-cols-[0.95fr_1.05fr] md:p-8">
            <div className="flex flex-col justify-between gap-6 rounded-[28px] bg-[#73A5CA] p-6 text-[#FEFDDF] shadow-[0_24px_50px_rgba(115,165,202,0.22)] md:p-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#FEFDDF]/90">
                  <ShieldCheck size={12} className="text-[#FFC81E]" />
                  Admin access
                </div>
                <h1 className="mt-6 text-[clamp(2.2rem,4.2vw,4.8rem)] font-black leading-[0.95] tracking-[-0.06em]">
                  BuildCivil dashboard login
                </h1>
                <p className="mt-4 max-w-md text-sm leading-7 text-[#FEFDDF]/86 sm:text-base">
                  Sign in to manage projects, services, and incoming enquiries from one secure place.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/14 bg-white/10 p-5 backdrop-blur-md">
                <div className="text-[11px] uppercase tracking-[0.28em] text-[#FEFDDF]/72">Protected area</div>
                <p className="mt-3 text-sm leading-6 text-[#FEFDDF]/84">
                  Access is restricted to the BuildCivil admin team only.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-[28px] border border-[#73A5CA]/12 bg-[#FEFDDF]/92 p-6 md:p-8">
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#5d8fb2]">Secure sign in</div>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[#1c1712]">Welcome back</h2>
              <p className="mt-3 text-sm leading-7 text-[#6e6256]">
                Enter your admin credentials to continue to the dashboard.
              </p>

              {hasError ? (
                <div className="mt-5 rounded-[20px] border border-[#E87F24]/25 bg-[#fff6e9] px-4 py-3 text-sm text-[#8c4f12]">
                  The username or password was not recognized. Please try again.
                </div>
              ) : null}

              {hasConfigError ? (
                <div className="mt-5 rounded-[20px] border border-[#E87F24]/25 bg-[#fff6e9] px-4 py-3 text-sm text-[#8c4f12]">
                  Database authentication is not configured. Add the Supabase URL, service role key, and session secret in Vercel. Admin email and password are read from the database.
                </div>
              ) : null}

              <form action="/api/admin/auth" method="post" className="mt-6 grid gap-4">
                <label className="block">
                  <div className="mb-2 text-xs uppercase tracking-[0.24em] text-[#5d8fb2]">Email</div>
                  <input
                    name="username"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter email"
                    className="w-full rounded-[18px] border border-[#73A5CA]/16 bg-white px-4 py-3 text-sm text-[#1c1712] outline-none transition focus:border-[#E87F24]/40"
                    required
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs uppercase tracking-[0.24em] text-[#5d8fb2]">Password</div>
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter password"
                    className="w-full rounded-[18px] border border-[#73A5CA]/16 bg-white px-4 py-3 text-sm text-[#1c1712] outline-none transition focus:border-[#E87F24]/40"
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#E87F24] via-[#FFC81E] to-[#f2dc73] px-6 py-3.5 text-sm font-semibold text-[#1c1712] shadow-[0_16px_30px_rgba(232,127,36,0.18)]"
                >
                  Sign in
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-5 flex items-center justify-between gap-4 text-sm text-[#6e6256]">
                <Link href="/" className="animated-underline">
                  Return to site
                </Link>
                <span>BuildCivil admin</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
