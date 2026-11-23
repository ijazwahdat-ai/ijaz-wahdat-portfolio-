'use client'

import { useState } from 'react'
import { Edit3, Plus, Trash2, X } from 'lucide-react'
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
} from '@/lib/portfolio-types'
import {
  deleteMasterRecord,
  saveMasterAchievement,
  saveMasterCertification,
  saveMasterEducation,
  saveMasterExperience,
  saveMasterProject,
  saveMasterResearch,
  saveMasterService,
  saveMasterSkill,
} from '@/lib/studio-firestore'

type VaultCategory =
  | 'projects'
  | 'experiences'
  | 'skills'
  | 'education'
  | 'certifications'
  | 'research'
  | 'services'
  | 'achievements'

interface MasterVaultTabProps {
  masters: {
    projects: MasterProject[]
    experiences: MasterExperience[]
    skills: MasterSkillCategory[]
    education: MasterEducation[]
    certifications: MasterCertification[]
    research: MasterResearch[]
    services: MasterService[]
    achievements: MasterAchievement[]
  }
  onReload: () => Promise<void>
  onNotify: (msg: string) => void
}

const CATEGORIES: { id: VaultCategory; label: string }[] = [
  { id: 'projects', label: 'Projects' },
  { id: 'experiences', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'research', label: 'Research' },
  { id: 'services', label: 'Services' },
  { id: 'achievements', label: 'Achievements' },
]

