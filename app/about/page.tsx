import { Authors, allAuthors } from 'contentlayer/generated'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { getLivePortfolioSnapshot } from '@/lib/portfolio-server'
import Link from '@/components/Link'
import { sanitizeHref } from '@/lib/portfolio-types'
import { Download } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const metadata = genPageMetadata({ title: 'About' })

export default async function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const baseAuthor = coreContent(author)
  const live = await getLivePortfolioSnapshot()

  const mergedAuthor = {
    ...baseAuthor,
    name: live.about.name || baseAuthor.name,
    avatar: live.about.avatar || baseAuthor.avatar,
    occupation: live.about.occupation || baseAuthor.occupation,
    company: live.about.company || baseAuthor.company,
    email: live.siteConfig.contactEmail || baseAuthor.email,
    linkedin: live.siteConfig.linkedin ?? baseAuthor.linkedin,
    github: live.siteConfig.github ?? baseAuthor.github,
    twitter: live.siteConfig.twitter ?? baseAuthor.twitter,
  }

  const resumeHref = sanitizeHref(live.siteConfig.resumeUrl)

  return (
    <AuthorLayout content={mergedAuthor}>
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
            {live.about.summary}
          </p>
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {live.about.mission}
          </p>
          {resumeHref && (
            <div className="not-prose pt-2">
              <Link
                href={resumeHref}
                className="bg-primary-600 hover:bg-primary-700 inline-flex min-h-[42px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white no-underline transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>{live.hero.resumeButtonLabel || 'Download Resume / CV'}</span>
              </Link>
            </div>
          )}
        </div>

        {live.skills.length > 0 && (
          <div>
            <h2>Technical Competencies</h2>
            <div className="space-y-5">
              {live.skills.map((cat) => (
                <div key={cat.id}>
                  <h3>{cat.title}</h3>
                  {cat.summary && <p className="text-sm opacity-80">{cat.summary}</p>}
                  <ul>
                    {cat.skills.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {live.experiences.length > 0 && (
          <div>
            <h2>Work Experience</h2>
            <div className="space-y-6">
              {live.experiences.map((exp) => (
                <div key={exp.id}>
                  <h3>
                    {exp.role} — {exp.organization}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {exp.period}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </p>
                  {exp.bullets.length > 0 && (
                    <ul>
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {live.education.length > 0 && (
          <div>
            <h2>Education</h2>
            {live.education.map((edu) => (
              <div key={edu.id}>
                <h3>{edu.degree}</h3>
                <p>
                  <strong>{edu.institution}</strong> ({edu.year})
                </p>
                <ul>
                  {edu.thesis && (
                    <li>
                      <strong>Thesis:</strong> {edu.thesis}
                    </li>
                  )}
                  {edu.focus && (
                    <li>
                      <strong>Focus:</strong> {edu.focus}
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}

        {live.certifications.length > 0 && (
          <div>
            <h2>Certifications</h2>
            <ul>
              {live.certifications.map((cert) => {
                const url = sanitizeHref(cert.url)
                return (
                  <li key={cert.id}>
                    <strong>{cert.name}</strong> – {cert.issuer}
                    {cert.date ? ` (${cert.date})` : ''}
                    {url && (
                      <>
                        {' '}
                        <Link href={url}>Verify</Link>
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </AuthorLayout>
  )
}
