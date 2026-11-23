import ProjectsClient from '@/components/ProjectsClient'
import { getLivePortfolioSnapshot } from '@/lib/portfolio-server'
import { genPageMetadata } from 'app/seo'

export const dynamic = 'force-dynamic'
export const metadata = genPageMetadata({ title: 'Projects' })

export default async function Projects() {
  const livePortfolio = await getLivePortfolioSnapshot()
  return (
    <ProjectsClient
      projects={livePortfolio.projects}
      activePresetName={livePortfolio.activePresetName}
    />
  )
}
