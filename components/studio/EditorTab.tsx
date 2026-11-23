'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, Check, Eye, Globe, Save, Sparkles } from 'lucide-react'
import {
  MasterAchievement,
  MasterCertification,
  MasterEducation,
  MasterExperience,
  MasterProject,
  MasterResearch,
  MasterService,
  MasterSkillCategory,
  PORTFOLIO_IMAGE_LIBRARY,
  ProfilePreset,
  SECTION_LABELS,
  SectionKey,
} from '@/lib/portfolio-types'

interface EditorTabProps {
  preset: ProfilePreset
  presets: ProfilePreset[]
  hasUnsavedDraft: boolean
  savingDraft: boolean
  publishing: boolean
  masters: {
    projects: MasterProject[]
    skills: MasterSkillCategory[]
    experiences: MasterExperience[]
    education: MasterEducation[]
    certifications: MasterCertification[]
    research: MasterResearch[]
    services: MasterService[]
    achievements: MasterAchievement[]
  }
  onSwitchEditingPreset: (presetId: string) => void
  onChangeDraft: (updated: ProfilePreset) => void
  onSaveDraft: () => Promise<void>
  onOpenPreview: () => void
  onPublish: (note: string) => Promise<void>
}

type EditorSubTab = 'hero' | 'layout' | 'projects' | 'career' | 'chrome'

function moveItem<T>(arr: T[], index: number, delta: -1 | 1): T[] {
  const next = [...arr]
  const target = index + delta
  if (target < 0 || target >= next.length) return next
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  return next
}

