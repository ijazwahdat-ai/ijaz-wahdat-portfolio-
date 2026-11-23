'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Eye, EyeOff, KeyRound, Lock, ShieldCheck, X } from 'lucide-react'
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth'
import { ADMIN_OWNER_EMAIL, auth, googleProvider } from '@/lib/firebase-client'
import { saveAdminGateHash } from '@/lib/studio-firestore'

interface SecretGateModalProps {
  open: boolean
  onClose: () => void
  onUnlocked: (user: User, bearerToken: string) => void
}

type GateMode = 'verify' | 'link_owner' | 'setup'

export default function SecretGateModal({ open, onClose, onUnlocked }: SecretGateModalProps) {
  const [code, setCode] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [mode, setMode] = useState<GateMode>('verify')
  const [pendingToken, setPendingToken] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!open) return
    setError('')
    setCode('')
    setConfirmCode('')
    setPendingToken(null)
    setMode('verify')
  }, [open])

  if (!open) return null

  const getOwnerIdToken = async (targetUser: User | null): Promise<string | undefined> => {
    if (!targetUser || targetUser.email !== ADMIN_OWNER_EMAIL || !targetUser.emailVerified) {
      return undefined
    }
    return targetUser.getIdToken()
  }

  const verifyWithServer = async (enteredCode: string, activeUser: User | null) => {
    const idToken = await getOwnerIdToken(activeUser)
    const res = await fetch('/api/studio/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify',
        code: enteredCode,
        idToken,
      }),
    })
    const data = await res.json()

    if (res.ok && data.unlocked && data.token) {
      if (activeUser && activeUser.email === ADMIN_OWNER_EMAIL && activeUser.emailVerified) {
        onUnlocked(activeUser, data.token)
        return
      }
      setPendingToken(data.token)
      setMode('link_owner')
      return
    }

    if (data.needsOwnerLink) {
      setMode('link_owner')
      setError('')
      return
    }

    if (data.needsSetup) {
      setMode('setup')
      setError('')
      return
    }

    setError(data.error || 'Access denied.')
  }

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmed = code.trim()
    if (trimmed.length < 6 || trimmed.length > 32) {
      setError('Enter your valid secret access code.')
      return
    }

    setLoading(true)
    try {
      await verifyWithServer(trimmed, user)
    } catch {
      setError('Verification failed. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLinkOwnerSession = async () => {
    setError('')
    setLoading(true)
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      if (cred.user.email !== ADMIN_OWNER_EMAIL || !cred.user.emailVerified) {
        await signOut(auth)
        setError('Unauthorized account. Only the portfolio owner database session is allowed.')
        setLoading(false)
        return
      }

      if (pendingToken) {
        onUnlocked(cred.user, pendingToken)
        return
      }

      // Now that Firebase owner session is linked, re-verify the entered code against Firestore vault
      await verifyWithServer(code.trim(), cred.user)
    } catch {
      setError('Popup was closed or blocked. Please allow the sign-in window and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFirstCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const c1 = code.trim()
    const c2 = confirmCode.trim()
    if (!/^[a-zA-Z0-9!@#$%^&*._-]{6,32}$/.test(c1)) {
      setError('Access code must be 6 to 32 characters (letters, digits, or symbols).')
      return
    }
    if (c1 !== c2) {
      setError('Access code entries do not match.')
      return
    }

    setLoading(true)
    try {
      const currentUser = user || auth.currentUser
      const idToken = await getOwnerIdToken(currentUser)
      if (!currentUser || !idToken) {
        setMode('link_owner')
        setLoading(false)
        return
      }

      const res = await fetch('/api/studio/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'hash',
          code: c1,
          idToken,
          issueSession: true,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.codeHash || !data.salt || !data.token) {
        setError(data.error || 'Could not initialize secret access code.')
        setLoading(false)
        return
      }

      await saveAdminGateHash(data.codeHash, data.salt)
      onUnlocked(currentUser, data.token)
    } catch {
      setError('Failed to save secret code. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-gray-950/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-gate-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="studio-gate-title"
                className="text-base font-semibold text-gray-900 dark:text-gray-100"
              >
                {mode === 'setup'
                  ? 'Initialize Secret Code'
                  : mode === 'link_owner'
                    ? 'Database Sync Required'
                    : 'Private Access Gate'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mode === 'setup'
                  ? 'Set your private access code'
                  : mode === 'link_owner'
                    ? 'One-time browser authorization for Firestore'
                    : 'Enter your secret access code'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close access gate"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {mode === 'verify' && (
          <form onSubmit={handleSubmitCode} className="space-y-4">
            <div>
              <label
                htmlFor="secret-access-code"
                className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Secret Access Code
              </label>
              <div className="relative">
                <input
                  id="secret-access-code"
                  type={showCode ? 'text' : 'password'}
                  maxLength={32}
                  autoComplete="off"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="••••••••••"
                  className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-11 text-center font-mono text-lg tracking-[0.25em] text-gray-900 focus:bg-white focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:bg-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowCode((s) => !s)}
                  aria-label={showCode ? 'Hide code' : 'Show code'}
                  className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || code.trim().length < 6}
              className="bg-primary-600 hover:bg-primary-700 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{loading ? 'Verifying...' : 'Unlock Admin Panel'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {mode === 'link_owner' && (
          <div className="space-y-4">
            <p className="text-xs leading-5 text-gray-600 dark:text-gray-300">
              {pendingToken
                ? 'Code verified. Connect your owner cloud session once on this browser so changes save securely to Firestore.'
                : 'Connect your owner cloud session once on this browser to verify against your encrypted security vault.'}
            </p>
            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handleLinkOwnerSession}
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{loading ? 'Connecting...' : 'Connect Owner Cloud Session'}</span>
            </button>
          </div>
        )}

        {mode === 'setup' && (
          <form onSubmit={handleCreateFirstCode} className="space-y-4">
            <p className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs leading-5 text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
              No secret code is stored yet. Confirm your new secret access code (6–32 characters) to
              encrypt it on the server.
            </p>
            <div>
              <label
                htmlFor="setup-access-code"
                className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Secret Access Code
              </label>
              <input
                id="setup-access-code"
                type={showCode ? 'text' : 'password'}
                maxLength={32}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="focus:border-primary-500 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-center font-mono text-base tracking-[0.2em] text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="setup-confirm-code"
                className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Secret Access Code
              </label>
              <input
                id="setup-confirm-code"
                type={showCode ? 'text' : 'password'}
                maxLength={32}
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                placeholder="Re-enter your code"
                className="focus:border-primary-500 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-center font-mono text-base tracking-[0.2em] text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </div>
            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || code.trim().length < 6}
              className="bg-primary-600 hover:bg-primary-700 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              <span>{loading ? 'Securing...' : 'Save Code & Enter Panel'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
