import NavbarClient from '@/components/NavbarClient'
import { getGlobalLayoutSettings } from '@buildcivil/cms/site-settings'

export default async function Navbar() {
  const settings = await getGlobalLayoutSettings()
  return <NavbarClient settings={settings.header} />
}
