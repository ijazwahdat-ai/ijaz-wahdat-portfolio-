'use client'

import { useState } from 'react'
import { Eye, EyeOff, KeyRound, RotateCcw, Shield, History } from 'lucide-react'
import { LivePortfolioSnapshot, PublishHistoryRecord } from '@/lib/portfolio-types'
import { saveAdminGateHash } from '@/lib/studio-firestore'

interface HistoryAndSecurityTabProps {
  history: PublishHistoryRecord[]
  activeVersionNumber: number
  bearerToken: string | null
  onRollback: (record: PublishHistoryRecord) => Promise<void>
  onInspectSnapshot: (snapshot: LivePortfolioSnapshot) => void
  onNotify: (msg: string) => void
}

export default function HistoryAndSecurityTab({
  history,
  activeVersionNumber,
  bearerToken,
  onRollback,
  onInspectSnapshot,
  onNotify,
}: HistoryAndSecurityTabProps) {
  const [newCode, setNewCode] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [updatingCode, setUpdatingCode] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [rollingBackId, setRollingBackId] = useState<string | null>(null)

  const handleUpdateCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setCodeError('')
    const c1 = newCode.trim()
    const c2 = confirmCode.trim()
    if (!/^[a-zA-Z0-9!@#$%^&*._-]{6,32}$/.test(c1)) {
      setCodeError('New access code must be between 6 and 32 valid characters.')
      return
    }
    if (c1 !== c2) {
      setCodeError('Access codes do not match.')
      return
    }

    setUpdatingCode(true)
    try {
      const res = await fetch('/api/studio/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        },
        body: JSON.stringify({ action: 'hash', code: c1 }),
      })
      const data = await res.json()
      if (!res.ok || !data.codeHash || !data.salt) {
        setCodeError(data.error || 'Failed to hash access code.')
        return
      }
      await saveAdminGateHash(data.codeHash, data.salt)
      setNewCode('')
      setConfirmCode('')
      onNotify('Secret access code updated and salted on the server.')
    } catch {
      setCodeError('Failed to save updated code.')
    } finally {
      setUpdatingCode(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Publish & Activation History */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <History className="text-primary-500 h-5 w-5" />
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Publish & Profile Activation History
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Every live publish creates an immutable snapshot. Restore any previous configuration
              in one click.
            </p>
          </div>
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No publish versions recorded yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {history.map((item) => {
              const isCurrent = item.versionNumber === activeVersionNumber
              const formattedDate = item.publishedAtIso
                ? new Date(item.publishedAtIso).toLocaleString()
                : 'Just now'

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-gray-950"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-gray-900 tabular-nums dark:text-gray-100">
                        v{item.versionNumber}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {item.presetName}
                      </span>
                      {isCurrent && (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          · Currently Live
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {item.note || 'Profile activated'} — {formattedDate}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onInspectSnapshot(item.snapshot)}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>
                    {!isCurrent && (
                      <button
                        type="button"
                        disabled={rollingBackId === item.id}
                        onClick={async () => {
                          setRollingBackId(item.id)
                          try {
                            await onRollback(item)
                          } finally {
                            setRollingBackId(null)
                          }
                        }}
                        className="bg-primary-600 hover:bg-primary-700 inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>{rollingBackId === item.id ? 'Restoring...' : 'Restore Live'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Security & Hidden Access Guide */}
      <div className="grid gap-5 md:grid-cols-2">
        <form
          onSubmit={handleUpdateCode}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-3 flex items-center gap-2">
            <KeyRound className="text-primary-500 h-5 w-5" />
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Update Secret Access Code
            </h3>
          </div>
          <p className="mb-4 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Your passcode is salted and hashed on the server with scrypt. If{' '}
            <code className="font-mono">ADMIN_ACCESS_CODE</code> is set in Vercel environment
            variables, that server secret takes priority.
          </p>

          <div className="space-y-3">
            <div className="relative">
              <input
                type={showCode ? 'text' : 'password'}
                maxLength={32}
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="New secret code (6–32 chars)"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 pr-10 font-mono text-sm tracking-widest dark:border-gray-700 dark:bg-gray-950"
              />
              <button
                type="button"
                onClick={() => setShowCode((s) => !s)}
                aria-label="Toggle visibility"
                className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 text-gray-500"
              >
                {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <input
              type={showCode ? 'text' : 'password'}
              maxLength={32}
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              placeholder="Confirm secret code"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 font-mono text-sm tracking-widest dark:border-gray-700 dark:bg-gray-950"
            />
            {codeError && <p className="text-xs text-red-600 dark:text-red-400">{codeError}</p>}
            <button
              type="submit"
              disabled={updatingCode || newCode.trim().length < 6}
              className="min-h-[42px] w-full rounded-xl bg-gray-900 px-4 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              {updatingCode ? 'Updating Vault...' : 'Save New Secret Access Code'}
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <Shield className="text-primary-500 h-5 w-5" />
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Single Private Entry Method
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs leading-5 text-gray-600 dark:text-gray-300">
            <li>
              <strong>1. Only One Hidden Trigger:</strong> Tap/click the copyright year{' '}
              <span className="font-mono">© 2026</span> in your site footer <strong>5 times</strong>{' '}
              or hold it down continuously for <strong>10 seconds</strong> (mouse or touch).
            </li>
            <li>
              <strong>2. Zero Exposed Admin URLs:</strong> Both{' '}
              <span className="font-mono">/admin</span> and{' '}
              <span className="font-mono">/studio</span> return{' '}
              <span className="font-mono">404</span>, and admin components are never downloaded by
              public visitors.
            </li>
            <li>
              <strong>3. Server-Side Secret Verification:</strong> Set{' '}
              <span className="font-mono">ADMIN_ACCESS_CODE</span> in Vercel Environment Variables
              so the passcode never leaves the server.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
