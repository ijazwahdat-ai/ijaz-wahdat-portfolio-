import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { ADMIN_OWNER_EMAIL, auth, db, handleFirestoreError, OperationType } from './firebase-client'
import {
  DEFAULT_LIVE_SNAPSHOT,
  resolveSnapshotFromPreset,
  SEED_MASTER_ACHIEVEMENTS,
  SEED_MASTER_CERTIFICATIONS,
  SEED_MASTER_EDUCATION,
  SEED_MASTER_EXPERIENCES,
  SEED_MASTER_PROJECTS,
  SEED_MASTER_RESEARCH,
  SEED_MASTER_SERVICES,
  SEED_MASTER_SKILLS,
  SEED_PROFILE_PRESETS,
} from './default-seed'
import {
  AppStateRecord,
  LivePortfolioSnapshot,
  MasterAchievement,
  MasterCertification,
  MasterEducation,
  MasterExperience,
  MasterProject,
  MasterResearch,
  MasterService,
  MasterSkillCategory,
  ProfilePreset,
  PublishHistoryRecord,
} from './portfolio-types'

export interface StudioBundle {
  projects: MasterProject[]
  experiences: MasterExperience[]
  skills: MasterSkillCategory[]
  education: MasterEducation[]
  certifications: MasterCertification[]
  research: MasterResearch[]
  services: MasterService[]
  achievements: MasterAchievement[]
  presets: ProfilePreset[]
  history: PublishHistoryRecord[]
  appState: AppStateRecord | null
  liveSnapshot: LivePortfolioSnapshot | null
}

function requireAdminUid(): string {
  const user = auth.currentUser
  if (!user || user.email !== ADMIN_OWNER_EMAIL || !user.emailVerified) {
    throw new Error('Unauthorized: verified admin session required.')
  }
  return user.uid
}

function sanitizeId(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80)
  return cleaned || `item_${Date.now()}`
}

