export type SectionKey =
  | 'hero'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'research'
  | 'education'
  | 'certifications'
  | 'services'
  | 'achievements'
  | 'about'

export const SECTION_LABELS: Record<SectionKey, { label: string; description: string }> = {
  hero: {
    label: 'Hero & Value Proposition',
    description: 'Primary headline, role positioning, summary, and CTA buttons',
  },
  projects: {
    label: 'Selected Projects',
    description: 'Ordered showcase of curated projects from Master Records',
  },
  skills: {
    label: 'Technical Capabilities',
    description: 'Emphasized skill categories and core stacks for this role',
  },
  experience: {
    label: 'Work Experience',
    description: 'Verified roles, internships, and engineering impact bullets',
  },
  research: {
    label: 'Research & Publications',
    description: 'Academic papers, case studies, and technical articles',
  },
  education: {
    label: 'Education',
    description: 'Academic degrees, institutions, and thesis highlights',
  },
  certifications: {
    label: 'Certifications',
    description: 'Verified credentials and specialized training',
  },
  services: {
    label: 'Engineering Services',
    description: 'Specialized consulting and solution offerings',
  },
  achievements: {
    label: 'Key Achievements',
    description: 'Quantifiable milestones, awards, and benchmarks',
  },
  about: {
    label: 'About & Contact CTA',
    description: 'Executive summary, availability, and direct contact actions',
  },
}

export interface NavLinkItem {
  title: string
  href: string
  visible: boolean
}

export interface MasterProject {
  id: string
  title: string
  description: string
  imgSrc: string
  href: string
  repoUrl: string
  category: string
  tags: string[]
  featured: boolean
}

export interface MasterExperience {
  id: string
  role: string
  organization: string
  location: string
  period: string
  current: boolean
  bullets: string[]
  skillsUsed: string[]
}

export interface MasterSkillCategory {
  id: string
  title: string
  domain: string
  summary: string
  skills: string[]
}

export interface MasterEducation {
  id: string
  degree: string
  institution: string
  year: string
  thesis: string
  focus: string
}

export interface MasterCertification {
  id: string
  name: string
  issuer: string
  date: string
  url: string
  category: string
}

export interface MasterResearch {
  id: string
  title: string
  venue: string
  date: string
  summary: string
  href: string
  tags: string[]
}

export interface MasterService {
  id: string
  title: string
  description: string
  deliverables: string[]
}

export interface MasterAchievement {
  id: string
  title: string
  metric: string
  context: string
  year: string
}

export interface HeroConfig {
  eyebrow: string
  headline: string
  highlightPhrase: string
  subheadline: string
  bioIntro: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  showResumeButton: boolean
  resumeButtonLabel: string
}

export interface AboutConfig {
  name: string
  occupation: string
  company: string
  location: string
  avatar: string
  summary: string
  mission: string
}

export interface SiteConfig {
  siteTitle: string
  headerTitle: string
  footerTagline: string
  contactEmail: string
  github: string
  linkedin: string
  twitter: string
  resumeUrl: string
  availabilityText: string
  navLinks: NavLinkItem[]
}

export type SectionVisibilityMap = Record<SectionKey, boolean>

export interface ProfilePreset {
  id: string
  name: string
  targetRole: string
  tagline: string
  hero: HeroConfig
  about: AboutConfig
  siteConfig: SiteConfig
  sectionOrder: SectionKey[]
  sectionVisibility: SectionVisibilityMap
  selectedProjectIds: string[]
  selectedSkillIds: string[]
  selectedExperienceIds: string[]
  selectedEducationIds: string[]
  selectedCertificationIds: string[]
  selectedResearchIds: string[]
  selectedServiceIds: string[]
  selectedAchievementIds: string[]
  updatedAtIso?: string
}

export interface LivePortfolioSnapshot {
  activePresetId: string
  activePresetName: string
  versionNumber: number
  publishedAt: string
  siteConfig: SiteConfig
  hero: HeroConfig
  about: AboutConfig
  sectionOrder: SectionKey[]
  sectionVisibility: SectionVisibilityMap
  projects: MasterProject[]
  skills: MasterSkillCategory[]
  experiences: MasterExperience[]
  education: MasterEducation[]
  certifications: MasterCertification[]
  research: MasterResearch[]
  services: MasterService[]
  achievements: MasterAchievement[]
}

export interface PublishHistoryRecord {
  id: string
  versionNumber: number
  presetId: string
  presetName: string
  note: string
  snapshot: LivePortfolioSnapshot
  publishedAtIso: string
}

export interface AppStateRecord {
  activePresetId: string
  activePresetName: string
  activeVersionNumber: number
  activeHistoryId: string
}

export const PORTFOLIO_IMAGE_LIBRARY = [
  { label: 'Profile Avatar', path: '/static/images/avatar.png' },
  { label: 'Telecom LLaMA Chatbot', path: '/static/images/chatbot.jpg' },
  { label: 'Telecom AI Research', path: '/static/images/canada/telecom-ai.jpg' },
  { label: 'PVC Smart Assistant', path: '/static/images/pvc-bot-main.jpg' },
  { label: 'PVC Screen Preview', path: '/static/images/pvc-bot-screen.jpg' },
  { label: 'Rasa Trilingual Bot', path: '/static/images/rasa-bot1.jpg' },
  { label: 'Rasa Architecture', path: '/static/images/rasa-bot.jpg' },
  { label: 'Automation System', path: '/static/images/system.jpg' },
  { label: 'Portfolio Website', path: '/static/images/website.jpg' },
  { label: 'Web Application', path: '/static/images/canada/web-app.jpg' },
]

export function sanitizeHref(url: string | undefined | null): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:')
  ) {
    return trimmed
  }
  return ''
}