export default function MasterVaultTab({ masters, onReload, onNotify }: MasterVaultTabProps) {
  const [category, setCategory] = useState<VaultCategory>('projects')
  const [saving, setSaving] = useState(false)

  // Editing item state per category
  const [editProject, setEditProject] = useState<{ item: MasterProject; isNew: boolean } | null>(
    null
  )
  const [editExp, setEditExp] = useState<{ item: MasterExperience; isNew: boolean } | null>(null)
  const [editSkill, setEditSkill] = useState<{ item: MasterSkillCategory; isNew: boolean } | null>(
    null
  )
  const [editEdu, setEditEdu] = useState<{ item: MasterEducation; isNew: boolean } | null>(null)
  const [editCert, setEditCert] = useState<{ item: MasterCertification; isNew: boolean } | null>(
    null
  )
  const [editResearch, setEditResearch] = useState<{ item: MasterResearch; isNew: boolean } | null>(
    null
  )
  const [editService, setEditService] = useState<{ item: MasterService; isNew: boolean } | null>(
    null
  )
  const [editAch, setEditAch] = useState<{ item: MasterAchievement; isNew: boolean } | null>(null)

  const handleNew = () => {
    if (category === 'projects') {
      setEditProject({
        isNew: true,
        item: {
          id: `proj_${Date.now()}`,
          title: '',
          description: '',
          imgSrc: '/static/images/website.jpg',
          href: '',
          repoUrl: '',
          category: 'AI & Engineering',
          tags: [],
          featured: true,
        },
      })
    } else if (category === 'experiences') {
      setEditExp({
        isNew: true,
        item: {
          id: `exp_${Date.now()}`,
          role: '',
          organization: '',
          location: 'Kabul, Afghanistan',
          period: '2025 – Present',
          current: true,
          bullets: [],
          skillsUsed: [],
        },
      })
    } else if (category === 'skills') {
      setEditSkill({
        isNew: true,
        item: {
          id: `skill_${Date.now()}`,
          title: '',
          domain: 'Engineering',
          summary: '',
          skills: [],
        },
      })
    } else if (category === 'education') {
      setEditEdu({
        isNew: true,
        item: {
          id: `edu_${Date.now()}`,
          degree: '',
          institution: '',
          year: '2025',
          thesis: '',
          focus: '',
        },
      })
    } else if (category === 'certifications') {
      setEditCert({
        isNew: true,
        item: {
          id: `cert_${Date.now()}`,
          name: '',
          issuer: '',
          date: '2025',
          url: '',
          category: 'Technical',
        },
      })
    } else if (category === 'research') {
      setEditResearch({
        isNew: true,
        item: {
          id: `res_${Date.now()}`,
          title: '',
          venue: '',
          date: new Date().toISOString().slice(0, 10),
          summary: '',
          href: '',
          tags: [],
        },
      })
    } else if (category === 'services') {
      setEditService({
        isNew: true,
        item: {
          id: `svc_${Date.now()}`,
          title: '',
          description: '',
          deliverables: [],
        },
      })
    } else if (category === 'achievements') {
      setEditAch({
        isNew: true,
        item: {
          id: `ach_${Date.now()}`,
          title: '',
          metric: '',
          context: '',
          year: '2025',
        },
      })
    }
  }

  const handleDelete = async (collectionName: string, id: string) => {
    setSaving(true)
    try {
      await deleteMasterRecord(collectionName, id)
      await onReload()
      onNotify('Master record deleted.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Permanent Master Records Vault
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your permanent career database. Switching profile presets never deletes or alters
              these records.
            </p>
          </div>
          <button
            type="button"
            onClick={handleNew}
            className="bg-primary-600 hover:bg-primary-700 inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-semibold whitespace-nowrap text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Add Master Record</span>
          </button>
        </div>

        <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto border-t border-gray-100 pt-4 dark:border-gray-800">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`min-h-[38px] shrink-0 rounded-lg px-3.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat.id
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Forms */}
      {editProject && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setSaving(true)
            try {
              await saveMasterProject(editProject.item, editProject.isNew)
              setEditProject(null)
              await onReload()
              onNotify('Master project saved.')
            } finally {
              setSaving(false)
            }
          }}
          className="space-y-4 rounded-2xl border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {editProject.isNew ? 'Add Master Project' : 'Edit Master Project'}
            </h3>
            <button type="button" onClick={() => setEditProject(null)} className="p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Project Title"
              value={editProject.item.title}
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  item: { ...editProject.item, title: e.target.value },
                })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              required
              placeholder="Category (e.g., AI & LLM Engineering)"
              value={editProject.item.category}
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  item: { ...editProject.item, category: e.target.value },
                })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              placeholder="Demo / Live Link (/blog/... or https://...)"
              value={editProject.item.href}
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  item: { ...editProject.item, href: e.target.value },
                })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              placeholder="GitHub Repo URL"
              value={editProject.item.repoUrl}
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  item: { ...editProject.item, repoUrl: e.target.value },
                })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Image Path or URL"
              value={editProject.item.imgSrc}
              onChange={(e) =>
                setEditProject({
                  ...editProject,
                  item: { ...editProject.item, imgSrc: e.target.value },
                })
              }
              className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  setEditProject({
                    ...editProject,
                    item: { ...editProject.item, imgSrc: e.target.value },
                  })
                }
              }}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-950"
            >
              <option value="">Choose site asset...</option>
              {PORTFOLIO_IMAGE_LIBRARY.map((i) => (
                <option key={i.path} value={i.path}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>
          <textarea
            rows={3}
            required
            placeholder="Project description and technical outcomes..."
            value={editProject.item.description}
            onChange={(e) =>
              setEditProject({
                ...editProject,
                item: { ...editProject.item, description: e.target.value },
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <input
            type="text"
            placeholder="Tags (comma-separated, e.g. Python, QLoRA, Next.js)"
            value={editProject.item.tags.join(', ')}
            onChange={(e) =>
              setEditProject({
                ...editProject,
                item: {
                  ...editProject.item,
                  tags: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                },
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditProject(null)}
              className="min-h-[40px] rounded-xl border border-gray-300 px-4 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 min-h-[40px] rounded-xl px-4 text-xs font-semibold text-white"
            >
              {saving ? 'Saving...' : 'Save Master Project'}
            </button>
          </div>
        </form>
      )}

      {editExp && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setSaving(true)
            try {
              await saveMasterExperience(editExp.item, editExp.isNew)
              setEditExp(null)
              await onReload()
              onNotify('Master experience saved.')
            } finally {
              setSaving(false)
            }
          }}
          className="space-y-4 rounded-2xl border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">
              {editExp.isNew ? 'Add Experience' : 'Edit Experience'}
            </h3>
            <button type="button" onClick={() => setEditExp(null)} className="p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Role Title"
              value={editExp.item.role}
              onChange={(e) =>
                setEditExp({ ...editExp, item: { ...editExp.item, role: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              required
              placeholder="Organization"
              value={editExp.item.organization}
              onChange={(e) =>
                setEditExp({
                  ...editExp,
                  item: { ...editExp.item, organization: e.target.value },
                })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              required
              placeholder="Period (e.g. 2024 – Present)"
              value={editExp.item.period}
              onChange={(e) =>
                setEditExp({ ...editExp, item: { ...editExp.item, period: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              placeholder="Location"
              value={editExp.item.location}
              onChange={(e) =>
                setEditExp({ ...editExp, item: { ...editExp.item, location: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
          </div>
          <textarea
            rows={4}
            placeholder="Impact bullets (one per line)"
            value={editExp.item.bullets.join('\n')}
            onChange={(e) =>
              setEditExp({
                ...editExp,
                item: {
                  ...editExp.item,
                  bullets: e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                },
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <input
            type="text"
            placeholder="Skills used (comma-separated)"
            value={editExp.item.skillsUsed.join(', ')}
            onChange={(e) =>
              setEditExp({
                ...editExp,
                item: {
                  ...editExp.item,
                  skillsUsed: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                },
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditExp(null)}
              className="min-h-[40px] rounded-xl border border-gray-300 px-4 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 min-h-[40px] rounded-xl px-4 text-xs font-semibold text-white"
            >
              Save Experience
            </button>
          </div>
        </form>
      )}

      {editSkill && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setSaving(true)
            try {
              await saveMasterSkill(editSkill.item, editSkill.isNew)
              setEditSkill(null)
              await onReload()
              onNotify('Skill category saved.')
            } finally {
              setSaving(false)
            }
          }}
          className="space-y-4 rounded-2xl border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">
              {editSkill.isNew ? 'Add Skill Category' : 'Edit Skill Category'}
            </h3>
            <button type="button" onClick={() => setEditSkill(null)} className="p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Category Title"
              value={editSkill.item.title}
              onChange={(e) =>
                setEditSkill({ ...editSkill, item: { ...editSkill.item, title: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              placeholder="Domain (e.g., AI, Data, FullStack, IT)"
              value={editSkill.item.domain}
              onChange={(e) =>
                setEditSkill({ ...editSkill, item: { ...editSkill.item, domain: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
          </div>
          <input
            type="text"
            placeholder="Brief summary"
            value={editSkill.item.summary}
            onChange={(e) =>
              setEditSkill({ ...editSkill, item: { ...editSkill.item, summary: e.target.value } })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <textarea
            rows={2}
            required
            placeholder="Skills (comma-separated)"
            value={editSkill.item.skills.join(', ')}
            onChange={(e) =>
              setEditSkill({
                ...editSkill,
                item: {
                  ...editSkill.item,
                  skills: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                },
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditSkill(null)}
              className="min-h-[40px] rounded-xl border border-gray-300 px-4 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 min-h-[40px] rounded-xl px-4 text-xs font-semibold text-white"
            >
              Save Skill Category
            </button>
          </div>
        </form>
      )}

      {editEdu && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setSaving(true)
            try {
              await saveMasterEducation(editEdu.item, editEdu.isNew)
              setEditEdu(null)
              await onReload()
              onNotify('Education record saved.')
            } finally {
              setSaving(false)
            }
          }}
          className="space-y-4 rounded-2xl border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">Education Record</h3>
            <button type="button" onClick={() => setEditEdu(null)} className="p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              type="text"
              required
              placeholder="Degree"
              value={editEdu.item.degree}
              onChange={(e) =>
                setEditEdu({ ...editEdu, item: { ...editEdu.item, degree: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              required
              placeholder="Institution"
              value={editEdu.item.institution}
              onChange={(e) =>
                setEditEdu({ ...editEdu, item: { ...editEdu.item, institution: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              required
              placeholder="Year"
              value={editEdu.item.year}
              onChange={(e) =>
                setEditEdu({ ...editEdu, item: { ...editEdu.item, year: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
          </div>
          <input
            type="text"
            placeholder="Thesis"
            value={editEdu.item.thesis}
            onChange={(e) =>
              setEditEdu({ ...editEdu, item: { ...editEdu.item, thesis: e.target.value } })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <input
            type="text"
            placeholder="Focus"
            value={editEdu.item.focus}
            onChange={(e) =>
              setEditEdu({ ...editEdu, item: { ...editEdu.item, focus: e.target.value } })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditEdu(null)}
              className="min-h-[40px] rounded-xl border border-gray-300 px-4 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 min-h-[40px] rounded-xl px-4 text-xs font-semibold text-white"
            >
              Save Education
            </button>
          </div>
        </form>
      )}

      {editCert && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setSaving(true)
            try {
              await saveMasterCertification(editCert.item, editCert.isNew)
              setEditCert(null)
              await onReload()
              onNotify('Certification saved.')
            } finally {
              setSaving(false)
            }
          }}
          className="space-y-4 rounded-2xl border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">Certification</h3>
            <button type="button" onClick={() => setEditCert(null)} className="p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Certificate Name"
              value={editCert.item.name}
              onChange={(e) =>
                setEditCert({ ...editCert, item: { ...editCert.item, name: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              required
              placeholder="Issuer"
              value={editCert.item.issuer}
              onChange={(e) =>
                setEditCert({ ...editCert, item: { ...editCert.item, issuer: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              placeholder="Date / Year"
              value={editCert.item.date}
              onChange={(e) =>
                setEditCert({ ...editCert, item: { ...editCert.item, date: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="url"
              placeholder="Credential URL (optional)"
              value={editCert.item.url}
              onChange={(e) =>
                setEditCert({ ...editCert, item: { ...editCert.item, url: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditCert(null)}
              className="min-h-[40px] rounded-xl border border-gray-300 px-4 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 min-h-[40px] rounded-xl px-4 text-xs font-semibold text-white"
            >
              Save Certification
            </button>
          </div>
        </form>
      )}

      {editResearch && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setSaving(true)
            try {
              await saveMasterResearch(editResearch.item, editResearch.isNew)
              setEditResearch(null)
              await onReload()
              onNotify('Research record saved.')
            } finally {
              setSaving(false)
            }
          }}
          className="space-y-4 rounded-2xl border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">Research / Publication</h3>
            <button type="button" onClick={() => setEditResearch(null)} className="p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Title"
              value={editResearch.item.title}
              onChange={(e) =>
                setEditResearch({
                  ...editResearch,
                  item: { ...editResearch.item, title: e.target.value },
                })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              placeholder="Venue / Journal"
              value={editResearch.item.venue}
              onChange={(e) =>
                setEditResearch({
                  ...editResearch,
                  item: { ...editResearch.item, venue: e.target.value },
                })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              required
              placeholder="Date (YYYY-MM-DD)"
              value={editResearch.item.date}
              onChange={(e) =>
                setEditResearch({
                  ...editResearch,
                  item: { ...editResearch.item, date: e.target.value },
                })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              placeholder="Link (/blog/... or https://...)"
              value={editResearch.item.href}
              onChange={(e) =>
                setEditResearch({
                  ...editResearch,
                  item: { ...editResearch.item, href: e.target.value },
                })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
          </div>
          <textarea
            rows={3}
            required
            placeholder="Abstract / Summary"
            value={editResearch.item.summary}
            onChange={(e) =>
              setEditResearch({
                ...editResearch,
                item: { ...editResearch.item, summary: e.target.value },
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={editResearch.item.tags.join(', ')}
            onChange={(e) =>
              setEditResearch({
                ...editResearch,
                item: {
                  ...editResearch.item,
                  tags: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                },
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditResearch(null)}
              className="min-h-[40px] rounded-xl border border-gray-300 px-4 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 min-h-[40px] rounded-xl px-4 text-xs font-semibold text-white"
            >
              Save Research
            </button>
          </div>
        </form>
      )}

      {editService && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setSaving(true)
            try {
              await saveMasterService(editService.item, editService.isNew)
              setEditService(null)
              await onReload()
              onNotify('Service record saved.')
            } finally {
              setSaving(false)
            }
          }}
          className="space-y-4 rounded-2xl border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">Service Offering</h3>
            <button type="button" onClick={() => setEditService(null)} className="p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
          <input
            type="text"
            required
            placeholder="Service Title"
            value={editService.item.title}
            onChange={(e) =>
              setEditService({
                ...editService,
                item: { ...editService.item, title: e.target.value },
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <textarea
            rows={2}
            required
            placeholder="Description"
            value={editService.item.description}
            onChange={(e) =>
              setEditService({
                ...editService,
                item: { ...editService.item, description: e.target.value },
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <input
            type="text"
            placeholder="Deliverables (comma-separated)"
            value={editService.item.deliverables.join(', ')}
            onChange={(e) =>
              setEditService({
                ...editService,
                item: {
                  ...editService.item,
                  deliverables: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                },
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditService(null)}
              className="min-h-[40px] rounded-xl border border-gray-300 px-4 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 min-h-[40px] rounded-xl px-4 text-xs font-semibold text-white"
            >
              Save Service
            </button>
          </div>
        </form>
      )}

      {editAch && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setSaving(true)
            try {
              await saveMasterAchievement(editAch.item, editAch.isNew)
              setEditAch(null)
              await onReload()
              onNotify('Achievement record saved.')
            } finally {
              setSaving(false)
            }
          }}
          className="space-y-4 rounded-2xl border border-gray-300 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">Achievement Milestone</h3>
            <button type="button" onClick={() => setEditAch(null)} className="p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              type="text"
              required
              placeholder="Title"
              value={editAch.item.title}
              onChange={(e) =>
                setEditAch({ ...editAch, item: { ...editAch.item, title: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              placeholder="Metric (e.g., 89% Accuracy)"
              value={editAch.item.metric}
              onChange={(e) =>
                setEditAch({ ...editAch, item: { ...editAch.item, metric: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
            <input
              type="text"
              placeholder="Year"
              value={editAch.item.year}
              onChange={(e) =>
                setEditAch({ ...editAch, item: { ...editAch.item, year: e.target.value } })
              }
              className="rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
            />
          </div>
          <textarea
            rows={2}
            required
            placeholder="Context"
            value={editAch.item.context}
            onChange={(e) =>
              setEditAch({ ...editAch, item: { ...editAch.item, context: e.target.value } })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-950"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditAch(null)}
              className="min-h-[40px] rounded-xl border border-gray-300 px-4 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 min-h-[40px] rounded-xl px-4 text-xs font-semibold text-white"
            >
              Save Achievement
            </button>
          </div>
        </form>
      )}

      {/* List for Active Category */}
      <div className="space-y-3">
        {category === 'projects' &&
          masters.projects.map((p) => (
            <div
              key={p.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">{p.category}</p>
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">{p.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                  {p.description}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditProject({ item: p, isNew: false })}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete('master_projects', p.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-red-600 hover:bg-red-50 dark:border-gray-800 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

        {category === 'experiences' &&
          masters.experiences.map((e) => (
            <div
              key={e.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 tabular-nums">
                  {e.organization} · {e.period}
                </p>
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">{e.role}</h4>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditExp({ item: e, isNew: false })}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete('master_experiences', e.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-red-600 dark:border-gray-800 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

        {category === 'skills' &&
          masters.skills.map((s) => (
            <div
              key={s.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">{s.domain}</p>
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">{s.title}</h4>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {s.skills.join(' · ')}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditSkill({ item: s, isNew: false })}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete('master_skills', s.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-red-600 dark:border-gray-800 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

        {category === 'education' &&
          masters.education.map((ed) => (
            <div
              key={ed.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div>
                <p className="text-xs text-gray-500 tabular-nums">
                  {ed.institution} · {ed.year}
                </p>
                <h4 className="text-base font-bold">{ed.degree}</h4>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditEdu({ item: ed, isNew: false })}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete('master_education', ed.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-red-600 dark:border-gray-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

        {category === 'certifications' &&
          masters.certifications.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div>
                <p className="text-xs text-gray-500">
                  {c.issuer} {c.date ? `· ${c.date}` : ''}
                </p>
                <h4 className="text-base font-bold">{c.name}</h4>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditCert({ item: c, isNew: false })}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete('master_certifications', c.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-red-600 dark:border-gray-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

        {category === 'research' &&
          masters.research.map((r) => (
            <div
              key={r.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div>
                <p className="text-xs text-gray-500 tabular-nums">
                  {r.venue} · {r.date}
                </p>
                <h4 className="text-base font-bold">{r.title}</h4>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditResearch({ item: r, isNew: false })}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete('master_research', r.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-red-600 dark:border-gray-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

        {category === 'services' &&
          masters.services.map((sv) => (
            <div
              key={sv.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div>
                <h4 className="text-base font-bold">{sv.title}</h4>
                <p className="mt-1 text-xs text-gray-500">{sv.description}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditService({ item: sv, isNew: false })}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete('master_services', sv.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-red-600 dark:border-gray-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

        {category === 'achievements' &&
          masters.achievements.map((a) => (
            <div
              key={a.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div>
                <p className="text-primary-600 text-xs font-bold tabular-nums">{a.metric}</p>
                <h4 className="text-base font-bold">{a.title}</h4>
                <p className="mt-1 text-xs text-gray-500">{a.context}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditAch({ item: a, isNew: false })}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete('master_achievements', a.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-red-600 dark:border-gray-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
