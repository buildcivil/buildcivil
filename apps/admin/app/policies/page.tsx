import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import AdminLoginClient from '@/components/AdminLoginClient'
import AdminPolicyPagesPanel from '@/components/AdminPolicyPagesPanel'
import { ADMIN_SESSION_COOKIE, hasValidAdminSessionCookie } from '@/lib/admin-session'

export const metadata: Metadata = {
  title: 'Policy Pages | BuildCivil Admin',
  description: 'Create, edit, publish, and manage BuildCivil policy pages.',
}

export default async function AdminPoliciesPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  if (!(await hasValidAdminSessionCookie(sessionCookie))) {
    return (
      <Suspense>
        <AdminLoginClient />
      </Suspense>
    )
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] px-4 py-6 text-[#F5F3EB] sm:px-6 lg:px-10">
      <section className="mx-auto max-w-[1500px] rounded-[34px] border border-white/12 bg-[radial-gradient(circle_at_top_left,rgba(216,255,106,0.10),transparent_34%),#111] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:p-6 lg:p-8">
        <div className="rounded-[28px] border border-white/12 bg-[#151515] p-5 sm:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-[#D8FF6A]">BuildCivil Admin</div>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">Policy Pages</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                Manage privacy, terms, cookie, and other policy pages. Published pages can be shown in the header or footer and will be included in the sitemap.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex w-fit items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#D8FF6A]/35 hover:text-[#D8FF6A]"
            >
              Back to dashboard
            </Link>
          </div>
        </div>

        <AdminPolicyPagesPanel />
      </section>
    </main>
  )
}