export async function ensureAdminSeeded(): Promise<void> {
  const uid = requireAdminUid()
  const user = auth.currentUser!

  // Ensure admin record exists
  try {
    const adminRef = doc(db, 'admins', uid)
    const adminSnap = await getDoc(adminRef)
    if (!adminSnap.exists()) {
      await setDoc(adminRef, {
        uid,
        email: user.email || ADMIN_OWNER_EMAIL,
        role: 'admin',
        createdAt: serverTimestamp(),
      })
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `admins/${uid}`)
  }

  // Check if presets already exist for this admin
  let hasPresets = false
  try {
    const existingPresets = await getDocs(
      query(collection(db, 'profile_presets'), where('ownerUid', '==', uid))
    )
    hasPresets = !existingPresets.empty
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'profile_presets')
  }

  if (hasPresets) return

  // Atomic seed of all Master Records + 4 Role Presets + initial Live Snapshot + v1 History
  try {
    const batch = writeBatch(db)
    const nowIso = new Date().toISOString()

    for (const p of SEED_MASTER_PROJECTS) {
      batch.set(doc(db, 'master_projects', p.id), {
        ...p,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    for (const e of SEED_MASTER_EXPERIENCES) {
      batch.set(doc(db, 'master_experiences', e.id), {
        ...e,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    for (const s of SEED_MASTER_SKILLS) {
      batch.set(doc(db, 'master_skills', s.id), {
        ...s,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    for (const ed of SEED_MASTER_EDUCATION) {
      batch.set(doc(db, 'master_education', ed.id), {
        ...ed,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    for (const c of SEED_MASTER_CERTIFICATIONS) {
      batch.set(doc(db, 'master_certifications', c.id), {
        ...c,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    for (const r of SEED_MASTER_RESEARCH) {
      batch.set(doc(db, 'master_research', r.id), {
        ...r,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    for (const sv of SEED_MASTER_SERVICES) {
      batch.set(doc(db, 'master_services', sv.id), {
        ...sv,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    for (const ach of SEED_MASTER_ACHIEVEMENTS) {
      batch.set(doc(db, 'master_achievements', ach.id), {
        ...ach,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    for (const preset of SEED_PROFILE_PRESETS) {
      batch.set(doc(db, 'profile_presets', preset.id), {
        ...preset,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    const initialLiveSnap = {
      ...DEFAULT_LIVE_SNAPSHOT,
      publishedAt: nowIso,
      updatedAt: serverTimestamp(),
    }

    const liveCheck = await getDoc(doc(db, 'public_portfolio', 'live'))
    if (!liveCheck.exists()) {
      batch.set(doc(db, 'public_portfolio', 'live'), initialLiveSnap)
    }

    const historyId = 'ver_1_initial'
    batch.set(doc(db, 'publish_history', historyId), {
      id: historyId,
      versionNumber: 1,
      presetId: SEED_PROFILE_PRESETS[0].id,
      presetName: SEED_PROFILE_PRESETS[0].name,
      note: 'Initial baseline portfolio seed',
      snapshot: { ...DEFAULT_LIVE_SNAPSHOT, publishedAt: nowIso },
      publishedByUid: uid,
      publishedAt: serverTimestamp(),
    })

    batch.set(doc(db, 'app_state', 'active_profile'), {
      activePresetId: SEED_PROFILE_PRESETS[0].id,
      activePresetName: SEED_PROFILE_PRESETS[0].name,
      activeVersionNumber: 1,
      activeHistoryId: historyId,
      updatedByUid: uid,
      updatedAt: serverTimestamp(),
    })

    await batch.commit()
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed_initial_portfolio')
  }
}

export async function loadStudioBundle(): Promise<StudioBundle> {
  const uid = requireAdminUid()

  async function fetchOwned<T>(colName: string): Promise<T[]> {
    try {
      const snap = await getDocs(query(collection(db, colName), where('ownerUid', '==', uid)))
      return snap.docs.map((d) => d.data() as T)
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colName)
    }
  }

  const [
    projects,
    experiences,
    skills,
    education,
    certifications,
    research,
    services,
    achievements,
    presets,
  ] = await Promise.all([
    fetchOwned<MasterProject>('master_projects'),
    fetchOwned<MasterExperience>('master_experiences'),
    fetchOwned<MasterSkillCategory>('master_skills'),
    fetchOwned<MasterEducation>('master_education'),
    fetchOwned<MasterCertification>('master_certifications'),
    fetchOwned<MasterResearch>('master_research'),
    fetchOwned<MasterService>('master_services'),
    fetchOwned<MasterAchievement>('master_achievements'),
    fetchOwned<ProfilePreset>('profile_presets'),
  ])

  let history: PublishHistoryRecord[] = []
  try {
    const hSnap = await getDocs(
      query(
        collection(db, 'publish_history'),
        where('publishedByUid', '==', uid),
        orderBy('versionNumber', 'desc')
      )
    )
    history = hSnap.docs.map((d) => {
      const data = d.data()
      const ts = data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : ''
      return {
        id: data.id,
        versionNumber: data.versionNumber,
        presetId: data.presetId,
        presetName: data.presetName,
        note: data.note || '',
        snapshot: data.snapshot as LivePortfolioSnapshot,
        publishedAtIso: ts || data.snapshot?.publishedAt || '',
      }
    })
  } catch (error) {
    // Fallback without orderBy if composite index isn't built yet
    try {
      const hSnap = await getDocs(
        query(collection(db, 'publish_history'), where('publishedByUid', '==', uid))
      )
      history = hSnap.docs
        .map((d) => {
          const data = d.data()
          const ts = data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : ''
          return {
            id: data.id,
            versionNumber: data.versionNumber,
            presetId: data.presetId,
            presetName: data.presetName,
            note: data.note || '',
            snapshot: data.snapshot as LivePortfolioSnapshot,
            publishedAtIso: ts || data.snapshot?.publishedAt || '',
          }
        })
        .sort((a, b) => b.versionNumber - a.versionNumber)
    } catch (innerErr) {
      handleFirestoreError(innerErr, OperationType.LIST, 'publish_history')
    }
  }

  let appState: AppStateRecord | null = null
  try {
    const stateSnap = await getDoc(doc(db, 'app_state', 'active_profile'))
    if (stateSnap.exists()) {
      appState = stateSnap.data() as AppStateRecord
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'app_state/active_profile')
  }

  let liveSnapshot: LivePortfolioSnapshot | null = null
  try {
    const liveSnap = await getDoc(doc(db, 'public_portfolio', 'live'))
    if (liveSnap.exists()) {
      liveSnapshot = liveSnap.data() as LivePortfolioSnapshot
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'public_portfolio/live')
  }

  return {
    projects,
    experiences,
    skills,
    education,
    certifications,
    research,
    services,
    achievements,
    presets,
    history,
    appState,
    liveSnapshot,
  }
}

export async function getAdminGateRecord(): Promise<{
  codeHash: string
  salt: string
} | null> {
  requireAdminUid()
  try {
    const snap = await getDoc(doc(db, 'admin_vault', 'gate'))
    if (!snap.exists()) return null
    const d = snap.data()
    return { codeHash: String(d.codeHash), salt: String(d.salt) }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'admin_vault/gate')
  }
}

export async function saveAdminGateHash(codeHash: string, salt: string): Promise<void> {
  const uid = requireAdminUid()
  try {
    await setDoc(doc(db, 'admin_vault', 'gate'), {
      codeHash,
      salt,
      updatedByUid: uid,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'admin_vault/gate')
  }
}

export async function savePresetDraft(
  preset: ProfilePreset,
  isNew = false
): Promise<ProfilePreset> {
  const uid = requireAdminUid()
  const id = isNew ? sanitizeId(preset.id || `preset_${preset.name}_${Date.now()}`) : preset.id
  const payload = {
    name: preset.name.slice(0, 160),
    targetRole: preset.targetRole.slice(0, 160),
    tagline: (preset.tagline || '').slice(0, 300),
    hero: preset.hero,
    about: preset.about,
    siteConfig: preset.siteConfig,
    sectionOrder: preset.sectionOrder,
    sectionVisibility: preset.sectionVisibility,
    selectedProjectIds: preset.selectedProjectIds,
    selectedSkillIds: preset.selectedSkillIds,
    selectedExperienceIds: preset.selectedExperienceIds,
    selectedEducationIds: preset.selectedEducationIds,
    selectedCertificationIds: preset.selectedCertificationIds,
    selectedResearchIds: preset.selectedResearchIds,
    selectedServiceIds: preset.selectedServiceIds,
    selectedAchievementIds: preset.selectedAchievementIds,
  }

  const ref = doc(db, 'profile_presets', id)
  try {
    if (isNew) {
      await setDoc(ref, {
        id,
        ...payload,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      await updateDoc(ref, {
        ...payload,
        updatedAt: serverTimestamp(),
      })
    }
    return { ...preset, id }
  } catch (error) {
    handleFirestoreError(
      error,
      isNew ? OperationType.CREATE : OperationType.UPDATE,
      `profile_presets/${id}`
    )
  }
}

export async function deletePreset(presetId: string): Promise<void> {
  requireAdminUid()
  try {
    await deleteDoc(doc(db, 'profile_presets', presetId))
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `profile_presets/${presetId}`)
  }
}

export async function publishPresetAtomically(
  preset: ProfilePreset,
  masters: {
    projects: MasterProject[]
    skills: MasterSkillCategory[]
    experiences: MasterExperience[]
    education: MasterEducation[]
    certifications: MasterCertification[]
    research: MasterResearch[]
    services: MasterService[]
    achievements: MasterAchievement[]
  },
  currentVersionNumber: number,
  note: string
): Promise<{ versionNumber: number; historyId: string; snapshot: LivePortfolioSnapshot }> {
  const uid = requireAdminUid()
  const nextVersion = Math.max(1, (currentVersionNumber || 0) + 1)
  const publishedAt = new Date().toISOString()
  const historyId = `ver_${nextVersion}_${Date.now()}`

  const snapshot = resolveSnapshotFromPreset(preset, masters, nextVersion, publishedAt)

  try {
    const batch = writeBatch(db)

    // 1. Update draft record with latest timestamp
    batch.update(doc(db, 'profile_presets', preset.id), {
      name: preset.name.slice(0, 160),
      targetRole: preset.targetRole.slice(0, 160),
      tagline: (preset.tagline || '').slice(0, 300),
      hero: preset.hero,
      about: preset.about,
      siteConfig: preset.siteConfig,
      sectionOrder: preset.sectionOrder,
      sectionVisibility: preset.sectionVisibility,
      selectedProjectIds: preset.selectedProjectIds,
      selectedSkillIds: preset.selectedSkillIds,
      selectedExperienceIds: preset.selectedExperienceIds,
      selectedEducationIds: preset.selectedEducationIds,
      selectedCertificationIds: preset.selectedCertificationIds,
      selectedResearchIds: preset.selectedResearchIds,
      selectedServiceIds: preset.selectedServiceIds,
      selectedAchievementIds: preset.selectedAchievementIds,
      updatedAt: serverTimestamp(),
    })

    // 2. Atomically replace public_portfolio/live
    batch.set(doc(db, 'public_portfolio', 'live'), {
      ...snapshot,
      updatedAt: serverTimestamp(),
    })

    // 3. Append immutable publish_history snapshot
    batch.set(doc(db, 'publish_history', historyId), {
      id: historyId,
      versionNumber: nextVersion,
      presetId: preset.id,
      presetName: preset.name.slice(0, 160),
      note: (note || `Activated ${preset.name}`).slice(0, 400),
      snapshot,
      publishedByUid: uid,
      publishedAt: serverTimestamp(),
    })

    // 4. Update global active_profile pointer
    batch.set(doc(db, 'app_state', 'active_profile'), {
      activePresetId: preset.id,
      activePresetName: preset.name.slice(0, 160),
      activeVersionNumber: nextVersion,
      activeHistoryId: historyId,
      updatedByUid: uid,
      updatedAt: serverTimestamp(),
    })

    await batch.commit()
    return { versionNumber: nextVersion, historyId, snapshot }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'publish_batch')
  }
}

export async function rollbackToHistoryVersion(
  record: PublishHistoryRecord,
  currentVersionNumber: number
): Promise<{ versionNumber: number; historyId: string; snapshot: LivePortfolioSnapshot }> {
  const uid = requireAdminUid()
  const nextVersion = Math.max(1, (currentVersionNumber || 0) + 1)
  const publishedAt = new Date().toISOString()
  const historyId = `ver_${nextVersion}_rollback_${Date.now()}`

  const restoredSnapshot: LivePortfolioSnapshot = {
    ...record.snapshot,
    versionNumber: nextVersion,
    publishedAt,
  }

  try {
    const batch = writeBatch(db)

    batch.set(doc(db, 'public_portfolio', 'live'), {
      ...restoredSnapshot,
      updatedAt: serverTimestamp(),
    })

    batch.set(doc(db, 'publish_history', historyId), {
      id: historyId,
      versionNumber: nextVersion,
      presetId: record.presetId,
      presetName: record.presetName,
      note: `Restored from v${record.versionNumber} (${record.presetName})`.slice(0, 400),
      snapshot: restoredSnapshot,
      publishedByUid: uid,
      publishedAt: serverTimestamp(),
    })

    batch.set(doc(db, 'app_state', 'active_profile'), {
      activePresetId: record.presetId,
      activePresetName: record.presetName,
      activeVersionNumber: nextVersion,
      activeHistoryId: historyId,
      updatedByUid: uid,
      updatedAt: serverTimestamp(),
    })

    await batch.commit()
    return { versionNumber: nextVersion, historyId, snapshot: restoredSnapshot }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'rollback_batch')
  }
}

// Generic typed Master Record upsert/delete helpers matching exact firestore.rules keys
export async function saveMasterProject(
  item: MasterProject,
  isNew: boolean
): Promise<MasterProject> {
  const uid = requireAdminUid()
  const id = isNew ? sanitizeId(item.id || `proj_${Date.now()}`) : item.id
  const fields = {
    title: item.title.slice(0, 200),
    description: item.description.slice(0, 4000),
    imgSrc: (item.imgSrc || '').slice(0, 500),
    href: (item.href || '').slice(0, 500),
    repoUrl: (item.repoUrl || '').slice(0, 500),
    category: (item.category || 'Engineering').slice(0, 100),
    tags: item.tags.slice(0, 20),
    featured: Boolean(item.featured),
  }
  const ref = doc(db, 'master_projects', id)
  try {
    if (isNew) {
      await setDoc(ref, {
        id,
        ...fields,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() })
    }
    return { ...item, ...fields, id }
  } catch (error) {
    handleFirestoreError(
      error,
      isNew ? OperationType.CREATE : OperationType.UPDATE,
      `master_projects/${id}`
    )
  }
}

export async function saveMasterExperience(
  item: MasterExperience,
  isNew: boolean
): Promise<MasterExperience> {
  const uid = requireAdminUid()
  const id = isNew ? sanitizeId(item.id || `exp_${Date.now()}`) : item.id
  const fields = {
    role: item.role.slice(0, 200),
    organization: item.organization.slice(0, 200),
    location: (item.location || '').slice(0, 160),
    period: item.period.slice(0, 100),
    current: Boolean(item.current),
    bullets: item.bullets.slice(0, 20),
    skillsUsed: item.skillsUsed.slice(0, 30),
  }
  const ref = doc(db, 'master_experiences', id)
  try {
    if (isNew) {
      await setDoc(ref, {
        id,
        ...fields,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() })
    }
    return { ...item, ...fields, id }
  } catch (error) {
    handleFirestoreError(
      error,
      isNew ? OperationType.CREATE : OperationType.UPDATE,
      `master_experiences/${id}`
    )
  }
}

export async function saveMasterSkill(
  item: MasterSkillCategory,
  isNew: boolean
): Promise<MasterSkillCategory> {
  const uid = requireAdminUid()
  const id = isNew ? sanitizeId(item.id || `skill_${Date.now()}`) : item.id
  const fields = {
    title: item.title.slice(0, 160),
    domain: (item.domain || 'General').slice(0, 100),
    summary: (item.summary || '').slice(0, 500),
    skills: item.skills.slice(0, 40),
  }
  const ref = doc(db, 'master_skills', id)
  try {
    if (isNew) {
      await setDoc(ref, {
        id,
        ...fields,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() })
    }
    return { ...item, ...fields, id }
  } catch (error) {
    handleFirestoreError(
      error,
      isNew ? OperationType.CREATE : OperationType.UPDATE,
      `master_skills/${id}`
    )
  }
}

export async function saveMasterEducation(
  item: MasterEducation,
  isNew: boolean
): Promise<MasterEducation> {
  const uid = requireAdminUid()
  const id = isNew ? sanitizeId(item.id || `edu_${Date.now()}`) : item.id
  const fields = {
    degree: item.degree.slice(0, 200),
    institution: item.institution.slice(0, 200),
    year: item.year.slice(0, 64),
    thesis: (item.thesis || '').slice(0, 500),
    focus: (item.focus || '').slice(0, 300),
  }
  const ref = doc(db, 'master_education', id)
  try {
    if (isNew) {
      await setDoc(ref, {
        id,
        ...fields,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() })
    }
    return { ...item, ...fields, id }
  } catch (error) {
    handleFirestoreError(
      error,
      isNew ? OperationType.CREATE : OperationType.UPDATE,
      `master_education/${id}`
    )
  }
}

export async function saveMasterCertification(
  item: MasterCertification,
  isNew: boolean
): Promise<MasterCertification> {
  const uid = requireAdminUid()
  const id = isNew ? sanitizeId(item.id || `cert_${Date.now()}`) : item.id
  const fields = {
    name: item.name.slice(0, 240),
    issuer: item.issuer.slice(0, 200),
    date: (item.date || '').slice(0, 64),
    url: (item.url || '').slice(0, 500),
    category: (item.category || '').slice(0, 100),
  }
  const ref = doc(db, 'master_certifications', id)
  try {
    if (isNew) {
      await setDoc(ref, {
        id,
        ...fields,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() })
    }
    return { ...item, ...fields, id }
  } catch (error) {
    handleFirestoreError(
      error,
      isNew ? OperationType.CREATE : OperationType.UPDATE,
      `master_certifications/${id}`
    )
  }
}

export async function saveMasterResearch(
  item: MasterResearch,
  isNew: boolean
): Promise<MasterResearch> {
  const uid = requireAdminUid()
  const id = isNew ? sanitizeId(item.id || `res_${Date.now()}`) : item.id
  const fields = {
    title: item.title.slice(0, 300),
    venue: (item.venue || '').slice(0, 200),
    date: item.date.slice(0, 64),
    summary: item.summary.slice(0, 2000),
    href: (item.href || '').slice(0, 500),
    tags: item.tags.slice(0, 20),
  }
  const ref = doc(db, 'master_research', id)
  try {
    if (isNew) {
      await setDoc(ref, {
        id,
        ...fields,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() })
    }
    return { ...item, ...fields, id }
  } catch (error) {
    handleFirestoreError(
      error,
      isNew ? OperationType.CREATE : OperationType.UPDATE,
      `master_research/${id}`
    )
  }
}

export async function saveMasterService(
  item: MasterService,
  isNew: boolean
): Promise<MasterService> {
  const uid = requireAdminUid()
  const id = isNew ? sanitizeId(item.id || `svc_${Date.now()}`) : item.id
  const fields = {
    title: item.title.slice(0, 200),
    description: item.description.slice(0, 1500),
    deliverables: item.deliverables.slice(0, 20),
  }
  const ref = doc(db, 'master_services', id)
  try {
    if (isNew) {
      await setDoc(ref, {
        id,
        ...fields,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() })
    }
    return { ...item, ...fields, id }
  } catch (error) {
    handleFirestoreError(
      error,
      isNew ? OperationType.CREATE : OperationType.UPDATE,
      `master_services/${id}`
    )
  }
}

export async function saveMasterAchievement(
  item: MasterAchievement,
  isNew: boolean
): Promise<MasterAchievement> {
  const uid = requireAdminUid()
  const id = isNew ? sanitizeId(item.id || `ach_${Date.now()}`) : item.id
  const fields = {
    title: item.title.slice(0, 200),
    metric: (item.metric || '').slice(0, 100),
    context: item.context.slice(0, 600),
    year: (item.year || '').slice(0, 32),
  }
  const ref = doc(db, 'master_achievements', id)
  try {
    if (isNew) {
      await setDoc(ref, {
        id,
        ...fields,
        ownerUid: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() })
    }
    return { ...item, ...fields, id }
  } catch (error) {
    handleFirestoreError(
      error,
      isNew ? OperationType.CREATE : OperationType.UPDATE,
      `master_achievements/${id}`
    )
  }
}

export async function deleteMasterRecord(collectionName: string, id: string): Promise<void> {
  requireAdminUid()
  try {
    await deleteDoc(doc(db, collectionName, id))
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`)
  }
}
