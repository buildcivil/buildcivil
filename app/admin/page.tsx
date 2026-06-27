import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import AdminDashboardClient from '@/components/AdminDashboardClient'
import AdminLoginClient from '@/components/AdminLoginClient'
import { ADMIN_SESSION_COOKIE, hasValidAdminSessionCookie } from '@/lib/admin-session'

export const metadata: Metadata = {
  title: 'Admin Dashboard | BuildCivil Constructions',
  description: 'Manage BuildCivil projects, services, and contact inquiries from a Supabase-backed admin dashboard.',
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  if (!(await hasValidAdminSessionCookie(sessionCookie))) {
    return (
      <Suspense>
        <AdminLoginClient />
      </Suspense>
    )
  }

  return <AdminDashboardClient />
}
