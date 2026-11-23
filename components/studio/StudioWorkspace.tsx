'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { User, signOut } from 'firebase/auth'
import { motion } from 'motion/react'
import {
  AlertCircle,
  CheckCircle2,
  Database,
  ExternalLink,
  History,
  Layers,
  Lock,
  LogOut,
  RefreshCw,
  Sliders,
} from 'lucide-react'
import { auth, testFirestoreConnection } from '@/lib/firebase-client'
import { resolveSnapshotFromPreset } from '@/lib/default-seed'
import { LivePortfolioSnapshot, ProfilePreset, PublishHistoryRecord } from '@/lib/portfolio-types'
import {
  deletePreset,
  ensureAdminSeeded,
  loadStudioBundle,
  publishPresetAtomically,
  rollbackToHistoryVersion,
  savePresetDraft,
  StudioBundle,
} from '@/lib/studio-firestore'
import PresetsTab from './PresetsTab'
import EditorTab from './EditorTab'
import MasterVaultTab from './MasterVaultTab'
import HistoryAndSecurityTab from './HistoryAndSecurityTab'
import PreviewModal from './PreviewModal'

type StudioTab = 'presets' | 'editor' | 'vault' | 'history'

interface StudioWorkspaceProps {
  user: User
  bearerToken: string | null
  onLockStudio: () => void
}

