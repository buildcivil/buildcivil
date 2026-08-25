import FooterClient from '@/components/FooterClient'
import { getGlobalLayoutSettings } from '@/lib/site-settings'

export default async function Footer() {
  const settings = await getGlobalLayoutSettings()
  return <FooterClient settings={settings.footer} />
}
