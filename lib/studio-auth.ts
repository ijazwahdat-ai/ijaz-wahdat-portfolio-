import crypto from 'node:crypto'
import { NextRequest } from 'next/server'
import firebaseConfig from '../firebase-applet-config.json'

const ADMIN_OWNER_EMAIL = 'ijazulhaqfazli2020@gmail.com'

const globalForStudio = globalThis as unknown as {
  __studioSessionSecret?: string
  __studioRateLimits?: Map<string, { count: number; resetAt: number }>
}

function getSessionSecret(): string {
  if (process.env.STUDIO_SESSION_SECRET && process.env.STUDIO_SESSION_SECRET.length >= 16) {
    return process.env.STUDIO_SESSION_SECRET
  }
  if (!globalForStudio.__studioSessionSecret) {
    globalForStudio.__studioSessionSecret = crypto.randomBytes(32).toString('hex')
  }
  return globalForStudio.__studioSessionSecret
}

function getRateMap(): Map<string, { count: number; resetAt: number }> {
  if (!globalForStudio.__studioRateLimits) {
    globalForStudio.__studioRateLimits = new Map()
  }
  return globalForStudio.__studioRateLimits
}

export const STUDIO_SESSION_COOKIE = 'iw_studio_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 8 // 8 hours
const RATE_WINDOW_MS = 1000 * 60 * 15 // 15 minutes
const MAX_ATTEMPTS = 6

export function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') || 'local-client'
}

export function checkRateLimit(clientId: string): { allowed: boolean; retryAfterSec: number } {
  const map = getRateMap()
  const now = Date.now()
  const entry = map.get(clientId)
  if (!entry || now > entry.resetAt) {
    return { allowed: true, retryAfterSec: 0 }
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    }
  }
  return { allowed: true, retryAfterSec: 0 }
}

export function recordFailedAttempt(clientId: string): void {
  const map = getRateMap()
  const now = Date.now()
  const entry = map.get(clientId)
  if (!entry || now > entry.resetAt) {
    map.set(clientId, { count: 1, resetAt: now + RATE_WINDOW_MS })
  } else {
    entry.count += 1
    map.set(clientId, entry)
  }
}

export function clearFailedAttempts(clientId: string): void {
  getRateMap().delete(clientId)
}

export function hashAccessCode(code: string): { codeHash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex')
  const derived = crypto.scryptSync(code, salt, 64).toString('hex')
  return { codeHash: derived, salt }
}

export function verifyAccessCodeAgainstHash(
  code: string,
  storedHash: string,
  salt: string
): boolean {
  try {
    const derived = crypto.scryptSync(code, salt, 64)
    const target = Buffer.from(storedHash, 'hex')
    if (derived.length !== target.length) return false
    return crypto.timingSafeEqual(derived, target)
  } catch {
    return false
  }
}

export function verifyAccessCodeAgainstPlaintext(input: string, expected: string): boolean {
  const a = crypto.createHash('sha256').update(input).digest()
  const b = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}

export function signStudioSession(subject: string): string {
  const exp = Date.now() + SESSION_TTL_MS
  const nonce = crypto.randomBytes(8).toString('hex')
  const payload = Buffer.from(JSON.stringify({ sub: subject, exp, nonce })).toString('base64url')
  const sig = crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyStudioSessionToken(token: string | undefined | null): boolean {
  if (!token || !token.includes('.')) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const expectedSig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('base64url')
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expectedSig)
  if (sigBuf.length !== expectedBuf.length) return false
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      exp?: number
    }
    return typeof parsed.exp === 'number' && Date.now() < parsed.exp
  } catch {
    return false
  }
}

export function isTrustedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
  if (!host) return false
  try {
    const parsed = new URL(origin)
    return parsed.host === host
  } catch {
    return false
  }
}

export function extractSessionToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim()
  }
  const cookieToken = req.cookies.get(STUDIO_SESSION_COOKIE)?.value
  return cookieToken || null
}

export function isValidAccessCode(code: string): boolean {
  return typeof code === 'string' && /^[a-zA-Z0-9!@#$%^&*._-]{6,32}$/.test(code.trim())
}

export async function verifyFirebaseOwnerIdToken(
  idToken: string | undefined
): Promise<{ uid: string; email: string } | null> {
  if (!idToken || typeof idToken !== 'string' || idToken.length > 8192) {
    return null
  }
  try {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseConfig.apiKey)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      users?: Array<{ localId?: string; email?: string; emailVerified?: boolean }>
    }
    const user = data.users?.[0]
    if (!user || user.email !== ADMIN_OWNER_EMAIL || user.emailVerified !== true || !user.localId) {
      return null
    }
    return { uid: user.localId, email: user.email }
  } catch {
    return null
  }
}

export async function fetchAdminGateFromFirestore(
  idToken: string
): Promise<{ codeHash: string; salt: string } | 'NOT_FOUND' | null> {
  try {
    const projectId = encodeURIComponent(firebaseConfig.projectId)
    const dbId = encodeURIComponent(firebaseConfig.firestoreDatabaseId || '(default)')
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/admin_vault/gate`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      cache: 'no-store',
    })
    if (res.status === 404) return 'NOT_FOUND'
    if (!res.ok) return null
    const docData = (await res.json()) as {
      fields?: {
        codeHash?: { stringValue?: string }
        salt?: { stringValue?: string }
      }
    }
    const codeHash = docData.fields?.codeHash?.stringValue
    const salt = docData.fields?.salt?.stringValue
    if (!codeHash || !salt) return 'NOT_FOUND'
    return { codeHash, salt }
  } catch {
    return null
  }
}
