import PortfolioSections, { BlogPostSummary } from '@/components/PortfolioSections'
import { DEFAULT_LIVE_SNAPSHOT } from '@/lib/default-seed'
import { LivePortfolioSnapshot } from '@/lib/portfolio-types'

interface HomeProps {
  posts: BlogPostSummary[]
  livePortfolio?: LivePortfolioSnapshot
}

export default function Home({ posts, livePortfolio }: HomeProps) {
  const snapshot = livePortfolio || DEFAULT_LIVE_SNAPSHOT
  return <PortfolioSections snapshot={snapshot} blogPosts={posts} />
}