export default function EditorTab({
  preset,
  presets,
  hasUnsavedDraft,
  savingDraft,
  publishing,
  masters,
  onSwitchEditingPreset,
  onChangeDraft,
  onSaveDraft,
  onOpenPreview,
  onPublish,
}: EditorTabProps) {
  const [subTab, setSubTab] = useState<EditorSubTab>('hero')
  const [publishNote, setPublishNote] = useState('')

  const toggleSelection = (
    field:
      | 'selectedProjectIds'
      | 'selectedSkillIds'
      | 'selectedExperienceIds'
      | 'selectedEducationIds'
      | 'selectedCertificationIds'
      | 'selectedResearchIds'
      | 'selectedServiceIds'
      | 'selectedAchievementIds',
    id: string
  ) => {
    const current = preset[field]
    const exists = current.includes(id)
    const next = exists ? current.filter((x) => x !== id) : [...current, id]
    onChangeDraft({ ...preset, [field]: next })
  }

  const moveSelectedId = (
    field:
      | 'selectedProjectIds'
      | 'selectedSkillIds'
      | 'selectedExperienceIds'
      | 'selectedEducationIds'
      | 'selectedCertificationIds'
      | 'selectedResearchIds'
      | 'selectedServiceIds'
      | 'selectedAchievementIds',
    id: string,
    delta: -1 | 1
  ) => {
    const idx = preset[field].indexOf(id)
    if (idx === -1) return
    onChangeDraft({ ...preset, [field]: moveItem(preset[field], idx, delta) })
  }

  const renderOrderedPicker = <T extends { id: string }>(
    title: string,
    description: string,
    items: T[],
    selectedIds: string[],
    field:
      | 'selectedProjectIds'
      | 'selectedSkillIds'
      | 'selectedExperienceIds'
      | 'selectedEducationIds'
      | 'selectedCertificationIds'
      | 'selectedResearchIds'
      | 'selectedServiceIds'
      | 'selectedAchievementIds',
    getTitle: (item: T) => string,
    getSub: (item: T) => string
  ) => {
    const map = new Map(items.map((i) => [i.id, i]))
    const selectedItems = selectedIds.map((id) => map.get(id)).filter((x): x is T => Boolean(x))
    const unselectedItems = items.filter((i) => !selectedIds.includes(i.id))

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>

        {selectedItems.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Included & Ordered ({selectedItems.length})
            </p>
            {selectedItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950"
              >
                <button
                  type="button"
                  onClick={() => toggleSelection(field, item.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="bg-primary-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {idx + 1}. {getTitle(item)}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {getSub(item)}
                    </p>
                  </div>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSelectedId(field, item.id, -1)}
                    aria-label="Move up"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-30 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === selectedItems.length - 1}
                    onClick={() => moveSelectedId(field, item.id, 1)}
                    aria-label="Move down"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-30 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {unselectedItems.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Available in Master Vault (click to include)
            </p>
            {unselectedItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleSelection(field, item.id)}
                className="flex min-h-[48px] w-full items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-3 text-left hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
              >
                <span className="h-5 w-5 shrink-0 rounded-md border border-gray-300 dark:border-gray-600" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                    {getTitle(item)}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {getSub(item)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Top Preset Selector & Draft/Publish Controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
            <label
              htmlFor="editing-preset-select"
              className="text-xs font-semibold whitespace-nowrap text-gray-600 dark:text-gray-400"
            >
              Editing Preset:
            </label>
            <select
              id="editing-preset-select"
              value={preset.id}
              onChange={(e) => onSwitchEditingPreset(e.target.value)}
              className="min-h-[42px] rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {hasUnsavedDraft && (
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Unsaved draft edits
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={savingDraft}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold whitespace-nowrap text-gray-800 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{savingDraft ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenPreview}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold whitespace-nowrap text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => onPublish(publishNote)}
              disabled={publishing}
              className="bg-primary-600 hover:bg-primary-700 inline-flex min-h-[42px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap text-white disabled:opacity-50"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{publishing ? 'Publishing...' : 'Publish Live'}</span>
            </button>
          </div>
        </div>

        {/* Sub-tab segmented bar */}
        <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto border-t border-gray-100 pt-4 dark:border-gray-800">
          {(
            [
              ['hero', 'Hero & Bio'],
              ['layout', 'Sections Order'],
              ['projects', 'Projects'],
              ['career', 'Skills & History'],
              ['chrome', 'Nav, Footer & CV'],
            ] as [EditorSubTab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSubTab(id)}
              className={`min-h-[38px] shrink-0 rounded-lg px-3.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                subTab === id
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: Hero & Identity */}
      {subTab === 'hero' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-gray-100">
              Preset Positioning & Hero Section
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="ed-preset-name"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Preset Display Name
                </label>
                <input
                  id="ed-preset-name"
                  type="text"
                  value={preset.name}
                  onChange={(e) => onChangeDraft({ ...preset, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-target-role"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Target Job Title
                </label>
                <input
                  id="ed-target-role"
                  type="text"
                  value={preset.targetRole}
                  onChange={(e) => onChangeDraft({ ...preset, targetRole: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-hero-eyebrow"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Hero Eyebrow Kicker
                </label>
                <input
                  id="ed-hero-eyebrow"
                  type="text"
                  value={preset.hero.eyebrow}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      hero: { ...preset.hero, eyebrow: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-hero-highlight"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Highlighted Phrase in Headline
                </label>
                <input
                  id="ed-hero-highlight"
                  type="text"
                  value={preset.hero.highlightPhrase}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      hero: { ...preset.hero, highlightPhrase: e.target.value },
                    })
                  }
                  placeholder="Exact phrase inside Headline to accent"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="ed-hero-headline"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Main Hero Headline
                </label>
                <input
                  id="ed-hero-headline"
                  type="text"
                  value={preset.hero.headline}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      hero: { ...preset.hero, headline: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-hero-subheadline"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Subheadline
                </label>
                <input
                  id="ed-hero-subheadline"
                  type="text"
                  value={preset.hero.subheadline}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      hero: { ...preset.hero, subheadline: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-hero-bio"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Hero Bio Introduction
                </label>
                <textarea
                  id="ed-hero-bio"
                  rows={3}
                  value={preset.hero.bioIntro}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      hero: { ...preset.hero, bioIntro: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="ed-primary-cta-label"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Primary Button Label
                </label>
                <input
                  id="ed-primary-cta-label"
                  type="text"
                  value={preset.hero.primaryCtaLabel}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      hero: { ...preset.hero, primaryCtaLabel: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-primary-cta-href"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Primary Button Target Link
                </label>
                <input
                  id="ed-primary-cta-href"
                  type="text"
                  value={preset.hero.primaryCtaHref}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      hero: { ...preset.hero, primaryCtaHref: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-secondary-cta-label"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Secondary Button Label
                </label>
                <input
                  id="ed-secondary-cta-label"
                  type="text"
                  value={preset.hero.secondaryCtaLabel}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      hero: { ...preset.hero, secondaryCtaLabel: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-secondary-cta-href"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Secondary Button Target Link
                </label>
                <input
                  id="ed-secondary-cta-href"
                  type="text"
                  value={preset.hero.secondaryCtaHref}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      hero: { ...preset.hero, secondaryCtaHref: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-gray-100">
              About Me & Professional Identity
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="ed-about-name"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>
                <input
                  id="ed-about-name"
                  type="text"
                  value={preset.about.name}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      about: { ...preset.about, name: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-about-occupation"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Role / Occupation Line
                </label>
                <input
                  id="ed-about-occupation"
                  type="text"
                  value={preset.about.occupation}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      about: { ...preset.about, occupation: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-about-company"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Affiliation / Company
                </label>
                <input
                  id="ed-about-company"
                  type="text"
                  value={preset.about.company}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      about: { ...preset.about, company: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-about-location"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Location
                </label>
                <input
                  id="ed-about-location"
                  type="text"
                  value={preset.about.location}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      about: { ...preset.about, location: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="ed-about-avatar"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Profile Photo URL (or select asset)
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id="ed-about-avatar"
                    type="text"
                    value={preset.about.avatar}
                    onChange={(e) =>
                      onChangeDraft({
                        ...preset,
                        about: { ...preset.about, avatar: e.target.value },
                      })
                    }
                    className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  />
                  <select
                    aria-label="Pick stored image"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        onChangeDraft({
                          ...preset,
                          about: { ...preset.about, avatar: e.target.value },
                        })
                      }
                    }}
                    className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-xs text-gray-800 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
                  >
                    <option value="">Pick stored image...</option>
                    {PORTFOLIO_IMAGE_LIBRARY.map((img) => (
                      <option key={img.path} value={img.path}>
                        {img.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="ed-about-summary"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Executive Bio Summary
                </label>
                <textarea
                  id="ed-about-summary"
                  rows={2}
                  value={preset.about.summary}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      about: { ...preset.about, summary: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-about-mission"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Career Mission Statement
                </label>
                <textarea
                  id="ed-about-mission"
                  rows={2}
                  value={preset.about.mission}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      about: { ...preset.about, mission: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Section Order & Visibility */}
      {subTab === 'layout' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Homepage Section Order & Visibility
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Reorder sections with the arrow controls and toggle which sections employers see on
              the landing page for this profile.
            </p>
          </div>
          <div className="space-y-2.5">
            {preset.sectionOrder.map((key: SectionKey, idx: number) => {
              const meta = SECTION_LABELS[key]
              const visible = preset.sectionVisibility[key]
              return (
                <div
                  key={key}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3.5 dark:border-gray-800 dark:bg-gray-950"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        onChangeDraft({
                          ...preset,
                          sectionVisibility: {
                            ...preset.sectionVisibility,
                            [key]: !visible,
                          },
                        })
                      }
                      aria-pressed={visible}
                      className={`min-h-[36px] min-w-[68px] shrink-0 rounded-lg px-2.5 text-xs font-semibold transition-colors ${
                        visible
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {visible ? 'Shown' : 'Hidden'}
                    </button>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {idx + 1}. {meta.label}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() =>
                        onChangeDraft({
                          ...preset,
                          sectionOrder: moveItem(preset.sectionOrder, idx, -1),
                        })
                      }
                      aria-label={`Move ${meta.label} up`}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-30 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === preset.sectionOrder.length - 1}
                      onClick={() =>
                        onChangeDraft({
                          ...preset,
                          sectionOrder: moveItem(preset.sectionOrder, idx, 1),
                        })
                      }
                      aria-label={`Move ${meta.label} down`}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-30 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Projects Curation */}
      {subTab === 'projects' &&
        renderOrderedPicker(
          'Curated Projects for this Specialization',
          'Select and prioritize Master Projects without modifying or deleting your permanent project database.',
          masters.projects,
          preset.selectedProjectIds,
          'selectedProjectIds',
          (p) => p.title,
          (p) => `${p.category} · ${p.tags.slice(0, 3).join(', ')}`
        )}

      {/* SUB-TAB 4: Skills, Experience, Education, Certifications, Research, Services, Achievements */}
      {subTab === 'career' && (
        <div className="space-y-5">
          {renderOrderedPicker(
            'Technical Skill Categories',
            'Choose which technical stacks lead for this role.',
            masters.skills,
            preset.selectedSkillIds,
            'selectedSkillIds',
            (s) => s.title,
            (s) => `${s.domain} · ${s.skills.slice(0, 4).join(', ')}`
          )}
          {renderOrderedPicker(
            'Work Experience',
            'Select verified roles and order the most relevant positions first.',
            masters.experiences,
            preset.selectedExperienceIds,
            'selectedExperienceIds',
            (e) => `${e.role} (${e.organization})`,
            (e) => e.period
          )}
          {renderOrderedPicker(
            'Research & Publications',
            'Choose papers and technical demos highlighted on this profile.',
            masters.research,
            preset.selectedResearchIds,
            'selectedResearchIds',
            (r) => r.title,
            (r) => `${r.venue || 'Article'} · ${r.date}`
          )}
          {renderOrderedPicker(
            'Education',
            'Academic degrees shown on the homepage and About page.',
            masters.education,
            preset.selectedEducationIds,
            'selectedEducationIds',
            (ed) => ed.degree,
            (ed) => `${ed.institution} (${ed.year})`
          )}
          {renderOrderedPicker(
            'Certifications',
            'Credentials prioritized for this job target.',
            masters.certifications,
            preset.selectedCertificationIds,
            'selectedCertificationIds',
            (c) => c.name,
            (c) => `${c.issuer} ${c.date ? `· ${c.date}` : ''}`
          )}
          {renderOrderedPicker(
            'Key Achievements & Metrics',
            'Quantifiable benchmarks shown when Achievements is enabled.',
            masters.achievements,
            preset.selectedAchievementIds,
            'selectedAchievementIds',
            (a) => `${a.metric ? `${a.metric} — ` : ''}${a.title}`,
            (a) => a.context
          )}
          {renderOrderedPicker(
            'Services & Consulting Offerings',
            'Engineering capabilities displayed when Services is enabled.',
            masters.services,
            preset.selectedServiceIds,
            'selectedServiceIds',
            (sv) => sv.title,
            (sv) => sv.description
          )}
        </div>
      )}

      {/* SUB-TAB 5: Navigation, Footer, Contact & Resume */}
      {subTab === 'chrome' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-gray-100">
              Contact, Social Links & Profile-Specific Resume / CV
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="ed-site-header-title"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Header Wordmark Title
                </label>
                <input
                  id="ed-site-header-title"
                  type="text"
                  value={preset.siteConfig.headerTitle}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      siteConfig: { ...preset.siteConfig, headerTitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-site-availability"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Availability Line (shown in Hero)
                </label>
                <input
                  id="ed-site-availability"
                  type="text"
                  value={preset.siteConfig.availabilityText}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      siteConfig: { ...preset.siteConfig, availabilityText: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-site-email"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Public Contact Email
                </label>
                <input
                  id="ed-site-email"
                  type="email"
                  value={preset.siteConfig.contactEmail}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      siteConfig: { ...preset.siteConfig, contactEmail: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-site-resume"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Resume / CV Link (PDF or Google Drive URL)
                </label>
                <input
                  id="ed-site-resume"
                  type="url"
                  value={preset.siteConfig.resumeUrl}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      siteConfig: { ...preset.siteConfig, resumeUrl: e.target.value },
                    })
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-site-github"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  GitHub URL
                </label>
                <input
                  id="ed-site-github"
                  type="url"
                  value={preset.siteConfig.github}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      siteConfig: { ...preset.siteConfig, github: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="ed-site-linkedin"
                  className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  LinkedIn URL
                </label>
                <input
                  id="ed-site-linkedin"
                  type="url"
                  value={preset.siteConfig.linkedin}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      siteConfig: { ...preset.siteConfig, linkedin: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
              <label className="flex min-h-[40px] cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={preset.hero.showResumeButton}
                  onChange={(e) =>
                    onChangeDraft({
                      ...preset,
                      hero: { ...preset.hero, showResumeButton: e.target.checked },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span>Show Resume download button in Hero section</span>
              </label>
              <input
                aria-label="Resume button label"
                type="text"
                value={preset.hero.resumeButtonLabel}
                onChange={(e) =>
                  onChangeDraft({
                    ...preset,
                    hero: { ...preset.hero, resumeButtonLabel: e.target.value },
                  })
                }
                placeholder="Button label"
                className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="ed-site-footer-tagline"
                className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Footer Tagline
              </label>
              <input
                id="ed-site-footer-tagline"
                type="text"
                value={preset.siteConfig.footerTagline}
                onChange={(e) =>
                  onChangeDraft({
                    ...preset,
                    siteConfig: { ...preset.siteConfig, footerTagline: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">
              Top Navigation Links
            </h3>
            <div className="space-y-2.5">
              {preset.siteConfig.navLinks.map((nav, idx) => (
                <div
                  key={`${nav.href}-${idx}`}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950"
                >
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...preset.siteConfig.navLinks]
                      next[idx] = { ...nav, visible: !nav.visible }
                      onChangeDraft({
                        ...preset,
                        siteConfig: { ...preset.siteConfig, navLinks: next },
                      })
                    }}
                    className={`min-h-[36px] rounded-lg px-2.5 text-xs font-semibold ${
                      nav.visible
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {nav.visible ? 'Shown' : 'Hidden'}
                  </button>
                  <input
                    aria-label={`Navigation link ${idx + 1} title`}
                    type="text"
                    value={nav.title}
                    onChange={(e) => {
                      const next = [...preset.siteConfig.navLinks]
                      next[idx] = { ...nav, title: e.target.value }
                      onChangeDraft({
                        ...preset,
                        siteConfig: { ...preset.siteConfig, navLinks: next },
                      })
                    }}
                    className="min-w-[120px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                  <input
                    aria-label={`Navigation link ${idx + 1} path`}
                    type="text"
                    value={nav.href}
                    onChange={(e) => {
                      const next = [...preset.siteConfig.navLinks]
                      next[idx] = { ...nav, href: e.target.value }
                      onChangeDraft({
                        ...preset,
                        siteConfig: { ...preset.siteConfig, navLinks: next },
                      })
                    }}
                    className="min-w-[120px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-mono text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1">
                <label
                  htmlFor="ed-release-note"
                  className="mb-1 flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Version Release Note (optional, saved in Publish History)</span>
                </label>
                <input
                  id="ed-release-note"
                  type="text"
                  value={publishNote}
                  onChange={(e) => setPublishNote(e.target.value)}
                  placeholder="e.g., Tailored for MCIT Data Specialist application"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </div>
              <button
                type="button"
                onClick={() => onPublish(publishNote)}
                disabled={publishing}
                className="bg-primary-600 hover:bg-primary-700 mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold whitespace-nowrap text-white sm:mt-5"
              >
                <Globe className="h-4 w-4" />
                <span>{publishing ? 'Publishing...' : 'Publish to Live URL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
