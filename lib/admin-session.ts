const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
  process.env.SUPABASE_URL?.trim() ||
  ''

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''
const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET?.trim() ||
  (SUPABASE_SERVICE_ROLE_KEY ? `buildcivil-admin-session:${SUPABASE_SERVICE_ROLE_KEY}` : '')

export const ADMIN_SESSION_COOKIE = 'buildcivil_admin_session'

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const sessionMaxAgeSeconds = 60 * 60 * 8

export type AdminSession = {
  email: string
  role: string
}

type SignedAdminSession = AdminSession & {
  marker: 'buildcivil-admin'
  exp: number
}

export function isAdminAuthConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && ADMIN_SESSION_SECRET)
}

function bytesToBase64Url(bytes: Uint8Array) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64url')
  }

  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function base64UrlToBytes(input: string) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')

  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(padded, 'base64'))
  }

  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function encodePayload(payload: SignedAdminSession) {
  return bytesToBase64Url(encoder.encode(JSON.stringify(payload)))
}

function decodePayload(input: string): SignedAdminSession | null {
  try {
    return JSON.parse(decoder.decode(base64UrlToBytes(input))) as SignedAdminSession
  } catch {
    return null
  }
}

async function signPayload(payload: string) {
  if (!ADMIN_SESSION_SECRET) return ''

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ADMIN_SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return bytesToBase64Url(new Uint8Array(signature))
}

async function signaturesMatch(payload: string, signature: string) {
  const expected = await signPayload(payload)
  if (!expected || expected.length !== signature.length) return false

  let mismatch = 0
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected.charCodeAt(index) ^ signature.charCodeAt(index)
  }
  return mismatch === 0
}

export async function createAdminSessionValue(user: AdminSession) {
  const payload = encodePayload({
    marker: 'buildcivil-admin',
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + sessionMaxAgeSeconds,
  })
  const signature = await signPayload(payload)
  return `${payload}.${signature}`
}

export async function getAdminSessionFromCookie(value?: string | null): Promise<AdminSession | null> {
  if (!isAdminAuthConfigured() || !value) return null

  const [payloadValue, signature] = value.split('.')
  if (!payloadValue || !signature) return null

  const payload = decodePayload(payloadValue)
  if (!payload || payload.marker !== 'buildcivil-admin') return null
  if (!payload.email || !payload.role || !payload.exp) return null
  if (payload.exp <= Math.floor(Date.now() / 1000)) return null
  if (!(await signaturesMatch(payloadValue, signature))) return null

  return {
    email: payload.email,
    role: payload.role,
  }
}

export async function hasValidAdminSessionCookie(value?: string | null) {
  return Boolean(await getAdminSessionFromCookie(value))
}
