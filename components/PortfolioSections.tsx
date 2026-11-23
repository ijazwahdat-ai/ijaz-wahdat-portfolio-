'use client'

import { motion } from 'motion/react'
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  Download,
  GraduationCap,
  Layers,
  Mail,
} from 'lucide-react'
import Link from './Link'
import Image from './Image'
import { LivePortfolioSnapshot, sanitizeHref, SectionKey } from '@/lib/portfolio-types'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

export interface BlogPostSummary {
  slug: string
  date: string
  title: string
  summary?: string
  tags: string[]
}

interface PortfolioSectionsProps {
  snapshot: LivePortfolioSnapshot
  blogPosts?: BlogPostSummary[]
  previewMode?: boolean
}

function renderHighlightedHeadline(headline: string, highlightPhrase: string) {
  if (!highlightPhrase || !headline.includes(highlightPhrase)) {
    return headline
  }
  const idx = headline.indexOf(highlightPhrase)
  const before = headline.slice(0, idx)
  const after = headline.slice(idx + highlightPhrase.length)
  return (
    <>
      {before}
      <span className="text-primary-500">{highlightPhrase}</span>
      {after}
    </>
  )
}

export default function PortfolioSections({
  snapshot,
  blogPosts = [],
  previewMode = false,
}: PortfolioSectionsProps) {
  const { hero, about, siteConfig, sectionOrder, sectionVisibility } = snapshot

  const renderSection = (key: SectionKey) => {
    if (!sectionVisibility[key]) return null

    switch (key) {
      case 'hero': {
        const primaryHref = sanitizeHref(hero.primaryCtaHref) || '/projects'
        const secondaryHref = sanitizeHref(hero.secondaryCtaHref) || '/about'
        const resumeHref = sanitizeHref(siteConfig.resumeUrl)

        return (
          <motion.section
            key="hero"
            initial={previewMode ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-4 pt-6 pb-10 md:space-y-6"
          >
            {hero.eyebrow && (
              <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold tracking-wide">
                {hero.eyebrow}
              </p>
            )}
            <h1 className="max-w-4xl text-3xl leading-tight font-extrabold tracking-tight text-balance text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-gray-100">
              {renderHighlightedHeadline(hero.headline, hero.highlightPhrase)}
            </h1>
            {hero.subheadline && (
              <p className="max-w-3xl text-lg leading-7 font-medium text-gray-700 dark:text-gray-200">
                {hero.subheadline}
              </p>
            )}
            {hero.bioIntro && (
              <p className="max-w-3xl text-base leading-7 text-gray-500 dark:text-gray-400">
                {hero.bioIntro}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {hero.primaryCtaLabel && (
                <Link
                  href={primaryHref}
                  className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:focus:ring-primary-900 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium whitespace-nowrap text-white transition-colors focus:ring-4"
                >
                  <span>{hero.primaryCtaLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {hero.secondaryCtaLabel && (
                <Link
                  href={secondaryHref}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium whitespace-nowrap text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  {hero.secondaryCtaLabel}
                </Link>
              )}
              {hero.showResumeButton && resumeHref && (
                <Link
                  href={resumeHref}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-medium whitespace-nowrap text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Download className="h-4 w-4" />
                  <span>{hero.resumeButtonLabel || 'Resume / CV'}</span>
                </Link>
              )}
            </div>

            {siteConfig.availabilityText && (
              <p className="pt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                {siteConfig.availabilityText}
                {about.location ? ` · ${about.location}` : ''}
              </p>
            )}
          </motion.section>
        )
      }

      case 'projects': {
        if (!snapshot.projects.length) return null
        const displayProjects = snapshot.projects.slice(0, 4)
        return (
          <section key="projects" className="py-10">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Selected Projects
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Highlighted engineering work tailored for {snapshot.activePresetName}
                </p>
              </div>
              <Link
                href="/projects"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap"
              >
                <span>All Projects</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {displayProjects.map((project) => {
                const targetHref = sanitizeHref(project.href || project.repoUrl)
                return (
                  <article
                    key={project.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700"
                  >
                    {project.imgSrc && (
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={project.imgSrc}
                          alt={project.title}
                          width={800}
                          height={450}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {project.category}
                        </p>
                        <h3 className="mt-1 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                          {targetHref ? (
                            <Link href={targetHref} className="hover:text-primary-500">
                              {project.title}
                            </Link>
                          ) : (
                            project.title
                          )}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                          {project.description}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {project.tags.slice(0, 4).join(' · ')}
                        </p>
                        {targetHref && (
                          <Link
                            href={targetHref}
                            className="text-primary-500 hover:text-primary-600 inline-flex shrink-0 items-center gap-1 text-xs font-semibold whitespace-nowrap"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )
      }

      case 'skills': {
        if (!snapshot.skills.length) return null
        return (
          <section key="skills" className="py-10">
            <div className="mb-6 flex items-center gap-2">
              <Layers className="text-primary-500 h-5 w-5" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Technical Capabilities
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {snapshot.skills.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/40"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                      {cat.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      {cat.domain}
                    </span>
                  </div>
                  {cat.summary && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{cat.summary}</p>
                  )}
                  <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {cat.skills.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )
      }

      case 'experience': {
        if (!snapshot.experiences.length) return null
        return (
          <section key="experience" className="py-10">
            <div className="mb-6 flex items-center gap-2">
              <Briefcase className="text-primary-500 h-5 w-5" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Experience
              </h2>
            </div>
            <div className="space-y-6">
              {snapshot.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/40"
                >
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {exp.organization}
                        {exp.location ? ` · ${exp.location}` : ''}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-500 tabular-nums dark:text-gray-400">
                      {exp.period}
                    </span>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {exp.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {exp.skillsUsed.length > 0 && (
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      Stack: {exp.skillsUsed.join(' · ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      }

      case 'research': {
        const items =
          snapshot.research.length > 0
            ? snapshot.research
            : blogPosts.map((p) => ({
                id: p.slug,
                title: p.title,
                venue: 'Publication',
                date: p.date,
                summary: p.summary || '',
                href: `/blog/${p.slug}`,
                tags: p.tags || [],
              }))
        if (!items.length) return null

        return (
          <section key="research" className="py-10">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="text-primary-500 h-5 w-5" />
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Research & Publications
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap"
              >
                <span>All Research</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {items.slice(0, 5).map((item) => {
                const href = sanitizeHref(item.href) || '/blog'
                return (
                  <li key={item.id} className="py-6 first:pt-2 last:pb-2">
                    <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-sm font-medium text-gray-500 tabular-nums dark:text-gray-400">
                          <time dateTime={item.date}>
                            {item.date ? formatDate(item.date, siteMetadata.locale) : ''}
                          </time>
                          {item.venue && (
                            <span className="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">
                              {item.venue}
                            </span>
                          )}
                        </dd>
                      </dl>
                      <div className="space-y-3 xl:col-span-3">
                        <div>
                          <h3 className="text-xl leading-7 font-bold tracking-tight">
                            <Link
                              href={href}
                              className="hover:text-primary-500 text-gray-900 dark:text-gray-100"
                            >
                              {item.title}
                            </Link>
                          </h3>
                          {item.tags.length > 0 && (
                            <p className="text-primary-500 mt-1 text-xs font-medium">
                              {item.tags.join(' · ')}
                            </p>
                          )}
                        </div>
                        <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                          {item.summary}
                        </p>
                        <div>
                          <Link
                            href={href}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-1 text-sm font-medium"
                          >
                            <span>Read Paper / Demo</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      }

      case 'achievements': {
        if (!snapshot.achievements.length) return null
        return (
          <section key="achievements" className="py-10">
            <div className="mb-6 flex items-center gap-2">
              <Award className="text-primary-500 h-5 w-5" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Verified Milestones
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {snapshot.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/40"
                >
                  <p className="text-primary-600 dark:text-primary-400 text-2xl font-extrabold tabular-nums">
                    {ach.metric || ach.year}
                  </p>
                  <h3 className="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">
                    {ach.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    {ach.context}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )
      }

      case 'education': {
        if (!snapshot.education.length) return null
        return (
          <section key="education" className="py-10">
            <div className="mb-6 flex items-center gap-2">
              <GraduationCap className="text-primary-500 h-5 w-5" />
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Education
              </h2>
            </div>
            <div className="space-y-4">
              {snapshot.education.map((edu) => (
                <div
                  key={edu.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/40"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {edu.degree}
                    </h3>
                    <span className="text-sm font-medium text-gray-500 tabular-nums dark:text-gray-400">
                      {edu.year}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {edu.institution}
                  </p>
                  {edu.thesis && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Thesis: {edu.thesis}
                    </p>
                  )}
                  {edu.focus && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Focus: {edu.focus}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      }

      case 'certifications': {
        if (!snapshot.certifications.length) return null
        return (
          <section key="certifications" className="py-10">
            <h2 className="mb-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Certifications
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {snapshot.certifications.map((cert) => {
                const url = sanitizeHref(cert.url)
                return (
                  <div
                    key={cert.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/40"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {cert.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {cert.issuer}
                        {cert.date ? ` · ${cert.date}` : ''}
                      </p>
                    </div>
                    {url && (
                      <Link
                        href={url}
                        aria-label={`Verify ${cert.name}`}
                        className="text-primary-500 hover:text-primary-600 shrink-0"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      }

      case 'services': {
        if (!snapshot.services.length) return null
        return (
          <section key="services" className="py-10">
            <h2 className="mb-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Capabilities & Services
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {snapshot.services.map((svc) => (
                <div
                  key={svc.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/40"
                >
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {svc.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {svc.description}
                  </p>
                  {svc.deliverables.length > 0 && (
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      {svc.deliverables.join(' · ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      }

      case 'about': {
        const emailHref = siteConfig.contactEmail ? `mailto:${siteConfig.contactEmail}` : ''
        return (
          <section key="about" className="py-10">
            <div className="flex flex-col justify-between gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-gray-900/60">
              <div className="max-w-xl space-y-2">
                <p className="text-primary-600 dark:text-primary-400 text-xs font-semibold">
                  {about.occupation} · {about.company}
                </p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {about.summary}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{about.mission}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {emailHref && (
                  <Link
                    href={emailHref}
                    className="bg-primary-600 hover:bg-primary-700 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact Me</span>
                  </Link>
                )}
                <Link
                  href="/about"
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Full Profile &rarr;
                </Link>
              </div>
            </div>
          </section>
        )
      }

      default:
        return null
    }
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
    </div>
  )
}