export default function StudioWorkspace({ user, bearerToken, onLockStudio }: StudioWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>('presets')
  const [bundle, setBundle] = useState<StudioBundle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const [editingPresetId, setEditingPresetId] = useState<string>('')
  const [draftPreset, setDraftPreset] = useState<ProfilePreset | null>(null)
  const [hasUnsavedDraft, setHasUnsavedDraft] = useState(false)

  const [savingDraft, setSavingDraft] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [busyPresetId, setBusyPresetId] = useState<string | null>(null)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [historyPreviewSnapshot, setHistoryPreviewSnapshot] =
    useState<LivePortfolioSnapshot | null>(null)

  const notify = useCallback((message: string) => {
    setToast(message)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  const triggerServerRevalidate = useCallback(async () => {
    try {
      await fetch('/api/studio/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        },
      })
    } catch {
      // Public pages use force-dynamic; revalidation failure does not block Firestore publish
    }
  }, [bearerToken])

  const fetchBundle = useCallback(async (keepEditingId?: string) => {
    setError('')
    try {
      await testFirestoreConnection()
      await ensureAdminSeeded()
      const data = await loadStudioBundle()
      setBundle(data)

      const preferredId =
        keepEditingId || data.appState?.activePresetId || data.presets[0]?.id || ''
      const chosen = data.presets.find((p) => p.id === preferredId) || data.presets[0] || null
      if (chosen) {
        setEditingPresetId(chosen.id)
        setDraftPreset(structuredClone(chosen))
        setHasUnsavedDraft(false)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load Portfolio Studio from Firestore.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBundle()
  }, [fetchBundle])

  const mastersObject = useMemo(
    () => ({
      projects: bundle?.projects || [],
      skills: bundle?.skills || [],
      experiences: bundle?.experiences || [],
      education: bundle?.education || [],
      certifications: bundle?.certifications || [],
      research: bundle?.research || [],
      services: bundle?.services || [],
      achievements: bundle?.achievements || [],
    }),
    [bundle]
  )

  const draftPreviewSnapshot = useMemo(() => {
    if (!draftPreset) return null
    const nextVersion = (bundle?.appState?.activeVersionNumber || 1) + 1
    return resolveSnapshotFromPreset(
      draftPreset,
      mastersObject,
      nextVersion,
      new Date().toISOString()
    )
  }, [draftPreset, mastersObject, bundle?.appState?.activeVersionNumber])

  const handleSwitchEditingPreset = (presetId: string) => {
    if (!bundle) return
    const found = bundle.presets.find((p) => p.id === presetId)
    if (!found) return
    setEditingPresetId(found.id)
    setDraftPreset(structuredClone(found))
    setHasUnsavedDraft(false)
  }

  const handleSelectForEdit = (presetId: string) => {
    handleSwitchEditingPreset(presetId)
    setActiveTab('editor')
  }

  const handleSaveDraft = async () => {
    if (!draftPreset) return
    setSavingDraft(true)
    try {
      await savePresetDraft(draftPreset, false)
      await fetchBundle(draftPreset.id)
      notify(`Draft saved for "${draftPreset.name}" without altering public site.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft.')
    } finally {
      setSavingDraft(false)
    }
  }

  const handlePublishDraft = async (note: string) => {
    if (!draftPreset || !bundle) return
    setPublishing(true)
    try {
      const currentVer = bundle.appState?.activeVersionNumber || 1
      const result = await publishPresetAtomically(
        draftPreset,
        mastersObject,
        currentVer,
        note || `Published ${draftPreset.name}`
      )
      await triggerServerRevalidate()
      await fetchBundle(draftPreset.id)
      setPreviewOpen(false)
      notify(`Live site updated to "${draftPreset.name}" (v${result.versionNumber}).`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish changes.')
    } finally {
      setPublishing(false)
    }
  }

  const handleActivateAndPublish = async (preset: ProfilePreset) => {
    if (!bundle) return
    setBusyPresetId(preset.id)
    try {
      const targetPreset =
        draftPreset && draftPreset.id === preset.id && hasUnsavedDraft ? draftPreset : preset
      const currentVer = bundle.appState?.activeVersionNumber || 1
      const result = await publishPresetAtomically(
        targetPreset,
        mastersObject,
        currentVer,
        `Activated profile: ${targetPreset.name}`
      )
      await triggerServerRevalidate()
      await fetchBundle(targetPreset.id)
      notify(`Public URL now displays "${targetPreset.name}" (v${result.versionNumber}).`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate preset.')
    } finally {
      setBusyPresetId(null)
    }
  }

  const handleCreatePreset = async (newPreset: ProfilePreset) => {
    setSavingDraft(true)
    try {
      const saved = await savePresetDraft(newPreset, true)
      await fetchBundle(saved.id)
      setActiveTab('editor')
      notify(`Created preset "${saved.name}". Edit and publish when ready.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create preset.')
    } finally {
      setSavingDraft(false)
    }
  }

  const handleDuplicatePreset = async (source: ProfilePreset) => {
    const duplicate: ProfilePreset = {
      ...structuredClone(source),
      id: `preset_${source.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')}_copy_${Date.now().toString().slice(-4)}`,
      name: `${source.name} (Copy)`,
    }
    await handleCreatePreset(duplicate)
  }

  const handleDeletePreset = async (presetId: string) => {
    if (!bundle) return
    if (bundle.appState?.activePresetId === presetId) {
      setError('Cannot delete the currently active live preset.')
      return
    }
    try {
      await deletePreset(presetId)
      await fetchBundle()
      notify('Profile preset deleted.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete preset.')
    }
  }

  const handleRollback = async (record: PublishHistoryRecord) => {
    if (!bundle) return
    try {
      const currentVer = bundle.appState?.activeVersionNumber || 1
      const result = await rollbackToHistoryVersion(record, currentVer)
      await triggerServerRevalidate()
      await fetchBundle(record.presetId)
      notify(
        `Restored "${record.presetName}" (from v${record.versionNumber}) as v${result.versionNumber}.`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rollback failed.')
    }
  }

  const handleLock = async () => {
    try {
      await fetch('/api/studio/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      })
    } catch {
      // Ignore network errors when clearing session
    }
    onLockStudio()
  }

  const handleSignOut = async () => {
    await handleLock()
    await signOut(auth)
  }

  const navItems: { id: StudioTab; label: string; shortLabel: string; icon: typeof Layers }[] = [
    { id: 'presets', label: 'Profile Presets', shortLabel: 'Presets', icon: Layers },
    { id: 'editor', label: 'Page & Section Editor', shortLabel: 'Editor', icon: Sliders },
    { id: 'vault', label: 'Master Career Vault', shortLabel: 'Master', icon: Database },
    { id: 'history', label: 'History & Security', shortLabel: 'History', icon: History },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="text-center">
          <div className="border-primary-600 mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">
            Loading Portfolio Studio & Master Records...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Compact Mobile Top Header (<= 56px) */}
      <header className="sticky top-0 z-40 flex h-13 items-center justify-between border-b border-gray-200 bg-white/95 px-3 backdrop-blur-sm lg:hidden dark:border-gray-800 dark:bg-gray-900/95">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
            Portfolio Studio
          </p>
          <p className="truncate text-[11px] text-emerald-600 dark:text-emerald-400">
            Live: {bundle?.appState?.activePresetName || 'Active'}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open live site"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={handleLock}
            aria-label="Lock studio"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
          >
            <Lock className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Desktop Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-gray-200 bg-white p-5 lg:flex dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Single-Link Control
              </p>
              <h1 className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                Portfolio Studio
              </h1>
              <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>

            <nav aria-label="Studio navigation" className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm font-medium transition-colors ${
                      active
                        ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-800">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Public Portfolio</span>
            </a>
            <button
              type="button"
              onClick={handleLock}
              className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Lock & Exit to Site</span>
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl px-3 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out Google</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace Canvas */}
        <main className="min-w-0 flex-1 px-4 pt-5 pb-24 sm:px-6 lg:px-8 lg:py-8">
          {toast && (
            <div
              role="status"
              className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{toast}</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => fetchBundle(editingPresetId)}
                className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-red-300 bg-white px-2.5 font-semibold text-red-700 dark:border-red-800 dark:bg-gray-900 dark:text-red-300"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {bundle && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'presets' && (
                <PresetsTab
                  presets={bundle.presets}
                  appState={bundle.appState}
                  editingPresetId={editingPresetId}
                  busyPresetId={busyPresetId}
                  onSelectForEdit={handleSelectForEdit}
                  onActivateAndPublish={handleActivateAndPublish}
                  onCreatePreset={handleCreatePreset}
                  onDuplicatePreset={handleDuplicatePreset}
                  onDeletePreset={handleDeletePreset}
                />
              )}

              {activeTab === 'editor' && draftPreset && (
                <EditorTab
                  preset={draftPreset}
                  presets={bundle.presets}
                  hasUnsavedDraft={hasUnsavedDraft}
                  savingDraft={savingDraft}
                  publishing={publishing}
                  masters={mastersObject}
                  onSwitchEditingPreset={handleSwitchEditingPreset}
                  onChangeDraft={(updated) => {
                    setDraftPreset(updated)
                    setHasUnsavedDraft(true)
                  }}
                  onSaveDraft={handleSaveDraft}
                  onOpenPreview={() => {
                    setHistoryPreviewSnapshot(null)
                    setPreviewOpen(true)
                  }}
                  onPublish={handlePublishDraft}
                />
              )}

              {activeTab === 'vault' && (
                <MasterVaultTab
                  masters={mastersObject}
                  onReload={() => fetchBundle(editingPresetId)}
                  onNotify={notify}
                />
              )}

              {activeTab === 'history' && (
                <HistoryAndSecurityTab
                  history={bundle.history}
                  activeVersionNumber={bundle.appState?.activeVersionNumber || 1}
                  bearerToken={bearerToken}
                  onRollback={handleRollback}
                  onInspectSnapshot={(snap) => {
                    setHistoryPreviewSnapshot(snap)
                    setPreviewOpen(true)
                  }}
                  onNotify={notify}
                />
              )}
            </motion.div>
          )}
        </main>
      </div>

      {/* Compact Mobile Bottom Tab Bar (<= 60px) */}
      <nav
        aria-label="Mobile studio tabs"
        className="fixed inset-x-0 bottom-0 z-40 grid h-14 grid-cols-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm lg:hidden dark:border-gray-800 dark:bg-gray-900/95"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
                active
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.shortLabel}</span>
            </button>
          )
        })}
      </nav>

      {/* Draft or Historical Snapshot Preview Modal */}
      {(historyPreviewSnapshot || draftPreviewSnapshot) && (
        <PreviewModal
          open={previewOpen}
          onClose={() => {
            setPreviewOpen(false)
            setHistoryPreviewSnapshot(null)
          }}
          snapshot={(historyPreviewSnapshot || draftPreviewSnapshot)!}
          onPublishFromPreview={
            historyPreviewSnapshot
              ? undefined
              : () => handlePublishDraft(`Published from preview: ${draftPreset?.name || ''}`)
          }
          publishing={publishing}
        />
      )}
    </div>
  )
}
