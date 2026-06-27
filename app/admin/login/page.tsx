import type { Metadata } from 'next'
import { Suspense } from 'react'
import AdminLoginClient from '@/components/AdminLoginClient'

export const metadata: Metadata = {
  title: 'Admin Login | BuildCivil Constructions',
  description: 'Secure login for the BuildCivil admin dashboard.',
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginClient />
    </Suspense>
  )
}
