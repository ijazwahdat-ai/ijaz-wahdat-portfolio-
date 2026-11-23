import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { extractSessionToken, isTrustedOrigin, verifyStudioSessionToken } from '@/lib/studio-auth'

export async function POST(req: NextRequest) {
  if (!isTrustedOrigin(req)) {
    return NextResponse.json({ error: 'Untrusted origin.' }, { status: 403 })
  }

  const token = extractSessionToken(req)
  if (!verifyStudioSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized studio session.' }, { status: 401 })
  }

  revalidatePath('/', 'layout')
  revalidatePath('/')
  revalidatePath('/projects')
  revalidatePath('/about')
  revalidatePath('/blog')

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  })
}
