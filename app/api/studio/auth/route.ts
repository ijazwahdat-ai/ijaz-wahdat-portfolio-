import { NextRequest, NextResponse } from 'next/server'
import {
  checkRateLimit,
  clearFailedAttempts,
  extractSessionToken,
  fetchAdminGateFromFirestore,
  getClientIdentifier,
  hashAccessCode,
  isTrustedOrigin,
  isValidAccessCode,
  recordFailedAttempt,
  signStudioSession,
  STUDIO_SESSION_COOKIE,
  verifyAccessCodeAgainstHash,
  verifyAccessCodeAgainstPlaintext,
  verifyFirebaseOwnerIdToken,
  verifyStudioSessionToken,
} from '@/lib/studio-auth'

function attachSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(STUDIO_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    partitioned: true,
    path: '/',
    maxAge: 60 * 60 * 8,
  })
}

export async function GET(req: NextRequest) {
  const token = extractSessionToken(req)
  const unlocked = verifyStudioSessionToken(token)
  const envCode = (process.env.ADMIN_ACCESS_CODE || '').trim()
  return NextResponse.json({
    unlocked,
    envCodeConfigured: envCode.length > 0,
  })
}

export async function POST(req: NextRequest) {
  if (!isTrustedOrigin(req)) {
    return NextResponse.json({ error: 'Untrusted origin.' }, { status: 403 })
  }

  let body: {
    action?: string
    code?: string
    idToken?: string
    issueSession?: boolean
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  const action = body.action || 'verify'

  if (action === 'logout') {
    const res = NextResponse.json({ unlocked: false })
    res.cookies.set(STUDIO_SESSION_COOKIE, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      partitioned: true,
      path: '/',
      maxAge: 0,
    })
    return res
  }

  const clientId = getClientIdentifier(req)
  const envCode = (process.env.ADMIN_ACCESS_CODE || '').trim()

  if (action === 'hash') {
    const code = (body.code || '').trim()
    if (!isValidAccessCode(code)) {
      return NextResponse.json(
        { error: 'Access code must be between 6 and 32 valid characters.' },
        { status: 400 }
      )
    }

    const existingToken = extractSessionToken(req)
    const hasActiveSession = verifyStudioSessionToken(existingToken)

    if (!hasActiveSession) {
      // Only allow unauthenticated one-time bootstrap if env code is unset, owner ID token is valid, and gate doesn't exist yet
      if (envCode.length > 0) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 })
      }
      const owner = await verifyFirebaseOwnerIdToken(body.idToken)
      if (!owner) {
        return NextResponse.json({ error: 'Owner verification required.' }, { status: 401 })
      }
      const gate = await fetchAdminGateFromFirestore(body.idToken!)
      if (gate !== 'NOT_FOUND') {
        return NextResponse.json(
          { error: 'Access code already configured. Please verify existing code.' },
          { status: 403 }
        )
      }
    }

    const { codeHash, salt } = hashAccessCode(code)
    const token = signStudioSession('owner')
    const shouldIssue = Boolean(body.issueSession)
    const res = NextResponse.json({
      codeHash,
      salt,
      token: shouldIssue ? token : undefined,
      unlocked: shouldIssue,
    })
    if (shouldIssue) {
      attachSessionCookie(res, token)
    }
    return res
  }

  if (action === 'verify') {
    const rate = checkRateLimit(clientId)
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${rate.retryAfterSec}s.` },
        { status: 429 }
      )
    }

    const code = (body.code || '').trim()
    if (!isValidAccessCode(code)) {
      recordFailedAttempt(clientId)
      return NextResponse.json({ error: 'Invalid access code format.' }, { status: 400 })
    }

    let valid = false

    if (envCode.length > 0) {
      valid = verifyAccessCodeAgainstPlaintext(code, envCode)
    } else {
      const owner = await verifyFirebaseOwnerIdToken(body.idToken)
      if (!owner) {
        return NextResponse.json(
          { needsOwnerLink: true, error: 'Connect owner database session to verify code.' },
          { status: 401 }
        )
      }
      const gate = await fetchAdminGateFromFirestore(body.idToken!)
      if (gate === 'NOT_FOUND') {
        return NextResponse.json(
          {
            needsSetup: true,
            error: 'No access code saved yet. Set your secret access code now.',
          },
          { status: 404 }
        )
      }
      if (!gate) {
        return NextResponse.json(
          { error: 'Could not read security vault. Please retry.' },
          { status: 500 }
        )
      }
      valid = verifyAccessCodeAgainstHash(code, gate.codeHash, gate.salt)
    }

    if (!valid) {
      recordFailedAttempt(clientId)
      return NextResponse.json({ error: 'Invalid secret access code.' }, { status: 401 })
    }

    clearFailedAttempts(clientId)
    const token = signStudioSession('owner')
    const res = NextResponse.json({ unlocked: true, token })
    attachSessionCookie(res, token)
    return res
  }

  return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 })
}
