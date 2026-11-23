'use client'

import { useMemo, useState } from 'react'
import Card from './Card'
import { MasterProject, sanitizeHref } from '@/lib/portfolio-types'

interface ProjectsClientProps {
  projects: MasterProject[]
  activePresetName: string
}

export default function ProjectsClient({ projects, activePresetName }: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))
    return ['All', ...unique]
  }, [projects])

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return projects
    return projects.filter((p) => p.category === selectedCategory)
  }, [projects, selectedCategory])

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-3 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Projects
        </h1>
        <p className="text-base leading-7 text-gray-500 dark:text-gray-400">
          Curated systems, research implementations, and production builds ({activePresetName}).
        </p>
        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="container py-12">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No projects selected in the active configuration.
          </p>
        ) : (
          <div className="-m-4 flex flex-wrap">
            {filtered.map((d) => (
              <Card
                key={d.id}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={sanitizeHref(d.href || d.repoUrl)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
