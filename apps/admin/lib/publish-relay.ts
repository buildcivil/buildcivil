// Server-only: relays a publish/revalidate request to the public site's own
// deployment, since admin and the public site are now separate Vercel
// projects and revalidatePath() only ever affects the process it runs in.
export async function relayRevalidate(paths: string[]) {
  const siteUrl = process.env.PUBLIC_SITE_URL || 'https://buildcivil.in'

  const response = await fetch(`${siteUrl.replace(/\/$/, '')}/api/revalidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REVALIDATE_SECRET ?? ''}`,
    },
    body: JSON.stringify({ paths }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to relay revalidate to public site (${response.status}).`)
  }

  return response.json() as Promise<{ ok: boolean; paths: string[] }>
}
