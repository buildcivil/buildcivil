export async function readJsonResponse<T>(
  response: Response,
  fallback: T,
): Promise<T & { error?: string }> {
  const text = await response.text()
  if (!text) return fallback as T & { error?: string }

  try {
    return JSON.parse(text) as T & { error?: string }
  } catch {
    return {
      ...fallback,
      error: text || `Request failed with status ${response.status}.`,
    } as T & { error?: string }
  }
}
