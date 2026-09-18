import { readJsonResponse } from '@buildcivil/cms/safe-json'

export async function publishRefresh(paths?: string[]) {
  const response = await fetch('/api/admin/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths }),
  })

  const payload = await readJsonResponse<{ error?: string }>(response, {})
  if (!response.ok) throw new Error(payload.error || 'Publish refresh failed.')
}
