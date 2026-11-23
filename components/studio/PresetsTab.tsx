'use client'

import { useState } from 'react'
import { CheckCircle2, Copy, Edit3, ExternalLink, Globe, Plus, Trash2, X } from 'lucide-react'
import { AppStateRecord, ProfilePreset } from '@/lib/portfolio-types'

interface PresetsTabProps {
  presets: ProfilePreset[]
  appState: AppStateRecord | null
  editingPresetId: string
  busyPresetId: string | null
  onSelectForEdit: (presetId: string) => void
  onActivateAndPublish: (preset: ProfilePreset) => Promise<void>
  onCreatePreset: (newPreset: ProfilePreset) => Promise<void>
  onDuplicatePreset: (source: ProfilePreset) => Promise<void>
  onDeletePreset: (presetId: string) => Promise<void>
}

const ROLE_TEMPLATES = [
  'Machine Learning Engineer',
  'Software Engineer',
  'Database Specialist',
  'Data Engineer',
  'Monitoring & Reporting Specialist',
  'Information Management Specialist',
  'Systems Administrator',
]

export default function PresetsTab({
  presets,
  appState,
  editingPresetId,
  busyPresetId,
  onSelectForEdit,
  onActivateAndPublish,
  onCreatePreset,
  onDuplicatePreset,
  onDeletePreset,
}: PresetsTabProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [cloneFromId, setCloneFromId] = useState(presets[0]?.id || '')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const activePresetId = appState?.activePresetId || presets[0]?.id

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    const base = presets.find((p) => p.id === cloneFromId) || presets[0]
    if (!base) return

    const id = `preset_${newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')}_${Date.now().toString().slice(-4)}`

    const created: ProfilePreset = {
      ...structuredClone(base),
      id,
      name: newName.trim(),
      targetRole: newRole.trim() || newName.trim(),
      hero: {
        ...base.hero,
        eyebrow: newRole.trim() || newName.trim(),
      },
      about: {
        ...base.about,
        occupation: newRole.trim() || newName.trim(),
      },
    }

    await onCreatePreset(created)
    setCreateOpen(false)
    setNewName('')
    setNewRole('')
  }

  return (
    <div className="space-y-6">
      {/* Live Single-URL Status Banner */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Globally Active Public Configuration · v{appState?.activeVersionNumber || 1}
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {appState?.activePresetName || presets[0]?.name || 'Artificial Intelligence Engineer'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Every employer opening your single permanent portfolio URL sees this profile live.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold whitespace-nowrap text-gray-800 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open Live URL</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setCloneFromId(activePresetId || presets[0]?.id || '')
                setCreateOpen(true)
              }}
              className="bg-primary-600 hover:bg-primary-700 inline-flex min-h-[42px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Specialization</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create New Preset Inline Panel */}
      {createOpen && (
        <form
          onSubmit={handleCreateSubmit}
          className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Create Custom Professional Profile Preset
            </h3>
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="new-preset-name"
                className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Preset Name
              </label>
              <input
                id="new-preset-name"
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Monitoring & Reporting Specialist"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="new-preset-role"
                className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Public Role Title
              </label>
              <input
                id="new-preset-role"
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g., M&E Data & Information Specialist"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-1.5 text-xs text-gray-500 dark:text-gray-400">
              Quick role suggestions:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ROLE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl}
                  type="button"
                  onClick={() => {
                    setNewName(tpl)
                    setNewRole(tpl)
                  }}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {tpl}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center dark:border-gray-800">
            <div className="flex items-center gap-2">
              <label
                htmlFor="clone-source"
                className="text-xs font-medium whitespace-nowrap text-gray-600 dark:text-gray-400"
              >
                Copy starting layout from:
              </label>
              <select
                id="clone-source"
                value={cloneFromId}
                onChange={(e) => setCloneFromId(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="min-h-[40px] rounded-xl border border-gray-300 px-4 text-xs font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 min-h-[40px] rounded-xl px-4 text-xs font-semibold text-white"
              >
                Create & Open Editor
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Presets Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {presets.map((preset) => {
          const isLive = preset.id === activePresetId
          const isEditing = preset.id === editingPresetId
          const isBusy = busyPresetId === preset.id
          const visibleSectionsCount = Object.values(preset.sectionVisibility).filter(
            Boolean
          ).length

          return (
            <div
              key={preset.id}
              className={`flex flex-col justify-between rounded-2xl border bg-white p-5 transition-colors dark:bg-gray-900 ${
                isLive
                  ? 'border-emerald-500/70 dark:border-emerald-500/60'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Active Live on Site
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Saved Preset</span>
                      )}
                      {isEditing && (
                        <span className="text-primary-600 dark:text-primary-400">
                          · Editing in Studio
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                      {preset.name}
                    </h3>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {preset.targetRole}
                    </p>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                  {preset.hero.headline}
                </p>

                <p className="mt-3 text-xs text-gray-500 tabular-nums dark:text-gray-400">
                  {preset.selectedProjectIds.length} projects · {preset.selectedSkillIds.length}{' '}
                  skill groups · {preset.selectedExperienceIds.length} roles ·{' '}
                  {visibleSectionsCount} visible sections
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => onActivateAndPublish(preset)}
                  disabled={isBusy}
                  className={`flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    isLive
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  } disabled:opacity-50`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>
                    {isBusy ? 'Publishing...' : isLive ? 'Re-Publish Live' : 'Activate & Publish'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectForEdit(preset.id)}
                  className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 text-xs font-medium whitespace-nowrap text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDuplicatePreset(preset)}
                  title="Duplicate preset"
                  aria-label={`Duplicate ${preset.name}`}
                  className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>

                {!isLive && presets.length > 1 && (
                  <>
                    {confirmDeleteId === preset.id ? (
                      <button
                        type="button"
                        onClick={() => {
                          onDeletePreset(preset.id)
                          setConfirmDeleteId(null)
                        }}
                        className="min-h-[40px] rounded-xl bg-red-600 px-3 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Confirm Delete
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(preset.id)}
                        title="Delete preset"
                        aria-label={`Delete ${preset.name}`}
                        className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-red-600 hover:bg-red-50 dark:border-gray-800 dark:bg-gray-950 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
