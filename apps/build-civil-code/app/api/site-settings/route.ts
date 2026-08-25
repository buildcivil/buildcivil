import { NextResponse } from 'next/server'
import { getGlobalLayoutSettings } from '@/lib/site-settings'

export const revalidate = 300

export async function GET() {
  const settings = await getGlobalLayoutSettings()
  return NextResponse.json({ settings })
}
